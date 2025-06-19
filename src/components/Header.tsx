
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Lightbulb, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminPanel from './AdminPanel';

interface HeaderProps {
  currentLanguage: 'ko' | 'en';
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageToggle }) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const navigate = useNavigate();

  const text = {
    ko: {
      title: 'IdeaDrop Pro',
      subtitle: '혁신적인 아이디어를 공유하고 AI 피드백을 받아보세요',
      signIn: '로그인',
      signOut: '로그아웃',
      adminPanel: '관리자 패널'
    },
    en: {
      title: 'IdeaDrop Pro',
      subtitle: 'Share innovative ideas and get instant AI feedback',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      adminPanel: 'Admin Panel'
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
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
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onLanguageToggle}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">{currentLanguage === 'ko' ? '한국어' : 'English'}</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>

                {isAdmin && (
                  <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {text[currentLanguage].adminPanel}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{text[currentLanguage].adminPanel}</DialogTitle>
                      </DialogHeader>
                      <AdminPanel currentLanguage={currentLanguage} />
                    </DialogContent>
                  </Dialog>
                )}

                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {text[currentLanguage].signOut}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                {text[currentLanguage].signIn}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
