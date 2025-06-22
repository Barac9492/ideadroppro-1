
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimplifiedHeader from '@/components/SimplifiedHeader';
import AdaptiveNavigation from '@/components/AdaptiveNavigation';
import BetaAnnouncementBanner from '@/components/BetaAnnouncementBanner';
import LandingHero from '@/components/LandingHero';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useStreaks } from '@/hooks/useStreaks';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useDailyXP } from '@/hooks/useDailyXP';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { submitIdea } = useIdeas(currentLanguage);
  const { updateStreak } = useStreaks(currentLanguage);
  const { scoreActions } = useInfluenceScore();
  const { updateMissionProgress, awardXP } = useDailyXP();
  const isMobile = useIsMobile();

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
      
      // Redirect to progressive builder for elaboration
      navigate('/submit');
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
  };

  // Handle auth redirect with the custom hook
  useAuthRedirect({ onIdeaDrop: handleIdeaDrop });

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Show loading only during initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
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
      
      {/* Beta Announcement Banner */}
      <BetaAnnouncementBanner currentLanguage={currentLanguage} />
      
      {/* Main Investment-focused Hero */}
      <LandingHero 
        currentLanguage={currentLanguage}
        onIdeaDrop={handleIdeaDrop}
      />
      
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

export default Index;
