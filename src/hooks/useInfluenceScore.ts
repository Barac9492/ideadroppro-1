import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { subscriptionManager } from '@/utils/subscriptionManager';

interface InfluenceScore {
  id: string;
  total_score: number;
  weekly_score: number;
  monthly_score: number;
  user_id: string;
}

interface ScoreLog {
  id: string;
  action_type: string;
  points: number;
  description: string | null;
  created_at: string;
}

export const useInfluenceScore = () => {
  const [score, setScore] = useState<InfluenceScore | null>(null);
  const [logs, setLogs] = useState<ScoreLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const componentId = useRef(`influence-${Math.random().toString(36).substring(7)}`);
  const subscriptionKeys = useRef<string[]>([]);

  const fetchInfluenceScore = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_influence_scores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching influence score:', error);
        return;
      }

      setScore(data || null);
    } catch (error) {
      console.error('Error fetching influence score:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScoreLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('influence_score_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching score logs:', error);
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching score logs:', error);
    }
  };

  const updateScore = async (
    actionType: string, 
    points: number, 
    description?: string, 
    referenceId?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('update_influence_score', {
        p_user_id: user.id,
        p_action_type: actionType,
        p_points: points,
        p_description: description,
        p_reference_id: referenceId
      });

      if (error) {
        console.error('Error updating influence score:', error);
        return;
      }

      // Refresh score and logs
      await Promise.all([fetchInfluenceScore(), fetchScoreLogs()]);

      // Show toast for positive points
      if (points > 0) {
        toast({
          title: `🎉 +${points} 영향력 점수!`,
          description: description || `${actionType} 활동으로 점수를 획득했습니다.`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating influence score:', error);
    }
  };

  // Predefined score actions
  const scoreActions = {
    inviteSuccess: (count = 1) => updateScore('친구 초대 성공', 50 * count, `${count}명의 친구가 가입하고 아이디어를 제출했습니다`),
    friendRemix: (count = 1) => updateScore('초대 친구 리믹스', 10 * count, `초대한 친구가 ${count}개의 리믹스를 생성했습니다`),
    ideaRemixed: (count = 1) => updateScore('아이디어 리믹스됨', 5 * count, `내 아이디어가 ${count}번 리믹스되었습니다`),
    vcInterest: (count = 1) => updateScore('VC 관심 표시', 20 * count, `내 아이디어에 ${count}명의 VC가 관심을 표시했습니다`),
    dailyStreak: () => updateScore('3일 연속 제출', 15, '3일 연속 아이디어를 제출했습니다'),
    keywordParticipation: () => updateScore('오늘의 키워드 참여', 10, '오늘의 키워드에 참여했습니다')
  };

  useEffect(() => {
    fetchInfluenceScore();
    fetchScoreLogs();
  }, [user]);

  // Set up real-time subscription for score changes
  useEffect(() => {
    if (!user) return;

    // Clean up existing subscriptions
    subscriptionKeys.current.forEach(key => {
      subscriptionManager.unsubscribe(key);
    });
    subscriptionKeys.current = [];

    // Set up score subscription
    const scoreKey = subscriptionManager.subscribe(
      'influence-score-changes',
      componentId.current,
      {
        event: '*',
        schema: 'public',
        table: 'user_influence_scores',
        filter: `user_id=eq.${user.id}`
      },
      () => {
        fetchInfluenceScore();
      }
    );

    // Set up logs subscription
    const logsKey = subscriptionManager.subscribe(
      'influence-logs-changes',
      componentId.current,
      {
        event: 'INSERT',
        schema: 'public',
        table: 'influence_score_logs',
        filter: `user_id=eq.${user.id}`
      },
      () => {
        fetchScoreLogs();
      }
    );

    subscriptionKeys.current = [scoreKey, logsKey];

    return () => {
      subscriptionKeys.current.forEach(key => {
        subscriptionManager.unsubscribe(key);
      });
      subscriptionKeys.current = [];
    };
  }, [user]);

  return {
    score,
    logs,
    loading,
    updateScore,
    scoreActions,
    fetchInfluenceScore,
    fetchScoreLogs
  };
};
