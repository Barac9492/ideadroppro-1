
import React, { useState } from 'react';
import Header from '@/components/Header';
import MonthlyRanking from '@/components/MonthlyRanking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';
import { useIdeas } from '@/hooks/useIdeas';

const Ranking = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { ideas, loading } = useIdeas(currentLanguage);

  const text = {
    ko: {
      title: '아이디어 랭킹',
      subtitle: '인기 있는 아이디어들을 확인해보세요',
      monthly: '월간 랭킹',
      allTime: '전체 랭킹',
      trending: '트렌딩',
      loadingRanking: '랭킹을 불러오는 중...',
      noIdeas: '아직 랭킹 데이터가 없습니다.',
      hearts: '하트',
      by: '작성자'
    },
    en: {
      title: 'Idea Rankings',
      subtitle: 'Discover the most popular ideas',
      monthly: 'Monthly Ranking',
      allTime: 'All-Time Ranking',
      trending: 'Trending',
      loadingRanking: 'Loading rankings...',
      noIdeas: 'No ranking data available yet.',
      hearts: 'Hearts',
      by: 'By'
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const topIdeas = ideas
    .filter(idea => !idea.seed)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            {text[currentLanguage].title}
          </h1>
          <p className="text-slate-600 text-lg">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="monthly" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{text[currentLanguage].monthly}</span>
            </TabsTrigger>
            <TabsTrigger value="alltime" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>{text[currentLanguage].allTime}</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>{text[currentLanguage].trending}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly">
            <MonthlyRanking currentLanguage={currentLanguage} />
          </TabsContent>

          <TabsContent value="alltime">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6" />
                  <span>{text[currentLanguage].allTime}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">{text[currentLanguage].loadingRanking}</p>
                  </div>
                ) : topIdeas.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">{text[currentLanguage].noIdeas}</p>
                ) : (
                  <div className="space-y-3">
                    {topIdeas.map((idea, index) => (
                      <div
                        key={idea.id}
                        className="p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 transition-all hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0 pt-1">
                              <span className="text-sm font-bold text-slate-500">#{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-800 mb-2 line-clamp-2">
                                {idea.text.length > 120 ? `${idea.text.substring(0, 120)}...` : idea.text}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-slate-600">
                                <span>{text[currentLanguage].by}: Anonymous</span>
                                <span className="flex items-center space-x-1">
                                  <span>❤️</span>
                                  <span>{idea.likes} {text[currentLanguage].hearts}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trending">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>{text[currentLanguage].trending}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">트렌딩 기능은 곧 출시될 예정입니다!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Ranking;
