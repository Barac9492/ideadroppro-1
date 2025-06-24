
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import SimpleTopBar from '@/components/SimpleTopBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shuffle, Plus, Sparkles, ArrowRight, Lightbulb, Target, Users, DollarSign } from 'lucide-react';

const Remix = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { returnTo: '/remix' } });
    }
  }, [user, navigate]);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const text = {
    ko: {
      title: '🎨 리믹스 스튜디오',
      subtitle: '기존 아이디어를 조합하고 발전시켜 새로운 아이디어를 만들어보세요',
      startFromScratch: '처음부터 시작하기',
      comingSoon: '곧 업데이트됩니다!',
      placeholder: '리믹스 기능이 곧 출시됩니다. 그동안 새로운 아이디어를 만들어보세요!',
      gameElements: {
        title: '🎮 리믹스 게임 요소',
        items: [
          '🎯 아이디어 카드 수집',
          '⚡ 조합으로 새로운 아이디어 생성',
          '🏆 창의성 점수 획득',
          '🎁 특별 보상 언락'
        ]
      },
      sampleCards: [
        {
          type: 'problem',
          title: '문제 카드',
          content: '배달음식 포장재 낭비',
          icon: Target,
          color: 'from-red-100 to-red-200 border-red-300'
        },
        {
          type: 'solution',
          title: '솔루션 카드',
          content: 'AI 추천 시스템',
          icon: Lightbulb,
          color: 'from-blue-100 to-blue-200 border-blue-300'
        },
        {
          type: 'target',
          title: '타겟 카드',
          content: '환경 의식 있는 MZ세대',
          icon: Users,
          color: 'from-green-100 to-green-200 border-green-300'
        },
        {
          type: 'business',
          title: '비즈니스 카드',
          content: '구독 기반 수익 모델',
          icon: DollarSign,
          color: 'from-purple-100 to-purple-200 border-purple-300'
        }
      ]
    },
    en: {
      title: '🎨 Remix Studio',
      subtitle: 'Combine and evolve existing ideas to create something new',
      startFromScratch: 'Start from Scratch',
      comingSoon: 'Coming Soon!',
      placeholder: 'Remix feature launching soon. Meanwhile, try creating new ideas!',
      gameElements: {
        title: '🎮 Remix Game Elements',
        items: [
          '🎯 Collect Idea Cards',
          '⚡ Generate New Ideas by Combining',
          '🏆 Earn Creativity Points',
          '🎁 Unlock Special Rewards'
        ]
      },
      sampleCards: [
        {
          type: 'problem',
          title: 'Problem Card',
          content: 'Food delivery packaging waste',
          icon: Target,
          color: 'from-red-100 to-red-200 border-red-300'
        },
        {
          type: 'solution',
          title: 'Solution Card',
          content: 'AI recommendation system',
          icon: Lightbulb,
          color: 'from-blue-100 to-blue-200 border-blue-300'
        },
        {
          type: 'target',
          title: 'Target Card',
          content: 'Eco-conscious Gen Z',
          icon: Users,
          color: 'from-green-100 to-green-200 border-green-300'
        },
        {
          type: 'business',
          title: 'Business Card',
          content: 'Subscription revenue model',
          icon: DollarSign,
          color: 'from-purple-100 to-purple-200 border-purple-300'
        }
      ]
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">로그인 확인 중...</p>
        </div>
      </div>
    );
  }

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
            <p className="text-xl text-gray-600">
              {text[currentLanguage].subtitle}
            </p>
          </div>

          {/* Coming Soon Section */}
          <Card className="mb-8 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
            <CardContent className="p-12 text-center">
              <div className="text-8xl mb-6">🚀</div>
              <h2 className="text-3xl font-bold text-purple-800 mb-4">
                {text[currentLanguage].comingSoon}
              </h2>
              <p className="text-lg text-purple-700 mb-8 max-w-2xl mx-auto">
                {text[currentLanguage].placeholder}
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => navigate('/create')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-lg px-8 py-4"
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  {text[currentLanguage].startFromScratch}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Game Elements Preview */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>{text[currentLanguage].gameElements.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {text[currentLanguage].gameElements.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shuffle className="w-5 h-5" />
                  <span>카드 조합 시뮬레이션</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {text[currentLanguage].sampleCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <div 
                        key={index}
                        className={`bg-gradient-to-br ${card.color} rounded-lg p-4 border-2 shadow-sm hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className="w-4 h-4" />
                          <Badge variant="secondary" className="text-xs">
                            {card.title}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-800">
                          {card.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-yellow-300">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <span className="font-bold text-orange-800">조합 결과</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    "환경 의식 있는 MZ세대를 위한 AI 기반 포장재 재활용 구독 서비스"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Remix;
