
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  TrendingUp, 
  Heart, 
  Zap, 
  Star, 
  Crown, 
  Award,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2
} from 'lucide-react';

interface RankingIdea {
  id: string;
  title: string;
  content: string;
  author: string;
  score: number;
  likes: number;
  dislikes: number;
  comments: number;
  tags: string[];
  rank: number;
  trend: 'up' | 'down' | 'same';
  category: 'innovative' | 'profitable' | 'viral' | 'feasible';
}

interface CommunityRankingHubProps {
  currentLanguage: 'ko' | 'en';
  onVote: (ideaId: string, type: 'like' | 'dislike') => void;
  onComment: (ideaId: string) => void;
  onShare: (ideaId: string) => void;
}

const CommunityRankingHub: React.FC<CommunityRankingHubProps> = ({
  currentLanguage,
  onVote,
  onComment,
  onShare
}) => {
  const [rankings, setRankings] = useState<Record<string, RankingIdea[]>>({});
  const [selectedCategory, setSelectedCategory] = useState('innovative');

  const text = {
    ko: {
      title: '커뮤니티 랭킹',
      categories: {
        innovative: '🚀 혁신적인 아이디어',
        profitable: '💰 돈 될 아이디어',
        viral: '🔥 밈 폭발 아이디어',
        feasible: '⚡ 실현 가능한 아이디어'
      },
      weeklyBest: '주간 베스트',
      monthlyTop: '이달의 톱',
      risingStars: '떠오르는 스타',
      vote: '투표',
      comment: '댓글',
      share: '공유',
      rank: '순위',
      author: '작성자',
      vcPick: 'VC 픽',
      trending: '급상승',
      score: '점수'
    },
    en: {
      title: 'Community Rankings',
      categories: {
        innovative: '🚀 Innovative Ideas',
        profitable: '💰 Profitable Ideas',
        viral: '🔥 Viral Ideas',
        feasible: '⚡ Feasible Ideas'
      },
      weeklyBest: 'Weekly Best',
      monthlyTop: 'Monthly Top',
      risingStars: 'Rising Stars',
      vote: 'Vote',
      comment: 'Comment',
      share: 'Share',
      rank: 'Rank',
      author: 'Author',
      vcPick: 'VC Pick',
      trending: 'Trending',
      score: 'Score'
    }
  };

  useEffect(() => {
    // 랭킹 데이터 시뮬레이션
    const generateMockRankings = (category: string): RankingIdea[] => {
      const mockIdeas = [
        {
          title: currentLanguage === 'ko' ? 'AI로 반려동물 감정 읽는 앱' : 'AI Pet Emotion Reading App',
          content: currentLanguage === 'ko' ? 
            '반려동물의 표정과 행동을 AI로 분석해 감정 상태를 알려주는 서비스' :
            'Service that analyzes pet expressions and behavior with AI to determine emotional state',
          author: 'PetLover99',
          likes: 234,
          dislikes: 12,
          comments: 45,
          tags: ['AI', 'Pet', 'Emotion']
        },
        {
          title: currentLanguage === 'ko' ? '빗물 재활용 스마트 화분' : 'Rainwater Recycling Smart Planter',
          content: currentLanguage === 'ko' ? 
            '빗물을 자동 수집하고 정화해서 식물에 공급하는 IoT 화분' :
            'IoT planter that automatically collects and purifies rainwater for plants',
          author: 'EcoWarrior',
          likes: 189,
          dislikes: 8,
          comments: 32,
          tags: ['IoT', 'Environment', 'Smart']
        },
        {
          title: currentLanguage === 'ko' ? '실시간 주차 공유 플랫폼' : 'Real-time Parking Share Platform',
          content: currentLanguage === 'ko' ? 
            '개인 주차공간을 시간별로 대여할 수 있는 매칭 플랫폼' :
            'Matching platform for hourly rental of private parking spaces',
          author: 'UrbanPlanner',
          likes: 156,
          dislikes: 23,
          comments: 28,
          tags: ['Sharing', 'Urban', 'Platform']
        }
      ];

      return mockIdeas.map((idea, index) => ({
        id: `${category}-${index}`,
        ...idea,
        score: Math.floor(Math.random() * 3) + 7,
        rank: index + 1,
        trend: ['up', 'down', 'same'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'same',
        category: category as any
      }));
    };

    const newRankings = {
      innovative: generateMockRankings('innovative'),
      profitable: generateMockRankings('profitable'),
      viral: generateMockRankings('viral'),
      feasible: generateMockRankings('feasible')
    };

    setRankings(newRankings);
  }, [currentLanguage]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Star className="w-5 h-5 text-orange-500" />;
      default: return <span className="text-gray-500 font-semibold">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <div className="w-4 h-4"></div>;
    }
  };

  const handleVote = (ideaId: string, type: 'like' | 'dislike') => {
    onVote(ideaId, type);
    
    // 로컬 상태 업데이트 (실제로는 서버 응답 후 업데이트)
    setRankings(prev => {
      const newRankings = { ...prev };
      Object.keys(newRankings).forEach(category => {
        newRankings[category] = newRankings[category].map(idea => {
          if (idea.id === ideaId) {
            return {
              ...idea,
              likes: type === 'like' ? idea.likes + 1 : idea.likes,
              dislikes: type === 'dislike' ? idea.dislikes + 1 : idea.dislikes
            };
          }
          return idea;
        });
      });
      return newRankings;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <div>
              <h1 className="text-3xl font-bold">{text[currentLanguage].title}</h1>
              <p className="text-purple-100 mt-1">
                {currentLanguage === 'ko' ? '최고의 아이디어들이 경쟁하는 곳' : 'Where the best ideas compete'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리별 랭킹 */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(text[currentLanguage].categories).map(([key, label]) => (
            <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(text[currentLanguage].categories).map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="space-y-4">
              {rankings[category]?.map((idea) => (
                <Card key={idea.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* 순위 */}
                      <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                        {getRankIcon(idea.rank)}
                        {getTrendIcon(idea.trend)}
                      </div>

                      {/* 아이디어 내용 */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                          <div className="flex items-center space-x-2">
                            {idea.score >= 8 && (
                              <Badge className="bg-green-100 text-green-700">
                                {text[currentLanguage].vcPick}
                              </Badge>
                            )}
                            {idea.trend === 'up' && (
                              <Badge className="bg-red-100 text-red-700">
                                {text[currentLanguage].trending}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3 line-clamp-2">{idea.content}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>by {idea.author}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{idea.score}</span>
                            </div>
                          </div>

                          {/* 태그 */}
                          <div className="flex space-x-2">
                            {idea.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* 액션 버튼들 */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(idea.id, 'like')}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>{idea.likes}</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(idea.id, 'dislike')}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <ThumbsDown className="w-4 h-4" />
                              <span>{idea.dislikes}</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onComment(idea.id)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{idea.comments}</span>
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onShare(idea.id)}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CommunityRankingHub;
