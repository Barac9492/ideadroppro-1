
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Trash2, Info, RefreshCw } from 'lucide-react';
import { useIdeas } from '@/hooks/useIdeas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SeedDataManagementProps {
  currentLanguage: 'ko' | 'en';
}

const SeedDataManagement: React.FC<SeedDataManagementProps> = ({ currentLanguage }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [seedCount, setSeedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { generateSeedIdeas } = useIdeas(currentLanguage);

  const text = {
    ko: {
      title: '시드 데이터 관리',
      generateSeeds: '데모 아이디어 생성',
      deleteSeeds: '데모 아이디어 삭제',
      refreshCount: '개수 새로고침',
      generating: '생성 중...',
      deleting: '삭제 중...',
      refreshing: '새로고침 중...',
      description: '앱에 표시될 데모 아이디어를 관리합니다. (최대 10개)',
      currentCount: '현재 시드 아이디어 개수:',
      confirmDelete: '모든 데모 아이디어를 삭제하시겠습니까?',
      deleteSuccess: '데모 아이디어가 삭제되었습니다.',
      deleteError: '데모 아이디어 삭제 중 오류가 발생했습니다.',
      noSeedData: '현재 생성된 시드 데이터가 없습니다.',
      maxLimitReached: '최대 개수(10개)에 도달했습니다.'
    },
    en: {
      title: 'Seed Data Management',
      generateSeeds: 'Generate Demo Ideas',
      deleteSeeds: 'Delete Demo Ideas',
      refreshCount: 'Refresh Count',
      generating: 'Generating...',
      deleting: 'Deleting...',
      refreshing: 'Refreshing...',
      description: 'Manage demo ideas displayed in the app. (Max 10)',
      currentCount: 'Current seed ideas count:',
      confirmDelete: 'Are you sure you want to delete all demo ideas?',
      deleteSuccess: 'Demo ideas deleted successfully.',
      deleteError: 'Error occurred while deleting demo ideas.',
      noSeedData: 'No seed data currently generated.',
      maxLimitReached: 'Maximum limit (10) reached.'
    }
  };

  const fetchSeedCount = async () => {
    try {
      console.log('Fetching seed count...');
      const { data, error } = await supabase
        .from('ideas')
        .select('id', { count: 'exact' })
        .eq('seed', true);

      if (error) {
        console.error('Error fetching seed count:', error);
        throw error;
      }

      const count = data?.length || 0;
      console.log('Seed count:', count);
      setSeedCount(count);
    } catch (error) {
      console.error('Error fetching seed count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeedCount();
  }, []);

  const handleGenerateSeeds = async () => {
    console.log('Generate seeds button clicked');
    setIsGenerating(true);
    try {
      await generateSeedIdeas();
      // Wait a bit for the data to be inserted, then refresh count
      setTimeout(async () => {
        await fetchSeedCount();
      }, 1000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteSeeds = async () => {
    if (!confirm(text[currentLanguage].confirmDelete)) return;

    console.log('Delete seeds confirmed');
    setIsDeleting(true);
    try {
      // First, get all seed idea IDs
      const { data: seedIdeas, error: fetchError } = await supabase
        .from('ideas')
        .select('id')
        .eq('seed', true);

      if (fetchError) throw fetchError;

      if (seedIdeas && seedIdeas.length > 0) {
        const seedIdeaIds = seedIdeas.map(idea => idea.id);
        console.log('Deleting seed ideas:', seedIdeaIds.length);

        // Delete likes for seed ideas first
        await supabase
          .from('idea_likes')
          .delete()
          .in('idea_id', seedIdeaIds);

        // Delete seed ideas
        const { error } = await supabase
          .from('ideas')
          .delete()
          .eq('seed', true);

        if (error) throw error;
      }

      toast({
        title: text[currentLanguage].deleteSuccess,
        duration: 3000,
      });

      await fetchSeedCount(); // Refresh count after deletion
      
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

  const handleRefreshCount = async () => {
    setLoading(true);
    await fetchSeedCount();
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
        
        {/* Seed Count Info */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-blue-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {text[currentLanguage].currentCount} {loading ? text[currentLanguage].refreshing : seedCount}
                </p>
                {seedCount === 0 && !loading && (
                  <p className="text-sm text-blue-600">
                    {text[currentLanguage].noSeedData}
                  </p>
                )}
                {seedCount >= 10 && (
                  <p className="text-sm text-amber-600">
                    {text[currentLanguage].maxLimitReached}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={handleRefreshCount}
              disabled={loading}
              variant="ghost"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleGenerateSeeds}
            disabled={isGenerating || seedCount >= 10}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Rocket className="h-4 w-4 mr-2" />
            {isGenerating ? text[currentLanguage].generating : text[currentLanguage].generateSeeds}
          </Button>
          <Button
            onClick={handleDeleteSeeds}
            disabled={isDeleting || seedCount === 0}
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
