
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Plus } from 'lucide-react';
import { getModuleTitle, getModuleContent, getModuleScore, getModuleType } from '@/utils/moduleUtils';

interface CurrentIdeaStateProps {
  currentModules: any[];
  sourceIdea: string;
  currentLanguage: 'ko' | 'en';
  onImproveModule: (moduleType: string) => void;
}

const CurrentIdeaState: React.FC<CurrentIdeaStateProps> = ({
  currentModules,
  sourceIdea,
  currentLanguage,
  onImproveModule
}) => {
  const text = {
    ko: {
      title: '현재 아이디어 상태',
      subtitle: '개선하고 싶은 부분을 선택해보세요',
      improve: '개선하기',
      empty: '아직 모듈이 없음',
      addModule: '모듈 추가',
      moduleTypes: {
        problem: '문제 정의',
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
      title: 'Current Idea State',
      subtitle: 'Select the part you want to improve',
      improve: 'Improve',
      empty: 'No module yet',
      addModule: 'Add Module',
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

  // Standard module types for business ideas
  const standardModuleTypes = [
    'problem', 'solution', 'target_customer', 'value_proposition',
    'revenue_model', 'key_activities', 'channels', 'competitive_advantage'
  ];

  // Create a map of existing modules by type
  const modulesByType = currentModules.reduce((acc, module) => {
    const type = getModuleType(module);
    acc[type] = module;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {text[currentLanguage].title}
        </h2>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
        {sourceIdea && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium">원본 아이디어:</p>
            <p className="text-blue-700">{sourceIdea}</p>
          </div>
        )}
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {standardModuleTypes.map((moduleType) => {
          const module = modulesByType[moduleType];
          const hasModule = !!module;
          
          return (
            <Card 
              key={moduleType}
              className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
                hasModule 
                  ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100 border-dashed'
              }`}
              onClick={() => onImproveModule(moduleType)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={hasModule ? "default" : "secondary"}
                    className={hasModule ? "bg-green-600" : ""}
                  >
                    {text[currentLanguage].moduleTypes[moduleType as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
                  </Badge>
                  {hasModule && (
                    <Badge variant="outline" className="text-xs">
                      {getModuleScore(module)}점
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {hasModule ? (
                  <>
                    <div className="min-h-[60px]">
                      <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {getModuleTitle(module)}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {getModuleContent(module)}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {text[currentLanguage].improve}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="min-h-[60px] flex items-center justify-center">
                      <p className="text-xs text-gray-500 text-center">
                        {text[currentLanguage].empty}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full border-dashed"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {text[currentLanguage].addModule}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              진행 상황: {currentModules.length}/8 모듈 완성
            </h3>
            <p className="text-sm text-gray-600">
              모든 모듈을 채우면 더 완성도 높은 아이디어가 됩니다
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentModules.length / 8) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((currentModules.length / 8) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentIdeaState;
