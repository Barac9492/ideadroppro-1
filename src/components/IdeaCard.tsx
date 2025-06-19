
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import IdeaCardHeader from './IdeaCardHeader';
import IdeaAnalysisSection from './IdeaAnalysisSection';
import GlobalAnalysisSection from './GlobalAnalysisSection';
import IdeaCardActions from './IdeaCardActions';
import IdeaFinalVerdict from './IdeaFinalVerdict';

interface Idea {
  id: string;
  text: string;
  score: number;
  tags: string[];
  likes: number;
  hasLiked: boolean;
  timestamp: Date;
  aiAnalysis?: string;
  improvements?: string[];
  marketPotential?: string[];
  similarIdeas?: string[];
  pitchPoints?: string[];
  finalVerdict?: string;
  globalAnalysis?: any;
  seed?: boolean;
}

interface IdeaCardProps {
  idea: Idea;
  currentLanguage: 'ko' | 'en';
  onLike: (ideaId: string) => void;
  onGenerateAnalysis: (ideaId: string) => Promise<void>;
  onGenerateGlobalAnalysis?: (ideaId: string) => Promise<void>;
  onSaveFinalVerdict?: (ideaId: string, verdict: string) => void;
  isAdmin?: boolean;
  isAuthenticated: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  currentLanguage, 
  onLike, 
  onGenerateAnalysis,
  onGenerateGlobalAnalysis,
  onSaveFinalVerdict,
  isAdmin = false,
  isAuthenticated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingGlobal, setIsGeneratingGlobal] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleGenerateAnalysis = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setIsGenerating(true);
    try {
      await onGenerateAnalysis(idea.id);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateGlobalAnalysis = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setIsGeneratingGlobal(true);
    try {
      await onGenerateGlobalAnalysis?.(idea.id);
    } finally {
      setIsGeneratingGlobal(false);
    }
  };

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    onLike(idea.id);
  };

  const showGenerateButton = (!idea.improvements || !idea.marketPotential);
  const showGlobalButton = !idea.globalAnalysis && !!(idea.improvements && idea.marketPotential);

  return (
    <div className={`bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] ${
      isMobile ? 'p-4' : 'p-6'
    } mb-4 md:mb-6 border border-slate-200 ${
      idea.seed ? 'border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50' : ''
    }`}>
      <IdeaCardHeader 
        score={idea.score}
        timestamp={idea.timestamp}
        isSeed={idea.seed}
        currentLanguage={currentLanguage}
      />

      {/* Idea Text */}
      <p className={`text-slate-800 leading-relaxed mb-4 ${
        isMobile ? 'text-base' : 'text-lg'
      }`}>
        {idea.text}
      </p>

      {/* Tags */}
      <div className={`flex flex-wrap gap-2 mb-4 ${isMobile ? 'gap-1' : 'gap-2'}`}>
        {idea.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full font-medium ${
              isMobile ? 'text-xs' : 'text-sm'
            } ${
              idea.seed 
                ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
            } shadow-sm`}
          >
            #{tag}
          </span>
        ))}
      </div>

      <IdeaAnalysisSection
        aiAnalysis={idea.aiAnalysis}
        improvements={idea.improvements}
        marketPotential={idea.marketPotential}
        similarIdeas={idea.similarIdeas}
        pitchPoints={idea.pitchPoints}
        isSeed={idea.seed}
        currentLanguage={currentLanguage}
      />

      {/* Global Analysis Section */}
      {idea.globalAnalysis && (
        <GlobalAnalysisSection
          globalAnalysis={idea.globalAnalysis}
          currentLanguage={currentLanguage}
        />
      )}

      <IdeaFinalVerdict
        idea={idea}
        currentLanguage={currentLanguage}
        isAdmin={isAdmin}
        isAuthenticated={isAuthenticated}
        onSaveFinalVerdict={onSaveFinalVerdict}
      />

      <IdeaCardActions
        likes={idea.likes}
        hasLiked={idea.hasLiked}
        isSeed={idea.seed}
        isAuthenticated={isAuthenticated}
        isGenerating={isGenerating}
        isGeneratingGlobal={isGeneratingGlobal}
        showGenerateButton={showGenerateButton}
        showGlobalButton={showGlobalButton}
        onLike={handleLikeClick}
        onGenerateAnalysis={handleGenerateAnalysis}
        onGenerateGlobalAnalysis={handleGenerateGlobalAnalysis}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default IdeaCard;
