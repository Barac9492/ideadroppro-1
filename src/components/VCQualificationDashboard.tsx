
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Heart, Eye, Zap } from 'lucide-react';

interface VCQualificationDashboardProps {
  score: number;
  likes: number;
  views?: number;
  currentLanguage: 'ko' | 'en';
}

const VCQualificationDashboard: React.FC<VCQualificationDashboardProps> = ({
  score,
  likes,
  views = 0,
  currentLanguage
}) => {
  const text = {
    ko: {
      title: 'VC 검토 진입 현황',
      scoreRequirement: '점수 기준',
      likesRequirement: '좋아요 기준',
      qualified: 'VC 검토 대상',
      almostThere: '거의 달성',
      needsWork: '더 개선 필요',
      vcReview: 'VC 검토 진입!',
      outOf: '점 중',
      needed: '개 필요'
    },
    en: {
      title: 'VC Review Status',
      scoreRequirement: 'Score Requirement',
      likesRequirement: 'Likes Requirement',
      qualified: 'VC Review Ready',
      almostThere: 'Almost There',
      needsWork: 'Needs Improvement',
      vcReview: 'VC Review Ready!',
      outOf: 'out of',
      needed: 'needed'
    }
  };

  const SCORE_THRESHOLD = 8.0;
  const LIKES_THRESHOLD = 10;

  const scoreProgress = Math.min((score / SCORE_THRESHOLD) * 100, 100);
  const likesProgress = Math.min((likes / LIKES_THRESHOLD) * 100, 100);
  
  const isQualified = score >= SCORE_THRESHOLD && likes >= LIKES_THRESHOLD;
  const isClose = scoreProgress >= 70 || likesProgress >= 70;

  const getStatusBadge = () => {
    if (isQualified) {
      return (
        <Badge className="bg-green-500 text-white">
          <Zap className="w-3 h-3 mr-1" />
          {text[currentLanguage].qualified}
        </Badge>
      );
    }
    if (isClose) {
      return (
        <Badge className="bg-yellow-500 text-white">
          {text[currentLanguage].almostThere}
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        {text[currentLanguage].needsWork}
      </Badge>
    );
  };

  return (
    <Card className={`${isQualified ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{text[currentLanguage].title}</h3>
          {getStatusBadge()}
        </div>

        {isQualified && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
            <div className="flex items-center text-green-800">
              <Zap className="w-4 h-4 mr-2" />
              <span className="font-semibold">{text[currentLanguage].vcReview}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Score Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">{text[currentLanguage].scoreRequirement}</span>
              </div>
              <span className="text-sm text-gray-600">
                {score.toFixed(1)} / {SCORE_THRESHOLD} {text[currentLanguage].outOf}
              </span>
            </div>
            <Progress value={scoreProgress} className="h-2" />
          </div>

          {/* Likes Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">{text[currentLanguage].likesRequirement}</span>
              </div>
              <span className="text-sm text-gray-600">
                {likes} / {LIKES_THRESHOLD}
                {likes < LIKES_THRESHOLD && (
                  <span className="text-orange-600 ml-1">
                    ({LIKES_THRESHOLD - likes} {text[currentLanguage].needed})
                  </span>
                )}
              </span>
            </div>
            <Progress value={likesProgress} className="h-2" />
          </div>

          {/* Views (if available) */}
          {views > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>조회수</span>
              </div>
              <span>{views}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VCQualificationDashboard;
