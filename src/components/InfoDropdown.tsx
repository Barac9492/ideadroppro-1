
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface InfoDropdownProps {
  currentLanguage: 'ko' | 'en';
  isOpen: boolean;
  onToggle: () => void;
  onBlur: () => void;
  onAboutClick: () => void;
  onGuideClick: () => void;
}

const InfoDropdown: React.FC<InfoDropdownProps> = ({
  currentLanguage,
  isOpen,
  onToggle,
  onBlur,
  onAboutClick,
  onGuideClick
}) => {
  const text = {
    ko: {
      info: '정보',
      about: '서비스 소개',
      guide: '사용법',
    },
    en: {
      info: 'Info',
      about: 'About',
      guide: 'Guide',
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        onBlur={onBlur}
        className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-slate-700 flex items-center space-x-1"
      >
        <span>{text[currentLanguage].info}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
          <button
            onClick={onAboutClick}
            className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {text[currentLanguage].about}
          </button>
          <button
            onClick={onGuideClick}
            className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {text[currentLanguage].guide}
          </button>
        </div>
      )}
    </div>
  );
};

export default InfoDropdown;
