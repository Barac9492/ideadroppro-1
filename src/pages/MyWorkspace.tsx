
import React, { useState } from 'react';
import SimplifiedHeader from '@/components/SimplifiedHeader';
import AdaptiveNavigation from '@/components/AdaptiveNavigation';
import PersonalIdeaStorage from '@/components/PersonalIdeaStorage';
import ModuleContributionDashboard from '@/components/ModuleContributionDashboard';
import AIImprovementQueue from '@/components/AIImprovementQueue';
import IdeaEvolutionVisualizer from '@/components/IdeaEvolutionVisualizer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lightbulb, Share, TrendingUp } from 'lucide-react';

const MyWorkspace = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const text = {
    ko: {
      title: '나의 아이디어 작업실',
      subtitle: '아이디어를 지속적으로 발전시키고 모듈을 공유해보세요',
      myIdeas: '내 아이디어',
      moduleSharing: '모듈 공유',
      aiSuggestions: 'AI 제안',
      evolution: '발전 과정',
      loginRequired: '로그인이 필요합니다'
    },
    en: {
      title: 'My Idea Workspace',
      subtitle: 'Continuously develop your ideas and share modules',
      myIdeas: 'My Ideas',
      moduleSharing: 'Module Sharing',
      aiSuggestions: 'AI Suggestions',
      evolution: 'Evolution',
      loginRequired: 'Login required'
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
        <SimplifiedHeader 
          currentLanguage={currentLanguage}
          onLanguageToggle={handleLanguageToggle}
        />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <p className="text-lg text-gray-600 mb-6">{text[currentLanguage].loginRequired}</p>
              <button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                로그인하기
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
      <SimplifiedHeader 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      {!isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="top"
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {text[currentLanguage].title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="ideas" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="ideas" className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>{text[currentLanguage].myIdeas}</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center space-x-2">
              <Share className="w-4 h-4" />
              <span>{text[currentLanguage].moduleSharing}</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>{text[currentLanguage].aiSuggestions}</span>
            </TabsTrigger>
            <TabsTrigger value="evolution" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>{text[currentLanguage].evolution}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas">
            <PersonalIdeaStorage currentLanguage={currentLanguage} />
          </TabsContent>

          <TabsContent value="modules">
            <ModuleContributionDashboard currentLanguage={currentLanguage} />
          </TabsContent>

          <TabsContent value="ai">
            <AIImprovementQueue currentLanguage={currentLanguage} />
          </TabsContent>

          <TabsContent value="evolution">
            <IdeaEvolutionVisualizer currentLanguage={currentLanguage} />
          </TabsContent>
        </Tabs>
      </div>

      {isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="bottom"
        />
      )}
    </div>
  );
};

export default MyWorkspace;
