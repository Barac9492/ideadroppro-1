
import React from 'react';
import { Button } from '@/components/ui/button';
import InfoDropdown from './InfoDropdown';
import { Trophy, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
}

interface DesktopNavProps {
  currentLanguage: 'ko' | 'en';
  user: User | null;
  isInfoDropdownOpen: boolean;
  onLanguageToggle: () => void;
  onInfoDropdownToggle: () => void;
  onInfoDropdownBlur: () => void;
  onAboutClick: () => void;
  onGuideClick: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onAdminClick: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
  currentLanguage,
  user,
  isInfoDropdownOpen,
  onLanguageToggle,
  onInfoDropdownToggle,
  onInfoDropdownBlur,
  onAboutClick,
  onGuideClick,
  onSignIn,
  onSignOut,
  onAdminClick
}) => {
  const navigate = useNavigate();
  
  const text = {
    ko: {
      signIn: '로그인',
      signOut: '로그아웃',
      admin: '관리자',
      ranking: '랭킹',
      dashboard: '대시보드',
    },
    en: {
      signIn: 'Sign In',
      signOut: 'Sign Out',
      admin: 'Admin',
      ranking: 'Rankings',
      dashboard: 'Dashboard',
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Button
        variant="ghost"
        onClick={() => navigate('/ranking')}
        className="flex items-center space-x-2 text-slate-700 hover:text-purple-600 hover:bg-purple-50"
      >
        <Trophy className="h-4 w-4" />
        <span>{text[currentLanguage].ranking}</span>
      </Button>

      {user && (
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-slate-700 hover:text-purple-600 hover:bg-purple-50"
        >
          <BarChart3 className="h-4 w-4" />
          <span>{text[currentLanguage].dashboard}</span>
        </Button>
      )}

      <InfoDropdown
        currentLanguage={currentLanguage}
        isOpen={isInfoDropdownOpen}
        onToggle={onInfoDropdownToggle}
        onBlur={onInfoDropdownBlur}
        onAboutClick={onAboutClick}
        onGuideClick={onGuideClick}
      />

      <button
        onClick={onLanguageToggle}
        className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-slate-700"
      >
        {currentLanguage === 'ko' ? 'EN' : '한국어'}
      </button>
      
      {user ? (
        <div className="flex items-center space-x-3">
          <Button
            onClick={onAdminClick}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            {text[currentLanguage].admin}
          </Button>
          <Button
            onClick={onSignOut}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            {text[currentLanguage].signOut}
          </Button>
        </div>
      ) : (
        <Button
          onClick={onSignIn}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
        >
          {text[currentLanguage].signIn}
        </Button>
      )}
    </div>
  );
};

export default DesktopNav;
