
import React, { useState } from 'react';
import Header from '@/components/Header';
import DailyChallengeSection from '@/components/DailyChallengeSection';
import HeroSection from '@/components/HeroSection';
import DailyXPDashboard from '@/components/DailyXPDashboard';
import LiveMissionTracker from '@/components/LiveMissionTracker';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useStreaks } from '@/hooks/useStreaks';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useDailyXP } from '@/hooks/useDailyXP';
import { useNavigate } from 'react-router-dom';

const Submit = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { submitIdea } = useIdeas(currentLanguage);
  const { updateStreak } = useStreaks(currentLanguage);
  const { scoreActions } = useInfluenceScore();
  const { updateMissionProgress, awardXP } = useDailyXP();

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
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
  };

  const handleJoinChallenge = (keyword: string) => {
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      {/* Mission Status - prominently displayed */}
      {user && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <LiveMissionTracker currentLanguage={currentLanguage} />
            </div>
          </div>
        </div>
      )}
      
      {/* Daily Challenge - Main focus */}
      <DailyChallengeSection 
        currentLanguage={currentLanguage}
        onJoinChallenge={handleJoinChallenge}
      />
      
      {/* Idea Submission Interface */}
      <HeroSection 
        currentLanguage={currentLanguage}
        onIdeaDrop={handleIdeaDrop}
      />
      
      {/* Progress Dashboard for authenticated users */}
      {user && (
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <DailyXPDashboard currentLanguage={currentLanguage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submit;
