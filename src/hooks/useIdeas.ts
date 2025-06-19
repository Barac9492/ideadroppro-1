
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Idea {
  id: string;
  text: string;
  score: number;
  tags: string[];
  likes: number;
  hasLiked: boolean;
  timestamp: Date;
  aiAnalysis?: string;
  improvements?: string[];
  marketPotential?: string[];
  similarIdeas?: string[];
  pitchPoints?: string[];
  finalVerdict?: string;
  user_id: string;
}

export const useIdeas = (currentLanguage: 'ko' | 'en') => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const text = {
    ko: {
      submitSuccess: '아이디어가 성공적으로 제출되었습니다!',
      submitError: '아이디어 제출 중 오류가 발생했습니다.',
      analysisGenerated: 'AI 분석이 생성되었습니다!',
      verdictSaved: 'VC 평가가 저장되었습니다!',
      verdictError: 'VC 평가 저장 중 오류가 발생했습니다.'
    },
    en: {
      submitSuccess: 'Idea submitted successfully!',
      submitError: 'Error occurred while submitting idea.',
      analysisGenerated: 'AI analysis generated successfully!',
      verdictSaved: 'VC verdict saved successfully!',
      verdictError: 'Error occurred while saving VC verdict.'
    }
  };

  const fetchIdeas = async () => {
    try {
      const { data: ideasData, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ideasWithLikes = await Promise.all((ideasData || []).map(async (idea) => {
        const { data: likesData } = await supabase
          .from('idea_likes')
          .select('user_id')
          .eq('idea_id', idea.id);

        const hasLiked = user ? likesData?.some(like => like.user_id === user.id) || false : false;

        return {
          id: idea.id,
          text: idea.text,
          score: parseFloat(idea.score?.toString() || '0'),
          tags: idea.tags || [],
          likes: likesData?.length || 0,
          hasLiked,
          timestamp: new Date(idea.created_at),
          aiAnalysis: idea.ai_analysis,
          improvements: idea.improvements,
          marketPotential: idea.market_potential,
          similarIdeas: idea.similar_ideas,
          pitchPoints: idea.pitch_points,
          finalVerdict: idea.final_verdict,
          user_id: idea.user_id
        };
      }));

      setIdeas(ideasWithLikes);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [user]);

  const submitIdea = async (ideaText: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert([{
          user_id: user.id,
          text: ideaText,
          score: Math.round((Math.random() * 3 + 7) * 10) / 10,
          tags: generateMockTags(ideaText),
          ai_analysis: currentLanguage === 'ko' 
            ? '이 아이디어는 시장에서 높은 관심을 받을 가능성이 있습니다. 실행 가능성과 혁신성을 모두 갖춘 흥미로운 컨셉입니다.'
            : 'This idea has strong potential to gain significant market interest. It combines both feasibility and innovation in an interesting concept.'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: text[currentLanguage].submitSuccess,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast({
        title: text[currentLanguage].submitError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const toggleLike = async (ideaId: string) => {
    if (!user) return;

    try {
      const idea = ideas.find(i => i.id === ideaId);
      if (!idea) return;

      if (idea.hasLiked) {
        await supabase
          .from('idea_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('idea_id', ideaId);
      } else {
        await supabase
          .from('idea_likes')
          .insert([{
            user_id: user.id,
            idea_id: ideaId
          }]);
      }

      fetchIdeas();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const generateAnalysis = async (ideaId: string) => {
    try {
      const mockAnalysis = {
        improvements: currentLanguage === 'ko' ? [
          '타겟 사용자층을 더 구체적으로 정의해보세요',
          '기술적 구현의 난이도와 비용을 고려해보세요',
          '경쟁 제품 대비 차별화 포인트를 명확히 하세요'
        ] : [
          'Define your target user base more specifically',
          'Consider the technical implementation difficulty and costs',
          'Clarify differentiation points compared to competing products'
        ],
        market_potential: currentLanguage === 'ko' ? [
          '글로벌 시장 규모가 지속적으로 성장하고 있습니다',
          '모바일 우선 접근법이 유리할 것으로 보입니다',
          'B2B와 B2C 모두에서 수요가 예상됩니다'
        ] : [
          'Global market size is continuously growing',
          'Mobile-first approach would be advantageous',
          'Demand is expected in both B2B and B2C markets'
        ],
        similar_ideas: currentLanguage === 'ko' ? [
          'AI 기반 개인 맞춤형 쇼핑 추천 서비스',
          '스마트 홈 IoT 통합 관리 플랫폼',
          '블록체인 기반 디지털 신원 인증 시스템'
        ] : [
          'AI-powered personalized shopping recommendation service',
          'Smart home IoT integrated management platform',
          'Blockchain-based digital identity verification system'
        ],
        pitch_points: currentLanguage === 'ko' ? [
          '문제: 기존 솔루션의 한계와 사용자 불편함',
          '해결책: 혁신적인 기술을 통한 새로운 접근법',
          '시장: 대상 고객과 시장 규모의 명확한 정의',
          '경쟁우위: 차별화된 가치 제안과 진입 장벽'
        ] : [
          'Problem: Limitations of existing solutions and user inconvenience',
          'Solution: New approach through innovative technology',
          'Market: Clear definition of target customers and market size',
          'Competitive advantage: Differentiated value proposition and barriers to entry'
        ]
      };

      const { error } = await supabase
        .from('ideas')
        .update(mockAnalysis)
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: text[currentLanguage].analysisGenerated,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error generating analysis:', error);
    }
  };

  const saveFinalVerdict = async (ideaId: string, verdict: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ final_verdict: verdict })
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: text[currentLanguage].verdictSaved,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error saving verdict:', error);
      toast({
        title: text[currentLanguage].verdictError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const generateMockTags = (text: string): string[] => {
    const possibleTags = currentLanguage === 'ko' 
      ? ['AI', '기술', '모바일', '웹', '스타트업', '혁신', '비즈니스', '헬스케어', '교육', '환경']
      : ['AI', 'Technology', 'Mobile', 'Web', 'Startup', 'Innovation', 'Business', 'Healthcare', 'Education', 'Environment'];
    return possibleTags.slice(0, Math.floor(Math.random() * 4) + 2);
  };

  return {
    ideas,
    loading,
    submitIdea,
    toggleLike,
    generateAnalysis,
    saveFinalVerdict
  };
};
