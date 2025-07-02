
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, MessageSquare } from 'lucide-react';
import { useIdeaHistory } from '@/hooks/useIdeaHistory';

interface IdeaHistoryCardProps {
  currentLanguage: 'ko' | 'en';
}

const IdeaHistoryCard: React.FC<IdeaHistoryCardProps> = ({ currentLanguage }) => {
  const { ideas, loading } = useIdeaHistory();

  const text = {
    ko: {
      title: '내 아이디어 히스토리',
      noIdeas: '아직 제출한 아이디어가 없습니다',
      startCreating: '첫 번째 아이디어를 만들어보세요!',
      score: '점수',
      analyzed: '분석됨',
      pending: '분석 대기중'
    },
    en: {
      title: 'My Idea History',
      noIdeas: 'No ideas submitted yet',
      startCreating: 'Create your first idea!',
      score: 'Score',
      analyzed: 'Analyzed',
      pending: 'Pending Analysis'
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>{text[currentLanguage].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ideas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-2">{text[currentLanguage].noIdeas}</p>
            <p className="text-sm">{text[currentLanguage].startCreating}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ideas.map((idea) => (
              <div key={idea.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {idea.text}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                      {idea.ai_analysis && (
                        <Badge variant="outline" className="text-xs">
                          {text[currentLanguage].analyzed}
                        </Badge>
                      )}
                      {!idea.ai_analysis && (
                        <Badge variant="secondary" className="text-xs">
                          {text[currentLanguage].pending}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {idea.score > 0 && (
                    <div className="flex items-center space-x-1 ml-4">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-gray-900">{idea.score}</span>
                    </div>
                  )}
                </div>
                
                {idea.final_verdict && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {idea.final_verdict}
                  </p>
                )}
                
                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {idea.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IdeaHistoryCard;
