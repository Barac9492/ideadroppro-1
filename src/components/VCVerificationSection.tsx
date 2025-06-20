
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Eye, MessageCircle, Briefcase, CheckCircle, Users } from 'lucide-react';

interface VCVerificationSectionProps {
  currentLanguage: 'ko' | 'en';
}

const VCVerificationSection: React.FC<VCVerificationSectionProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      title: 'VC 인증 마크로 신뢰성 확보',
      subtitle: '실제 투자자들이 당신의 아이디어를 기다리고 있습니다',
      verifiedVCs: 'Verified VC',
      totalVCs: '23명의 인증된 투자자',
      interested: '관심 표시',
      contactRequest: '연락 요청',
      viewProfile: '프로필 보기',
      focusArea: '관심 분야',
      activeToday: '오늘 활동',
      totalIdeasReviewed: '리뷰한 아이디어',
      connectionsMade: '성사된 연결'
    },
    en: {
      title: 'Trust Through VC Verification',
      subtitle: 'Real investors are waiting for your ideas',
      verifiedVCs: 'Verified VC',
      totalVCs: '23 Verified Investors',
      interested: 'Interested',
      contactRequest: 'Contact Request',
      viewProfile: 'View Profile',
      focusArea: 'Focus Area',
      activeToday: 'Active Today',
      totalIdeasReviewed: 'Ideas Reviewed',
      connectionsMade: 'Connections Made'
    }
  };

  const vcProfiles = [
    {
      name: '김OO 파트너',
      company: 'Green Ventures',
      avatar: 'K',
      focusArea: 'ESG, CleanTech',
      ideasReviewed: 47,
      connectionsToday: 3,
      interests: ['친환경', '순환경제', 'ESG'],
      isActive: true
    },
    {
      name: '이OO 대표',
      company: 'Tech Capital',
      avatar: 'L',
      focusArea: 'AI, Healthcare',
      ideasReviewed: 62,
      connectionsToday: 5,
      interests: ['AI', '헬스케어', 'B2B'],
      isActive: true
    },
    {
      name: '박OO 심사역',
      company: 'Startup Alliance',
      avatar: 'P',
      focusArea: 'Consumer, Pet-tech',
      ideasReviewed: 34,
      connectionsToday: 2,
      interests: ['펫테크', 'B2C', '소비재'],
      isActive: false
    },
    {
      name: '정OO 파트너',
      company: 'Innovation Fund',
      avatar: 'J',
      focusArea: 'Fintech, Blockchain',
      ideasReviewed: 51,
      connectionsToday: 4,
      interests: ['핀테크', '블록체인', 'Web3'],
      isActive: true
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <Badge className="bg-blue-600 text-white px-3 py-1">
              {text[currentLanguage].verifiedVCs}
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🔒 {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            {text[currentLanguage].subtitle}
          </p>
          
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-lg">
            <Users className="w-4 h-4 mr-2" />
            {text[currentLanguage].totalVCs}
          </Badge>
        </div>

        {/* VC Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {vcProfiles.map((vc, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative"
            >
              {/* Active Status */}
              {vc.isActive && (
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}

              {/* VC Avatar & Basic Info */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl font-bold">{vc.avatar}</span>
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
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">100% 인증</h3>
              <p className="text-gray-600">모든 VC는 신원과 투자 이력을 검증받았습니다</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">실제 투자 경험</h3>
              <p className="text-gray-600">평균 15건 이상의 스타트업 투자 경력 보유</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">안전한 연결</h3>
              <p className="text-gray-600">플랫폼을 통한 안전하고 투명한 소통</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCVerificationSection;
