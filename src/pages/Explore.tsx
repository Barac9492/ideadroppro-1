
import React from 'react';
import { useIdeas } from '@/hooks/useIdeas';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import IdeaCard from '@/components/IdeaCard';
import Header from '@/components/Header';
import EmergencyZeroScoreFixer from '@/components/EmergencyZeroScoreFixer';
import ScoreRefreshHandler from '@/components/ScoreRefreshHandler';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Explore: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState<'ko' | 'en'>('ko');
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const {
    ideas,
    loading,
    fetchIdeas,
    toggleLike,
    generateAnalysis,
    generateGlobalAnalysis,
    saveFinalVerdict,
    deleteIdea
  } = useIdeas(currentLanguage);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleEmergencyFixComplete = () => {
    console.log('🔄 Emergency fix completed, refreshing ideas...');
    fetchIdeas();
  };

  const handleForceRefresh = () => {
    console.log('🔄 Force refreshing ideas...');
    // Clear any cached data and force refresh
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
    fetchIdeas();
  };

  const text = {
    ko: {
      title: '아이디어 탐색',
      loading: '아이디어를 불러오는 중...',
      noIdeas: '아직 아이디어가 없습니다.',
      refresh: '새로고침',
      forceRefresh: '강제 새로고침'
    },
    en: {
      title: 'Explore Ideas',
      loading: 'Loading ideas...',
      noIdeas: 'No ideas yet.',
      refresh: 'Refresh',
      forceRefresh: 'Force Refresh'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header currentLanguage={currentLanguage} onLanguageToggle={toggleLanguage} />
      
      {/* Score Refresh Handler */}
      <ScoreRefreshHandler 
        onScoreUpdate={fetchIdeas} 
        currentLanguage={currentLanguage} 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {text[currentLanguage].title}
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                onClick={fetchIdeas}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {text[currentLanguage].refresh}
              </Button>
              <Button
                onClick={handleForceRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {text[currentLanguage].forceRefresh}
              </Button>
            </div>
          </div>

          {/* Emergency Zero Score Fixer - Only show for admins */}
          {isAdmin && (
            <EmergencyZeroScoreFixer 
              currentLanguage={currentLanguage}
              onComplete={handleEmergencyFixComplete}
            />
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{text[currentLanguage].loading}</p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{text[currentLanguage].noIdeas}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ideas.map((idea) => (
              <IdeaCard
                key={`${idea.id}-${idea.score}`}
                idea={idea}
                currentLanguage={currentLanguage}
                currentUserId={user?.id}
                onLike={toggleLike}
                onGenerateAnalysis={generateAnalysis}
                onGenerateGlobalAnalysis={generateGlobalAnalysis}
                onSaveFinalVerdict={saveFinalVerdict}
                onDelete={deleteIdea}
                isAdmin={isAdmin}
                isAuthenticated={!!user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
