
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSemanticModules } from '@/hooks/useSemanticModules';
import { Brain, Zap, Network, Eye, Settings2 } from 'lucide-react';
import SemanticAutomationManager from './SemanticAutomationManager';

interface SemanticModuleManagerProps {
  currentLanguage: 'ko' | 'en';
}

const SemanticModuleManager: React.FC<SemanticModuleManagerProps> = ({ 
  currentLanguage 
}) => {
  const { 
    generateEmbeddings, 
    clusterModules, 
    getModuleClusters,
    isProcessing 
  } = useSemanticModules();
  
  const [clusters, setClusters] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalModules: 0,
    clusteredModules: 0,
    totalClusters: 0
  });

  useEffect(() => {
    loadClusters();
  }, []);

  const loadClusters = async () => {
    const clusterData = await getModuleClusters();
    setClusters(clusterData);
    
    const totalClusters = clusterData.length;
    const totalModules = clusterData.reduce((sum, c) => sum + (c.member_count || 0), 0);
    
    setStats({
      totalModules,
      clusteredModules: totalModules,
      totalClusters
    });
  };

  const handleGenerateEmbeddings = async () => {
    await generateEmbeddings();
    await loadClusters();
  };

  const handleClusterModules = async () => {
    await clusterModules();
    await loadClusters();
  };

  const text = {
    ko: {
      title: '의미 기반 모듈 분석',
      automation: '자동화 관리',
      manual: '수동 실행',
      generateEmbeddings: '임베딩 생성',
      clusterModules: '클러스터링 실행',
      totalModules: '전체 모듈',
      clusteredModules: '분류된 모듈',
      totalClusters: '클러스터 수',
      processing: '처리 중...',
      clusters: '모듈 클러스터',
      members: '개 모듈',
      noData: '데이터 없음'
    },
    en: {
      title: 'Semantic Module Analysis',
      automation: 'Automation Management',
      manual: 'Manual Execution',
      generateEmbeddings: 'Generate Embeddings',
      clusterModules: 'Run Clustering',
      totalModules: 'Total Modules',
      clusteredModules: 'Clustered Modules',
      totalClusters: 'Clusters',
      processing: 'Processing...',
      clusters: 'Module Clusters',
      members: ' modules',
      noData: 'No Data'
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>{text[currentLanguage].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="automation" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="automation" className="flex items-center space-x-2">
                <Settings2 className="w-4 h-4" />
                <span>{text[currentLanguage].automation}</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>{text[currentLanguage].manual}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="automation" className="space-y-4">
              <SemanticAutomationManager currentLanguage={currentLanguage} />
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              {/* 수동 제어 버튼 */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleGenerateEmbeddings}
                  disabled={isProcessing}
                  className="flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {isProcessing ? text[currentLanguage].processing : text[currentLanguage].generateEmbeddings}
                  </span>
                </Button>
                
                <Button
                  onClick={handleClusterModules}
                  disabled={isProcessing}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Network className="w-4 h-4" />
                  <span>
                    {isProcessing ? text[currentLanguage].processing : text[currentLanguage].clusterModules}
                  </span>
                </Button>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalModules}</div>
                  <div className="text-sm text-gray-600">{text[currentLanguage].totalModules}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.clusteredModules}</div>
                  <div className="text-sm text-gray-600">{text[currentLanguage].clusteredModules}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalClusters}</div>
                  <div className="text-sm text-gray-600">{text[currentLanguage].totalClusters}</div>
                </div>
              </div>

              {/* 진행률 */}
              {stats.totalModules > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>클러스터링 진행률</span>
                    <span>{Math.round((stats.clusteredModules / stats.totalModules) * 100)}%</span>
                  </div>
                  <Progress value={(stats.clusteredModules / stats.totalModules) * 100} />
                </div>
              )}

              {/* 클러스터 표시 */}
              {clusters.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>{text[currentLanguage].clusters}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {clusters.map((cluster) => (
                        <div key={cluster.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="bg-white">
                              #{cluster.cluster_id}
                            </Badge>
                            <span className="font-medium">{cluster.cluster_label}</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700">
                            {cluster.member_count}{text[currentLanguage].members}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {clusters.length === 0 && !isProcessing && (
                <Card>
                  <CardContent className="text-center py-8">
                    <div className="text-gray-500">{text[currentLanguage].noData}</div>
                    <p className="text-sm text-gray-400 mt-2">
                      {currentLanguage === 'ko' 
                        ? '임베딩 생성부터 시작해보세요' 
                        : 'Start by generating embeddings'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SemanticModuleManager;
