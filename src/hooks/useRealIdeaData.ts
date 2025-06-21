
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface IdeaData {
  id: string;
  content: string;
  user_id: string;
  likes_count: number;
  created_at: string;
  has_analysis: boolean;
}

export const useRealIdeaData = () => {
  const [realIdeas, setRealIdeas] = useState<IdeaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealIdeas();
  }, []);

  const fetchRealIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('id, content, user_id, likes_count, created_at, has_analysis')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRealIdeas(data || []);
    } catch (error) {
      console.error('Error fetching real ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPopularIdeas = () => {
    return realIdeas
      .filter(idea => idea.likes_count > 0 || idea.has_analysis)
      .sort((a, b) => b.likes_count - a.likes_count)
      .slice(0, 10);
  };

  const getRecentIdeas = () => {
    return realIdeas
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  };

  return {
    realIdeas,
    popularIdeas: getPopularIdeas(),
    recentIdeas: getRecentIdeas(),
    loading,
    refetch: fetchRealIdeas
  };
};
