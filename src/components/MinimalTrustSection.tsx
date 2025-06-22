
import React from 'react';

interface MinimalTrustSectionProps {
  currentLanguage: 'ko' | 'en';
}

const MinimalTrustSection: React.FC<MinimalTrustSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      trustLine: '벌써 12,000명이 시작했습니다'
    },
    en: {
      trustLine: '12,000 people have already started'
    }
  };

  return (
    <div className="text-center py-16">
      <p className="text-lg text-gray-500">
        {text[currentLanguage].trustLine}
      </p>
    </div>
  );
};

export default MinimalTrustSection;
