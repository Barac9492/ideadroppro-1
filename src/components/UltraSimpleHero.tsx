
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
      title: '아이디어 하나면 AI가 완전한 비즈니스 모델로 만들어드려요',
      subtitle: '30초 입력 → AI 맞춤 질문 → 1차 완성 → 모듈 분해 → 리믹스 개선',
      placeholder: '예: "비 오는 날 신발 안 젖는 앱"',
      enhanceButton: 'AI와 함께 완성하기',
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
      title: 'AI transforms your single idea into a complete business model',
      subtitle: '30sec input → AI custom questions → 1st completion → Module breakdown → Remix improvement',
      placeholder: 'e.g., "App that keeps shoes dry in rain"',
      enhanceButton: 'Complete with AI',
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

  const handleStartAI = () => {
    if (ideaText.trim()) {
      // Navigate directly to create page with auto-start AI questioning
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl">
        {/* 단일화된 타이틀 */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4 leading-tight">
              {text[currentLanguage].title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-4"></div>
          </div>
          <p className="text-lg md:text-xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Enhanced input card */}
        <Card className="shadow-2xl border-0 rounded-3xl bg-white/95 backdrop-blur-md mb-16 hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-8 md:p-10">
            <div className="space-y-8">
              <Textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={text[currentLanguage].placeholder}
                className="w-full min-h-[120px] text-lg md:text-xl border-0 focus:ring-0 resize-none placeholder-gray-400 bg-transparent leading-relaxed"
                maxLength={200}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 font-medium">
                  {ideaText.length}/200
                </div>
                <Button
                  onClick={handleStartAI}
                  disabled={!ideaText.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5 mr-3" />
                  {text[currentLanguage].enhanceButton}
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced quick actions section */}
        <div className="text-center space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {text[currentLanguage].quickActions.title}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.id} 
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/95 hover:scale-105 group"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-8 text-center space-y-6">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-3">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltraSimpleHero;
