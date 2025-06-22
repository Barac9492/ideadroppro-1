
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, Zap } from 'lucide-react';

interface LiveParticipantCounterProps {
  currentLanguage: 'ko' | 'en';
}

const LiveParticipantCounter: React.FC<LiveParticipantCounterProps> = ({ currentLanguage }) => {
  const [liveCount, setLiveCount] = useState(156);
  const [recentJoins, setRecentJoins] = useState([
    '김**님이 참여했습니다',
    '이**님이 아이디어를 제출했습니다',
    '박**님이 VC에게 선택받았습니다'
  ]);

  const text = {
    ko: {
      liveNow: '지금 접속 중',
      people: '명',
      justJoined: '방금 참여',
      watching: '명이 지켜보고 있어요'
    },
    en: {
      liveNow: 'Live Now',
      people: 'people',
      justJoined: 'Just Joined',
      watching: 'people watching'
    }
  };

  // Simulate live participant updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(100, prev + change);
      });

      // Rotate recent joins
      if (Math.random() > 0.7) {
        const newJoins = [
          '김**님이 참여했습니다',
          '이**님이 아이디어를 제출했습니다',
          '박**님이 VC에게 선택받았습니다',
          '최**님이 투자 관심을 받았습니다',
          '정**님이 랭킹 1위에 올랐습니다'
        ];
        const randomJoin = newJoins[Math.floor(Math.random() * newJoins.length)];
        setRecentJoins(prev => [randomJoin, ...prev.slice(0, 2)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      {/* Live Counter Badge */}
      <div className="flex justify-center mb-4">
        <Badge className="bg-red-500 text-white px-6 py-3 text-lg font-bold shadow-lg animate-pulse">
          <Eye className="w-5 h-5 mr-2" />
          🔴 {text[currentLanguage].liveNow}: {liveCount.toLocaleString()}{text[currentLanguage].people}
        </Badge>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-200">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Users className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-800">
            실시간 활동
          </span>
        </div>
        
        <div className="space-y-2">
          {recentJoins.map((join, index) => (
            <div 
              key={index} 
              className={`flex items-center space-x-2 text-sm p-2 rounded-lg transition-all duration-500 ${
                index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}
            >
              <Zap className={`w-3 h-3 ${index === 0 ? 'text-green-500' : 'text-gray-400'}`} />
              <span className={index === 0 ? 'text-green-700 font-medium' : 'text-gray-600'}>
                {join}
              </span>
              {index === 0 && (
                <Badge className="bg-green-100 text-green-700 text-xs ml-auto">
                  {text[currentLanguage].justJoined}
                </Badge>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 총 <span className="font-bold text-purple-600">{(liveCount * 3.2).toFixed(0)}</span>{text[currentLanguage].watching}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveParticipantCounter;
