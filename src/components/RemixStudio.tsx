import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shuffle, 
  Plus, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useModuleLibrary } from '@/hooks/useModuleLibrary';
import { useModularIdeas } from '@/hooks/useModularIdeas';
import ModuleMenuGrid from './remix/ModuleMenuGrid';
import { getModuleTitle, getModuleContent, getModuleScore } from '@/utils/moduleUtils';

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
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { modules, loading } = useModuleLibrary({ currentLanguage });
  const { modules: allModules } = useModularIdeas({ currentLanguage });

  const text = {
    ko: {
      title: '🎛️ 리믹스 스튜디오',
      subtitle: '모듈을 조합해서 새로운 아이디어를 만들어보세요',
      menuView: '메뉴 보기',
      myModules: '내 모듈',
      publicModules: '공개 모듈',
      selectedModules: '선택된 모듈',
      addToMix: '믹스에 추가',
      removeFromMix: '믹스에서 제거',
      generateIdea: '새 아이디어 생성',
      clearAll: '모두 지우기',
      noModules: '저장된 모듈이 없습니다',
      noSelection: '모듈을 선택해주세요',
      createFirst: '먼저 Create 페이지에서 아이디어를 만들어보세요',
      backToMenu: '메뉴로 돌아가기'
    },
    en: {
      title: '🎛️ Remix Studio',
      subtitle: 'Combine modules to create new ideas',
      menuView: 'Menu View',
      myModules: 'My Modules',
      publicModules: 'Public Modules',
      selectedModules: 'Selected Modules',
      addToMix: 'Add to Mix',
      removeFromMix: 'Remove from Mix',
      generateIdea: 'Generate New Idea',
      clearAll: 'Clear All',
      noModules: 'No saved modules',
      noSelection: 'Please select modules',
      createFirst: 'Create your first idea on the Create page',
      backToMenu: 'Back to Menu'
    }
  };

  const isModuleSelected = (moduleId: string) => {
    return selectedModules.some(m => m.id === moduleId);
  };

  const handleModuleToggle = (module: any) => {
    if (isModuleSelected(module.id)) {
      setSelectedModules(prev => prev.filter(m => m.id !== module.id));
    } else {
      setSelectedModules(prev => [...prev, module]);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setActiveTab('category-modules');
  };

  const handleClearAll = () => {
    setSelectedModules([]);
  };

  const handleGenerateIdea = () => {
    console.log('Generating idea from modules:', selectedModules);
  };

  // Get modules for selected category - Fixed type checking
  const categoryModules = selectedCategory 
    ? [...modules, ...allModules].filter(module => {
        const moduleType = module.module_data?.type || module.module_type;
        return moduleType === selectedCategory;
      })
    : [];

  const renderModuleCard = (module: any, isFromLibrary = true) => {
    const isSelected = isModuleSelected(module.id);
    const title = getModuleTitle(module);
    const content = getModuleContent(module);
    const score = getModuleScore(module);

    return (
      <Card 
        key={module.id}
        className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
          isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : ''
        }`}
        onClick={() => handleModuleToggle(module)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
              {score}%
            </Badge>
          </div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-2">
          <p className="text-xs text-gray-600 line-clamp-2">
            {content}
          </p>
          
          <Button
            size="sm"
            variant={isSelected ? "destructive" : "default"}
            className="w-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              handleModuleToggle(module);
            }}
          >
            {isSelected ? text[currentLanguage].removeFromMix : text[currentLanguage].addToMix}
          </Button>
        </CardContent>
      </Card>
    );
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="menu">{text[currentLanguage].menuView}</TabsTrigger>
                <TabsTrigger value="my-modules">{text[currentLanguage].myModules}</TabsTrigger>
                <TabsTrigger value="public-modules">{text[currentLanguage].publicModules}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu" className="mt-6">
                <ModuleMenuGrid
                  modules={[...modules, ...allModules]}
                  currentLanguage={currentLanguage}
                  onCategorySelect={handleCategorySelect}
                  onModuleSelect={handleModuleToggle}
                  selectedModules={selectedModules}
                />
              </TabsContent>
              
              <TabsContent value="my-modules" className="mt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading modules...</p>
                  </div>
                ) : modules.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {text[currentLanguage].noModules}
                    </h3>
                    <p className="text-gray-600">
                      {text[currentLanguage].createFirst}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modules.map(module => renderModuleCard(module, true))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="public-modules" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allModules.slice(0, 12).map(module => renderModuleCard(module, false))}
                </div>
              </TabsContent>

              <TabsContent value="category-modules" className="mt-6">
                {selectedCategory && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        onClick={() => setActiveTab('menu')}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {text[currentLanguage].backToMenu}
                      </Button>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCategory} 모듈들
                      </h2>
                      <Badge variant="secondary">
                        {categoryModules.length}개
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryModules.map(module => renderModuleCard(module, false))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Selected Modules & Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{text[currentLanguage].selectedModules}</span>
                  <Badge variant="secondary">{selectedModules.length}</Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {selectedModules.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">
                    {text[currentLanguage].noSelection}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedModules.map(module => {
                      const title = getModuleTitle(module);
                      const content = getModuleContent(module);
                      return (
                        <div key={module.id} className="bg-gray-50 rounded p-2">
                          <div className="text-xs font-medium truncate mb-1">
                            {title}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-2">
                            {content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="space-y-2 border-t pt-4">
                  <Button
                    onClick={handleGenerateIdea}
                    disabled={selectedModules.length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {text[currentLanguage].generateIdea}
                  </Button>
                  
                  <Button
                    onClick={handleClearAll}
                    disabled={selectedModules.length === 0}
                    variant="outline"
                    className="w-full"
                  >
                    {text[currentLanguage].clearAll}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemixStudio;
