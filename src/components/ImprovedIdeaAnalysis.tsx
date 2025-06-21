
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, TrendingUp, Users, Star, Zap } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface ImprovedIdeaAnalysisProps {
  aiAnalysis?: string;
  improvements?: string[];
  marketPotential?: string[];
  similarIdeas?: string[];
  pitchPoints?: string[];
  isSeed?: boolean;
  currentLanguage: 'ko' | 'en';
}

const ImprovedIdeaAnalysis: React.FC<ImprovedIdeaAnalysisProps> = ({
  aiAnalysis,
  improvements,
  marketPotential,
  similarIdeas,
  pitchPoints,
  isSeed = false,
  currentLanguage
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const text = {
    ko: {
      aiSummary: 'AI 핵심 분석',
      improvements: '개선 포인트',
      marketPotential: '시장 기회',
      similarIdeas: '유사 사례',
      pitchPoints: '투자 포인트',
      showMore: '더보기',
      showLess: '접기',
      keyInsights: '핵심 인사이트'
    },
    en: {
      aiSummary: 'AI Key Analysis',
      improvements: 'Improvement Points',
      marketPotential: 'Market Opportunities',
      similarIdeas: 'Similar Cases',
      pitchPoints: 'Investment Points',
      showMore: 'Show More',
      showLess: 'Show Less',
      keyInsights: 'Key Insights'
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Extract key insights from AI analysis (first 2 sentences)
  const getKeyInsights = (analysis: string) => {
    const sentences = analysis.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
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
    <div className="space-y-3">
      {/* AI Key Insights Summary */}
      {aiAnalysis && (
        <div className={`rounded-lg p-4 border-2 ${
          isSeed 
            ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Zap className={`h-4 w-4 ${isSeed ? 'text-orange-600' : 'text-blue-600'}`} />
              <span className="font-semibold text-sm">{text[currentLanguage].keyInsights}</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-700 leading-relaxed">
            {expandedSections.has('aiAnalysis') ? aiAnalysis : getKeyInsights(aiAnalysis)}
          </div>
          
          {aiAnalysis.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('aiAnalysis')}
              className="mt-2 h-6 px-2 text-xs"
            >
              {expandedSections.has('aiAnalysis') ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  {text[currentLanguage].showLess}
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  {text[currentLanguage].showMore}
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Detailed Analysis Sections */}
      <div className="grid gap-3 md:grid-cols-2">
        {analysisItems.map((item) => {
          if (!item.content || item.content.length === 0) return null;
          
          const Icon = item.icon;
          const isExpanded = expandedSections.has(item.key);
          const shouldShowToggle = item.content.length > 3;
          
          return (
            <Collapsible key={item.key} open={isExpanded} onOpenChange={() => toggleSection(item.key)}>
              <div className={`rounded-lg border-2 ${item.bgColor} ${item.borderColor} p-3`}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto font-semibold text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-gray-800">{item.title}</span>
                      <span className="text-xs text-gray-500">({item.content.length})</span>
                    </div>
                    {shouldShowToggle && (
                      isExpanded ? 
                        <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2">
                  <ul className="space-y-1">
                    {(isExpanded ? item.content : item.content.slice(0, 2)).map((point, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {!isExpanded && item.content.length > 2 && (
                    <div className="text-xs text-gray-500 mt-2">
                      +{item.content.length - 2}개 더보기
                    </div>
                  )}
                </CollapsibleContent>
                
                {!shouldShowToggle && (
                  <div className="mt-2">
                    <ul className="space-y-1">
                      {item.content.map((point, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default ImprovedIdeaAnalysis;
