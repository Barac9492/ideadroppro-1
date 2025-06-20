
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Swords, Trophy, Users, Zap, Timer } from 'lucide-react';

interface RemixBattle {
  id: string;
  originalIdea: {
    id: string;
    text: string;
    author: string;
    score: number;
  };
  remixes: Array<{
    id: string;
    text: string;
    author: string;
    votes: number;
    equityShare: number;
  }>;
  status: 'active' | 'voting' | 'ended';
  timeRemaining: string;
  totalVotes: number;
  goldenTicketWinner?: string;
}

interface RemixBattleSystemProps {
  currentLanguage: 'ko' | 'en';
}

const RemixBattleSystem: React.FC<RemixBattleSystemProps> = ({ currentLanguage }) => {
  const [activeBattles, setActiveBattles] = useState<RemixBattle[]>([
    {
      id: 'battle-1',
      originalIdea: {
        id: 'idea-original',
        text: 'AI 기반 반려동물 건강 모니터링 앱',
        author: 'pet_lover_kim',
        score: 8.5
      },
      remixes: [
        {
          id: 'remix-1',
          text: 'AI + IoT 목걸이로 24시간 심박수/체온 실시간 추적',
          author: 'tech_innovator',
          votes: 23,
          equityShare: 35
        },
        {
          id: 'remix-2', 
          text: '수의사 직접 연결 + 응급상황 자동 병원 예약',
          author: 'vet_connector',
          votes: 18,
          equityShare: 30
        },
        {
          id: 'remix-3',
          text: '반려동물 보험 연동 + 예방진료 할인 시스템',
          author: 'fintech_master',
          votes: 15,
          equityShare: 25
        }
      ],
      status: 'voting',
      timeRemaining: '2시간 23분',
      totalVotes: 56
    }
  ]);

  const text = {
    ko: {
      title: '🥊 주간 리믹스 배틀',
      subtitle: '원작자 vs 리믹서들의 치열한 경쟁!',
      originalIdea: '원작 아이디어',
      battleRemixes: '배틀 리믹스',
      voteNow: '지금 투표하기',
      equityShare: '지분율',
      goldenTicket: '🎫 골든티켓',
      timeLeft: '남은 시간',
      totalVotes: '총 투표수',
      winnerGets: '승자 혜택'
    },
    en: {
      title: '🥊 Weekly Remix Battle',
      subtitle: 'Fierce competition between original author vs remixers!',
      originalIdea: 'Original Idea',
      battleRemixes: 'Battle Remixes',
      voteNow: 'Vote Now',
      equityShare: 'Equity Share',
      goldenTicket: '🎫 Golden Ticket',
      timeLeft: 'Time Left',
      totalVotes: 'Total Votes',
      winnerGets: 'Winner Gets'
    }
  };

  const handleVote = (remixId: string) => {
    setActiveBattles(prev => 
      prev.map(battle => ({
        ...battle,
        remixes: battle.remixes.map(remix => 
          remix.id === remixId 
            ? { ...remix, votes: remix.votes + 1 }
            : remix
        ),
        totalVotes: battle.totalVotes + 1
      }))
    );
  };

  const getLeaderRemix = (battle: RemixBattle) => {
    return battle.remixes.reduce((leader, current) => 
      current.votes > leader.votes ? current : leader
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Swords className="w-8 h-8 mr-3 text-red-500" />
          {text[currentLanguage].title}
        </h2>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {activeBattles.map((battle) => {
        const leader = getLeaderRemix(battle);
        
        return (
          <Card key={battle.id} className="border-2 border-red-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-lg">배틀 #{battle.id.split('-')[1]}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Timer className="w-4 h-4 mr-1" />
                      {battle.timeRemaining} {text[currentLanguage].timeLeft}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {battle.totalVotes} {text[currentLanguage].totalVotes}
                    </span>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {text[currentLanguage].goldenTicket}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Original Idea */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  {text[currentLanguage].originalIdea}
                </h4>
                <p className="text-blue-700 mb-2">{battle.originalIdea.text}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600">by @{battle.originalIdea.author}</span>
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    Score: {battle.originalIdea.score}
                  </Badge>
                </div>
              </div>

              {/* Battle Remixes */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Swords className="w-4 h-4 mr-2" />
                  {text[currentLanguage].battleRemixes}
                </h4>
                
                {battle.remixes.map((remix, index) => (
                  <div 
                    key={remix.id} 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      remix.id === leader.id 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="text-gray-800 mb-2">{remix.text}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>by @{remix.author}</span>
                          <Badge className="bg-purple-100 text-purple-700">
                            {remix.equityShare}% {text[currentLanguage].equityShare}
                          </Badge>
                          {remix.id === leader.id && (
                            <Badge className="bg-green-100 text-green-700">
                              🏆 리딩
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center ml-4">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {remix.votes}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVote(remix.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          {text[currentLanguage].voteNow}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Vote Progress */}
                    <div className="mt-3">
                      <Progress 
                        value={(remix.votes / Math.max(battle.totalVotes, 1)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Winner Benefits */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  {text[currentLanguage].winnerGets}
                </h5>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>🎫 GPT 골든티켓 (무제한 AI 평가권)</div>
                  <div>🚀 VC 피드 상단 고정 (1주일)</div>
                  <div>💰 지분 분할 우선권</div>
                  <div>👑 "주간 배틀 챔피언" 배지</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RemixBattleSystem;
