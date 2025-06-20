
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Medal } from 'lucide-react';
import { useMonthlyRanking } from '@/hooks/useMonthlyRanking';

interface MonthlyRankingProps {
  currentLanguage: 'ko' | 'en';
}

const MonthlyRanking: React.FC<MonthlyRankingProps> = ({ currentLanguage }) => {
  const { topIdeas, loading } = useMonthlyRanking(currentLanguage);

  const text = {
    ko: {
      title: '이달의 인기 아이디어 랭킹',
      subtitle: '🏆 월간 최다 하트를 받은 아이디어는 VC 조언 자격을 획득합니다!',
      by: '작성자',
      hearts: '하트',
      noData: '이번 달 아직 랭킹 데이터가 없습니다.',
      vcQualified: 'VC 조언 자격'
    },
    en: {
      title: 'Monthly Popular Ideas Ranking',
      subtitle: '🏆 Ideas with the most monthly hearts qualify for VC advice!',
      by: 'By',
      hearts: 'Hearts',
      noData: 'No ranking data available for this month yet.',
      vcQualified: 'VC Advice Qualified'
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Trophy className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-slate-500">#{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-100 to-yellow-200 border-yellow-300';
      case 1:
        return 'from-gray-100 to-gray-200 border-gray-300';
      case 2:
        return 'from-amber-100 to-amber-200 border-amber-300';
      default:
        return 'from-slate-50 to-slate-100 border-slate-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading ranking...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-6 w-6" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
        <p className="text-purple-100 text-sm">{text[currentLanguage].subtitle}</p>
      </CardHeader>
      <CardContent className="p-6">
        {topIdeas.length === 0 ? (
          <p className="text-center text-gray-500 py-8">{text[currentLanguage].noData}</p>
        ) : (
          <div className="space-y-3">
            {topIdeas.map((idea, index) => (
              <div
                key={idea.id}
                className={`p-4 rounded-lg bg-gradient-to-r border-2 ${getRankColor(index)} transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 pt-1">
                      {getRankIcon(index)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 mb-2 line-clamp-2">
                        {idea.text.length > 120 ? `${idea.text.substring(0, 120)}...` : idea.text}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-600">
                        <span>{text[currentLanguage].by}: {idea.profiles?.username || 'Anonymous'}</span>
                        <span className="flex items-center space-x-1">
                          <span>❤️</span>
                          <span>{idea.likes_count} {text[currentLanguage].hearts}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {index === 0 && idea.likes_count > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                      {text[currentLanguage].vcQualified}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyRanking;
