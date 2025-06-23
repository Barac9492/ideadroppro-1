
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, Lightbulb, GitBranch, Star, Users } from 'lucide-react';

interface RemixOnboardingGuideProps {
  currentLanguage: 'ko' | 'en';
  onClose: () => void;
}

const RemixOnboardingGuide: React.FC<RemixOnboardingGuideProps> = ({
  currentLanguage,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const text = {
    ko: {
      title: '🎨 리믹스 가이드',
      steps: [
        {
          title: '리믹스란 무엇인가요?',
          content: '다른 사람의 아이디어를 개선하거나 확장하여 더 나은 버전을 만드는 것입니다.',
          icon: Lightbulb
        },
        {
          title: '어떻게 리믹스하나요?',
          content: '원본 아이디어를 보고 "리믹스하기" 버튼을 클릭한 후, 개선된 버전을 작성하세요.',
          icon: GitBranch
        },
        {
          title: '무엇을 얻을 수 있나요?',
          content: '영향력 점수 +8점, 공동 소유권, VC 미팅 기회 등을 획득할 수 있습니다.',
          icon: Star
        },
        {
          title: '커뮤니티와 함께하세요',
          content: '리믹스 배틀에 참여하고, 다른 리믹서들과 경쟁해보세요!',
          icon: Users
        }
      ],
      nextStep: '다음',
      finish: '시작하기',
      skip: '건너뛰기'
    },
    en: {
      title: '🎨 Remix Guide',
      steps: [
        {
          title: 'What is a Remix?',
          content: 'Improve or expand someone else\'s idea to create a better version.',
          icon: Lightbulb
        },
        {
          title: 'How to Remix?',
          content: 'View an original idea, click "Remix" button, then write your improved version.',
          icon: GitBranch
        },
        {
          title: 'What do you get?',
          content: 'Earn +8 influence points, co-ownership rights, VC meeting opportunities, and more.',
          icon: Star
        },
        {
          title: 'Join the Community',
          content: 'Participate in remix battles and compete with other remixers!',
          icon: Users
        }
      ],
      nextStep: 'Next',
      finish: 'Get Started',
      skip: 'Skip'
    }
  };

  const steps = text[currentLanguage].steps;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {text[currentLanguage].title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentStep
                        ? 'bg-purple-600'
                        : index < currentStep
                        ? 'bg-purple-300'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Badge className="mb-4 bg-purple-100 text-purple-700">
              {currentStep + 1} / {steps.length}
            </Badge>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {React.createElement(steps[currentStep].icon, {
                  className: "w-8 h-8 text-purple-600"
                })}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {steps[currentStep].title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {steps[currentStep].content}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-600"
            >
              {text[currentLanguage].skip}
            </Button>
            
            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLastStep ? text[currentLanguage].finish : text[currentLanguage].nextStep}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RemixOnboardingGuide;
