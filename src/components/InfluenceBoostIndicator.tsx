
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp } from 'lucide-react';

interface InfluenceBoostIndicatorProps {
  influenceScore: number;
  compact?: boolean;
}

const InfluenceBoostIndicator: React.FC<InfluenceBoostIndicatorProps> = ({ 
  influenceScore, 
  compact = false 
}) => {
  const getBoostLevel = (score: number) => {
    if (score >= 1000) return { level: 'Master', boost: '+0.5', color: 'text-yellow-500 bg-yellow-50 border-yellow-200' };
    if (score >= 500) return { level: 'Expert', boost: '+0.3', color: 'text-purple-500 bg-purple-50 border-purple-200' };
    if (score >= 200) return { level: 'Pro', boost: '+0.2', color: 'text-blue-500 bg-blue-50 border-blue-200' };
    if (score >= 50) return { level: 'Active', boost: '+0.1', color: 'text-green-500 bg-green-50 border-green-200' };
    return { level: 'Rookie', boost: '+0.0', color: 'text-gray-500 bg-gray-50 border-gray-200' };
  };

  const { level, boost, color } = getBoostLevel(influenceScore);

  if (compact) {
    return (
      <Badge className={`${color} text-xs`}>
        <TrendingUp className="w-3 h-3 mr-1" />
        {boost}
      </Badge>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border ${color}`}>
      <Zap className="w-3 h-3" />
      <span className="text-xs font-medium">
        {level} ({boost}점 보정)
      </span>
    </div>
  );
};

export default InfluenceBoostIndicator;
