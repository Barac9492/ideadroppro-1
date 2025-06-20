
-- Create user influence scores table
CREATE TABLE public.user_influence_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  weekly_score INTEGER NOT NULL DEFAULT 0,
  monthly_score INTEGER NOT NULL DEFAULT 0,
  last_weekly_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_monthly_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user invitations table
CREATE TABLE public.user_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  invitee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitation_code TEXT NOT NULL UNIQUE,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '30 days')
);

-- Create influence score logs table
CREATE TABLE public.influence_score_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL,
  points INTEGER NOT NULL,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add influence boost column to ideas table
ALTER TABLE public.ideas 
ADD COLUMN influence_boost NUMERIC DEFAULT 0;

-- Enable RLS on new tables
ALTER TABLE public.user_influence_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influence_score_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_influence_scores
CREATE POLICY "Users can view their own influence scores" 
  ON public.user_influence_scores 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own influence scores" 
  ON public.user_influence_scores 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for user_invitations
CREATE POLICY "Users can view their sent invitations" 
  ON public.user_invitations 
  FOR SELECT 
  USING (auth.uid() = inviter_id);

CREATE POLICY "Users can view invitations sent to them" 
  ON public.user_invitations 
  FOR SELECT 
  USING (auth.uid() = invitee_id);

CREATE POLICY "Users can create invitations" 
  ON public.user_invitations 
  FOR INSERT 
  WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their invitations" 
  ON public.user_invitations 
  FOR UPDATE 
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

-- RLS policies for influence_score_logs
CREATE POLICY "Users can view their own score logs" 
  ON public.influence_score_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Function to update influence score
CREATE OR REPLACE FUNCTION public.update_influence_score(
  p_user_id UUID,
  p_action_type TEXT,
  p_points INTEGER,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert log entry
  INSERT INTO public.influence_score_logs (user_id, action_type, points, description, reference_id)
  VALUES (p_user_id, p_action_type, p_points, p_description, p_reference_id);
  
  -- Update or create influence score record
  INSERT INTO public.user_influence_scores (user_id, total_score, weekly_score, monthly_score)
  VALUES (p_user_id, p_points, p_points, p_points)
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_score = user_influence_scores.total_score + p_points,
    weekly_score = user_influence_scores.weekly_score + p_points,
    monthly_score = user_influence_scores.monthly_score + p_points,
    updated_at = now();
END;
$$;

-- Function to reset weekly/monthly scores
CREATE OR REPLACE FUNCTION public.reset_periodic_scores()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reset weekly scores (every Monday)
  UPDATE public.user_influence_scores 
  SET weekly_score = 0, last_weekly_reset = now()
  WHERE EXTRACT(DOW FROM now()) = 1 
    AND last_weekly_reset < date_trunc('week', now());
  
  -- Reset monthly scores (first day of month)
  UPDATE public.user_influence_scores 
  SET monthly_score = 0, last_monthly_reset = now()
  WHERE EXTRACT(DAY FROM now()) = 1 
    AND last_monthly_reset < date_trunc('month', now());
END;
$$;
