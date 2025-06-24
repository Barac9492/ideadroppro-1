
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shuffle, 
  Plus, 
  Lightbulb, 
  Users, 
  Target,
  DollarSign,
  Cog,
  Zap,
  TrendingUp,
  Shield,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useModuleLibrary } from '@/hooks/useModuleLibrary';
import { useModularIdeas } from '@/hooks/useModularIdeas';

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
  const [activeTab, setActiveTab] = useState('my-modules');
  const { modules, loading } = useModuleLibrary({ currentLanguage });
  const { modules: allModules } = useModularIdeas({ currentLanguage });

  const text = {
    ko: {
      title: '🎛️ 리믹스 스튜디오',
      subtitle: '모듈을 조합해서 새로운 아이디어를 만들어보세요',
      myModules: '내 모듈',
      publicModules: '공개 모듈',
      selectedModules: '선택된 모듈',
      addToMix: '믹스에 추가',
      removeFromMix: '믹스에서 제거',
      generateIdea: '새 아이디어 생성',
      clearAll: '모두 지우기',
      noModules: '저장된 모듈이 없습니다',
      noSelection: '모듈을 선택해주세요',
      createFirst: '먼저 Create 페이지에서 아이디어를 만들어보세요'
    },
    en: {
      title: '🎛️ Remix Studio',
      subtitle: 'Combine modules to create new ideas',
      myModules: 'My Modules',
      publicModules: 'Public Modules',
      selectedModules: 'Selected Modules',
      addToMix: 'Add to Mix',
      removeFromMix: 'Remove from Mix',
      generateIdea: 'Generate New Idea',
      clearAll: 'Clear All',
      noModules: 'No saved modules',
      noSelection: 'Please select modules',
      createFirst: 'Create your first idea on the Create page'
    }
  };

  const moduleIcons = {
    problem: <Target className="w-4 h-4" />,
    solution: <Lightbulb className="w-4 h-4" />,
    target_customer: <Users className="w-4 h-4" />,
    value_proposition: <Zap className="w-4 h-4" />,
    revenue_model: <DollarSign className="w-4 h-4" />,
    key_activities: <Cog className="w-4 h-4" />,
    channels: <TrendingUp className="w-4 h-4" />,
    competitive_advantage: <Shield className="w-4 h-4" />
  };

  const moduleColors = {
    problem: 'bg-red-100 text-red-800',
    solution: 'bg-yellow-100 text-yellow-800',
    target_customer: 'bg-blue-100 text-blue-800',
    value_proposition: 'bg-purple-100 text-purple-800',
    revenue_model: 'bg-green-100 text-green-800',
    key_activities: 'bg-orange-100 text-orange-800',
    channels: 'bg-cyan-100 text-cyan-800',
    competitive_advantage: 'bg-indigo-100 text-indigo-800'
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

  const handleClearAll = () => {
    setSelectedModules([]);
  };

  const handleGenerateIdea = () => {
    // TODO: Implement idea generation from selected modules
    console.log('Generating idea from modules:', selectedModules);
  };

  const renderModuleCard = (module: any, isFromLibrary = true) => {
    const moduleData = isFromLibrary ? module.module_data : module;
    const isSelected = isModuleSelected(module.id);

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
            <div className={`p-1.5 rounded ${moduleColors[moduleData.type] || 'bg-gray-100 text-gray-800'}`}>
              {moduleIcons[moduleData.type] || <Lightbulb className="w-4 h-4" />}
            </div>
            <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">
              {moduleData.score || 85}%
            </Badge>
          </div>
          <CardTitle className="text-sm font-medium">{moduleData.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-2">
          <p className="text-xs text-gray-600 line-clamp-2">
            {moduleData.content}
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
            {isSelected ? (
              <>
                <Trash2 className="w-3 h-3 mr-1" />
                {text[currentLanguage].removeFromMix}
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 mr-1" />
                {text[currentLanguage].addToMix}
              </>
            )}
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
          {/* Module Selection Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="my-modules">{text[currentLanguage].myModules}</TabsTrigger>
                <TabsTrigger value="public-modules">{text[currentLanguage].publicModules}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-modules" className="mt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading modules...</p>
                  </div>
                ) : modules.length === 0 ? (
                  <div className="text-center py-12">
                    <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
                      const moduleData = module.module_data || module;
                      return (
                        <div key={module.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1 rounded ${moduleColors[moduleData.type] || 'bg-gray-100'}`}>
                              {moduleIcons[moduleData.type] || <Lightbulb className="w-3 h-3" />}
                            </div>
                            <span className="text-xs font-medium truncate">
                              {moduleData.title}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleModuleToggle(module)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
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
                    <Trash2 className="w-4 h-4 mr-2" />
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
