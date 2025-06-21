
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface RemixOperationsProps {
  currentLanguage: 'ko' | 'en';
  fetchIdeas: () => Promise<void>;
}

export const useRemixOperations = ({ currentLanguage, fetchIdeas }: RemixOperationsProps) => {
  const { user } = useAuth();
  const [isRemixing, setIsRemixing] = useState(false);

  const text = {
    ko: {
      remixSuccess: '리믹스가 생성되었습니다!',
      remixError: '리믹스 생성 중 오류가 발생했습니다',
      remixInfluence: '리믹스로 영향력 점수를 획득했습니다!',
      originalBonus: '원작자가 리믹스 보너스를 받았습니다!'
    },
    en: {
      remixSuccess: 'Remix created successfully!',
      remixError: 'Error creating remix',
      remixInfluence: 'You earned influence points for remixing!',
      originalBonus: 'Original author received remix bonus!'
    }
  };

  const createRemix = async (originalIdeaId: string, remixText: string, originalScore: number) => {
    if (!user) return;

    setIsRemixing(true);
    try {
      // Submit remix as new idea
      const { data: remixIdea, error: remixError } = await supabase
        .from('ideas')
        .insert([{
          text: remixText,
          user_id: user.id,
          remix_parent_id: originalIdeaId,
          tags: ['remix'],
          score: Math.min(originalScore + Math.random() * 2, 10) // Slight improvement
        }])
        .select()
        .single();

      if (remixError) throw remixError;

      // Award influence points to remixer
      await supabase.rpc('update_influence_score', {
        p_user_id: user.id,
        p_action_type: 'remix_created',
        p_points: 8,
        p_description: text[currentLanguage].remixInfluence,
        p_reference_id: remixIdea.id
      });

      // Award bonus to original author
      const { data: originalIdea } = await supabase
        .from('ideas')
        .select('user_id')
        .eq('id', originalIdeaId)
        .single();

      if (originalIdea?.user_id) {
        await supabase.rpc('update_influence_score', {
          p_user_id: originalIdea.user_id,
          p_action_type: 'idea_remixed',
          p_points: 5,
          p_description: text[currentLanguage].originalBonus,
          p_reference_id: originalIdeaId
        });
      }

      toast({
        title: text[currentLanguage].remixSuccess,
        description: text[currentLanguage].remixInfluence,
        duration: 4000,
      });

      await fetchIdeas();
    } catch (error) {
      console.error('Error creating remix:', error);
      toast({
        title: text[currentLanguage].remixError,
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsRemixing(false);
    }
  };

  return {
    createRemix,
    isRemixing
  };
};
