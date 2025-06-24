
import React, { useState } from 'react';
import SimpleTopBar from '@/components/SimpleTopBar';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Star, TrendingUp, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const navigate = useNavigate();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const text = {
    ko: {
      title: '💡 아이디어 탐색',
      subtitle: '다른 사람들의 창의적인 아이디어를 둘러보고 영감을 받아보세요',
      searchPlaceholder: '아이디어 검색...',
      trending: '인기 아이디어',
      recent: '최신 아이디어',
      categories: '카테고리',
      startYourOwn: '나만의 아이디어 시작하기',
      comingSoon: '곧 업데이트됩니다!',
      placeholder: '실제 아이디어 데이터가 로딩되면 여기에 표시됩니다.',
      sampleIdeas: [
        {
          title: 'AI 기반 반려동물 건강 모니터링',
          description: '스마트 웨어러블로 반려동물 건강을 실시간 체크',
          author: '김창업',
          score: 92,
          category: '펫테크'
        },
        {
          title: '음식물쓰레기 재활용 앱',
          description: '이웃과 음식을 나누고 환경도 보호하는 플랫폼',
          author: '이환경',
          score: 89,
          category: '환경'
        },
        {
          title: '실시간 중고차 경매 플랫폼',
          description: '투명한 가격으로 중고차를 사고파는 새로운 방식',
          author: '박자동차',
          score: 87,
          category: '모빌리티'
        }
      ]
    },
    en: {
      title: '💡 Explore Ideas',
      subtitle: 'Browse creative ideas from others and get inspired',
      searchPlaceholder: 'Search ideas...',
      trending: 'Trending Ideas',
      recent: 'Recent Ideas',
      categories: 'Categories',
      startYourOwn: 'Start Your Own Idea',
      comingSoon: 'Coming Soon!',
      placeholder: 'Real idea data will appear here when loaded.',
      sampleIdeas: [
        {
          title: 'AI Pet Health Monitoring',
          description: 'Smart wearable for real-time pet health tracking',
          author: 'John Smith',
          score: 92,
          category: 'PetTech'
        },
        {
          title: 'Food Waste Recycling App',
          description: 'Platform to share food with neighbors and protect environment',
          author: 'Sarah Green',
          score: 89,
          category: 'Environment'
        },
        {
          title: 'Real-time Used Car Auction',
          description: 'New way to buy and sell used cars with transparent pricing',
          author: 'Mike Auto',
          score: 87,
          category: 'Mobility'
        }
      ]
    }
  };

  const categories = [
    { name: currentLanguage === 'ko' ? '테크' : 'Tech', count: 245, color: 'bg-blue-100 text-blue-800' },
    { name: currentLanguage === 'ko' ? '환경' : 'Environment', count: 189, color: 'bg-green-100 text-green-800' },
    { name: currentLanguage === 'ko' ? '헬스케어' : 'Healthcare', count: 156, color: 'bg-red-100 text-red-800' },
    { name: currentLanguage === 'ko' ? '교육' : 'Education', count: 203, color: 'bg-purple-100 text-purple-800' },
    { name: currentLanguage === 'ko' ? '핀테크' : 'FinTech', count: 134, color: 'bg-yellow-100 text-yellow-800' },
    { name: currentLanguage === 'ko' ? '게임' : 'Gaming', count: 98, color: 'bg-pink-100 text-pink-800' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <SimpleTopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="pt-20">
        <UnifiedNavigation currentLanguage={currentLanguage} />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {text[currentLanguage].title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {text[currentLanguage].subtitle}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={text[currentLanguage].searchPlaceholder}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Coming Soon Banner */}
          <Card className="mb-8 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-purple-800 mb-2">
                {text[currentLanguage].comingSoon}
              </h2>
              <p className="text-purple-700 mb-6">
                {text[currentLanguage].placeholder}
              </p>
              <Button 
                onClick={() => navigate('/create')}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {text[currentLanguage].startYourOwn}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>{text[currentLanguage].categories}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="font-medium">{category.name}</span>
                      <Badge className={category.color}>
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Trending Ideas */}
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-bold text-gray-900">{text[currentLanguage].trending}</h2>
                </div>
                
                <div className="grid gap-6">
                  {text[currentLanguage].sampleIdeas.map((idea, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{idea.title}</h3>
                            <p className="text-gray-600 mb-3">{idea.description}</p>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-500">by {idea.author}</span>
                              <Badge variant="outline">{idea.category}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-xl font-bold text-gray-900">{idea.score}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
