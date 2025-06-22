
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Handshake, ArrowRight, Lightbulb } from 'lucide-react';

interface EnhancedRemixExplanationProps {
  currentLanguage: 'ko' | 'en';
  onStartRemix?: () => void;
}

const EnhancedRemixExplanation: React.FC<EnhancedRemixExplanationProps> = ({
  currentLanguage,
  onStartRemix
}) => {
  const text = {
    ko: {
      title: '아이디어 공동 개발',
      subtitle: '다른 관점으로 아이디어를 더 강력하게 만드세요',
      benefits: {
        title: '공동 개발의 장점',
        items: [
          '다른 업계 전문가의 시각 추가',
          '기술적 실현 방안 보완',
          '시장 접근 전략 다양화',
          'VC 미팅 기회 공유'
        ]
      },
      examples: {
        title: '실제 성공 사례',
        case1: {
          before: '카페 배달 앱',
          after: '+ 농장 직접 연결 시스템',
          result: '7.2점 → 8.9점 (VC 검토 진입)'
        },
        case2: {
          before: '온라인 과외 플랫폼',
          after: '+ AI 학습 분석 기능',
          result: '6.8점 → 8.5점 (VC 검토 진입)'
        }
      },
      howItWorks: {
        title: '어떻게 작동하나요?',
        steps: [
          '관심있는 아이디어 선택',
          '개선안이나 확장 아이디어 제안',
          '원작자와 공동 소유권 획득',
          'VC 미팅 시 함께 참여'
        ]
      },
      startButton: '공동 개발 시작하기'
    },
    en: {
      title: 'Collaborative Idea Development',
      subtitle: 'Make ideas stronger with different perspectives',
      benefits: {
        title: 'Benefits of Collaboration',
        items: [
          'Add industry expert perspectives',
          'Complement technical implementation',
          'Diversify market approach strategies',
          'Share VC meeting opportunities'
        ]
      },
      examples: {
        title: 'Real Success Stories',
        case1: {
          before: 'Cafe delivery app',
          after: '+ Direct farm connection system',
          result: '7.2 → 8.9 points (VC Review Entry)'
        },
        case2: {
          before: 'Online tutoring platform',
          after: '+ AI learning analytics',
          result: '6.8 → 8.5 points (VC Review Entry)'
        }
      },
      howItWorks: {
        title: 'How It Works',
        steps: [
          'Select interesting idea',
          'Propose improvements or extensions',
          'Gain co-ownership with original author',
          'Join VC meetings together'
        ]
      },
      startButton: 'Start Collaboration'
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {text[currentLanguage].title}
          </h2>
          <p className="text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Benefits */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
              {text[currentLanguage].benefits.title}
            </h3>
            <ul className="space-y-2">
              {text[currentLanguage].benefits.items.map((item, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Handshake className="w-4 h-4 mr-2 text-blue-600" />
              {text[currentLanguage].howItWorks.title}
            </h3>
            <div className="space-y-3">
              {text[currentLanguage].howItWorks.steps.map((step, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Badge className="bg-blue-100 text-blue-700 mr-3 w-6 h-6 rounded-full flex items-center justify-center p-0">
                    {index + 1}
                  </Badge>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Examples */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
            {text[currentLanguage].examples.title}
          </h3>
          <div className="space-y-3">
            {[text[currentLanguage].examples.case1, text[currentLanguage].examples.case2].map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">원본</div>
                      <div className="bg-gray-100 rounded px-3 py-1 text-sm text-gray-700">
                        {example.before}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">개선</div>
                      <div className="bg-purple-100 rounded px-3 py-1 text-sm text-purple-700 font-medium">
                        {example.after}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {example.result}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={onStartRemix}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3"
          >
            <Users className="w-4 h-4 mr-2" />
            {text[currentLanguage].startButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedRemixExplanation;
