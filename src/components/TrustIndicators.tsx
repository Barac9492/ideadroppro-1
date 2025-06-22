
import React from 'react';
import { Sparkles } from 'lucide-react';

interface TrustIndicatorsProps {
  currentLanguage: 'ko' | 'en';
}

const TrustIndicators: React.FC<TrustIndicatorsProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      trustIndicators: '수천 명의 혁신가들이 이미 아이디어를 던졌습니다.'
    },
    en: {
      trustIndicators: 'Thousands of innovators have already dropped their ideas.'
    }
  };

  return (
    <p className="text-sm text-gray-500 mb-4">
      <Sparkles className="inline-block w-4 h-4 mr-1" />
      {text[currentLanguage].trustIndicators}
    </p>
  );
};

export default TrustIndicators;
