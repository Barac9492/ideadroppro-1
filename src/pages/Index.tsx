
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import IdeaSubmissionForm from '@/components/IdeaSubmissionForm';
import IdeaCard from '@/components/IdeaCard';
import DailyPromptCard from '@/components/DailyPromptCard';
import StreakBadge from '@/components/StreakBadge';
import WelcomeBanner from '@/components/WelcomeBanner';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useUserRole } from '@/hooks/useUserRole';
import { useStreaks } from '@/hooks/useStreaks';
import { useIsMobile } from '@/hooks/use-mobile';

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
      pleaseSignIn: '아이디어를 제출하려면 로그인이 필요합니다.',
      loginForMoreFeatures: '💡 로그인하면 아이디어 좋아요, AI 분석 생성 등 더 많은 기능을 사용할 수 있습니다!'
    },
    en: {
      noIdeas: 'No ideas submitted yet. Be the first to share your innovative idea!',
      loadingIdeas: 'Loading ideas...',
      pleaseSignIn: 'Please sign in to submit ideas.',
      loginForMoreFeatures: '💡 Sign in to access more features like liking ideas, generating AI analysis, and more!'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <main className={`container mx-auto px-4 py-6 md:py-8 max-w-4xl ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        {/* Welcome Banner for new users */}
        {showWelcomeBanner && (
          <WelcomeBanner currentLanguage={currentLanguage} />
        )}
        
        <DailyPromptCard 
          currentLanguage={currentLanguage}
          onUsePrompt={handleUsePrompt}
        />
        
        {user && <StreakBadge currentLanguage={currentLanguage} />}
        
        {/* Login encouragement banner for non-authenticated users */}
        {!user && !showWelcomeBanner && (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border border-purple-200 shadow-lg backdrop-blur-sm">
            <p className={`text-center text-purple-800 font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              {text[currentLanguage].loginForMoreFeatures}
            </p>
          </div>
        )}
        
        <div id="idea-submission-form">
          <IdeaSubmissionForm
            currentLanguage={currentLanguage}
            onSubmit={handleSubmitIdea}
            initialText={ideaFormText}
            isAuthenticated={!!user}
          />
        </div>
        
        <div className="space-y-4 md:space-y-6">
          {ideasLoading ? (
            <div className="text-center py-8 md:py-12">
              <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-500 text-base md:text-lg">{text[currentLanguage].loadingIdeas}</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-slate-200">
                <div className="text-6xl md:text-8xl mb-4">💡</div>
                <p className="text-slate-500 text-base md:text-lg">{text[currentLanguage].noIdeas}</p>
              </div>
            </div>
          ) : (
            ideas.map(idea => (
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
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
