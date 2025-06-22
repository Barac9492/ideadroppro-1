
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAIImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateIdeaImage = async (ideaText: string): Promise<string | null> => {
    if (!ideaText.trim()) {
      toast({
        title: "오류",
        description: "아이디어 텍스트가 필요합니다.",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('🎨 Generating AI image for idea:', ideaText.substring(0, 50) + '...');
      
      const { data, error } = await supabase.functions.invoke('generate-idea-image', {
        body: { ideaText }
      });

      if (error) {
        console.error('Error generating image:', error);
        throw error;
      }

      if (data?.image) {
        console.log('✅ AI image generated successfully');
        toast({
          title: "이미지 생성 완료",
          description: "AI가 아이디어에 맞는 이미지를 생성했습니다.",
        });
        return data.image;
      }

      return null;
    } catch (error) {
      console.error('Failed to generate AI image:', error);
      toast({
        title: "이미지 생성 실패",
        description: "AI 이미지 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateIdeaImage,
    isGenerating
  };
};
