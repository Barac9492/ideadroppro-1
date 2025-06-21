
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import BetaAnnouncementBanner from '@/components/BetaAnnouncementBanner';
import LandingHero from '@/components/LandingHero';
import SocialProofSection from '@/components/SocialProofSection';
import FinalCTASection from '@/components/FinalCTASection';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useStreaks } from '@/hooks/useStreaks';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useDailyXP } from '@/hooks/useDailyXP';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { submitIdea } = useIdeas(currentLanguage);
  const { updateStreak } = useStreaks(currentLanguage);
  const { scoreActions } = useInfluenceScore();
  const { updateMissionProgress, awardXP } = useDailyXP();

  // Handle auth state from login redirect
  useEffect(() => {
    const state = location.state as { ideaText?: string } | null;
    if (state?.ideaText && user) {
      handleIdeaDrop(state.ideaText);
      navigate('/', { replace: true, state: null });
    }
  }, [user, location.state]);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleIdeaDrop = async (ideaText: string) => {
    if (!user) {
      navigate('/auth', { state: { ideaText } });
      return;
    }
    
    try {
      await submitIdea(ideaText);
      await updateStreak();
      await scoreActions.keywordParticipation();
      
      updateMissionProgress('idea_submit');
      await awardXP(50, '아이디어 제출');
      
      // Redirect to submit page after successful submission
      navigate('/submit');
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
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
      
      {/* Beta Announcement Banner */}
      <BetaAnnouncementBanner currentLanguage={currentLanguage} />
      
      {/* Landing Hero - Main conversion focus */}
      <LandingHero 
        currentLanguage={currentLanguage}
        onIdeaDrop={handleIdeaDrop}
      />
      
      {/* Social Proof - Build trust */}
      <SocialProofSection 
        currentLanguage={currentLanguage}
      />
      
      {/* Final CTA - Convert visitors */}
      <FinalCTASection 
        currentLanguage={currentLanguage}
        onDropIdea={scrollToHero}
      />
    </div>
  );
};

export default Index;
