
import React from 'react';
import { Heart, LogIn, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IdeaCardActionsProps {
  likes: number;
  hasLiked: boolean;
  isSeed?: boolean;
  isAuthenticated: boolean;
  isGenerating: boolean;
  isGeneratingGlobal?: boolean;
  showGenerateButton: boolean;
  showGlobalButton?: boolean;
  onLike: () => void;
  onGenerateAnalysis: () => void;
  onGenerateGlobalAnalysis?: () => void;
  currentLanguage: 'ko' | 'en';
}

const IdeaCardActions: React.FC<IdeaCardActionsProps> = ({
  likes,
  hasLiked,
  isSeed = false,
  isAuthenticated,
  isGenerating,
  isGeneratingGlobal = false,
  showGenerateButton,
  showGlobalButton = false,
  onLike,
  onGenerateAnalysis,
  onGenerateGlobalAnalysis,
  currentLanguage
}) => {
  const text = {
    ko: {
      likes: '좋아요',
      generateAnalysis: 'AI 분석 생성',
      generating: '분석 중...',
      goGlobal: '🌍 Go Global',
      generatingGlobal: '글로벌 분석 중...',
      loginToInteract: '로그인 후 이용 가능',
      loginRequired: '로그인이 필요합니다'
    },
    en: {
      likes: 'Likes',
      generateAnalysis: 'Generate AI Analysis',
      generating: 'Generating...',
      goGlobal: '🌍 Go Global',
      generatingGlobal: 'Analyzing Global Market...',
      loginToInteract: 'Login to interact',
      loginRequired: 'Login required'
    }
  };

  return (
    <div className="space-y-4">
      {/* Go Global Button - Prominent placement */}
      {showGlobalButton && !isSeed && (
        <div className="flex justify-center">
          <Button
            onClick={onGenerateGlobalAnalysis}
            disabled={isGeneratingGlobal || !isAuthenticated}
            className={`${
              !isAuthenticated 
                ? 'bg-gray-400 hover:bg-gray-500' 
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-all duration-200'
            } text-white font-semibold px-6 py-3 text-lg rounded-xl`}
            title={!isAuthenticated ? text[currentLanguage].loginRequired : ''}
          >
            {!isAuthenticated ? (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                {text[currentLanguage].loginToInteract}
              </>
            ) : (
              <>
                <Globe className="h-5 w-5 mr-2" />
                {isGeneratingGlobal ? text[currentLanguage].generatingGlobal : text[currentLanguage].goGlobal}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Regular actions row */}
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
    </div>
  );
};

export default IdeaCardActions;
