
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimplifiedHeader from '@/components/SimplifiedHeader';
import AdaptiveNavigation from '@/components/AdaptiveNavigation';
import BetaAnnouncementBanner from '@/components/BetaAnnouncementBanner';
import InputModeSelector from '@/components/InputModeSelector';
import SocialProofSection from '@/components/SocialProofSection';
import FinalCTASection from '@/components/FinalCTASection';
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
      
      // Redirect to submit page after successful submission
      navigate('/submit');
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
  };

  const handleModeSelect = (mode: 'simple' | 'builder') => {
    if (mode === 'simple') {
      navigate('/submit');
    } else {
      navigate('/builder');
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
      
      {/* Main Content - Input Mode Selection */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {currentLanguage === 'ko' ? '아이디어를 현실로' : 'Turn Ideas into Reality'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentLanguage === 'ko' 
              ? 'AI가 당신의 아이디어를 분석하고 개선 방향을 제시합니다. 간단한 입력부터 체계적인 모듈 구성까지, 원하는 방식을 선택하세요.'
              : 'AI analyzes your ideas and suggests improvements. Choose from simple input to systematic module composition.'
            }
          </p>
        </div>

        <InputModeSelector
          currentLanguage={currentLanguage}
          onModeSelect={handleModeSelect}
        />
      </div>
      
      {/* Social Proof - Build trust */}
      <SocialProofSection 
        currentLanguage={currentLanguage}
      />
      
      {/* Final CTA - Convert visitors */}
      <FinalCTASection 
        currentLanguage={currentLanguage}
        onDropIdea={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
