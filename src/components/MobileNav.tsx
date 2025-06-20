
import React from 'react';
import { Menu, X, Trophy, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
}

interface MobileNavProps {
  currentLanguage: 'ko' | 'en';
  user: User | null;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onLanguageToggle: () => void;
  onAboutClick: () => void;
  onGuideClick: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onAdminClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  currentLanguage,
  user,
  isMenuOpen,
  onMenuToggle,
  onLanguageToggle,
  onAboutClick,
  onGuideClick,
  onSignIn,
  onSignOut,
  onAdminClick
}) => {
  const navigate = useNavigate();
  
  const text = {
    ko: {
      menu: '메뉴',
      about: '서비스 소개',
      guide: '사용법',
      signIn: '로그인',
      signOut: '로그아웃',
      admin: '관리자',
      ranking: '랭킹',
      dashboard: '대시보드',
    },
    en: {
      menu: 'Menu',
      about: 'About',
      guide: 'Guide',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      admin: 'Admin',
      ranking: 'Rankings',
      dashboard: 'Dashboard',
    }
  };

  const handleRankingClick = () => {
    navigate('/ranking');
    onMenuToggle();
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    onMenuToggle();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          aria-label={text[currentLanguage].menu}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 text-slate-700" />
          ) : (
            <Menu className="h-5 w-5 text-slate-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleRankingClick}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-slate-700 text-left flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>{text[currentLanguage].ranking}</span>
            </button>

            {user && (
              <button
                onClick={handleDashboardClick}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-slate-700 text-left flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>{text[currentLanguage].dashboard}</span>
              </button>
            )}
            
            <button
              onClick={onAboutClick}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-slate-700 text-left"
            >
              {text[currentLanguage].about}
            </button>
            
            <button
              onClick={onGuideClick}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-slate-700 text-left"
            >
              {text[currentLanguage].guide}
            </button>

            <button
              onClick={onLanguageToggle}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-slate-700 text-left"
            >
              {currentLanguage === 'ko' ? 'English' : '한국어'}
            </button>
            
            {user ? (
              <>
                <Button
                  onClick={onAdminClick}
                  variant="outline"
                  className="justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  {text[currentLanguage].admin}
                </Button>
                <Button
                  onClick={onSignOut}
                  variant="outline"
                  className="justify-start border-red-200 text-red-700 hover:bg-red-50"
                >
                  {text[currentLanguage].signOut}
                </Button>
              </>
            ) : (
              <Button
                onClick={onSignIn}
                className="justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              >
                {text[currentLanguage].signIn}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
