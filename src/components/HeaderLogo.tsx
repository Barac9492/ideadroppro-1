
import React from 'react';

interface HeaderLogoProps {
  currentLanguage: 'ko' | 'en';
  onHomeClick: () => void;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ currentLanguage, onHomeClick }) => {
  return (
    <div 
      className="flex items-center space-x-3 cursor-pointer group"
      onClick={onHomeClick}
    >
      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
        <span className="text-white font-bold text-lg">I</span>
      </div>
      <div>
        <h1 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-200">
          IdeaDrop Pro
        </h1>
      </div>
    </div>
  );
};

export default HeaderLogo;
