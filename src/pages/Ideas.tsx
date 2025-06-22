import React, { useState } from 'react';
import SimplifiedHeader from '@/components/SimplifiedHeader';
import AdaptiveNavigation from '@/components/AdaptiveNavigation';
import IdeaCard from '@/components/IdeaCard';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useDailyXP } from '@/hooks/useDailyXP';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Clock, Heart, Zap } from 'lucide-react';

const Ideas = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    ideas, 
    fetchIdeas, 
    toggleLike, 
    generateAnalysis, 
    generateGlobalAnalysis,
    saveFinalVerdict,
    deleteIdea 
  } = useIdeas(currentLanguage);
  const { scoreActions } = useInfluenceScore();
  const { updateMissionProgress, awardXP } = useDailyXP();
  const isMobile = useIsMobile();

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

  const handleGenerateAnalysis = async (ideaId: string) => {
    try {
      await generateAnalysis(ideaId);
      await scoreActions.keywordParticipation();
      updateMissionProgress('vote_participate');
      await awardXP(20, 'AI 분석 생성');
    } catch (error) {
      console.error('Error generating analysis:', error);
    }
  };

  const handleGenerateGlobalAnalysis = async (ideaId: string) => {
    try {
      await generateGlobalAnalysis(ideaId);
      await scoreActions.keywordParticipation();
      await awardXP(50, '글로벌 분석 생성');
    } catch (error) {
      console.error('Error generating global analysis:', error);
    }
  };

  const handleSaveFinalVerdict = async (ideaId: string, verdict: string) => {
    try {
      await saveFinalVerdict(ideaId, verdict);
    } catch (error) {
      console.error('Error saving final verdict:', error);
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    if (window.confirm('정말로 이 아이디어를 삭제하시겠습니까?')) {
      try {
        await deleteIdea(ideaId);
      } catch (error) {
        console.error('Error deleting idea:', error);
      }
    }
  };

  const text = {
    ko: {
      title: '아이디어 탐색',
      subtitle: '다른 사람들의 창의적인 아이디어와 점수를 확인해보세요',
      trending: '인기',
      recent: '최신',
      liked: '좋아요',
      top: '톱 점수',
      noIdeas: '아직 아이디어가 없습니다',
      noIdeasDesc: '첫 번째 아이디어를 제출해보세요!',
      addIdea: '아이디어 추가',
      totalIdeas: '전체',
      highScore: '고득점'
    },
    en: {
      title: 'Explore Ideas',
      subtitle: 'Discover creative ideas and scores from others',
      trending: 'Trending',
      recent: 'Recent',
      liked: 'Liked',
      top: 'Top Scores',
      noIdeas: 'No ideas yet',
      noIdeasDesc: 'Be the first to submit an idea!',
      addIdea: 'Add Idea',
      totalIdeas: 'All',
      highScore: 'High Score'
    }
  };

  // Sort ideas by different criteria
  const sortedIdeas = {
    recent: [...ideas].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    trending: [...ideas].sort((a, b) => b.likes - a.likes),
    top: [...ideas].sort((a, b) => b.score - a.score),
    liked: ideas.filter(idea => idea.hasLiked)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
      <SimplifiedHeader 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      {/* Desktop navigation at top */}
      {!isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="top"
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {text[currentLanguage].title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {text[currentLanguage].subtitle}
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{ideas.length}</div>
              <div className="text-sm text-gray-500">{text[currentLanguage].totalIdeas}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {ideas.filter(idea => idea.score >= 8).length}
              </div>
              <div className="text-sm text-gray-500">{text[currentLanguage].highScore}</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="recent" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="recent" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{text[currentLanguage].recent}</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>{text[currentLanguage].trending}</span>
            </TabsTrigger>
            <TabsTrigger value="top" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>{text[currentLanguage].top}</span>
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>{text[currentLanguage].liked}</span>
            </TabsTrigger>
          </TabsList>

          {/* Ideas List */}
          {Object.entries(sortedIdeas).map(([key, ideaList]) => (
            <TabsContent key={key} value={key} className="mt-6">
              {ideaList.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {text[currentLanguage].noIdeas}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {text[currentLanguage].noIdeasDesc}
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {text[currentLanguage].addIdea}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {ideaList.map((idea) => (
                    <IdeaCard
                      key={`${idea.id}-${idea.timestamp.getTime()}`}
                      idea={idea}
                      currentLanguage={currentLanguage}
                      currentUserId={user?.id}
                      onLike={handleLike}
                      onGenerateAnalysis={handleGenerateAnalysis}
                      onGenerateGlobalAnalysis={handleGenerateGlobalAnalysis}
                      onSaveFinalVerdict={handleSaveFinalVerdict}
                      onDelete={handleDeleteIdea}
                      isAuthenticated={!!user}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Mobile navigation at bottom */}
      {isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="bottom"
        />
      )}
    </div>
  );
};

export default Ideas;
