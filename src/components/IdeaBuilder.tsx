
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Sparkles, ArrowRight, Shuffle, Zap } from 'lucide-react';
import { useModularIdeas, IdeaModule } from '@/hooks/useModularIdeas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import type { Database } from '@/integrations/supabase/types';

type ModuleType = Database['public']['Enums']['module_type'];

interface IdeaBuilderProps {
  currentLanguage: 'ko' | 'en';
  initialIdea?: string;
}

const IdeaBuilder: React.FC<IdeaBuilderProps> = ({ currentLanguage, initialIdea = '' }) => {
  const { decomposeIdea, decomposing } = useModularIdeas({ currentLanguage });
  const [freeTextIdea, setFreeTextIdea] = useState(initialIdea);
  const [selectedModules, setSelectedModules] = useState<IdeaModule[]>([]);
  const [unifiedIdea, setUnifiedIdea] = useState('');
  const [isGeneratingUnified, setIsGeneratingUnified] = useState(false);
  const [currentStep, setCurrentStep] = useState<'input' | 'analyzing' | 'modules' | 'unified'>('input');
  const navigate = useNavigate();

  // Update freeTextIdea when initialIdea changes
  useEffect(() => {
    setFreeTextIdea(initialIdea);
    if (initialIdea) {
      setCurrentStep('input');
    }
  }, [initialIdea]);

  const text = {
    ko: {
      title: 'AI 아이디어 빌더',
      subtitle: 'AI가 당신의 아이디어를 분석하고 완전한 비즈니스 모델 카드로 만들어드려요',
      freeTextInput: '아이디어를 입력해주세요',
      decompose: 'AI로 분석 시작',
      generatedIdea: '완성된 통합 아이디어',
      generateUnified: '통합 아이디어 생성',
      goToRemix: '리믹스 스튜디오로 이동',
      saveModules: '내 모듈 컬렉션에 저장',
      placeholder: '예: AI 기반 개인 맞춤형 학습 플랫폼 아이디어...',
      decomposingText: 'AI가 아이디어를 분석하는 중...',
      generatingText: '통합 아이디어를 생성하는 중...',
      moduleCards: '생성된 아이디어 카드들',
      stepLabels: {
        analyzing: 'AI가 분석 중',
        processing: '카드로 변환 중',
        ready: '리믹스 준비 완료'
      },
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
      title: 'AI Idea Builder',
      subtitle: 'AI analyzes your idea and creates complete business model cards',
      freeTextInput: 'Enter your idea',
      decompose: 'Start AI Analysis',
      generatedIdea: 'Generated Unified Idea',
      generateUnified: 'Generate Unified Idea',
      goToRemix: 'Go to Remix Studio',
      saveModules: 'Save to My Module Collection',
      placeholder: 'e.g., AI-powered personalized learning platform idea...',
      decomposingText: 'AI is analyzing your idea...',
      generatingText: 'Generating unified idea...',
      moduleCards: 'Generated Idea Cards',
      stepLabels: {
        analyzing: 'AI Analyzing',
        processing: 'Converting to Cards',
        ready: 'Remix Ready'
      },
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

    setCurrentStep('analyzing');

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
      setCurrentStep('modules');

      toast({
        title: currentLanguage === 'ko' ? '카드 생성 완료!' : 'Cards Generated!',
        description: currentLanguage === 'ko' ? '아이디어가 모듈 카드로 변환되었습니다' : 'Your idea has been converted to module cards',
      });
    } catch (error) {
      console.error('Decomposition failed:', error);
      setCurrentStep('input');
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
      setCurrentStep('unified');
      
      toast({
        title: currentLanguage === 'ko' ? '통합 아이디어 생성 완료!' : 'Unified idea generated!',
        description: currentLanguage === 'ko' ? '리믹스 스튜디오에서 더 발전시켜보세요' : 'Develop it further in the remix studio',
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

  const handleGoToRemix = () => {
    // Navigate to remix with the generated modules
    navigate('/remix', { 
      state: { 
        sourceModules: selectedModules,
        originalIdea: freeTextIdea 
      } 
    });
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

  // Enhanced module card colors
  const getModuleCardColor = (moduleType: string) => {
    const colorMap: Record<string, string> = {
      problem: 'from-red-100 to-red-200 border-red-300',
      solution: 'from-blue-100 to-blue-200 border-blue-300',
      target_customer: 'from-green-100 to-green-200 border-green-300',
      value_proposition: 'from-purple-100 to-purple-200 border-purple-300',
      revenue_model: 'from-yellow-100 to-yellow-200 border-yellow-300',
      key_activities: 'from-cyan-100 to-cyan-200 border-cyan-300',
      key_resources: 'from-indigo-100 to-indigo-200 border-indigo-300',
      channels: 'from-pink-100 to-pink-200 border-pink-300',
      competitive_advantage: 'from-orange-100 to-orange-200 border-orange-300',
      market_size: 'from-teal-100 to-teal-200 border-teal-300',
      team: 'from-violet-100 to-violet-200 border-violet-300',
      potential_risks: 'from-rose-100 to-rose-200 border-rose-300'
    };
    return colorMap[moduleType] || 'from-gray-100 to-gray-200 border-gray-300';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Enhanced Header with Progress */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <span>{text[currentLanguage].title}</span>
        </h1>
        <p className="text-lg text-gray-600">{text[currentLanguage].subtitle}</p>
        
        {/* Progress Indicator */}
        {currentStep !== 'input' && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <div className={`flex items-center space-x-2 ${currentStep === 'analyzing' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-3 h-3 rounded-full ${currentStep === 'analyzing' ? 'bg-purple-600 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-sm">{text[currentLanguage].stepLabels.analyzing}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center space-x-2 ${currentStep === 'modules' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-3 h-3 rounded-full ${currentStep === 'modules' ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-sm">{text[currentLanguage].stepLabels.processing}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className={`flex items-center space-x-2 ${currentStep === 'unified' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-3 h-3 rounded-full ${currentStep === 'unified' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <span className="text-sm">{text[currentLanguage].stepLabels.ready}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
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
            disabled={currentStep === 'analyzing'}
          />
          <Button 
            onClick={handleDecomposeIdea}
            disabled={!freeTextIdea.trim() || decomposing || currentStep === 'analyzing'}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {decomposing || currentStep === 'analyzing' ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                {text[currentLanguage].decomposingText}
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                {text[currentLanguage].decompose}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Module Cards Display */}
      {selectedModules.length > 0 && (
        <>
          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <span>{text[currentLanguage].moduleCards} ({selectedModules.length})</span>
                </div>
                <Button
                  onClick={handleGoToRemix}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  {text[currentLanguage].goToRemix}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedModules.map((module, index) => (
                  <div 
                    key={module.id} 
                    className={`bg-gradient-to-br ${getModuleCardColor(module.module_type)} rounded-xl p-4 space-y-3 border-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1`}
                  >
                    <Badge 
                      variant="secondary"
                      className="bg-white/70 text-gray-700 font-medium"
                    >
                      {text[currentLanguage].moduleTypes[module.module_type as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
                    </Badge>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">
                      {module.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        #{index + 1}
                      </div>
                      <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center space-x-4">
                <Button 
                  onClick={handleGenerateUnifiedIdea}
                  disabled={isGeneratingUnified}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  {isGeneratingUnified ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      {text[currentLanguage].generatingText}
                    </>
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
            
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={handleGoToRemix}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                {text[currentLanguage].goToRemix}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IdeaBuilder;
