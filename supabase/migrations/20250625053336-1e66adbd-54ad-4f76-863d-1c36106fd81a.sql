
-- Foreign Key 제약조건 추가
ALTER TABLE public.combination_feedback 
ADD CONSTRAINT fk_combination_feedback_combination 
FOREIGN KEY (combination_id) REFERENCES public.module_combinations(id) ON DELETE CASCADE;

-- RLS 정책 활성화 및 추가
ALTER TABLE public.module_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combination_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combination_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genetic_generations ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 조합만 볼 수 있음
CREATE POLICY "Users can view their own combinations" 
ON public.module_combinations 
FOR SELECT 
USING (auth.uid() = user_id);

-- 사용자는 자신의 조합만 생성할 수 있음
CREATE POLICY "Users can create their own combinations" 
ON public.module_combinations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 조합만 업데이트할 수 있음
CREATE POLICY "Users can update their own combinations" 
ON public.module_combinations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 사용자는 자신의 조합만 삭제할 수 있음
CREATE POLICY "Users can delete their own combinations" 
ON public.module_combinations 
FOR DELETE 
USING (auth.uid() = user_id);

-- 피드백 정책 - 인증된 사용자는 모든 피드백을 볼 수 있음 (공개 피드백)
CREATE POLICY "Authenticated users can view all feedback" 
ON public.combination_feedback 
FOR SELECT 
TO authenticated
USING (true);

-- 사용자는 자신의 피드백만 생성할 수 있음
CREATE POLICY "Users can create their own feedback" 
ON public.combination_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 피드백만 업데이트할 수 있음
CREATE POLICY "Users can update their own feedback" 
ON public.combination_feedback 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 사용자는 자신의 피드백만 삭제할 수 있음
CREATE POLICY "Users can delete their own feedback" 
ON public.combination_feedback 
FOR DELETE 
USING (auth.uid() = user_id);

-- 추천 정책 - 사용자는 자신의 추천만 볼 수 있음
CREATE POLICY "Users can view their own recommendations" 
ON public.combination_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

-- 사용자는 자신의 추천만 생성할 수 있음
CREATE POLICY "Users can create their own recommendations" 
ON public.combination_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 유전 알고리즘 세대 기록은 모든 인증된 사용자가 볼 수 있음 (연구 목적)
CREATE POLICY "Authenticated users can view genetic generations" 
ON public.genetic_generations 
FOR SELECT 
TO authenticated
USING (true);

-- 관리자만 유전 알고리즘 세대 기록을 생성할 수 있음
CREATE POLICY "Only system can create genetic generations" 
ON public.genetic_generations 
FOR INSERT 
WITH CHECK (false); -- 시스템 함수에서만 직접 삽입

-- 데이터 검증을 위한 체크 제약조건 추가
ALTER TABLE public.module_combinations 
ADD CONSTRAINT check_novelty_score_range 
CHECK (novelty_score >= 0 AND novelty_score <= 100);

ALTER TABLE public.module_combinations 
ADD CONSTRAINT check_complementarity_score_range 
CHECK (complementarity_score >= 0 AND complementarity_score <= 100);

ALTER TABLE public.module_combinations 
ADD CONSTRAINT check_marketability_score_range 
CHECK (marketability_score >= 0 AND marketability_score <= 100);

ALTER TABLE public.module_combinations 
ADD CONSTRAINT check_overall_score_range 
CHECK (overall_score >= 0 AND overall_score <= 100);

ALTER TABLE public.combination_feedback 
ADD CONSTRAINT check_rating_range 
CHECK (rating >= 1 AND rating <= 5);

-- 성능 최적화를 위한 추가 인덱스
CREATE INDEX IF NOT EXISTS idx_combinations_user_score ON public.module_combinations(user_id, overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_user_rating ON public.combination_feedback(user_id, rating);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_type ON public.combination_recommendations(user_id, recommendation_type);

-- 업데이트된 조합 점수 함수 개선 (NULL 처리)
CREATE OR REPLACE FUNCTION public.update_combination_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- 피드백 기반 점수 업데이트 (NULL 안전 처리)
  UPDATE public.module_combinations 
  SET 
    feedback_score = COALESCE((
      SELECT AVG(rating)::numeric(5,2) 
      FROM public.combination_feedback 
      WHERE combination_id = NEW.combination_id
    ), 0),
    updated_at = now()
  WHERE id = NEW.combination_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
