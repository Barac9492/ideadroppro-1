
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UltraSimpleHero from '@/components/UltraSimpleHero';
import SimpleTopBar from '@/components/SimpleTopBar';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import DailyChallengeCard from '@/components/DailyChallengeCard';
import UserLevelSystem from '@/components/UserLevelSystem';
import CommunityBattleCard from '@/components/CommunityBattleCard';
import KoreanSocialProofSection from '@/components/KoreanSocialProofSection';
import NarrativeSection from '@/components/NarrativeSection';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Zap } from 'lucide-react';

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Simple idea drop handler for main page
  const handleIdeaDrop = async (ideaText: string) => {
    // For main page, we don't need to submit to database
    // Just navigate to builder for analysis
    navigate('/builder', { 
      state: { 
        initialIdea: ideaText,
        autoStart: true 
      } 
    });
  };

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

        {/* Social Proof Section */}
        <div className="container mx-auto px-4 py-8">
          <KoreanSocialProofSection currentLanguage={currentLanguage} />
        </div>

        {/* Gamification & Community Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Daily Challenge */}
            <div className="lg:col-span-1">
              <DailyChallengeCard currentLanguage={currentLanguage} />
            </div>

            {/* User Level System */}
            {user && (
              <div className="lg:col-span-1">
                <UserLevelSystem 
                  currentXP={850} 
                  currentLanguage={currentLanguage} 
                />
              </div>
            )}

            {/* Community Battle */}
            <div className="lg:col-span-1">
              <CommunityBattleCard currentLanguage={currentLanguage} />
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">23K</div>
                <div className="text-xs text-gray-600">
                  {currentLanguage === 'ko' ? '이번 달 아이디어' : 'Ideas This Month'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">1.2K</div>
                <div className="text-xs text-gray-600">
                  {currentLanguage === 'ko' ? '오늘 활동 사용자' : 'Active Today'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">87%</div>
                <div className="text-xs text-gray-600">
                  {currentLanguage === 'ko' ? '평균 만족도' : 'Satisfaction Rate'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Narrative Section */}
        <NarrativeSection 
          currentLanguage={currentLanguage}
          onDropIdea={() => handleIdeaDrop('')}
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
