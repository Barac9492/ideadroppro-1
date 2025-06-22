
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Eye, MessageCircle, Briefcase, CheckCircle, Users, Crown, Lock } from 'lucide-react';
import { VC_PROFILES, getVCByIndex } from '@/utils/vcConfig';
import VCInvitationExclusivity from './VCInvitationExclusivity';
import SmartTimeIndicator from './SmartTimeIndicator';

interface VCVerificationSectionProps {
  currentLanguage: 'ko' | 'en';
}

const VCVerificationSection: React.FC<VCVerificationSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: 'VC 인증 마크로 신뢰성 확보',
      subtitle: '주인장이 직접 초대한 검증된 투자자들과 연결되세요',
      invitationOnly: '초대 전용',
      verifiedVCs: 'Verified VC',
      totalVCs: '23명의 초대받은 투자자',
      interested: '관심 표시',
      contactRequest: '연락 요청',
      viewProfile: '프로필 보기',
      focusArea: '관심 분야',
      activeToday: '오늘 활동',
      totalIdeasReviewed: '리뷰한 아이디어',
      connectionsMade: '성사된 연결',
      exclusiveNetwork: '독점 네트워크',
      personallySelected: '주인장 직접 선별',
      noPublicAccess: '일반 접근 불가'
    },
    en: {
      title: 'Trust Through VC Verification',
      subtitle: 'Connect with verified investors personally invited by the founder',
      invitationOnly: 'Invitation Only',
      verifiedVCs: 'Verified VC',
      totalVCs: '23 Invited Investors',
      interested: 'Interested',
      contactRequest: 'Contact Request',
      viewProfile: 'View Profile',
      focusArea: 'Focus Area',
      activeToday: 'Active Today',
      totalIdeasReviewed: 'Ideas Reviewed',
      connectionsMade: 'Connections Made',
      exclusiveNetwork: 'Exclusive Network',
      personallySelected: 'Personally Selected',
      noPublicAccess: 'No Public Access'
    }
  };

  const vcProfiles = [
    {
      name: '김OO 파트너',
      company: currentLanguage === 'ko' ? VC_PROFILES[0].name : VC_PROFILES[0].nameEn,
      avatar: getVCByIndex(0).avatar,
      focusArea: currentLanguage === 'ko' ? 
        VC_PROFILES[0].specialties.slice(0, 2).join(', ') : 
        VC_PROFILES[0].specialtiesEn.slice(0, 2).join(', '),
      ideasReviewed: 47,
      connectionsToday: 3,
      interests: currentLanguage === 'ko' ? VC_PROFILES[0].specialties : VC_PROFILES[0].specialtiesEn,
      isActive: true,
      lastActivity: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      invitedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    },
    {
      name: '이OO 대표',
      company: currentLanguage === 'ko' ? VC_PROFILES[1].name : VC_PROFILES[1].nameEn,
      avatar: getVCByIndex(1).avatar,
      focusArea: currentLanguage === 'ko' ? 
        VC_PROFILES[1].specialties.slice(0, 2).join(', ') : 
        VC_PROFILES[1].specialtiesEn.slice(0, 2).join(', '),
      ideasReviewed: 62,
      connectionsToday: 5,
      interests: currentLanguage === 'ko' ? VC_PROFILES[1].specialties : VC_PROFILES[1].specialtiesEn,
      isActive: true,
      lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      invitedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // 45 days ago
    },
    {
      name: '박OO 심사역',
      company: currentLanguage === 'ko' ? VC_PROFILES[2].name : VC_PROFILES[2].nameEn,
      avatar: getVCByIndex(2).avatar,
      focusArea: currentLanguage === 'ko' ? 
        VC_PROFILES[2].specialties.slice(0, 2).join(', ') : 
        VC_PROFILES[2].specialtiesEn.slice(0, 2).join(', '),
      ideasReviewed: 34,
      connectionsToday: 2,
      interests: currentLanguage === 'ko' ? VC_PROFILES[2].specialties : VC_PROFILES[2].specialtiesEn,
      isActive: false,
      lastActivity: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      invitedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // 60 days ago
    },
    {
      name: '정OO 파트너',
      company: currentLanguage === 'ko' ? VC_PROFILES[3].name : VC_PROFILES[3].nameEn,
      avatar: getVCByIndex(3).avatar,
      focusArea: currentLanguage === 'ko' ? 
        VC_PROFILES[3].specialties.slice(0, 2).join(', ') : 
        VC_PROFILES[3].specialtiesEn.slice(0, 2).join(', '),
      ideasReviewed: 51,
      connectionsToday: 4,
      interests: currentLanguage === 'ko' ? VC_PROFILES[3].specialties : VC_PROFILES[3].specialtiesEn,
      isActive: true,
      lastActivity: new Date(Date.now() - 15 * 1000), // 15 seconds ago
      invitedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) // 20 days ago
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header with Invitation Exclusivity */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <Crown className="w-8 h-8 text-purple-600" />
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-lg">
              <Lock className="w-4 h-4 mr-2" />
              {text[currentLanguage].invitationOnly}
            </Badge>
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🔒 {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {text[currentLanguage].subtitle}
          </p>
          
          <div className="flex justify-center items-center space-x-4 mb-8">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 text-lg">
              <Crown className="w-4 h-4 mr-2" />
              {text[currentLanguage].totalVCs}
            </Badge>
            <Badge className="bg-orange-100 text-orange-700 px-4 py-2">
              {text[currentLanguage].exclusiveNetwork}
            </Badge>
          </div>
        </div>

        {/* Exclusivity Information */}
        <div className="max-w-2xl mx-auto mb-12">
          <VCInvitationExclusivity currentLanguage={currentLanguage} />
        </div>

        {/* VC Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {vcProfiles.map((vc, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative border-2 border-purple-100"
            >
              {/* Invitation Badge */}
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  INVITED
                </Badge>
              </div>

              {/* Active Status */}
              {vc.isActive && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}

              {/* VC Avatar & Basic Info */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                  {vc.avatar}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{vc.name}</h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {vc.company}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{vc.focusArea}</p>
              </div>

              {/* Last Activity Time */}
              <div className="mb-3 flex justify-center">
                <SmartTimeIndicator 
                  timestamp={vc.lastActivity}
                  currentLanguage={currentLanguage}
                  size="sm"
                />
              </div>

              {/* Interest Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {vc.interests.map((interest, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs border-purple-200 text-purple-700">
                    {interest}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{vc.ideasReviewed}</div>
                    <div className="text-xs text-gray-600">{text[currentLanguage].totalIdeasReviewed}</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{vc.connectionsToday}</div>
                    <div className="text-xs text-gray-600">{text[currentLanguage].activeToday}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {text[currentLanguage].viewProfile}
                </Button>
                
                {vc.isActive && (
                  <div className="flex space-x-1">
                    <Badge className="bg-green-100 text-green-700 flex-1 justify-center py-1">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {text[currentLanguage].interested}
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-700 flex-1 justify-center py-1">
                      {text[currentLanguage].contactRequest}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{text[currentLanguage].personallySelected}</h3>
              <p className="text-gray-600">주인장이 직접 검증하고 초대한 신뢰할 수 있는 투자자들</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">100% 검증 완료</h3>
              <p className="text-gray-600">모든 VC는 투자 이력과 신원을 엄격하게 검증받았습니다</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{text[currentLanguage].noPublicAccess}</h3>
              <p className="text-gray-600">독점적인 네트워크로 품질 높은 연결만 제공합니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCVerificationSection;
