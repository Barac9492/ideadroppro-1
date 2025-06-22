
import React, { useState } from 'react';
import Header from '@/components/Header';
import MonthlyRanking from '@/components/MonthlyRanking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Calendar, Building2 } from 'lucide-react';
import { useIdeas } from '@/hooks/useIdeas';

const Ranking = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { ideas, isLoading } = useIdeas(currentLanguage);

  const text = {
    ko: {
      title: '투자 연결 랭킹',
      subtitle: 'VC들이 주목하는 아이디어들을 확인해보세요',
      investmentReady: '투자 준비 완료',
      vcInterest: 'VC 관심도',
      trending: '급상승',
      loadingRanking: '랭킹을 불러오는 중...',
      noIdeas: '아직 투자 평가 데이터가 없습니다.',
      score: '점수',
      by: '작성자',
      vcReviewed: 'VC 검토 완료',
      investmentPotential: '투자 가능성'
    },
    en: {
      title: 'Investment Connection Rankings',
      subtitle: 'Discover ideas that VCs are paying attention to',
      investmentReady: 'Investment Ready',
      vcInterest: 'VC Interest',
      trending: 'Trending',
      loadingRanking: 'Loading rankings...',
      noIdeas: 'No investment evaluation data available yet.',
      score: 'Score',
      by: 'By',
      vcReviewed: 'VC Reviewed',
      investmentPotential: 'Investment Potential'
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Filter and rank ideas by investment potential
  const investmentReadyIdeas = ideas
    .filter(idea => !idea.seed && idea.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  const vcInterestIdeas = ideas
    .filter(idea => !idea.seed)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-2xl">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            {text[currentLanguage].title}
          </h1>
          <p className="text-slate-600 text-lg">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <Tabs defaultValue="investment" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="investment" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>{text[currentLanguage].investmentReady}</span>
            </TabsTrigger>
            <TabsTrigger value="vcinterest" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>{text[currentLanguage].vcInterest}</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>{text[currentLanguage].trending}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investment">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-6 w-6" />
                  <span>{text[currentLanguage].investmentReady}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">{text[currentLanguage].loadingRanking}</p>
                  </div>
                ) : investmentReadyIdeas.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">{text[currentLanguage].noIdeas}</p>
                ) : (
                  <div className="space-y-4">
                    {investmentReadyIdeas.map((idea, index) => (
                      <div
                        key={idea.id}
                        className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 transition-all hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0 pt-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  {text[currentLanguage].investmentPotential}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-800 mb-2 line-clamp-2">
                                {idea.text.length > 120 ? `${idea.text.substring(0, 120)}...` : idea.text}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-slate-600">
                                <span>{text[currentLanguage].by}: Anonymous</span>
                                <span className="flex items-center space-x-1">
                                  <DollarSign className="w-3 h-3" />
                                  <span>{idea.score} {text[currentLanguage].score}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <span>❤️</span>
                                  <span>{idea.likes}</span>
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

          <TabsContent value="vcinterest">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-6 w-6" />
                  <span>{text[currentLanguage].vcInterest}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">{text[currentLanguage].loadingRanking}</p>
                  </div>
                ) : vcInterestIdeas.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">{text[currentLanguage].noIdeas}</p>
                ) : (
                  <div className="space-y-4">
                    {vcInterestIdeas.map((idea, index) => (
                      <div
                        key={idea.id}
                        className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 transition-all hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0 pt-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                                {idea.score >= 70 && (
                                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                    {text[currentLanguage].vcReviewed}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-800 mb-2 line-clamp-2">
                                {idea.text.length > 120 ? `${idea.text.substring(0, 120)}...` : idea.text}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-slate-600">
                                <span>{text[currentLanguage].by}: Anonymous</span>
                                <span className="flex items-center space-x-1">
                                  <Building2 className="w-3 h-3" />
                                  <span>{idea.likes} VC 관심</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <span>⭐</span>
                                  <span>{idea.score}</span>
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
            <MonthlyRanking currentLanguage={currentLanguage} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Ranking;
