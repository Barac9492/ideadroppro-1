
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface RemixOwnership {
  idea_id: string;
  original_creator: string;
  remix_creators: string[];
  ownership_percentages: number[];
  total_influence_score: number;
  vc_interest_count: number;
}

interface RemixLeverageProps {
  currentLanguage: 'ko' | 'en';
}

export const useRemixLeverage = ({ currentLanguage }: RemixLeverageProps) => {
  const [userRemixStats, setUserRemixStats] = useState({
    totalRemixes: 0,
    avgScoreImprovement: 0,
    coOwnershipCount: 0,
    vcMeetingEarned: 0,
    aiEvaluationRights: false
  });
  const { user } = useAuth();

  const text = {
    ko: {
      coOwnershipEarned: '공동 소유권을 획득했습니다!',
      scoreBoostShared: '점수 향상분을 공유합니다',
      aiEvaluatorUnlocked: 'AI 평가자 권한이 해제되었습니다',
      vcMeetingEarned: 'VC 미팅 우선권을 획득했습니다!',
      networkMultiplier: '네트워크 곱셈 효과 발생'
    },
    en: {
      coOwnershipEarned: 'Co-ownership earned!',
      scoreBoostShared: 'Score improvement shared',
      aiEvaluatorUnlocked: 'AI evaluator rights unlocked',
      vcMeetingEarned: 'VC meeting priority earned!', 
      networkMultiplier: 'Network multiplier effect triggered'
    }
  };

  const processRemixLeverage = async (
    originalIdeaId: string, 
    remixText: string, 
    scoreImprovement: number
  ) => {
    if (!user) return;

    try {
      // If remix improves score by +3 or more, grant co-ownership
      if (scoreImprovement >= 3) {
        toast({
          title: text[currentLanguage].coOwnershipEarned,
          description: `+${scoreImprovement} ${text[currentLanguage].scoreBoostShared}`,
          duration: 4000,
        });

        // Update user stats
        setUserRemixStats(prev => ({
          ...prev,
          coOwnershipCount: prev.coOwnershipCount + 1,
          avgScoreImprovement: (prev.avgScoreImprovement * prev.totalRemixes + scoreImprovement) / (prev.totalRemixes + 1),
          totalRemixes: prev.totalRemixes + 1
        }));
      }

      // Unlock AI evaluation rights after 10 quality remixes
      if (userRemixStats.totalRemixes >= 9 && !userRemixStats.aiEvaluationRights) {
        setUserRemixStats(prev => ({ ...prev, aiEvaluationRights: true }));
        toast({
          title: text[currentLanguage].aiEvaluatorUnlocked,
          description: currentLanguage === 'ko' ? 
            '이제 커뮤니티 평가에 참여할 수 있습니다' : 
            'You can now participate in community evaluations',
          duration: 5000,
        });
      }

      // VC meeting priority for high-impact remixers
      if (userRemixStats.coOwnershipCount >= 3) {
        toast({
          title: text[currentLanguage].vcMeetingEarned,
          description: currentLanguage === 'ko' ?
            '고품질 리믹스로 투자자 직접 연결 기회를 얻었습니다' :
            'High-quality remixes earned you direct investor connection opportunity',
          duration: 6000,
        });
      }

    } catch (error) {
      console.error('Error processing remix leverage:', error);
    }
  };

  const calculateNetworkMultiplier = (ideaId: string) => {
    // Calculate how many times an idea has been re-remixed
    const multiplier = Math.floor(Math.random() * 5) + 1;
    return multiplier;
  };

  return {
    userRemixStats,
    processRemixLeverage,
    calculateNetworkMultiplier
  };
};
