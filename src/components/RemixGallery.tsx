
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Star, Users, ArrowRight, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RemixGalleryProps {
  currentLanguage: 'ko' | 'en';
}

interface RemixIdea {
  id: string;
  text: string;
  score: number;
  remix_chain_depth: number;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
  };
  parent_idea?: {
    id: string;
    text: string;
    profiles?: {
      username: string;
    };
  };
}

const RemixGallery: React.FC<RemixGalleryProps> = ({ currentLanguage }) => {
  const [remixIdeas, setRemixIdeas] = useState<RemixIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const text = {
    ko: {
      title: '리믹스 갤러리',
      subtitle: '커뮤니티의 리믹스 아이디어들을 확인해보세요',
      remixedFrom: '원본:',
      by: '작성자',
      score: '점수',
      depth: '리믹스 단계',
      loading: '리믹스 아이디어를 불러오는 중...',
      noRemixes: '아직 리믹스된 아이디어가 없습니다',
      createFirst: '첫 리믹스를 만들어보세요!'
    },
    en: {
      title: 'Remix Gallery',
      subtitle: 'Explore remixed ideas from the community',
      remixedFrom: 'Remixed from:',
      by: 'by',
      score: 'Score',
      depth: 'Remix Level',
      loading: 'Loading remix ideas...',
      noRemixes: 'No remixed ideas yet',
      createFirst: 'Create the first remix!'
    }
  };

  useEffect(() => {
    fetchRemixIdeas();
  }, []);

  const fetchRemixIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          id,
          text,
          score,
          remix_chain_depth,
          created_at,
          user_id,
          profiles:user_id (username),
          parent_idea:remix_parent_id (
            id,
            text,
            profiles:user_id (username)
          )
        `)
        .not('remix_parent_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setRemixIdeas(data || []);
    } catch (error) {
      console.error('Error fetching remix ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Car
        <CardContent className="p-6 text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{text[currentLanguage].loading}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{text[currentLanguage].title}</h2>
        <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
      </div>

      {/* Remix ideas */}
      {remixIdeas.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">{text[currentLanguage].noRemixes}</p>
            <p className="text-sm text-gray-500">{text[currentLanguage].createFirst}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {remixIdeas.map((idea) => (
            <Card key={idea.id} className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Remix chain indicator */}
                  <div className="flex items-center space-x-2 text-sm text-purple-600">
                    <GitBranch className="w-4 h-4" />
                    <span>{text[currentLanguage].depth} {idea.remix_chain_depth}</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      리믹스
                    </Badge>
                  </div>

                  {/* Remix idea */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-gray-800 leading-relaxed mb-3">{idea.text}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>{text[currentLanguage].by} @{idea.profiles?.username || 'anonymous'}</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          <span>{idea.score?.toFixed(1) || '0.0'} {text[currentLanguage].score}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-gray-400" />
                          <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Original idea */}
                  {idea.parent_idea && (
                    <div className="ml-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <ArrowRight className="w-3 h-3" />
                        <span>{text[currentLanguage].remixedFrom}</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed mb-2 line-clamp-2">
                          {idea.parent_idea.text}
                        </p>
                        <p className="text-xs text-gray-500">
                          {text[currentLanguage].by} @{idea.parent_idea.profiles?.username || 'anonymous'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RemixGallery;
