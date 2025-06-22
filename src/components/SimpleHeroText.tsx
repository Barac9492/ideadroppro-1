
import React from 'react';

interface SimpleHeroTextProps {
  currentLanguage: 'ko' | 'en';
}

const SimpleHeroText: React.FC<SimpleHeroTextProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '아이디어를 던지세요, 기회를 잡으세요',
      subtitle: '30초만에 아이디어를 제출하고 투자자들의 실시간 피드백을 받아보세요'
    },
    en: {
      title: 'Drop Your Idea, Seize Opportunities',
      subtitle: 'Submit your idea in 30 seconds and get real-time feedback from investors'
    }
  };

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
        {text[currentLanguage].title}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
        {text[currentLanguage].subtitle}
      </p>
    </div>
  );
};

export default SimpleHeroText;
