import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Target, 
  Users, 
  DollarSign, 
  Cog, 
  Zap, 
  TrendingUp, 
  Shield,
  Edit3,
  Save,
  Shuffle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useModularIdeas } from '@/hooks/useModularIdeas';
import { useModuleLibrary } from '@/hooks/useModuleLibrary';

interface ModuleData {
  type: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
  score: number;
}

interface AIModuleBreakdownProps {
  currentLanguage: 'ko' | 'en';
  completedModules: any[];
  unifiedIdea: string;
  onSaveToLibrary: () => void;
  onGoToRemix: () => void;
  onImproveModule: (moduleType: string) => void;
}

const AIModuleBreakdown: React.FC<AIModuleBreakdownProps> = ({
  currentLanguage,
  completedModules,
  unifiedIdea,
  onSaveToLibrary,
  onGoToRemix,
  onImproveModule
}) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [moduleCards, setModuleCards] = useState<ModuleData[]>([]);
  const { decomposeIdea, decomposing } = useModularIdeas({ currentLanguage });
  const { saveModulesToLibrary, saving } = useModuleLibrary({ currentLanguage });

  const text = {
    ko: {
      title: '🧩 모듈 분해 완료!',
      subtitle: '당신의 아이디어가 8개 핵심 모듈로 분해되었습니다',
      overallScore: '전체 완성도',
      moduleScore: '모듈 점수',
      expandModule: '자세히 보기',
      improveModule: '이 모듈 개선하기',
      saveToLibrary: '내 모듈 라이브러리에 저장',
      goToRemix: '리믹스 스튜디오로 이동',
      nextSteps: '다음 단계',
      breakdown: '분해 중...',
      saving: '저장 중...',
      saved: '저장 완료!',
      moduleTypes: {
        problem: '문제 정의',
        solution: '솔루션',
        target_customer: '타겟 고객',
        value_proposition: '가치 제안',
        revenue_model: '수익 모델',
        key_activities: '핵심 활동',
        channels: '유통 채널',
        competitive_advantage: '경쟁 우위'
      }
    },
    en: {
      title: '🧩 Module Breakdown Complete!',
      subtitle: 'Your idea has been decomposed into 8 core modules',
      overallScore: 'Overall Completion',
      moduleScore: 'Module Score',
      expandModule: 'View Details',
      improveModule: 'Improve This Module',
      saveToLibrary: 'Save to Module Library',
      goToRemix: 'Go to Remix Studio',
      nextSteps: 'Next Steps',
      breakdown: 'Breaking down...',
      saving: 'Saving...',
      saved: 'Saved!',
      moduleTypes: {
        problem: 'Problem Definition',
        solution: 'Solution',
        target_customer: 'Target Customer',
        value_proposition: 'Value Proposition',
        revenue_model: 'Revenue Model',
        key_activities: 'Key Activities',
        channels: 'Channels',
        competitive_advantage: 'Competitive Advantage'
      }
    }
  };

  const moduleIcons = {
    problem: <Target className="w-5 h-5" />,
    solution: <Lightbulb className="w-5 h-5" />,
    target_customer: <Users className="w-5 h-5" />,
    value_proposition: <Zap className="w-5 h-5" />,
    revenue_model: <DollarSign className="w-5 h-5" />,
    key_activities: <Cog className="w-5 h-5" />,
    channels: <TrendingUp className="w-5 h-5" />,
    competitive_advantage: <Shield className="w-5 h-5" />
  };

  const moduleColors = {
    problem: 'bg-red-50 border-red-200 text-red-800',
    solution: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    target_customer: 'bg-blue-50 border-blue-200 text-blue-800',
    value_proposition: 'bg-purple-50 border-purple-200 text-purple-800',
    revenue_model: 'bg-green-50 border-green-200 text-green-800',
    key_activities: 'bg-orange-50 border-orange-200 text-orange-800',
    channels: 'bg-cyan-50 border-cyan-200 text-cyan-800',
    competitive_advantage: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  };

  useEffect(() => {
    if (unifiedIdea && moduleCards.length === 0) {
      handleDecomposeIdea();
    }
  }, [unifiedIdea]);

  const handleDecomposeIdea = async () => {
    try {
      const decomposition = await decomposeIdea(unifiedIdea);
      
      const cards: ModuleData[] = Object.entries(decomposition).map(([key, content]) => ({
        type: key,
        title: text[currentLanguage].moduleTypes[key as keyof typeof text[typeof currentLanguage]['moduleTypes']] || key,
        content: content as string,
        icon: moduleIcons[key as keyof typeof moduleIcons] || <Lightbulb className="w-5 h-5" />,
        color: moduleColors[key as keyof typeof moduleColors] || 'bg-gray-50 border-gray-200 text-gray-800',
        score: Math.floor(Math.random() * 30) + 70 // Simulate scores between 70-100
      }));
      
      setModuleCards(cards);
    } catch (error) {
      console.error('Failed to decompose idea:', error);
    }
  };

  const handleSaveToLibrary = async () => {
    const success = await saveModulesToLibrary(moduleCards, unifiedIdea);
    if (success) {
      onSaveToLibrary();
    }
  };

  const handleGoToRemix = () => {
    onGoToRemix();
  };

  const overallScore = moduleCards.length > 0 
    ? Math.floor(moduleCards.reduce((sum, module) => sum + module.score, 0) / moduleCards.length)
    : 0;

  if (decomposing || moduleCards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {text[currentLanguage].breakdown}
        </h2>
        <p className="text-gray-600">AI가 당신의 아이디어를 분석하고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          {text[currentLanguage].title}
        </h1>
        <p className="text-xl text-gray-600">
          {text[currentLanguage].subtitle}
        </p>
        
        {/* Overall Score */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {text[currentLanguage].overallScore}
            </span>
            <span className="text-sm font-bold text-purple-600">
              {overallScore}%
            </span>
          </div>
          <Progress value={overallScore} className="h-2" />
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {moduleCards.map((module, index) => (
          <Card 
            key={module.type}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              expandedModule === module.type ? 'ring-2 ring-purple-500' : ''
            }`}
            onClick={() => setExpandedModule(expandedModule === module.type ? null : module.type)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${module.color}`}>
                  {module.icon}
                </div>
                <Badge variant="secondary">
                  {module.score}%
                </Badge>
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className={`text-sm text-gray-600 ${
                expandedModule === module.type ? '' : 'line-clamp-3'
              }`}>
                {module.content}
              </p>
              
              {expandedModule === module.type && (
                <div className="space-y-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImproveModule(module.type);
                    }}
                    className="w-full"
                  >
                    <Edit3 className="w-3 h-3 mr-2" />
                    {text[currentLanguage].improveModule}
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{text[currentLanguage].moduleScore}: {module.score}%</span>
                <span className="text-purple-600">
                  {expandedModule === module.type ? '접기' : text[currentLanguage].expandModule}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-8 text-center space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {text[currentLanguage].nextSteps}
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleSaveToLibrary}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? text[currentLanguage].saving : text[currentLanguage].saveToLibrary}
            </Button>
            
            <Button
              onClick={handleGoToRemix}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {text[currentLanguage].goToRemix}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModuleBreakdown;
