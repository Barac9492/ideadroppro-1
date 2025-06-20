
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, TrendingUp, Users, Zap, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TopInfluencer {
  user_id: string;
  total_score: number;
  weekly_score: number;
  profiles: {
    username: string | null;
  } | null;
}

const TopInfluencersBoard: React.FC = () => {
  const [topInfluencers, setTopInfluencers] = useState<TopInfluencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'weekly' | 'total'>('weekly');

  const fetchTopInfluencers = async () => {
    try {
      const orderField = period === 'weekly' ? 'weekly_score' : 'total_score';
      
      const { data, error } = await supabase
        .from('user_influence_scores')
        .select(`
          user_id,
          total_score,
          weekly_score,
          profiles!inner(username)
        `)
        .order(orderField, { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching top influencers:', error);
        return;
      }

      setTopInfluencers(data || []);
    } catch (error) {
      console.error('Error fetching top influencers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopInfluencers();
  }, [period]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">👑 1위</Badge>;
      case 2: return <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-white">🥈 2위</Badge>;
      case 3: return <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">🥉 3위</Badge>;
      default: return <Badge variant="outline">{rank}위</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span>Top Influencers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">로딩중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span>Top Influencers</span>
          </CardTitle>
          <div className="flex space-x-1">
            <Badge 
              variant={period === 'weekly' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setPeriod('weekly')}
            >
              이번 주
            </Badge>
            <Badge 
              variant={period === 'total' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setPeriod('total')}
            >
              전체
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {topInfluencers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>아직 순위 데이터가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topInfluencers.map((influencer, index) => {
              const rank = index + 1;
              const score = period === 'weekly' ? influencer.weekly_score : influencer.total_score;
              
              return (
                <div 
                  key={influencer.user_id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getRankIcon(rank)}
                    <div>
                      <div className="font-semibold text-gray-900">
                        {influencer.profiles?.username || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>{score}점</span>
                      </div>
                    </div>
                  </div>
                  {getRankBadge(rank)}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <p className="text-sm text-purple-700 font-medium">🏆 이번 주 Top 3 혜택:</p>
          <ul className="text-xs text-purple-600 mt-1 space-y-1">
            <li>• 오늘의 키워드 선점권</li>
            <li>• 투자자 전용 탭 상단 노출</li>
            <li>• GPT 골든 스코어 티켓 제공</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopInfluencersBoard;
