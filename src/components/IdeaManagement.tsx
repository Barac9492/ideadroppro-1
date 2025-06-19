
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, AlertTriangle, User, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Idea {
  id: string;
  text: string;
  score: number;
  tags: string[];
  created_at: string;
  user_id: string;
  profiles?: {
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

  const text = {
    ko: {
      title: '아이디어 관리',
      deleteIdea: '아이디어 삭제',
      confirmDelete: '정말로 이 아이디어를 삭제하시겠습니까?',
      deleted: '아이디어가 삭제되었습니다',
      deleteError: '아이디어 삭제 중 오류가 발생했습니다',
      score: '점수',
      by: '작성자',
      date: '작성일',
      noIdeas: '관리할 아이디어가 없습니다'
    },
    en: {
      title: 'Idea Management',
      deleteIdea: 'Delete Idea',
      confirmDelete: 'Are you sure you want to delete this idea?',
      deleted: 'Idea deleted successfully',
      deleteError: 'Error deleting idea',
      score: 'Score',
      by: 'By',
      date: 'Date',
      noIdeas: 'No ideas to manage'
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          profiles(username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our Idea interface
      const transformedData: Idea[] = (data || []).map(item => ({
        id: item.id,
        text: item.text,
        score: item.score || 0,
        tags: item.tags || [],
        created_at: item.created_at,
        user_id: item.user_id,
        profiles: item.profiles ? { username: item.profiles.username } : null
      }));
      
      setIdeas(transformedData);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteIdea = async (ideaId: string) => {
    if (!confirm(text[currentLanguage].confirmDelete)) return;

    setDeletingId(ideaId);
    try {
      // Delete related likes first
      await supabase
        .from('idea_likes')
        .delete()
        .eq('idea_id', ideaId);

      // Delete the idea
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: text[currentLanguage].deleted,
        duration: 3000,
      });

      fetchIdeas();
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast({
        title: text[currentLanguage].deleteError,
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setDeletingId(null);
    }
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
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ideas.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {text[currentLanguage].noIdeas}
          </p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ideas.map(idea => (
              <div key={idea.id} className="border rounded-lg p-4">
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
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteIdea(idea.id)}
                    disabled={deletingId === idea.id}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === idea.id ? 'Deleting...' : text[currentLanguage].deleteIdea}
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
