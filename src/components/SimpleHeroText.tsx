
import React from 'react';

interface SimpleHeroTextProps {
  currentLanguage: 'ko' | 'en';
}

const SimpleHeroText: React.FC<SimpleHeroTextProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: '30초만에 아이디어를\n투자자에게 전달하세요',
      subtitle: '실제 투자자들이 당신의 아이디어를 평가하고 피드백을 제공합니다',
      userCount: '12,000+ 창업자들이 사용 중'
    },
    en: {
      title: 'Share Your Idea\nWith Investors in 30 Seconds',
      subtitle: 'Real investors evaluate your ideas and provide valuable feedback',
      userCount: '12,000+ founders using our platform'
    }
  };

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        {text[currentLanguage].title.split('\n').map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
        {text[currentLanguage].subtitle}
      </p>
      
      <p className="text-sm text-gray-500 font-medium">
        {text[currentLanguage].userCount}
      </p>
    </div>
  );
};

export default SimpleHeroText;
