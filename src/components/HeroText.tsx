
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Flame } from 'lucide-react';

interface HeroTextProps {
  currentLanguage: 'ko' | 'en';
}

const HeroText: React.FC<HeroTextProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      badge: '🔥 지금 가장 핫한',
      title: '당신의 아이디어로\n새로운 기회를 잡으세요',
      subtitle: '단 30초만에 아이디어를 던지고\n실제 투자자들의 실시간 반응을 확인하세요',
      highlight: '오늘만 특별혜택',
      urgency: '놓치면 후회하는 기회입니다'
    },
    en: {
      badge: '🔥 Hottest Right Now',
      title: 'Seize New Opportunities\nWith Your Ideas',
      subtitle: 'Drop your idea in just 30 seconds\nand get real-time feedback from actual investors',
      highlight: 'Special Benefits Today Only',
      urgency: 'Don\'t miss this opportunity'
    }
  };

  return (
    <div className="mb-8">
      {/* Hot Badge - Korean FOMO Appeal */}
      <div className="flex justify-center mb-4">
        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 text-sm font-bold shadow-lg">
          <Flame className="w-4 h-4 mr-2 animate-pulse" />
          {text[currentLanguage].badge}
        </Badge>
      </div>

      {/* Main Title - Emotional Korean Appeal */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
        {text[currentLanguage].title.split('\n').map((line, index) => (
          <div key={index}>
            {line}
            {index === 0 && (
              <div className="inline-block ml-2">
                <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </h1>

      {/* Subtitle with Korean Speed Culture */}
      <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
        {text[currentLanguage].subtitle.split('\n').map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </p>

      {/* Special Benefits Banner - Korean Limited Time Appeal */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 mb-6 text-center shadow-lg">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Badge className="bg-red-500 text-white animate-bounce">
            ⚡ {text[currentLanguage].highlight}
          </Badge>
        </div>
        <p className="text-sm font-semibold text-gray-800">
          ✨ 첫 아이디어 제출 시 GPT 프리미엄 분석 무료 + VC 우선 노출 ✨
        </p>
        <p className="text-xs text-red-600 font-bold mt-1">
          {text[currentLanguage].urgency}
        </p>
      </div>
    </div>
  );
};

export default HeroText;
