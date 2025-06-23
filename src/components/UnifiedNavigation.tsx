
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Plus, Search, Shuffle, User } from 'lucide-react';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useIdeas } from '@/hooks/useIdeas';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedNavigationProps {
  currentLanguage: 'ko' | 'en';
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ currentLanguage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasParticipated } = useDailyChallenge(currentLanguage);
  const { ideas } = useIdeas(currentLanguage);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const text = {
    ko: {
      home: '홈',
      create: '만들기', 
      explore: '탐색',
      remix: '리믹스',
      myInfo: '내정보',
      missionAlert: '미션!',
    },
    en: {
      home: 'Home',
      create: 'Create',
      explore: 'Explore', 
      remix: 'Remix',
      myInfo: 'My Info',
      missionAlert: 'Mission!',
    }
  };

  const coreNavItems = [
    {
      id: 'home',
      label: text[currentLanguage].home,
      icon: Home,
      path: '/',
      badge: null,
    },
    {
      id: 'create',
      label: text[currentLanguage].create,
      icon: Plus,
      path: '/create',
      badge: !hasParticipated ? text[currentLanguage].missionAlert : null,
    },
    {
      id: 'explore',
      label: text[currentLanguage].explore,
      icon: Search,
      path: '/explore',
      badge: ideas.length > 5 ? '5+' : null,
    },
    {
      id: 'remix',
      label: text[currentLanguage].remix,
      icon: Shuffle,
      path: '/remix',
      badge: null,
    },
    {
      id: 'myinfo',
      label: text[currentLanguage].myInfo,
      icon: User,
      path: user ? '/my-workspace' : '/auth',
      badge: null,
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  // Mobile bottom navigation
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="flex items-center justify-around py-2 px-1">
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => handleNavClick(item.path)}
                className={`flex flex-col items-center justify-center space-y-1 px-2 py-3 min-h-[60px] min-w-[60px] relative rounded-lg transition-all ${
                  active 
                    ? 'text-purple-600 bg-purple-100 shadow-sm' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                
                {item.badge && (
                  <Badge className={`absolute -top-1 -right-1 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-4 flex items-center justify-center ${
                    item.id === 'create' ? 'bg-red-500' : 'bg-purple-500'
                  }`}>
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Desktop - show only on non-home pages
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 py-3">
          {coreNavItems.map((item) => {
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
                    item.id === 'create' 
                      ? 'bg-red-500' 
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
};

export default UnifiedNavigation;
