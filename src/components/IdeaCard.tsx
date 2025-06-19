
import React, { useState } from 'react';
import { Heart, Star, Clock, Zap, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Idea {
  id: string;
  text: string;
  score: number;
  tags: string[];
  likes: number;
  hasLiked: boolean;
  timestamp: Date;
  aiAnalysis?: string;
  improvements?: string[];
  marketPotential?: string[];
  similarIdeas?: string[];
  pitchPoints?: string[];
}

interface IdeaCardProps {
  idea: Idea;
  currentLanguage: 'ko' | 'en';
  onLike: (ideaId: string) => void;
  onGenerateAnalysis: (ideaId: string) => Promise<void>;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, currentLanguage, onLike, onGenerateAnalysis }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const text = {
    ko: {
      score: '점수',
      likes: '좋아요',
      timeAgo: '전',
      generateAnalysis: 'AI 분석 생성',
      generating: '분석 중...',
      improvements: '개선 피드백',
      marketPotential: '시장 잠재력',
      similarIdeas: '유사 아이디어',
      pitchPoints: '피치덱 포인트'
    },
    en: {
      score: 'Score',
      likes: 'Likes',
      timeAgo: 'ago',
      generateAnalysis: 'Generate AI Analysis',
      generating: 'Generating...',
      improvements: 'Improvement Feedback',
      marketPotential: 'Market Potential',
      similarIdeas: 'Similar Ideas',
      pitchPoints: 'Pitch Points'
    }
  };

  const handleGenerateAnalysis = async () => {
    setIsGenerating(true);
    try {
      await onGenerateAnalysis(idea.id);
    } finally {
      setIsGenerating(false);
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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-gray-700">{idea.score}/10</span>
            <span className="text-sm text-gray-500">{text[currentLanguage].score}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Clock className="h-4 w-4" />
          <span>{getTimeAgo(idea.timestamp)}</span>
        </div>
      </div>

      {/* Idea Text */}
      <p className="text-gray-800 text-lg mb-4 leading-relaxed">{idea.text}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {idea.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* AI Analysis Section */}
      {idea.aiAnalysis && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-gray-800">AI Analysis</span>
          </div>
          <p className="text-gray-700">{idea.aiAnalysis}</p>
        </div>
      )}

      {/* Detailed Analysis Sections */}
      {idea.improvements && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
            {text[currentLanguage].improvements}
          </h4>
          <ul className="space-y-1">
            {idea.improvements.map((improvement, index) => (
              <li key={index} className="text-gray-600 text-sm">• {improvement}</li>
            ))}
          </ul>
        </div>
      )}

      {idea.marketPotential && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
            {text[currentLanguage].marketPotential}
          </h4>
          <ul className="space-y-1">
            {idea.marketPotential.map((point, index) => (
              <li key={index} className="text-gray-600 text-sm">• {point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onLike(idea.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
            idea.hasLiked
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
          }`}
        >
          <Heart className={`h-4 w-4 ${idea.hasLiked ? 'fill-current' : ''}`} />
          <span>{idea.likes} {text[currentLanguage].likes}</span>
        </button>

        {!idea.aiAnalysis && (
          <Button
            onClick={handleGenerateAnalysis}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? text[currentLanguage].generating : text[currentLanguage].generateAnalysis}
          </Button>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;
