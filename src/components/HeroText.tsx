
import React from 'react';

interface HeroTextProps {
  currentLanguage: 'ko' | 'en';
}

const HeroText: React.FC<HeroTextProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '아이디어를 던지세요, 기회를 잡으세요',
      subtitle: '단 몇 초 만에 아이디어를 던지고 실시간 피드백을 받으세요.'
    },
    en: {
      title: 'Drop Your Idea, Catch Opportunity',
      subtitle: 'Drop your idea in seconds and get real-time feedback.'
    }
  };

  return (
    <>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        {text[currentLanguage].title}
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8">
        {text[currentLanguage].subtitle}
      </p>
    </>
  );
};

export default HeroText;
