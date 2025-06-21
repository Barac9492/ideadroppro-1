
import React, { useState } from 'react';
import Header from '@/components/Header';
import LiveFeedSection from '@/components/LiveFeedSection';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useStreaks } from '@/hooks/useStreaks';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useDailyXP } from '@/hooks/useDailyXP';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ideas, loading, toggleLike } = useIdeas(currentLanguage);
  const { updateStreak } = useStreaks(currentLanguage);
  const { scoreActions } = useInfluenceScore();
  const { updateMissionProgress, awardXP } = useDailyXP();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">아이디어를 불러오는 중...</p>
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
      
      {/* Main Ideas Feed */}
      <LiveFeedSection 
        ideas={ideas}
        currentLanguage={currentLanguage}
        onLike={handleLike}
        isAuthenticated={!!user}
      />
    </div>
  );
};

export default Explore;
