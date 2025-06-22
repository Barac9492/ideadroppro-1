
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Crown, Lock, CheckCircle, UserCheck } from 'lucide-react';

interface VCInvitationExclusivityProps {
  currentLanguage: 'ko' | 'en';
  compact?: boolean;
}

const VCInvitationExclusivity: React.FC<VCInvitationExclusivityProps> = ({ 
  currentLanguage, 
  compact = false 
}) => {
  const text = {
    ko: {
      invitationOnly: '초대 전용',
      exclusiveAccess: '독점 접근',
      personallyVerified: '주인장이 직접 검증한 VC만 참여',
      noPublicSignup: '일반 가입 불가',
      waitlistMessage: '현재 VC 신청을 받지 않습니다',
      onlyTrustedVCs: '신뢰할 수 있는 VC만 선별',
      qualityGuarantee: '품질 보장',
      directInvitation: '직접 초대',
      premiumExperience: '프리미엄 경험'
    },
    en: {
      invitationOnly: 'Invitation Only',
      exclusiveAccess: 'Exclusive Access',
      personallyVerified: 'Only VCs personally verified by the founder',
      noPublicSignup: 'No Public Signup',
      waitlistMessage: 'We are not accepting VC applications',
      onlyTrustedVCs: 'Only trusted VCs selected',
      qualityGuarantee: 'Quality Guaranteed',
      directInvitation: 'Direct Invitation',
      premiumExperience: 'Premium Experience'
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Lock className="w-4 h-4 text-purple-600" />
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <Crown className="w-3 h-3 mr-1" />
          {text[currentLanguage].invitationOnly}
        </Badge>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg">
          <Crown className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          🔒 {text[currentLanguage].exclusiveAccess}
        </h3>
        
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-semibold">
          <Lock className="w-4 h-4 mr-2" />
          {text[currentLanguage].invitationOnly}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-purple-100">
          <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {text[currentLanguage].personallyVerified}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-purple-100">
          <UserCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {text[currentLanguage].onlyTrustedVCs}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-purple-100">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {text[currentLanguage].qualityGuarantee}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
        <p className="text-center text-gray-600 text-sm font-medium">
          ⚠️ {text[currentLanguage].waitlistMessage}
        </p>
      </div>
    </div>
  );
};

export default VCInvitationExclusivity;
