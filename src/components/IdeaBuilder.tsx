import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Lightbulb, Sparkles, ArrowRight, Shuffle, Zap, Save, MessageSquare } from 'lucide-react';
import { useModularIdeas, IdeaModule } from '@/hooks/useModularIdeas';
import { useModuleLibrary } from '@/hooks/useModuleLibrary';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';
import AIQuestionFlow from './AIQuestionFlow';
import ViralShareCard from './ViralShareCard';

type ModuleType = Database['public']['Enums']['module_type'];

interface IdeaBuilderProps {
  currentLanguage: 'ko' | 'en';
  initialIdea?: string;
  autoStart?: boolean;
}

const IdeaBuilder: React.FC<IdeaBuilderProps> = ({ 
  currentLanguage, 
  initialIdea = '',
  autoStart = false 
}) => {
  const { user } = useAuth();
  const [freeTextIdea, setFreeTextIdea] = useState(initialIdea);
  const [selectedModules, setSelectedModules] = useState<IdeaModule[]>([]);
  const [selectedForSaving, setSelectedForSaving] = useState<Set<string>>(new Set());
  const [unifiedIdea, setUnifiedIdea] = useState('');
  const [isGeneratingUnified, setIsGeneratingUnified] = useState(false);
  const [currentStep, setCurrentStep] = useState<'input' | 'interactive' | 'modules' | 'unified'>('input');
  const [generatedGrade, setGeneratedGrade] = useState<string>('');
  const [showViralShare, setShowViralShare] = useState(false);
  const navigate = useNavigate();

  // Pre-fill the input but don't auto-start
  useEffect(() => {
    setFreeTextIdea(initialIdea);
  }, [initialIdea]);

  const text = {
    ko: {
      title: 'AI 아이디어 빌더',
      subtitle: 'AI와 함께 대화하며 완전한 비즈니스 모델을 만들어보세요',
      freeTextInput: '아이디어를 입력해주세요',
      startInteractive: '🤖 AI와 대화 시작하기',
      generatedIdea: '완성된 통합 아이디어',
      generateUnified: '통합 아이디어 생성',
      goToRemix: '리믹스 스튜디오로 이동',
      saveModules: '선택한 모듈 저장',
      saveToLibrary: '내 라이브러리에 저장',
      selectModules: '저장할 모듈 선택',
      allModules: '모든 모듈',
      selectedCount: '개 선택됨',
      placeholder: '예: AI 기반 개인 맞춤형 학습 플랫폼 아이디어...',
      generatingText: '통합 아이디어를 생성하는 중...',
      moduleCards: '생성된 아이디어 카드들',
      interactiveDescription: 'AI가 질문을 통해 더 구체적이고 실현 가능한 아이디어로 발전시켜드려요. 단계별로 함께 완성해보세요!',
      gradeDisplay: '1차 완성 등급',
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
      subtitle: 'Create a complete business model through conversation with AI',
      freeTextInput: 'Enter your idea',
      startInteractive: '🤖 Start AI Conversation',
      generatedIdea: 'Generated Unified Idea',
      generateUnified: 'Generate Unified Idea',
      goToRemix: 'Go to Remix Studio',
      saveSelectedModules: 'Save Selected Modules',
      saveToLibrary: 'Save to My Library',
      selectModules: 'Select modules to save',
      allModules: 'All Modules',
      selectedCount: ' selected',
      placeholder: 'e.g., AI-powered personalized learning platform idea...',
      generatingText: 'Generating unified idea...',
      moduleCards: 'Generated Idea Cards',
      interactiveDescription: 'AI will develop your idea into something more specific and feasible through questions. Let\'s complete it step by step!',
      gradeDisplay: '1st Completion Grade',
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

  const handleStartInteractive = () => {
    if (!freeTextIdea.trim()) {
      toast({
        title: currentLanguage === 'ko' ? '아이디어를 입력해주세요' : 'Please enter an idea',
        variant: 'destructive',
      });
      return;
    }

    setCurrentStep('interactive');
  };

  const handleInteractiveComplete = (modules: IdeaModule[], unifiedIdea: string, grade: string) => {
    setSelectedModules(modules);
    setUnifiedIdea(unifiedIdea);
    setGeneratedGrade(grade);
    setCurrentStep('unified');
    
    // Show viral sharing after completion
    setShowViralShare(true);
  };

  const handleModuleSelectionToggle = (moduleId: string) => {
    setSelectedForSaving(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handleSelectAllModules = () => {
    if (selectedForSaving.size === selectedModules.length) {
      setSelectedForSaving(new Set());
    } else {
      setSelectedForSaving(new Set(selectedModules.map(m => m.id)));
    }
  };

  const handleSaveSelectedModules = async () => {
    if (!user) {
      toast({
        title: currentLanguage === 'ko' ? '로그인이 필요합니다' : 'Login required',
        variant: 'destructive',
      });
      return;
    }

    const modulesToSave = selectedModules.filter(m => selectedForSaving.has(m.id));
    
    if (modulesToSave.length === 0) {
      toast({
        title: currentLanguage === 'ko' ? '저장할 모듈을 선택해주세요' : 'Please select modules to save',
        variant: 'destructive',
      });
      return;
    }

    const { saveModulesToLibrary, saving } = useModuleLibrary({ currentLanguage });
    const success = await saveModulesToLibrary(modulesToSave, freeTextIdea);
    if (success) {
      setSelectedForSaving(new Set());
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

  const expectedModuleTypes = [
    'problem', 'solution', 'target_customer', 'value_proposition', 
    'revenue_model', 'competitive_advantage'
  ];

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-green-600 bg-green-50';
    if (grade.includes('B')) return 'text-blue-600 bg-blue-50';
    if (grade.includes('C')) return 'text-yellow-600 bg-yellow-50';
    if (grade.includes('D')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (currentStep === 'interactive') {
    return (
      <AIQuestionFlow
        currentLanguage={currentLanguage}
        initialIdea={freeTextIdea}
        onComplete={handleInteractiveComplete}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <span>{text[currentLanguage].title}</span>
        </h1>
        <p className="text-lg text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Simplified Input Section */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>{text[currentLanguage].freeTextInput}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea 
            placeholder={text[currentLanguage].placeholder}
            value={freeTextIdea}
            onChange={(e) => setFreeTextIdea(e.target.value)}
            rows={4}
            className="resize-none text-lg border-purple-200 focus:border-purple-400"
          />
          
          {/* AI Conversation CTA */}
          <div className="text-center space-y-4">
            <p className="text-purple-700 font-medium leading-relaxed">
              {text[currentLanguage].interactiveDescription}
            </p>
            <Button 
              onClick={handleStartInteractive}
              disabled={!freeTextIdea.trim()}
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              {text[currentLanguage].startInteractive}
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Viral Share Modal */}
      {showViralShare && generatedGrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {currentLanguage === 'ko' ? '🎉 분석 완료!' : '🎉 Analysis Complete!'}
              </h2>
              <p className="text-gray-600">
                {currentLanguage === 'ko' ? '친구들에게 자랑해보세요!' : 'Share with your friends!'}
              </p>
            </div>
            
            <ViralShareCard
              grade={generatedGrade}
              ideaTitle={initialIdea || freeTextIdea}
              userName={user?.email?.split('@')[0] || 'Anonymous'}
              currentLanguage={currentLanguage}
            />
            
            <div className="flex justify-center space-x-3 mt-4">
              <Button
                onClick={() => setShowViralShare(false)}
                variant="outline"
                className="px-6"
              >
                {currentLanguage === 'ko' ? '나중에' : 'Later'}
              </Button>
              <Button
                onClick={() => {
                  setShowViralShare(false);
                  handleGoToRemix();
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-6"
              >
                {currentLanguage === 'ko' ? '리믹스 하기' : 'Start Remix'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section - only show after completion */}
      {selectedModules.length > 0 && (
        <>
          <Separator />

          {/* Grade Display */}
          {generatedGrade && (
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className={`px-4 py-2 rounded-full text-2xl font-bold ${
                    generatedGrade.includes('A') ? 'text-green-600 bg-green-50' :
                    generatedGrade.includes('B') ? 'text-blue-600 bg-blue-50' :
                    generatedGrade.includes('C') ? 'text-yellow-600 bg-yellow-50' :
                    generatedGrade.includes('D') ? 'text-orange-600 bg-orange-50' :
                    'text-red-600 bg-red-50'
                  }`}>
                    {generatedGrade}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{text[currentLanguage].gradeDisplay}</h3>
                    <p className="text-sm text-gray-600">
                      {currentLanguage === 'ko' ? '리믹스로 더 높은 등급에 도전하세요!' : 'Challenge for higher grades with remix!'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Module Cards Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <span>{text[currentLanguage].moduleCards} ({selectedModules.length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleGoToRemix}
                    variant="outline"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    {text[currentLanguage].goToRemix}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedModules.map((module, index) => (
                  <div 
                    key={module.id} 
                    className={`bg-gradient-to-br ${getModuleCardColor(module.module_type)} rounded-xl p-4 space-y-3 border-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary"
                        className="bg-white/70 text-gray-700 font-medium"
                      >
                        {text[currentLanguage].moduleTypes[module.module_type as keyof typeof text[typeof currentLanguage]['moduleTypes']] || module.module_type}
                      </Badge>
                      <Checkbox
                        checked={selectedForSaving.has(module.id)}
                        onCheckedChange={() => {
                          setSelectedForSaving(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(module.id)) {
                              newSet.delete(module.id);
                            } else {
                              newSet.add(module.id);
                            }
                            return newSet;
                          });
                        }}
                        className="border-2 border-white/70"
                      />
                    </div>
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
              
              {/* Module Selection and Save Section */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedForSaving.size === selectedModules.length}
                      onCheckedChange={() => {
                        if (selectedForSaving.size === selectedModules.length) {
                          setSelectedForSaving(new Set());
                        } else {
                          setSelectedForSaving(new Set(selectedModules.map(m => m.id)));
                        }
                      }}
                    />
                    <span className="text-sm font-medium">
                      {text[currentLanguage].allModules} ({selectedForSaving.size}{text[currentLanguage].selectedCount})
                    </span>
                  </div>
                  <Button
                    onClick={handleSaveSelectedModules}
                    disabled={selectedForSaving.size === 0 || saving}
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    {saving ? (
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {text[currentLanguage].saveToLibrary}
                  </Button>
                </div>
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
      {unifiedIdea && currentStep === 'unified' && (
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
