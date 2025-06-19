
import React, { useState, useEffect } from 'react';
import { Send, Loader, Zap, AlertTriangle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkInappropriateContent, getContentWarning } from '@/utils/contentFilter';
import { useNavigate } from 'react-router-dom';

interface IdeaSubmissionFormProps {
  currentLanguage: 'ko' | 'en';
  onSubmit: (idea: string) => Promise<void>;
  initialText?: string;
  isAuthenticated: boolean;
}

const IdeaSubmissionForm: React.FC<IdeaSubmissionFormProps> = ({ 
  currentLanguage, 
  onSubmit, 
  initialText = '',
  isAuthenticated
}) => {
  const [idea, setIdea] = useState(initialText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  // Update idea text when initialText prop changes
  useEffect(() => {
    if (initialText && initialText !== idea) {
      setIdea(initialText);
    }
  }, [initialText]);

  const text = {
    ko: {
      placeholder: '당신의 혁신적인 아이디어를 500자 이내로 공유해주세요...',
      submit: 'AI 분석으로 아이디어 제출',
      submitting: 'AI가 분석 중입니다...',
      charCount: '글자',
      guidelines: '커뮤니티 가이드라인: 폭력적이거나 성적인 내용, 혐오 표현은 금지됩니다.',
      loginRequired: '아이디어를 제출하려면 로그인이 필요합니다',
      loginButton: '로그인 / 회원가입',
      loginDescription: '로그인하여 혁신적인 아이디어를 공유하고 AI 피드백을 받아보세요!'
    },
    en: {
      placeholder: 'Share your innovative idea in 500 characters or less...',
      submit: 'Submit Idea with AI Analysis',
      submitting: 'AI is analyzing...',
      charCount: 'characters',
      guidelines: 'Community Guidelines: Violent, sexual, or hateful content is prohibited.',
      loginRequired: 'Login required to submit ideas',
      loginButton: 'Sign In / Sign Up',
      loginDescription: 'Sign in to share your innovative ideas and get instant AI feedback!'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (idea.trim().length === 0 || idea.length > 500) return;

    // Check for inappropriate content before submission
    if (checkInappropriateContent(idea.trim(), currentLanguage)) {
      setShowWarning(true);
      return;
    }

    setIsSubmitting(true);
    setShowWarning(false);
    try {
      await onSubmit(idea.trim());
      setIdea('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIdea(e.target.value);
    setShowWarning(false);
  };

  const remainingChars = 500 - idea.length;
  const warning = getContentWarning(currentLanguage);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="text-center">
          <div className="mb-4">
            <LogIn className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {text[currentLanguage].loginRequired}
            </h3>
            <p className="text-gray-600 mb-6">
              {text[currentLanguage].loginDescription}
            </p>
          </div>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <LogIn className="h-4 w-4 mr-2" />
            {text[currentLanguage].loginButton}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      {showWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div>
              <p className="font-medium">{warning[currentLanguage].title}</p>
              <p className="text-sm mt-1">{warning[currentLanguage].message}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={idea}
            onChange={handleTextChange}
            placeholder={text[currentLanguage].placeholder}
            className="min-h-[120px] resize-none border-2 border-purple-100 focus:border-purple-400 transition-colors duration-300"
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className={`absolute bottom-3 right-3 text-sm ${remainingChars < 50 ? 'text-red-500' : 'text-gray-400'}`}>
            {remainingChars} {text[currentLanguage].charCount}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <AlertTriangle className="h-3 w-3 inline mr-1" />
          {text[currentLanguage].guidelines}
        </div>
        
        <Button
          type="submit"
          disabled={idea.trim().length === 0 || idea.length > 500 || isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Loader className="h-4 w-4 animate-spin" />
              <Zap className="h-4 w-4 animate-pulse text-yellow-300" />
              <span>{text[currentLanguage].submitting}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <Send className="h-4 w-4" />
              <span>{text[currentLanguage].submit}</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default IdeaSubmissionForm;
