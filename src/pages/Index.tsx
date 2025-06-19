
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import IdeaSubmissionForm from '@/components/IdeaSubmissionForm';
import IdeaCard from '@/components/IdeaCard';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeas } from '@/hooks/useIdeas';
import { useUserRole } from '@/hooks/useUserRole';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { ideas, loading: ideasLoading, submitIdea, toggleLike, generateAnalysis, saveFinalVerdict } = useIdeas(currentLanguage);

  const text = {
    ko: {
      noIdeas: '아직 제출된 아이디어가 없습니다. 첫 번째 아이디어를 공유해보세요!',
      loadingIdeas: '아이디어를 불러오는 중...',
      pleaseSignIn: '아이디어를 제출하려면 로그인이 필요합니다.'
    },
    en: {
      noIdeas: 'No ideas submitted yet. Be the first to share your innovative idea!',
      loadingIdeas: 'Loading ideas...',
      pleaseSignIn: 'Please sign in to submit ideas.'
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <main className="container mx-auto px-4 py-8">
        <IdeaSubmissionForm
          currentLanguage={currentLanguage}
          onSubmit={submitIdea}
        />
        
        <div className="space-y-6">
          {ideasLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">{text[currentLanguage].loadingIdeas}</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{text[currentLanguage].noIdeas}</p>
            </div>
          ) : (
            ideas.map(idea => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                currentLanguage={currentLanguage}
                onLike={toggleLike}
                onGenerateAnalysis={generateAnalysis}
                onSaveFinalVerdict={saveFinalVerdict}
                isAdmin={isAdmin}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
