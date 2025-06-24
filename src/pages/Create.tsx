import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AIQuestionFlow from '@/components/AIQuestionFlow';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import SimpleTopBar from '@/components/SimpleTopBar';
import IdeaExpansionHelper from '@/components/IdeaExpansionHelper';
import EducationalGradeDisplay from '@/components/EducationalGradeDisplay';
import { analyzeIdeaQuality, IdeaQuality } from '@/components/IdeaQualityAnalyzer';
import AIModuleBreakdown from '@/components/AIModuleBreakdown';
import ModuleImprovementModal from '@/components/ModuleImprovementModal';

const Create = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [initialIdea, setInitialIdea] = useState('');
  const [processedIdea, setProcessedIdea] = useState('');
  const [currentStep, setCurrentStep] = useState<'expansion' | 'questions' | 'grade' | 'modules'>('expansion');
  const [completedModules, setCompletedModules] = useState<any[]>([]);
  const [unifiedIdea, setUnifiedIdea] = useState('');
  const [aiGrade, setAiGrade] = useState('');
  const [ideaQuality, setIdeaQuality] = useState<IdeaQuality | null>(null);
  const [improvementModal, setImprovementModal] = useState<{
    isOpen: boolean;
    moduleType: string;
    moduleContent: string;
  }>({
    isOpen: false,
    moduleType: '',
    moduleContent: ''
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get initial idea from navigation state
  useEffect(() => {
    if (location.state?.initialIdea) {
      const idea = location.state.initialIdea;
      setInitialIdea(idea);
      
      // Analyze idea quality with stricter validation
      const quality = analyzeIdeaQuality(idea, currentLanguage);
      setIdeaQuality(quality);
      
      // Force expansion for ideas that don't meet minimum content standards
      if (!quality.hasMinimumContent || quality.needsExpansion) {
        setCurrentStep('expansion');
      } else {
        setProcessedIdea(idea);
        setCurrentStep('questions');
      }
    }
  }, [location.state, currentLanguage]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { initialIdea } });
    }
  }, [user, navigate, initialIdea]);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleExpansionComplete = (expandedIdea: string) => {
    // Re-analyze the expanded idea to ensure it meets standards
    const newQuality = analyzeIdeaQuality(expandedIdea, currentLanguage);
    setIdeaQuality(newQuality);
    
    // Only proceed if the idea now meets minimum standards
    if (newQuality.hasMinimumContent) {
      setProcessedIdea(expandedIdea);
      setCurrentStep('questions');
    } else {
      // Force them to try again if still insufficient
      console.log('Expanded idea still does not meet minimum standards');
    }
  };

  const handleExpansionSkip = () => {
    // Only allow skipping if the idea meets minimum content standards
    if (ideaQuality?.hasMinimumContent) {
      setProcessedIdea(initialIdea);
      setCurrentStep('questions');
    } else {
      // Show warning that expansion is required
      console.log('Cannot skip expansion - idea does not meet minimum standards');
    }
  };

  const handleQuestionsComplete = (modules: any[], unifiedIdeaText: string, grade: string) => {
    setCompletedModules(modules);
    setUnifiedIdea(unifiedIdeaText);
    setAiGrade(grade);
    setCurrentStep('grade');
  };

  const handleProceedToModules = () => {
    setCurrentStep('modules');
  };

  const handleRetryWithEducation = () => {
    // Reset to expansion step with educational focus
    setCurrentStep('expansion');
  };

  const handleSaveToLibrary = () => {
    console.log('Modules saved to library successfully');
  };

  const handleGoToRemix = () => {
    navigate('/remix', { 
      state: { 
        userModules: completedModules,
        sourceIdea: unifiedIdea 
      } 
    });
  };

  const handleImproveModule = (moduleType: string) => {
    const moduleContent = `Sample content for ${moduleType}`;
    setImprovementModal({
      isOpen: true,
      moduleType,
      moduleContent
    });
  };

  const handleModuleImprovement = (improvedContent: string) => {
    // TODO: Update the specific module content
    console.log('Module improved:', improvedContent);
    setImprovementModal({ isOpen: false, moduleType: '', moduleContent: '' });
  };

  const text = {
    ko: {
      title: '✨ AI와 함께 아이디어 완성하기',
      subtitle: 'AI가 당신의 아이디어를 완전한 비즈니스 모델로 발전시켜드려요'
    },
    en: {
      title: '✨ Complete Your Idea with AI',
      subtitle: 'AI will transform your idea into a complete business model'
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SimpleTopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="pt-20">
        <UnifiedNavigation currentLanguage={currentLanguage} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {text[currentLanguage].title}
            </h1>
            <p className="text-xl text-gray-600">
              {text[currentLanguage].subtitle}
            </p>
          </div>

          {/* Step-based rendering with improved validation */}
          {currentStep === 'expansion' && ideaQuality && (
            <IdeaExpansionHelper
              currentLanguage={currentLanguage}
              originalIdea={initialIdea}
              qualityAnalysis={ideaQuality}
              onExpansionComplete={handleExpansionComplete}
              onSkip={handleExpansionSkip}
            />
          )}

          {currentStep === 'questions' && processedIdea && (
            <AIQuestionFlow 
              currentLanguage={currentLanguage}
              initialIdea={processedIdea}
              onComplete={handleQuestionsComplete}
            />
          )}

          {currentStep === 'grade' && (
            <EducationalGradeDisplay
              currentLanguage={currentLanguage}
              grade={aiGrade}
              unifiedIdea={unifiedIdea}
              originalQuality={ideaQuality!}
              onProceedToModules={handleProceedToModules}
              onRetryWithEducation={handleRetryWithEducation}
            />
          )}

          {currentStep === 'modules' && (
            <AIModuleBreakdown
              currentLanguage={currentLanguage}
              completedModules={completedModules}
              unifiedIdea={unifiedIdea}
              onSaveToLibrary={handleSaveToLibrary}
              onGoToRemix={handleGoToRemix}
              onImproveModule={handleImproveModule}
            />
          )}
        </div>
      </div>

      {/* Module Improvement Modal */}
      <ModuleImprovementModal
        isOpen={improvementModal.isOpen}
        onClose={() => setImprovementModal({ isOpen: false, moduleType: '', moduleContent: '' })}
        moduleType={improvementModal.moduleType}
        moduleContent={improvementModal.moduleContent}
        currentLanguage={currentLanguage}
        onImprove={handleModuleImprovement}
      />
    </div>
  );
};

export default Create;
