
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import AdminPanel from '@/components/AdminPanel';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Admin: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, loading: roleLoading, isAdmin } = useUserRole();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = React.useState<'ko' | 'en'>('ko');

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const text = {
    ko: {
      adminPanel: '관리자 패널',
      accessDenied: '접근 권한이 없습니다',
      loginRequired: '로그인이 필요합니다',
      loginButton: '로그인',
      backToHome: '홈으로 돌아가기',
      loading: '로딩 중...'
    },
    en: {
      adminPanel: 'Admin Panel',
      accessDenied: 'Access Denied',
      loginRequired: 'Login Required',
      loginButton: 'Login',
      backToHome: 'Back to Home',
      loading: 'Loading...'
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Header currentLanguage={currentLanguage} onLanguageToggle={toggleLanguage} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{text[currentLanguage].loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Header currentLanguage={currentLanguage} onLanguageToggle={toggleLanguage} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {text[currentLanguage].loginRequired}
            </h1>
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {text[currentLanguage].loginButton}
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {text[currentLanguage].backToHome}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Header currentLanguage={currentLanguage} onLanguageToggle={toggleLanguage} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {text[currentLanguage].accessDenied}
            </h1>
            <p className="text-gray-600 mb-6">
              {currentLanguage === 'ko' 
                ? '관리자 권한이 필요합니다.' 
                : 'Administrator privileges required.'}
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {text[currentLanguage].backToHome}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header currentLanguage={currentLanguage} onLanguageToggle={toggleLanguage} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {text[currentLanguage].backToHome}
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {text[currentLanguage].adminPanel}
          </h1>
        </div>
        <AdminPanel currentLanguage={currentLanguage} />
      </div>
    </div>
  );
};

export default Admin;
