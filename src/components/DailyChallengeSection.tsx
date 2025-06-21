
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Clock, Users, Zap, Target } from 'lucide-react';
import {useDailyChallenge} from '@/hooks/useDailyChallenge';

interface DailyChallengeSectionProps {
  currentLanguage: 'ko' | 'en';
  onJoinChallenge: (keyword: string) => void;
}

const DailyChallengeSection: React.FC<DailyChallengeSectionProps> = ({ 
  currentLanguage, 
  onJoinChallenge 
}) => {
  const { 
    todayChallenge, 
    liveParticipants, 
    timeRemaining, 
    hasParticipated, 
    participateInChallenge,
    text 
  } = useDailyChallenge(currentLanguage);

  if (!todayChallenge) return null;

  return (
    <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-2 border-red-200 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Flame className="w-8 h-8 animate-pulse" />
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {text[currentLanguage].urgentChallenge}
                  </CardTitle>
                  <p className="text-red-100">{todayChallenge.theme}</p>
                </div>
              </div>
              <Badge className="bg-white text-red-600 px-4 py-2 text-lg font-bold">
                🏆 +{todayChallenge.reward.xp} XP
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                "{todayChallenge.keyword}"
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                {todayChallenge.description}
              </p>
            </div>

            {/* Live Stats */}
            <div className="flex justify-center items-center space-x-8 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-600">
                    {timeRemaining}
                  </span>
                </div>
                <p className="text-sm text-gray-600">마감까지</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-600">
                    {liveParticipants}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{text[currentLanguage].peopleWorking}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">
                    {todayChallenge.participantCount}
                  </span>
                </div>
                <p className="text-sm text-gray-600">총 참여자</p>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-yellow-50 rounded-xl p-6 mb-6 border border-yellow-200">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                오늘만의 특별 보상
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-yellow-700">+{todayChallenge.reward.xp} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-yellow-700">{todayChallenge.reward.badge}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🚀</span>
                  <span className="text-yellow-700">VC 우선 노출</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              {hasParticipated ? (
                <Badge className="bg-green-100 text-green-700 px-6 py-3 text-lg">
                  ✅ {text[currentLanguage].joined}
                </Badge>
              ) : (
                <Button
                  size="lg"
                  onClick={() => {
                    participateInChallenge();
                    onJoinChallenge(todayChallenge.keyword);
                  }}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-bold shadow-lg transform hover:scale-105 transition-all"
                >
                  <Flame className="w-5 h-5 mr-2" />
                  {text[currentLanguage].joinNow}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyChallengeSection;
