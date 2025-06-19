
import React, { useState } from 'react';
import { Heart, Star, Clock, Zap, TrendingUp, Users, Award, Rocket, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Idea {
  id: string;
  text: string;
  score: number;
  tags: string[];
  likes: number;
  hasLiked: boolean;
  timestamp: Date;
  aiAnalysis?: string;
  improvements?: string[];
  marketPotential?: string[];
  similarIdeas?: string[];
  pitchPoints?: string[];
  finalVerdict?: string;
  seed?: boolean;
}

interface IdeaCardProps {
  idea: Idea;
  currentLanguage: 'ko' | 'en';
  onLike: (ideaId: string) => void;
  onGenerateAnalysis: (ideaId: string) => Promise<void>;
  onSaveFinalVerdict?: (ideaId: string, verdict: string) => void;
  isAdmin?: boolean;
  isAuthenticated: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  currentLanguage, 
  onLike, 
  onGenerateAnalysis,
  onSaveFinalVerdict,
  isAdmin = false,
  isAuthenticated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalVerdict, setFinalVerdict] = useState(idea.finalVerdict || '');
  const [isSavingVerdict, setIsSavingVerdict] = useState(false);
  const navigate = useNavigate();

  const text = {
    ko: {
      score: '점수',
      likes: '좋아요',
      timeAgo: '전',
      generateAnalysis: 'AI 분석 생성',
      generating: '분석 중...',
      improvements: '개선 피드백',
      marketPotential: '시장 잠재력',
      similarIdeas: '유사 아이디어',
      pitchPoints: '피치덱 포인트',
      aiAnalysis: 'AI 분석',
      finalVerdict: 'VC 최종 평가',
      saveVerdict: '평가 저장',
      savingVerdict: '저장 중...',
      verdictPlaceholder: 'VC로서 이 아이디어에 대한 최종 평가를 작성해주세요...',
      demoIdea: '데모 아이디어',
      loginToInteract: '로그인 후 이용 가능',
      loginRequired: '로그인이 필요합니다'
    },
    en: {
      score: 'Score',
      likes: 'Likes',
      timeAgo: 'ago',
      generateAnalysis: 'Generate AI Analysis',
      generating: 'Generating...',
      improvements: 'Improvement Feedback',
      marketPotential: 'Market Potential',
      similarIdeas: 'Similar Ideas',
      pitchPoints: 'Pitch Points',
      aiAnalysis: 'AI Analysis',
      finalVerdict: 'VC Final Verdict',
      saveVerdict: 'Save Verdict',
      savingVerdict: 'Saving...',
      verdictPlaceholder: 'Write your final verdict on this idea as a VC...',
      demoIdea: 'Demo Idea',
      loginToInteract: 'Login to interact',
      loginRequired: 'Login required'
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setIsGenerating(true);
    try {
      await onGenerateAnalysis(idea.id);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveVerdict = async () => {
    if (!onSaveFinalVerdict || !finalVerdict.trim()) return;
    
    setIsSavingVerdict(true);
    try {
      await onSaveFinalVerdict(idea.id, finalVerdict.trim());
    } finally {
      setIsSavingVerdict(false);
    }
  };

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    onLike(idea.id);
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}${currentLanguage === 'ko' ? '일' : 'd'} ${text[currentLanguage].timeAgo}`;
    if (hours > 0) return `${hours}${currentLanguage === 'ko' ? '시간' : 'h'} ${text[currentLanguage].timeAgo}`;
    return `${minutes}${currentLanguage === 'ko' ? '분' : 'm'} ${text[currentLanguage].timeAgo}`;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] p-6 mb-6 ${
      idea.seed ? 'border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-gray-700">{idea.score}/10</span>
            <span className="text-sm text-gray-500">{text[currentLanguage].score}</span>
          </div>
          {idea.seed && (
            <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <Rocket className="h-3 w-3 mr-1" />
              🚀 {text[currentLanguage].demoIdea}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Clock className="h-4 w-4" />
          <span>{getTimeAgo(idea.timestamp)}</span>
        </div>
      </div>

      {/* Idea Text */}
      <p className="text-gray-800 text-lg mb-4 leading-relaxed">{idea.text}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {idea.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              idea.seed 
                ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
            }`}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* AI Analysis Section */}
      {idea.aiAnalysis && (
        <div className={`rounded-xl p-4 mb-4 ${
          idea.seed 
            ? 'bg-gradient-to-r from-orange-100 to-amber-100'
            : 'bg-gradient-to-r from-purple-50 to-blue-50'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Zap className={`h-5 w-5 ${idea.seed ? 'text-orange-600' : 'text-purple-600'}`} />
            <span className="font-semibold text-gray-800">{text[currentLanguage].aiAnalysis}</span>
          </div>
          <p className="text-gray-700">{idea.aiAnalysis}</p>
        </div>
      )}

      {/* Detailed Analysis Sections */}
      {idea.improvements && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
            {text[currentLanguage].improvements}
          </h4>
          <ul className="space-y-1">
            {idea.improvements.map((improvement, index) => (
              <li key={index} className="text-gray-600 text-sm">• {improvement}</li>
            ))}
          </ul>
        </div>
      )}

      {idea.marketPotential && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
            {text[currentLanguage].marketPotential}
          </h4>
          <ul className="space-y-1">
            {idea.marketPotential.map((point, index) => (
              <li key={index} className="text-gray-600 text-sm">• {point}</li>
            ))}
          </ul>
        </div>
      )}

      {idea.similarIdeas && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2 text-indigo-600" />
            {text[currentLanguage].similarIdeas}
          </h4>
          <ul className="space-y-1">
            {idea.similarIdeas.map((similarIdea, index) => (
              <li key={index} className="text-gray-600 text-sm">• {similarIdea}</li>
            ))}
          </ul>
        </div>
      )}

      {idea.pitchPoints && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-600" />
            {text[currentLanguage].pitchPoints}
          </h4>
          <ul className="space-y-1">
            {idea.pitchPoints.map((point, index) => (
              <li key={index} className="text-gray-600 text-sm">• {point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Final Verdict Section */}
      {idea.finalVerdict && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4 border-l-4 border-yellow-400">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-gray-800">{text[currentLanguage].finalVerdict}</span>
          </div>
          <p className="text-gray-700">{idea.finalVerdict}</p>
        </div>
      )}

      {/* Admin Final Verdict Input */}
      {isAuthenticated && isAdmin && !idea.finalVerdict && !idea.seed && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4 border-l-4 border-yellow-400">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-gray-800">{text[currentLanguage].finalVerdict}</span>
          </div>
          <Textarea
            value={finalVerdict}
            onChange={(e) => setFinalVerdict(e.target.value)}
            placeholder={text[currentLanguage].verdictPlaceholder}
            className="mb-3 min-h-[80px]"
          />
          <Button
            onClick={handleSaveVerdict}
            disabled={!finalVerdict.trim() || isSavingVerdict}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
          >
            {isSavingVerdict ? text[currentLanguage].savingVerdict : text[currentLanguage].saveVerdict}
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleLikeClick}
          disabled={idea.seed}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
            idea.seed 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : !isAuthenticated
                ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                : idea.hasLiked
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
          }`}
          title={!isAuthenticated ? text[currentLanguage].loginRequired : ''}
        >
          <Heart className={`h-4 w-4 ${idea.hasLiked && isAuthenticated ? 'fill-current' : ''}`} />
          <span>{idea.likes} {text[currentLanguage].likes}</span>
          {!isAuthenticated && !idea.seed && (
            <LogIn className="h-3 w-3 ml-1 opacity-60" />
          )}
        </button>

        {(!idea.improvements || !idea.marketPotential) && !idea.seed && (
          <Button
            onClick={handleGenerateAnalysis}
            disabled={isGenerating}
            className={`${
              !isAuthenticated 
                ? 'bg-gray-400 hover:bg-gray-500' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }`}
            title={!isAuthenticated ? text[currentLanguage].loginRequired : ''}
          >
            {!isAuthenticated ? (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                {text[currentLanguage].loginToInteract}
              </>
            ) : (
              <>
                {isGenerating ? text[currentLanguage].generating : text[currentLanguage].generateAnalysis}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;
