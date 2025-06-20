
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Users, Eye, TrendingUp, Lightbulb } from 'lucide-react';
import { useAutoRemixSuggestions } from '@/hooks/useAutoRemixSuggestions';

interface ImmediateReactionSystemProps {
  ideaText: string;
  currentLanguage: 'ko' | 'en';
  onRemixSuggestionAccept: (suggestion: string) => void;
}

const ImmediateReactionSystem: React.FC<ImmediateReactionSystemProps> = ({
  ideaText,
  currentLanguage,
  onRemixSuggestionAccept
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [immediateStats, setImmediateStats] = useState({
    interested: 0,
    similarFound: 0,
    vcViews: 0
  });

  const { suggestions, loading } = useAutoRemixSuggestions({ 
    ideaText, 
    currentLanguage 
  });

  const text = {
    ko: {
      processing: '아이디어 분석 중...',
      interested: '명이 관심 표시',
      similarFound: '개 유사 아이디어 발견',
      vcViews: '명 VC 조회',
      autoSuggestions: 'GPT 리믹스 제안',
      acceptSuggestion: '이 방향으로 리믹스',
      networkReaction: '네트워크 반응',
      scoreBoost: '점수 향상 예상'
    },
    en: {
      processing: 'Analyzing idea...',
      interested: 'showed interest',
      similarFound: 'similar ideas found',
      vcViews: 'VC views',
      autoSuggestions: 'GPT Remix Suggestions',
      acceptSuggestion: 'Remix in this direction',
      networkReaction: 'Network Reaction',
      scoreBoost: 'Expected score boost'
    }
  };

  useEffect(() => {
    if (ideaText) {
      // Show immediate algorithmic reactions
      setTimeout(() => {
        setShowReactions(true);
        
        // Simulate immediate network reactions
        const timer = setInterval(() => {
          setImmediateStats(prev => ({
            interested: Math.min(12, prev.interested + Math.floor(Math.random() * 2) + 1),
            similarFound: Math.min(5, prev.similarFound + (Math.random() > 0.7 ? 1 : 0)),
            vcViews: Math.min(8, prev.vcViews + (Math.random() > 0.8 ? 1 : 0))
          }));
        }, 2000);

        // Stop after 20 seconds
        setTimeout(() => clearInterval(timer), 20000);

        return () => clearInterval(timer);
      }, 1000);
    }
  }, [ideaText]);

  if (!showReactions && !loading && suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200 mb-6">
      {/* Immediate Network Reactions */}
      {showReactions && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">
              {text[currentLanguage].networkReaction}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {immediateStats.interested}
              </div>
              <div className="text-sm text-gray-600">
                {text[currentLanguage].interested}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {immediateStats.similarFound}
              </div>
              <div className="text-sm text-gray-600">
                {text[currentLanguage].similarFound}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
              <Eye className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {immediateStats.vcViews}
              </div>
              <div className="text-sm text-gray-600">
                {text[currentLanguage].vcViews}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GPT Auto Remix Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">
              {text[currentLanguage].autoSuggestions}
            </h3>
          </div>
          
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-800 font-medium">
                    {suggestion.suggestion}
                  </p>
                  <Badge className="bg-green-100 text-green-700 ml-2">
                    +{suggestion.potential_score_boost} {text[currentLanguage].scoreBoost}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {suggestion.reasoning}
                </p>
                
                <Button
                  size="sm"
                  onClick={() => onRemixSuggestionAccept(suggestion.suggestion)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {text[currentLanguage].acceptSuggestion}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImmediateReactionSystem;
