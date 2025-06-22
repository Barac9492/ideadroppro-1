import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRemixOperations } from '@/hooks/useRemixOperations';
import IdeaCardHeader from './IdeaCardHeader';
import ImprovedIdeaAnalysis from './ImprovedIdeaAnalysis';
import GlobalAnalysisSection from './GlobalAnalysisSection';
import VCAnalysisSection from './VCAnalysisSection';
import IdeaCardActions from './IdeaCardActions';
import IdeaFinalVerdict from './IdeaFinalVerdict';
import { Badge } from '@/components/ui/badge';

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
  vcAnalysis?: any;
  seed?: boolean;
  user_id: string;
  remix_parent_id?: string;
  remix_count?: number;
  remix_chain_depth?: number;
}

interface IdeaCardProps {
  idea: Idea;
  currentLanguage: 'ko' | 'en';
  currentUserId?: string;
  onLike: (ideaId: string) => void;
  onGenerateAnalysis: (ideaId: string) => Promise<void>;
  onGenerateGlobalAnalysis?: (ideaId: string) => Promise<void>;
  onSaveFinalVerdict?: (ideaId: string, verdict: string) => void;
  onDelete?: (ideaId: string) => void;
  isAdmin?: boolean;
  isAuthenticated: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  currentLanguage,
  currentUserId,
  onLike, 
  onGenerateAnalysis,
  onGenerateGlobalAnalysis,
  onSaveFinalVerdict,
  onDelete,
  isAdmin = false,
  isAuthenticated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingGlobal, setIsGeneratingGlobal] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { createRemix, isRemixing } = useRemixOperations({ 
    currentLanguage, 
    fetchIdeas: async () => {} // This will be handled by parent component
  });

  // 강화된 텍스트 처리 - 모든 숫자 접두사 패턴 제거
  const getSafeIdeaText = (text: string | null | undefined): string => {
    if (!text) {
      console.warn('❌ Empty or null idea text detected:', text);
      return '아이디어 내용을 불러올 수 없습니다.';
    }
    
    // 문자열로 확실히 변환
    let processedText = String(text).trim();
    
    // 빈 문자열 체크
    if (!processedText) {
      console.warn('❌ Empty string after conversion:', processedText);
      return '아이디어 내용을 불러올 수 없습니다.';
    }
    
    console.log('🔍 Original text:', processedText);
    
    // 다양한 숫자 접두사 패턴 제거
    const patterns = [
      /^0+\s*/, // "0", "00", "000" 등
      /^\d+\.\s*/, // "1.", "2.", "123." 등  
      /^\d+\)\s*/, // "1)", "2)", "123)" 등
      /^\d+\s+/, // "1 ", "2 ", "123 " 등 (숫자 뒤 공백)
      /^\d+$/, // 숫자만 있는 경우
      /^\d+[^\w\s가-힣]*\s*/ // 숫자 뒤 특수문자가 있는 경우 (예: "1-", "2:", "3#")
    ];
    
    // 각 패턴을 순차적으로 적용
    for (const pattern of patterns) {
      const beforePattern = processedText;
      processedText = processedText.replace(pattern, '');
      
      if (beforePattern !== processedText) {
        console.log(`🧹 Pattern ${pattern} applied:`, {
          before: beforePattern,
          after: processedText
        });
      }
    }
    
    // 앞뒤 공백 제거
    processedText = processedText.trim();
    
    // 처리 후 빈 문자열이 되면 원본 사용 (단, 맨 앞 숫자만 제거)
    if (!processedText) {
      processedText = String(text).replace(/^[0-9]+[^\w\s가-힣]*\s*/, '').trim();
      console.log('⚠️ Text became empty after cleaning, using fallback:', processedText);
    }
    
    // 여전히 빈 문자열이면 에러 메시지
    if (!processedText) {
      console.error('❌ Could not extract meaningful text from:', text);
      return '아이디어 내용을 처리할 수 없습니다.';
    }
    
    console.log('✅ Final processed text:', processedText);
    
    return processedText;
  };

  // 안전한 텍스트 추출
  const safeIdeaText = getSafeIdeaText(idea.text);

  // Debug logging to track any remaining issues
  console.log('🎯 IdeaCard final render:', {
    id: idea.id,
    originalText: idea.text,
    processedText: safeIdeaText,
    score: idea.score,
    hasNumberPrefix: /^[0-9]/.test(String(idea.text || ''))
  });

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
    
    // Check ownership
    if (currentUserId !== idea.user_id) {
      console.log('User is not the owner of this idea');
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

  const handleRemix = async (remixText: string) => {
    await createRemix(idea.id, remixText, idea.score);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(idea.id);
    }
  };

  const showGenerateButton = (!idea.improvements || !idea.marketPotential);
  const isOwner = currentUserId === idea.user_id;
  const showGlobalButton = !idea.globalAnalysis && !!(idea.improvements && idea.marketPotential) && isOwner;
  const showDeleteButton = isOwner;
  const showRemixButton = !isOwner && isAuthenticated;

  return (
    <div className={`bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] ${
      isMobile ? 'p-4' : 'p-6'
    } mb-4 md:mb-6 border border-slate-200 ${
      idea.seed ? 'border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50' : ''
    }`} key={`ideacard-${idea.id}-${idea.timestamp.getTime()}`}>
      <IdeaCardHeader 
        score={idea.score}
        timestamp={idea.timestamp}
        isSeed={idea.seed}
        currentLanguage={currentLanguage}
      />

      {/* Remix Chain Info */}
      {(idea.remix_parent_id || idea.remix_count) && (
        <div className="mb-4 flex items-center space-x-2">
          {idea.remix_parent_id && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              리믹스 {idea.remix_chain_depth && `(${idea.remix_chain_depth}단계)`}
            </Badge>
          )}
          {idea.remix_count && idea.remix_count > 0 && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {idea.remix_count}개 리믹스
            </Badge>
          )}
        </div>
      )}

      {/* Idea Text - 강화된 안전한 렌더링 */}
      <div className={`text-slate-800 leading-relaxed mb-4 ${
        isMobile ? 'text-base' : 'text-lg'
      }`}>
        {safeIdeaText}
      </div>

      {/* Tags */}
      <div className={`flex flex-wrap gap-2 mb-4 ${isMobile ? 'gap-1' : 'gap-2'}`}>
        {idea.tags?.map((tag, index) => (
          <span
            key={`tag-${idea.id}-${index}-${tag}`}
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
        )) || []}
      </div>

      {/* Improved Analysis Section */}
      <ImprovedIdeaAnalysis
        aiAnalysis={idea.aiAnalysis}
        improvements={idea.improvements}
        marketPotential={idea.marketPotential}
        similarIdeas={idea.similarIdeas}
        pitchPoints={idea.pitchPoints}
        isSeed={idea.seed}
        currentLanguage={currentLanguage}
      />

      {/* VC Analysis Section */}
      {idea.vcAnalysis && (
        <VCAnalysisSection
          analysis={idea.vcAnalysis}
          currentLanguage={currentLanguage}
        />
      )}

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
        showDeleteButton={showDeleteButton}
        showRemixButton={showRemixButton}
        remixCount={idea.remix_count}
        chainDepth={idea.remix_chain_depth}
        originalText={safeIdeaText}
        originalScore={idea.score}
        onLike={handleLikeClick}
        onGenerateAnalysis={handleGenerateAnalysis}
        onGenerateGlobalAnalysis={handleGenerateGlobalAnalysis}
        onDelete={handleDelete}
        onRemix={handleRemix}
        isRemixing={isRemixing}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default IdeaCard;
