
import React from 'react';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VCPrivacyIndicatorProps {
  privacyLevel: 'anonymous' | 'partial' | 'verified';
  currentLanguage: 'ko' | 'en';
}

const VCPrivacyIndicator: React.FC<VCPrivacyIndicatorProps> = ({ 
  privacyLevel, 
  currentLanguage 
}) => {
  const text = {
    ko: {
      verified: '검증됨',
      privacyProtected: '프라이버시 보호',
      anonymous: '익명',
      partial: '부분 공개'
    },
    en: {
      verified: 'Verified',
      privacyProtected: 'Privacy Protected',
      anonymous: 'Anonymous',
      partial: 'Partial Disclosure'
    }
  };

  const getPrivacyInfo = (level: string) => {
    switch (level) {
      case 'verified':
        return { 
          icon: Shield, 
          color: 'text-green-600', 
          bg: 'bg-green-100',
          label: text[currentLanguage].verified
        };
      case 'partial':
        return { 
          icon: Shield, 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-100',
          label: text[currentLanguage].privacyProtected
        };
      default:
        return { 
          icon: Shield, 
          color: 'text-gray-600', 
          bg: 'bg-gray-100',
          label: text[currentLanguage].privacyProtected
        };
    }
  };

  const privacyInfo = getPrivacyInfo(privacyLevel);
  const PrivacyIcon = privacyInfo.icon;

  return (
    <div className="flex items-center space-x-2">
      <PrivacyIcon className={`w-3 h-3 ${privacyInfo.color}`} />
      <Badge 
        variant="outline" 
        className={`text-xs ${privacyInfo.bg} ${privacyInfo.color} border-current`}
      >
        {privacyInfo.label}
      </Badge>
    </div>
  );
};

export default VCPrivacyIndicator;
