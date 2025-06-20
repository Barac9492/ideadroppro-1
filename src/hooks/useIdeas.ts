
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIdeaOperations } from './useIdeaOperations';
import { useSeedIdeas } from './useSeedIdeas';
import { useIdeaLikes } from './useIdeaLikes';

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
    fetchIdeas();

    const channel = supabase
      .channel('ideas-main-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas'
        },
        (payload) => {
          console.log('🔄 Real-time ideas change on main:', payload);
          
          if (payload.eventType === 'DELETE') {
            // Remove deleted idea from state immediately
            console.log('🗑️ Removing deleted idea from main state:', payload.old.id);
            setIdeas(prev => {
              const filtered = prev.filter(idea => idea.id !== payload.old.id);
              console.log('📊 Main app ideas updated. Remaining:', filtered.length);
              return filtered;
            });
          } else if (payload.eventType === 'INSERT') {
            // Add new idea and refetch to get complete data with likes
            console.log('➕ New idea inserted, refetching...');
            fetchIdeas();
          } else if (payload.eventType === 'UPDATE') {
            // Update existing idea or refetch for complex updates
            console.log('✏️ Idea updated, refetching...');
            fetchIdeas();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Remove user dependency to avoid unnecessary re-subscriptions

  // Refetch ideas when user changes to update like status
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
    if (!idea || idea.seed) return; // Prevent analysis generation for seed ideas
    
    return ideaOperations.generateAnalysis(ideaId, idea.text);
  };

  const generateGlobalAnalysis = async (ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea || idea.seed) return; // Prevent global analysis generation for seed ideas
    
    return ideaOperations.generateGlobalAnalysis(ideaId);
  };

  const saveFinalVerdict = async (ideaId: string, verdict: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (idea?.seed) return; // Prevent verdict saving for seed ideas
    
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
