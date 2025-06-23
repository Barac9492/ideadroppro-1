
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import RemixButton from '@/components/RemixButton';
import { useRemixOperations } from '@/hooks/useRemixOperations';

interface RemixableIdeasSectionProps {
  currentLanguage: 'ko' | 'en';
}

interface Idea {
  id: string;
  text: string;
  score: number;
  user_id: string;
  remix_count: number;
  remix_chain_depth: number;
  likes_count: number;
  created_at: string;
  profiles?: {
    username: string;
  };
}

const RemixableIdeasSection: React.FC<RemixableIdeasSectionProps> = ({
  currentLanguage
}) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { createRemix, isRemixing } = useRemixOperations({
    currentLanguage,
    fetchIdeas: fetchRemixableIdeas
  });

  const text = {
    ko: {
      title: '리믹스 가능한 아이디어',
      subtitle: '다른 사용자들의 아이디어를 개선해보세요',
      score: '점수',
      remixes: '개의 리믹스',
      likes: '좋아요',
      by: '작성자',
      loading: '아이디어를 불러오는 중...',
      noIdeas: '현재 리믹스 가능한 아이디어가 없습니다',
      loginToRemix: '리믹스하려면 로그인하세요'
    },
    en: {
      title: 'Remixable Ideas',
      subtitle: 'Improve other users\' ideas',
      score: 'Score',
      remixes: 'remixes',
      likes: 'likes',
      by: 'by',
      loading: 'Loading ideas...',
      noIdeas: 'No remixable ideas available',
      loginToRemix: 'Login to remix ideas'
    }
  };

  async function fetchRemixableIdeas() {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          id,
          text,
          score,
          user_id,
          remix_count,
          remix_chain_depth,
          likes_count,
          created_at,
          profiles:user_id (username)
        `)
        .neq('user_id', user?.id || '')
        .gte('score', 6.0)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching remixable ideas:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRemixableIdeas();
  }, [user]);

  const handleRemix = async (ideaId: string, remixText: string) => {
    const originalIdea = ideas.find(idea => idea.id === ideaId);
    if (originalIdea) {
      await createRemix(ideaId, remixText, originalIdea.score);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{text[currentLanguage].loading}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
      </CardHeader>
      <CardContent>
        {ideas.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {text[currentLanguage].noIdeas}
          </p>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2 leading-relaxed">{idea.text}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{text[currentLanguage].by} @{idea.profiles?.username || 'anonymous'}</span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Star className="w-3 h-3 mr-1" />
                        {idea.score.toFixed(1)} {text[currentLanguage].score}
                      </Badge>
                      {idea.remix_count > 0 && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {idea.remix_count} {text[currentLanguage].remixes}
                        </Badge>
                      )}
                      {idea.likes_count > 0 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Users className="w-3 h-3 mr-1" />
                          {idea.likes_count} {text[currentLanguage].likes}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <RemixButton
                      originalText={idea.text}
                      originalScore={idea.score}
                      remixCount={idea.remix_count}
                      chainDepth={idea.remix_chain_depth}
                      onRemix={(remixText) => handleRemix(idea.id, remixText)}
                      isRemixing={isRemixing}
                      currentLanguage={currentLanguage}
                      isAuthenticated={!!user}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!user && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-700">{text[currentLanguage].loginToRemix}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RemixableIdeasSection;
