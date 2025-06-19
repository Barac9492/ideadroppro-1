
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Trash2 } from 'lucide-react';
import { useIdeas } from '@/hooks/useIdeas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SeedDataManagementProps {
  currentLanguage: 'ko' | 'en';
}

const SeedDataManagement: React.FC<SeedDataManagementProps> = ({ currentLanguage }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { generateSeedIdeas } = useIdeas(currentLanguage);

  const text = {
    ko: {
      title: '시드 데이터 관리',
      generateSeeds: '데모 아이디어 생성',
      deleteSeeds: '데모 아이디어 삭제',
      generating: '생성 중...',
      deleting: '삭제 중...',
      description: '앱에 표시될 데모 아이디어를 관리합니다.',
      confirmDelete: '모든 데모 아이디어를 삭제하시겠습니까?',
      deleteSuccess: '데모 아이디어가 삭제되었습니다.',
      deleteError: '데모 아이디어 삭제 중 오류가 발생했습니다.'
    },
    en: {
      title: 'Seed Data Management',
      generateSeeds: 'Generate Demo Ideas',
      deleteSeeds: 'Delete Demo Ideas',
      generating: 'Generating...',
      deleting: 'Deleting...',
      description: 'Manage demo ideas displayed in the app.',
      confirmDelete: 'Are you sure you want to delete all demo ideas?',
      deleteSuccess: 'Demo ideas deleted successfully.',
      deleteError: 'Error occurred while deleting demo ideas.'
    }
  };

  const handleGenerateSeeds = async () => {
    setIsGenerating(true);
    try {
      await generateSeedIdeas();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteSeeds = async () => {
    if (!confirm(text[currentLanguage].confirmDelete)) return;

    setIsDeleting(true);
    try {
      // Delete likes for seed ideas first
      await supabase
        .from('idea_likes')
        .delete()
        .in('idea_id', 
          supabase
            .from('ideas')
            .select('id')
            .eq('seed', true)
        );

      // Delete seed ideas
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('seed', true);

      if (error) throw error;

      toast({
        title: text[currentLanguage].deleteSuccess,
        duration: 3000,
      });

      // Refresh the page to update the ideas list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting seed data:', error);
      toast({
        title: text[currentLanguage].deleteError,
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Rocket className="h-5 w-5" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          {text[currentLanguage].description}
        </p>
        <div className="flex space-x-2">
          <Button
            onClick={handleGenerateSeeds}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Rocket className="h-4 w-4 mr-2" />
            {isGenerating ? text[currentLanguage].generating : text[currentLanguage].generateSeeds}
          </Button>
          <Button
            onClick={handleDeleteSeeds}
            disabled={isDeleting}
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? text[currentLanguage].deleting : text[currentLanguage].deleteSeeds}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeedDataManagement;
