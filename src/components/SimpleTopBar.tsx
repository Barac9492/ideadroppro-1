
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, User, LogOut, Settings, BarChart3 } from 'lucide-react';
import HeaderLogo from './HeaderLogo';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

interface SimpleTopBarProps {
  currentLanguage: 'ko' | 'en';
  onLanguageToggle: () => void;
  showBeta?: boolean;
}

const SimpleTopBar: React.FC<SimpleTopBarProps> = ({ 
  currentLanguage, 
  onLanguageToggle,
  showBeta = false
}) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const text = {
    ko: {
      betaTitle: 'IdeaDrop Pro 오픈 베타',
      betaSubtitle: '아이디어 하나 → GPT로 점수 → VC에게 바로 노출',
      login: '로그인',
      logout: '로그아웃',
      myWorkspace: '내 워크스페이스',
      dashboard: '대시보드',
      admin: '관리자'
    },
    en: {
      betaTitle: 'IdeaDrop Pro Open Beta',
      betaSubtitle: 'One Idea → GPT Score → Direct VC Exposure',
      login: 'Login',
      logout: 'Logout',
      myWorkspace: 'My Workspace',
      dashboard: 'Dashboard',
      admin: 'Admin'
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMyWorkspace = () => {
    navigate('/my-workspace');
    setDropdownOpen(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setDropdownOpen(false);
  };

  const handleAdmin = () => {
    navigate('/admin');
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-900/95 backdrop-blur-sm border-b border-blue-800/50">
      {/* Beta banner */}
      {showBeta && (
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-2">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Badge className="bg-cyan-500 text-white border-cyan-400 text-xs">
                🎉 {text[currentLanguage].betaTitle}
              </Badge>
              <span className="text-sm font-medium">
                {text[currentLanguage].betaSubtitle}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Simple header */}
      <div>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <HeaderLogo 
              currentLanguage={currentLanguage} 
              onHomeClick={handleHomeClick}
            />
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <Button
                onClick={onLanguageToggle}
                variant="ghost"
                size="sm"
                className="text-blue-100 hover:text-white hover:bg-white/10 border-white/20"
              >
                <Globe className="w-4 h-4 mr-1" />
                {currentLanguage === 'ko' ? 'EN' : '한국어'}
              </Button>

              {/* Auth Section */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <Button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-white/10 text-white"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={handleMyWorkspace}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>{text[currentLanguage].myWorkspace}</span>
                      </button>
                      
                      <button
                        onClick={handleDashboard}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>{text[currentLanguage].dashboard}</span>
                      </button>

                      {/* Admin menu - only for admins */}
                      {isAdmin && (
                        <button
                          onClick={handleAdmin}
                          className="w-full text-left px-4 py-2 text-sm text-cyan-600 hover:bg-cyan-50 flex items-center space-x-2"
                        >
                          <Settings className="w-4 h-4" />
                          <span>{text[currentLanguage].admin}</span>
                        </button>
                      )}

                      <hr className="my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{text[currentLanguage].logout}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-sm border-0"
                  size="sm"
                >
                  {text[currentLanguage].login}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTopBar;
