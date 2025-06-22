
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DailyChallenge {
  id: string;
  date: string;
  keyword: string;
  theme: string;
  description: string;
  deadline: Date;
  participantCount: number;
  isUrgent: boolean;
  reward: {
    xp: number;
    badge?: string;
    vcPriority: boolean;
  };
}

export const useDailyChallenge = (currentLanguage: 'ko' | 'en') => {
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);
  const [liveParticipants, setLiveParticipants] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [hasParticipated, setHasParticipated] = useState(false);
  const [challengeKeyword, setChallengeKeyword] = useState('');
  const { user } = useAuth();

  const text = {
    ko: {
      urgentChallenge: '🔥 긴급 도전',
      hoursLeft: '시간 남음',
      peopleWorking: '명이 동시에 작업 중',
      joined: '참여 완료!',
      joinNow: '아이디어 제출하기',
      submitIdea: '이 테마로 아이디어 제출',
      challengeCompleted: '🎯 챌린지 참여 완료!',
      challengeReward: '챌린지 보상 획득'
    },
    en: {
      urgentChallenge: '🔥 Urgent Challenge',
      hoursLeft: 'hours left',
      peopleWorking: 'people working simultaneously',
      joined: 'Completed!',
      joinNow: 'Submit Idea',
      submitIdea: 'Submit idea for this theme',
      challengeCompleted: '🎯 Challenge Completed!',
      challengeReward: 'Challenge reward earned'
    }
  };

  // Generate today's challenge
  useEffect(() => {
    const generateTodayChallenge = () => {
      const challenges = {
        ko: [
          {
            keyword: '2028 올림픽 스타트업',
            theme: '스포츠테크',
            description: '파리 올림픽에서 놓친 기회를 2028 LA에서 잡을 아이디어'
          },
          {
            keyword: 'AI 대선 캠페인',
            theme: '폴리테크',
            description: '2028년 한국 대선에서 활용될 AI 기술 아이디어'
          },
          {
            keyword: '외계인 관광 서비스',
            theme: '스페이스테크',
            description: 'NASA 발표 이후 급상승할 우주 관광 아이디어'
          }
        ],
        en: [
          {
            keyword: '2028 Olympics Startup',
            theme: 'SportsTech',
            description: 'Ideas to capture opportunities missed in Paris Olympics for LA 2028'
          },
          {
            keyword: 'AI Election Campaign',
            theme: 'PoliTech', 
            description: 'AI technology ideas for the 2028 Korean presidential election'
          },
          {
            keyword: 'Alien Tourism Service',
            theme: 'SpaceTech',
            description: 'Space tourism ideas that will skyrocket after NASA announcements'
          }
        ]
      };

      const todayIndex = new Date().getDate() % challenges[currentLanguage].length;
      const challenge = challenges[currentLanguage][todayIndex];
      
      const deadline = new Date();
      deadline.setHours(23, 59, 59, 999);

      const challengeData = {
        id: `daily-${new Date().toDateString()}`,
        date: new Date().toDateString(),
        keyword: challenge.keyword,
        theme: challenge.theme,
        description: challenge.description,
        deadline,
        participantCount: Math.floor(Math.random() * 50) + 20,
        isUrgent: true,
        reward: {
          xp: 100,
          badge: '🏆 Daily Pioneer',
          vcPriority: true
        }
      };

      setTodayChallenge(challengeData);
      setChallengeKeyword(challenge.keyword);
    };

    generateTodayChallenge();
  }, [currentLanguage]);

  // Check if user has participated in today's challenge
  useEffect(() => {
    const checkParticipation = async () => {
      if (!user || !todayChallenge) return;

      try {
        const today = new Date().toDateString();
        const { data: ideas } = await supabase
          .from('ideas')
          .select('id, created_at, text, tags')
          .eq('user_id', user.id)
          .gte('created_at', new Date(today).toISOString())
          .lt('created_at', new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000).toISOString());

        if (ideas && ideas.length > 0) {
          // Check if any idea contains the challenge keyword or has challenge tag
          const participatedIdea = ideas.find(idea => 
            idea.text.toLowerCase().includes(challengeKeyword.toLowerCase()) ||
            idea.tags?.includes('daily-challenge') ||
            idea.tags?.includes(todayChallenge.theme)
          );
          
          if (participatedIdea) {
            setHasParticipated(true);
          }
        }
      } catch (error) {
        console.error('Error checking challenge participation:', error);
      }
    };

    checkParticipation();
  }, [user, todayChallenge, challengeKeyword]);

  // Update live participants and countdown
  useEffect(() => {
    const interval = setInterval(() => {
      if (todayChallenge) {
        // Update live participants
        setLiveParticipants(prev => {
          const change = Math.floor(Math.random() * 3) - 1;
          return Math.max(3, prev + change);
        });

        // Update countdown
        const now = new Date();
        const diff = todayChallenge.deadline.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}${text[currentLanguage].hoursLeft} ${minutes}분`);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [todayChallenge, currentLanguage]);

  const markChallengeCompleted = async (ideaId: string) => {
    if (!user || !todayChallenge) return;

    try {
      // Update the idea with challenge tags
      await supabase
        .from('ideas')
        .update({ 
          tags: ['daily-challenge', todayChallenge.theme, '챌린지참여']
        })
        .eq('id', ideaId);

      setHasParticipated(true);
      
      toast({
        title: text[currentLanguage].challengeCompleted,
        description: `+${todayChallenge.reward.xp} XP + VC 우선 노출 + ${todayChallenge.reward.badge}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error marking challenge completed:', error);
    }
  };

  const scrollToIdeaForm = () => {
    // Smooth scroll to the idea submission form
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return {
    todayChallenge,
    liveParticipants,
    timeRemaining,
    hasParticipated,
    challengeKeyword,
    markChallengeCompleted,
    scrollToIdeaForm,
    text
  };
};
