
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, Target, Users, DollarSign, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

interface AIElaborationResultsProps {
  originalIdea: string;
  analysisResult: any;
  currentLanguage: 'ko' | 'en';
  onContinueToBuilder: () => void;
  onSubmitAsIs: () => void;
  isVisible: boolean;
}

const AIElaborationResults: React.FC<AIElaborationResultsProps> = ({
  originalIdea,
  analysisResult,
  currentLanguage,
  onContinueToBuilder,
  onSubmitAsIs,
  isVisible
}) => {
  const [showResults, setShowResults] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const text = {
    ko: {
      title: 'AI가 당신의 아이디어를 구체화했습니다!',
      subtitle: '핵심 요소들을 분석하여 체계적으로 정리했습니다',
      originalIdea: '원본 아이디어',
      analysisComplete: '분석 완료',
      keyElements: '핵심 요소 분석',
      score: '아이디어 점수',
      continueBuilder: '더 자세히 보완하기',
      submitNow: '이대로 제출하기',
      elements: {
        problem: '해결하는 문제',
        solution: '제안 솔루션',
        target: '타겟 고객',
        value: '핵심 가치'
      }
    },
    en: {
      title: 'AI has elaborated your idea!',
      subtitle: 'Key elements analyzed and systematically organized',
      originalIdea: 'Original Idea',
      analysisComplete: 'Analysis Complete',
      keyElements: 'Key Elements Analysis',
      score: 'Idea Score',
      continueBuilder: 'Enhance Further',
      submitNow: 'Submit Now',
      elements: {
        problem: 'Problem Solved',
        solution: 'Proposed Solution',
        target: 'Target Customer',
        value: 'Core Value'
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      // Sequential animation
      setTimeout(() => setShowResults(true), 500);
      setTimeout(() => setAnimationStep(1), 1000);
      setTimeout(() => setAnimationStep(2), 1500);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const mockAnalysis = {
    problem: analysisResult?.analysis || (currentLanguage === 'ko' ? '사용자의 일상적인 불편함을 해결' : 'Solving everyday user inconveniences'),
    solution: currentLanguage === 'ko' ? '혁신적이고 실용적인 접근 방식' : 'Innovative and practical approach',
    target: currentLanguage === 'ko' ? '디지털 네이티브 세대' : 'Digital native generation',
    value: currentLanguage === 'ko' ? '시간 절약과 편의성 증대' : 'Time saving and convenience enhancement'
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          
          {/* Header with animation */}
          <div className={`text-center transition-all duration-1000 ${showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-purple-600 animate-pulse" />
                <div className="absolute -top-1 -right-1">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {text[currentLanguage].title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {text[currentLanguage].subtitle}
            </p>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              {text[currentLanguage].analysisComplete}
            </Badge>
          </div>

          {/* Progress indicator */}
          <div className={`transition-all duration-1000 delay-300 ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">분석 진행률</span>
                  <span className="text-sm font-bold text-purple-600">100%</span>
                </div>
                <Progress value={100} className="h-3" />
              </CardContent>
            </Card>
          </div>

          {/* Original idea display */}
          <div className={`transition-all duration-1000 delay-500 ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <span>{text[currentLanguage].originalIdea}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-gray-800 leading-relaxed">
                  "{originalIdea}"
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Results */}
          <div className={`transition-all duration-1000 delay-700 ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span>{text[currentLanguage].keyElements}</span>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {text[currentLanguage].score}: {analysisResult?.score || '7.2'}점
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-red-600" />
                      <h4 className="font-semibold text-red-800">{text[currentLanguage].elements.problem}</h4>
                    </div>
                    <p className="text-sm text-red-700">{mockAnalysis.problem}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold text-green-800">{text[currentLanguage].elements.solution}</h4>
                    </div>
                    <p className="text-sm text-green-700">{mockAnalysis.solution}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">{text[currentLanguage].elements.target}</h4>
                    </div>
                    <p className="text-sm text-blue-700">{mockAnalysis.target}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-800">{text[currentLanguage].elements.value}</h4>
                    </div>
                    <p className="text-sm text-yellow-700">{mockAnalysis.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action buttons */}
          <div className={`flex flex-col md:flex-row gap-4 justify-center transition-all duration-1000 delay-1000 ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button
              onClick={onContinueToBuilder}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {text[currentLanguage].continueBuilder}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              onClick={onSubmitAsIs}
              variant="outline"
              className="border-2 border-gray-300 hover:border-purple-300 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200"
            >
              {text[currentLanguage].submitNow}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIElaborationResults;
