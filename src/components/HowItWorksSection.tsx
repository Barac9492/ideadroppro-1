
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Zap, TrendingUp, Handshake, Repeat } from 'lucide-react';

interface HowItWorksSectionProps {
  currentLanguage: 'ko' | 'en';
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '왜 지금 \'드랍\'이 필요한가?',
      subtitle: '아이디어에서 투자 연결까지, 5단계 프로세스',
      steps: [
        {
          icon: Lightbulb,
          title: '아이디어 드랍',
          description: '아무 주제, 150자 이상, 키워드 자동 추출',
          detail: '제한 없는 자유로운 아이디어 입력'
        },
        {
          icon: Zap,
          title: 'AI 분석 및 점수화',
          description: 'GPT가 시장성 / 참신성 / 실행력 평가',
          detail: '10점 만점 실시간 분석'
        },
        {
          icon: TrendingUp,
          title: '실시간 랭킹 진입',
          description: '영향력 랭킹 및 VC 전용 보드에 노출',
          detail: 'Top 10 진입 시 특별 혜택'
        },
        {
          icon: Handshake,
          title: '실제 투자자 매칭',
          description: 'VC가 \'1:1 상담 신청\' 가능',
          detail: '23명의 인증된 VC 참여'
        },
        {
          icon: Repeat,
          title: '커뮤니티 리믹스',
          description: '리믹스/피드백으로 진화하는 아이디어',
          detail: '네트워크 효과로 아이디어 확장'
        }
      ]
    },
    en: {
      title: 'Why Do You Need to \'Drop\' Now?',
      subtitle: 'From idea to investment connection, 5-step process',
      steps: [
        {
          icon: Lightbulb,
          title: 'Idea Drop',
          description: 'Any topic, 150+ characters, auto keyword extraction',
          detail: 'Unlimited free idea input'
        },
        {
          icon: Zap,
          title: 'AI Analysis & Scoring',
          description: 'GPT evaluates market potential / originality / feasibility',
          detail: 'Real-time analysis out of 10 points'
        },
        {
          icon: TrendingUp,
          title: 'Real-time Ranking',
          description: 'Influence ranking and VC board exposure',
          detail: 'Special benefits for Top 10 entry'
        },
        {
          icon: Handshake,
          title: 'Real Investor Matching',
          description: 'VCs can request \'1:1 consultation\'',
          detail: '23 verified VCs participating'
        },
        {
          icon: Repeat,
          title: 'Community Remix',
          description: 'Ideas evolve through remix/feedback',
          detail: 'Expand ideas through network effects'
        }
      ]
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🎬 {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {text[currentLanguage].steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={index}
                className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-6">
                  <Badge className="bg-purple-600 text-white px-3 py-1 text-lg font-bold">
                    {index + 1}
                  </Badge>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 mt-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <p className="text-xs text-purple-700 font-medium">
                      {step.detail}
                    </p>
                  </div>
                </div>

                {/* Arrow for next step */}
                {index < text[currentLanguage].steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="text-2xl mb-2">🚀</div>
            <h4 className="font-semibold text-gray-900 mb-2">진입 허들 = 0</h4>
            <p className="text-sm text-gray-600">매일 하나는 써보고 싶은 가벼운 동기</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-gray-900 mb-2">즉시 보상 루프</h4>
            <p className="text-sm text-gray-600">입력 → 점수 → 반응의 빠른 피드백</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-2">실제 투자 연결</h4>
            <p className="text-sm text-gray-600">게임이 아닌 진짜 비즈니스 기회</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
