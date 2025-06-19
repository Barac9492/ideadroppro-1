
import React, { useState, useEffect } from 'react';
import { Flame, Award } from 'lucide-react';
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
      streakCounter: '연속 아이디어 제출',
      days: '일째',
      maxRecord: '최고',
      todayDone: '오늘 완료!',
      badges: '획득 배지',
      noBadges: '배지 없음',
      streakDescription: '매일 아이디어를 제출하여 연속기록을 쌓아보세요!',
    },
    en: {
      streakCounter: 'Daily Idea Streak',
      days: 'days',
      maxRecord: 'Best',
      todayDone: 'Today done!',
      badges: 'Badges',
      noBadges: 'No badges',
      streakDescription: 'Submit ideas daily to build your streak!',
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
        .maybeSingle();

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
    <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl shadow-lg p-3 mb-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className="h-4 w-4" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold">{streak?.current_streak || 0}</span>
              <span className="text-xs opacity-80">{text[currentLanguage].days}</span>
              {isSubmittedToday() && (
                <Badge variant="secondary" className="bg-white/20 text-white text-xs px-2 py-0">
                  ✅
                </Badge>
              )}
            </div>
            <p className="text-xs opacity-80">{text[currentLanguage].streakDescription}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs opacity-80">{text[currentLanguage].maxRecord}</div>
          <div className="text-sm font-semibold">{streak?.max_streak || 0}</div>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Award className="h-3 w-3" />
              <span className="text-xs">{text[currentLanguage].badges}</span>
            </div>
            <div className="flex space-x-1">
              {badges.slice(0, 3).map((badge) => (
                <span key={badge.badge_type} className="text-sm">
                  {badge.badge_emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakBadge;
