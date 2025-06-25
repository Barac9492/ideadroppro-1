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
      enhanceButton: 'AI 분석 시작하기',
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
      enhanceButton: 'Start AI Analysis',
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

  const handleStartAnalysis = () => {
    if (ideaText.trim()) {
      // Navigate directly to Builder with auto-start
      navigate('/builder', { 
        state: { 
          initialIdea: ideaText.trim(),
          autoStart: true 
        } 
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (ideaText.trim()) {
        handleStartAnalysis();
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
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      id: 'remix',
      icon: Shuffle,
      title: text[currentLanguage].quickActions.remix,
      description: text[currentLanguage].quickActions.remixDesc,
      path: '/remix',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'myinfo',
      icon: User,
      title: text[currentLanguage].quickActions.myInfo,
      description: text[currentLanguage].quickActions.myInfoDesc,
      path: '/my-workspace',
      gradient: 'from-indigo-400 to-purple-500'
    }
  ];

  const stats = [
    { icon: Target, label: text[currentLanguage].stats.ideas },
    { icon: User, label: text[currentLanguage].stats.users },
    { icon: TrendingUp, label: text[currentLanguage].stats.success }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* McKinsey-style curved grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
      </div>

      {/* Abstract colorful element inspired by McKinsey */}
      <div className="absolute top-1/4 right-10 w-96 h-96 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-12">
              {/* Main Title */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                  {text[currentLanguage].title}
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                    {text[currentLanguage].subtitle}
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-blue-100 max-w-2xl leading-relaxed font-light">
                  {text[currentLanguage].description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 text-white">
                      <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-medium">{stat.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Input Section */}
              <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <Textarea
                      value={ideaText}
                      onChange={(e) => setIdeaText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={text[currentLanguage].placeholder}
                      className="w-full min-h-[120px] text-lg border-0 focus:ring-0 resize-none placeholder-blue-200 bg-transparent text-white leading-relaxed"
                      maxLength={200}
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-blue-200 font-medium">
                        {ideaText.length}/200
                      </div>
                      <Button
                        onClick={handleStartAnalysis}
                        disabled={!ideaText.trim()}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border-0"
                      >
                        <Zap className="w-5 h-5 mr-3" />
                        {text[currentLanguage].enhanceButton}
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Visual Element */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Abstract 3D-like element */}
                <div className="w-full h-96 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl transform rotate-12 opacity-80"></div>
                  <div className="absolute inset-4 bg-gradient-to-tl from-pink-400 via-purple-500 to-indigo-600 rounded-3xl transform -rotate-6 opacity-70"></div>
                  <div className="absolute inset-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl transform rotate-3 opacity-60"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-20 text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              또는 다른 방법으로 시작해보세요
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card 
                    key={action.id} 
                    className="cursor-pointer hover:shadow-2xl transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 group"
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="p-8 text-center space-y-6 relative">
                      <div className="relative z-10">
                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-white mb-3">
                            {action.title}
                          </h3>
                          <p className="text-blue-100 leading-relaxed">
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
