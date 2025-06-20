
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import LiveFeedSection from '@/components/LiveFeedSection';
import DailyMissionSection from '@/components/DailyMissionSection';
import VCRadarSection from '@/components/VCRadarSection';
import RemixCommunitySection from '@/components/RemixCommunitySection';
import VCVerificationSection from '@/components/VCVerificationSection';
import ImpactBoardSection from '@/components/ImpactBoardSection';
import SpectatorZone from '@/components/SpectatorZone';
import FinalCTASection from '@/components/FinalCTASection';
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
      
      {/* 1️⃣ Hero Section - 지금 뇌 속 아이디어를 드랍하세요 */}
      <HeroSection 
        currentLanguage={currentLanguage}
        onIdeaDrop={handleIdeaDrop}
      />
      
      {/* 2️⃣ How It Works - 왜 '드랍'이 필요한가? */}
      <HowItWorksSection 
        currentLanguage={currentLanguage}
      />
      
      {/* 3️⃣ Live Feed + Real Use Cases - 진짜가 온다 */}
      <LiveFeedSection
        ideas={ideas}
        currentLanguage={currentLanguage}
        onLike={handleLike}
        isAuthenticated={!!user}
      />
      
      {/* 4️⃣ Daily Mission - 오늘의 GPT 미션 */}
      <DailyMissionSection 
        currentLanguage={currentLanguage}
      />
      
      {/* 5️⃣ VC Radar & GPT Pick - 실제 VC가 선택한 HOT 아이디어 */}
      <VCRadarSection 
        currentLanguage={currentLanguage}
      />
      
      {/* 6️⃣ Remix Community - 커뮤니티와 함께 성장하는 아이디어 */}
      <RemixCommunitySection 
        currentLanguage={currentLanguage}
      />
      
      {/* 7️⃣ VC Verification - VC 인증 마크 강조 */}
      <VCVerificationSection 
        currentLanguage={currentLanguage}
      />
      
      {/* 8️⃣ Impact Board - Competition & Portfolio Building */}
      <ImpactBoardSection 
        currentLanguage={currentLanguage}
      />

      {/* 🎮 Spectator Zone - Fun Just to Watch */}
      <SpectatorZone 
        currentLanguage={currentLanguage}
      />
      
      {/* 9️⃣ Final CTA - 마무리 CTA */}
      <FinalCTASection 
        currentLanguage={currentLanguage}
        onDropIdea={scrollToHero}
      />
    </div>
  );
};

export default Index;
