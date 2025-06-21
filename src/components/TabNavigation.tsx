
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, PlusCircle, Shuffle, Trophy, Building2, User } from 'lucide-react';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';

interface TabNavigationProps {
  currentLanguage: 'ko' | 'en';
}

const TabNavigation: React.FC<TabNavigationProps> = ({ currentLanguage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasParticipated } = useDailyChallenge(currentLanguage);

  const text = {
    ko: {
      home: '홈',
      submit: '제출',
      remix: '리믹스',
      ranking: '랭킹',
      vcs: 'VC',
      profile: '프로필',
      urgent: '긴급!'
    },
    en: {
      home: 'Home',
      submit: 'Submit',
      remix: 'Remix',
      ranking: 'Ranking',
      vcs: 'VCs',
      profile: 'Profile',
      urgent: 'Urgent!'
    }
  };

  const tabs = [
    {
      id: 'home',
      label: text[currentLanguage].home,
      icon: Home,
      path: '/',
      badge: null
    },
    {
      id: 'submit',
      label: text[currentLanguage].submit,
      icon: PlusCircle,
      path: '/submit',
      badge: !hasParticipated ? text[currentLanguage].urgent : null
    },
    {
      id: 'remix',
      label: text[currentLanguage].remix,
      icon: Shuffle,
      path: '/remix',
      badge: null
    },
    {
      id: 'ranking',
      label: text[currentLanguage].ranking,
      icon: Trophy,
      path: '/ranking',
      badge: null
    },
    {
      id: 'vcs',
      label: text[currentLanguage].vcs,
      icon: Building2,
      path: '/vcs',
      badge: null
    },
    {
      id: 'profile',
      label: text[currentLanguage].profile,
      icon: User,
      path: '/dashboard',
      badge: null
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-t border-gray-200 sticky bottom-0 md:static md:border-t-0 md:border-b md:bg-gradient-to-r md:from-purple-50 md:to-blue-50 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around md:justify-center md:space-x-8 py-2 md:py-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => navigate(tab.path)}
                className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-2 md:px-4 py-2 relative ${
                  active 
                    ? 'text-purple-600 bg-purple-100 md:bg-purple-100' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs md:text-sm font-medium">{tab.label}</span>
                
                {tab.badge && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 animate-pulse">
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;
