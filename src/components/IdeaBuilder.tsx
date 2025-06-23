
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import { useModularIdeas, IdeaModule } from '@/hooks/useModularIdeas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import type { Database } from '@/integrations/supabase/types';

type ModuleType = Database['public']['Enums']['module_type'];

interface IdeaBuilderProps {
  currentLanguage: 'ko' | 'en';
}

const IdeaBuilder: React.FC<IdeaBuilderProps> = ({ currentLanguage }) => {
  const { decomposeIdea, decomposing } = useModularIdeas({ currentLanguage });
  const [freeTextIdea, setFreeTextIdea] = useState('');
  const [selectedModules, setSelectedModules] = useState<IdeaModule[]>([]);
  const [unifiedIdea, setUnifiedIdea] = useState('');
  const [isGeneratingUnified, setIsGeneratingUnified] = useState(false);
  const navigate = useNavigate();

  const text = {
    ko: {
      title: '아이디어 빌더',
      subtitle: '아이디어를 입력하면 AI가 분해하여 완성된 아이디어로 만들어드려요',
      freeTextInput: '아이디어를 입력해주세요',
      decompose: '모듈로 분해하기',
      generatedIdea: '생성된 완성 아이디어',
      generateUnified: '완성된 아이디어 생성',
      goToWorkspace: '작업실로 이동',
      placeholder: '예: AI 기반 개인 맞춤형 학습 플랫폼 아이디어...',
      decomposingText: '아이디어를 분해하는 중...',
      generatingText: '완성된 아이디어를 생성하는 중...',
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
      subtitle: 'Enter your idea and AI will decompose it into a complete, refined idea',
      freeTextInput: 'Enter your idea',
      decompose: 'Decompose into Modules',
      generatedIdea: 'Generated Complete Idea',
      generateUnified: 'Generate Complete Idea',
      goToWorkspace: 'Go to Workspace',
      placeholder: 'e.g., AI-powered personalized learning platform idea...',
      decomposingText: 'Decomposing idea...',
      generatingText: 'Generating complete idea...',
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

  const handleDecomposeIdea = async () => {
    if (!freeTextIdea.trim()) return;

    try {
      const decomposition = await decomposeIdea(freeTextIdea);
      
      // Convert decomposition to modules with proper type casting
      const newModules: IdeaModule[] = Object.entries(decomposition).map(([type, content]) => ({
        id: `temp-${type}-${Date.now()}`,
        module_type: type as ModuleType,
        content: content as string,
        tags: [],
        created_by: 'temp',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        quality_score: 0,
        usage_count: 0
      }));

      setSelectedModules(newModules);
    } catch (error) {
      console.error('Decomposition failed:', error);
    }
  };

  const handleGenerateUnifiedIdea = async () => {
    if (selectedModules.length === 0 || !freeTextIdea.trim()) return;

    setIsGeneratingUnified(true);
    try {
      const modulesObj = selectedModules.reduce((acc, module) => {
        acc[module.module_type] = module.content;
        return acc;
      }, {} as Record<string, string>);

      const { data, error } = await supabase.functions.invoke('generate-unified-idea', {
        body: {
          originalIdea: freeTextIdea,
          modules: modulesObj,
          language: currentLanguage
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate unified idea');
      }

      setUnifiedIdea(data.unifiedIdea);
      
      toast({
        title: currentLanguage === 'ko' ? '완성된 아이디어 생성 완료!' : 'Complete idea generated!',
        description: currentLanguage === 'ko' ? '작업실로 이동하여 더 발전시켜보세요' : 'Move to workspace to develop it further',
      });
    } catch (error: any) {
      console.error('Error generating unified idea:', error);
      toast({
        title: currentLanguage === 'ko' ? '오류 발생' : 'Error occurred',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingUnified(false);
    }
  };

  const handleGoToWorkspace = () => {
    if (unifiedIdea) {
      // Navigate to workspace with the unified idea
      navigate('/ideas', { state: { newIdea: unifiedIdea } });
    }
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
            {decomposing ? text[currentLanguage].decomposingText : text[currentLanguage].decompose}
          </Button>
        </CardContent>
      </Card>

      {selectedModules.length > 0 && (
        <>
          <Separator />

          {/* Decomposed Modules Display */}
          <Card>
            <CardHeader>
              <CardTitle>분해된 모듈들 ({selectedModules.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {sortedModules.map((module, index) => (
                  <div key={module.id} className="border rounded-lg p-4 space-y-2">
                    <Badge variant="secondary">
                      {text[currentLanguage].moduleTypes[module.module_type as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
                    </Badge>
                    <p className="text-sm text-gray-700">{module.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={handleGenerateUnifiedIdea}
                  disabled={isGeneratingUnified}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  {isGeneratingUnified ? (
                    text[currentLanguage].generatingText
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {text[currentLanguage].generateUnified}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Generated Unified Idea */}
      {unifiedIdea && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-green-500" />
              <span>{text[currentLanguage].generatedIdea}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <p className="text-lg text-gray-800 leading-relaxed">{unifiedIdea}</p>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleGoToWorkspace}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {text[currentLanguage].goToWorkspace}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IdeaBuilder;
