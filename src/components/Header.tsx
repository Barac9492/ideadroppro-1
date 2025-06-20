import React from 'react';
import { Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentLanguage: 'ko' | 'en';
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const text = {
    ko: {
      title: 'AI 아이디어 평가',
      subtitle: '🌍 글로벌 시장 분석으로 아이디어를 검증하세요',
      signIn: '로그인',
      signOut: '로그아웃',
      admin: '관리자',
      menu: '메뉴',
      about: '서비스 소개',
      guide: '사용법',
      info: '정보'
    },
    en: {
      title: 'AI Idea Evaluator',
      subtitle: '🌍 Validate your ideas with Global Market Analysis',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      admin: 'Admin',
      menu: 'Menu',
      about: 'About',
      guide: 'Guide',
      info: 'Info'
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const handleSignIn = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setIsMenuOpen(false);
  };

  const handleAboutClick = () => {
    navigate('/about');
    setIsMenuOpen(false);
    setIsInfoDropdownOpen(false);
  };

  const handleGuideClick = () => {
    navigate('/guide');
    setIsMenuOpen(false);
    setIsInfoDropdownOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMenuOpen(false);
    setIsInfoDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-purple-500 to-blue-500">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleHomeClick}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Info Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                onBlur={() => setTimeout(() => setIsInfoDropdownOpen(false), 200)}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-slate-700 flex items-center space-x-1"
              >
                <span>{text[currentLanguage].info}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {isInfoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
                  <button
                    onClick={handleAboutClick}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {text[currentLanguage].about}
                  </button>
                  <button
                    onClick={handleGuideClick}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {text[currentLanguage].guide}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onLanguageToggle}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-slate-700"
            >
              {currentLanguage === 'ko' ? 'EN' : '한국어'}
            </button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleAdminClick}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  {text[currentLanguage].admin}
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  {text[currentLanguage].signOut}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleSignIn}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              >
                {text[currentLanguage].signIn}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleAboutClick}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-slate-700 text-left"
              >
                {text[currentLanguage].about}
              </button>
              
              <button
                onClick={handleGuideClick}
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
                    onClick={handleAdminClick}
                    variant="outline"
                    className="justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    {text[currentLanguage].admin}
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="justify-start border-red-200 text-red-700 hover:bg-red-50"
                  >
                    {text[currentLanguage].signOut}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSignIn}
                  className="justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                >
                  {text[currentLanguage].signIn}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
