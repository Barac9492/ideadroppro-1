
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimplifiedHeader from '@/components/SimplifiedHeader';
import AdaptiveNavigation from '@/components/AdaptiveNavigation';
import BetaAnnouncementBanner from '@/components/BetaAnnouncementBanner';
import SimplifiedLandingHero from '@/components/SimplifiedLandingHero';
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

  const handleIdeaDrop = async (ideaText: string, analysisData?: any) => {
    if (!user) {
      navigate('/auth', { state: { ideaText, analysisData } });
      return;
    }
    
    try {
      // 분석 데이터가 있으면 모듈러 아이디어로, 없으면 기본 아이디어로 제출
      if (analysisData && analysisData.modules) {
        await submitIdea(ideaText, {
          modules: analysisData.modules,
          isModular: true,
          completionScore: 8.5 // AI 대화로 완성된 아이디어는 높은 점수
        });
      } else {
        await submitIdea(ideaText);
      }
      
      await updateStreak();
      await scoreActions.keywordParticipation();
      
      updateMissionProgress('idea_submit');
      await awardXP(analysisData?.modules ? 100 : 50, '아이디어 제출');
      
      // 제출 완료 후 아이디어 목록 페이지로 이동
      navigate('/ideas');
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
      
      {/* 단순화된 메인 히어로 */}
      <SimplifiedLandingHero 
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
