
import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface IdeaSubmissionFormProps {
  currentLanguage: 'ko' | 'en';
  onSubmit: (idea: string) => Promise<void>;
}

const IdeaSubmissionForm: React.FC<IdeaSubmissionFormProps> = ({ currentLanguage, onSubmit }) => {
  const [idea, setIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const text = {
    ko: {
      placeholder: '당신의 혁신적인 아이디어를 500자 이내로 공유해주세요...',
      submit: '아이디어 제출',
      submitting: '제출 중...',
      charCount: '글자'
    },
    en: {
      placeholder: 'Share your innovative idea in 500 characters or less...',
      submit: 'Submit Idea',
      submitting: 'Submitting...',
      charCount: 'characters'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim().length === 0 || idea.length > 500) return;

    setIsSubmitting(true);
    try {
      await onSubmit(idea.trim());
      setIdea('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 500 - idea.length;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder={text[currentLanguage].placeholder}
            className="min-h-[120px] resize-none border-2 border-purple-100 focus:border-purple-400 transition-colors duration-300"
            maxLength={500}
          />
          <div className={`absolute bottom-3 right-3 text-sm ${remainingChars < 50 ? 'text-red-500' : 'text-gray-400'}`}>
            {remainingChars} {text[currentLanguage].charCount}
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={idea.trim().length === 0 || idea.length > 500 || isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span>{text[currentLanguage].submitting}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
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
