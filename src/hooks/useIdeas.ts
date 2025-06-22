import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  vcAnalysis?: any;
  seed?: boolean;
  user_id: string;
  remix_parent_id?: string;
  remix_count?: number;
  remix_chain_depth?: number;
  is_modular?: boolean;
  composition_version?: number;
}

export const useIdeas = (currentLanguage: 'ko' | 'en') => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const text = {
    ko: {
      loading: '아이디어를 불러오는 중...',
      loaded: '아이디어를 불러왔습니다',
      submitted: '아이디어가 제출되었습니다!',
      liked: '아이디어를 좋아합니다',
      analysisGenerated: 'AI 분석이 생성되었습니다',
      globalAnalysisGenerated: '글로벌 분석이 생성되었습니다',
      finalVerdictSaved: '최종 평결이 저장되었습니다',
      deleted: '아이디어가 삭제되었습니다',
      error: '오류가 발생했습니다',
      loginRequired: '로그인이 필요합니다',
      seedGenerated: '데모 아이디어가 생성되었습니다',
    },
    en: {
      loading: 'Loading ideas...',
      loaded: 'Ideas loaded',
      submitted: 'Idea submitted!',
      liked: 'Idea liked',
      analysisGenerated: 'AI analysis generated',
      globalAnalysisGenerated: 'Global analysis generated',
      finalVerdictSaved: 'Final verdict saved',
      deleted: 'Idea deleted',
      error: 'An error occurred',
      loginRequired: 'Login required',
      seedGenerated: 'Demo ideas generated',
    },
  };

  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      toast({
        title: text[currentLanguage].loading,
        duration: 2000,
      });
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database data to match Idea interface
      const transformedIdeas: Idea[] = (data || []).map(item => ({
        id: item.id,
        text: item.text,
        score: item.score || 0,
        tags: item.tags || [],
        likes: item.likes_count || 0,
        hasLiked: false, // Will be updated by separate query if needed
        timestamp: new Date(item.created_at),
        aiAnalysis: item.ai_analysis,
        improvements: item.improvements,
        marketPotential: item.market_potential,
        similarIdeas: item.similar_ideas,
        pitchPoints: item.pitch_points,
        finalVerdict: item.final_verdict,
        globalAnalysis: item.global_analysis,
        seed: item.seed,
        user_id: item.user_id,
        remix_parent_id: item.remix_parent_id,
        remix_count: item.remix_count,
        remix_chain_depth: item.remix_chain_depth,
        is_modular: item.is_modular,
        composition_version: item.composition_version,
      }));

      setIdeas(transformedIdeas);
      toast({
        title: text[currentLanguage].loaded,
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Error fetching ideas:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (ideaId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: text[currentLanguage].error,
          description: text[currentLanguage].loginRequired,
          variant: 'destructive',
        });
        return;
      }

      // Check if user has already liked this idea
      const { data: existingLike } = await supabase
        .from('idea_likes')
        .select('id')
        .eq('idea_id', ideaId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('idea_likes')
          .delete()
          .eq('idea_id', ideaId)
          .eq('user_id', user.id);

        // Update likes count by decrementing
        const { data: currentIdea } = await supabase
          .from('ideas')
          .select('likes_count')
          .eq('id', ideaId)
          .single();

        await supabase
          .from('ideas')
          .update({ likes_count: Math.max(0, (currentIdea?.likes_count || 1) - 1) })
          .eq('id', ideaId);
      } else {
        // Like
        await supabase
          .from('idea_likes')
          .insert({ idea_id: ideaId, user_id: user.id });

        // Update likes count by incrementing
        const { data: currentIdea } = await supabase
          .from('ideas')
          .select('likes_count')
          .eq('id', ideaId)
          .single();

        await supabase
          .from('ideas')
          .update({ likes_count: (currentIdea?.likes_count || 0) + 1 })
          .eq('id', ideaId);
      }

      // Update local state
      setIdeas(prevIdeas =>
        prevIdeas.map(idea =>
          idea.id === ideaId 
            ? { 
                ...idea, 
                likes: existingLike ? Math.max(0, idea.likes - 1) : idea.likes + 1,
                hasLiked: !existingLike 
              } 
            : idea
        )
      );

      toast({
        title: text[currentLanguage].liked,
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Error liking idea:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const generateAnalysis = async (ideaId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-analysis', {
        body: { ideaId, language: currentLanguage }
      });

      if (error) throw error;

      setIdeas(prevIdeas =>
        prevIdeas.map(idea =>
          idea.id === ideaId ? { ...idea, ...data } : idea
        )
      );

      toast({
        title: text[currentLanguage].analysisGenerated,
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Error generating analysis:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const generateGlobalAnalysis = async (ideaId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-global-analysis', {
        body: { ideaId, language: currentLanguage }
      });

      if (error) throw error;

      setIdeas(prevIdeas =>
        prevIdeas.map(idea =>
          idea.id === ideaId ? { ...idea, globalAnalysis: data } : idea
        )
      );

      toast({
        title: text[currentLanguage].globalAnalysisGenerated,
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Error generating global analysis:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const saveFinalVerdict = async (ideaId: string, verdict: string) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .update({ final_verdict: verdict })
        .eq('id', ideaId)
        .select()
        .single();

      if (error) throw error;

      setIdeas(prevIdeas =>
        prevIdeas.map(idea =>
          idea.id === ideaId ? { ...idea, finalVerdict: data.final_verdict } : idea
        )
      );

      toast({
        title: text[currentLanguage].finalVerdictSaved,
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Error saving final verdict:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteIdea = async (ideaId: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      if (error) throw error;

      setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));

      toast({
        title: text[currentLanguage].deleted,
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Error deleting idea:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const submitIdea = async (ideaText: string, additionalData?: {
    modules?: any;
    isModular?: boolean;
    completionScore?: number;
  }) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: text[currentLanguage].error,
          description: text[currentLanguage].loginRequired,
          variant: 'destructive',
        });
        return;
      }

      // Clean the idea text first
      const cleanedText = ideaText.trim();
      
      const { data, error } = await supabase
        .from('ideas')
        .insert({
          text: cleanedText,
          user_id: user.id,
          is_modular: additionalData?.isModular || false,
          composition_version: additionalData?.isModular ? 1 : undefined
        })
        .select()
        .single();

      if (error) throw error;

      // If this is a modular idea, create module entries
      if (additionalData?.modules && additionalData?.isModular) {
        const moduleEntries = Object.entries(additionalData.modules).map(([moduleType, content]) => ({
          module_type: moduleType as any,
          content: String(content),
          original_idea_id: data.id,
          created_by: user.id
        }));

        if (moduleEntries.length > 0) {
          const { error: moduleError } = await supabase
            .from('idea_modules')
            .insert(moduleEntries);

          if (moduleError) {
            console.error('Error creating modules:', moduleError);
          }
        }
      }

      toast({
        title: text[currentLanguage].submitted,
        description: additionalData?.completionScore 
          ? `${additionalData.completionScore}점 획득!` 
          : text[currentLanguage].submitted,
        duration: 3000,
      });

      await fetchIdeas();
    } catch (error: any) {
      console.error('Error submitting idea:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSeedIdeas = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-seed-ideas', {
        body: { language: currentLanguage, count: 5 }
      });

      if (error) throw error;

      toast({
        title: text[currentLanguage].seedGenerated,
        duration: 3000,
      });

      await fetchIdeas();
    } catch (error: any) {
      console.error('Error generating seed ideas:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    ideas,
    isLoading,
    isSubmitting,
    submitIdea,
    fetchIdeas,
    toggleLike,
    generateAnalysis,
    generateGlobalAnalysis,
    saveFinalVerdict,
    deleteIdea,
    generateSeedIdeas
  };
};
