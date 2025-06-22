import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, LogOut, Share2, Bell, Settings, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import InfluenceScoreDisplay from './InfluenceScoreDisplay';
import { useNavigate } from 'react-router-dom';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useUserRole } from '@/hooks/useUserRole';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  currentLanguage: 'ko' | 'en';
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hasParticipated } = useDailyChallenge(currentLanguage);
  const { isAdmin, loading: roleLoading } = useUserRole();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const text = {
    ko: {
      title: 'IdeaDrop Pro',
      login: '로그인',
      logout: '로그아웃',
      invite: '친구 초대',
      mission: '오늘 미션',
      admin: '관리자',
      menu: '메뉴'
    },
    en: {
      title: 'IdeaDrop Pro',
      login: 'Login',
      logout: 'Logout',
      invite: 'Invite Friends',
      mission: 'Daily Mission',
      admin: 'Admin',
      menu: 'Menu'
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setMobileMenuOpen(false);
      toast({
        title: currentLanguage === 'ko' ? '로그아웃 완료' : 'Logged out',
        duration: 2000,
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: currentLanguage === 'ko' ? '로그아웃 오류' : 'Logout error',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const handleLogin = () => {
    navigate('/auth');
    setMobileMenuOpen(false);
  };

  const handleInvite = () => {
    navigate('/dashboard');
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setMobileMenuOpen(false);
  };

  const handleMissionClick = () => {
    navigate('/submit');
    setMobileMenuOpen(false);
  };

  if (isMobile) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                💡 {text[currentLanguage].title}
              </h1>
              <Badge variant="outline" className="text-xs">
                Beta
              </Badge>
            </div>

            {/* Mobile Menu Button and Essential Items */}
            <div className="flex items-center space-x-2">
              {/* Mission Alert - High Priority on Mobile */}
              {user && !hasParticipated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMissionClick}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 animate-pulse px-2 py-1 text-xs min-h-[44px]"
                >
                  <Bell className="w-4 h-4" />
                </Button>
              )}

              {/* Influence Score - Essential for Logged Users */}
              {user && (
                <div className="hidden xs:block">
                  <InfluenceScoreDisplay variant="compact" />
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 min-h-[44px] min-w-[44px]"
                aria-label={text[currentLanguage].menu}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3 pt-4">
                {/* Show Influence Score for xs screens */}
                {user && (
                  <div className="xs:hidden">
                    <InfluenceScoreDisplay variant="compact" />
                  </div>
                )}

                {/* Language Toggle */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    onLanguageToggle();
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start min-h-[44px]"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {currentLanguage === 'ko' ? 'English' : '한국어'}
                </Button>

                {user ? (
                  <>
                    {/* Admin Button */}
                    {!roleLoading && isAdmin && (
                      <Button
                        variant="outline"
                        onClick={handleAdminClick}
                        className="justify-start bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 text-orange-700 hover:from-orange-100 hover:to-red-100 min-h-[44px]"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {text[currentLanguage].admin}
                      </Button>
                    )}
                    
                    {/* Invite Button */}
                    <Button
                      variant="outline"
                      onClick={handleInvite}
                      className="justify-start bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 min-h-[44px]"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {text[currentLanguage].invite}
                    </Button>

                    {/* Logout Button */}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start text-gray-600 min-h-[44px]"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {text[currentLanguage].logout}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleLogin}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 min-h-[44px]"
                  >
                    {text[currentLanguage].login}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              💡 {text[currentLanguage].title}
            </h1>
            <Badge variant="outline" className="text-xs">
              Beta
            </Badge>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Mission Alert for authenticated users */}
            {user && !hasParticipated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/submit')}
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 animate-pulse"
              >
                <Bell className="w-4 h-4 mr-1" />
                {text[currentLanguage].mission}
              </Button>
            )}

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLanguageToggle}
              className="flex items-center space-x-1"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLanguage.toUpperCase()}</span>
            </Button>

            {user ? (
              <>
                {/* Influence Score Display */}
                <InfluenceScoreDisplay variant="compact" />
                
                {/* Admin Button - only show for admins */}
                {!roleLoading && isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdminClick}
                    className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 text-orange-700 hover:from-orange-100 hover:to-red-100"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    {text[currentLanguage].admin}
                  </Button>
                )}
                
                {/* Invite Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInvite}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  {text[currentLanguage].invite}
                </Button>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  {text[currentLanguage].logout}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogin}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {text[currentLanguage].login}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
