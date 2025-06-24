
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import IdeaBuilder from '@/components/IdeaBuilder';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import SimpleTopBar from '@/components/SimpleTopBar';

const Create = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [initialIdea, setInitialIdea] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get initial idea from navigation state
  useEffect(() => {
    if (location.state?.initialIdea) {
      setInitialIdea(location.state.initialIdea);
    }
  }, [location.state]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { initialIdea } });
    }
  }, [user, navigate, initialIdea]);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const text = {
    ko: {
      title: '✨ AI와 함께 아이디어 완성하기',
      subtitle: 'AI가 당신의 아이디어를 완전한 비즈니스 모델로 발전시켜드려요'
    },
    en: {
      title: '✨ Complete Your Idea with AI',
      subtitle: 'AI will transform your idea into a complete business model'
    }
  };

  if (!user) {
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
      <SimpleTopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="pt-20">
        <UnifiedNavigation currentLanguage={currentLanguage} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {text[currentLanguage].title}
            </h1>
            <p className="text-xl text-gray-600">
              {text[currentLanguage].subtitle}
            </p>
          </div>

          {/* Direct IdeaBuilder - no tabs */}
          <IdeaBuilder 
            currentLanguage={currentLanguage}
            initialIdea={initialIdea}
          />
        </div>
      </div>
    </div>
  );
};

export default Create;
