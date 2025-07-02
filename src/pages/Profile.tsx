
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/UserProfile';
import UserRemixDashboard from '@/components/UserRemixDashboard';
import SimpleTopBar from '@/components/SimpleTopBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { user } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // 현재는 자신의 프로필만 볼 수 있도록 구현
  // 나중에 다른 사용자 프로필 조회 기능 추가 가능
  const isOwnProfile = !userId || userId === user?.id;

  const text = {
    ko: {
      title: '프로필',
      backToWorkspace: '내 작업실로 돌아가기',
      notFound: '프로필을 찾을 수 없습니다',
      loginRequired: '로그인이 필요합니다'
    },
    en: {
      title: 'Profile',
      backToWorkspace: 'Back to My Workspace',
      notFound: 'Profile not found',
      loginRequired: 'Please log in to view profiles'
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <SimpleTopBar 
          currentLanguage={currentLanguage}
          onLanguageToggle={handleLanguageToggle}
        />
        
        <div className="pt-20 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {text[currentLanguage].loginRequired}
              </h1>
              <Button onClick={() => navigate('/auth')}>
                {currentLanguage === 'ko' ? '로그인' : 'Login'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <SimpleTopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="pt-20 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/my-workspace')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{text[currentLanguage].backToWorkspace}</span>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h1>
        </div>

        <div className="grid gap-8">
          <UserProfile currentLanguage={currentLanguage} />
          <UserRemixDashboard currentLanguage={currentLanguage} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
