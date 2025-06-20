
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Crown, Flame, Target, TrendingUp, Zap } from 'lucide-react';
import { useDailyXP } from '@/hooks/useDailyXP';

interface DailyXPDashboardProps {
  currentLanguage: 'ko' | 'en';
}

const DailyXPDashboard: React.FC<DailyXPDashboardProps> = ({ currentLanguage }) => {
  const { userXP, dailyMissions, loading } = useDailyXP();

  const text = {
    ko: {
      level: '레벨',
      totalXP: '총 경험치',
      dailyXP: '오늘 획득',
      streak: '연속 기록',
      missions: '일일 미션',
      completed: '완료',
      progress: '진행률',
      days: '일',
      nextLevel: '다음 레벨까지'
    },
    en: {
      level: 'Level',
      totalXP: 'Total XP',
      dailyXP: 'Today',
      streak: 'Streak',
      missions: 'Daily Missions',
      completed: 'Completed',
      progress: 'Progress',
      days: 'days',
      nextLevel: 'To next level'
    }
  };

  if (loading || !userXP) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  const nextLevelXP = userXP.level * 100;
  const currentLevelXP = (userXP.level - 1) * 100;
  const progressToNext = ((userXP.total_xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  const completedMissions = dailyMissions.filter(m => m.completed).length;

  return (
    <div className="space-y-4">
      {/* XP Overview */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-800">
                  {text[currentLanguage].level} {userXP.level}
                </div>
                <div className="text-sm text-purple-600">
                  {userXP.total_xp} {text[currentLanguage].totalXP}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {userXP.daily_xp}
                  </div>
                  <div className="text-xs text-blue-500">
                    {text[currentLanguage].dailyXP}
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600 flex items-center">
                    <Flame className="w-4 h-4 mr-1" />
                    {userXP.streak_days}
                  </div>
                  <div className="text-xs text-orange-500">
                    {text[currentLanguage].streak}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {text[currentLanguage].nextLevel}
              </span>
              <span className="text-gray-800 font-medium">
                {nextLevelXP - userXP.total_xp} XP
              </span>
            </div>
            <Progress value={progressToNext} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Daily Missions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              {text[currentLanguage].missions}
            </h3>
            <Badge className="bg-green-100 text-green-700">
              {completedMissions}/{dailyMissions.length} {text[currentLanguage].completed}
            </Badge>
          </div>

          <div className="space-y-3">
            {dailyMissions.map((mission) => (
              <div 
                key={mission.id}
                className={`p-4 rounded-lg border ${
                  mission.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      mission.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {mission.completed ? '✓' : <Zap className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {mission.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {mission.description}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={mission.completed ? 'border-green-300 text-green-700' : ''}
                  >
                    +{mission.xp_reward} XP
                  </Badge>
                </div>

                {!mission.completed && (
                  <div className="ml-9">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {text[currentLanguage].progress}
                      </span>
                      <span className="text-gray-800">
                        {mission.progress}/{mission.target}
                      </span>
                    </div>
                    <Progress 
                      value={(mission.progress / mission.target) * 100} 
                      className="h-1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyXPDashboard;
