
import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import IdeaCardHeader from './IdeaCardHeader';
import IdeaAnalysisSection from './IdeaAnalysisSection';
import IdeaCardActions from './IdeaCardActions';

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
  seed?: boolean;
}

interface IdeaCardProps {
  idea: Idea;
  currentLanguage: 'ko' | 'en';
  onLike: (ideaId: string) => void;
  onGenerateAnalysis: (ideaId: string) => Promise<void>;
  onSaveFinalVerdict?: (ideaId: string, verdict: string) => void;
  isAdmin?: boolean;
  isAuthenticated: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  currentLanguage, 
  onLike, 
  onGenerateAnalysis,
  onSaveFinalVerdict,
  isAdmin = false,
  isAuthenticated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalVerdict, setFinalVerdict] = useState(idea.finalVerdict || '');
  const [isSavingVerdict, setIsSavingVerdict] = useState(false);
  const navigate = useNavigate();

  const text = {
    ko: {
      finalVerdict: 'VC 최종 평가',
      saveVerdict: '평가 저장',
      savingVerdict: '저장 중...',
      verdictPlaceholder: 'VC로서 이 아이디어에 대한 최종 평가를 작성해주세요...'
    },
    en: {
      finalVerdict: 'VC Final Verdict',
      saveVerdict: 'Save Verdict',
      savingVerdict: 'Saving...',
      verdictPlaceholder: 'Write your final verdict on this idea as a VC...'
    }
  };

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

  const handleSaveVerdict = async () => {
    if (!onSaveFinalVerdict || !finalVerdict.trim()) return;
    
    setIsSavingVerdict(true);
    try {
      await onSaveFinalVerdict(idea.id, finalVerdict.trim());
    } finally {
      setIsSavingVerdict(false);
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

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] p-6 mb-6 ${
      idea.seed ? 'border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50' : ''
    }`}>
      <IdeaCardHeader 
        score={idea.score}
        timestamp={idea.timestamp}
        isSeed={idea.seed}
        currentLanguage={currentLanguage}
      />

      {/* Idea Text */}
      <p className="text-gray-800 text-lg mb-4 leading-relaxed">{idea.text}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {idea.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              idea.seed 
                ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
            }`}
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

      {/* Final Verdict Section */}
      {idea.finalVerdict && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4 border-l-4 border-yellow-400">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-gray-800">{text[currentLanguage].finalVerdict}</span>
          </div>
          <p className="text-gray-700">{idea.finalVerdict}</p>
        </div>
      )}

      {/* Admin Final Verdict Input */}
      {isAuthenticated && isAdmin && !idea.finalVerdict && !idea.seed && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4 border-l-4 border-yellow-400">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-gray-800">{text[currentLanguage].finalVerdict}</span>
          </div>
          <Textarea
            value={finalVerdict}
            onChange={(e) => setFinalVerdict(e.target.value)}
            placeholder={text[currentLanguage].verdictPlaceholder}
            className="mb-3 min-h-[80px]"
          />
          <Button
            onClick={handleSaveVerdict}
            disabled={!finalVerdict.trim() || isSavingVerdict}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
          >
            {isSavingVerdict ? text[currentLanguage].savingVerdict : text[currentLanguage].saveVerdict}
          </Button>
        </div>
      )}

      <IdeaCardActions
        likes={idea.likes}
        hasLiked={idea.hasLiked}
        isSeed={idea.seed}
        isAuthenticated={isAuthenticated}
        isGenerating={isGenerating}
        showGenerateButton={showGenerateButton}
        onLike={handleLikeClick}
        onGenerateAnalysis={handleGenerateAnalysis}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default IdeaCard;
