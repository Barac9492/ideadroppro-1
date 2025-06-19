
import React from 'react';
import { Zap, TrendingUp, Users, Star } from 'lucide-react';

interface IdeaAnalysisSectionProps {
  aiAnalysis?: string;
  improvements?: string[];
  marketPotential?: string[];
  similarIdeas?: string[];
  pitchPoints?: string[];
  isSeed?: boolean;
  currentLanguage: 'ko' | 'en';
}

const IdeaAnalysisSection: React.FC<IdeaAnalysisSectionProps> = ({
  aiAnalysis,
  improvements,
  marketPotential,
  similarIdeas,
  pitchPoints,
  isSeed = false,
  currentLanguage
}) => {
  const text = {
    ko: {
      improvements: '개선 피드백',
      marketPotential: '시장 잠재력',
      similarIdeas: '유사 아이디어',
      pitchPoints: '피치덱 포인트',
      aiAnalysis: 'AI 분석'
    },
    en: {
      improvements: 'Improvement Feedback',
      marketPotential: 'Market Potential',
      similarIdeas: 'Similar Ideas',
      pitchPoints: 'Pitch Points',
      aiAnalysis: 'AI Analysis'
    }
  };

  return (
    <>
      {/* AI Analysis Section */}
      {aiAnalysis && (
        <div className={`rounded-xl p-4 mb-4 ${
          isSeed 
            ? 'bg-gradient-to-r from-orange-100 to-amber-100'
            : 'bg-gradient-to-r from-purple-50 to-blue-50'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Zap className={`h-5 w-5 ${isSeed ? 'text-orange-600' : 'text-purple-600'}`} />
            <span className="font-semibold text-gray-800">{text[currentLanguage].aiAnalysis}</span>
          </div>
          <p className="text-gray-700">{aiAnalysis}</p>
        </div>
      )}

      {/* Detailed Analysis Sections */}
      {improvements && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
            {text[currentLanguage].improvements}
          </h4>
          <ul className="space-y-1">
            {improvements.map((improvement, index) => (
              <li key={index} className="text-gray-600 text-sm">• {improvement}</li>
            ))}
          </ul>
        </div>
      )}

      {marketPotential && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
            {text[currentLanguage].marketPotential}
          </h4>
          <ul className="space-y-1">
            {marketPotential.map((point, index) => (
              <li key={index} className="text-gray-600 text-sm">• {point}</li>
            ))}
          </ul>
        </div>
      )}

      {similarIdeas && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2 text-indigo-600" />
            {text[currentLanguage].similarIdeas}
          </h4>
          <ul className="space-y-1">
            {similarIdeas.map((similarIdea, index) => (
              <li key={index} className="text-gray-600 text-sm">• {similarIdea}</li>
            ))}
          </ul>
        </div>
      )}

      {pitchPoints && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-600" />
            {text[currentLanguage].pitchPoints}
          </h4>
          <ul className="space-y-1">
            {pitchPoints.map((point, index) => (
              <li key={index} className="text-gray-600 text-sm">• {point}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default IdeaAnalysisSection;
