
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowRight, Star, Clock, Lightbulb } from 'lucide-react';

interface IdeaEvolutionVisualizerProps {
  currentLanguage: 'ko' | 'en';
}

interface EvolutionStage {
  id: string;
  title: string;
  description: string;
  score: number;
  timestamp: Date;
  improvements: string[];
  modules: string[];
}

const IdeaEvolutionVisualizer: React.FC<IdeaEvolutionVisualizerProps> = ({ currentLanguage }) => {
  const [selectedIdea, setSelectedIdea] = useState<string>('delivery-app');

  const text = {
    ko: {
      title: '아이디어 진화 과정',
      subtitle: '아이디어가 어떻게 발전했는지 시각적으로 확인해보세요',
      selectIdea: '아이디어 선택',
      evolutionStages: '진화 단계',
      improvements: '개선사항',
      modulesUsed: '사용된 모듈',
      scoreGrowth: '점수 성장',
      timeSpent: '소요 시간',
      version: '버전',
      examples: {
        'delivery-app': {
          title: '카페 배달 앱',
          stages: [
            {
              title: '초기 아이디어',
              description: '근처 카페 배달 서비스',
              score: 5.2,
              improvements: ['기본 아이디어 정리'],
              modules: ['기본 개념']
            },
            {
              title: '타겟 명확화',
              description: '직장인 대상 프리미엄 카페 배달',
              score: 6.8,
              improvements: ['타겟 고객 구체화', '프리미엄 포지셔닝'],
              modules: ['타겟 고객', '가치 제안']
            },
            {
              title: '차별화 요소 추가',
              description: '바리스타 추천 + 개인화 서비스',
              score: 8.1,
              improvements: ['개인화 기능', '전문가 추천 시스템'],
              modules: ['핵심 기능', '경쟁 우위']
            },
            {
              title: '비즈니스 모델 완성',
              description: '구독형 + 카페 파트너십 모델',
              score: 8.7,
              improvements: ['수익 모델 다각화', '파트너십 전략'],
              modules: ['수익 모델', '핵심 파트너']
            }
          ]
        }
      }
    },
    en: {
      title: 'Idea Evolution Visualizer',
      subtitle: 'Visualize how your ideas have evolved over time',
      selectIdea: 'Select Idea',
      evolutionStages: 'Evolution Stages',
      improvements: 'Improvements',
      modulesUsed: 'Modules Used',
      scoreGrowth: 'Score Growth',
      timeSpent: 'Time Spent',
      version: 'Version',
      examples: {
        'delivery-app': {
          title: 'Cafe Delivery App',
          stages: [
            {
              title: 'Initial Idea',
              description: 'Nearby cafe delivery service',
              score: 5.2,
              improvements: ['Basic idea organization'],
              modules: ['Basic Concept']
            },
            {
              title: 'Target Clarification',
              description: 'Premium cafe delivery for office workers',
              score: 6.8,
              improvements: ['Specific target customers', 'Premium positioning'],
              modules: ['Target Customer', 'Value Proposition']
            },
            {
              title: 'Differentiation Added',
              description: 'Barista recommendations + personalization',
              score: 8.1,
              improvements: ['Personalization features', 'Expert recommendation system'],
              modules: ['Core Features', 'Competitive Advantage']
            },
            {
              title: 'Business Model Complete',
              description: 'Subscription + cafe partnership model',
              score: 8.7,
              improvements: ['Diversified revenue model', 'Partnership strategy'],
              modules: ['Revenue Model', 'Key Partners']
            }
          ]
        }
      }
    }
  };

  const selectedExample = text[currentLanguage].examples[selectedIdea as keyof typeof text[typeof currentLanguage]['examples']];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 7) return 'bg-blue-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center mb-2">
          <TrendingUp className="w-8 h-8 mr-3 text-green-500" />
          {text[currentLanguage].title}
        </h2>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Evolution Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              {selectedExample.title}
            </span>
            <Badge variant="outline" className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              {text[currentLanguage].scoreGrowth}: +{(selectedExample.stages[selectedExample.stages.length - 1].score - selectedExample.stages[0].score).toFixed(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-300 via-yellow-300 via-blue-300 to-green-300"></div>
            
            {/* Evolution Stages */}
            <div className="space-y-8">
              {selectedExample.stages.map((stage, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Timeline Dot */}
                  <div className={`w-4 h-4 rounded-full border-4 border-white shadow-md ${getScoreBgColor(stage.score)} flex-shrink-0 relative z-10`}>
                    <div className={`w-full h-full rounded-full ${getScoreColor(stage.score).replace('text-', 'bg-')}`}></div>
                  </div>
                  
                  {/* Stage Content */}
                  <div className="ml-6 flex-1">
                    <Card className={`${getScoreBgColor(stage.score)} border-l-4 ${getScoreColor(stage.score).replace('text-', 'border-')}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg flex items-center">
                              {text[currentLanguage].version} {index + 1}: {stage.title}
                              {index < selectedExample.stages.length - 1 && (
                                <ArrowRight className="w-4 h-4 ml-2 text-gray-400" />
                              )}
                            </h4>
                            <p className="text-gray-600 mt-1">{stage.description}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(stage.score)}`}>
                              {stage.score}
                            </div>
                            <div className="text-xs text-gray-500">
                              {index > 0 && (
                                <span className="text-green-600">
                                  +{(stage.score - selectedExample.stages[index - 1].score).toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Improvements */}
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            {text[currentLanguage].improvements}:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {stage.improvements.map((improvement, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {improvement}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Modules */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            {text[currentLanguage].modulesUsed}:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {stage.modules.map((module, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {module}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {selectedExample.stages.length}
            </div>
            <div className="text-sm text-gray-500">{text[currentLanguage].evolutionStages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              +{(selectedExample.stages[selectedExample.stages.length - 1].score - selectedExample.stages[0].score).toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">{text[currentLanguage].scoreGrowth}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              2주
            </div>
            <div className="text-sm text-gray-500">{text[currentLanguage].timeSpent}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IdeaEvolutionVisualizer;
