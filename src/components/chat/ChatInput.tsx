
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowRight } from 'lucide-react';

interface ChatInputProps {
  currentInput: string;
  setCurrentInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  currentLanguage: 'ko' | 'en';
  isCompleted: boolean;
  currentModuleIndex: number;
  moduleTypesLength: number;
  canSubmit?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  currentInput,
  setCurrentInput,
  onSubmit,
  isLoading,
  currentLanguage,
  isCompleted,
  currentModuleIndex,
  moduleTypesLength,
  canSubmit = true
}) => {
  const text = {
    ko: {
      placeholder: '자세히 설명해주세요...',
      continue: '계속하기',
      processing: '처리 중...'
    },
    en: {
      placeholder: 'Please explain in detail...',
      continue: 'Continue',
      processing: 'Processing...'
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit && currentInput.trim()) {
        onSubmit();
      }
    }
  };

  if (isCompleted || currentModuleIndex >= moduleTypesLength) {
    return null;
  }

  return (
    <div className="p-6 border-t border-gray-100">
      <Textarea
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={text[currentLanguage].placeholder}
        className="w-full mb-4 min-h-[120px] resize-none border-2 border-purple-100 focus:border-purple-300 text-base"
        disabled={isLoading}
      />
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {currentInput.length}/500
          {isLoading && (
            <span className="ml-2 text-blue-600">
              {text[currentLanguage].processing}
            </span>
          )}
        </div>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {text[currentLanguage].continue}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
