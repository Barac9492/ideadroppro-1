
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, PlusCircle, Search, Shuffle, Trophy, Building2, User } from 'lucide-react';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useIdeas } from '@/hooks/useIdeas';

interface TabNavigationProps {
  currentLanguage: 'ko' | 'en';
}

const TabNavigation: React.FC<TabNavigationProps> = ({ currentLanguage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasParticipated } = useDailyChallenge(currentLanguage);
  const { ideas } = useIdeas(currentLanguage);

  const text = {
    ko: {
      home: '홈',
      submit: '제출',
      explore: '탐색',
      remix: '리믹스',
      ranking: '랭킹',
      vcs: 'VC',
      profile: '프로필',
      new: 'NEW!'
    },
    en: {
      home: 'Home',
      submit: 'Submit',
      explore: 'Explore',
      remix: 'Remix',
      ranking: 'Ranking',
      vcs: 'VCs',
      profile: 'Profile',
      new: 'NEW!'
    }
  };

  const tabs = [
    {
      id: 'home',
      label: text[currentLanguage].home,
      icon: Home,
      path: '/',
      badge: null,
      description: 'Landing & Overview'
    },
    {
      id: 'submit',
      label: text[currentLanguage].submit,
      icon: PlusCircle,
      path: '/submit',
      badge: !hasParticipated ? text[currentLanguage].new : null,
      description: 'Daily Challenges'
    },
    {
      id: 'explore',
      label: text[currentLanguage].explore,
      icon: Search,
      path: '/explore',
      badge: ideas.length > 0 ? ideas.length.toString() : null,
      description: 'Browse All Ideas'
    },
    {
      id: 'remix',
      label: text[currentLanguage].remix,
      icon: Shuffle,
      path: '/remix',
      badge: null,
      description: 'Collaborate & Evolve'
    },
    {
      id: 'ranking',
      label: text[currentLanguage].ranking,
      icon: Trophy,
      path: '/ranking',
      badge: null,
      description: 'Leaderboards'
    },
    {
      id: 'vcs',
      label: text[currentLanguage].vcs,
      icon: Building2,
      path: '/vcs',
      badge: null,
      description: 'Investor Network'
    },
    {
      id: 'profile',
      label: text[currentLanguage].profile,
      icon: User,
      path: '/dashboard',
      badge: null,
      description: 'Your Stats'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-t border-gray-200 sticky bottom-0 md:static md:border-t-0 md:border-b md:bg-gradient-to-r md:from-purple-50 md:to-blue-50 z-50 shadow-lg md:shadow-sm">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-around md:justify-center md:space-x-4 py-2 md:py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => navigate(tab.path)}
                className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-2 md:px-4 py-2 md:py-3 relative rounded-lg transition-all ${
                  active 
                    ? 'text-purple-600 bg-purple-100 shadow-sm scale-105' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />
                <span className="text-xs md:text-sm font-medium">{tab.label}</span>
                
                {tab.badge && (
                  <Badge className={`absolute -top-1 -right-1 text-white text-xs px-1.5 py-0.5 ${
                    tab.id === 'submit' 
                      ? 'bg-red-500 animate-bounce' 
                      : 'bg-purple-500 animate-pulse'
                  }`}>
                    {tab.badge}
                  </Badge>
                )}
                
                {active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full md:hidden"></div>
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
