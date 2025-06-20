
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the cron job (without trying to unschedule first)
SELECT cron.schedule(
  'daily-prompt-generator',
  '0 15 * * *', -- 15:00 UTC = 00:00 KST (midnight in Korea)
  $$
  SELECT
    net.http_post(
        url:='https://wutnxfgyikjisfqczyjh.supabase.co/functions/v1/generate-daily-prompt',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dG54Zmd5aWtqaXNmcWN6eWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDU1MTksImV4cCI6MjA2NTg4MTUxOX0.OYjyi2KvsdH5MjDT_RGYNWepuAOqM9Pv0YpeDrAAH4M"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Create the monitoring table
CREATE TABLE IF NOT EXISTS public.daily_prompt_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'manual')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index for efficient querying
CREATE INDEX IF NOT EXISTS idx_daily_prompt_logs_date ON public.daily_prompt_logs(date DESC);

-- Insert today's prompt if it doesn't exist (immediate fix)
DO $$
DECLARE
  current_date_kst DATE;
  prompt_topics TEXT[] := ARRAY[
    'AI-헬스케어: 인공지능이 의료 분야를 어떻게 혁신할 수 있을까요?',
    '지속가능한 패션: 환경을 생각하는 새로운 패션 아이디어는?',
    '스마트시티: 도시를 더 똑똑하게 만들 수 있는 기술은?',
    '원격교육: 온라인 학습을 더 효과적으로 만드는 방법은?',
    '푸드테크: 음식과 기술의 융합으로 만들 수 있는 혁신은?'
  ];
  prompt_topics_en TEXT[] := ARRAY[
    'AI-Healthcare: How can artificial intelligence revolutionize the medical field?',
    'Sustainable Fashion: What are some eco-friendly fashion innovations?',
    'Smart Cities: What technologies can make our cities smarter?',
    'Remote Education: How can we make online learning more effective?',
    'Food Tech: What innovations can emerge from combining food and technology?'
  ];
  topic_index INTEGER;
BEGIN
  -- Get current date in KST
  current_date_kst := (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::DATE;
  
  -- Check if prompt already exists for today
  IF NOT EXISTS (SELECT 1 FROM public.daily_prompts WHERE date = current_date_kst) THEN
    -- Select a topic based on day of year
    topic_index := 1 + (EXTRACT(DOY FROM current_date_kst)::INTEGER % array_length(prompt_topics, 1));
    
    -- Insert today's prompt
    INSERT INTO public.daily_prompts (prompt_text_ko, prompt_text_en, date)
    VALUES (
      prompt_topics[topic_index],
      prompt_topics_en[topic_index],
      current_date_kst
    );
    
    -- Log the manual creation
    INSERT INTO public.daily_prompt_logs (date, status)
    VALUES (current_date_kst, 'manual');
  END IF;
END $$;
