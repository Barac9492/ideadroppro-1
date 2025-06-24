
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useModuleLibrary } from '@/hooks/useModuleLibrary';
import { useModularIdeas } from '@/hooks/useModularIdeas';
import CurrentIdeaState from './remix/CurrentIdeaState';
import ModuleImprovement from './remix/ModuleImprovement';
import { getModuleType } from '@/utils/moduleUtils';
import { toast } from '@/hooks/use-toast';

interface RemixStudioProps {
  currentLanguage: 'ko' | 'en';
  initialModules?: any[];
  sourceIdea?: string;
}

const RemixStudio: React.FC<RemixStudioProps> = ({
  currentLanguage,
  initialModules = [],
  sourceIdea = ''
}) => {
  const [selectedModules, setSelectedModules] = useState<any[]>(initialModules);
  const [currentView, setCurrentView] = useState<'overview' | 'improve'>('overview');
  const [improvingModuleType, setImprovingModuleType] = useState<string | null>(null);
  const { modules, loading } = useModuleLibrary({ currentLanguage });
  const { modules: allModules } = useModularIdeas({ currentLanguage });

  const text = {
    ko: {
      title: '🎛️ 리믹스 스튜디오',
      subtitle: '모듈을 개선해서 더 나은 아이디어를 만들어보세요',
      generateFinalIdea: '최종 아이디어 생성',
      loading: '모듈을 불러오는 중...',
      noModulesForType: '이 카테고리의 모듈이 없습니다',
      ideaGenerated: '새로운 아이디어가 생성되었습니다!'
    },
    en: {
      title: '🎛️ Remix Studio',
      subtitle: 'Improve modules to create better ideas',
      generateFinalIdea: 'Generate Final Idea',
      loading: 'Loading modules...',
      noModulesForType: 'No modules for this category',
      ideaGenerated: 'New idea generated!'
    }
  };

  const handleImproveModule = (moduleType: string) => {
    setImprovingModuleType(moduleType);
    setCurrentView('improve');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setImprovingModuleType(null);
  };

  const handleSelectModule = (newModule: any) => {
    const moduleType = getModuleType(newModule);
    
    // Remove existing module of the same type
    const updatedModules = selectedModules.filter(m => getModuleType(m) !== moduleType);
    
    // Add the new module
    setSelectedModules([...updatedModules, newModule]);
    
    toast({
      title: '모듈이 업데이트되었습니다!',
      description: `${moduleType} 모듈이 새로운 내용으로 교체되었습니다.`,
      duration: 3000,
    });
    
    handleBackToOverview();
  };

  const handleGenerateNewModule = () => {
    // This would typically call an AI service to generate new modules
    toast({
      title: 'AI 모듈 생성 기능',
      description: '곧 AI가 새로운 모듈을 생성해드릴 예정입니다!',
      duration: 3000,
    });
  };

  const handleGenerateFinalIdea = () => {
    if (selectedModules.length < 3) {
      toast({
        title: '더 많은 모듈이 필요합니다',
        description: '최소 3개 이상의 모듈이 있어야 아이디어를 생성할 수 있습니다.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    // This would typically call an AI service to combine modules into a final idea
    toast({
      title: text[currentLanguage].ideaGenerated,
      description: `${selectedModules.length}개의 모듈이 하나의 완성된 아이디어로 통합되었습니다.`,
      duration: 5000,
    });
  };

  // Get alternative modules for the current improving type
  const getAlternativeModules = (moduleType: string) => {
    const allAvailableModules = [...modules, ...allModules];
    return allAvailableModules.filter(module => {
      const type = getModuleType(module);
      return type === moduleType;
    });
  };

  // Get current module of the improving type
  const getCurrentModule = (moduleType: string) => {
    return selectedModules.find(module => getModuleType(module) === moduleType);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600">{text[currentLanguage].loading}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            {text[currentLanguage].title}
          </h1>
          <p className="text-xl text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Main Content */}
        {currentView === 'overview' ? (
          <div className="space-y-8">
            <CurrentIdeaState
              currentModules={selectedModules}
              sourceIdea={sourceIdea}
              currentLanguage={currentLanguage}
              onImproveModule={handleImproveModule}
            />
            
            {/* Generate Final Idea Button */}
            {selectedModules.length > 0 && (
              <div className="text-center">
                <Button
                  onClick={handleGenerateFinalIdea}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {text[currentLanguage].generateFinalIdea}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <ModuleImprovement
            moduleType={improvingModuleType!}
            currentModule={getCurrentModule(improvingModuleType!)}
            alternativeModules={getAlternativeModules(improvingModuleType!)}
            currentLanguage={currentLanguage}
            onBack={handleBackToOverview}
            onSelectModule={handleSelectModule}
            onGenerateNew={handleGenerateNewModule}
          />
        )}
      </div>
    </div>
  );
};

export default RemixStudio;
