
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SimpleIdeaInputProps {
  currentLanguage: 'ko' | 'en';
  onSubmit: (idea: string) => Promise<void>;
  isSubmitting: boolean;
}

const SimpleIdeaInput: React.FC<SimpleIdeaInputProps> = ({
  currentLanguage,
  onSubmit,
  isSubmitting
}) => {
  const [ideaText, setIdeaText] = useState('');

  const text = {
    ko: {
      placeholder: '당신의 아이디어를 적어보세요...',
      submitButton: '아이디어 제출하기'
    },
    en: {
      placeholder: 'Write your idea here...',
      submitButton: 'Submit Idea'
    }
  };

  const handleSubmit = async () => {
    if (ideaText.trim()) {
      await onSubmit(ideaText.trim());
      setIdeaText('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Textarea
        value={ideaText}
        onChange={(e) => setIdeaText(e.target.value)}
        placeholder={text[currentLanguage].placeholder}
        className="w-full min-h-[160px] border-2 border-gray-300 focus:border-blue-500 text-lg p-6 resize-none mb-8 rounded-xl"
        style={{ fontSize: '18px' }}
        maxLength={500}
      />
      
      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={!ideaText.trim() || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-xl"
          size="lg"
        >
          {text[currentLanguage].submitButton}
        </Button>
      </div>
    </div>
  );
};

export default SimpleIdeaInput;
