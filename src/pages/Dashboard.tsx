
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import InfluenceScoreDisplay from '@/components/InfluenceScoreDisplay';
import InvitationManager from '@/components/InvitationManager';
import TopInfluencersBoard from '@/components/TopInfluencersBoard';
import { useAuth } from '@/contexts/AuthContext';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Zap, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user, loading: authLoading } = useAuth();
  const { logs, loading: scoreLoading } = useInfluenceScore();
  const navigate = useNavigate();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Redirect if not authenticated
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case '친구 초대 성공': return <Users className="w-4 h-4 text-green-500" />;
      case '초대 친구 리믹스': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'VC 관심 표시': return <Gift className="w-4 h-4 text-purple-500" />;
      default: return <Zap className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
          <p className="text-gray-600">영향력 점수를 관리하고 친구를 초대해보세요</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="invitations">초대 관리</TabsTrigger>
            <TabsTrigger value="rankings">순위</TabsTrigger>
            <TabsTrigger value="history">활동 기록</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfluenceScoreDisplay variant="detailed" />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-purple-500" />
                    <span>영향력 혜택</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3">
                    <h4 className="font-semibold text-yellow-700 mb-2">🎯 노출 우선순위</h4>
                    <p className="text-sm text-yellow-600">영향력이 높을수록 아이디어가 상단에 노출됩니다</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
                    <h4 className="font-semibold text-purple-700 mb-2">💎 GPT 점수 보정</h4>
                    <p className="text-sm text-purple-600">영향력에 따라 GPT 점수에 최대 +0.5점 보정</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
                    <h4 className="font-semibold text-green-700 mb-2">🚀 VC 추천 우선권</h4>
                    <p className="text-sm text-green-600">투자자에게 우선적으로 추천됩니다</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invitations">
            <InvitationManager />
          </TabsContent>

          <TabsContent value="rankings">
            <TopInfluencersBoard />
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>최근 활동 기록</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scoreLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">로딩중...</p>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>아직 활동 기록이 없습니다.</p>
                    <p className="text-sm">아이디어를 제출하거나 친구를 초대해보세요!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getActionIcon(log.action_type)}
                          <div>
                            <div className="font-medium text-gray-900">{log.action_type}</div>
                            {log.description && (
                              <div className="text-sm text-gray-500">{log.description}</div>
                            )}
                            <div className="text-xs text-gray-400">
                              {new Date(log.created_at).toLocaleDateString('ko-KR', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={log.points > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                        >
                          {log.points > 0 ? '+' : ''}{log.points}점
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
