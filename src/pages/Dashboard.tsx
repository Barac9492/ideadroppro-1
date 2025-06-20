
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StreakBadge from '@/components/StreakBadge';
import IdeaCard from '@/components/IdeaCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { User, BarChart3, Heart, Lightbulb, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user, loading: authLoading } = useAuth();
  const { ideas, loading: ideasLoading, toggleLike, generateAnalysis, generateGlobalAnalysis, saveFinalVerdict } = useIdeas(currentLanguage);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const text = {
    ko: {
      title: '내 대시보드',
      subtitle: '나의 아이디어 활동을 확인해보세요',
      myIdeas: '내 아이디어',
      statistics: '통계',
      totalIdeas: '총 아이디어',
      totalHearts: '받은 하트',
      avgScore: '평균 점수',
      topIdea: '최고 아이디어',
      noIdeas: '아직 제출한 아이디어가 없습니다.',
      loadingIdeas: '아이디어를 불러오는 중...',
      submitFirst: '첫 번째 아이디어를 제출해보세요!'
    },
    en: {
      title: 'My Dashboard',
      subtitle: 'Track your idea activity',
      myIdeas: 'My Ideas',
      statistics: 'Statistics',
      totalIdeas: 'Total Ideas',
      totalHearts: 'Hearts Received',
      avgScore: 'Average Score',
      topIdea: 'Top Idea',
      noIdeas: 'No ideas submitted yet.',
      loadingIdeas: 'Loading ideas...',
      submitFirst: 'Submit your first idea!'
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleLike = (ideaId: string) => {
    toggleLike(ideaId);
  };

  const handleGenerateAnalysis = (ideaId: string) => {
    return generateAnalysis(ideaId);
  };

  const handleGenerateGlobalAnalysis = (ideaId: string) => {
    return generateGlobalAnalysis(ideaId);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const myIdeas = ideas.filter(idea => idea.user_id === user.id);
  const totalHearts = myIdeas.reduce((sum, idea) => sum + idea.likes_count, 0);
  const totalScores = myIdeas.filter(idea => idea.analysis?.score).map(idea => idea.analysis!.score!);
  const avgScore = totalScores.length > 0 ? totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length : 0;
  const topIdea = myIdeas.reduce((max, idea) => 
    idea.likes_count > (max?.likes_count || 0) ? idea : max, myIdeas[0]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            {text[currentLanguage].title}
          </h1>
          <p className="text-slate-600 text-lg">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <div className="mb-8">
          <StreakBadge currentLanguage={currentLanguage} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{myIdeas.length}</p>
                  <p className="text-sm text-slate-600">{text[currentLanguage].totalIdeas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalHearts}</p>
                  <p className="text-sm text-slate-600">{text[currentLanguage].totalHearts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{avgScore.toFixed(1)}</p>
                  <p className="text-sm text-slate-600">{text[currentLanguage].avgScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{topIdea?.likes_count || 0}</p>
                  <p className="text-sm text-slate-600">{text[currentLanguage].topIdea}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6" />
              <span>{text[currentLanguage].myIdeas}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {ideasLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">{text[currentLanguage].loadingIdeas}</p>
              </div>
            ) : myIdeas.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">💡</div>
                <p className="text-slate-500 mb-4">{text[currentLanguage].noIdeas}</p>
                <p className="text-slate-400">{text[currentLanguage].submitFirst}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myIdeas.map(idea => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    currentLanguage={currentLanguage}
                    currentUserId={user.id}
                    onLike={handleLike}
                    onGenerateAnalysis={handleGenerateAnalysis}
                    onGenerateGlobalAnalysis={handleGenerateGlobalAnalysis}
                    onSaveFinalVerdict={saveFinalVerdict}
                    isAdmin={false}
                    isAuthenticated={true}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
