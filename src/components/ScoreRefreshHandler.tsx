
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
      refreshing: '새로고침 중...'
    },
    en: {
      scoreUpdated: 'Scores have been updated!',
      refreshing: 'Refreshing...'
    }
  };

  useEffect(() => {
    // Listen for real-time score updates
    const channel = supabase
      .channel('score-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas'
        },
        (payload) => {
          console.log('🔄 Score update detected:', payload);
          
          // Debounce updates to avoid excessive refreshes
          const now = Date.now();
          if (now - lastUpdateRef.current > 2000) { // 2 second debounce
            lastUpdateRef.current = now;
            
            // Clear any existing timeout
            if (updateTimeoutRef.current) {
              clearTimeout(updateTimeoutRef.current);
            }
            
            // Set a brief delay for UI updates
            updateTimeoutRef.current = setTimeout(() => {
              toast({
                title: text[currentLanguage].scoreUpdated,
                duration: 2000,
              });
              
              // Force refresh
              onScoreUpdate();
            }, 500);
          }
        }
      )
      .subscribe();

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [onScoreUpdate, currentLanguage]);

  // Force cache clear function
  const forceCacheClear = () => {
    console.log('🧹 Forcing cache clear...');
    
    // Clear browser cache for this domain
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Force reload data
    onScoreUpdate();
    
    toast({
      title: text[currentLanguage].refreshing,
      duration: 1000,
    });
  };

  // Expose force clear function globally for emergency use
  useEffect(() => {
    (window as any).forceCacheClear = forceCacheClear;
    
    return () => {
      delete (window as any).forceCacheClear;
    };
  }, []);

  return null; // This is a utility component with no UI
};

export default ScoreRefreshHandler;
