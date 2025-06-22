
import React from 'react';

interface SimpleHeroTextProps {
  currentLanguage: 'ko' | 'en';
}

const SimpleHeroText: React.FC<SimpleHeroTextProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '아이디어 제출'
    },
    en: {
      title: 'Submit Ideas'
    }
  };

  return (
    <div className="text-center mb-16">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
        {text[currentLanguage].title}
      </h1>
    </div>
  );
};

export default SimpleHeroText;
