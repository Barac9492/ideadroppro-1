
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Eye, MessageSquare, Heart, TrendingUp, Clock } from 'lucide-react';

interface VCProfile {
  id: string;
  name: string;
  company: string;
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
      company: 'GreenTech Ventures',
      position: '심사역',
      specialties: ['펫테크', 'ESG', '헬스케어'],
      avatar: '/api/placeholder/60/60',
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
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          description: 'AI 반려동물 건강 모니터링 아이디어를 리믹스'
        },
        {
          type: 'comment',
          ideaId: 'idea-124',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          description: '스마트 펫 피딩 시스템에 코멘트'
        }
      ]
    },
    {
      id: 'vc-2',
      name: '이혜진',
      company: 'Innovation Capital',
      position: '파트너',
      specialties: ['핀테크', 'AI/ML', '블록체인'],
      avatar: '/api/placeholder/60/60',
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
          timestamp: new Date(Date.now() - 3 * 60 * 1000),
          description: 'DeFi 프로토콜 창업자에게 DM 요청'
        }
      ]
    }
  ]);

  const [liveViewers, setLiveViewers] = useState<{ [key: string]: number }>({});

  const text = {
    ko: {
      title: '💼 활성 VC 프로필',
      subtitle: '실시간으로 당신의 아이디어를 검토하는 투자자들',
      online: '온라인',
      specialty: '전문 분야',
      currentActivity: '현재 활동',
      recentActions: '최근 활동',
      stats: '실적',
      remixes: '리믹스',
      comments: '코멘트',
      investments: '투자',
      dmRequests: 'DM 요청',
      minutesAgo: '분 전',
      viewingYourIdea: '님이 당신의 아이디어를 보고 있습니다',
      sendDM: 'DM 보내기',
      viewProfile: '프로필 보기'
    },
    en: {
      title: '💼 Active VC Profiles',
      subtitle: 'Investors reviewing your ideas in real-time',
      online: 'Online',
      specialty: 'Specialties',
      currentActivity: 'Current Activity',
      recentActions: 'Recent Actions',
      stats: 'Stats',
      remixes: 'Remixes',
      comments: 'Comments', 
      investments: 'Investments',
      dmRequests: 'DM Requests',
      minutesAgo: 'min ago',
      viewingYourIdea: 'is viewing your idea',
      sendDM: 'Send DM',
      viewProfile: 'View Profile'
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

  const getTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60));
    return `${minutes}${text[currentLanguage].minutesAgo}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {text[currentLanguage].title}
        </h2>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vcProfiles.map(vc => (
          <Card key={vc.id} className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={vc.avatar} alt={vc.name} />
                      <AvatarFallback>{vc.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {vc.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {vc.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{vc.company}</span>
                      <Badge variant="outline" className="text-xs">
                        {vc.position}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {vc.isOnline && (
                  <Badge className="bg-green-100 text-green-700">
                    {text[currentLanguage].online}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Specialties */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  {text[currentLanguage].specialty}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {vc.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Current Activity */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-800">
                    {text[currentLanguage].currentActivity}
                  </span>
                </div>
                <p className="text-sm text-blue-700">{vc.currentActivity}</p>
                
                {liveViewers[vc.id] && (
                  <div className="mt-2 text-xs text-blue-600">
                    💡 {liveViewers[vc.id]}개 아이디어 동시 검토 중
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{vc.stats.remixCount}</div>
                  <div className="text-xs text-gray-600">{text[currentLanguage].remixes}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{vc.stats.commentCount}</div>
                  <div className="text-xs text-gray-600">{text[currentLanguage].comments}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{vc.stats.dmRequests}</div>
                  <div className="text-xs text-gray-600">{text[currentLanguage].dmRequests}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{vc.stats.successfulInvestments}</div>
                  <div className="text-xs text-gray-600">{text[currentLanguage].investments}</div>
                </div>
              </div>

              {/* Recent Actions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  {text[currentLanguage].recentActions}
                </h4>
                <div className="space-y-2">
                  {vc.recentActions.slice(0, 2).map((action, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      {getActivityIcon(action.type)}
                      <span className="text-gray-700 flex-1">{action.description}</span>
                      <span className="text-gray-500 text-xs">
                        {getTimeAgo(action.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  {text[currentLanguage].sendDM}
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
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
