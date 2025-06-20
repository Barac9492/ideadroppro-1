
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MonthlyRankingIdea {
  id: string;
  text: string;
  likes_count: number;
  user_id: string;
  created_at: string;
  profiles: {
    username: string | null;
  } | null;
}

export const useMonthlyRanking = (currentLanguage: 'ko' | 'en') => {
  const [topIdeas, setTopIdeas] = useState<MonthlyRankingIdea[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthlyRanking = async () => {
    try {
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('ideas')
        .select(`
          id,
          text,
          likes_count,
          user_id,
          created_at,
          profiles!inner(username)
        `)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString())
        .eq('seed', false)
        .order('likes_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setTopIdeas(data || []);
    } catch (error) {
      console.error('Error fetching monthly ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopIdeaOfMonth = async () => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from('ideas')
      .select('id, likes_count')
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString())
      .eq('seed', false)
      .order('likes_count', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return data;
  };

  useEffect(() => {
    fetchMonthlyRanking();
  }, []);

  return {
    topIdeas,
    loading,
    fetchMonthlyRanking,
    getTopIdeaOfMonth
  };
};
