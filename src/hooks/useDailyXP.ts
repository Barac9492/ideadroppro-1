import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface UserXP {
  id: string;
  user_id: string;
  total_xp: number;
  daily_xp: number;
  level: number;
  streak_days: number;
  last_activity_date: string;
  created_at: string;
  updated_at: string;
}

interface DailyMission {
  id: string;
  type: 'idea_submit' | 'remix_create' | 'vote_participate' | 'vc_interact' | 'like_ideas';
  title: string;
  description: string;
  xp_reward: number;
  completed: boolean;
  progress: number;
  target: number;
}

export const useDailyXP = () => {
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const generateDailyMissions = (): DailyMission[] => [
    {
      id: '1',
      type: 'idea_submit',
      title: '💡 아이디어 제출',
      description: '오늘의 키워드로 아이디어를 제출하세요',
      xp_reward: 50,
      completed: false,
      progress: 0,
      target: 1
    },
    {
      id: '2', 
      type: 'remix_create',
      title: '🔄 리믹스 생성',
      description: '다른 아이디어를 리믹스해보세요',
      xp_reward: 30,
      completed: false,
      progress: 0,
      target: 2
    },
    {
      id: '3',
      type: 'like_ideas', 
      title: '🗳️ 평가 참여',
      description: '아이디어에 좋아요를 눌러주세요',
      xp_reward: 20,
      completed: false,
      progress: 0,
      target: 5
    },
    {
      id: '4',
      type: 'vc_interact',
      title: '🤝 VC 상호작용',
      description: 'VC가 선택한 아이디어를 확인하세요',
      xp_reward: 40,
      completed: false,
      progress: 0,
      target: 1
    }
  ];

  const awardXP = async (xpAmount: number, actionType: string) => {
    if (!user) return;

    try {
      // Mock XP award - in real app this would hit an API
      const newXP = (userXP?.total_xp || 0) + xpAmount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      setUserXP(prev => prev ? {
        ...prev,
        total_xp: newXP,
        daily_xp: prev.daily_xp + xpAmount,
        level: newLevel
      } : null);

      // Show XP gain toast
      toast({
        title: `🎉 +${xpAmount} XP 획득!`,
        description: `${actionType} 완료로 경험치를 획득했습니다`,
        duration: 3000,
      });

      // Check for level up
      if (newLevel > (userXP?.level || 0)) {
        toast({
          title: `🆙 레벨 업! Level ${newLevel}`,
          description: '새로운 특권이 해제되었습니다!',
          duration: 5000,
        });
      }

    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  const completeMission = (missionId: string) => {
    setDailyMissions(prev => 
      prev.map(mission => 
        mission.id === missionId 
          ? { ...mission, completed: true, progress: mission.target }
          : mission
      )
    );
  };

  const updateMissionProgress = (missionType: DailyMission['type'], increment: number = 1) => {
    setDailyMissions(prev => 
      prev.map(mission => {
        if (mission.type === missionType && !mission.completed) {
          const newProgress = Math.min(mission.progress + increment, mission.target);
          const completed = newProgress >= mission.target;
          
          if (completed && !mission.completed) {
            awardXP(mission.xp_reward, mission.title);
          }
          
          return {
            ...mission,
            progress: newProgress,
            completed
          };
        }
        return mission;
      })
    );
  };

  const calculateStreak = () => {
    const today = new Date().toDateString();
    const lastActivity = userXP?.last_activity_date;
    
    if (!lastActivity) return 1;
    
    const lastDate = new Date(lastActivity).toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (lastDate === today) return userXP?.streak_days || 0;
    if (lastDate === yesterday) return (userXP?.streak_days || 0) + 1;
    return 1; // Streak broken
  };

  useEffect(() => {
    if (user) {
      // Initialize mock user XP data
      setUserXP({
        id: '1',
        user_id: user.id,
        total_xp: 150,
        daily_xp: 0,
        level: 2,
        streak_days: 3,
        last_activity_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      setDailyMissions(generateDailyMissions());
      setLoading(false);
    }
  }, [user]);

  return {
    userXP,
    dailyMissions,
    loading,
    awardXP,
    updateMissionProgress,
    completeMission,
    calculateStreak
  };
};
