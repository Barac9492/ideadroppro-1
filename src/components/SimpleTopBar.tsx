
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import HeaderLogo from './HeaderLogo';

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
  const text = {
    ko: {
      betaTitle: 'IdeaDrop Pro 오픈 베타',
      betaSubtitle: '아이디어 하나 → GPT로 점수 → VC에게 바로 노출'
    },
    en: {
      betaTitle: 'IdeaDrop Pro Open Beta',
      betaSubtitle: 'One Idea → GPT Score → Direct VC Exposure'
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
      {/* Beta banner */}
      {showBeta && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
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
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <HeaderLogo currentLanguage={currentLanguage} />
            
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
    </div>
  );
};

export default SimpleTopBar;
