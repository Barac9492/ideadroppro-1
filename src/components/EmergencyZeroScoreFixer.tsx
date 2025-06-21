
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Zap, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EmergencyZeroScoreFixerProps {
  currentLanguage: 'ko' | 'en';
  onComplete?: () => void;
}

const EmergencyZeroScoreFixer: React.FC<EmergencyZeroScoreFixerProps> = ({ 
  currentLanguage, 
  onComplete 
}) => {
  const [fixing, setFixing] = useState(false);
  const [zeroScoreCount, setZeroScoreCount] = useState(0);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const text = {
    ko: {
      title: '🚨 0점 아이디어 긴급 수정',
      description: '현재 0점인 아이디어를 즉시 수정합니다',
      fixNow: '지금 즉시 수정',
      fixing: '수정 중...',
      checkingStatus: '상태 확인 중...',
      found: '개 0점 아이디어 발견',
      allFixed: '모든 아이디어가 정상적으로 점수를 받았습니다!',
      fixComplete: '긴급 수정 완료!',
      updated: '개 아이디어 수정됨',
      refreshing: '새로고침 중...'
    },
    en: {
      title: '🚨 Emergency 0-Score Fix',
      description: 'Immediately fix all 0-score ideas',
      fixNow: 'Fix Now',
      fixing: 'Fixing...',
      checkingStatus: 'Checking status...',
      found: ' 0-score ideas found',
      allFixed: 'All ideas have proper scores!',
      fixComplete: 'Emergency fix complete!',
      updated: ' ideas updated',
      refreshing: 'Refreshing...'
    }
  };

  const checkZeroScores = async () => {
    try {
      const { count } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .or('score.eq.0,score.is.null')
        .eq('seed', false);
      
      setZeroScoreCount(count || 0);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Error checking zero scores:', error);
    }
  };

  const executeEmergencyFix = async () => {
    setFixing(true);
    
    try {
      console.log('🚨 Starting emergency fix...');
      
      toast({
        title: text[currentLanguage].fixing,
        duration: 2000,
      });

      // Call the admin force update function
      const { data, error } = await supabase.functions.invoke('admin-force-score-update', {
        body: { action: 'fix_all_zero_scores' }
      });

      if (error) {
        console.error('❌ Emergency fix failed:', error);
        throw error;
      }

      console.log('✅ Emergency fix result:', data);

      toast({
        title: `${text[currentLanguage].fixComplete} - ${data.updated}${text[currentLanguage].updated}`,
        duration: 5000,
      });

      // Refresh the count
      await checkZeroScores();
      
      // Call completion callback
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }

    } catch (error: any) {
      console.error('💥 Emergency fix failed:', error);
      toast({
        title: '긴급 수정 실패',
        description: error.message || 'Unknown error',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setFixing(false);
    }
  };

  useEffect(() => {
    checkZeroScores();
    // Check every 30 seconds
    const interval = setInterval(checkZeroScores, 30000);
    return () => clearInterval(interval);
  }, []);

  if (zeroScoreCount === 0) {
    return (
      <Card className="bg-green-50 border-green-200 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              {text[currentLanguage].allFixed}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-red-50 border-red-200 mb-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-3 border-l-4 border-red-500">
            <p className="text-sm text-red-700">
              <strong>{zeroScoreCount}{text[currentLanguage].found}</strong>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              마지막 확인: {lastCheck.toLocaleTimeString()}
            </p>
          </div>
          
          <Button
            onClick={executeEmergencyFix}
            disabled={fixing}
            className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ${
              fixing 
                ? 'bg-red-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg transform hover:scale-105'
            }`}
          >
            {fixing ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{text[currentLanguage].fixing}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>{text[currentLanguage].fixNow}</span>
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyZeroScoreFixer;
