
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Flame } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderLogo from './HeaderLogo';

interface SimplifiedHeaderProps {
  currentLanguage: 'ko' | 'en';
  onLanguageToggle: () => void;
  showChallengeButton?: boolean;
  onChallengeClick?: () => void;
}

const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({ 
  currentLanguage, 
  onLanguageToggle,
  showChallengeButton = false,
  onChallengeClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const text = {
    ko: {
      challenge: '챌린지',
      home: '홈'
    },
    en: {
      challenge: 'Challenge',
      home: 'Home'
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer" onClick={handleLogoClick}>
            <HeaderLogo />
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Challenge Button - Only on submit page */}
            {showChallengeButton && onChallengeClick && (
              <Button
                onClick={onChallengeClick}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50 hidden sm:flex"
              >
                <Flame className="w-4 h-4 mr-1" />
                {text[currentLanguage].challenge}
              </Button>
            )}
            
            <Button
              onClick={onLanguageToggle}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Globe className="w-4 h-4 mr-1" />
              {currentLanguage === 'ko' ? 'EN' : '한국어'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimplifiedHeader;
