
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface UserStreak {
  current_streak: number;
  max_streak: number;
  last_submission_date: string | null;
}

interface UserBadge {
  badge_type: string;
  badge_emoji: string;
  earned_at: string;
}

export const useStreaks = (currentLanguage: 'ko' | 'en') => {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const text = {
    ko: {
      streakBadgeEarned: '연속 제출 배지 획득!',
      streakBadgeDesc: '일 연속 아이디어 제출을 달성했습니다!',
    },
    en: {
      streakBadgeEarned: 'Streak Badge Earned!',
      streakBadgeDesc: 'days consecutive idea submissions achieved!',
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch streak data
      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setStreak(streakData);

      // Fetch badges
      const { data: badgeData } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      setBadges(badgeData || []);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async () => {
    if (!user) return;

    try {
      // Call the database function to update streak
      await supabase.rpc('update_user_streak', {
        p_user_id: user.id
      });

      // Refresh stats
      await fetchUserStats();

      // Check for new badges and show toast
      const { data: newBadges } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })
        .limit(1);

      const latestBadge = newBadges?.[0];
      if (latestBadge && !badges.find(b => b.badge_type === latestBadge.badge_type)) {
        const streakDays = latestBadge.badge_type.replace('streak_', '');
        toast({
          title: text[currentLanguage].streakBadgeEarned,
          description: `${latestBadge.badge_emoji} ${streakDays}${text[currentLanguage].streakBadgeDesc}`,
          duration: 5000,
        });
      }

    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  return {
    streak,
    badges,
    loading,
    updateStreak,
    refreshStats: fetchUserStats
  };
};
