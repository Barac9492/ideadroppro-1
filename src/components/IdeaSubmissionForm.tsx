
import React, { useState } from 'react';
import { Send, Loader, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkInappropriateContent, getContentWarning } from '@/utils/contentFilter';

interface IdeaSubmissionFormProps {
  currentLanguage: 'ko' | 'en';
  onSubmit: (idea: string) => Promise<void>;
}

const IdeaSubmissionForm: React.FC<IdeaSubmissionFormProps> = ({ currentLanguage, onSubmit }) => {
  const [idea, setIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const text = {
    ko: {
      placeholder: '당신의 혁신적인 아이디어를 500자 이내로 공유해주세요...',
      submit: 'AI 분석으로 아이디어 제출',
      submitting: 'AI가 분석 중입니다...',
      charCount: '글자',
      guidelines: '커뮤니티 가이드라인: 폭력적이거나 성적인 내용, 혐오 표현은 금지됩니다.'
    },
    en: {
      placeholder: 'Share your innovative idea in 500 characters or less...',
      submit: 'Submit Idea with AI Analysis',
      submitting: 'AI is analyzing...',
      charCount: 'characters',
      guidelines: 'Community Guidelines: Violent, sexual, or hateful content is prohibited.'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      {showWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div>
              <p className="font-medium">{warning.title}</p>
              <p className="text-sm mt-1">{warning.message}</p>
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
