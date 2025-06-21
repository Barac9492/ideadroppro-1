
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Star, Download, Share2 } from 'lucide-react';

interface YearlyAchievementsProps {
  currentLanguage: 'ko' | 'en';
}

const YearlyAchievements: React.FC<YearlyAchievementsProps> = ({ currentLanguage }) => {
  const [yearlyStats, setYearlyStats] = useState({
    totalIdeas: 47,
    totalRemixes: 23,
    bestScore: 9.2,
    vcInteractions: 12,
    streakRecord: 21,
    rank: 'Top 5%',
    badges: [
      { type: 'monthly_winner', emoji: '🏆', name: '월간 챔피언' },
      { type: 'remix_master', emoji: '🧬', name: '리믹스 마스터' },
      { type: 'vc_favorite', emoji: '💼', name: 'VC 관심주' }
    ]
  });

  const text = {
    ko: {
      title: '2025년 나의 아이디어 여정',
      subtitle: 'LinkedIn에 공유할 준비가 되었습니다',
      totalIdeas: '총 아이디어',
      totalRemixes: '리믹스 생성',
      bestScore: '최고 점수',
      vcConnections: 'VC 연결',
      longestStreak: '최장 연속',
      yearRank: '올해 순위',
      downloadCard: '성과 카드 다운로드',
      shareLinkedIn: 'LinkedIn 공유',
      comingSoon: '12월에 공개 예정'
    },
    en: {
      title: 'My 2025 Idea Journey',
      subtitle: 'Ready to share on LinkedIn',
      totalIdeas: 'Ideas Submitted',
      totalRemixes: 'Remixes Created',
      bestScore: 'Highest Score',
      vcConnections: 'VC Connections',
      longestStreak: 'Longest Streak',
      yearRank: 'Year Ranking',
      downloadCard: 'Download Achievement Card',
      shareLinkedIn: 'Share on LinkedIn',
      comingSoon: 'Coming in December'
    }
  };

  const achievements = [
    { label: text[currentLanguage].totalIdeas, value: yearlyStats.totalIdeas, icon: Star, color: 'text-yellow-600' },
    { label: text[currentLanguage].totalRemixes, value: yearlyStats.totalRemixes, icon: Medal, color: 'text-blue-600' },
    { label: text[currentLanguage].bestScore, value: yearlyStats.bestScore, icon: Trophy, color: 'text-purple-600' },
    { label: text[currentLanguage].vcConnections, value: yearlyStats.vcInteractions, icon: Share2, color: 'text-green-600' },
  ];

  return (
    <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Achievement Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`} />
                <div className="text-2xl font-bold text-gray-900">{achievement.value}</div>
                <div className="text-sm text-gray-600">{achievement.label}</div>
              </div>
            );
          })}
        </div>

        {/* Special Badges */}
        <div className="bg-white rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">🏆 올해 획득한 배지</h4>
          <div className="flex flex-wrap gap-2">
            {yearlyStats.badges.map((badge, index) => (
              <Badge key={index} className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-2">
                <span className="mr-2">{badge.emoji}</span>
                {badge.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Year Ranking */}
        <div className="text-center bg-white rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">{yearlyStats.rank}</div>
          <div className="text-gray-600">{text[currentLanguage].yearRank}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3">
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Download className="w-4 h-4 mr-2" />
            {text[currentLanguage].downloadCard}
          </Button>
          <Button variant="outline" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50">
            <Share2 className="w-4 h-4 mr-2" />
            {text[currentLanguage].shareLinkedIn}
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 italic">
          {text[currentLanguage].comingSoon}
        </div>
      </CardContent>
    </Card>
  );
};

export default YearlyAchievements;
