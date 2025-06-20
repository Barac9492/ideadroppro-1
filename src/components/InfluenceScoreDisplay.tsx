
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, TrendingUp, Users, Zap } from 'lucide-react';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';

interface InfluenceScoreDisplayProps {
  variant?: 'compact' | 'detailed';
  showAnimation?: boolean;
}

const InfluenceScoreDisplay: React.FC<InfluenceScoreDisplayProps> = ({ 
  variant = 'compact', 
  showAnimation = true 
}) => {
  const { score, loading } = useInfluenceScore();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }

  if (!score) {
    return (
      <Badge variant="outline" className="text-gray-500">
        <Zap className="w-3 h-3 mr-1" />
        0점
      </Badge>
    );
  }

  const getInfluenceLevel = (totalScore: number) => {
    if (totalScore >= 1000) return { level: 'Master', icon: Crown, color: 'text-yellow-500' };
    if (totalScore >= 500) return { level: 'Expert', icon: TrendingUp, color: 'text-purple-500' };
    if (totalScore >= 200) return { level: 'Pro', icon: Users, color: 'text-blue-500' };
    return { level: 'Rookie', icon: Zap, color: 'text-green-500' };
  };

  const { level, icon: LevelIcon, color } = getInfluenceLevel(score.total_score);

  if (variant === 'compact') {
    return (
      <Badge 
        className={`${color} bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 ${
          showAnimation ? 'hover:scale-105 transition-transform' : ''
        }`}
      >
        <LevelIcon className="w-3 h-3 mr-1" />
        {score.total_score}점
      </Badge>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <LevelIcon className={`w-5 h-5 ${color}`} />
            <div>
              <h3 className="font-semibold text-gray-900">{level} 등급</h3>
              <p className="text-sm text-gray-500">총 영향력 점수</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${color}`}>{score.total_score}</div>
            <div className="text-xs text-gray-500">점</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">이번 주</div>
            <div className="text-lg font-semibold text-blue-600">{score.weekly_score}점</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">이번 달</div>
            <div className="text-lg font-semibold text-purple-600">{score.monthly_score}점</div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          영향력이 높을수록 아이디어가 상단에 노출되고 VC에게 우선 추천됩니다
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluenceScoreDisplay;
