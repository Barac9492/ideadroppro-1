
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Target, 
  Users, 
  DollarSign,
  Zap,
  Play
} from 'lucide-react';

interface BuilderOnboardingProps {
  currentLanguage: 'ko' | 'en';
  onComplete: () => void;
}

const BuilderOnboarding: React.FC<BuilderOnboardingProps> = ({
  currentLanguage,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const text = {
    ko: {
      title: '🚀 아이디어 빌더 가이드',
      subtitle: '모듈화된 아이디어 작성법을 배워보세요',
      steps: [
        {
          title: '모듈화 아이디어란?',
          content: '아이디어를 12개의 핵심 요소로 나누어 체계적으로 구성하는 방법입니다.',
          icon: Lightbulb,
          examples: [
            '문제점: 기존 솔루션의 한계',
            '솔루션: 혁신적인 해결책',
            '타겟 고객: 구체적인 사용자층'
          ]
        },
        {
          title: '좋은 모듈 작성법',
          content: '각 모듈은 구체적이고 측정 가능하며 실행 가능해야 합니다.',
          icon: Target,
          examples: [
            '❌ "좋은 앱 만들기"',
            '✅ "20-30대 직장인을 위한 5분 명상 앱"',
            '✅ "월 구독료 9,900원 프리미엄 모델"'
          ]
        },
        {
          title: 'AI 자동 분해 활용',
          content: '자유롭게 작성한 아이디어를 AI가 자동으로 12개 모듈로 분해해드립니다.',
          icon: Zap,
          examples: [
            '1. 아이디어를 자유롭게 입력',
            '2. AI가 자동으로 모듈 분석',
            '3. 각 모듈을 수정하고 개선'
          ]
        },
        {
          title: '시작해보세요!',
          content: '이제 첫 번째 모듈화 아이디어를 만들어보세요.',
          icon: Play,
          examples: [
            '💡 자유 입력 → AI 분해',
            '🔧 모듈 브라우저에서 선택',
            '📊 완성된 아이디어 분석'
          ]
        }
      ],
      navigation: {
        next: '다음',
        previous: '이전',
        start: '시작하기',
        skip: '건너뛰기'
      }
    },
    en: {
      title: '🚀 Idea Builder Guide',
      subtitle: 'Learn how to create modular ideas',
      steps: [
        {
          title: 'What are Modular Ideas?',
          content: 'A method to systematically organize ideas into 12 core business elements.',
          icon: Lightbulb,
          examples: [
            'Problem: Current solution limitations',
            'Solution: Innovative approach',
            'Target Customer: Specific user segment'
          ]
        },
        {
          title: 'Writing Good Modules',
          content: 'Each module should be specific, measurable, and actionable.',
          icon: Target,
          examples: [
            '❌ "Make good app"',
            '✅ "5-minute meditation app for office workers in 20s-30s"',
            '✅ "Premium subscription model at $9.99/month"'
          ]
        },
        {
          title: 'AI Auto-Decomposition',
          content: 'AI automatically breaks down your free-form ideas into 12 structured modules.',
          icon: Zap,
          examples: [
            '1. Input your idea freely',
            '2. AI analyzes and decomposes',
            '3. Edit and improve each module'
          ]
        },
        {
          title: 'Get Started!',
          content: 'Now create your first modular idea.',
          icon: Play,
          examples: [
            '💡 Free input → AI decomposition',
            '🔧 Select from module browser',
            '📊 Analyze completed idea'
          ]
        }
      ],
      navigation: {
        next: 'Next',
        previous: 'Previous',
        start: 'Get Started',
        skip: 'Skip'
      }
    }
  };

  const currentStepData = text[currentLanguage].steps[currentStep];
  const isLastStep = currentStep === text[currentLanguage].steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <Dialog open={true} onOpenChange={() => onComplete()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {text[currentLanguage].title}
          </DialogTitle>
          <p className="text-center text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center space-x-2">
            {text[currentLanguage].steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Current Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <currentStepData.icon className="w-6 h-6 text-purple-600" />
                </div>
                <span>{currentStepData.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {currentStepData.content}
              </p>
              
              <div className="space-y-2">
                {currentStepData.examples.map((example, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {example.includes('❌') || example.includes('✅') ? (
                      <Badge 
                        variant={example.includes('✅') ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {example}
                      </Badge>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                        <span className="text-sm text-gray-600">{example}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {text[currentLanguage].navigation.previous}
            </Button>

            <div className="flex space-x-2">
              <Button variant="ghost" onClick={onComplete}>
                {text[currentLanguage].navigation.skip}
              </Button>
              <Button onClick={handleNext}>
                {isLastStep ? text[currentLanguage].navigation.start : text[currentLanguage].navigation.next}
                {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
                {isLastStep && <Play className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuilderOnboarding;
