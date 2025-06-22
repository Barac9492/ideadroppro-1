
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface VCActivity {
  id: string;
  vc_name: string;
  action: 'review' | 'recommend' | 'comment' | 'championship';
  idea_id: string;
  points_earned: number;
  timestamp: Date;
  impact_description: string;
}

interface VCLeaderboard {
  vc_name: string;
  total_points: number;
  monthly_points: number;
  activities_count: number;
  badge: string;
  rank: number;
}

interface UseVCPointsProps {
  currentLanguage: 'ko' | 'en';
}

export const useVCPoints = ({ currentLanguage }: UseVCPointsProps) => {
  const [vcActivities, setVcActivities] = useState<VCActivity[]>([]);
  const [leaderboard, setLeaderboard] = useState<VCLeaderboard[]>([]);
  const [championshipIdeas, setChampionshipIdeas] = useState<any[]>([]);
  const { user } = useAuth();

  const text = {
    ko: {
      vcReviewPoints: 'VC 리뷰 완료',
      vcRecommendPoints: 'VC 추천 등록',
      vcCommentPoints: 'VC 코멘트 작성',
      championshipPoints: '챔피언십 참여',
      pointsEarned: '포인트 획득!'
    },
    en: {
      vcReviewPoints: 'VC review completed',
      vcRecommendPoints: 'VC recommendation added',
      vcCommentPoints: 'VC comment posted',
      championshipPoints: 'Championship participation',
      pointsEarned: 'Points earned!'
    }
  };

  // Mock VC activities and leaderboard
  useEffect(() => {
    const mockActivities: VCActivity[] = [
      {
        id: '1',
        vc_name: 'TechVentures Korea',
        action: 'review',
        idea_id: 'idea-1',
        points_earned: 15,
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        impact_description: currentLanguage === 'ko' ? 'AI 농업 플랫폼 상세 분석' : 'Detailed AI agriculture platform analysis'
      },
      {
        id: '2',
        vc_name: 'Innovation Capital',
        action: 'recommend',
        idea_id: 'idea-2',
        points_earned: 25,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        impact_description: currentLanguage === 'ko' ? '블록체인 솔루션 추천' : 'Blockchain solution recommendation'
      },
      {
        id: '3',
        vc_name: 'GreenTech Fund',
        action: 'championship',
        idea_id: 'idea-3',
        points_earned: 50,
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        impact_description: currentLanguage === 'ko' ? '월간 챔피언십 심사' : 'Monthly championship judging'
      }
    ];

    const mockLeaderboard: VCLeaderboard[] = [
      {
        vc_name: 'TechVentures Korea',
        total_points: 1250,
        monthly_points: 340,
        activities_count: 28,
        badge: '🏆',
        rank: 1
      },
      {
        vc_name: 'Innovation Capital',
        total_points: 980,
        monthly_points: 285,
        activities_count: 22,
        badge: '🥈',
        rank: 2
      },
      {
        vc_name: 'GreenTech Fund',
        total_points: 875,
        monthly_points: 210,
        activities_count: 19,
        badge: '🥉',
        rank: 3
      }
    ];

    setVcActivities(mockActivities);
    setLeaderboard(mockLeaderboard);
  }, [currentLanguage]);

  const awardVCPoints = async (vcName: string, action: VCActivity['action'], ideaId: string) => {
    const pointsMap = {
      review: 15,
      recommend: 25,
      comment: 10,
      championship: 50
    };

    const points = pointsMap[action];
    const description = text[currentLanguage][`vc${action.charAt(0).toUpperCase() + action.slice(1)}Points` as keyof typeof text[typeof currentLanguage]];

    const newActivity: VCActivity = {
      id: Date.now().toString(),
      vc_name: vcName,
      action,
      idea_id: ideaId,
      points_earned: points,
      timestamp: new Date(),
      impact_description: description
    };

    setVcActivities(prev => [newActivity, ...prev.slice(0, 9)]);

    toast({
      title: `${vcName} - ${text[currentLanguage].pointsEarned}`,
      description: `+${points} ${description}`,
      duration: 4000,
    });
  };

  const getVCRecommendedIdeas = () => {
    // Mock recommended ideas by VCs
    return [
      {
        id: 'rec-1',
        title: currentLanguage === 'ko' ? 'AI 기반 스마트 팜' : 'AI-powered Smart Farm',
        vc_name: 'TechVentures Korea',
        reason: currentLanguage === 'ko' ? '농업 혁신의 차세대 기술' : 'Next-gen technology for agricultural innovation'
      },
      {
        id: 'rec-2',
        title: currentLanguage === 'ko' ? '탄소 중립 블록체인' : 'Carbon-neutral Blockchain',
        vc_name: 'GreenTech Fund',
        reason: currentLanguage === 'ko' ? '환경 친화적 기술 솔루션' : 'Eco-friendly tech solution'
      }
    ];
  };

  return {
    vcActivities,
    leaderboard,
    championshipIdeas,
    awardVCPoints,
    getVCRecommendedIdeas
  };
};
