
import React from 'react';
import { CheckCircle, Users, Star } from 'lucide-react';

interface MinimalTrustSectionProps {
  currentLanguage: 'ko' | 'en';
}

const MinimalTrustSection: React.FC<MinimalTrustSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      howItWorks: '어떻게 작동하나요?',
      step1: {
        title: '아이디어 제출',
        description: '30초만에 간단히 작성'
      },
      step2: {
        title: '전문가 분석',
        description: 'AI와 실제 투자자가 평가'
      },
      step3: {
        title: '피드백 수신',
        description: '24시간 내 결과 확인'
      },
      stats: {
        users: '12,000+ 사용자',
        ideas: '25,000+ 아이디어 분석',
        satisfaction: '98% 만족도'
      }
    },
    en: {
      howItWorks: 'How It Works',
      step1: {
        title: 'Submit Idea',
        description: 'Write it down in 30 seconds'
      },
      step2: {
        title: 'Expert Analysis',
        description: 'AI and real investors evaluate'
      },
      step3: {
        title: 'Get Feedback',
        description: 'Results within 24 hours'
      },
      stats: {
        users: '12,000+ users',
        ideas: '25,000+ ideas analyzed',
        satisfaction: '98% satisfaction'
      }
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {text[currentLanguage].howItWorks}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {text[currentLanguage].step1.title}
            </h3>
            <p className="text-gray-600">
              {text[currentLanguage].step1.description}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {text[currentLanguage].step2.title}
            </h3>
            <p className="text-gray-600">
              {text[currentLanguage].step2.description}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {text[currentLanguage].step3.title}
            </h3>
            <p className="text-gray-600">
              {text[currentLanguage].step3.description}
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-1">12,000+</div>
            <div className="text-gray-600">사용자</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 mb-1">25,000+</div>
            <div className="text-gray-600">분석 완료</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 mb-1">98%</div>
            <div className="text-gray-600">만족도</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalTrustSection;
