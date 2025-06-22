
import React from 'react';

interface SimpleHeroTextProps {
  currentLanguage: 'ko' | 'en';
}

const SimpleHeroText: React.FC<SimpleHeroTextProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '아이디어를 던지세요, 기회를 잡으세요'
    },
    en: {
      title: 'Drop Your Idea, Seize Opportunities'
    }
  };

  return (
    <div className="text-center mb-16">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
        {text[currentLanguage].title}
      </h1>
    </div>
  );
};

export default SimpleHeroText;
