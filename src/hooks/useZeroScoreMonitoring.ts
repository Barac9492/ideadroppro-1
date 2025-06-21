
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ZeroScoreStats {
  totalIdeas: number;
  zeroScoreCount: number;
  recentZeroScores: number;
  lastCheck: Date;
}

export const useZeroScoreMonitoring = (currentLanguage: 'ko' | 'en') => {
  const [stats, setStats] = useState<ZeroScoreStats>({
    totalIdeas: 0,
    zeroScoreCount: 0,
    recentZeroScores: 0,
    lastCheck: new Date()
  });
  const [monitoring, setMonitoring] = useState(false);

  const text = {
    ko: {
      zeroScoreAlert: '⚠️ 새로운 0점 아이디어 발견!',
      autoFixSuccess: '✅ 자동 수정 완료',
      monitoringActive: '🔍 0점 모니터링 활성화',
      criticalAlert: '🚨 긴급: 다수의 0점 아이디어 발견'
    },
    en: {
      zeroScoreAlert: '⚠️ New 0-score ideas detected!',
      autoFixSuccess: '✅ Auto-fix completed',
      monitoringActive: '🔍 Zero-score monitoring active',
      criticalAlert: '🚨 Critical: Multiple 0-score ideas found'
    }
  };

  // 0점 아이디어 통계 조회
  const checkZeroScoreStats = async (): Promise<ZeroScoreStats> => {
    try {
      // 전체 아이디어 수
      const { count: totalIdeas } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('seed', false);

      // 0점 아이디어 수
      const { count: zeroScoreCount } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .or('score.eq.0,score.is.null')
        .eq('seed', false);

      // 최근 1시간 내 0점 아이디어
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      const { count: recentZeroScores } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .or('score.eq.0,score.is.null')
        .eq('seed', false)
        .gte('created_at', oneHourAgo.toISOString());

      const newStats = {
        totalIdeas: totalIdeas || 0,
        zeroScoreCount: zeroScoreCount || 0,
        recentZeroScores: recentZeroScores || 0,
        lastCheck: new Date()
      };

      setStats(newStats);
      return newStats;
    } catch (error) {
      console.error('Error checking zero score stats:', error);
      return stats;
    }
  };

  // 자동 수정 시도
  const attemptAutoFix = async () => {
    try {
      console.log('🔧 Attempting auto-fix for zero scores...');
      
      const { data, error } = await supabase.functions.invoke('admin-force-score-update', {
        body: { action: 'fix_all_zero_scores' }
      });

      if (error) throw error;

      if (data.updated > 0) {
        toast({
          title: `${text[currentLanguage].autoFixSuccess}: ${data.updated}개`,
          duration: 4000,
        });
        
        // 통계 재확인
        await checkZeroScoreStats();
      }
    } catch (error) {
      console.error('Auto-fix failed:', error);
    }
  };

  // 모니터링 시작
  const startMonitoring = () => {
    if (monitoring) return;
    
    setMonitoring(true);
    console.log('🔍 Starting zero-score monitoring...');
    
    toast({
      title: text[currentLanguage].monitoringActive,
      duration: 3000,
    });

    // 초기 체크
    checkZeroScoreStats();

    // 5분마다 체크
    const interval = setInterval(async () => {
      const newStats = await checkZeroScoreStats();
      
      // 경고 조건: 0점 아이디어가 5개 이상이거나 최근 1시간에 3개 이상 생성
      if (newStats.zeroScoreCount >= 5 || newStats.recentZeroScores >= 3) {
        toast({
          title: text[currentLanguage].criticalAlert,
          description: `0점 아이디어: ${newStats.zeroScoreCount}개, 최근: ${newStats.recentZeroScores}개`,
          variant: 'destructive',
          duration: 8000,
        });
        
        // 자동 수정 시도
        await attemptAutoFix();
      } else if (newStats.zeroScoreCount > 0) {
        toast({
          title: text[currentLanguage].zeroScoreAlert,
          description: `${newStats.zeroScoreCount}개 발견`,
          duration: 5000,
        });
      }
    }, 5 * 60 * 1000); // 5분

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      clearInterval(interval);
      setMonitoring(false);
    };
  };

  // 모니터링 중단
  const stopMonitoring = () => {
    setMonitoring(false);
  };

  useEffect(() => {
    // 초기 통계 로드
    checkZeroScoreStats();
  }, []);

  return {
    stats,
    monitoring,
    startMonitoring,
    stopMonitoring,
    checkZeroScoreStats,
    attemptAutoFix
  };
};
