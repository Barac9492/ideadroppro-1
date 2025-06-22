import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Eye, MessageSquare, Heart, TrendingUp, Clock, Zap, Crown, Lock } from 'lucide-react';
import VCPrivacyIndicator from './VCPrivacyIndicator';
import VCStatsDisplay from './VCStatsDisplay';
import VCInvitationExclusivity from './VCInvitationExclusivity';
import SmartTimeIndicator from './SmartTimeIndicator';
import { VC_PROFILES, getVCByIndex } from '@/utils/vcConfig';

interface VCProfile {
  id: string;
  name: string;
  company: string;
  companyType: string;
  fundSize: string;
  position: string;
  specialties: string[];
  avatar: string;
  stats: {
    remixCount: number;
    commentCount: number;
    dmRequests: number;
    successfulInvestments: number;
  };
  currentActivity: string;
  isOnline: boolean;
  privacyLevel: 'anonymous' | 'partial' | 'verified';
  recentActions: Array<{
    type: 'remix' | 'comment' | 'view' | 'dm';
    ideaId: string;
    timestamp: Date;
    description: string;
  }>;
}

interface VCProfileSystemProps {
  currentLanguage: 'ko' | 'en';
}

const VCProfileSystem: React.FC<VCProfileSystemProps> = ({ currentLanguage }) => {
  const [vcProfiles, setVcProfiles] = useState<VCProfile[]>([
    {
      id: 'vc-1',
      name: '김상현',
      company: currentLanguage === 'ko' ? VC_PROFILES[0].name : VC_PROFILES[0].nameEn,
      companyType: currentLanguage === 'ko' ? VC_PROFILES[0].type : VC_PROFILES[0].typeEn,
      fundSize: currentLanguage === 'ko' ? VC_PROFILES[0].fundSize : VC_PROFILES[0].fundSizeEn,
      position: '심사역',
      specialties: currentLanguage === 'ko' ? VC_PROFILES[0].specialties : VC_PROFILES[0].specialtiesEn,
      avatar: '/api/placeholder/60/60',
      privacyLevel: 'partial',
      stats: {
        remixCount: 12,
        commentCount: 28,
        dmRequests: 3,
        successfulInvestments: 7
      },
      currentActivity: '펫테크 아이디어 검토 중',
      isOnline: true,
      recentActions: [
        {
          type: 'remix',
          ideaId: 'idea-123',
          timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
          description: 'AI 반려동물 건강 모니터링 아이디어를 리믹스'
        },
        {
          type: 'comment',
          ideaId: 'idea-124',
          timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
          description: '스마트 펫 피딩 시스템에 코멘트'
        }
      ]
    },
    {
      id: 'vc-2',
      name: 'Anonymous VC',
      company: currentLanguage === 'ko' ? VC_PROFILES[1].name : VC_PROFILES[1].nameEn,
      companyType: currentLanguage === 'ko' ? VC_PROFILES[1].type : VC_PROFILES[1].typeEn,
      fundSize: currentLanguage === 'ko' ? VC_PROFILES[1].fundSize : VC_PROFILES[1].fundSizeEn,
      position: '파트너',
      specialties: currentLanguage === 'ko' ? VC_PROFILES[1].specialties : VC_PROFILES[1].specialtiesEn,
      avatar: '/api/placeholder/60/60',
      privacyLevel: 'anonymous',
      stats: {
        remixCount: 8,
        commentCount: 19,
        dmRequests: 5,
        successfulInvestments: 12
      },
      currentActivity: 'AI 기반 투자 아이디어 분석 중',
      isOnline: true,
      recentActions: [
        {
          type: 'dm',
          ideaId: 'idea-125',
          timestamp: new Date(Date.now() - 25 * 1000), // 25 seconds ago
          description: 'DeFi 프로토콜 창업자에게 DM 요청'
        }
      ]
    },
    {
      id: 'vc-3',
      name: '박지현',
      company: currentLanguage === 'ko' ? VC_PROFILES[2].name : VC_PROFILES[2].nameEn,
      companyType: currentLanguage === 'ko' ? VC_PROFILES[2].type : VC_PROFILES[2].typeEn,
      fundSize: currentLanguage === 'ko' ? VC_PROFILES[2].fundSize : VC_PROFILES[2].fundSizeEn,
      position: '대표',
      specialties: currentLanguage === 'ko' ? VC_PROFILES[2].specialties : VC_PROFILES[2].specialtiesEn,
      avatar: '/api/placeholder/60/60',
      privacyLevel: 'verified',
      stats: {
        remixCount: 15,
        commentCount: 32,
        dmRequests: 8,
        successfulInvestments: 18
      },
      currentActivity: '로보틱스 솔루션 평가 중',
      isOnline: false,
      recentActions: [
        {
          type: 'view',
          ideaId: 'idea-126',
          timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
          description: '자율주행 배송 로봇 아이디어 검토'
        }
      ]
    }
  ]);

  const [liveViewers, setLiveViewers] = useState<{ [key: string]: number }>({});

  const text = {
    ko: {
      title: '💼 초대받은 VC 프로필',
      subtitle: '주인장이 직접 선별한 투자자들이 실시간으로 아이디어를 검토합니다',
      online: '온라인',
      offline: '오프라인',
      specialty: '전문 분야',
      currentActivity: '현재 활동',
      recentActions: '최근 활동',
      sendDM: 'DM 보내기',
      viewProfile: '프로필 보기',
      fundType: '펀드 유형',
      anonymousName: '익명 투자자',
      liveActivity: '실시간 활동',
      invitationOnly: '초대 전용',
      exclusiveAccess: '독점 접근'
    },
    en: {
      title: '💼 Invited VC Profiles',
      subtitle: 'Personally selected investors reviewing ideas in real-time',
      online: 'Online',
      offline: 'Offline',
      specialty: 'Specialties',
      currentActivity: 'Current Activity',
      recentActions: 'Recent Actions',
      sendDM: 'Send DM',
      viewProfile: 'View Profile',
      fundType: 'Fund Type',
      anonymousName: 'Anonymous Investor',
      liveActivity: 'Live Activity',
      invitationOnly: 'Invitation Only',
      exclusiveAccess: 'Exclusive Access'
    }
  };

  const getDisplayName = (vc: VCProfile) => {
    if (vc.privacyLevel === 'anonymous') {
      return text[currentLanguage].anonymousName;
    }
    return vc.name;
  };

  const getDisplayCompany = (vc: VCProfile) => {
    switch (vc.privacyLevel) {
      case 'anonymous':
        return vc.companyType;
      case 'partial':
        const words = vc.company.split(' ');
        return words.map(word => 
          word.length > 3 ? word.charAt(0) + '***' : word
        ).join(' ');
      case 'verified':
        return vc.company;
      default:
        return vc.companyType;
    }
  };

  // Simulate live viewing activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => {
        const newViewers = { ...prev };
        vcProfiles.forEach(vc => {
          newViewers[vc.id] = Math.floor(Math.random() * 5) + 1;
        });
        return newViewers;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [vcProfiles]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'remix': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'view': return <Eye className="w-4 h-4 text-purple-500" />;
      case 'dm': return <Heart className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Invitation Emphasis */}
      <div className="text-center mb-10">
        <div className="flex justify-center items-center space-x-3 mb-6">
          <Crown className="w-8 h-8 text-purple-600" />
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-lg">
            <Lock className="w-4 h-4 mr-2" />
            {text[currentLanguage].invitationOnly}
          </Badge>
        </div>
        
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          {text[currentLanguage].title}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Exclusivity Notice */}
      <div className="max-w-md mx-auto mb-8">
        <VCInvitationExclusivity currentLanguage={currentLanguage} compact />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {vcProfiles.map(vc => (
          <Card key={vc.id} className="group relative overflow-hidden bg-white border-2 border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-purple-200">
            {/* Invitation Badge */}
            <div className="absolute -top-2 -right-2 z-10">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                INVITED
              </Badge>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16 ring-2 ring-purple-100 group-hover:ring-purple-200 transition-all">
                      <AvatarImage src={vc.avatar} alt={getDisplayName(vc)} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-lg">
                        {getDisplayName(vc).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {vc.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-3 border-white rounded-full animate-pulse shadow-lg">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                      {getDisplayName(vc)}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <Building2 className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{getDisplayCompany(vc)}</span>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        {vc.position}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Badge className={`${vc.isOnline ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"} font-medium`}>
                  {vc.isOnline ? text[currentLanguage].online : text[currentLanguage].offline}
                </Badge>
              </div>
              
              <VCPrivacyIndicator 
                privacyLevel={vc.privacyLevel} 
                currentLanguage={currentLanguage} 
              />
            </CardHeader>

            <CardContent className="relative z-10 space-y-5">
              {/* Fund Type Information */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-3 border border-slate-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-purple-500" />
                  {text[currentLanguage].fundType}
                </h4>
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-medium">
                  {vc.fundSize}
                </Badge>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  {text[currentLanguage].specialty}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vc.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary" className="text-xs bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200 hover:from-purple-100 hover:to-indigo-100 transition-colors">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Current Activity */}
              <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">
                    {text[currentLanguage].currentActivity}
                  </span>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">{vc.currentActivity}</p>
                
                {liveViewers[vc.id] && (
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-600 font-medium">
                      {text[currentLanguage].liveActivity}: {liveViewers[vc.id]}개 아이디어 검토 중
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <VCStatsDisplay stats={vc.stats} currentLanguage={currentLanguage} />

              {/* Recent Actions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  {text[currentLanguage].recentActions}
                </h4>
                <div className="space-y-2">
                  {vc.recentActions.slice(0, 2).map((action, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="p-1 rounded-full bg-white shadow-sm">
                        {getActivityIcon(action.type)}
                      </div>
                      <span className="text-gray-700 flex-1 truncate font-medium">{action.description}</span>
                      <SmartTimeIndicator 
                        timestamp={action.timestamp}
                        currentLanguage={currentLanguage}
                        showBadge={false}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {text[currentLanguage].sendDM}
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200">
                  <Eye className="w-4 h-4 mr-2" />
                  {text[currentLanguage].viewProfile}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VCProfileSystem;
