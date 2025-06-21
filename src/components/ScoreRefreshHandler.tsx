
import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ScoreRefreshHandlerProps {
  onScoreUpdate: () => void;
  currentLanguage: 'ko' | 'en';
}

const ScoreRefreshHandler: React.FC<ScoreRefreshHandlerProps> = ({ 
  onScoreUpdate, 
  currentLanguage 
}) => {
  const lastUpdateRef = useRef<number>(0);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const text = {
    ko: {
      scoreUpdated: '점수가 업데이트되었습니다!',
      refreshing: '새로고침 중...',
      dataRefreshed: '데이터가 새로고침되었습니다!'
    },
    en: {
      scoreUpdated: 'Scores have been updated!',
      refreshing: 'Refreshing...',
      dataRefreshed: 'Data has been refreshed!'
    }
  };

  // 강화된 캐시 무효화 함수
  const performDeepCacheClear = async () => {
    console.log('🧹 Performing deep cache clearing...');
    
    try {
      // 1. Service Worker 캐시 완전 삭제
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames.map(async (cacheName) => {
          console.log('🗑️ Deleting cache:', cacheName);
          return await caches.delete(cacheName);
        });
        await Promise.all(deletePromises);
        console.log('✅ All service worker caches cleared');
      }
      
      // 2. LocalStorage 정리
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
      
      // 3. SessionStorage 정리
      sessionStorage.clear();
      
      // 4. 브라우저 메모리 캐시 무효화
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.update();
        }
      }
      
      console.log('✅ Deep cache clearing completed');
    } catch (error) {
      console.warn('Cache clearing error:', error);
    }
  };

  useEffect(() => {
    // Listen for real-time score updates
    const channel = supabase
      .channel(`score-updates-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas'
        },
        async (payload) => {
          console.log('🔄 Score update detected:', payload);
          
          // Debounce updates to avoid excessive refreshes
          const now = Date.now();
          if (now - lastUpdateRef.current > 800) { // 0.8초 디바운스
            lastUpdateRef.current = now;
            
            // Clear any existing timeout
            if (updateTimeoutRef.current) {
              clearTimeout(updateTimeoutRef.current);
            }
            
            // 즉시 캐시 무효화 시작
            console.log('🧹 Starting immediate cache invalidation...');
            performDeepCacheClear();
            
            // UI 업데이트는 약간의 지연 후 실행
            updateTimeoutRef.current = setTimeout(async () => {
              console.log('🔄 Triggering UI refresh after cache clear...');
              
              toast({
                title: text[currentLanguage].scoreUpdated,
                duration: 2000,
              });
              
              // Force refresh with additional cache busting
              onScoreUpdate();
              
              // 추가적인 강제 새로고침 신호
              window.dispatchEvent(new CustomEvent('ideas-updated', { 
                detail: { 
                  timestamp: Date.now(),
                  source: 'realtime-update'
                }
              }));
              
            }, 300);
          }
        }
      )
      .subscribe();

    // 페이지 포커스 시 데이터 새로고침
    const handleFocus = () => {
      console.log('👁️ Page focused, refreshing data...');
      onScoreUpdate();
    };

    // 커스텀 이벤트 리스너 (강제 새로고침용)
    const handleForceRefresh = () => {
      console.log('⚡ Force refresh event received');
      performDeepCacheClear().then(() => {
        onScoreUpdate();
        toast({
          title: text[currentLanguage].dataRefreshed,
          duration: 1500,
        });
      });
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('force-refresh', handleForceRefresh);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('force-refresh', handleForceRefresh);
      supabase.removeChannel(channel);
    };
  }, [onScoreUpdate, currentLanguage]);

  // 전역 캐시 무효화 함수 노출
  useEffect(() => {
    (window as any).forceCacheClear = async () => {
      console.log('🧹 Manual force cache clear triggered...');
      await performDeepCacheClear();
      onScoreUpdate();
      toast({
        title: text[currentLanguage].refreshing,
        duration: 1000,
      });
    };
    
    (window as any).clearAllCaches = performDeepCacheClear;
    
    return () => {
      delete (window as any).forceCacheClear;
      delete (window as any).clearAllCaches;
    };
  }, [onScoreUpdate, currentLanguage]);

  return null; // This is a utility component with no UI
};

export default ScoreRefreshHandler;
