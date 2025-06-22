import React, { useState } from 'react';
import SimplifiedHeader from '@/components/SimplifiedHeader';
import AdaptiveNavigation from '@/components/AdaptiveNavigation';
import DailyChallengeSection from '@/components/DailyChallengeSection';
import HeroSection from '@/components/HeroSection';
import DailyXPDashboard from '@/components/DailyXPDashboard';
import LiveMissionTracker from '@/components/LiveMissionTracker';
import RecentIdeasPreview from '@/components/RecentIdeasPreview';
import InputModeSelector from '@/components/InputModeSelector';
import ProgressiveIdeaBuilder from '@/components/ProgressiveIdeaBuilder';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useStreaks } from '@/hooks/useStreaks';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useDailyXP } from '@/hooks/useDailyXP';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Submit = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [inputMode, setInputMode] = useState<'simple' | 'builder' | 'progressive' | null>(null);
  const [builderIdea, setBuilderIdea] = useState<string>('');
  const [aiAnalysisData, setAiAnalysisData] = useState<any>(null);
  const [showProgressiveBuilder, setShowProgressiveBuilder] = useState(false);
  const [showChallengeSection, setShowChallengeSection] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ideas, submitIdea, toggleLike, fetchIdeas } = useIdeas(currentLanguage);
  const { updateStreak } = useStreaks(currentLanguage);
  const { scoreActions } = useInfluenceScore();
  const { updateMissionProgress, awardXP } = useDailyXP();
  const { markChallengeCompleted, challengeKeyword } = useDailyChallenge(currentLanguage);
  const isMobile = useIsMobile();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleModeSelect = (mode: 'simple' | 'builder') => {
    setInputMode(mode);
    if (mode === 'builder') {
      navigate('/builder');
    }
  };

  const handleIdeaDrop = async (ideaText: string, aiAnalysis?: any) => {
    if (!user) {
      navigate('/auth', { state: { ideaText } });
      return;
    }
    
    // Show progressive builder option with AI analysis data
    setBuilderIdea(ideaText);
    setAiAnalysisData(aiAnalysis);
    setShowProgressiveBuilder(true);
  };

  const handleProgressiveComplete = async (completedIdea: any) => {
    try {
      await submitIdea(completedIdea.originalText, {
        modules: completedIdea.modules,
        isModular: true,
        completionScore: completedIdea.completionScore
      });
      
      await updateStreak();
      await scoreActions.keywordParticipation();
      
      updateMissionProgress('idea_submit');
      await awardXP(completedIdea.completionScore, '완성된 아이디어 제출');

      if (challengeKeyword && completedIdea.originalText.toLowerCase().includes(challengeKeyword.toLowerCase())) {
        await fetchIdeas();
        const userLatestIdea = ideas.find(idea => 
          idea.user_id === user.id && 
          (idea.text.toLowerCase().includes(challengeKeyword.toLowerCase()) ||
           idea.tags?.includes('daily-challenge'))
        );
        
        if (userLatestIdea) {
          await markChallengeCompleted(userLatestIdea.id);
          await awardXP(100, '일일 챌린지 참여');
        }
      }

      navigate('/submission-complete', {
        state: {
          ideaText: completedIdea.originalText,
          aiImage: completedIdea.aiImage,
          completionScore: completedIdea.completionScore,
          modules: completedIdea.modules
        }
      });

      setShowProgressiveBuilder(false);
      setBuilderIdea('');
      setInputMode(null);
    } catch (error) {
      console.error('Error submitting completed idea:', error);
    }
  };

  const handleProgressiveCancel = () => {
    setShowProgressiveBuilder(false);
    setBuilderIdea('');
    setAiAnalysisData(null);
  };

  const handleLike = async (ideaId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      await toggleLike(ideaId);
      await scoreActions.ideaLike();
      updateMissionProgress('like_ideas');
      await awardXP(10, '아이디어 좋아요');
    } catch (error) {
      console.error('Error liking idea:', error);
    }
  };

  const handleJoinChallenge = (keyword: string) => {
    setShowChallengeSection(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleChallenge = () => {
    setShowChallengeSection(!showChallengeSection);
  };

  return (
    <div className="min-h-screen bg-white">
      <SimplifiedHeader 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
        showChallengeButton={!showChallengeSection && !showProgressiveBuilder}
        onChallengeClick={handleToggleChallenge}
      />
      
      {/* Desktop navigation at top */}
      {!isMobile && (
        <AdaptiveNavigation 
          currentLanguage={currentLanguage}
          position="top"
        />
      )}
      
      {/* Progressive Idea Builder Modal */}
      {showProgressiveBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ProgressiveIdeaBuilder
                initialIdea={builderIdea}
                aiAnalysis={aiAnalysisData}
                currentLanguage={currentLanguage}
                onComplete={handleProgressiveComplete}
                onCancel={handleProgressiveCancel}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Mission Status - prominently displayed */}
      {user && !showChallengeSection && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <LiveMissionTracker currentLanguage={currentLanguage} />
            </div>
          </div>
        </div>
      )}
      
      {/* Daily Challenge - Only show when explicitly requested */}
      {showChallengeSection && (
        <div className="relative">
          <Button
            onClick={() => setShowChallengeSection(false)}
            className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-50 text-gray-700 shadow-md rounded-full p-2"
            size="sm"
          >
            <X className="w-4 h-4" />
          </Button>
          <DailyChallengeSection 
            currentLanguage={currentLanguage}
            onJoinChallenge={handleJoinChallenge}
          />
        </div>
      )}
      
      {/* Main Workflow - Clean and focused */}
      {!showChallengeSection && (
        <>
          {/* Input Mode Selection */}
          {inputMode === null && !showProgressiveBuilder && (
            <div className="container mx-auto px-4 py-12">
              <InputModeSelector
                currentLanguage={currentLanguage}
                onModeSelect={handleModeSelect}
              />
            </div>
          )}
          
          {/* Simple Input Mode - Original Hero Section */}
          {inputMode === 'simple' && !showProgressiveBuilder && (
            <HeroSection 
              currentLanguage={currentLanguage}
              onIdeaDrop={handleIdeaDrop}
            />
          )}
          
          {/* Recent Ideas Preview */}
          {!showProgressiveBuilder && (
            <RecentIdeasPreview 
              ideas={ideas}
              currentLanguage={currentLanguage}
              onLike={handleLike}
              isAuthenticated={!!user}
            />
          )}
          
          {/* Progress Dashboard for authenticated users */}
          {user && !showProgressiveBuilder && (
            <div className="bg-gray-50 py-8 mb-20 md:mb-0">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <DailyXPDashboard currentLanguage={currentLanguage} />
                </div>
              </div>
            </div>
          )}
        </>
      )}

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

export default Submit;
