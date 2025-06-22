
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, PlusCircle, Search, Trophy, User, MoreHorizontal, Shuffle, Building2 } from 'lucide-react';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useIdeas } from '@/hooks/useIdeas';
import { useIsMobile } from '@/hooks/use-mobile';

interface TabNavigationProps {
  currentLanguage: 'ko' | 'en';
}

const TabNavigation: React.FC<TabNavigationProps> = ({currentLanguage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasParticipated } = useDailyChallenge(currentLanguage);
  const { ideas } = useIdeas(currentLanguage);
  const isMobile = useIsMobile();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const text = {
    ko: {
      home: '홈',
      submit: '제출',
      explore: '탐색',
      ranking: '랭킹',
      profile: '프로필',
      more: '더보기',
      remix: '리믹스',
      vcs: 'VC',
      new: 'NEW!'
    },
    en: {
      home: 'Home',
      submit: 'Submit',
      explore: 'Explore',
      ranking: 'Ranking',
      profile: 'Profile',
      more: 'More',
      remix: 'Remix',
      vcs: 'VCs',
      new: 'NEW!'
    }
  };

  // Core tabs for mobile (4 main tabs + more menu)
  const coreTabsMobile = [
    {
      id: 'home',
      label: text[currentLanguage].home,
      icon: Home,
      path: '/',
      badge: null,
    },
    {
      id: 'submit',
      label: text[currentLanguage].submit,
      icon: PlusCircle,
      path: '/submit',
      badge: !hasParticipated ? text[currentLanguage].new : null,
    },
    {
      id: 'explore',
      label: text[currentLanguage].explore,
      icon: Search,
      path: '/explore',
      badge: ideas.length > 5 ? '5+' : (ideas.length > 0 ? ideas.length.toString() : null),
    },
    {
      id: 'profile',
      label: text[currentLanguage].profile,
      icon: User,
      path: '/dashboard',
      badge: null,
    }
  ];

  // Additional tabs for more menu
  const additionalTabs = [
    {
      id: 'ranking',
      label: text[currentLanguage].ranking,
      icon: Trophy,
      path: '/ranking',
      badge: null,
    },
    {
      id: 'remix',
      label: text[currentLanguage].remix,
      icon: Shuffle,
      path: '/remix',
      badge: null,
    },
    {
      id: 'vcs',
      label: text[currentLanguage].vcs,
      icon: Building2,
      path: '/vcs',
      badge: null,
    }
  ];

  // All tabs for desktop
  const allTabs = [
    ...coreTabsMobile,
    ...additionalTabs.slice(0, -1), // Remove VCs from main desktop nav
    additionalTabs[2] // Add VCs back
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleTabClick = (path: string) => {
    navigate(path);
    setShowMoreMenu(false);
  };

  const tabsToShow = isMobile ? coreTabsMobile : allTabs;

  return (
    <>
      <nav className="bg-white border-t border-gray-200 sticky bottom-0 md:static md:border-t-0 md:border-b md:bg-gradient-to-r md:from-purple-50 md:to-blue-50 z-50 shadow-lg md:shadow-sm">
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex items-center justify-around md:justify-center md:space-x-4 py-2 md:py-3">
            {tabsToShow.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab.path);
              
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-2 relative rounded-lg transition-all ${
                    isMobile 
                      ? 'px-3 py-3 min-h-[60px] min-w-[60px]' 
                      : 'px-4 py-3'
                  } ${
                    active 
                      ? 'text-purple-600 bg-purple-100 shadow-sm scale-105' 
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} ${active ? 'animate-pulse' : ''}`} />
                  <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {tab.label}
                  </span>
                  
                  {tab.badge && (
                    <Badge className={`absolute -top-1 -right-1 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center ${
                      tab.id === 'submit' 
                        ? 'bg-red-500 animate-bounce' 
                        : 'bg-purple-500 animate-pulse'
                    }`}>
                      {tab.badge}
                    </Badge>
                  )}
                  
                  {active && isMobile && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></div>
                  )}
                </Button>
              );
            })}

            {/* More button for mobile */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-3 min-h-[60px] min-w-[60px] relative rounded-lg transition-all ${
                  showMoreMenu 
                    ? 'text-purple-600 bg-purple-100 shadow-sm' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <MoreHorizontal className="w-5 h-5" />
                <span className="text-xs font-medium">{text[currentLanguage].more}</span>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* More Menu Overlay for Mobile */}
      {isMobile && showMoreMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 p-4">
            <div className="grid grid-cols-2 gap-3">
              {additionalTabs.map((tab) => {
                const Icon = tab.icon;
                const active = isActive(tab.path);
                
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => handleTabClick(tab.path)}
                    className={`flex items-center space-x-3 p-4 h-auto justify-start rounded-xl transition-all ${
                      active 
                        ? 'text-purple-600 bg-purple-50 border border-purple-200' 
                        : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TabNavigation;
