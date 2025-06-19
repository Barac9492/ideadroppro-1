
import React from 'react';
import { Globe, Lightbulb } from 'lucide-react';

interface HeaderProps {
  currentLanguage: 'ko' | 'en';
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageToggle }) => {
  const text = {
    ko: {
      title: 'IdeaDrop Pro',
      subtitle: '혁신적인 아이디어를 공유하고 AI 피드백을 받아보세요'
    },
    en: {
      title: 'IdeaDrop Pro',
      subtitle: 'Share innovative ideas and get instant AI feedback'
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Lightbulb className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{text[currentLanguage].title}</h1>
              <p className="text-purple-100 text-sm md:text-base">{text[currentLanguage].subtitle}</p>
            </div>
          </div>
          
          <button
            onClick={onLanguageToggle}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <Globe className="h-4 w-4" />
            <span className="font-medium">{currentLanguage === 'ko' ? '한국어' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
