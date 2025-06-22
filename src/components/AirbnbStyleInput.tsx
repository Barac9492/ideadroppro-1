
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

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
      placeholder: '아이디어를 입력하세요',
      submitButton: 'AI로 구체화하기'
    },
    en: {
      placeholder: 'Enter your idea',
      submitButton: 'Elaborate with AI'
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
    <div className="w-full max-w-5xl mx-auto mb-20">
      {/* Large centered search container */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 hover:shadow-3xl transition-all duration-300">
        <div className="flex items-center">
          <div className="flex-1 flex items-center px-8 py-6">
            <textarea
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={text[currentLanguage].placeholder}
              className="w-full resize-none border-none outline-none text-gray-900 placeholder-gray-400 text-xl leading-relaxed font-medium"
              rows={2}
              style={{ 
                minHeight: '60px',
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
          >
            <Bot className="w-5 h-5 mr-2" />
            {text[currentLanguage].submitButton}
          </Button>
        </div>
      </div>

      {/* Visual benefit indicators */}
      <div className="flex justify-center items-center mt-8 space-x-8 text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium">AI 분석</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm font-medium">즉시 구체화</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">VC 매칭</span>
        </div>
      </div>
    </div>
  );
};

export default AirbnbStyleInput;
