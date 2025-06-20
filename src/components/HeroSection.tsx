
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, TrendingUp, Lightbulb } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ImmediateReactionSystem from './ImmediateReactionSystem';

interface HeroSectionProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (ideaText: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ currentLanguage, onIdeaDrop }) => {
  const [ideaText, setIdeaText] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const { user } = useAuth();

  const text = {
    ko: {
      title: 'IdeaDrop Pro',
      subtitle: '아이디어 하나로 세상을 바꿔보세요',
      description: 'GPT 분석 → 커뮤니티 리믹스 → VC 직접 연결',
      placeholder: '여기에 아이디어를 입력하세요...',
      submit: '아이디어 드랍',
      submitting: '제출 중...',
      loginToSubmit: '로그인 후 제출',
      process: {
        step1: '아이디어 제출',
        step2: 'GPT 즉시 분석',
        step3: '커뮤니티 리믹스',
        step4: 'VC 직접 노출'
      },
      stats: {
        today: '오늘',
        submitted: '개 제출',
        remixed: '개 리믹스',
        connected: '건 연결'
      }
    },
    en: {
      title: 'IdeaDrop Pro',
      subtitle: 'Change the world with one idea',
      description: 'GPT Analysis → Community Remix → Direct VC Connection',
      placeholder: 'Enter your idea here...',
      submit: 'Drop Idea',
      submitting: 'Submitting...',
      loginToSubmit: 'Login to Submit',
      process: {
        step1: 'Submit Idea',
        step2: 'Instant GPT Analysis',  
        step3: 'Community Remix',
        step4: 'Direct VC Exposure'
      },
      stats: {
        today: 'Today',
        submitted: 'submitted',
        remixed: 'remixed',
        connected: 'connected'
      }
    }
  };

  const handleSubmit = async () => {
    if (!ideaText.trim()) return;
    
    setShowReactions(true);
    await onIdeaDrop(ideaText);
  };

  const handleRemixSuggestionAccept = (suggestion: string) => {
    // Create a remix based on the original idea + suggestion
    const remixedIdea = `${ideaText}\n\n리믹스 방향: ${suggestion}`;
    setIdeaText(remixedIdea);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <Badge className="bg-purple-600 text-white px-4 py-2 mb-6">
              <Lightbulb className="w-4 h-4 mr-2" />
              BETA
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {text[currentLanguage].title}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              {text[currentLanguage].subtitle}
            </p>
            
            <p className="text-lg text-purple-600 font-medium">
              {text[currentLanguage].description}
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {Object.entries(text[currentLanguage].process).map(([key, step], index) => (
              <div key={key} className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-gray-700">{step}</p>
              </div>
            ))}
          </div>

          {/* Idea Input */}
          <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
            <Textarea
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder={text[currentLanguage].placeholder}
              className="min-h-32 text-lg border-2 border-purple-200 focus:border-purple-500 mb-6"
            />
            
            <Button
              onClick={handleSubmit}
              disabled={!ideaText.trim() || !user}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-12 py-4 text-xl rounded-xl shadow-lg"
            >
              <Zap className="w-6 h-6 mr-2" />
              {user ? text[currentLanguage].submit : text[currentLanguage].loginToSubmit}
            </Button>
          </div>

          {/* Immediate Reaction System */}
          {showReactions && ideaText && (
            <ImmediateReactionSystem
              ideaText={ideaText}
              currentLanguage={currentLanguage}
              onRemixSuggestionAccept={handleRemixSuggestionAccept}
            />
          )}

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">147</div>
              <div className="text-sm text-gray-600">
                {text[currentLanguage].stats.today} {text[currentLanguage].stats.submitted}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">89</div>
              <div className="text-sm text-gray-600">
                {text[currentLanguage].stats.today} {text[currentLanguage].stats.remixed}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">23</div>
              <div className="text-sm text-gray-600">
                {text[currentLanguage].stats.today} {text[currentLanguage].stats.connected}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
