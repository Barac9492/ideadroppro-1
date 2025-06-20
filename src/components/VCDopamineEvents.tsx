
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare, Heart, Crown, Zap, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VCEvent {
  id: string;
  type: 'reading' | 'interested' | 'remixed' | 'dm_request' | 'featured';
  vcName: string;
  vcAvatar: string;
  timestamp: Date;
  ideaId?: string;
  message?: string;
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
      vcOnline: '명의 VC 온라인'
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
      vcOnline: 'VCs online'
    }
  };

  const mockVCs = [
    { name: 'GreenTech Ventures', avatar: '🌱' },
    { name: 'Innovation Capital', avatar: '⚡' },
    { name: 'Future Fund', avatar: '🚀' },
    { name: 'TechStars Korea', avatar: '⭐' },
    { name: 'Kakao Ventures', avatar: '💬' }
  ];

  const generateVCEvent = (): VCEvent => {
    const vc = mockVCs[Math.floor(Math.random() * mockVCs.length)];
    const types: VCEvent['type'][] = ['reading', 'interested', 'remixed', 'dm_request', 'featured'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: Date.now().toString() + Math.random(),
      type,
      vcName: vc.name,
      vcAvatar: vc.avatar,
      timestamp: new Date(),
      ideaId: 'idea-' + Math.floor(Math.random() * 100),
      message: type === 'remixed' ? '혁신적인 접근입니다!' : undefined
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
    switch (event.type) {
      case 'reading': return `${event.vcName} ${text[currentLanguage].vcReading}`;
      case 'interested': return `${event.vcName} ${text[currentLanguage].vcInterested}`;
      case 'remixed': return `${event.vcName} ${text[currentLanguage].vcRemixed}`;
      case 'dm_request': return `${event.vcName} ${text[currentLanguage].vcDmRequest}`;
      case 'featured': return `${event.vcName} ${text[currentLanguage].vcFeatured}`;
      default: return event.vcName;
    }
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

  useEffect(() => {
    // Generate initial events
    const initialEvents = Array.from({ length: 3 }, () => generateVCEvent());
    setLiveEvents(initialEvents);

    // Simulate live VC activity
    const eventInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 5 seconds
        const newEvent = generateVCEvent();
        setLiveEvents(prev => [newEvent, ...prev.slice(0, 4)]); // Keep only 5 recent events
        
        // Show toast for high-value events
        if (newEvent.type === 'dm_request' || newEvent.type === 'featured') {
          toast({
            title: `🔥 ${newEvent.vcAvatar} ${newEvent.vcName}`,
            description: getEventText(newEvent),
            duration: 4000,
          });
        }
      }
    }, 5000);

    // Update VC online count
    const countInterval = setInterval(() => {
      setVCOnlineCount(prev => Math.max(5, prev + Math.floor(Math.random() * 3) - 1));
    }, 15000);

    return () => {
      clearInterval(eventInterval);
      clearInterval(countInterval);
    };
  }, []);

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
            <Users className="w-5 h-5 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Live VC Events */}
      <div className="space-y-2">
        {liveEvents.map((event) => (
          <Card 
            key={event.id}
            className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleEventClick(event)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{event.vcAvatar}</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {getEventText(event)}
                    </div>
                    {event.message && (
                      <div className="text-xs text-gray-600 italic">
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
            <div className="text-sm text-purple-700">
              🌱 GreenTech: "AI 농업 자동화 플랫폼"
            </div>
            <div className="text-sm text-purple-700">
              ⚡ Innovation Capital: "탄소 중립 블록체인"
            </div>
            <div className="text-sm text-purple-700">
              🚀 Future Fund: "스마트 에너지 관리"
            </div>
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
