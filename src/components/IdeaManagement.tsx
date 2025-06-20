import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, AlertTriangle, User, Calendar, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Idea {
  id: string;
  text: string;
  score: number;
  tags: string[];
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
  } | null;
}

interface IdeaManagementProps {
  currentLanguage: 'ko' | 'en';
}

const IdeaManagement: React.FC<IdeaManagementProps> = ({ currentLanguage }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const text = {
    ko: {
      title: '아이디어 관리',
      deleteIdea: '삭제',
      confirmDelete: '정말로 이 아이디어를 삭제하시겠습니까?',
      deleted: '아이디어가 삭제되었습니다',
      deleteError: '아이디어 삭제 중 오류가 발생했습니다',
      score: '점수',
      by: '작성자',
      date: '작성일',
      noIdeas: '관리할 아이디어가 없습니다',
      refresh: '새로고침',
      deleting: '삭제 중...'
    },
    en: {
      title: 'Idea Management',
      deleteIdea: 'Delete',
      confirmDelete: 'Are you sure you want to delete this idea?',
      deleted: 'Idea deleted successfully',
      deleteError: 'Error deleting idea',
      score: 'Score',
      by: 'By',
      date: 'Date',
      noIdeas: 'No ideas to manage',
      refresh: 'Refresh',
      deleting: 'Deleting...'
    }
  };

  useEffect(() => {
    fetchIdeas();
    
    // Set up real-time subscription for idea changes
    const channel = supabase
      .channel('idea-management-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas'
        },
        (payload) => {
          console.log('Real-time idea change in management:', payload);
          
          if (payload.eventType === 'DELETE') {
            // Remove deleted idea from state immediately
            console.log('Removing deleted idea from management state:', payload.old.id);
            setIdeas(prev => prev.filter(idea => idea.id !== payload.old.id));
          } else {
            // For other changes, refetch to ensure consistency
            fetchIdeas();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchIdeas = async () => {
    try {
      setRefreshing(true);
      console.log('Fetching ideas for management...');
      
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          id,
          text,
          score,
          tags,
          created_at,
          user_id,
          profiles!inner(username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ideas:', error);
        throw error;
      }
      
      console.log('✅ Fetched ideas in management:', data?.length);
      setIdeas(data || []);
    } catch (error) {
      console.error('❌ Error fetching ideas:', error);
      toast({
        title: currentLanguage === 'ko' ? '데이터 로드 오류' : 'Data Load Error',
        description: currentLanguage === 'ko' ? 
          '아이디어 목록을 불러오는 중 오류가 발생했습니다.' : 
          'Error occurred while loading ideas list.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteIdea = async (ideaId: string) => {
    if (!confirm(text[currentLanguage].confirmDelete)) return;

    setDeletingId(ideaId);
    
    try {
      console.log('🗑️ Starting deletion process for idea:', ideaId);
      
      // Use a transaction-like approach with proper error handling
      
      // Step 1: Delete related likes first
      console.log('🔗 Deleting related likes...');
      const { error: likesError } = await supabase
        .from('idea_likes')
        .delete()
        .eq('idea_id', ideaId);

      if (likesError) {
        console.warn('⚠️ Warning deleting likes (may not exist):', likesError);
        // Continue with idea deletion even if likes deletion fails
      } else {
        console.log('✅ Likes deleted successfully');
      }

      // Step 2: Delete the idea
      console.log('💡 Deleting idea...');
      const { error: ideaError, data: deletedData } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId)
        .select(); // Get deleted data to confirm deletion

      if (ideaError) {
        console.error('❌ Error deleting idea:', ideaError);
        throw new Error(`Failed to delete idea: ${ideaError.message}`);
      }

      console.log('✅ Idea deleted successfully:', { ideaId, deletedData });
      
      // Verify deletion by checking if data was actually deleted
      if (!deletedData || deletedData.length === 0) {
        console.warn('⚠️ Warning: No data returned from delete operation');
      }
      
      // Remove from local state immediately (real-time will also handle this)
      setIdeas(prev => {
        const filtered = prev.filter(idea => idea.id !== ideaId);
        console.log('🔄 Updated local state, removed idea. Remaining:', filtered.length);
        return filtered;
      });
      
      toast({
        title: text[currentLanguage].deleted,
        description: `ID: ${ideaId.substring(0, 8)}...`,
        duration: 3000,
      });

    } catch (error: any) {
      console.error('❌ Deletion failed:', error);
      
      toast({
        title: text[currentLanguage].deleteError,
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh requested');
    fetchIdeas();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading ideas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{text[currentLanguage].title}</span>
          </CardTitle>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{text[currentLanguage].refresh}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {ideas.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {text[currentLanguage].noIdeas}
          </p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ideas.map(idea => (
              <div key={idea.id} className={`border rounded-lg p-4 transition-opacity ${deletingId === idea.id ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-start space-x-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      {idea.text.length > 100 ? `${idea.text.substring(0, 100)}...` : idea.text}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <span>{text[currentLanguage].score}: {idea.score}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{text[currentLanguage].by}: {idea.profiles?.username || 'Anonymous'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{text[currentLanguage].date}: {new Date(idea.created_at).toLocaleDateString()}</span>
                      </span>
                      <span className="text-xs font-mono bg-gray-100 px-1 rounded">
                        ID: {idea.id.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteIdea(idea.id)}
                    disabled={deletingId === idea.id}
                    variant="destructive"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>
                      {deletingId === idea.id ? text[currentLanguage].deleting : text[currentLanguage].deleteIdea}
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IdeaManagement;
