
import React, { useState, useEffect } from 'react';
import UserRemixDashboard from '@/components/UserRemixDashboard';
import TopInfluencersBoard from '@/components/TopInfluencersBoard';
import UserProfile from '@/components/UserProfile';
import UserSettings from '@/components/UserSettings';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Flame, Users, Settings } from 'lucide-react';
import { useInfluenceScore } from '@/hooks/useInfluenceScore';
import { useStreaks } from '@/hooks/useStreaks';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useUserRole } from '@/hooks/useUserRole';
import UnifiedNavigation from '@/components/UnifiedNavigation';

const MyWorkspace = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user } = useAuth();
  const { score, loading: influenceLoading } = useInfluenceScore();
  const { streak, loading: streakLoading } = useStreaks(currentLanguage);
  const { hasParticipated, todayChallenge } = useDailyChallenge(currentLanguage);
  const { isAdmin, loading: roleLoading } = useUserRole();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const text = {
    ko: {
      title: '👤 내 작업실',
      subtitle: '나의 활동, 랭킹, 프로필을 관리하세요',
      tabs: {
        dashboard: '대시보드',
        profile: '프로필',
        settings: '설정'
      },
      influenceScore: '영향력 점수',
      currentStreak: '연속 참여',
      dailyChallenge: '오늘의 도전',
      adminPanel: '관리자 패널'
    },
    en: {
      title: '👤 My Workspace',
      subtitle: 'Manage your activity, ranking, and profile',
      tabs: {
        dashboard: 'Dashboard',
        profile: 'Profile',
        settings: 'Settings'
      },
      influenceScore: 'Influence Score',
      currentStreak: 'Current Streak',
      dailyChallenge: 'Daily Challenge',
      adminPanel: 'Admin Panel'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
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

        {user ? (
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">{text[currentLanguage].tabs.dashboard}</TabsTrigger>
              <TabsTrigger value="profile">{text[currentLanguage].tabs.profile}</TabsTrigger>
              <TabsTrigger value="settings">{text[currentLanguage].tabs.settings}</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold">{text[currentLanguage].influenceScore}</h3>
                  </div>
                  {influenceLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">{score?.total_score?.toFixed(2) || '0.00'}</p>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Flame className="w-6 h-6 text-red-500" />
                    <h3 className="text-lg font-semibold">{text[currentLanguage].currentStreak}</h3>
                  </div>
                  {streakLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">{streak?.current_streak || 0}</p>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Users className="w-6 h-6 text-blue-500" />
                    <h3 className="text-lg font-semibold">{text[currentLanguage].dailyChallenge}</h3>
                  </div>
                  <p className="text-gray-800">{hasParticipated ? '참여 완료!' : '미션 참여하고 보상받기!'}</p>
                </div>

                {/* Conditionally render Admin Panel card */}
                {!roleLoading && isAdmin && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Settings className="w-6 h-6 text-gray-500" />
                      <h3 className="text-lg font-semibold">{text[currentLanguage].adminPanel}</h3>
                    </div>
                    <p className="text-gray-800">관리자 권한으로 시스템을 관리합니다.</p>
                  </div>
                )}
              </div>
              <UserRemixDashboard currentLanguage={currentLanguage} />
              <TopInfluencersBoard />
            </TabsContent>

            <TabsContent value="profile" className="space-y-8">
              <UserProfile currentLanguage={currentLanguage} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <UserSettings currentLanguage={currentLanguage} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600">
              {currentLanguage === 'ko' ? '로그인 후 이용해주세요.' : 'Please log in to access this page.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorkspace;
