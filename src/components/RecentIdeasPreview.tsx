
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Idea {
  id: string;
  text: string;
  score: number;
  tags: string[];
  likes: number;
  hasLiked: boolean;
  timestamp: Date;
  user_id: string;
}

interface RecentIdeasPreviewProps {
  ideas: Idea[];
  currentLanguage: 'ko' | 'en';
  onLike: (ideaId: string) => void;
  isAuthenticated: boolean;
}

const RecentIdeasPreview: React.FC<RecentIdeasPreviewProps> = ({ 
  ideas, 
  currentLanguage, 
  onLike, 
  isAuthenticated 
}) => {
  const navigate = useNavigate();

  const text = {
    ko: {
      title: '방금 제출된 아이디어들',
      subtitle: '다른 사용자들이 방금 올린 신선한 아이디어를 확인해보세요',
      viewAll: '모든 아이디어 보기',
      timeAgo: '분 전',
      justNow: '방금',
      noIdeas: '아직 제출된 아이디어가 없습니다'
    },
    en: {
      title: 'Just Submitted Ideas',
      subtitle: 'Check out fresh ideas just submitted by other users',
      viewAll: 'View All Ideas',
      timeAgo: 'min ago',
      justNow: 'just now',
      noIdeas: 'No ideas submitted yet'
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    return diffMinutes < 1 ? text[currentLanguage].justNow : `${diffMinutes}${text[currentLanguage].timeAgo}`;
  };

  // Show only the 3 most recent ideas
  const recentIdeas = ideas.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <Badge className="bg-purple-100 text-purple-700">
              실시간 업데이트
            </Badge>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {text[currentLanguage].title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Recent Ideas Cards */}
        {recentIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recentIdeas.map((idea) => (
              <div 
                key={idea.id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {getTimeAgo(idea.timestamp)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {idea.score.toFixed(1)}점
                  </Badge>
                </div>

                {/* Idea Content */}
                <p className="text-gray-800 mb-4 line-clamp-3 leading-relaxed">
                  {idea.text.length > 80 ? `${idea.text.substring(0, 80)}...` : idea.text}
                </p>

                {/* Actions */}
                <div className="flex justify-between items-center">
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
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/explore')}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    자세히 보기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{text[currentLanguage].noIdeas}</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => navigate('/explore')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
          >
            {text[currentLanguage].viewAll}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentIdeasPreview;
