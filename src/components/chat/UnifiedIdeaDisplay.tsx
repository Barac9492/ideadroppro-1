
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  Users, 
  Zap, 
  DollarSign, 
  Shield,
  Lightbulb,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface UnifiedIdeaDisplayProps {
  moduleData: Record<string, string>;
  currentLanguage: 'ko' | 'en';
  completionScore: number;
}

const UnifiedIdeaDisplay: React.FC<UnifiedIdeaDisplayProps> = ({
  moduleData,
  currentLanguage,
  completionScore
}) => {
  const text = {
    ko: {
      title: '🚀 완성된 아이디어 스토리',
      subtitle: '당신의 아이디어가 하나의 완전한 비즈니스 스토리로 완성되었습니다',
      sections: {
        problem: '해결하고자 하는 문제',
        customer: '타겟 고객',
        solution: '핵심 가치 제안',
        business: '수익 모델',
        advantage: '경쟁 우위'
      },
      connecting: '따라서',
      conclusion: '결론적으로',
      score: '완성도'
    },
    en: {
      title: '🚀 Complete Idea Story',
      subtitle: 'Your idea has been crafted into one complete business story',
      sections: {
        problem: 'Problem We Solve',
        customer: 'Target Customer',
        solution: 'Core Value Proposition',
        business: 'Revenue Model',
        advantage: 'Competitive Advantage'
      },
      connecting: 'Therefore',
      conclusion: 'In conclusion',
      score: 'Completion'
    }
  };

  const moduleIcons = {
    problem_definition: <Target className="w-5 h-5 text-red-600" />,
    target_customer: <Users className="w-5 h-5 text-blue-600" />,
    value_proposition: <Zap className="w-5 h-5 text-purple-600" />,
    revenue_model: <DollarSign className="w-5 h-5 text-green-600" />,
    competitive_advantage: <Shield className="w-5 h-5 text-indigo-600" />
  };

  const getStoryNarrative = () => {
    const problem = moduleData.problem_definition || '';
    const customer = moduleData.target_customer || '';
    const value = moduleData.value_proposition || '';
    const revenue = moduleData.revenue_model || '';
    const advantage = moduleData.competitive_advantage || '';

    return {
      problem,
      customer,
      value,
      revenue,
      advantage
    };
  };

  const story = getStoryNarrative();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-900">{text[currentLanguage].title}</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {text[currentLanguage].subtitle}
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            {text[currentLanguage].score}: {Math.round(completionScore * 10)}%
          </Badge>
        </div>
      </div>

      {/* Unified Story Flow */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-8 space-y-8">
          {/* Problem Section */}
          {story.problem && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {moduleIcons.problem_definition}
                <h3 className="text-xl font-semibold text-gray-900">
                  {text[currentLanguage].sections.problem}
                </h3>
              </div>
              <div className="bg-white rounded-lg p-6 border border-red-100">
                <p className="text-gray-800 leading-relaxed">{story.problem}</p>
              </div>
            </div>
          )}

          {/* Customer Section */}
          {story.customer && (
            <>
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {moduleIcons.target_customer}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {text[currentLanguage].sections.customer}
                  </h3>
                </div>
                <div className="bg-white rounded-lg p-6 border border-blue-100">
                  <p className="text-gray-800 leading-relaxed">{story.customer}</p>
                </div>
              </div>
            </>
          )}

          {/* Value Proposition */}
          {story.value && (
            <>
              <div className="flex justify-center">
                <div className="bg-purple-100 rounded-full px-4 py-2">
                  <span className="text-purple-700 font-medium">
                    {text[currentLanguage].connecting}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {moduleIcons.value_proposition}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {text[currentLanguage].sections.solution}
                  </h3>
                </div>
                <div className="bg-white rounded-lg p-6 border border-purple-100">
                  <p className="text-gray-800 leading-relaxed">{story.value}</p>
                </div>
              </div>
            </>
          )}

          {/* Revenue Model */}
          {story.revenue && (
            <>
              <Separator className="my-6" />
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {moduleIcons.revenue_model}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {text[currentLanguage].sections.business}
                  </h3>
                </div>
                <div className="bg-white rounded-lg p-6 border border-green-100">
                  <p className="text-gray-800 leading-relaxed">{story.revenue}</p>
                </div>
              </div>
            </>
          )}

          {/* Competitive Advantage */}
          {story.advantage && (
            <>
              <div className="flex justify-center">
                <div className="bg-indigo-100 rounded-full px-4 py-2">
                  <span className="text-indigo-700 font-medium">
                    {text[currentLanguage].conclusion}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {moduleIcons.competitive_advantage}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {text[currentLanguage].sections.advantage}
                  </h3>
                </div>
                <div className="bg-white rounded-lg p-6 border border-indigo-100">
                  <p className="text-gray-800 leading-relaxed">{story.advantage}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedIdeaDisplay;
