
-- 모듈 조합 평가를 위한 테이블 생성
CREATE TABLE IF NOT EXISTS public.module_combinations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  module_ids uuid[] NOT NULL,
  novelty_score numeric(5,2) DEFAULT 0,
  complementarity_score numeric(5,2) DEFAULT 0,
  marketability_score numeric(5,2) DEFAULT 0,
  overall_score numeric(5,2) DEFAULT 0,
  feedback_score integer DEFAULT 0,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 조합 피드백 테이블
CREATE TABLE IF NOT EXISTS public.combination_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  combination_id uuid REFERENCES public.module_combinations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback_text text,
  created_at timestamp with time zone DEFAULT now()
);

-- 유전 알고리즘 세대 기록 테이블
CREATE TABLE IF NOT EXISTS public.genetic_generations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  generation_number integer NOT NULL,
  population_size integer NOT NULL,
  best_fitness_score numeric(5,2),
  average_fitness_score numeric(5,2),
  mutation_rate numeric(3,2),
  crossover_rate numeric(3,2),
  created_at timestamp with time zone DEFAULT now()
);

-- 조합 추천 로그 테이블
CREATE TABLE IF NOT EXISTS public.combination_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  current_modules uuid[],
  recommended_modules uuid[],
  recommendation_type text CHECK (recommendation_type IN ('complementarity', 'similarity', 'genetic', 'hybrid')),
  confidence_score numeric(5,2),
  accepted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_combinations_user_id ON public.module_combinations(user_id);
CREATE INDEX IF NOT EXISTS idx_combinations_score ON public.module_combinations(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_combinations_created ON public.module_combinations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_combination ON public.combination_feedback(combination_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.combination_recommendations(user_id);

-- 조합 점수 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_combination_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- 피드백 기반 점수 업데이트
  UPDATE public.module_combinations 
  SET 
    feedback_score = (
      SELECT AVG(rating)::numeric(5,2) 
      FROM public.combination_feedback 
      WHERE combination_id = NEW.combination_id
    ),
    updated_at = now()
  WHERE id = NEW.combination_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 피드백 트리거 생성
DROP TRIGGER IF EXISTS update_combination_scores_trigger ON public.combination_feedback;
CREATE TRIGGER update_combination_scores_trigger
  AFTER INSERT OR UPDATE ON public.combination_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_combination_scores();
