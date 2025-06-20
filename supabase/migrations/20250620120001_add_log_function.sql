
-- Create a function to safely fetch daily prompt logs
CREATE OR REPLACE FUNCTION public.get_daily_prompt_logs()
RETURNS TABLE (
  id UUID,
  date DATE,
  status TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table exists first
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'daily_prompt_logs'
  ) THEN
    RETURN QUERY
    SELECT 
      dpl.id,
      dpl.date,
      dpl.status,
      dpl.error_message,
      dpl.created_at
    FROM public.daily_prompt_logs dpl
    ORDER BY dpl.created_at DESC;
  ELSE
    -- Return empty result if table doesn't exist
    RETURN;
  END IF;
END;
$$;
