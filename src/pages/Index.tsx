
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import IdeaSubmissionForm from '@/components/IdeaSubmissionForm';
import IdeaCard from '@/components/IdeaCard';
import DailyPromptCard from '@/components/DailyPromptCard';
import WelcomeBanner from '@/components/WelcomeBanner';
import CopyrightNotice from '@/components/CopyrightNotice';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useUserRole } from '@/hooks/useUserRole';
import { useStreaks } from '@/hooks/useStreaks';
import { useIsMobile } from '@/hooks/use-mobile';
import { Trophy, BarChart3, LogIn, ArrowRight } from 'lucide-react';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [ideaFormText, setIdeaFormText] = useState('');
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { ideas, loading: ideasLoading, submitIdea, toggleLike, generateAnalysis, generateGlobalAnalysis, saveFinalVerdict } = useIdeas(currentLanguage);
  const { updateStreak } = useStreaks(currentLanguage);
  const isMobile = useIsMobile();

  // Show welcome banner for new visitors or non-authenticated users
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited || !user) {
      setShowWelcomeBanner(true);
      if (!hasVisited) {
        localStorage.setItem('hasVisited', 'true');
      }
    }
  }, [user]);

  const text = {
    ko: {
      noIdeas: '아직 제출된 아이디어가 없습니다. 첫 번째 아이디어를 공유해보세요!',
      loadingIdeas: '아이디어를 불러오는 중...',
      loginForMoreFeatures: '로그인하면 더 많은 기능을 이용할 수 있습니다',
      latestIdeas: '최신 아이디어',
      viewRanking: '랭킹 보기',
      viewDashboard: '내 대시보드',
      viewAllIdeas: '모든 아이디어 보기',
      loginToStart: '로그인/회원가입',
      loginDescription: '아이디어를 제출하고 AI 분석을 받아보세요',
      popularIdeas: '인기 아이디어 확인',
      myStats: '내 활동 통계 확인'
    },
    en: {
      noIdeas: 'No ideas submitted yet. Be the first to share your innovative idea!',
      loadingIdeas: 'Loading ideas...',
      loginForMoreFeatures: 'Sign in to access more features',
      latestIdeas: 'Latest Ideas',
      viewRanking: 'View Rankings',
      viewDashboard: 'My Dashboard',
      viewAllIdeas: 'View All Ideas',
      loginToStart: 'Sign In / Sign Up',
      loginDescription: 'Submit ideas and get AI analysis',
      popularIdeas: 'Check popular ideas',
      myStats: 'View my activity stats'
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleUsePrompt = (promptText: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIdeaFormText(promptText);
    // Scroll to form
    const formElement = document.querySelector('#idea-submission-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitIdea = async (ideaText: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    await submitIdea(ideaText);
    // Update streak after successful submission
    await updateStreak();
    setIdeaFormText('');
  };

  const handleLike = (ideaId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    toggleLike(ideaId);
  };

  const handleGenerateAnalysis = (ideaId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    return generateAnalysis(ideaId);
  };

  const handleGenerateGlobalAnalysis = (ideaId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    return generateGlobalAnalysis(ideaId);
  };

  // Show loading only while auth state is being determined initially
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show only latest 8 ideas on main page
  const latestIdeas = ideas.slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <main className={`container mx-auto px-4 py-6 md:py-8 max-w-4xl ${isMobile ? 'space-y-6' : 'space-y-8'}`}>
        {/* Welcome Banner for new users */}
        {showWelcomeBanner && (
          <WelcomeBanner currentLanguage={currentLanguage} />
        )}
        
        <DailyPromptCard 
          currentLanguage={currentLanguage}
          onUsePrompt={handleUsePrompt}
        />
        
        {/* Quick Navigation Cards - Always show 2 cards consistently */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6 border border-purple-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => navigate('/ranking')}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-purple-800 mb-1">
                  {text[currentLanguage].viewRanking}
                </h3>
                <p className="text-sm text-purple-600">
                  {text[currentLanguage].popularIdeas}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          
          {user ? (
            <div 
              className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-6 border border-green-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/dashboard')}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-3 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-green-800 mb-1">
                    {text[currentLanguage].viewDashboard}
                  </h3>
                  <p className="text-sm text-green-600">
                    {text[currentLanguage].myStats}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-green-600" />
              </div>
            </div>
          ) : (
            <div 
              className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-6 border border-orange-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
                  <LogIn className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-orange-800 mb-1">
                    {text[currentLanguage].loginToStart}
                  </h3>
                  <p className="text-sm text-orange-600">
                    {text[currentLanguage].loginDescription}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          )}
        </div>
        
        {/* Simplified login encouragement for non-authenticated users */}
        {!user && !showWelcomeBanner && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-purple-100 shadow-sm">
            <p className="text-center text-slate-700 font-medium text-sm">
              💡 {text[currentLanguage].loginForMoreFeatures}
            </p>
          </div>
        )}
        
        {/* Copyright Notice */}
        <CopyrightNotice currentLanguage={currentLanguage} />
        
        <div id="idea-submission-form">
          <IdeaSubmissionForm
            currentLanguage={currentLanguage}
            onSubmit={handleSubmitIdea}
            initialText={ideaFormText}
            isAuthenticated={!!user}
          />
        </div>
        
        {/* Latest Ideas Section with improved styling */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">{text[currentLanguage].latestIdeas}</h2>
              <Button
                variant="outline"
                onClick={() => navigate('/ranking')}
                className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                size="sm"
              >
                {text[currentLanguage].viewAllIdeas}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {ideasLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-slate-500 text-lg">{text[currentLanguage].loadingIdeas}</p>
              </div>
            ) : latestIdeas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💡</div>
                <p className="text-slate-500 text-lg max-w-md mx-auto">{text[currentLanguage].noIdeas}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {latestIdeas.map(idea => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    currentLanguage={currentLanguage}
                    currentUserId={user?.id}
                    onLike={handleLike}
                    onGenerateAnalysis={handleGenerateAnalysis}
                    onGenerateGlobalAnalysis={handleGenerateGlobalAnalysis}
                    onSaveFinalVerdict={saveFinalVerdict}
                    isAdmin={user && roleLoading === false ? isAdmin : false}
                    isAuthenticated={!!user}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
