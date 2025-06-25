
-- 자동화 로그 테이블 생성
CREATE TABLE IF NOT EXISTS public.semantic_automation_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type text NOT NULL CHECK (operation_type IN ('embedding', 'clustering')),
  status text NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  trigger_type text NOT NULL CHECK (trigger_type IN ('auto', 'manual', 'scheduled')),
  modules_processed integer DEFAULT 0,
  clusters_created integer DEFAULT 0,
  error_message text,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- 자동화 설정 테이블 생성
CREATE TABLE IF NOT EXISTS public.semantic_automation_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  auto_embedding_enabled boolean DEFAULT true,
  auto_clustering_enabled boolean DEFAULT true,
  clustering_schedule text DEFAULT '0 2 * * *', -- 매일 새벽 2시
  min_modules_for_clustering integer DEFAULT 10,
  embedding_batch_size integer DEFAULT 50,
  last_clustering_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 기본 설정 데이터 삽입
INSERT INTO public.semantic_automation_config (id) 
VALUES (gen_random_uuid()) 
ON CONFLICT DO NOTHING;

-- 새 모듈 생성시 자동 임베딩 트리거 함수
CREATE OR REPLACE FUNCTION public.trigger_auto_embedding()
RETURNS TRIGGER AS $$
DECLARE
  config_record RECORD;
BEGIN
  -- 자동화 설정 확인
  SELECT * INTO config_record FROM public.semantic_automation_config LIMIT 1;
  
  IF config_record.auto_embedding_enabled THEN
    -- 백그라운드에서 임베딩 생성 요청
    INSERT INTO public.semantic_automation_logs (
      operation_type, 
      status, 
      trigger_type,
      modules_processed
    ) VALUES (
      'embedding', 
      'pending', 
      'auto',
      1
    );
    
    -- HTTP 요청으로 임베딩 생성 함수 호출 (비동기)
    PERFORM net.http_post(
      url := 'https://wutnxfgyikjisfqczyjh.supabase.co/functions/v1/generate-module-embeddings',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dG54Zmd5aWtqaXNmcWN6eWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDU1MTksImV4cCI6MjA2NTg4MTUxOX0.OYjyi2KvsdH5MjDT_RGYNWepuAOqM9Pv0YpeDrAAH4M"}'::jsonb,
      body := json_build_object('moduleId', NEW.id, 'content', NEW.content)::jsonb
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS auto_embedding_trigger ON public.idea_modules;
CREATE TRIGGER auto_embedding_trigger
  AFTER INSERT ON public.idea_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_auto_embedding();

-- 자동 클러스터링을 위한 함수
CREATE OR REPLACE FUNCTION public.auto_clustering_check()
RETURNS void AS $$
DECLARE
  config_record RECORD;
  unembedded_count integer;
  days_since_last_clustering integer;
BEGIN
  -- 설정 확인
  SELECT * INTO config_record FROM public.semantic_automation_config LIMIT 1;
  
  IF NOT config_record.auto_clustering_enabled THEN
    RETURN;
  END IF;
  
  -- 임베딩이 없는 모듈 수 확인
  SELECT COUNT(*) INTO unembedded_count
  FROM public.idea_modules
  WHERE embedding IS NULL;
  
  -- 마지막 클러스터링 후 경과 일수
  SELECT COALESCE(
    EXTRACT(days FROM now() - config_record.last_clustering_date::timestamp), 
    999
  ) INTO days_since_last_clustering;
  
  -- 클러스터링 실행 조건 확인
  IF unembedded_count >= config_record.min_modules_for_clustering 
     OR days_since_last_clustering >= 7 THEN
    
    -- 로그 생성
    INSERT INTO public.semantic_automation_logs (
      operation_type, 
      status, 
      trigger_type
    ) VALUES (
      'clustering', 
      'pending', 
      'scheduled'
    );
    
    -- 클러스터링 함수 호출
    PERFORM net.http_post(
      url := 'https://wutnxfgyikjisfqczyjh.supabase.co/functions/v1/cluster-modules',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dG54Zmd5aWtqaXNmcWN6eWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDU1MTksImV4cCI6MjA2NTg4MTUxOX0.OYjyi2KvsdH5MjDT_RGYNWepuAOqM9Pv0YpeDrAAH4M"}'::jsonb,
      body := '{}'::jsonb
    );
    
    -- 마지막 클러스터링 날짜 업데이트
    UPDATE public.semantic_automation_config 
    SET last_clustering_date = CURRENT_DATE,
        updated_at = now();
        
  END IF;
END;
$$ LANGUAGE plpgsql;

-- pg_cron과 pg_net 확장 활성화
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 기존 cron job 삭제 (있다면)
SELECT cron.unschedule('semantic-auto-clustering') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'semantic-auto-clustering'
);

-- 매일 새벽 2시에 자동 클러스터링 체크 실행
SELECT cron.schedule(
  'semantic-auto-clustering',
  '0 2 * * *', -- 매일 새벽 2시
  'SELECT public.auto_clustering_check();'
);

-- 자동화 상태 조회를 위한 뷰
CREATE OR REPLACE VIEW public.semantic_automation_status AS
SELECT 
  c.auto_embedding_enabled,
  c.auto_clustering_enabled,
  c.clustering_schedule,
  c.min_modules_for_clustering,
  c.last_clustering_date,
  
  -- 임베딩 통계
  (SELECT COUNT(*) FROM public.idea_modules WHERE embedding IS NOT NULL) as modules_with_embeddings,
  (SELECT COUNT(*) FROM public.idea_modules WHERE embedding IS NULL) as modules_without_embeddings,
  (SELECT COUNT(*) FROM public.idea_modules) as total_modules,
  
  -- 클러스터 통계
  (SELECT COUNT(*) FROM public.module_clusters) as total_clusters,
  (SELECT SUM(member_count) FROM public.module_clusters) as clustered_modules,
  
  -- 최근 자동화 로그
  (SELECT COUNT(*) FROM public.semantic_automation_logs 
   WHERE operation_type = 'embedding' AND created_at > now() - interval '24 hours') as embeddings_last_24h,
  (SELECT COUNT(*) FROM public.semantic_automation_logs 
   WHERE operation_type = 'clustering' AND created_at > now() - interval '7 days') as clusterings_last_week
   
FROM public.semantic_automation_config c
LIMIT 1;
