
import React from 'react';
import { Heart, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IdeaCardActionsProps {
  likes: number;
  hasLiked: boolean;
  isSeed?: boolean;
  isAuthenticated: boolean;
  isGenerating: boolean;
  showGenerateButton: boolean;
  onLike: () => void;
  onGenerateAnalysis: () => void;
  currentLanguage: 'ko' | 'en';
}

const IdeaCardActions: React.FC<IdeaCardActionsProps> = ({
  likes,
  hasLiked,
  isSeed = false,
  isAuthenticated,
  isGenerating,
  showGenerateButton,
  onLike,
  onGenerateAnalysis,
  currentLanguage
}) => {
  const text = {
    ko: {
      likes: '좋아요',
      generateAnalysis: 'AI 분석 생성',
      generating: '분석 중...',
      loginToInteract: '로그인 후 이용 가능',
      loginRequired: '로그인이 필요합니다'
    },
    en: {
      likes: 'Likes',
      generateAnalysis: 'Generate AI Analysis',
      generating: 'Generating...',
      loginToInteract: 'Login to interact',
      loginRequired: 'Login required'
    }
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <button
        onClick={onLike}
        disabled={isSeed}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
          isSeed 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : !isAuthenticated
              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              : hasLiked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
        }`}
        title={!isAuthenticated ? text[currentLanguage].loginRequired : ''}
      >
        <Heart className={`h-4 w-4 ${hasLiked && isAuthenticated ? 'fill-current' : ''}`} />
        <span>{likes} {text[currentLanguage].likes}</span>
        {!isAuthenticated && !isSeed && (
          <LogIn className="h-3 w-3 ml-1 opacity-60" />
        )}
      </button>

      {showGenerateButton && !isSeed && (
        <Button
          onClick={onGenerateAnalysis}
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
  );
};

export default IdeaCardActions;
