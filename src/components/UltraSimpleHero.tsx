
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ArrowRight, Search, Shuffle, User, Sparkles } from 'lucide-react';
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
      title: '아이디어 하나, AI와 함께 완성하세요',
      subtitle: '30초 입력하면 AI가 완전한 비즈니스 모델로 만들어드려요',
      placeholder: '예: "비 오는 날 신발 안 젖는 앱"',
      enhanceButton: 'AI와 함께 완성하기',
      processingSteps: {
        step1: 'AI가 아이디어 분석',
        step2: '모듈 카드로 변환',
        step3: '리믹스 스튜디오 준비'
      },
      quickActions: {
        title: '또는 이런 것들도 해보세요',
        explore: '다른 아이디어 둘러보기',
        exploreDesc: '커뮤니티의 창의적인 아이디어들을 구경해보세요',
        remix: '아이디어 리믹스하기',
        remixDesc: '기존 아이디어를 조합해서 새로운 것을 만들어보세요',
        myInfo: '내 활동 보기',
        myInfoDesc: '지금까지의 아이디어와 성과를 확인해보세요'
      }
    },
    en: {
      title: 'Complete your idea with AI',
      subtitle: '30 seconds input, AI creates a complete business model',
      placeholder: 'e.g., "App that keeps shoes dry in rain"',
      enhanceButton: 'Complete with AI',
      processingSteps: {
        step1: 'AI analyzes idea',
        step2: 'Convert to module cards',
        step3: 'Remix studio ready'
      },
      quickActions: {
        title: 'Or try these actions',
        explore: 'Explore other ideas',
        exploreDesc: 'Browse creative ideas from the community',
        remix: 'Remix ideas',
        remixDesc: 'Combine existing ideas to create something new',
        myInfo: 'View my activity',
        myInfoDesc: 'Check your ideas and achievements so far'
      }
    }
  };

  const handleEnhance = () => {
    if (ideaText.trim()) {
      navigate('/create', { state: { initialIdea: ideaText.trim() } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (ideaText.trim()) {
        handleEnhance();
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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'remix',
      icon: Shuffle,
      title: text[currentLanguage].quickActions.remix,
      description: text[currentLanguage].quickActions.remixDesc,
      path: '/remix',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'myinfo',
      icon: User,
      title: text[currentLanguage].quickActions.myInfo,
      description: text[currentLanguage].quickActions.myInfoDesc,
      path: '/my-workspace',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        {/* Enhanced title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h1>
          <p className="text-xl text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Single input card with enhanced AI focus */}
        <Card className="shadow-xl border-0 rounded-3xl bg-white/90 backdrop-blur-sm mb-12">
          <CardContent className="p-8">
            <div className="space-y-6">
              <Textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={text[currentLanguage].placeholder}
                className="w-full min-h-[100px] text-lg border-0 focus:ring-0 resize-none placeholder-gray-400 bg-transparent"
                maxLength={200}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {ideaText.length}/200
                </div>
                <Button
                  onClick={handleEnhance}
                  disabled={!ideaText.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {text[currentLanguage].enhanceButton}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Processing Steps Preview */}
        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            {currentLanguage === 'ko' ? 'AI 처리 과정' : 'AI Processing Steps'}
          </h3>
          <div className="flex justify-center items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">{text[currentLanguage].processingSteps.step1}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">{text[currentLanguage].processingSteps.step2}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center">
                <Shuffle className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">{text[currentLanguage].processingSteps.step3}</span>
            </div>
          </div>
        </div>

        {/* Quick actions section */}
        <div className="text-center space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {text[currentLanguage].quickActions.title}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Enhanced success indicators with AI focus */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex justify-center items-center space-x-6 text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                {currentLanguage === 'ko' ? 'AI 분석' : 'AI Analysis'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                {currentLanguage === 'ko' ? '모듈 생성' : 'Module Creation'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                {currentLanguage === 'ko' ? '리믹스 준비' : 'Remix Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltraSimpleHero;
