import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, Check, Plus } from 'lucide-react';
import { IdeaModule } from '@/hooks/useModularIdeas';
import { getModuleTitle } from '@/utils/moduleUtils';

interface ModuleCardProps {
  module: IdeaModule;
  isSelected: boolean;
  onSelect: () => void;
  currentLanguage: 'ko' | 'en';
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isSelected,
  onSelect,
  currentLanguage
}) => {
  const text = {
    ko: {
      select: '선택',
      selected: '선택됨',
      usageCount: '사용됨',
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
      select: 'Select',
      selected: 'Selected',
      usageCount: 'used',
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

  const title = getModuleTitle(module);

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Badge 
            variant={isSelected ? "default" : "secondary"}
            className={isSelected ? "bg-purple-600" : ""}
          >
            {text[currentLanguage].moduleTypes[module.module_type as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
          </Badge>
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            className={`ml-2 ${isSelected ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
          >
            {isSelected ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                {text[currentLanguage].selected}
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 mr-1" />
                {text[currentLanguage].select}
              </>
            )}
          </Button>
        </div>
        
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            {module.content}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {module.quality_score > 0 && (
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                <span>{module.quality_score.toFixed(1)}</span>
              </div>
            )}
            {module.usage_count > 0 && (
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1 text-blue-500" />
                <span>{module.usage_count} {text[currentLanguage].usageCount}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
