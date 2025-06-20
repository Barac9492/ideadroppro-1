
import React from 'react';
import { Globe } from 'lucide-react';

interface HeaderLogoProps {
  currentLanguage: 'ko' | 'en';
  onHomeClick: () => void;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ currentLanguage, onHomeClick }) => {
  const text = {
    ko: {
      title: 'AI 아이디어 평가',
      subtitle: '🌍 글로벌 시장 분석으로 아이디어를 검증하세요',
    },
    en: {
      title: 'AI Idea Evaluator',
      subtitle: '🌍 Validate your ideas with Global Market Analysis',
    }
  };

  return (
    <div 
      className="flex items-center space-x-3 cursor-pointer"
      onClick={onHomeClick}
    >
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 md:p-3 rounded-2xl shadow-lg">
        <Globe className="h-6 w-6 md:h-8 md:w-8 text-white" />
      </div>
      <div>
        <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {text[currentLanguage].title}
        </h1>
        <p className="text-sm md:text-base text-slate-600 font-medium">
          {text[currentLanguage].subtitle}
        </p>
      </div>
    </div>
  );
};

export default HeaderLogo;
