
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CombinationScores {
  novelty_score: number;
  complementarity_score: number;
  marketability_score: number;
  overall_score: number;
}

interface CombinationRecommendation {
  module_id: string;
  module_type: string;
  content: string;
  confidence_score: number;
  reason: string;
}

interface ModuleCombination {
  id: string;
  user_id: string;
  module_ids: string[];
  novelty_score: number;
  complementarity_score: number;
  marketability_score: number;
  overall_score: number;
  feedback_score: number;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

interface UseIntelligentCombinationProps {
  currentLanguage: 'ko' | 'en';
}

export const useIntelligentCombination = ({ currentLanguage }: UseIntelligentCombinationProps) => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [currentScores, setCurrentScores] = useState<CombinationScores | null>(null);
  const [recommendations, setRecommendations] = useState<CombinationRecommendation[]>([]);
  const [topCombinations, setTopCombinations] = useState<ModuleCombination[]>([]);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const text = {
    ko: {
      evaluating: '조합을 평가하는 중...',
      optimizing: 'AI가 최적 조합을 찾는 중...',
      recommendationError: '추천 생성 중 오류가 발생했습니다',
      evaluationError: '조합 평가 중 오류가 발생했습니다',
      optimizationError: '최적화 중 오류가 발생했습니다',
      combinationSaved: '조합이 저장되었습니다',
      feedbackSubmitted: '피드백이 제출되었습니다',
      authenticationRequired: '인증이 필요합니다',
      accessDenied: '접근이 거부되었습니다',
      dataIntegrityError: '데이터 무결성 오류가 발생했습니다',
      invalidScoreRange: '점수 범위가 올바르지 않습니다 (0-100)',
      invalidRatingRange: '평점 범위가 올바르지 않습니다 (1-5)'
    },
    en: {
      evaluating: 'Evaluating combination...',
      optimizing: 'AI is finding optimal combinations...',
      recommendationError: 'Error generating recommendations',
      evaluationError: 'Error evaluating combination',
      optimizationError: 'Error during optimization',
      combinationSaved: 'Combination saved',
      feedbackSubmitted: 'Feedback submitted',
      authenticationRequired: 'Authentication required',
      accessDenied: 'Access denied',
      dataIntegrityError: 'Data integrity error occurred',
      invalidScoreRange: 'Invalid score range (0-100)',
      invalidRatingRange: 'Invalid rating range (1-5)'
    }
  };

  // 현재 선택된 모듈들의 조합 점수 계산
  const evaluateCurrentCombination = async () => {
    if (selectedModules.length < 2) {
      setCurrentScores(null);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-combination', {
        body: { module_ids: selectedModules }
      });

      if (error) throw error;

      if (data.success) {
        // 점수 범위 검증 (0-5 범위를 0-100으로 변환)
        const scores = data.scores;
        if (!isValidScoreRange(scores)) {
          throw new Error(text[currentLanguage].invalidScoreRange);
        }
        setCurrentScores(scores);
      }
    } catch (error: any) {
      console.error('Error evaluating combination:', error);
      const errorMessage = getErrorMessage(error, currentLanguage);
      toast({
        title: text[currentLanguage].evaluationError,
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 실시간 모듈 추천
  const getRecommendations = async () => {
    if (selectedModules.length === 0) {
      setRecommendations([]);
      return;
    }

    try {
      // 현재 선택된 모듈들과 상보성이 높은 모듈 찾기
      const { data: similarModules, error } = await supabase.rpc('find_similar_modules', {
        target_module_id: selectedModules[0],
        similarity_threshold: 0.3,
        limit_count: 10
      });

      if (error) throw error;

      // 이미 선택된 모듈들 제외
      const filteredModules = (similarModules || [])
        .filter((module: any) => !selectedModules.includes(module.module_id));

      const recs: CombinationRecommendation[] = filteredModules.map((module: any) => ({
        module_id: module.module_id,
        module_type: module.module_type,
        content: module.content,
        confidence_score: module.similarity_score * 100,
        reason: currentLanguage === 'ko' 
          ? `선택한 모듈과 ${Math.round(module.similarity_score * 100)}% 상보성`
          : `${Math.round(module.similarity_score * 100)}% complementarity with selected modules`
      }));

      setRecommendations(recs.slice(0, 5));

    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      const errorMessage = getErrorMessage(error, currentLanguage);
      toast({
        title: text[currentLanguage].recommendationError,
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  // 유전 알고리즘 기반 최적 조합 찾기
  const findOptimalCombinations = async (targetModuleTypes: string[] = []) => {
    setOptimizing(true);
    try {
      toast({
        title: text[currentLanguage].optimizing,
        duration: 3000
      });

      const { data, error } = await supabase.functions.invoke('genetic-combination-optimizer', {
        body: {
          seed_modules: selectedModules,
          target_module_types: targetModuleTypes,
          config: {
            population_size: 15,
            generations: 8,
            mutation_rate: 0.15,
            crossover_rate: 0.8,
            target_module_count: Math.max(4, selectedModules.length + 1)
          }
        }
      });

      if (error) throw error;

      return data.best_combinations;

    } catch (error: any) {
      console.error('Error finding optimal combinations:', error);
      const errorMessage = getErrorMessage(error, currentLanguage);
      toast({
        title: text[currentLanguage].optimizationError,
        description: errorMessage,
        variant: 'destructive'
      });
      return [];
    } finally {
      setOptimizing(false);
    }
  };

  // 조합 저장
  const saveCombination = async (moduleIds: string[], scores: CombinationScores) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error(text[currentLanguage].authenticationRequired);

      // 점수 범위 검증
      if (!isValidScoreRange(scores)) {
        throw new Error(text[currentLanguage].invalidScoreRange);
      }

      const { data, error } = await supabase
        .from('module_combinations')
        .insert({
          user_id: user.id,
          module_ids: moduleIds,
          novelty_score: scores.novelty_score,
          complementarity_score: scores.complementarity_score,
          marketability_score: scores.marketability_score,
          overall_score: scores.overall_score
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: text[currentLanguage].combinationSaved,
        duration: 2000
      });

      await fetchTopCombinations();
      return data;

    } catch (error: any) {
      console.error('Error saving combination:', error);
      const errorMessage = getErrorMessage(error, currentLanguage);
      throw new Error(errorMessage);
    }
  };

  // 조합 피드백 제출
  const submitFeedback = async (combinationId: string, rating: number, feedback?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error(text[currentLanguage].authenticationRequired);

      // 평점 범위 검증
      if (rating < 1 || rating > 5) {
        throw new Error(text[currentLanguage].invalidRatingRange);
      }

      const { error } = await supabase
        .from('combination_feedback')
        .insert({
          combination_id: combinationId,
          user_id: user.id,
          rating,
          feedback_text: feedback
        });

      if (error) throw error;

      toast({
        title: text[currentLanguage].feedbackSubmitted,
        duration: 2000
      });

      await fetchTopCombinations();

    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      const errorMessage = getErrorMessage(error, currentLanguage);
      throw new Error(errorMessage);
    }
  };

  // 최고 평점 조합들 가져오기
  const fetchTopCombinations = async () => {
    try {
      const { data, error } = await supabase
        .from('module_combinations')
        .select('*')
        .order('overall_score', { ascending: false })
        .limit(10);

      if (error) throw error;

      setTopCombinations(data || []);

    } catch (error: any) {
      console.error('Error fetching top combinations:', error);
      // RLS 정책으로 인해 데이터를 못 가져올 수 있으므로 조용히 처리
      setTopCombinations([]);
    }
  };

  // 모듈 선택 변경 시 자동 평가 및 추천
  useEffect(() => {
    evaluateCurrentCombination();
    getRecommendations();
  }, [selectedModules]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchTopCombinations();
  }, []);

  return {
    selectedModules,
    setSelectedModules,
    currentScores,
    recommendations,
    topCombinations,
    loading,
    optimizing,
    evaluateCurrentCombination,
    getRecommendations,
    findOptimalCombinations,
    saveCombination,
    submitFeedback,
    fetchTopCombinations
  };
};

// 유틸리티 함수들
function isValidScoreRange(scores: CombinationScores): boolean {
  const { novelty_score, complementarity_score, marketability_score, overall_score } = scores;
  return (
    novelty_score >= 0 && novelty_score <= 5 &&
    complementarity_score >= 0 && complementarity_score <= 5 &&
    marketability_score >= 0 && marketability_score <= 5 &&
    overall_score >= 0 && overall_score <= 5
  );
}

function getErrorMessage(error: any, language: 'ko' | 'en'): string {
  const messages = {
    ko: {
      auth: '인증이 필요합니다',
      rls: '접근 권한이 없습니다',
      constraint: '데이터 제약 조건 위반',
      foreign_key: '참조 무결성 오류',
      default: '알 수 없는 오류가 발생했습니다'
    },
    en: {
      auth: 'Authentication required',
      rls: 'Access denied',
      constraint: 'Data constraint violation',
      foreign_key: 'Foreign key constraint violation',
      default: 'An unknown error occurred'
    }
  };

  const msg = messages[language];
  
  if (error.message?.includes('auth')) return msg.auth;
  if (error.message?.includes('RLS') || error.message?.includes('policy')) return msg.rls;
  if (error.message?.includes('constraint') || error.message?.includes('check')) return msg.constraint;
  if (error.message?.includes('foreign key')) return msg.foreign_key;
  
  return error.message || msg.default;
}
