
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare, Heart, Crown, Zap, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getVCActivityLevel, 
  getRealisticVCCount, 
  getEventFrequencyMs, 
  getTimeBasedEventTypes,
  getCurrentKSTTime 
} from '@/utils/vcBehaviorUtils';
import { useRealIdeaData } from '@/hooks/useRealIdeaData';

interface VCEvent {
  id: string;
  type: 'reading' | 'interested' | 'remixed' | 'dm_request' | 'featured';
  vcName: string;
  vcAvatar: string;
  timestamp: Date;
  ideaId?: string;
  ideaContent?: string;
  message?: string;
  isReal: boolean;
}

interface VCDopamineEventsProps {
  currentLanguage: 'ko' | 'en';
  onXPAwarded?: (amount: number) => void;
}

const VCDopamineEvents: React.FC<VCDopamineEventsProps> = ({
  currentLanguage,
  onXPAwarded
}) => {
  const [liveEvents, setLiveEvents] = useState<VCEvent[]>([]);
  const [vcOnlineCount, setVCOnlineCount] = useState(8);
  const { popularIdeas, recentIdeas, loading } = useRealIdeaData();

  const text = {
    ko: {
      vcReading: '님이 읽는 중',
      vcInterested: '님이 관심 표시',
      vcRemixed: '님이 리믹스',
      vcDmRequest: '님이 DM 요청',
      vcFeatured: '님이 추천',
      liveVC: '실시간 VC',
      justNow: '방금',
      minutesAgo: '분 전',
      vcOnline: '명의 VC 온라인',
      realIdea: '실제 아이디어',
      officeHours: '업무시간 외'
    },
    en: {
      vcReading: 'is reading',
      vcInterested: 'showed interest',
      vcRemixed: 'remixed',
      vcDmRequest: 'requested DM',
      vcFeatured: 'featured',
      liveVC: 'Live VC',
      justNow: 'just now',
      minutesAgo: 'min ago',
      vcOnline: 'VCs online',
      realIdea: 'real idea',
      officeHours: 'outside office hours'
    }
  };

  const mockVCs = [
    { name: 'GreenTech Ventures', avatar: '🌱' },
    { name: 'Innovation Capital', avatar: '⚡' },
    { name: 'Future Fund', avatar: '🚀' },
    { name: 'TechStars Korea', avatar: '⭐' },
    { name: 'Kakao Ventures', avatar: '💬' },
    { name: 'Naver D2SF', avatar: '🔍' },
    { name: 'Samsung Ventures', avatar: '📱' },
    { name: 'LG Technology Ventures', avatar: '🔬' }
  ];

  const generateRealisticEvent = (): VCEvent | null => {
    const activityLevel = getVCActivityLevel();
    
    // Very low chance of events during low activity periods
    if (activityLevel === 'low' && Math.random() < 0.7) {
      return null;
    }

    const vc = mockVCs[Math.floor(Math.random() * mockVCs.length)];
    const timeBasedTypes = getTimeBasedEventTypes();
    const type = timeBasedTypes[Math.floor(Math.random() * timeBasedTypes.length)];
    
    // Decide if this should be a real idea event (70% if we have real ideas)
    const useRealIdea = !loading && (popularIdeas.length > 0 || recentIdeas.length > 0) && Math.random() < 0.7;
    
    let selectedIdea = null;
    if (useRealIdea) {
      // Prefer popular ideas for high-value events
      if ((type === 'featured' || type === 'dm_request') && popularIdeas.length > 0) {
        selectedIdea = popularIdeas[Math.floor(Math.random() * popularIdeas.length)];
      } else if (recentIdeas.length > 0) {
        selectedIdea = recentIdeas[Math.floor(Math.random() * recentIdeas.length)];
      }
    }
    
    const realisticMessages = {
      ko: {
        remixed: ['혁신적인 접근입니다!', '흥미로운 아이디어네요', '시장성이 보입니다', '실현 가능성이 높아요'],
        interested: ['더 자세한 내용이 궁금합니다', '투자 검토해보겠습니다', '미팅 제안드립니다'],
        featured: ['이번 주 추천 아이디어', '파트너사에 소개하겠습니다', 'VC 네트워크에 공유']
      },
      en: {
        remixed: ['Innovative approach!', 'Interesting concept', 'Great market potential', 'Highly feasible'],
        interested: ['Would like to know more', 'Considering investment', 'Meeting proposal'],
        featured: ['This week\'s featured idea', 'Introducing to partners', 'Sharing with VC network']
      }
    };
    
    const messages = realisticMessages[currentLanguage][type as keyof typeof realisticMessages['ko']] || [];
    const message = messages.length > 0 ? messages[Math.floor(Math.random() * messages.length)] : undefined;
    
    return {
      id: Date.now().toString() + Math.random(),
      type,
      vcName: vc.name,
      vcAvatar: vc.avatar,
      timestamp: new Date(),
      ideaId: selectedIdea?.id || 'idea-' + Math.floor(Math.random() * 100),
      ideaContent: selectedIdea?.content,
      message,
      isReal: !!selectedIdea
    };
  };

  const getEventIcon = (type: VCEvent['type']) => {
    switch (type) {
      case 'reading': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'interested': return <Heart className="w-4 h-4 text-red-500" />;
      case 'remixed': return <Zap className="w-4 h-4 text-purple-500" />;
      case 'dm_request': return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'featured': return <Crown className="w-4 h-4 text-yellow-500" />;
      default: return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventText = (event: VCEvent) => {
    const baseText = (() => {
      switch (event.type) {
        case 'reading': return `${event.vcName} ${text[currentLanguage].vcReading}`;
        case 'interested': return `${event.vcName} ${text[currentLanguage].vcInterested}`;
        case 'remixed': return `${event.vcName} ${text[currentLanguage].vcRemixed}`;
        case 'dm_request': return `${event.vcName} ${text[currentLanguage].vcDmRequest}`;
        case 'featured': return `${event.vcName} ${text[currentLanguage].vcFeatured}`;
        default: return event.vcName;
      }
    })();

    return event.isReal ? `${baseText} (${text[currentLanguage].realIdea})` : baseText;
  };

  const getTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60));
    return minutes < 1 ? text[currentLanguage].justNow : `${minutes}${text[currentLanguage].minutesAgo}`;
  };

  const handleEventClick = (event: VCEvent) => {
    if (event.type === 'interested' || event.type === 'featured') {
      onXPAwarded?.(25);
      toast({
        title: '🎉 +25 XP!',
        description: `${event.vcName}의 관심으로 보상을 받았습니다!`,
        duration: 3000,
      });
    }
  };

  const isOfficeHours = () => {
    return getVCActivityLevel() !== 'low';
  };

  useEffect(() => {
    // Set initial realistic VC count
    setVCOnlineCount(getRealisticVCCount());

    // Generate initial events only during active hours
    if (isOfficeHours()) {
      const initialEvents: VCEvent[] = [];
      for (let i = 0; i < 2; i++) {
        const event = generateRealisticEvent();
        if (event) initialEvents.push(event);
      }
      setLiveEvents(initialEvents);
    }

    // Set up realistic event generation
    const scheduleNextEvent = () => {
      const frequency = getEventFrequencyMs();
      
      setTimeout(() => {
        const newEvent = generateRealisticEvent();
        if (newEvent) {
          setLiveEvents(prev => [newEvent, ...prev.slice(0, 4)]);
          
          // Show toast for high-value events
          if (newEvent.type === 'dm_request' || newEvent.type === 'featured') {
            toast({
              title: `🔥 ${newEvent.vcAvatar} ${newEvent.vcName}`,
              description: getEventText(newEvent),
              duration: 4000,
            });
          }
        }
        
        scheduleNextEvent(); // Schedule next event
      }, frequency);
    };

    scheduleNextEvent();

    // Update VC count realistically
    const countInterval = setInterval(() => {
      setVCOnlineCount(getRealisticVCCount());
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      clearInterval(countInterval);
    };
  }, [loading]);

  // Don't show events during very low activity periods
  if (!isOfficeHours() && liveEvents.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <Badge className="bg-gray-100 text-gray-600">
                    {text[currentLanguage].officeHours}
                  </Badge>
                </div>
                <span className="text-sm text-gray-600">
                  {vcOnlineCount} {text[currentLanguage].vcOnline}
                </span>
              </div>
              <Users className="w-5 h-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* VC Online Status */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <Badge className="bg-green-100 text-green-700">
                  {text[currentLanguage].liveVC}
                </Badge>
              </div>
              <span className="text-sm text-green-800">
                {vcOnlineCount} {text[currentLanguage].vcOnline}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                {getVCActivityLevel().toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live VC Events */}
      <div className="space-y-2">
        {liveEvents.map((event) => (
          <Card 
            key={event.id}
            className={`border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${
              event.isReal ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : ''
            }`}
            onClick={() => handleEventClick(event)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{event.vcAvatar}</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      {getEventText(event)}
                      {event.isReal && (
                        <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">
                          실제
                        </Badge>
                      )}
                    </div>
                    {event.ideaContent && (
                      <div className="text-xs text-gray-600 truncate max-w-xs mt-1">
                        "{event.ideaContent.substring(0, 50)}..."
                      </div>
                    )}
                    {event.message && (
                      <div className="text-xs text-gray-600 italic mt-1">
                        "{event.message}"
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getEventIcon(event.type)}
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(event.timestamp)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly VC Picks */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
            <Crown className="w-4 h-4 mr-2" />
            이번 주 VC 추천 아이디어
          </h3>
          <div className="space-y-2">
            {popularIdeas.slice(0, 3).map((idea, index) => (
              <div key={idea.id} className="text-sm text-purple-700">
                {mockVCs[index]?.avatar} {mockVCs[index]?.name}: "{idea.content.substring(0, 30)}..."
              </div>
            ))}
            {popularIdeas.length === 0 && (
              <>
                <div className="text-sm text-purple-700">
                  🌱 GreenTech: "AI 농업 자동화 플랫폼"
                </div>
                <div className="text-sm text-purple-700">
                  ⚡ Innovation Capital: "탄소 중립 블록체인"
                </div>
                <div className="text-sm text-purple-700">
                  🚀 Future Fund: "스마트 에너지 관리"
                </div>
              </>
            )}
          </div>
          <Button 
            size="sm" 
            className="mt-3 bg-purple-600 hover:bg-purple-700 text-white"
          >
            전체 보기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VCDopamineEvents;
