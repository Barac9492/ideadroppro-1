
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useSemanticAutomation } from '@/hooks/useSemanticAutomation';
import { 
  Settings, 
  Play, 
  Pause, 
  Clock, 
  Activity, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface SemanticAutomationManagerProps {
  currentLanguage: 'ko' | 'en';
}

const SemanticAutomationManager: React.FC<SemanticAutomationManagerProps> = ({ 
  currentLanguage 
}) => {
  const { 
    status, 
    logs, 
    loading, 
    updateConfig, 
    triggerManualClustering,
    refresh
  } = useSemanticAutomation();

  const text = {
    ko: {
      title: '🤖 자동화 시스템 관리',
      autoEmbedding: '자동 임베딩 생성',
      autoClustering: '자동 클러스터링',
      manualClustering: '수동 클러스터링 실행',
      refresh: '새로고침',
      settings: '자동화 설정',
      status: '시스템 상태',
      statistics: '통계',
      recentActivity: '최근 활동',
      totalModules: '전체 모듈',
      withEmbeddings: '임베딩 완료',
      withoutEmbeddings: '임베딩 대기',
      totalClusters: '클러스터 수',
      clusteredModules: '클러스터링 완료',
      embeddingsLast24h: '24시간 임베딩',
      clusteringsLastWeek: '1주일 클러스터링',
      lastClustering: '마지막 클러스터링',
      never: '없음',
      pending: '대기',
      running: '실행중',
      completed: '완료',
      failed: '실패',
      auto: '자동',
      manual: '수동',
      scheduled: '예약',
      embedding: '임베딩',
      clustering: '클러스터링',
      loading: '로딩 중...',
      noData: '데이터 없음'
    },
    en: {
      title: '🤖 Automation System Management',
      autoEmbedding: 'Auto Embedding Generation',
      autoClustering: 'Auto Clustering',
      manualClustering: 'Run Manual Clustering',
      refresh: 'Refresh',
      settings: 'Automation Settings',
      status: 'System Status',
      statistics: 'Statistics',
      recentActivity: 'Recent Activity',
      totalModules: 'Total Modules',
      withEmbeddings: 'With Embeddings',
      withoutEmbeddings: 'Without Embeddings',
      totalClusters: 'Total Clusters',
      clusteredModules: 'Clustered Modules',
      embeddingsLast24h: '24h Embeddings',
      clusteringsLastWeek: '1w Clusterings',
      lastClustering: 'Last Clustering',
      never: 'Never',
      pending: 'Pending',
      running: 'Running',
      completed: 'Completed',
      failed: 'Failed',
      auto: 'Auto',
      manual: 'Manual',
      scheduled: 'Scheduled',
      embedding: 'Embedding',
      clustering: 'Clustering',
      loading: 'Loading...',
      noData: 'No Data'
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'running': return 'bg-blue-100 text-blue-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case 'auto': return 'bg-green-100 text-green-700';
      case 'manual': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">{text[currentLanguage].loading}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">{text[currentLanguage].noData}</p>
        </CardContent>
      </Card>
    );
  }

  const embeddingProgress = status.total_modules > 0 
    ? (status.modules_with_embeddings / status.total_modules) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* 시스템 상태 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>{text[currentLanguage].title}</span>
            </div>
            <Button
              onClick={refresh}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{text[currentLanguage].refresh}</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 자동화 설정 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{text[currentLanguage].autoEmbedding}</span>
              <Switch
                checked={status.auto_embedding_enabled}
                onCheckedChange={(enabled) => updateConfig({ auto_embedding_enabled: enabled })}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{text[currentLanguage].autoClustering}</span>
              <Switch
                checked={status.auto_clustering_enabled}
                onCheckedChange={(enabled) => updateConfig({ auto_clustering_enabled: enabled })}
              />
            </div>
          </div>

          {/* 수동 클러스터링 버튼 */}
          <div className="flex justify-center">
            <Button
              onClick={triggerManualClustering}
              className="flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{text[currentLanguage].manualClustering}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 통계 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>{text[currentLanguage].statistics}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 임베딩 진행률 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>임베딩 진행률</span>
              <span>{Math.round(embeddingProgress)}%</span>
            </div>
            <Progress value={embeddingProgress} />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{status.modules_with_embeddings} / {status.total_modules} 모듈</span>
              <span>{status.modules_without_embeddings}개 대기</span>
            </div>
          </div>

          <Separator />

          {/* 통계 그리드 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{status.total_clusters}</div>
              <div className="text-sm text-gray-600">{text[currentLanguage].totalClusters}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{status.clustered_modules}</div>
              <div className="text-sm text-gray-600">{text[currentLanguage].clusteredModules}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{status.embeddings_last_24h}</div>
              <div className="text-sm text-gray-600">{text[currentLanguage].embeddingsLast24h}</div>
            </div>
          </div>

          {/* 마지막 클러스터링 */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">{text[currentLanguage].lastClustering}</span>
            <span className="text-sm text-gray-600">
              {status.last_clustering_date 
                ? new Date(status.last_clustering_date).toLocaleDateString('ko-KR')
                : text[currentLanguage].never
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 최근 활동 로그 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>{text[currentLanguage].recentActivity}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-center text-gray-500 py-4">{text[currentLanguage].noData}</p>
          ) : (
            <div className="space-y-3">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(log.status)}>
                          {text[currentLanguage][log.status as keyof typeof text[typeof currentLanguage]]}
                        </Badge>
                        <Badge className={getTriggerColor(log.trigger_type)}>
                          {text[currentLanguage][log.trigger_type as keyof typeof text[typeof currentLanguage]]}
                        </Badge>
                        <span className="font-medium">
                          {text[currentLanguage][log.operation_type as keyof typeof text[typeof currentLanguage]]}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {log.operation_type === 'embedding' 
                          ? `${log.modules_processed}개 모듈 처리`
                          : `${log.clusters_created}개 클러스터 생성`
                        }
                        {log.error_message && (
                          <span className="text-red-600 ml-2">• {log.error_message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SemanticAutomationManager;
