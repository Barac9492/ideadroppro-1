
-- Create daily_prompts table for storing daily prompts
CREATE TABLE public.daily_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_text_ko TEXT NOT NULL,
  prompt_text_en TEXT NOT NULL,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_streaks table for tracking user submission streaks
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  max_streak INTEGER NOT NULL DEFAULT 0,
  last_submission_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_badges table for storing earned badges
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_emoji TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- Enable RLS on all new tables
ALTER TABLE public.daily_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS policies for daily_prompts (public read access)
CREATE POLICY "Anyone can view daily prompts" 
  ON public.daily_prompts 
  FOR SELECT 
  USING (true);

-- RLS policies for user_streaks (users can only see their own)
CREATE POLICY "Users can view their own streaks" 
  ON public.user_streaks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
  ON public.user_streaks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks" 
  ON public.user_streaks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_badges (users can only see their own)
CREATE POLICY "Users can view their own badges" 
  ON public.user_badges 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert badges" 
  ON public.user_badges 
  FOR INSERT 
  WITH CHECK (true);

-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function to update user streaks when submitting ideas
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_date DATE;
  current_date_kst DATE;
  streak_record RECORD;
BEGIN
  -- Get current date in KST (UTC+9)
  current_date_kst := (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::DATE;
  
  -- Get or create streak record
  SELECT * INTO streak_record 
  FROM public.user_streaks 
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    -- Create new streak record
    INSERT INTO public.user_streaks (user_id, current_streak, max_streak, last_submission_date)
    VALUES (p_user_id, 1, 1, current_date_kst);
    
    -- Check if this earns a streak badge
    PERFORM public.check_and_award_streak_badge(p_user_id, 1);
  ELSE
    -- Check if submission is on consecutive day
    IF streak_record.last_submission_date = current_date_kst THEN
      -- Same day submission, no streak change
      RETURN;
    ELSIF streak_record.last_submission_date = current_date_kst - INTERVAL '1 day' THEN
      -- Consecutive day, increment streak
      UPDATE public.user_streaks 
      SET 
        current_streak = current_streak + 1,
        max_streak = GREATEST(max_streak, current_streak + 1),
        last_submission_date = current_date_kst,
        updated_at = NOW()
      WHERE user_id = p_user_id;
      
      -- Check if this earns a streak badge
      PERFORM public.check_and_award_streak_badge(p_user_id, streak_record.current_streak + 1);
    ELSE
      -- Streak broken, reset to 1
      UPDATE public.user_streaks 
      SET 
        current_streak = 1,
        last_submission_date = current_date_kst,
        updated_at = NOW()
      WHERE user_id = p_user_id;
      
      -- Check if this earns a streak badge
      PERFORM public.check_and_award_streak_badge(p_user_id, 1);
    END IF;
  END IF;
END;
$$;

-- Function to check and award streak badges
CREATE OR REPLACE FUNCTION public.check_and_award_streak_badge(p_user_id UUID, p_streak INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Award streak badges based on streak count
  IF p_streak >= 3 AND NOT EXISTS (
    SELECT 1 FROM public.user_badges 
    WHERE user_id = p_user_id AND badge_type = 'streak_3'
  ) THEN
    INSERT INTO public.user_badges (user_id, badge_type, badge_emoji)
    VALUES (p_user_id, 'streak_3', '🔥');
  END IF;
  
  IF p_streak >= 7 AND NOT EXISTS (
    SELECT 1 FROM public.user_badges 
    WHERE user_id = p_user_id AND badge_type = 'streak_7'
  ) THEN
    INSERT INTO public.user_badges (user_id, badge_type, badge_emoji)
    VALUES (p_user_id, 'streak_7', '🔥🔥');
  END IF;
  
  IF p_streak >= 30 AND NOT EXISTS (
    SELECT 1 FROM public.user_badges 
    WHERE user_id = p_user_id AND badge_type = 'streak_30'
  ) THEN
    INSERT INTO public.user_badges (user_id, badge_type, badge_emoji)
    VALUES (p_user_id, 'streak_30', '🔥🔥🔥');
  END IF;
END;
$$;

-- Insert initial daily prompt for today
INSERT INTO public.daily_prompts (prompt_text_ko, prompt_text_en, date)
VALUES (
  'AI-헬스케어: 인공지능이 의료 분야를 어떻게 혁신할 수 있을까요?',
  'AI-Healthcare: How can artificial intelligence revolutionize the medical field?',
  (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::DATE
) ON CONFLICT (date) DO NOTHING;
