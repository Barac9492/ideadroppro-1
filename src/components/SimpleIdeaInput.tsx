
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Lightbulb } from 'lucide-react';

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
      placeholder: '어떤 아이디어든 좋습니다...\n\n예시: "배달음식 포장지를 재활용하는 앱"',
      submitButton: '투자자에게 전송',
      examples: ['AI 농업 솔루션', '블록체인 투표 시스템', '친환경 배송 서비스']
    },
    en: {
      placeholder: 'Any idea is welcome...\n\nExample: "App to recycle food delivery packaging"',
      submitButton: 'Send to Investors',
      examples: ['AI Agriculture Solution', 'Blockchain Voting System', 'Eco-friendly Delivery']
    }
  };

  const handleSubmit = async () => {
    if (ideaText.trim()) {
      await onSubmit(ideaText.trim());
      setIdeaText('');
    }
  };

  const handleExampleClick = (example: string) => {
    setIdeaText(example);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <Lightbulb className="w-6 h-6 text-blue-500 mr-3" />
          <span className="text-lg font-semibold text-gray-700">아이디어 입력</span>
        </div>
        
        <Textarea
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          placeholder={text[currentLanguage].placeholder}
          className="w-full min-h-[120px] border-gray-300 focus:border-blue-500 text-base resize-none mb-6"
          style={{ fontSize: '16px' }}
          maxLength={300}
        />
        
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">{ideaText.length}/300</span>
          <Button
            onClick={handleSubmit}
            disabled={!ideaText.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
            size="lg"
          >
            {text[currentLanguage].submitButton}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500 mb-3">인기 예시:</p>
          <div className="flex flex-wrap gap-2">
            {text[currentLanguage].examples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleIdeaInput;
