
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle,
  Bot, 
  Users,
  TrendingUp,
  Building2,
  MoreHorizontal,
  DollarSign,
  Star,
  Info,
  User
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
      submit: '아이디어 제출',
      elaborate: 'AI 구체화',
      vcMatching: 'VC 매칭',
      community: '커뮤니티',
      investment: '투자 연결',
      more: '더보기',
      profile: '프로필',
      about: '서비스 소개',
new: 'NEW!',
      hot: 'HOT'
    },
    en: {
      submit: 'Submit Idea',
      elaborate: 'AI Elaborate',
      vcMatching: 'VC Matching',
      community: 'Community', 
      investment: 'Investment',
      more: 'More',
      profile: 'Profile',
      about: 'About',
      new: 'NEW!',
      hot: 'HOT'
    }
  };

  // Investment-focused core navigation
  const coreNavItems = [
    {
      id: 'submit',
      label: text[currentLanguage].submit,
      icon: PlusCircle,
      path: '/submit',
      badge: !hasParticipated ? text[currentLanguage].new : null,
      color: 'text-blue-600'
    },
    {
      id: 'elaborate',
      label: text[currentLanguage].elaborate,
      icon: Bot,
      path: '/builder',
      badge: null,
      color: 'text-purple-600'
    },
    {
      id: 'vcMatching',
      label: text[currentLanguage].vcMatching, 
      icon: Building2,
      path: '/vcs',
      badge: text[currentLanguage].hot,
      color: 'text-green-600'
    },
    {
      id: 'investment',
      label: text[currentLanguage].investment,
      icon: DollarSign,
      path: '/ranking',
      badge: '12건',
      color: 'text-yellow-600'
    },
    {
      id: 'community',
      label: text[currentLanguage].community,
      icon: Users,
      path: '/ideas',
      badge: ideas.length > 10 ? '10+' : (ideas.length > 5 ? '5+' : null),
      color: 'text-indigo-600'
    }
  ];

  // Additional items for more menu
  const additionalNavItems = [
    {
      id: 'profile',
      label: text[currentLanguage].profile,
      icon: User,
      path: '/dashboard',
      badge: null,
    },
    {
      id: 'about',
      label: text[currentLanguage].about,
      icon: Info,
      path: '/about',
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
                  className={`flex flex-col items-center justify-center space-y-1 px-2 py-3 min-h-[60px] min-w-[50px] relative rounded-lg transition-all ${
                    active 
                      ? `${item.color} bg-opacity-10 scale-105` 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : ''}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                  
                  {item.badge && (
                    <Badge className={`absolute -top-1 -right-1 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-4 flex items-center justify-center ${
                      item.id === 'investment' 
                        ? 'bg-yellow-500 animate-bounce' 
                        : item.id === 'vcMatching'
                        ? 'bg-green-500 animate-pulse'
                        : 'bg-blue-500'
                    }`}>
                      {item.badge}
                    </Badge>
                  )}
                  
                  {active && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full"></div>
                  )}
                </Button>
              );
            })}

            {/* More button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`flex flex-col items-center justify-center space-y-1 px-2 py-3 min-h-[60px] min-w-[50px] relative rounded-lg transition-all ${
                showMoreMenu 
                  ? 'text-gray-800 bg-gray-100 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
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
                          ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
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
              const itemColor = (item as any).color || 'text-gray-600';
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                    active 
                      ? `${itemColor} bg-opacity-10 shadow-sm` 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  
                  {item.badge && (
                    <Badge className={`text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center ${
                      item.id === 'investment' 
                        ? 'bg-yellow-500 animate-bounce' 
                        : item.id === 'vcMatching'
                        ? 'bg-green-500 animate-pulse'
                        : 'bg-blue-500'
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
