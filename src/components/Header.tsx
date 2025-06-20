
import React from 'react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import HeaderLogo from './HeaderLogo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

interface HeaderProps {
  currentLanguage: 'ko' | 'en';
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleInfoDropdownToggle = () => {
    setIsInfoDropdownOpen(!isInfoDropdownOpen);
  };

  const handleInfoDropdownBlur = () => {
    setTimeout(() => setIsInfoDropdownOpen(false), 200);
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-purple-500 to-blue-500">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <HeaderLogo 
            currentLanguage={currentLanguage}
            onHomeClick={handleHomeClick}
          />

          <DesktopNav
            currentLanguage={currentLanguage}
            user={user}
            isInfoDropdownOpen={isInfoDropdownOpen}
            onLanguageToggle={onLanguageToggle}
            onInfoDropdownToggle={handleInfoDropdownToggle}
            onInfoDropdownBlur={handleInfoDropdownBlur}
            onAboutClick={handleAboutClick}
            onGuideClick={handleGuideClick}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            onAdminClick={handleAdminClick}
          />

          <MobileNav
            currentLanguage={currentLanguage}
            user={user}
            isMenuOpen={isMenuOpen}
            onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
            onLanguageToggle={onLanguageToggle}
            onAboutClick={handleAboutClick}
            onGuideClick={handleGuideClick}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            onAdminClick={handleAdminClick}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
