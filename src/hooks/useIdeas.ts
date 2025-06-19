
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
  user_id: string;
}

export const useIdeas = (currentLanguage: 'ko' | 'en') => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const text = {
    ko: {
      submitSuccess: '아이디어가 성공적으로 제출되었습니다!',
      submitError: '아이디어 제출 중 오류가 발생했습니다.',
      analysisGenerated: 'AI 분석이 생성되었습니다!',
      analysisError: 'AI 분석 생성 중 오류가 발생했습니다.',
      verdictSaved: 'VC 평가가 저장되었습니다!',
      verdictError: 'VC 평가 저장 중 오류가 발생했습니다.'
    },
    en: {
      submitSuccess: 'Idea submitted successfully!',
      submitError: 'Error occurred while submitting idea.',
      analysisGenerated: 'AI analysis generated successfully!',
      analysisError: 'Error occurred while generating AI analysis.',
      verdictSaved: 'VC verdict saved successfully!',
      verdictError: 'Error occurred while saving VC verdict.'
    }
  };

  const fetchIdeas = async () => {
    try {
      const { data: ideasData, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ideasWithLikes = await Promise.all((ideasData || []).map(async (idea) => {
        const { data: likesData } = await supabase
          .from('idea_likes')
          .select('user_id')
          .eq('idea_id', idea.id);

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
          user_id: idea.user_id
        };
      }));

      setIdeas(ideasWithLikes);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [user]);

  const submitIdea = async (ideaText: string) => {
    if (!user) return;

    try {
      // 먼저 AI 분석 요청
      console.log('Requesting AI analysis for:', ideaText);
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage 
        }
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error('AI 분석 중 오류가 발생했습니다.');
      }

      console.log('Analysis result:', analysisData);

      // 분석 결과를 사용하여 아이디어 저장
      const { data, error } = await supabase
        .from('ideas')
        .insert([{
          user_id: user.id,
          text: ideaText,
          score: analysisData.score || Math.round((Math.random() * 3 + 7) * 10) / 10,
          tags: analysisData.tags || [],
          ai_analysis: analysisData.analysis,
          improvements: analysisData.improvements,
          market_potential: analysisData.marketPotential,
          similar_ideas: analysisData.similarIdeas,
          pitch_points: analysisData.pitchPoints
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: text[currentLanguage].submitSuccess,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast({
        title: text[currentLanguage].submitError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const toggleLike = async (ideaId: string) => {
    if (!user) return;

    try {
      const idea = ideas.find(i => i.id === ideaId);
      if (!idea) return;

      if (idea.hasLiked) {
        await supabase
          .from('idea_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('idea_id', ideaId);
      } else {
        await supabase
          .from('idea_likes')
          .insert([{
            user_id: user.id,
            idea_id: ideaId
          }]);
      }

      fetchIdeas();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const generateAnalysis = async (ideaId: string) => {
    try {
      const idea = ideas.find(i => i.id === ideaId);
      if (!idea) return;

      console.log('Generating analysis for idea:', idea.text);
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: idea.text,
          language: currentLanguage 
        }
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error(text[currentLanguage].analysisError);
      }

      console.log('Analysis result:', analysisData);

      const { error } = await supabase
        .from('ideas')
        .update({
          score: analysisData.score,
          tags: analysisData.tags,
          ai_analysis: analysisData.analysis,
          improvements: analysisData.improvements,
          market_potential: analysisData.marketPotential,
          similar_ideas: analysisData.similarIdeas,
          pitch_points: analysisData.pitchPoints
        })
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: text[currentLanguage].analysisGenerated,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: text[currentLanguage].analysisError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const saveFinalVerdict = async (ideaId: string, verdict: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ final_verdict: verdict })
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: text[currentLanguage].verdictSaved,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error saving verdict:', error);
      toast({
        title: text[currentLanguage].verdictError,  
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return {
    ideas,
    loading,
    submitIdea,
    toggleLike,
    generateAnalysis,
    saveFinalVerdict
  };
};
