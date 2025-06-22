
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  PlusCircle, 
  Search, 
  Trophy, 
  User, 
  MoreHorizontal, 
  Shuffle, 
  Building2,
  Menu,
  X,
  Info
} from 'lucide-react';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useIdeas } from '@/hooks/useIdeas';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdaptiveNavigationProps {
  currentLanguage: 'ko' | 'en';
  position: 'top' | 'bottom';
}

const AdaptiveNavigation: React.FC<AdaptiveNavigationProps> = ({
  currentLanguage,
  position
}) => {
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
      about: '정보',
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
      about: 'About',
      new: 'NEW!'
    }
  };

  // Core navigation items
  const coreNavItems = [
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

  // Additional items for more menu
  const additionalNavItems = [
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
      id: 'about',
      label: text[currentLanguage].about,
      icon: Info,
      path: '/about',
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

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setShowMoreMenu(false);
  };

  // Mobile bottom navigation
  if (isMobile && position === 'bottom') {
    return (
      <>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
          <div className="flex items-center justify-around py-2">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavClick(item.path)}
                  className={`flex flex-col items-center justify-center space-y-1 px-3 py-3 min-h-[60px] min-w-[60px] relative rounded-lg transition-all ${
                    active 
                      ? 'text-purple-600 bg-purple-100 shadow-sm scale-105' 
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                  
                  {item.badge && (
                    <Badge className={`absolute -top-1 -right-1 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center ${
                      item.id === 'submit' 
                        ? 'bg-red-500 animate-bounce' 
                        : 'bg-purple-500 animate-pulse'
                    }`}>
                      {item.badge}
                    </Badge>
                  )}
                  
                  {active && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></div>
                  )}
                </Button>
              );
            })}

            {/* More button */}
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
          </div>
        </nav>

        {/* More Menu Modal */}
        {showMoreMenu && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              onClick={() => setShowMoreMenu(false)}
            />
            <div className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 p-4">
              <div className="grid grid-cols-2 gap-3">
                {additionalNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => handleNavClick(item.path)}
                      className={`flex items-center space-x-3 p-4 h-auto justify-start rounded-xl transition-all ${
                        active 
                          ? 'text-purple-600 bg-purple-50 border border-purple-200' 
                          : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop top navigation
  if (!isMobile && position === 'top') {
    const allNavItems = [...coreNavItems, ...additionalNavItems];
    
    return (
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 py-3">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                    active 
                      ? 'text-purple-600 bg-purple-100 shadow-sm' 
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  
                  {item.badge && (
                    <Badge className={`text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center ${
                      item.id === 'submit' 
                        ? 'bg-red-500 animate-bounce' 
                        : 'bg-purple-500'
                    }`}>
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }

  return null;
};

export default AdaptiveNavigation;
