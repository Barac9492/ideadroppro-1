
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Trophy, Users, Zap, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DailyChallengeCardProps {
  currentLanguage: 'ko' | 'en';
}

const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ currentLanguage }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [participants, setParticipants] = useState(1247);
  const navigate = useNavigate();

  const text = {
    ko: {
      dailyChallenge: '오늘의 아이디어 챌린지',
      theme: '오늘의 주제',
      participants: '참여자',
      reward: 'XP 보상',
      timeLeft: '남은 시간',
      participate: '참여하기',
      todayTheme: 'AI와 지속가능성',
      description: 'AI 기술을 활용해서 환경 문제를 해결하는 창업 아이디어를 제안해보세요',
      bonus: '보너스',
      firstPlace: '1등 500XP',
      participation: '참여 100XP'
    },
    en: {
      dailyChallenge: 'Daily Idea Challenge',
      theme: 'Today\'s Theme',
      participants: 'Participants',
      reward: 'XP Reward',
      timeLeft: 'Time Left',
      participate: 'Participate',
      todayTheme: 'AI & Sustainability',
      description: 'Propose a startup idea that uses AI technology to solve environmental problems',
      bonus: 'Bonus',
      firstPlace: '1st Place 500XP',
      participation: 'Participation 100XP'
    }
  };

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}시간 ${minutes}분`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live participant count
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleParticipate = () => {
    navigate('/create', { 
      state: { 
        initialIdea: '지속가능한 환경을 위한 AI 기반 ',
        challengeMode: true,
        challengeTheme: text[currentLanguage].todayTheme
      } 
    });
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-orange-800">{text[currentLanguage].dailyChallenge}</span>
          </div>
          <Badge className="bg-red-500 text-white animate-pulse">
            HOT
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Challenge Theme */}
        <div className="bg-white/70 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">{text[currentLanguage].theme}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            🌱 {text[currentLanguage].todayTheme}
          </h3>
          <p className="text-sm text-gray-600">
            {text[currentLanguage].description}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/50 rounded-lg p-2">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="w-3 h-3 text-blue-600" />
              <span className="text-xs text-gray-600">{text[currentLanguage].participants}</span>
            </div>
            <div className="text-sm font-bold text-blue-600">{participants.toLocaleString()}</div>
          </div>
          
          <div className="bg-white/50 rounded-lg p-2">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Trophy className="w-3 h-3 text-yellow-600" />
              <span className="text-xs text-gray-600">{text[currentLanguage].reward}</span>
            </div>
            <div className="text-sm font-bold text-yellow-600">100-500</div>
          </div>
          
          <div className="bg-white/50 rounded-lg p-2">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Timer className="w-3 h-3 text-red-600" />
              <span className="text-xs text-gray-600">{text[currentLanguage].timeLeft}</span>
            </div>
            <div className="text-xs font-bold text-red-600">{timeLeft}</div>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3 border border-yellow-200">
          <div className="text-xs font-medium text-gray-700 mb-2">{text[currentLanguage].bonus}</div>
          <div className="flex justify-between text-xs">
            <span className="text-yellow-700">🥇 {text[currentLanguage].firstPlace}</span>
            <span className="text-gray-600">✨ {text[currentLanguage].participation}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>일일 목표 달성률</span>
            <span>73%</span>
          </div>
          <Progress value={73} className="h-2" />
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handleParticipate}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          {text[currentLanguage].participate}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyChallengeCard;
