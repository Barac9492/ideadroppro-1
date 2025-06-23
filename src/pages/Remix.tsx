
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import RemixBattleSystem from '@/components/RemixBattleSystem';
import RemixExplanationSection from '@/components/RemixExplanationSection';
import RemixCommunitySection from '@/components/RemixCommunitySection';
import TopInfluencersBoard from '@/components/TopInfluencersBoard';
import RemixableIdeasSection from '@/components/RemixableIdeasSection';
import UserRemixDashboard from '@/components/UserRemixDashboard';
import RemixCreditSystem from '@/components/RemixCreditSystem';
import RemixOnboardingGuide from '@/components/RemixOnboardingGuide';
import RemixGallery from '@/components/RemixGallery';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Remix = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  useEffect(() => {
    // Show onboarding for first-time visitors
    const hasSeenOnboarding = localStorage.getItem('remix-onboarding-seen');
    if (!hasSeenOnboarding && user) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('remix-onboarding-seen', 'true');
  };

  const text = {
    ko: {
      title: '🧬 리믹스 전장',
      subtitle: '아이디어를 발전시키고 공동 소유권을 획득하세요',
      tabs: {
        remix: '리믹스하기',
        gallery: '리믹스 갤러리',
        dashboard: '내 활동',
        battles: '배틀',
        credits: '크레딧'
      }
    },
    en: {
      title: '🧬 Remix Arena',
      subtitle: 'Evolve ideas and earn co-ownership rights',
      tabs: {
        remix: 'Remix',
        gallery: 'Remix Gallery',
        dashboard: 'My Activity',
        battles: 'Battles',
        credits: 'Credits'
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h1>
          <p className="text-xl text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        {user ? (
          <Tabs defaultValue="remix" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="remix">{text[currentLanguage].tabs.remix}</TabsTrigger>
              <TabsTrigger value="gallery">{text[currentLanguage].tabs.gallery}</TabsTrigger>
              <TabsTrigger value="dashboard">{text[currentLanguage].tabs.dashboard}</TabsTrigger>
              <TabsTrigger value="battles">{text[currentLanguage].tabs.battles}</TabsTrigger>
              <TabsTrigger value="credits">{text[currentLanguage].tabs.credits}</TabsTrigger>
            </TabsList>

            <TabsContent value="remix" className="space-y-8">
              <UserRemixDashboard currentLanguage={currentLanguage} />
              <RemixableIdeasSection currentLanguage={currentLanguage} />
            </TabsContent>

            <TabsContent value="gallery" className="space-y-8">
              <RemixGallery currentLanguage={currentLanguage} />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-8">
              <UserRemixDashboard currentLanguage={currentLanguage} />
              <TopInfluencersBoard />
            </TabsContent>

            <TabsContent value="battles" className="space-y-8">
              <RemixBattleSystem currentLanguage={currentLanguage} />
            </TabsContent>

            <TabsContent value="credits" className="space-y-8">
              <RemixCreditSystem currentLanguage={currentLanguage} userId={user.id} />
            </TabsContent>
          </Tabs>
        ) : (
          // Non-authenticated view
          <div className="space-y-12">
            <RemixGallery currentLanguage={currentLanguage} />
            <RemixBattleSystem currentLanguage={currentLanguage} />
            <div className="mt-16">
              <TopInfluencersBoard />
            </div>
          </div>
        )}
      </div>

      <RemixExplanationSection currentLanguage={currentLanguage} />
      <RemixCommunitySection currentLanguage={currentLanguage} />

      {showOnboarding && (
        <RemixOnboardingGuide
          currentLanguage={currentLanguage}
          onClose={handleCloseOnboarding}
        />
      )}
    </div>
  );
};

export default Remix;
