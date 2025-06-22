import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Lightbulb, Search, Brain, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdaptiveNavigationProps {
  currentLanguage: 'ko' | 'en';
  position?: 'top' | 'bottom';
}

const AdaptiveNavigation: React.FC<AdaptiveNavigationProps> = ({ currentLanguage, position = 'bottom' }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  const text = {
    ko: {
      home: '홈',
      ideas: '아이디어',
      submit: '제출',
      profile: '프로필',
      workspace: '작업실'
    },
    en: {
      home: 'Home',
      ideas: 'Ideas',
      submit: 'Submit',
      profile: 'Profile',
      workspace: 'Workspace'
    }
  };

  const navItems = [
    { 
      key: 'home', 
      icon: Home, 
      label: text[currentLanguage].home, 
      path: '/',
      badge: null
    },
    { 
      key: 'ideas', 
      icon: Lightbulb, 
      label: text[currentLanguage].ideas, 
      path: '/ideas',
      badge: null
    },
    { 
      key: 'submit', 
      icon: Search, 
      label: text[currentLanguage].submit, 
      path: '/submit',
      badge: null
    },
    { 
      key: 'workspace', 
      icon: Brain, 
      label: text[currentLanguage].workspace, 
      path: '/my-workspace',
      badge: null
    },
    { 
      key: 'profile', 
      icon: User, 
      label: text[currentLanguage].profile, 
      path: user ? '/profile' : '/auth',
      badge: null
    },
  ];

  return (
    <nav
      className={`
        ${position === 'bottom' ? 'fixed bottom-0 left-0 w-full bg-white border-t' : 'bg-white border-b hidden md:block'}
        z-40
        ${isMobile ? 'py-2' : 'py-4'}
        ${isMobile ? 'shadow-md' : ''}
      `}
    >
      <div className="container mx-auto px-4">
        <ul className={`
          ${isMobile ? 'flex justify-around items-center' : 'flex justify-center items-center space-x-6'}
        `}>
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                to={item.path}
                className={`
                  ${isMobile ? 'flex flex-col items-center justify-center space-y-1' : 'flex items-center space-x-2'}
                  ${location.pathname === item.path ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-blue-600'}
                  ${isMobile ? 'text-sm' : 'text-base'}
                  transition-colors duration-200
                `}
              >
                <item.icon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                {isMobile ? <span>{item.label}</span> : item.label}
                {item.badge && (
                  <span className="ml-1 bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default AdaptiveNavigation;
