
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Lightbulb, LogOut, User, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminPanel from './AdminPanel';

interface HeaderProps {
  currentLanguage: 'ko' | 'en';
  onLanguageToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageToggle }) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const text = {
    ko: {
      title: 'IdeaDrop Pro',
      subtitle: 'AI의 실시간 피드백과 현업 VC의 주간 피드백',
      signIn: '로그인',
      signOut: '로그아웃',
      adminPanel: '관리자 패널'
    },
    en: {
      title: 'IdeaDrop Pro',
      subtitle: 'Real-time AI feedback and weekly insights from professional VCs',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      adminPanel: 'Admin Panel'
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/auth');
  };

  const handleNavigateToAuth = () => {
    setMobileMenuOpen(false);
    navigate('/auth');
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 bg-purple-500/20 rounded-xl backdrop-blur-sm border border-purple-400/30">
              <Lightbulb className="h-6 w-6 md:h-8 md:w-8 text-purple-300" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent truncate">
                {text[currentLanguage].title}
              </h1>
              <p className="text-purple-200/80 text-xs md:text-sm hidden sm:block">
                {text[currentLanguage].subtitle}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <button
                onClick={onLanguageToggle}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20"
              >
                <Globe className="h-4 w-4" />
                <span className="font-medium">{currentLanguage === 'ko' ? '한국어' : 'English'}</span>
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm border border-white/20">
                    <User className="h-4 w-4" />
                    <span className="text-sm max-w-32 truncate">{user.email}</span>
                  </div>

                  {isAdmin && (
                    <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 border border-white/20"
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
                    className="text-white hover:bg-white/20 border border-white/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {text[currentLanguage].signOut}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleNavigateToAuth}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 border border-white/20"
                >
                  {text[currentLanguage].signIn}
                </Button>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 pb-4 border-t border-purple-500/30">
            <div className="flex flex-col space-y-3 pt-4">
              <button
                onClick={onLanguageToggle}
                className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <Globe className="h-4 w-4" />
                <span className="font-medium">{currentLanguage === 'ko' ? '한국어' : 'English'}</span>
              </button>

              {user ? (
                <>
                  <div className="flex items-center justify-center space-x-2 bg-white/10 px-4 py-3 rounded-lg backdrop-blur-sm border border-white/20">
                    <User className="h-4 w-4" />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>

                  {isAdmin && (
                    <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-white hover:bg-white/20 border border-white/20 w-full justify-center"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          {text[currentLanguage].adminPanel}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
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
                    className="text-white hover:bg-white/20 border border-white/20 w-full justify-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {text[currentLanguage].signOut}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleNavigateToAuth}
                  variant="ghost"
                  className="text-white hover:bg-white/20 border border-white/20 w-full justify-center"
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
