
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Star, Zap, TrendingUp } from 'lucide-react';

interface UserLevelSystemProps {
  currentXP: number;
  currentLanguage: 'ko' | 'en';
}

const UserLevelSystem: React.FC<UserLevelSystemProps> = ({ 
  currentXP = 850, 
  currentLanguage 
}) => {
  const levels = [
    { name: 'Bronze', nameKo: '브론즈', min: 0, max: 500, color: 'from-orange-400 to-yellow-600', icon: '🥉' },
    { name: 'Silver', nameKo: '실버', min: 500, max: 1500, color: 'from-gray-400 to-gray-600', icon: '🥈' },
    { name: 'Gold', nameKo: '골드', min: 1500, max: 3000, color: 'from-yellow-400 to-yellow-600', icon: '🥇' },
    { name: 'Platinum', nameKo: '플래티넘', min: 3000, max: 6000, color: 'from-cyan-400 to-blue-600', icon: '💎' },
    { name: 'Diamond', nameKo: '다이아몬드', min: 6000, max: 10000, color: 'from-purple-400 to-pink-600', icon: '💎' },
    { name: 'Master', nameKo: '마스터', min: 10000, max: Infinity, color: 'from-red-400 to-purple-600', icon: '👑' }
  ];

  const getCurrentLevel = () => {
    return levels.find(level => currentXP >= level.min && currentXP < level.max) || levels[0];
  };

  const getNextLevel = () => {
    const current = getCurrentLevel();
    const currentIndex = levels.indexOf(current);
    return levels[currentIndex + 1] || current;
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressInLevel = currentXP - currentLevel.min;
  const levelRange = currentLevel.max - currentLevel.min;
  const progressPercent = Math.min((progressInLevel / levelRange) * 100, 100);

  const text = {
    ko: {
      level: '레벨',
      xp: 'XP',
      nextLevel: '다음 레벨까지',
      achievements: '업적',
      streakDays: '연속 도전',
      ideasCreated: '아이디어 생성',
      topGrades: '최고 등급',
      communityRank: '커뮤니티 순위'
    },
    en: {
      level: 'Level',
      xp: 'XP',
      nextLevel: 'To Next Level',
      achievements: 'Achievements',
      streakDays: 'Streak Days',
      ideasCreated: 'Ideas Created',
      topGrades: 'Top Grades',
      communityRank: 'Community Rank'
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
      <CardContent className="p-6 space-y-4">
        {/* Level Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center text-2xl`}>
              {currentLevel.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {currentLanguage === 'ko' ? currentLevel.nameKo : currentLevel.name} {text[currentLanguage].level}
              </h3>
              <p className="text-sm text-gray-600">
                {currentXP.toLocaleString()} {text[currentLanguage].xp}
              </p>
            </div>
          </div>
          <Badge className="bg-indigo-100 text-indigo-700">
            <Crown className="w-3 h-3 mr-1" />
            #{Math.floor(Math.random() * 100) + 1}
          </Badge>
        </div>

        {/* Progress to Next Level */}
        {nextLevel !== currentLevel && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{text[currentLanguage].nextLevel}</span>
              <span className="font-medium">
                {(nextLevel.min - currentXP).toLocaleString()} XP
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{currentLevel.min.toLocaleString()}</span>
              <span>{nextLevel.min.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-gray-600">{text[currentLanguage].streakDays}</span>
            </div>
            <div className="text-lg font-bold text-orange-600">7일</div>
          </div>
          
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Star className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600">{text[currentLanguage].ideasCreated}</span>
            </div>
            <div className="text-lg font-bold text-blue-600">23개</div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">{text[currentLanguage].achievements}</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              🔥 첫 A+ 등급
            </Badge>
            <Badge variant="secondary" className="text-xs">
              ⚡ 7일 연속 도전
            </Badge>
            <Badge variant="secondary" className="text-xs">
              🎯 일일 챌린지 완료
            </Badge>
          </div>
        </div>

        {/* Level Benefits */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-3">
          <div className="text-xs font-medium text-purple-700 mb-1">
            {currentLanguage === 'ko' ? currentLevel.nameKo : currentLevel.name} 혜택
          </div>
          <div className="text-xs text-gray-600">
            • AI 분석 우선 처리 • 전용 아이콘 • 커뮤니티 배지
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserLevelSystem;
