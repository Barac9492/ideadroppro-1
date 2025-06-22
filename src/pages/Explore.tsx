
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import IdeaCard from '@/components/IdeaCard';
import ExampleIdeas from '@/components/ExampleIdeas';
import SuccessJourneyStories from '@/components/SuccessJourneyStories';
import EnhancedRemixExplanation from '@/components/EnhancedRemixExplanation';
import LiveParticipantCounter from '@/components/LiveParticipantCounter';
import { useIdeas } from '@/hooks/useIdeas';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useDailyXP } from '@/hooks/useDailyXP';
import { Button } from '@/components/ui/button';
import { TrendingUp, Filter, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Explore = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'likes'>('recent');
  const [filterSeed, setFilterSeed] = useState<boolean | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ideas, toggleLike, fetchIdeas, loading, generateAnalysis } = useIdeas(currentLanguage);
  const { scoreActions } = useInfluenceScore();
  const { updateMissionProgress, awardXP } = useDailyXP();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleLike = async (ideaId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      await toggleLike(ideaId);
      await scoreActions.ideaLike();
      updateMissionProgress('like_ideas');
      await awardXP(10, '아이디어 좋아요');
    } catch (error) {
      console.error('Error liking idea:', error);
    }
  };

  const handleStartRemix = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/remix');
  };

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const text = {
    ko: {
      title: '아이디어 둘러보기',
      subtitle: '다른 사람들의 혁신적인 아이디어를 확인하고 영감을 받아보세요',
      sortBy: '정렬',
      filterBy: '필터',
      recent: '최신순',
      score: '점수순',
      likes: '인기순',
      allIdeas: '전체',
      userIdeas: '사용자 아이디어',
      seedIdeas: 'AI 시드 아이디어',
      noIdeas: '아직 아이디어가 없습니다',
      loadMore: '더 보기'
    },
    en: {
      title: 'Explore Ideas',
      subtitle: 'Discover innovative ideas from others and get inspired',
      sortBy: 'Sort by',
      filterBy: 'Filter',
      recent: 'Recent',
      score: 'Score',
      likes: 'Popular',
      allIdeas: 'All Ideas',
      userIdeas: 'User Ideas',
      seedIdeas: 'AI Seed Ideas',
      noIdeas: 'No ideas yet',
      loadMore: 'Load More'
    }
  };

  // Filter and sort ideas
  const filteredAndSortedIdeas = ideas
    .filter(idea => {
      if (filterSeed === null) return true;
      return idea.seed === filterSeed;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <LiveParticipantCounter currentLanguage={currentLanguage} />
            <Badge className="bg-blue-100 text-blue-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              실시간 활성화
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {/* Success Stories Section */}
        <SuccessJourneyStories currentLanguage={currentLanguage} />

        {/* Remix Explanation */}
        <div className="mb-12">
          <EnhancedRemixExplanation 
            currentLanguage={currentLanguage}
            onStartRemix={handleStartRemix}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {text[currentLanguage].filterBy}:
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={filterSeed === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSeed(null)}
              >
                {text[currentLanguage].allIdeas}
              </Button>
              <Button
                variant={filterSeed === false ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSeed(false)}
              >
                <Users className="w-3 h-3 mr-1" />
                {text[currentLanguage].userIdeas}
              </Button>
              <Button
                variant={filterSeed === true ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSeed(true)}
              >
                {text[currentLanguage].seedIdeas}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {text[currentLanguage].sortBy}:
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={sortBy === 'recent' ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy('recent')}
              >
                {text[currentLanguage].recent}
              </Button>
              <Button
                variant={sortBy === 'score' ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy('score')}
              >
                {text[currentLanguage].score}
              </Button>
              <Button
                variant={sortBy === 'likes' ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy('likes')}
              >
                {text[currentLanguage].likes}
              </Button>
            </div>
          </div>
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">아이디어를 불러오는 중...</p>
          </div>
        ) : filteredAndSortedIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredAndSortedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onLike={handleLike}
                onGenerateAnalysis={generateAnalysis}
                currentLanguage={currentLanguage}
                isAuthenticated={!!user}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">
              {text[currentLanguage].noIdeas}
            </p>
            <ExampleIdeas currentLanguage={currentLanguage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
