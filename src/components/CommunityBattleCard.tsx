
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Swords, Users, Timer, Trophy, Vote } from 'lucide-react';

interface CommunityBattleCardProps {
  currentLanguage: 'ko' | 'en';
}

const CommunityBattleCard: React.FC<CommunityBattleCardProps> = ({ currentLanguage }) => {
  const [votes, setVotes] = useState({ ideaA: 347, ideaB: 289 });
  const [timeLeft, setTimeLeft] = useState('2시간 35분');
  const [hasVoted, setHasVoted] = useState(false);

  const text = {
    ko: {
      ideaBattle: '아이디어 배틀',
      vs: 'VS',
      vote: '투표하기',
      voted: '투표완료',
      totalVotes: '총 투표수',
      timeLeft: '남은 시간',
      reward: '승자 보상',
      viewBattle: '배틀 보기',
      battleReward: '200 XP',
      ideaA: 'AI 반려동물 건강관리 앱',
      ideaB: '친환경 포장재 구독 서비스',
      authorA: '김창업',
      authorB: '이아이디어'
    },
    en: {
      ideaBattle: 'Idea Battle',
      vs: 'VS',
      vote: 'Vote',
      voted: 'Voted',
      totalVotes: 'Total Votes',
      timeLeft: 'Time Left',
      reward: 'Winner Reward',
      viewBattle: 'View Battle',
      battleReward: '200 XP',
      ideaA: 'AI Pet Health Management App',
      ideaB: 'Eco-friendly Packaging Subscription',
      authorA: 'Kim Startup',
      authorB: 'Lee Idea'
    }
  };

  const totalVotes = votes.ideaA + votes.ideaB;
  const ideaAPercent = (votes.ideaA / totalVotes) * 100;
  const ideaBPercent = (votes.ideaB / totalVotes) * 100;

  const handleVote = (side: 'A' | 'B') => {
    if (hasVoted) return;
    
    setVotes(prev => ({
      ...prev,
      [side === 'A' ? 'ideaA' : 'ideaB']: prev[side === 'A' ? 'ideaA' : 'ideaB'] + 1
    }));
    setHasVoted(true);
  };

  return (
    <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Swords className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{text[currentLanguage].ideaBattle}</span>
          </div>
          <Badge className="bg-red-500 text-white">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Battle Header */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            🥊 {text[currentLanguage].vs} 🥊
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Timer className="w-4 h-4" />
            <span>{text[currentLanguage].timeLeft}: {timeLeft}</span>
          </div>
        </div>

        {/* Ideas */}
        <div className="space-y-3">
          {/* Idea A */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-blue-500 text-white">A</Badge>
              <span className="text-sm text-gray-600">by {text[currentLanguage].authorA}</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              {text[currentLanguage].ideaA}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <Progress value={ideaAPercent} className="h-2 bg-gray-200" />
              </div>
              <div className="text-sm font-bold text-blue-600">
                {votes.ideaA} ({Math.round(ideaAPercent)}%)
              </div>
            </div>
            <Button
              onClick={() => handleVote('A')}
              disabled={hasVoted}
              size="sm"
              className="w-full mt-2 bg-blue-500 hover:bg-blue-600"
            >
              {hasVoted ? text[currentLanguage].voted : text[currentLanguage].vote}
            </Button>
          </div>

          {/* Idea B */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-green-500 text-white">B</Badge>
              <span className="text-sm text-gray-600">by {text[currentLanguage].authorB}</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              {text[currentLanguage].ideaB}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <Progress value={ideaBPercent} className="h-2 bg-gray-200" />
              </div>
              <div className="text-sm font-bold text-green-600">
                {votes.ideaB} ({Math.round(ideaBPercent)}%)
              </div>
            </div>
            <Button
              onClick={() => handleVote('B')}
              disabled={hasVoted}
              size="sm"
              className="w-full mt-2 bg-green-500 hover:bg-green-600"
            >
              {hasVoted ? text[currentLanguage].voted : text[currentLanguage].vote}
            </Button>
          </div>
        </div>

        {/* Battle Stats */}
        <div className="bg-white/60 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-600">{text[currentLanguage].totalVotes}</span>
              </div>
              <div className="text-lg font-bold text-gray-800">{totalVotes.toLocaleString()}</div>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-gray-600">{text[currentLanguage].reward}</span>
              </div>
              <div className="text-lg font-bold text-yellow-600">{text[currentLanguage].battleReward}</div>
            </div>
          </div>
        </div>

        {/* View More Button */}
        <Button variant="outline" className="w-full">
          {text[currentLanguage].viewBattle}
          <Vote className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunityBattleCard;
