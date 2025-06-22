
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, LogOut, Menu, X, Settings, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import InfluenceScoreDisplay from './InfluenceScoreDisplay';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useUserRole } from '@/hooks/useUserRole';
import { useIsMobile } from '@/hooks/use-mobile';

interface SimplifiedHeaderProps {
  currentLanguage: 'ko' | 'en';
  onLanguageToggle: () => void;
}

const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({ 
  currentLanguage, 
  onLanguageToggle 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hasParticipated } = useDailyChallenge(currentLanguage);
  const { isAdmin } = useUserRole();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const text = {
    ko: {
      title: 'IdeaDrop Pro',
      login: '로그인',
      logout: '로그아웃',
      mission: '미션',
      admin: '관리자',
      menu: '메뉴'
    },
    en: {
      title: 'IdeaDrop Pro',
      login: 'Login',
      logout: 'Logout',
      mission: 'Mission',
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
    }
  };

  const handleLogin = () => {
    navigate('/auth');
    setMobileMenuOpen(false);
  };

  if (isMobile) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <span className="text-2xl">💡</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {text[currentLanguage].title}
              </h1>
              <Badge variant="outline" className="text-xs">Beta</Badge>
            </div>

            {/* Right side - essential items only */}
            <div className="flex items-center space-x-2">
              {/* Mission alert */}
              {user && !hasParticipated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/submit')}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 animate-pulse px-2 py-1 text-xs min-h-[44px]"
                >
                  <Bell className="w-4 h-4" />
                </Button>
              )}

              {/* User menu */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 min-h-[44px] min-w-[44px]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3 pt-4">
                {/* Influence score for logged users */}
                {user && <InfluenceScoreDisplay variant="compact" />}

                {/* Language toggle */}
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
                    {/* Admin button */}
                    {isAdmin && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate('/admin');
                          setMobileMenuOpen(false);
                        }}
                        className="justify-start bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 min-h-[44px]"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {text[currentLanguage].admin}
                      </Button>
                    )}
                    
                    {/* Logout */}
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

        {/* Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </header>
    );
  }

  // Desktop header - very minimal
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="text-2xl">💡</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {text[currentLanguage].title}
            </h1>
            <Badge variant="outline" className="text-xs">Beta</Badge>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Mission alert */}
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

            {/* Language toggle */}
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
                {/* Influence score */}
                <InfluenceScoreDisplay variant="compact" />
                
                {/* Admin button */}
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    {text[currentLanguage].admin}
                  </Button>
                )}

                {/* Logout */}
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

export default SimplifiedHeader;
