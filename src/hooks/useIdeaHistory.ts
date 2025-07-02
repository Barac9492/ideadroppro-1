
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface IdeaHistory {
  id: string;
  text: string;
  score: number;
  ai_analysis: string;
  created_at: string;
  final_verdict: string;
  tags: string[];
}

export const useIdeaHistory = () => {
  const [ideas, setIdeas] = useState<IdeaHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserIdeas = async () => {
    if (!user) {
      setIdeas([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('id, text, score, ai_analysis, created_at, final_verdict, tags')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching user ideas:', error);
        toast({
          title: '아이디어 히스토리를 불러올 수 없습니다',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      setIdeas(data || []);
    } catch (error) {
      console.error('Error in fetchUserIdeas:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveIdeaToHistory = async (ideaText: string, analysis?: string, score?: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert({
          user_id: user.id,
          text: ideaText,
          ai_analysis: analysis || null,
          score: score || 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving idea to history:', error);
        return null;
      }

      // 로컬 상태 업데이트
      setIdeas(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error in saveIdeaToHistory:', error);
      return null;
    }
  };

  const updateIdeaAnalysis = async (ideaId: string, analysis: string, verdict?: string, score?: number) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .update({
          ai_analysis: analysis,
          final_verdict: verdict || null,
          score: score || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', ideaId)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating idea analysis:', error);
        return false;
      }

      // 로컬 상태 업데이트
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId ? { ...idea, ...data } : idea
      ));

      return true;
    } catch (error) {
      console.error('Error in updateIdeaAnalysis:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchUserIdeas();
  }, [user]);

  return {
    ideas,
    loading,
    fetchUserIdeas,
    saveIdeaToHistory,
    updateIdeaAnalysis
  };
};
