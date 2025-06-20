
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeaOperations } from './useIdeaOperations';
import { useSeedIdeas } from './useSeedIdeas';
import { useIdeaLikes } from './useIdeaLikes';
import { subscriptionManager } from '@/utils/subscriptionManager';

interface Idea {
  id: string;
  text: string;
  score: number;
  tags: string[];
  likes: number;
  hasLiked: boolean;
  timestamp: Date;
  aiAnalysis?: string;
  improvements?: string[];
  marketPotential?: string[];
  similarIdeas?: string[];
  pitchPoints?: string[];
  finalVerdict?: string;
  globalAnalysis?: any;
  user_id: string;
  seed?: boolean;
}

export const useIdeas = (currentLanguage: 'ko' | 'en') => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const componentId = useRef(`ideas-${Math.random().toString(36).substring(7)}`);
  const subscriptionKey = useRef<string | null>(null);

  const fetchIdeas = async () => {
    console.log('🔄 Fetching ideas for main app...');
    
    try {
      const { data: ideasData, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching ideas:', error);
        throw error;
      }

      console.log('✅ Fetched ideas for main app:', ideasData?.length);

      const ideasWithLikes = await Promise.all((ideasData || []).map(async (idea) => {
        const { data: likesData } = await supabase
          .from('idea_likes')
          .select('user_id')
          .eq('idea_id', idea.id);

        // Only check if user has liked if they are logged in
        const hasLiked = user ? likesData?.some(like => like.user_id === user.id) || false : false;

        return {
          id: idea.id,
          text: idea.text,
          score: parseFloat(idea.score?.toString() || '0'),
          tags: idea.tags || [],
          likes: likesData?.length || 0,
          hasLiked,
          timestamp: new Date(idea.created_at),
          aiAnalysis: idea.ai_analysis,
          improvements: idea.improvements,
          marketPotential: idea.market_potential,
          similarIdeas: idea.similar_ideas,
          pitchPoints: idea.pitch_points,
          finalVerdict: idea.final_verdict,
          globalAnalysis: idea.global_analysis,
          user_id: idea.user_id,
          seed: idea.seed || false
        };
      }));

      setIdeas(ideasWithLikes);
    } catch (error) {
      console.error('❌ Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for ideas
  useEffect(() => {
    // Initial fetch
    fetchIdeas();

    // Clean up any existing subscription
    if (subscriptionKey.current) {
      subscriptionManager.unsubscribe(subscriptionKey.current);
      subscriptionKey.current = null;
    }

    // Set up new subscription
    const newSubscriptionKey = subscriptionManager.subscribe(
      'ideas-main-changes',
      componentId.current,
      {
        event: '*',
        schema: 'public',
        table: 'ideas'
      },
      (payload) => {
        console.log('🔄 Real-time ideas change on main:', payload);
        
        if (payload.eventType === 'DELETE') {
          console.log('🗑️ Removing deleted idea from main state:', payload.old.id);
          setIdeas(prev => {
            const filtered = prev.filter(idea => idea.id !== payload.old.id);
            console.log('📊 Main app ideas updated. Remaining:', filtered.length);
            return filtered;
          });
        } else {
          // For INSERT and UPDATE, refetch to get complete data
          console.log('➕/✏️ Idea changed, refetching...');
          fetchIdeas();
        }
      }
    );

    subscriptionKey.current = newSubscriptionKey;

    return () => {
      if (subscriptionKey.current) {
        subscriptionManager.unsubscribe(subscriptionKey.current);
        subscriptionKey.current = null;
      }
    };
  }, []); // Remove user dependency to avoid re-subscriptions

  // Update like status when user changes
  useEffect(() => {
    if (ideas.length > 0) {
      console.log('👤 User changed, updating like status...');
      fetchIdeas();
    }
  }, [user]);

  const ideaOperations = useIdeaOperations({ currentLanguage, user, fetchIdeas });
  const seedIdeas = useSeedIdeas({ currentLanguage, fetchIdeas });
  const ideaLikes = useIdeaLikes({ user, ideas, fetchIdeas });

  const generateAnalysis = async (ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea || idea.seed) return;
    
    return ideaOperations.generateAnalysis(ideaId, idea.text);
  };

  const generateGlobalAnalysis = async (ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea || idea.seed) return;
    
    return ideaOperations.generateGlobalAnalysis(ideaId);
  };

  const saveFinalVerdict = async (ideaId: string, verdict: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (idea?.seed) return;
    
    return ideaOperations.saveFinalVerdict(ideaId, verdict);
  };

  return {
    ideas,
    loading,
    submitIdea: ideaOperations.submitIdea,
    toggleLike: ideaLikes.toggleLike,
    generateAnalysis,
    generateGlobalAnalysis,
    saveFinalVerdict,
    generateSeedIdeas: seedIdeas.generateSeedIdeas
  };
};
