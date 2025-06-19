
import React, { useState, useEffect } from 'react';
import { Flame, Award, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

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

interface StreakBadgeProps {
  currentLanguage: 'ko' | 'en';
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ currentLanguage }) => {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const text = {
    ko: {
      currentStreak: '현재 연속기록',
      maxStreak: '최고 기록',
      days: '일',
      streakBroken: '연속기록이 끊어졌습니다!',
      keepGoing: '계속해보세요!',
      badges: '획득한 배지',
      noBadges: '아직 배지가 없습니다.',
      todaySubmission: '오늘 제출 완료!',
    },
    en: {
      currentStreak: 'Current Streak',
      maxStreak: 'Max Streak',
      days: 'days',
      streakBroken: 'Streak broken!',
      keepGoing: 'Keep going!',
      badges: 'Earned Badges',
      noBadges: 'No badges yet.',
      todaySubmission: 'Today submitted!',
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

  const isSubmittedToday = () => {
    if (!streak?.last_submission_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return streak.last_submission_date === today;
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl shadow-xl p-4 mb-6 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Flame className="h-5 w-5" />
          <h3 className="font-bold">{text[currentLanguage].currentStreak}</h3>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-2xl font-bold">{streak?.current_streak || 0}</span>
          <span className="text-sm opacity-80">{text[currentLanguage].days}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2 text-sm opacity-80">
          <Trophy className="h-4 w-4" />
          <span>{text[currentLanguage].maxStreak}: {streak?.max_streak || 0}</span>
        </div>
        {isSubmittedToday() && (
          <Badge variant="secondary" className="bg-white/20 text-white">
            ✅ {text[currentLanguage].todaySubmission}
          </Badge>
        )}
      </div>

      {badges.length > 0 && (
        <div className="border-t border-white/20 pt-3">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-4 w-4" />
            <span className="text-sm font-medium">{text[currentLanguage].badges}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge
                key={badge.badge_type}
                variant="outline"
                className="bg-white/10 border-white/30 text-white"
              >
                {badge.badge_emoji} {badge.badge_type.replace('streak_', '')}일
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakBadge;
