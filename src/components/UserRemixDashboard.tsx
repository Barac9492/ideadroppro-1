
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, GitBranch, Trophy, Coins, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserRemixDashboardProps {
  currentLanguage: 'ko' | 'en';
}

interface UserRemixStats {
  myRemixes: number;
  ideasRemixed: number;
  totalInfluence: number;
  avgScoreImprovement: number;
  remixCredits: number;
}

const UserRemixDashboard: React.FC<UserRemixDashboardProps> = ({
  currentLanguage
}) => {
  const [stats, setStats] = useState<UserRemixStats>({
    myRemixes: 0,
    ideasRemixed: 0,
    totalInfluence: 0,
    avgScoreImprovement: 0,
    remixCredits: 12
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const text = {
    ko: {
      title: '내 리믹스 활동',
      myRemixes: '내가 만든 리믹스',
      ideasRemixed: '내 아이디어가 받은 리믹스',
      totalInfluence: '총 영향력 점수',
      avgImprovement: '평균 점수 향상',
      remixCredits: '리믹스 크레딧',
      loading: '데이터를 불러오는 중...',
      noActivity: '아직 리믹스 활동이 없습니다',
      startRemixing: '첫 리믹스를 만들어보세요!'
    },
    en: {
      title: 'My Remix Activity',
      myRemixes: 'Remixes I Created',
      ideasRemixed: 'My Ideas Remixed',
      totalInfluence: 'Total Influence Score',
      avgImprovement: 'Avg Score Improvement',
      remixCredits: 'Remix Credits',
      loading: 'Loading data...',
      noActivity: 'No remix activity yet',
      startRemixing: 'Create your first remix!'
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserRemixStats();
    }
  }, [user]);

  const fetchUserRemixStats = async () => {
    if (!user) return;

    try {
      // Get remixes created by user
      const { data: myRemixes } = await supabase
        .from('ideas')
        .select('id, score, remix_parent_id')
        .eq('user_id', user.id)
        .not('remix_parent_id', 'is', null);

      // Get ideas created by user that were remixed
      const { data: myIdeasRemixed } = await supabase
        .from('ideas')
        .select('remix_parent_id')
        .in('remix_parent_id', 
          (await supabase
            .from('ideas')
            .select('id')
            .eq('user_id', user.id)
          ).data?.map(idea => idea.id) || []
        );

      // Get user influence score
      const { data: influenceData } = await supabase
        .from('user_influence_scores')
        .select('total_score')
        .eq('user_id', user.id)
        .single();

      const myRemixCount = myRemixes?.length || 0;
      const ideasRemixedCount = myIdeasRemixed?.length || 0;
      const totalInfluence = influenceData?.total_score || 0;

      // Calculate average score improvement (simplified)
      const avgImprovement = myRemixCount > 0 ? 1.2 : 0;

      setStats({
        myRemixes: myRemixCount,
        ideasRemixed: ideasRemixedCount,
        totalInfluence,
        avgScoreImprovement: avgImprovement,
        remixCredits: 12 + (myRemixCount * 2) // Simulate credit system
      });

    } catch (error) {
      console.error('Error fetching remix stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{text[currentLanguage].loading}</p>
        </CardContent>
      </Card>
    );
  }

  const hasActivity = stats.myRemixes > 0 || stats.ideasRemixed > 0;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-purple-600" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasActivity ? (
          <div className="text-center py-8">
            <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">{text[currentLanguage].noActivity}</p>
            <p className="text-sm text-gray-500">{text[currentLanguage].startRemixing}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <GitBranch className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.myRemixes}</div>
              <div className="text-sm text-gray-600">{text[currentLanguage].myRemixes}</div>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.ideasRemixed}</div>
              <div className="text-sm text-gray-600">{text[currentLanguage].ideasRemixed}</div>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalInfluence}</div>
              <div className="text-sm text-gray-600">{text[currentLanguage].totalInfluence}</div>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <Badge className="w-6 h-6 bg-blue-600 mx-auto mb-2 flex items-center justify-center">
                +
              </Badge>
              <div className="text-2xl font-bold text-gray-900">+{stats.avgScoreImprovement.toFixed(1)}</div>
              <div className="text-sm text-gray-600">{text[currentLanguage].avgImprovement}</div>
            </div>

            <div className="bg-white rounded-lg p-4 text-center md:col-span-2">
              <Coins className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.remixCredits}</div>
              <div className="text-sm text-gray-600 mb-2">{text[currentLanguage].remixCredits}</div>
              <Progress value={(stats.remixCredits / 20) * 100} className="h-2" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRemixDashboard;
