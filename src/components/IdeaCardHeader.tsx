
import React from 'react';
import { Star, Clock, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface IdeaCardHeaderProps {
  score: number;
  timestamp: Date;
  isSeed?: boolean;
  currentLanguage: 'ko' | 'en';
}

const IdeaCardHeader: React.FC<IdeaCardHeaderProps> = ({ 
  score, 
  timestamp, 
  isSeed = false, 
  currentLanguage 
}) => {
  const text = {
    ko: {
      score: '점수',
      timeAgo: '전',
      demoIdea: '데모 아이디어'
    },
    en: {
      score: 'Score',
      timeAgo: 'ago',
      demoIdea: 'Demo Idea'
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}${currentLanguage === 'ko' ? '일' : 'd'} ${text[currentLanguage].timeAgo}`;
    if (hours > 0) return `${hours}${currentLanguage === 'ko' ? '시간' : 'h'} ${text[currentLanguage].timeAgo}`;
    return `${minutes}${currentLanguage === 'ko' ? '분' : 'm'} ${text[currentLanguage].timeAgo}`;
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="font-semibold text-gray-700">{score}/10</span>
          <span className="text-sm text-gray-500">{text[currentLanguage].score}</span>
        </div>
        {isSeed && (
          <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Rocket className="h-3 w-3 mr-1" />
            🚀 {text[currentLanguage].demoIdea}
          </Badge>
        )}
      </div>
      <div className="flex items-center space-x-2 text-gray-400 text-sm">
        <Clock className="h-4 w-4" />
        <span>{getTimeAgo(timestamp)}</span>
      </div>
    </div>
  );
};

export default IdeaCardHeader;
