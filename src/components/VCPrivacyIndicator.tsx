
import React from 'react';
import { Shield, CheckCircle, Eye } from 'lucide-react';
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
      verified: '인증됨',
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
          icon: CheckCircle, 
          color: 'text-emerald-600', 
          bg: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          label: text[currentLanguage].verified
        };
      case 'partial':
        return { 
          icon: Eye, 
          color: 'text-amber-600', 
          bg: 'bg-amber-50',
          borderColor: 'border-amber-200',
          label: text[currentLanguage].partial
        };
      default:
        return { 
          icon: Shield, 
          color: 'text-slate-600', 
          bg: 'bg-slate-50',
          borderColor: 'border-slate-200',
          label: text[currentLanguage].anonymous
        };
    }
  };

  const privacyInfo = getPrivacyInfo(privacyLevel);
  const PrivacyIcon = privacyInfo.icon;

  return (
    <div className="flex items-center space-x-2">
      <div className={`p-1 rounded-full ${privacyInfo.bg}`}>
        <PrivacyIcon className={`w-3 h-3 ${privacyInfo.color}`} />
      </div>
      <Badge 
        variant="outline" 
        className={`text-xs font-medium ${privacyInfo.bg} ${privacyInfo.color} ${privacyInfo.borderColor} px-2 py-1`}
      >
        {privacyInfo.label}
      </Badge>
    </div>
  );
};

export default VCPrivacyIndicator;
