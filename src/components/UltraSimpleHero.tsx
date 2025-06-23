
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ArrowRight, Search, Shuffle, User } from 'lucide-react';
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
      title: '아이디어 하나, 던져보세요',
      subtitle: '30초면 충분합니다',
      placeholder: '예: "비 오는 날 신발 안 젖는 앱"',
      submitButton: '던지기',
      enhanceButton: '더 구체화하기',
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
      title: 'Drop your idea',
      subtitle: '30 seconds is enough',
      placeholder: 'e.g., "App that keeps shoes dry in rain"',
      submitButton: 'Drop it',
      enhanceButton: 'Make it better',
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

  const handleQuickSubmit = () => {
    if (ideaText.trim()) {
      onIdeaDrop(ideaText.trim());
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
        handleQuickSubmit();
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
        {/* Simple title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h1>
          <p className="text-xl text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Single input card */}
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
                <div className="flex space-x-3">
                  <Button
                    onClick={handleEnhance}
                    disabled={!ideaText.trim()}
                    variant="outline"
                    className="px-6 py-3 text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    {text[currentLanguage].enhanceButton}
                  </Button>
                  <Button
                    onClick={handleQuickSubmit}
                    disabled={!ideaText.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Lightbulb className="w-5 h-5 mr-2" />
                    {text[currentLanguage].submitButton}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Simple success indicators */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex justify-center items-center space-x-6 text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                {currentLanguage === 'ko' ? '즉시 제출' : 'Instant submit'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                {currentLanguage === 'ko' ? 'AI 분석' : 'AI analysis'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                {currentLanguage === 'ko' ? '커뮤니티 반응' : 'Community feedback'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltraSimpleHero;
