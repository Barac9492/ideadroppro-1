
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Crown, Star, CheckCircle } from 'lucide-react';

interface KoreanSocialProofSectionProps {
  currentLanguage: 'ko' | 'en';
}

const KoreanSocialProofSection: React.FC<KoreanSocialProofSectionProps> = ({ currentLanguage }) => {
  const [liveStats, setLiveStats] = useState({
    todayParticipants: 1247,
    vcViewers: 23,
    successStories: 89
  });

  const text = {
    ko: {
      todayParticipants: '오늘 참여자',
      vcWatching: 'VC들이 지금 보고 있어요',
      successToday: '오늘 성공한 아이디어',
      everyoneJoining: '모두가 참여하고 있습니다',
      dontMissOut: '놓치면 후회하는 기회',
      verified: '검증완료',
      exclusive: '독점공개',
      limited: '한정특가'
    },
    en: {
      todayParticipants: 'Today\'s Participants',
      vcWatching: 'VCs watching now',
      successToday: 'Ideas succeeded today',
      everyoneJoining: 'Everyone is joining',
      dontMissOut: 'Don\'t miss this opportunity',
      verified: 'Verified',
      exclusive: 'Exclusive',
      limited: 'Limited'
    }
  };

  // Simulate live updates for Korean FOMO culture
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        todayParticipants: prev.todayParticipants + Math.floor(Math.random() * 3),
        vcViewers: Math.max(15, prev.vcViewers + (Math.random() > 0.5 ? 1 : -1)),
        successStories: prev.successStories + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Main Social Proof Banner - Korean Style */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 mb-6 text-white shadow-xl">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Users className="w-5 h-5 animate-pulse" />
          <span className="text-lg font-bold">
            지금 <span className="text-2xl text-yellow-300">{liveStats.todayParticipants.toLocaleString()}명</span>이 함께하고 있어요!
          </span>
        </div>
        <p className="text-center text-red-100 text-sm">
          {text[currentLanguage].everyoneJoining} 🚀
        </p>
      </div>

      {/* Live Stats Grid - Korean Authority Appeal */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-blue-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Crown className="w-5 h-5 text-yellow-500 mr-1" />
              <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                {text[currentLanguage].verified}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-blue-600">{liveStats.vcViewers}</div>
            <div className="text-xs text-gray-600">{text[currentLanguage].vcWatching}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-green-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
              <Badge className="bg-green-100 text-green-700 text-xs">
                {text[currentLanguage].exclusive}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-green-600">{liveStats.successStories}</div>
            <div className="text-xs text-gray-600">{text[currentLanguage].successToday}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-purple-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-purple-500 mr-1" />
              <Badge className="bg-purple-100 text-purple-700 text-xs">
                {text[currentLanguage].limited}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-purple-600">TOP 1%</div>
            <div className="text-xs text-gray-600">전문가 선정</div>
          </div>
        </div>
      </div>

      {/* FOMO Banner - Korean Urgency Culture */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 text-white text-center shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="w-5 h-5 animate-bounce" />
          <span className="font-bold">⚡ {text[currentLanguage].dontMissOut} ⚡</span>
        </div>
        <p className="text-sm text-orange-100 mt-2">
          지금 바로 참여하지 않으면 다른 사람에게 기회가 넘어갑니다
        </p>
      </div>
    </div>
  );
};

export default KoreanSocialProofSection;
