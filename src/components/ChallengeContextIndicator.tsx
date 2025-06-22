
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Flame, Clock } from 'lucide-react';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';

interface ChallengeContextIndicatorProps {
  currentLanguage: 'ko' | 'en';
  onChallengeIdeaSubmit?: (challengeKeyword: string) => void;
}

const ChallengeContextIndicator: React.FC<ChallengeContextIndicatorProps> = ({ 
  currentLanguage,
  onChallengeIdeaSubmit 
}) => {
  const { todayChallenge, hasParticipated, timeRemaining } = useDailyChallenge(currentLanguage);

  const text = {
    ko: {
      activeChallenge: '🔥 활성 챌린지',
      submitForChallenge: '이 테마로 제출하면 챌린지 참여!',
      alreadyParticipated: '이미 참여 완료',
      timeLeft: '남은 시간',
      reward: '보상'
    },
    en: {
      activeChallenge: '🔥 Active Challenge',
      submitForChallenge: 'Submit with this theme to join challenge!',
      alreadyParticipated: 'Already Participated',
      timeLeft: 'Time Left',
      reward: 'Reward'
    }
  };

  if (!todayChallenge || hasParticipated) return null;

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <span className="font-bold text-orange-800">{text[currentLanguage].activeChallenge}</span>
          </div>
          <Badge className="bg-orange-100 text-orange-700 border-orange-300">
            <Clock className="w-3 h-3 mr-1" />
            {timeRemaining}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-gray-800">"{todayChallenge.keyword}"</span>
          </div>
          
          <p className="text-sm text-gray-700 bg-white/50 rounded p-2">
            💡 {text[currentLanguage].submitForChallenge}
          </p>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{todayChallenge.theme}</span>
            <span className="text-green-600 font-medium">
              {text[currentLanguage].reward}: +{todayChallenge.reward.xp} XP + 🏆
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeContextIndicator;
