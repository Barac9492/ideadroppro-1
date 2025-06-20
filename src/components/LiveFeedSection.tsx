
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat, Clock, TrendingUp } from 'lucide-react';

interface Idea {
  id: string;
  text: string;
  score: number;
  tags: string[];
  likes: number;
  hasLiked: boolean;
  timestamp: Date;
  aiAnalysis?: string;
  user_id: string;
}

interface LiveFeedSectionProps {
  ideas: Idea[];
  currentLanguage: 'ko' | 'en';
  onLike: (ideaId: string) => void;
  isAuthenticated: boolean;
}

const LiveFeedSection: React.FC<LiveFeedSectionProps> = ({ 
  ideas, 
  currentLanguage, 
  onLike, 
  isAuthenticated 
}) => {
  const text = {
    ko: {
      title: '방금 올라온 아이디어들',
      subtitle: '실시간으로 업데이트되는 혁신적인 아이디어들을 확인하세요',
      timeAgo: '분 전',
      gptComment: 'GPT 코멘트',
      remix: '리믹스',
      viewMore: '더 많은 아이디어 보기',
      liveIndicator: 'LIVE'
    },
    en: {
      title: 'Just Dropped Ideas',
      subtitle: 'Check out innovative ideas updated in real-time',
      timeAgo: 'min ago',
      gptComment: 'GPT Comment',
      remix: 'Remix',
      viewMore: 'View More Ideas',
      liveIndicator: 'LIVE'
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    return diffMinutes < 1 ? '방금' : `${diffMinutes}${text[currentLanguage].timeAgo}`;
  };

  const latestIdeas = ideas.slice(0, 6);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="flex items-center space-x-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>{text[currentLanguage].liveIndicator}</span>
            </div>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {latestIdeas.map((idea) => (
            <div 
              key={idea.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {getTimeAgo(idea.timestamp)}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Score: {idea.score.toFixed(1)}
                </Badge>
              </div>

              {/* Idea Content */}
              <p className="text-gray-800 mb-4 line-clamp-3 leading-relaxed">
                {idea.text}
              </p>

              {/* GPT Analysis Preview */}
              {idea.aiAnalysis && (
                <div className="bg-purple-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-purple-700">
                      {text[currentLanguage].gptComment}
                    </span>
                  </div>
                  <p className="text-sm text-purple-600 line-clamp-2">
                    {idea.aiAnalysis.substring(0, 100)}...
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLike(idea.id)}
                    className="flex items-center space-x-1 hover:bg-red-50"
                  >
                    <Heart 
                      className={`w-4 h-4 ${idea.hasLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                    />
                    <span className="text-sm">{idea.likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">토론</span>
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  <Repeat className="w-4 h-4 mr-1" />
                  {text[currentLanguage].remix}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
          >
            {text[currentLanguage].viewMore}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveFeedSection;
