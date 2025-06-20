
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RemixSuggestion {
  id: string;
  type: 'market_expansion' | 'tech_enhancement' | 'business_model' | 'user_segment';
  suggestion: string;
  reasoning: string;
  potential_score_boost: number;
}

interface UseAutoRemixSuggestionsProps {
  ideaId?: string;
  ideaText?: string;
  currentLanguage: 'ko' | 'en';
}

export const useAutoRemixSuggestions = ({ ideaId, ideaText, currentLanguage }: UseAutoRemixSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<RemixSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = async () => {
    if (!ideaText) return;
    
    setLoading(true);
    try {
      // Generate immediate algorithmic remix suggestions
      const mockSuggestions: RemixSuggestion[] = [
        {
          id: '1',
          type: 'market_expansion',
          suggestion: currentLanguage === 'ko' ? 
            `${ideaText.includes('AI') ? 'B2B 시장' : '글로벌 시장'}으로 확장하면?` :
            `What about expanding to ${ideaText.includes('AI') ? 'B2B market' : 'global market'}?`,
          reasoning: currentLanguage === 'ko' ? 
            '시장 확장으로 3-5배 매출 증가 가능' : 
            'Market expansion could increase revenue 3-5x',
          potential_score_boost: 2.3
        },
        {
          id: '2', 
          type: 'tech_enhancement',
          suggestion: currentLanguage === 'ko' ?
            `${ideaText.includes('앱') ? 'AI 자동화' : '모바일 앱'}을 추가하면?` :
            `What if we add ${ideaText.includes('app') ? 'AI automation' : 'mobile app'}?`,
          reasoning: currentLanguage === 'ko' ?
            '기술 향상으로 사용자 경험 대폭 개선' :
            'Tech enhancement would dramatically improve UX',
          potential_score_boost: 1.8
        },
        {
          id: '3',
          type: 'business_model',
          suggestion: currentLanguage === 'ko' ?
            '구독 모델 + 프리미엄 기능은 어떨까?' :
            'How about subscription model + premium features?',
          reasoning: currentLanguage === 'ko' ?
            '안정적 수익 모델로 투자 매력도 증가' :
            'Stable revenue model increases investment appeal',
          potential_score_boost: 2.1
        }
      ];

      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error generating remix suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ideaText) {
      // Generate suggestions immediately when idea is submitted
      const timer = setTimeout(() => {
        generateSuggestions();
      }, 1500); // Slight delay to feel more natural

      return () => clearTimeout(timer);
    }
  }, [ideaText]);

  return {
    suggestions,
    loading,
    generateSuggestions
  };
};
