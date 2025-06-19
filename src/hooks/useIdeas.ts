
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { checkInappropriateContent, getContentWarning } from '@/utils/contentFilter';

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
  seed?: boolean;
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
      verdictError: 'VC 평가 저장 중 오류가 발생했습니다.',
      contentBlocked: '부적절한 콘텐츠가 감지되어 아이디어를 제출할 수 없습니다.',
      seedGenerated: '데모 아이디어가 생성되었습니다!',
      seedError: '데모 아이디어 생성 중 오류가 발생했습니다.'
    },
    en: {
      submitSuccess: 'Idea submitted successfully!',
      submitError: 'Error occurred while submitting idea.',
      analysisGenerated: 'AI analysis generated successfully!',
      analysisError: 'Error occurred while generating AI analysis.',
      verdictSaved: 'VC verdict saved successfully!',
      verdictError: 'Error occurred while saving VC verdict.',
      contentBlocked: 'Inappropriate content detected. Idea cannot be submitted.',
      seedGenerated: 'Demo ideas generated successfully!',
      seedError: 'Error occurred while generating demo ideas.'
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
          user_id: idea.user_id,
          seed: idea.seed || false
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

  const generateSeedIdeas = async () => {
    try {
      console.log('Generating seed ideas...');
      
      const { data, error } = await supabase.functions.invoke('generate-seed-ideas', {
        body: { language: currentLanguage }
      });

      if (error) throw error;

      toast({
        title: text[currentLanguage].seedGenerated,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error generating seed ideas:', error);
      toast({
        title: text[currentLanguage].seedError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const submitIdea = async (ideaText: string) => {
    if (!user) return;

    // Check for inappropriate content
    if (checkInappropriateContent(ideaText, currentLanguage)) {
      const warning = getContentWarning(currentLanguage);
      toast({
        title: warning[currentLanguage].title,
        description: warning[currentLanguage].message,
        variant: 'destructive',
        duration: 5000,
      });
      return;
    }

    try {
      console.log('Requesting AI analysis for:', ideaText);
      
      // AI 분석 요청
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-idea', {
        body: { 
          ideaText: ideaText,
          language: currentLanguage 
        }
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        // 분석 실패 시 기본값으로 아이디어만 저장
        const { data, error } = await supabase
          .from('ideas')
          .insert([{
            user_id: user.id,
            text: ideaText,
            score: Math.round((Math.random() * 3 + 7) * 10) / 10,
            tags: ['일반'],
            ai_analysis: currentLanguage === 'ko' 
              ? 'AI 분석을 불러올 수 없어 기본 분석으로 대체되었습니다.' 
              : 'AI analysis failed, replaced with default analysis.',
            improvements: [currentLanguage === 'ko' ? '추후 분석 필요' : 'Further analysis needed'],
            market_potential: [currentLanguage === 'ko' ? '시장성 검토 필요' : 'Market potential review needed'],
            similar_ideas: [currentLanguage === 'ko' ? '유사 아이디어 조사 필요' : 'Similar ideas research needed'],
            pitch_points: [currentLanguage === 'ko' ? '피칭 포인트 개발 필요' : 'Pitch points development needed']
          }])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: text[currentLanguage].submitSuccess,
          description: currentLanguage === 'ko' 
            ? 'AI 분석은 실패했지만 아이디어가 저장되었습니다.' 
            : 'AI analysis failed but idea was saved.',
          duration: 3000,
        });

        fetchIdeas();
        return;
      }

      console.log('Analysis result:', analysisData);

      // 분석 성공 시 결과와 함께 저장
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
      if (!idea || idea.seed) return; // Prevent liking seed ideas

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
    if (!user) return;

    try {
      const idea = ideas.find(i => i.id === ideaId);
      if (!idea || idea.seed) return; // Prevent analysis generation for seed ideas

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
    if (!user) return;

    try {
      const idea = ideas.find(i => i.id === ideaId);
      if (idea?.seed) return; // Prevent verdict saving for seed ideas

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
    saveFinalVerdict,
    generateSeedIdeas
  };
};
