
import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  moduleType?: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentLanguage: 'ko' | 'en';
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentLanguage,
  isLoading
}) => {
  const text = {
    ko: {
      thinking: 'AI가 답변을 분석하고 더 자세한 질문을 준비 중...',
      moduleNames: {
        problem_definition: '문제 정의',
        target_customer: '타겟 고객',
        value_proposition: '가치 제안',
        revenue_model: '수익 모델',
        competitive_advantage: '경쟁 우위'
      }
    },
    en: {
      thinking: 'AI is analyzing your response and preparing more detailed questions...',
      moduleNames: {
        problem_definition: 'Problem Definition',
        target_customer: 'Target Customer',
        value_proposition: 'Value Proposition',
        revenue_model: 'Revenue Model',
        competitive_advantage: 'Competitive Advantage'
      }
    }
  };

  return (
    <div className="p-6 max-h-96 overflow-y-auto space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex items-start space-x-3 ${
          message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            message.role === 'ai' 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {message.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div className={`max-w-md px-4 py-3 rounded-2xl ${
            message.role === 'ai'
              ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-gray-800'
              : 'bg-gray-500 text-white'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            {message.moduleType && (
              <div className="mt-2 text-xs opacity-75">
                {text[currentLanguage].moduleNames[message.moduleType as keyof typeof text[typeof currentLanguage]['moduleNames']]}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 rounded-2xl">
            <p className="text-sm text-gray-600">
              {text[currentLanguage].thinking}
            </p>
            <div className="flex space-x-1 mt-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
