
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, LogOut, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import InfluenceScoreDisplay from './InfluenceScoreDisplay';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentLanguage: 'ko' | 'en';
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const text = {
    ko: {
      title: 'IdeaDrop Pro',
      login: '로그인',
      logout: '로그아웃',
      invite: '친구 초대'
    },
    en: {
      title: 'IdeaDrop Pro',
      login: 'Login',
      logout: 'Logout',
      invite: 'Invite Friends'
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
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
  };

  const handleInvite = () => {
    navigate('/dashboard');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              💡 {text[currentLanguage].title}
            </h1>
            <Badge variant="outline" className="text-xs">
              Beta
            </Badge>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
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
