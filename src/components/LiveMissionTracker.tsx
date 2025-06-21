
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Clock, Users, Target } from 'lucide-react';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';

interface LiveMissionTrackerProps {
  currentLanguage: 'ko' | 'en';
}

const LiveMissionTracker: React.FC<LiveMissionTrackerProps> = ({ currentLanguage }) => {
  const { todayChallenge, hasParticipated, liveParticipants, timeRemaining } = useDailyChallenge(currentLanguage);

  const text = {
    ko: {
      todayMission: '오늘의 미션',
      urgent: '긴급',
      completed: '완료',
      inProgress: '진행중',
      timeLeft: '남은 시간',
      competitors: '경쟁자'
    },
    en: {
      todayMission: 'Today\'s Mission',
      urgent: 'Urgent',
      completed: 'Done',
      inProgress: 'Active',
      timeLeft: 'Time Left',
      competitors: 'Competitors'
    }
  };

  if (!todayChallenge) return null;

  return (
    <Card className={`border-2 ${hasParticipated ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Flame className={`w-5 h-5 ${hasParticipated ? 'text-green-500' : 'text-red-500 animate-pulse'}`} />
            <span className="font-semibold text-gray-900">{text[currentLanguage].todayMission}</span>
          </div>
          
          <Badge className={hasParticipated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
            {hasParticipated ? text[currentLanguage].completed : text[currentLanguage].urgent}
          </Badge>
        </div>

        <div className="text-sm text-gray-700 mb-3">
          <strong>"{todayChallenge.keyword}"</strong>
        </div>

        {!hasParticipated && (
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-orange-500" />
              <span className="text-orange-600">{timeRemaining}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-blue-500" />
              <span className="text-blue-600">{liveParticipants} {text[currentLanguage].competitors}</span>
            </div>
          </div>
        )}

        {hasParticipated && (
          <div className="flex items-center space-x-2 text-xs text-green-600">
            <Target className="w-3 h-3" />
            <span>+100 XP 획득 완료</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveMissionTracker;
