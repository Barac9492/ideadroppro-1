
import React from 'react';
import { useIdeas } from '@/hooks/useIdeas';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import IdeaCard from '@/components/IdeaCard';
import Header from '@/components/Header';
import EmergencyZeroScoreFixer from '@/components/EmergencyZeroScoreFixer';
import ScoreRefreshHandler from '@/components/ScoreRefreshHandler';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2, Zap } from 'lucide-react';

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
    // Clear all caches before fetching
    performComprehensiveCacheClear();
    fetchIdeas();
  };

  // 강화된 캐시 무효화 시스템
  const performComprehensiveCacheClear = () => {
    console.log('🧹 Performing comprehensive cache clearing...');
    
    // 1. Service Worker 캐시 완전 삭제
    if ('caches' in window) {
      caches.keys().then(async (cacheNames) => {
        const deletePromises = cacheNames.map(cacheName => {
          console.log('🗑️ Deleting cache:', cacheName);
          return caches.delete(cacheName);
        });
        await Promise.all(deletePromises);
        console.log('✅ All service worker caches cleared');
      }).catch(e => console.warn('Could not clear service worker caches:', e));
    }
    
    // 2. localStorage 완전 정리
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('idea') || 
          key.includes('score') || 
          key.includes('supabase') ||
          key.includes('analysis') ||
          key.includes('cache')
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log('🗑️ Removed localStorage key:', key);
      });
      console.log(`✅ Cleared ${keysToRemove.length} localStorage entries`);
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    
    // 3. sessionStorage 완전 정리
    try {
      const sessionKeys = Object.keys(sessionStorage);
      sessionStorage.clear();
      console.log(`✅ Cleared ${sessionKeys.length} sessionStorage entries`);
    } catch (e) {
      console.warn('Could not clear sessionStorage:', e);
    }
    
    // 4. IndexedDB 정리 (가능한 경우)
    if ('indexedDB' in window) {
      try {
        // 일반적인 캐시 DB들 정리
        const dbNamesToClear = ['keyval-store', 'supabase-cache', 'app-cache'];
        dbNamesToClear.forEach(dbName => {
          const deleteReq = indexedDB.deleteDatabase(dbName);
          deleteReq.onsuccess = () => console.log(`✅ Cleared IndexedDB: ${dbName}`);
          deleteReq.onerror = () => console.warn(`Could not clear IndexedDB: ${dbName}`);
        });
      } catch (e) {
        console.warn('Could not clear IndexedDB:', e);
      }
    }
    
    // 5. Memory 정리
    if (typeof window.gc === 'function') {
      window.gc();
      console.log('✅ Manual garbage collection triggered');
    }
  };

  const handleForceRefresh = () => {
    console.log('🔄 Force refreshing with comprehensive cache clear...');
    performComprehensiveCacheClear();
    
    // React 상태 강제 리셋
    setTimeout(() => {
      console.log('🔄 Fetching fresh data...');
      fetchIdeas();
    }, 200);
  };

  const handleNuclearRefresh = () => {
    console.log('💥 Nuclear refresh - clearing everything and reloading...');
    performComprehensiveCacheClear();
    
    // 전체 페이지 리로드
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // UI 렌더링 강제 업데이트
  const handleInstantRefresh = () => {
    console.log('⚡ Instant UI refresh...');
    
    // 강제 리렌더링을 위한 상태 변경
    const timestamp = Date.now();
    window.dispatchEvent(new CustomEvent('force-refresh', { detail: timestamp }));
    
    fetchIdeas();
  };

  const text = {
    ko: {
      title: '아이디어 탐색',
      loading: '아이디어를 불러오는 중...',
      noIdeas: '아직 아이디어가 없습니다.',
      refresh: '새로고침',
      forceRefresh: '강제 새로고침',
      nuclearRefresh: '완전 새로고침',
      instantRefresh: '즉시 새로고침'
    },
    en: {
      title: 'Explore Ideas',
      loading: 'Loading ideas...',
      noIdeas: 'No ideas yet.',
      refresh: 'Refresh',
      forceRefresh: 'Force Refresh',
      nuclearRefresh: 'Nuclear Refresh',
      instantRefresh: 'Instant Refresh'
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
                onClick={handleInstantRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                <Zap className={`h-4 w-4 mr-2`} />
                {text[currentLanguage].instantRefresh}
              </Button>
              <Button
                onClick={handleForceRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {text[currentLanguage].forceRefresh}
              </Button>
              <Button
                onClick={handleNuclearRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className={`h-4 w-4 mr-2`} />
                {text[currentLanguage].nuclearRefresh}
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
                key={`ideacard-${idea.id}-${idea.timestamp.getTime()}-${Date.now()}`}
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
