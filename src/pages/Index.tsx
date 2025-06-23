
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UltraSimpleHero from '@/components/UltraSimpleHero';
import SimpleTopBar from '@/components/SimpleTopBar';
import UnifiedNavigation from '@/components/UnifiedNavigation';
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
      
      // 제출 완료 후 탐색 페이지로 이동
      navigate('/explore');
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
  };

  // Handle auth redirect
  useAuthRedirect({ onIdeaDrop: handleIdeaDrop });

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Show loading only during initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Ultra-simple top bar with beta banner */}
      <SimpleTopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
        showBeta={true}
      />
      
      {/* Add padding for fixed header */}
      <div className="pt-20">
        {/* Ultra-simple hero - this is the main focus */}
        <UltraSimpleHero 
          currentLanguage={currentLanguage}
          onIdeaDrop={handleIdeaDrop}
        />
      </div>
      
      {/* Bottom navigation for mobile, hidden on desktop */}
      <div className={isMobile ? 'block' : 'hidden'}>
        <UnifiedNavigation currentLanguage={currentLanguage} />
      </div>
    </div>
  );
};

export default Index;
