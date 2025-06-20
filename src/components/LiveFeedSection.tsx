import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat, Clock, TrendingUp, Zap, Users } from 'lucide-react';
import { useRemixLeverage } from '@/hooks/useRemixLeverage';
import { useNetworkActivity } from '@/hooks/useNetworkActivity';

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
  remixes?: number;
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
  const [remixingIdea, setRemixingIdea] = useState<string | null>(null);
  const { processRemixLeverage, userRemixStats } = useRemixLeverage({ currentLanguage });
  const { addActivity } = useNetworkActivity({ currentLanguage });

  const text = {
    ko: {
      title: '방금 올라온 아이디어들',
      subtitle: '실시간으로 업데이트되는 혁신적인 아이디어들을 확인하세요',
      timeAgo: '분 전',
      gptComment: 'GPT 코멘트',
      remix: '리믹스',
      viewMore: '더 많은 아이디어 보기',
      liveIndicator: 'LIVE',
      remixThis: '이 아이디어 리믹스하기',
      remixBonus: '+5 Like 보너스',
      discussion: '토론',
      topRemixer: '오늘의 리믹서',
      networkEffect: '네트워크 효과',
      influence: '영향력 점수',
      coOwnership: '공동소유권',
      leverageEarned: '레버리지 획득!'
    },
    en: {
      title: 'Just Dropped Ideas',
      subtitle: 'Check out innovative ideas updated in real-time',
      timeAgo: 'min ago',
      gptComment: 'GPT Comment',
      remix: 'Remix',
      viewMore: 'View More Ideas',
      liveIndicator: 'LIVE',
      remixThis: 'Remix This Idea',
      remixBonus: '+5 Like Bonus',
      discussion: 'Discussion',
      topRemixer: 'Top Remixer Today',
      networkEffect: 'Network Effect',
      influence: 'Influence Score',
      coOwnership: 'Co-ownership',
      leverageEarned: 'Leverage Earned!'
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    return diffMinutes < 1 ? '방금' : `${diffMinutes}${text[currentLanguage].timeAgo}`;
  };

  const handleRemix = async (ideaId: string) => {
    if (!isAuthenticated) return;
    
    setRemixingIdea(ideaId);
    
    try {
      // Simulate remix creation
      const originalIdea = ideas.find(idea => idea.id === ideaId);
      if (!originalIdea) return;
      
      // Mock remix with score improvement
      const scoreImprovement = Math.random() * 4 + 1; // 1-5 points
      
      // Process remix leverage
      await processRemixLeverage(ideaId, `Remix of: ${originalIdea.text}`, scoreImprovement);
      
      // Add network activity
      addActivity({
        type: 'idea_chain',
        actor: 'You',
        action: currentLanguage === 'ko' ? '아이디어를 리믹스했습니다' : 'remixed an idea',
        target_idea_id: ideaId,
        impact_score: Math.floor(scoreImprovement * 5)
      });
      
      // Show leverage earned notification if significant improvement
      if (scoreImprovement >= 3) {
        setTimeout(() => {
          alert(`🎉 ${text[currentLanguage].leverageEarned} +${scoreImprovement.toFixed(1)} ${text[currentLanguage].coOwnership}`);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error creating remix:', error);
    } finally {
      setTimeout(() => {
        setRemixingIdea(null);
      }, 3000);
    }
  };

  // Add remix count to ideas (simulated)
  const enhancedIdeas = ideas.slice(0, 6).map(idea => ({
    ...idea,
    remixes: Math.floor(Math.random() * 20) + 1
  }));

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
            <Badge className="bg-purple-100 text-purple-700">
              <Users className="w-3 h-3 mr-1" />
              {text[currentLanguage].networkEffect}
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Enhanced Top Remixer Spotlight with Leverage Stats */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Repeat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  🏆 {text[currentLanguage].topRemixer}: @creative_minds
                </h3>
                <p className="text-sm text-gray-600">
                  오늘 23개 리믹스 | {text[currentLanguage].influence}: 342점 | {text[currentLanguage].coOwnership}: 12건
                </p>
              </div>
            </div>
            <div className="text-center">
              <Badge className="bg-purple-100 text-purple-700 px-4 py-2 mb-2">
                <Zap className="w-4 h-4 mr-1" />
                리믹스 마스터
              </Badge>
              <div className="text-xs text-gray-500">
                AI 평가권 보유
              </div>
            </div>
          </div>
        </div>

        {/* Ideas Grid with Enhanced Remix Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {enhancedIdeas.map((idea) => (
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
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Score: {idea.score.toFixed(1)}
                  </Badge>
                  {idea.remixes > 10 && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      🔥 Hot
                    </Badge>
                  )}
                </div>
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

              {/* Enhanced Network Stats with Leverage Indicators */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600">네트워크 효과</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-purple-600 font-medium">
                      <Repeat className="w-3 h-3 inline mr-1" />
                      {idea.remixes}개 리믹스
                    </span>
                    <span className="text-blue-600 font-medium">
                      영향력 +{idea.remixes * 5}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-green-600">공동소유권: {Math.floor(idea.remixes / 3)}건</span>
                  <span className="text-orange-600">VC 관심: {Math.floor(idea.remixes / 5)}명</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
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
                    <span className="text-sm">{text[currentLanguage].discussion}</span>
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRemix(idea.id)}
                  disabled={remixingIdea === idea.id}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50 relative"
                >
                  {remixingIdea === idea.id ? (
                    <div className="flex items-center space-x-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                      <span className="text-xs">리믹싱...</span>
                    </div>
                  ) : (
                    <>
                      <Repeat className="w-4 h-4 mr-1" />
                      {text[currentLanguage].remix}
                      <Badge className="bg-green-500 text-white text-xs ml-1 px-1">
                        +Co-Own
                      </Badge>
                    </>
                  )}
                </Button>
              </div>

              {/* Remix Leverage Indicator */}
              {remixingIdea === idea.id && (
                <div className="mt-2 text-center">
                  <Badge className="bg-green-100 text-green-700 animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    레버리지 계산 중...
                  </Badge>
                </div>
              )}
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
