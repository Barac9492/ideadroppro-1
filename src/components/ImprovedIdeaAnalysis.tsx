
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, TrendingUp, Users, Star, Zap } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import ActionOrientedAnalysis from './ActionOrientedAnalysis';
import VCQualificationDashboard from './VCQualificationDashboard';

interface ImprovedIdeaAnalysisProps {
  aiAnalysis?: string;
  improvements?: string[];
  marketPotential?: string[];
  similarIdeas?: string[];
  pitchPoints?: string[];
  isSeed?: boolean;
  currentLanguage: 'ko' | 'en';
  score?: number;
  likes?: number;
}

const ImprovedIdeaAnalysis: React.FC<ImprovedIdeaAnalysisProps> = ({
  aiAnalysis,
  improvements,
  marketPotential,
  similarIdeas,
  pitchPoints,
  isSeed = false,
  currentLanguage,
  score = 0,
  likes = 0
}) => {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const text = {
    ko: {
      detailedAnalysis: '상세 분석 보기',
      hideDetailed: '상세 분석 숨기기',
      improvements: '개선 포인트',
      marketPotential: '시장 기회',
      similarIdeas: '유사 사례',
      pitchPoints: '투자 포인트'
    },
    en: {
      detailedAnalysis: 'Show Detailed Analysis',
      hideDetailed: 'Hide Detailed Analysis',
      improvements: 'Improvement Points',
      marketPotential: 'Market Opportunities',
      similarIdeas: 'Similar Cases',
      pitchPoints: 'Investment Points'
    }
  };

  const analysisItems = [
    {
      key: 'improvements',
      title: text[currentLanguage].improvements,
      icon: TrendingUp,
      content: improvements,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      key: 'marketPotential',
      title: text[currentLanguage].marketPotential,
      icon: Star,
      content: marketPotential,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      key: 'pitchPoints',
      title: text[currentLanguage].pitchPoints,
      icon: Lightbulb,
      content: pitchPoints,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      key: 'similarIdeas',
      title: text[currentLanguage].similarIdeas,
      icon: Users,
      content: similarIdeas,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  if (!aiAnalysis && !improvements && !marketPotential && !similarIdeas && !pitchPoints) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* VC Qualification Dashboard */}
      <VCQualificationDashboard 
        score={score}
        likes={likes}
        currentLanguage={currentLanguage}
      />

      {/* Action-Oriented Analysis (Main Focus) */}
      <ActionOrientedAnalysis
        aiAnalysis={aiAnalysis}
        improvements={improvements}
        marketPotential={marketPotential}
        pitchPoints={pitchPoints}
        currentLanguage={currentLanguage}
      />

      {/* Detailed Analysis (Collapsible) */}
      {(improvements || marketPotential || similarIdeas || pitchPoints) && (
        <Collapsible open={showDetailedAnalysis} onOpenChange={setShowDetailedAnalysis}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              {showDetailedAnalysis ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  {text[currentLanguage].hideDetailed}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  {text[currentLanguage].detailedAnalysis}
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              {analysisItems.map((item) => {
                if (!item.content || item.content.length === 0) return null;
                
                const Icon = item.icon;
                
                return (
                  <div key={item.key} className={`rounded-lg border-2 ${item.bgColor} ${item.borderColor} p-3`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Icon className={`h-4 w-4 ${item.color}`} />
                      <span className="font-semibold text-gray-800">{item.title}</span>
                      <span className="text-xs text-gray-500">({item.content.length})</span>
                    </div>
                    
                    <ul className="space-y-1">
                      {item.content.map((point, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default ImprovedIdeaAnalysis;
