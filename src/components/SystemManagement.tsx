
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, AlertCircle, CheckCircle, BarChart3, Shield, Eye, EyeOff } from 'lucide-react';
import BulkAnalysisButton from './BulkAnalysisButton';
import AdminForceUpdatePanel from './AdminForceUpdatePanel';
import { useIdeas } from '@/hooks/useIdeas';
import { useZeroScoreMonitoring } from '@/hooks/useZeroScoreMonitoring';
import { supabase } from '@/integrations/supabase/client';

interface SystemManagementProps {
  currentLanguage: 'ko' | 'en';
}

const SystemManagement: React.FC<SystemManagementProps> = ({ currentLanguage }) => {
  const { fetchIdeas } = useIdeas(currentLanguage);
  const { 
    stats, 
    monitoring, 
    startMonitoring, 
    stopMonitoring, 
    checkZeroScoreStats,
    attemptAutoFix 
  } = useZeroScoreMonitoring(currentLanguage);
  
  const [systemStats, setSystemStats] = useState({
    totalIdeas: 0,
    zeroScoreIdeas: 0,
    analyzedIdeas: 0,
    loading: true
  });

  const text = {
    ko: {
      title: '시스템 관리',
      description: '시스템 전반의 관리 도구와 분석 기능을 제공합니다.',
      analysisTools: '분석 도구',
      analysisDescription: '아이디어 분석 및 점수 관리 도구',
      systemStatus: '시스템 상태',
      totalIdeas: '전체 아이디어',
      zeroScoreIdeas: '0점 아이디어',
      analyzedIdeas: '분석 완료',
      systemHealthy: '시스템 정상',
      systemNeedsAttention: '관리 필요',
      refreshStats: '통계 새로고침',
      adminTools: '관리자 도구',
      adminDescription: '강력한 관리자 전용 수정 도구',
      monitoring: '자동 모니터링',
      monitoringDescription: '0점 아이디어 실시간 감지 및 자동 수정',
      startMonitoring: '모니터링 시작',
      stopMonitoring: '모니터링 중단',
      monitoringActive: '모니터링 활성화됨',
      monitoringInactive: '모니터링 비활성화됨',
      autoFix: '자동 수정 실행',
      lastCheck: '마지막 확인',
      recentZeros: '최근 0점'
    },
    en: {
      title: 'System Management',
      description: 'Provides system-wide management tools and analysis features.',
      analysisTools: 'Analysis Tools',
      analysisDescription: 'Idea analysis and score management tools',
      systemStatus: 'System Status',
      totalIdeas: 'Total Ideas',
      zeroScoreIdeas: '0-Score Ideas',
      analyzedIdeas: 'Analyzed Ideas',
      systemHealthy: 'System Healthy',
      systemNeedsAttention: 'Needs Attention',
      refreshStats: 'Refresh Stats',
      adminTools: 'Admin Tools',
      adminDescription: 'Powerful administrator-only fix tools',
      monitoring: 'Auto Monitoring',
      monitoringDescription: 'Real-time 0-score detection and auto-fix',
      startMonitoring: 'Start Monitoring',
      stopMonitoring: 'Stop Monitoring',
      monitoringActive: 'Monitoring Active',
      monitoringInactive: 'Monitoring Inactive',
      autoFix: 'Run Auto Fix',
      lastCheck: 'Last Check',
      recentZeros: 'Recent Zeros'
    }
  };

  const fetchSystemStats = async () => {
    try {
      setSystemStats(prev => ({ ...prev, loading: true }));
      
      const { count: totalIdeas } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('seed', false);

      const { count: zeroScoreIdeas } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .or('score.eq.0,score.is.null')
        .eq('seed', false);

      const { count: analyzedIdeas } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .gt('score', 0)
        .not('ai_analysis', 'is', null)
        .eq('seed', false);

      setSystemStats({
        totalIdeas: totalIdeas || 0,
        zeroScoreIdeas: zeroScoreIdeas || 0,
        analyzedIdeas: analyzedIdeas || 0,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
      setSystemStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePostAnalysisRefresh = async () => {
    await fetchIdeas();
    await fetchSystemStats();
    await checkZeroScoreStats();
  };

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const isSystemHealthy = systemStats.zeroScoreIdeas === 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>{text[currentLanguage].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            {text[currentLanguage].description}
          </p>

          {/* System Status Dashboard */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>{text[currentLanguage].systemStatus}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{text[currentLanguage].totalIdeas}</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {systemStats.loading ? '...' : systemStats.totalIdeas}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${systemStats.zeroScoreIdeas > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${systemStats.zeroScoreIdeas > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                      <AlertCircle className={`h-4 w-4 ${systemStats.zeroScoreIdeas > 0 ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{text[currentLanguage].zeroScoreIdeas}</p>
                      <p className={`text-2xl font-bold ${systemStats.zeroScoreIdeas > 0 ? 'text-re-600' : 'text-green-600'}`}>
                        {systemStats.loading ? '...' : systemStats.zeroScoreIdeas}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{text[currentLanguage].analyzedIdeas}</p>
                      <p className="text-2xl font-bold text-green-600">
                        {systemStats.loading ? '...' : systemStats.analyzedIdeas}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${monitoring ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${monitoring ? 'bg-purple-100' : 'bg-gray-100'}`}>
                      {monitoring ? (
                        <Eye className="h-4 w-4 text-purple-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{text[currentLanguage].recentZeros}</p>
                      <p className={`text-2xl font-bold ${monitoring ? 'text-purple-600' : 'text-gray-600'}`}>
                        {stats.recentZeroScores}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {isSystemHealthy ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-semibold">{text[currentLanguage].systemHealthy}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-semibold">{text[currentLanguage].systemNeedsAttention}</span>
                  </>
                )}
                <span className="text-sm text-gray-500">
                  ({text[currentLanguage].lastCheck}: {stats.lastCheck.toLocaleTimeString()})
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={checkZeroScoreStats}
                  size="sm"
                  variant="outline"
                >
                  {text[currentLanguage].refreshStats}
                </Button>
                <Button
                  onClick={attemptAutoFix}
                  size="sm"
                  variant="outline"
                  className="text-blue-600"
                >
                  {text[currentLanguage].autoFix}
                </Button>
              </div>
            </div>
          </div>

          {/* Auto Monitoring System */}
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Eye className="h-5 w-5 text-purple-600" />
                  <span>{text[currentLanguage].monitoring}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    monitoring 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {monitoring 
                      ? text[currentLanguage].monitoringActive 
                      : text[currentLanguage].monitoringInactive
                    }
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {text[currentLanguage].monitoringDescription}
                </p>
                <Button
                  onClick={monitoring ? stopMonitoring : startMonitoring}
                  className={`${
                    monitoring 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white`}
                >
                  {monitoring ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      {text[currentLanguage].stopMonitoring}
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      {text[currentLanguage].startMonitoring}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Admin Force Update Panel */}
          <div className="mb-6">
            <AdminForceUpdatePanel 
              currentLanguage={currentLanguage}
              onUpdateComplete={handlePostAnalysisRefresh}
            />
          </div>

          {/* Original Analysis Tools */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>{text[currentLanguage].analysisTools}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {text[currentLanguage].analysisDescription}
                </p>
                <BulkAnalysisButton 
                  currentLanguage={currentLanguage}
                  fetchIdeas={handlePostAnalysisRefresh}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemManagement;
