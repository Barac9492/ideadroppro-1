
-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily prompt generation every day at midnight KST (3 PM UTC)
SELECT cron.schedule(
  'generate-daily-prompt',
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

-- Insert today's prompt if it doesn't exist
INSERT INTO public.daily_prompts (prompt_text_ko, prompt_text_en, date)
VALUES (
  'AI-헬스케어: 인공지능이 의료 분야를 어떻게 혁신할 수 있을까요?',
  'AI-Healthcare: How can artificial intelligence revolutionize the medical field?',
  (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::DATE
) ON CONFLICT (date) DO NOTHING;
