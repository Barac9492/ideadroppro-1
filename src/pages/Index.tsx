
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LiveFeedSection from '@/components/LiveFeedSection';
import VCRadarSection from '@/components/VCRadarSection';
import ImpactBoardSection from '@/components/ImpactBoardSection';
import NarrativeSection from '@/components/NarrativeSection';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useStreaks } from '@/hooks/useStreaks';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { ideas, loading: ideasLoading, submitIdea, toggleLike } = useIdeas(currentLanguage);
  const { updateStreak } = useStreaks(currentLanguage);
  const isMobile = useIsMobile();

  // Handle auth state from login redirect
  useEffect(() => {
    const state = location.state as { ideaText?: string } | null;
    if (state?.ideaText && user) {
      // Auto-submit idea after login
      handleIdeaDrop(state.ideaText);
      // Clear state
      navigate('/', { replace: true, state: null });
    }
  }, [user, location.state]);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleIdeaDrop = async (ideaText: string) => {
    if (!user) {
      // Redirect to auth with idea text
      navigate('/auth', { state: { ideaText } });
      return;
    }
    
    try {
      await submitIdea(ideaText);
      await updateStreak();
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
  };

  const handleLike = (ideaId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    toggleLike(ideaId);
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show loading only during initial auth check
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
    <div className="min-h-screen bg-white">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      {/* 1️⃣ Hero Section - Drop First UX */}
      <HeroSection 
        currentLanguage={currentLanguage}
        onIdeaDrop={handleIdeaDrop}
      />
      
      {/* 2️⃣ Live Feed Section - Prove It's Alive */}
      <LiveFeedSection
        ideas={ideas}
        currentLanguage={currentLanguage}
        onLike={handleLike}
        isAuthenticated={!!user}
      />
      
      {/* 3️⃣ VC Radar & GPT Pick - Fake Investment Signals */}
      <VCRadarSection 
        currentLanguage={currentLanguage}
      />
      
      {/* 4️⃣ Impact Board - Competition & Portfolio Building */}
      <ImpactBoardSection 
        currentLanguage={currentLanguage}
      />
      
      {/* 5️⃣ Narrative Section - Emotional Packaging */}
      <NarrativeSection 
        currentLanguage={currentLanguage}
        onDropIdea={scrollToHero}
      />
    </div>
  );
};

export default Index;
