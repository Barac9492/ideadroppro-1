
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Search, Shuffle, User, Zap, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UltraSimpleHeroProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string) => void;
}

const UltraSimpleHero: React.FC<UltraSimpleHeroProps> = ({
  currentLanguage,
  onIdeaDrop
}) => {
  const [ideaText, setIdeaText] = useState('');
  const navigate = useNavigate();

  const text = {
    ko: {
      title: '아이디어를 현실로 만드는',
      subtitle: '가장 똑똑한 방법',
      description: '30초 안에 아이디어를 입력하면, AI가 완전한 비즈니스 모델로 발전시켜드립니다.',
      placeholder: '예: "비 오는 날 신발이 젖지 않는 스마트 우산"',
      enhanceButton: 'AI와 함께 시작하기',
      stats: {
        ideas: '12,847개 아이디어',
        users: '3,294명 창업가',
        success: '89% 성공률'
      },
      quickActions: {
        explore: '아이디어 둘러보기',
        exploreDesc: '커뮤니티의 검증된 아이디어들',
        remix: '아이디어 조합하기',
        remixDesc: '기존 아이디어를 새롭게 발전',
        myInfo: '내 활동 확인',
        myInfoDesc: '지금까지의 성과와 통계'
      }
    },
    en: {
      title: 'The smartest way to turn',
      subtitle: 'ideas into reality',
      description: 'Input your idea in 30 seconds and AI will develop it into a complete business model.',
      placeholder: 'e.g., "Smart umbrella that keeps shoes dry in rain"',
      enhanceButton: 'Start with AI',
      stats: {
        ideas: '12,847 Ideas',
        users: '3,294 Entrepreneurs',
        success: '89% Success Rate'
      },
      quickActions: {
        explore: 'Explore Ideas',
        exploreDesc: 'Verified ideas from community',
        remix: 'Combine Ideas',
        remixDesc: 'Evolve existing ideas creatively',
        myInfo: 'Check Activity',
        myInfoDesc: 'Your achievements and stats'
      }
    }
  };

  const handleStartAI = () => {
    if (ideaText.trim()) {
      navigate('/create', { 
        state: { 
          initialIdea: ideaText.trim(),
          autoStartQuestions: true 
        } 
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (ideaText.trim()) {
        handleStartAI();
      }
    }
  };

  const quickActions = [
    {
      id: 'explore',
      icon: Search,
      title: text[currentLanguage].quickActions.explore,
      description: text[currentLanguage].quickActions.exploreDesc,
      path: '/explore',
      gradient: 'from-gray-900 to-gray-700'
    },
    {
      id: 'remix',
      icon: Shuffle,
      title: text[currentLanguage].quickActions.remix,
      description: text[currentLanguage].quickActions.remixDesc,
      path: '/remix',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'myinfo',
      icon: User,
      title: text[currentLanguage].quickActions.myInfo,
      description: text[currentLanguage].quickActions.myInfoDesc,
      path: '/my-workspace',
      gradient: 'from-gray-800 to-black'
    }
  ];

  const stats = [
    { icon: Target, label: text[currentLanguage].stats.ideas },
    { icon: User, label: text[currentLanguage].stats.users },
    { icon: TrendingUp, label: text[currentLanguage].stats.success }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #1a1a1a 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-16">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight mb-4">
                {text[currentLanguage].title}
                <br />
                <span className="text-orange-500">
                  {text[currentLanguage].subtitle}
                </span>
              </h1>
              
              {/* Accent line */}
              <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-8"></div>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                {text[currentLanguage].description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 text-gray-700">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-medium">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input Section */}
          <Card className="max-w-4xl mx-auto shadow-xl border-0 rounded-2xl bg-white mb-20">
            <CardContent className="p-12">
              <div className="space-y-8">
                <Textarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={text[currentLanguage].placeholder}
                  className="w-full min-h-[140px] text-xl border-0 focus:ring-0 resize-none placeholder-gray-400 bg-transparent leading-relaxed"
                  maxLength={200}
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400 font-medium">
                    {ideaText.length}/200
                  </div>
                  <Button
                    onClick={handleStartAI}
                    disabled={!ideaText.trim()}
                    className="bg-black hover:bg-gray-800 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <Zap className="w-5 h-5 mr-3" />
                    {text[currentLanguage].enhanceButton}
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              또는 다른 방법으로 시작해보세요
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card 
                    key={action.id} 
                    className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-white hover:scale-105 group overflow-hidden"
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="p-8 text-center space-y-6 relative">
                      {/* Background gradient on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                      
                      <div className="relative z-10">
                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-3">
                            {action.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltraSimpleHero;
