
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Sparkles, Download, Share, X, Plus } from 'lucide-react';
import { useModularIdeas, IdeaModule } from '@/hooks/useModularIdeas';
import ModuleBrowser from './ModuleBrowser';

interface IdeaBuilderProps {
  currentLanguage: 'ko' | 'en';
}

const IdeaBuilder: React.FC<IdeaBuilderProps> = ({ currentLanguage }) => {
  const { templates, decomposeIdea, decomposing } = useModularIdeas({ currentLanguage });
  const [selectedModules, setSelectedModules] = useState<IdeaModule[]>([]);
  const [freeTextIdea, setFreeTextIdea] = useState('');
  const [showBrowser, setShowBrowser] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState('');

  const text = {
    ko: {
      title: '아이디어 빌더',
      subtitle: '모듈을 조합하여 새로운 아이디어를 만들어보세요',
      selectedModules: '선택된 모듈',
      noModulesSelected: '아직 모듈을 선택하지 않았습니다',
      addModules: '모듈 추가하기',
      browseMoodules: '모듈 브라우저',
      generateIdea: '아이디어 생성',
      generatedIdea: '생성된 아이디어',
      copyIdea: '아이디어 복사',
      shareIdea: '아이디어 공유',
      clearAll: '모두 지우기',
      freeTextInput: '또는 자유롭게 아이디어를 입력해보세요',
      decomposePrompt: '입력한 아이디어를 AI가 모듈로 분해합니다',
      decompose: '모듈로 분해하기',
      placeholder: '예: AI 기반 개인 맞춤형 학습 플랫폼 아이디어...',
      moduleTypes: {
        problem: '문제점',
        solution: '솔루션',
        target_customer: '타겟 고객',
        value_proposition: '가치 제안',
        revenue_model: '수익 모델',
        key_activities: '핵심 활동',
        key_resources: '핵심 자원',
        channels: '유통 채널',
        competitive_advantage: '경쟁 우위',
        market_size: '시장 규모',
        team: '팀',
        potential_risks: '잠재 리스크'
      }
    },
    en: {
      title: 'Idea Builder',
      subtitle: 'Combine modules to create innovative new ideas',
      selectedModules: 'Selected Modules',
      noModulesSelected: 'No modules selected yet',
      addModules: 'Add Modules',
      browseMoodules: 'Module Browser',
      generateIdea: 'Generate Idea',
      generatedIdea: 'Generated Idea',
      copyIdea: 'Copy Idea',
      shareIdea: 'Share Idea',
      clearAll: 'Clear All',
      freeTextInput: 'Or enter your idea freely',
      decomposePrompt: 'AI will decompose your idea into modules',
      decompose: 'Decompose into Modules',
      placeholder: 'e.g., AI-powered personalized learning platform idea...',
      moduleTypes: {
        problem: 'Problem',
        solution: 'Solution',
        target_customer: 'Target Customer',
        value_proposition: 'Value Proposition',
        revenue_model: 'Revenue Model',
        key_activities: 'Key Activities',
        key_resources: 'Key Resources',
        channels: 'Channels',
        competitive_advantage: 'Competitive Advantage',
        market_size: 'Market Size',
        team: 'Team',
        potential_risks: 'Potential Risks'
      }
    }
  };

  const handleModuleSelect = (module: IdeaModule) => {
    const moduleExists = selectedModules.some(selected => selected.id === module.id);
    const moduleTypeExists = selectedModules.some(selected => selected.module_type === module.module_type);

    if (!moduleExists) {
      if (moduleTypeExists) {
        // Replace existing module of same type
        setSelectedModules(prev => 
          prev.map(selected => 
            selected.module_type === module.module_type ? module : selected
          )
        );
      } else {
        // Add new module
        setSelectedModules(prev => [...prev, module]);
      }
      setShowBrowser(false);
    }
  };

  const handleRemoveModule = (moduleId: string) => {
    setSelectedModules(prev => prev.filter(module => module.id !== moduleId));
  };

  const handleGenerateIdea = () => {
    if (selectedModules.length === 0) return;

    const ideaComponents = selectedModules.reduce((acc, module) => {
      const typeName = text[currentLanguage].moduleTypes[module.module_type as keyof typeof text[typeof currentLanguage]['moduleTypes']];
      acc[typeName] = module.content;
      return acc;
    }, {} as Record<string, string>);

    const ideaText = Object.entries(ideaComponents)
      .map(([type, content]) => `${type}: ${content}`)
      .join('\n\n');

    setGeneratedIdea(ideaText);
  };

  const handleDecomposeIdea = async () => {
    if (!freeTextIdea.trim()) return;

    try {
      const decomposition = await decomposeIdea(freeTextIdea);
      
      // Convert decomposition to modules
      const newModules: Partial<IdeaModule>[] = Object.entries(decomposition).map(([type, content]) => ({
        id: `temp-${type}-${Date.now()}`,
        module_type: type,
        content: content as string,
        tags: [],
        created_by: 'temp',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        quality_score: 0,
        usage_count: 0
      }));

      setSelectedModules(newModules as IdeaModule[]);
      setFreeTextIdea('');
    } catch (error) {
      console.error('Decomposition failed:', error);
    }
  };

  const handleClearAll = () => {
    setSelectedModules([]);
    setGeneratedIdea('');
    setFreeTextIdea('');
  };

  const moduleTypeOrder = [
    'problem', 'solution', 'target_customer', 'value_proposition', 
    'revenue_model', 'key_activities', 'key_resources', 'channels',
    'competitive_advantage', 'market_size', 'team', 'potential_risks'
  ];

  const sortedModules = [...selectedModules].sort((a, b) => {
    const aIndex = moduleTypeOrder.indexOf(a.module_type);
    const bIndex = moduleTypeOrder.indexOf(b.module_type);
    return aIndex - bIndex;
  });

  if (showBrowser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{text[currentLanguage].browseMoodules}</h2>
          <Button onClick={() => setShowBrowser(false)} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
        <ModuleBrowser
          currentLanguage={currentLanguage}
          onModuleSelect={handleModuleSelect}
          selectedModules={selectedModules}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <span>{text[currentLanguage].title}</span>
        </h1>
        <p className="text-lg text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Free Text Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>{text[currentLanguage].freeTextInput}</span>
          </CardTitle>
          <p className="text-sm text-gray-600">{text[currentLanguage].decomposePrompt}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder={text[currentLanguage].placeholder}
            value={freeTextIdea}
            onChange={(e) => setFreeTextIdea(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button 
            onClick={handleDecomposeIdea}
            disabled={!freeTextIdea.trim() || decomposing}
            className="w-full"
          >
            {decomposing ? '분해 중...' : text[currentLanguage].decompose}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Selected Modules Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{text[currentLanguage].selectedModules} ({selectedModules.length})</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setShowBrowser(true)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {text[currentLanguage].addModules}
                </Button>
                {selectedModules.length > 0 && (
                  <Button 
                    onClick={handleClearAll}
                    variant="outline"
                    size="sm"
                  >
                    {text[currentLanguage].clearAll}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedModules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Plus className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>{text[currentLanguage].noModulesSelected}</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sortedModules.map((module, index) => (
                  <div key={module.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">
                        {text[currentLanguage].moduleTypes[module.module_type as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveModule(module.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700">{module.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Idea Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{text[currentLanguage].generatedIdea}</CardTitle>
              <Button 
                onClick={handleGenerateIdea}
                disabled={selectedModules.length === 0}
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {text[currentLanguage].generateIdea}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {generatedIdea ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {generatedIdea}
                  </pre>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(generatedIdea)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {text[currentLanguage].copyIdea}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    {text[currentLanguage].shareIdea}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>모듈을 선택하고 아이디어를 생성해보세요</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IdeaBuilder;
