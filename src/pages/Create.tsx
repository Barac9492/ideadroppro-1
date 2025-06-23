import React, { useState } from 'react';
import IdeaBuilder from '@/components/IdeaBuilder';
import ModuleMixMatch from '@/components/ModuleMixMatch';
import SimpleIdeaInput from '@/components/SimpleIdeaInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIdeas } from '@/hooks/useIdeas';
import { useStreaks } from '@/hooks/useStreaks';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useDailyXP } from '@/hooks/useDailyXP';
import UnifiedNavigation from '@/components/UnifiedNavigation';

const Create = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { submitIdea } = useIdeas(currentLanguage);
  const { updateStreak } = useStreaks(currentLanguage);
  const { scoreActions } = useInfluenceScore();
  const { updateMissionProgress, awardXP } = useDailyXP();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleIdeaSubmit = async (ideaText: string, analysisData?: any) => {
    if (!user) {
      navigate('/auth', { state: { ideaText, analysisData } });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (analysisData && analysisData.modules) {
        await submitIdea(ideaText, {
          modules: analysisData.modules,
          isModular: true,
          completionScore: 8.5
        });
      } else {
        await submitIdea(ideaText);
      }
      
      await updateStreak();
      await scoreActions.keywordParticipation();
      
      updateMissionProgress('idea_submit');
      await awardXP(analysisData?.modules ? 100 : 50, '아이디어 제출');
      
      navigate('/ideas');
    } catch (error) {
      console.error('Error submitting idea:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const text = {
    ko: {
      title: '✨ 아이디어 만들기',
      subtitle: 'AI와 함께 창의적인 아이디어를 만들어보세요',
      tabs: {
        simple: '간단 제출',
        builder: 'AI 빌더',
        mixmatch: '모듈 조합'
      }
    },
    en: {
      title: '✨ Create Ideas',
      subtitle: 'Create innovative ideas with AI assistance',
      tabs: {
        simple: 'Quick Submit',
        builder: 'AI Builder',
        mixmatch: 'Module Mix'
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <UnifiedNavigation currentLanguage={currentLanguage} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h1>
          <p className="text-xl text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <Tabs defaultValue="simple" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="simple">{text[currentLanguage].tabs.simple}</TabsTrigger>
            <TabsTrigger value="builder">{text[currentLanguage].tabs.builder}</TabsTrigger>
            <TabsTrigger value="mixmatch">{text[currentLanguage].tabs.mixmatch}</TabsTrigger>
          </TabsList>

          <TabsContent value="simple">
            <SimpleIdeaInput 
              currentLanguage={currentLanguage}
              onSubmit={handleIdeaSubmit}
              isSubmitting={isSubmitting}
            />
          </TabsContent>

          <TabsContent value="builder">
            <IdeaBuilder currentLanguage={currentLanguage} />
          </TabsContent>

          <TabsContent value="mixmatch">
            <ModuleMixMatch currentLanguage={currentLanguage} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Create;
