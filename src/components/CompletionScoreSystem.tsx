
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Zap } from 'lucide-react';

interface CompletionScoreSystemProps {
  moduleCount: number;
  totalModules: number;
  currentLanguage: 'ko' | 'en';
}

const CompletionScoreSystem: React.FC<CompletionScoreSystemProps> = ({
  moduleCount,
  totalModules = 12,
  currentLanguage
}) => {
  const text = {
    ko: {
      basicIdea: '기본 아이디어',
      developedIdea: '발전된 아이디어',
      completeIdea: '완성된 아이디어',
      expertIdea: '전문가급 아이디어',
      modulesCompleted: '개 모듈 완성',
      scoreRange: '점수 범위',
      bonusFeatures: '보너스 기능',
      remixEligible: '리믹스 가능',
      priorityDisplay: '우선 노출',
      expertBadge: '전문가 뱃지'
    },
    en: {
      basicIdea: 'Basic Idea',
      developedIdea: 'Developed Idea',
      completeIdea: 'Complete Idea',
      expertIdea: 'Expert Idea',
      modulesCompleted: 'modules completed',
      scoreRange: 'Score Range',
      bonusFeatures: 'Bonus Features',
      remixEligible: 'Remix Eligible',
      priorityDisplay: 'Priority Display',
      expertBadge: 'Expert Badge'
    }
  };

  const getCompletionTier = (count: number) => {
    if (count >= 10) return { 
      tier: 4, 
      name: text[currentLanguage].expertIdea, 
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      icon: Trophy,
      scoreMin: 80,
      scoreMax: 100
    };
    if (count >= 7) return { 
      tier: 3, 
      name: text[currentLanguage].completeIdea, 
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      icon: Star,
      scoreMin: 60,
      scoreMax: 79
    };
    if (count >= 4) return { 
      tier: 2, 
      name: text[currentLanguage].developedIdea, 
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      icon: Target,
      scoreMin: 40,
      scoreMax: 59
    };
    return { 
      tier: 1, 
      name: text[currentLanguage].basicIdea, 
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      icon: Zap,
      scoreMin: 20,
      scoreMax: 39
    };
  };

  const currentTier = getCompletionTier(moduleCount);
  const nextTier = getCompletionTier(moduleCount + 1);
  const progressPercent = (moduleCount / totalModules) * 100;
  const IconComponent = currentTier.icon;

  const getBonusFeatures = (tier: number) => {
    const features = [];
    if (tier >= 2) features.push(text[currentLanguage].remixEligible);
    if (tier >= 3) features.push(text[currentLanguage].priorityDisplay);
    if (tier >= 4) features.push(text[currentLanguage].expertBadge);
    return features;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Current Tier */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${currentTier.color} text-white`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{currentTier.name}</h3>
              <p className="text-sm text-gray-600">
                {moduleCount} {text[currentLanguage].modulesCompleted}
              </p>
            </div>
          </div>
          <Badge className={currentTier.color.replace('bg-gradient-to-r', 'bg-gradient-to-r')}>
            Tier {currentTier.tier}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>진행률</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Score Range */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">{text[currentLanguage].scoreRange}</span>
            <span className="font-bold text-lg">
              {currentTier.scoreMin} - {currentTier.scoreMax}점
            </span>
          </div>
        </div>

        {/* Bonus Features */}
        {getBonusFeatures(currentTier.tier).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">
              {text[currentLanguage].bonusFeatures}
            </h4>
            <div className="flex flex-wrap gap-2">
              {getBonusFeatures(currentTier.tier).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Next Tier Preview */}
        {currentTier.tier < 4 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>{nextTier.name}</strong>까지 {
                (currentTier.tier === 1 ? 4 : currentTier.tier === 2 ? 7 : 10) - moduleCount
              }개 모듈 더 필요
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletionScoreSystem;
