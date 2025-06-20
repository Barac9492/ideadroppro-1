
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NetworkActivity {
  id: string;
  type: 'vc_remix' | 'vc_comment' | 'vc_dm_request' | 'idea_chain' | 'influence_boost';
  actor: string;
  action: string;
  target_idea_id: string;
  timestamp: Date;
  impact_score: number;
}

interface UseNetworkActivityProps {
  currentLanguage: 'ko' | 'en';
}

export const useNetworkActivity = ({ currentLanguage }: UseNetworkActivityProps) => {
  const [activities, setActivities] = useState<NetworkActivity[]>([]);
  const [liveStats, setLiveStats] = useState({
    activeVCs: 12,
    remixesLast10Min: 7,
    ideasSubmittedToday: 147,
    connectionsMade: 23
  });

  const text = {
    ko: {
      vcRemixed: 'VC가 리믹스했습니다',
      vcCommented: 'VC가 코멘트를 남겼습니다', 
      vcDmRequested: 'VC가 DM을 요청했습니다',
      ideaChained: '개의 아이디어가 연결되었습니다',
      influenceBoosted: '영향력 점수가 증가했습니다'
    },
    en: {
      vcRemixed: 'VC remixed this idea',
      vcCommented: 'VC left a comment',
      vcDmRequested: 'VC requested DM',
      ideaChained: 'ideas were chained together',
      influenceBoosted: 'influence score increased'
    }
  };

  // Simulate real-time network activity
  useEffect(() => {
    const generateMockActivity = () => {
      const mockActivities: NetworkActivity[] = [
        {
          id: '1',
          type: 'vc_remix',
          actor: 'GreenTech Ventures',
          action: text[currentLanguage].vcRemixed,
          target_idea_id: 'idea-1',
          timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
          impact_score: 15
        },
        {
          id: '2', 
          type: 'vc_dm_request',
          actor: 'Innovation Capital',
          action: text[currentLanguage].vcDmRequested,
          target_idea_id: 'idea-2',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          impact_score: 25
        },
        {
          id: '3',
          type: 'idea_chain',
          actor: 'remix_master_kim',
          action: `3${text[currentLanguage].ideaChained}`,
          target_idea_id: 'idea-3',
          timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
          impact_score: 12
        }
      ];

      setActivities(mockActivities);
    };

    generateMockActivity();

    // Update live stats every 30 seconds
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        activeVCs: Math.max(8, prev.activeVCs + Math.floor(Math.random() * 3) - 1),
        remixesLast10Min: Math.max(3, prev.remixesLast10Min + Math.floor(Math.random() * 3) - 1),
        ideasSubmittedToday: prev.ideasSubmittedToday + Math.floor(Math.random() * 2),
        connectionsMade: prev.connectionsMade + Math.floor(Math.random() * 2)
      }));
    }, 30000);

    return () => clearInterval(statsInterval);
  }, [currentLanguage]);

  const addActivity = (activity: Omit<NetworkActivity, 'id' | 'timestamp'>) => {
    const newActivity: NetworkActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10
  };

  return {
    activities,
    liveStats,
    addActivity
  };
};
