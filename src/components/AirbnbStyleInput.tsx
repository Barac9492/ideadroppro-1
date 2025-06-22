
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';

interface AirbnbStyleInputProps {
  currentLanguage: 'ko' | 'en';
  onSubmit: (idea: string) => Promise<void>;
  isSubmitting: boolean;
}

const AirbnbStyleInput: React.FC<AirbnbStyleInputProps> = ({
  currentLanguage,
  onSubmit,
  isSubmitting
}) => {
  const [ideaText, setIdeaText] = useState('');

  const text = {
    ko: {
      placeholder: '어떤 아이디어든 환영합니다. 예: "AI로 반려동물 건강 체크", "중고차 실시간 경매"...',
      submitButton: '아이디어 제출하기'
    },
    en: {
      placeholder: 'Any idea is welcome. e.g. "AI pet health checker", "Real-time used car auction"...',
      submitButton: 'Submit Idea'
    }
  };

  const handleSubmit = async () => {
    if (ideaText.trim()) {
      await onSubmit(ideaText.trim());
      setIdeaText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (ideaText.trim()) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Airbnb-style search container */}
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center">
          <div className="flex-1 flex items-center px-6 py-4">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <textarea
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={text[currentLanguage].placeholder}
              className="w-full resize-none border-none outline-none text-gray-900 placeholder-gray-500 text-base leading-relaxed"
              rows={1}
              style={{ 
                minHeight: '24px',
                maxHeight: '120px',
                overflow: 'hidden'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!ideaText.trim() || isSubmitting}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {text[currentLanguage].submitButton}
          </Button>
        </div>
      </div>
      
      {/* Character count */}
      <div className="text-center mt-3">
        <p className="text-sm text-gray-400">
          {ideaText.length}/500
        </p>
      </div>
    </div>
  );
};

export default AirbnbStyleInput;
