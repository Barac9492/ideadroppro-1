import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import BetaAnnouncementBanner from '@/components/BetaAnnouncementBanner';
import HeroSection from '@/components/HeroSection';
import LiveFeedSection from '@/components/LiveFeedSection';
import RemixExplanationSection from '@/components/RemixExplanationSection';
import RemixCommunitySection from '@/components/RemixCommunitySection';
import VCVerificationSection from '@/components/VCVerificationSection';
import FinalCTASection from '@/components/FinalCTASection';
import SocialProofSection from '@/components/SocialProofSection';
import TopInfluencersBoard from '@/components/TopInfluencersBoard';
import NetworkEffectVisualization from '@/components/NetworkEffectVisualization';
import VCActivitySection from '@/components/VCActivitySection';
import DailyChallengeSection from '@/components/DailyChallengeSection';
import RemixBattleSystem from '@/components/RemixBattleSystem';
import VCProfileSystem from '@/components/VCProfileSystem';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useStreaks } from '@/hooks/useStreaks';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useIsMobile } from '@/hooks/use-mobile';
import DailyXPDashboard from '@/components/DailyXPDashboard';
import VCDopamineEvents from '@/components/VCDopamineEvents';
import IdeaReactionSystem from '@/components/IdeaReactionSystem';
import { useDailyXP } from '@/hooks/useDailyXP';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { ideas, loading: ideasLoading, submitIdea, toggleLike } = useIdeas(currentLanguage);
  const { updateStreak } = useStreaks(currentLanguage);
  const { scoreActions } = useInfluenceScore();
  const isMobile = useIsMobile();
  const { updateMissionProgress, awardXP } = useDailyXP();

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
      
      // Award influence points for idea submission
      await scoreActions.keywordParticipation();
      
      // Update XP missions
      updateMissionProgress('idea_submit');
      await awardXP(50, '아이디어 제출');
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
    
    // Update missions
    updateMissionProgress('vote_participate');
  };

  const handleJoinChallenge = (keyword: string) => {
    // Navigate to hero section with challenge keyword pre-filled
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Could also pre-fill the idea input with the challenge keyword
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
      
      {/* Daily Challenge Section - NEW: Daily Novelty Engine */}
      <DailyChallengeSection 
        currentLanguage={currentLanguage}
        onJoinChallenge={handleJoinChallenge}
      />
      
      {/* Hero Section - Focused submission flow */}
      <HeroSection 
        currentLanguage={currentLanguage}
        onIdeaDrop={handleIdeaDrop}
      />
      
      {/* XP Dashboard for authenticated users */}
      {user && (
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <DailyXPDashboard currentLanguage={currentLanguage} />
            </div>
          </div>
        </div>
      )}
      
      {/* Social Proof - Light persuasion */}
      <SocialProofSection 
        currentLanguage={currentLanguage}
      />

      {/* Remix Battle System - NEW: Gamified Competition */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <RemixBattleSystem currentLanguage={currentLanguage} />
          </div>
        </div>
      </div>

      {/* VC Profile System - NEW: Enhanced VC Interaction */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <VCProfileSystem currentLanguage={currentLanguage} />
          </div>
        </div>
      </div>

      {/* Network Effect Visualization - Real-time activity */}
      <NetworkEffectVisualization currentLanguage={currentLanguage} />

      {/* Top Influencers Board - Gamification */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <TopInfluencersBoard />
          </div>
        </div>
      </div>
      
      {/* Live Feed - Social evidence with section marker */}
      <div data-section="live-feed">
        <LiveFeedSection
          ideas={ideas}
          currentLanguage={currentLanguage}
          onLike={handleLike}
          isAuthenticated={!!user}
        />
      </div>

      {/* VC Activity Section - Show active investor engagement */}
      <VCActivitySection currentLanguage={currentLanguage} />

      {/* VC Dopamine Events - Show real-time VC activity */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <VCDopamineEvents 
              currentLanguage={currentLanguage}
              onXPAwarded={(amount) => awardXP(amount, 'VC 상호작용')}
            />
          </div>
        </div>
      </div>

      {/* Remix Explanation - New section */}
      <RemixExplanationSection currentLanguage={currentLanguage} />
      
      {/* Remix Community - Updated section */}
      <RemixCommunitySection currentLanguage={currentLanguage} />
      
      {/* VC Verification - Trust indicators */}
      <VCVerificationSection 
        currentLanguage={currentLanguage}
      />
      
      {/* Final CTA - Single focused call to action */}
      <FinalCTASection 
        currentLanguage={currentLanguage}
        onDropIdea={scrollToHero}
      />
    </div>
  );
};

export default Index;
