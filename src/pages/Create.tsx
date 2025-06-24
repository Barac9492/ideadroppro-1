
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/UnifiedNavigation';
import SimpleTopBar from '@/components/SimpleTopBar';
import InteractiveIdeaChat from '@/components/InteractiveIdeaChat';
import EducationalGradeDisplay from '@/components/EducationalGradeDisplay';
import { analyzeIdeaQuality, IdeaQuality } from '@/components/IdeaQualityAnalyzer';
import AIModuleBreakdown from '@/components/AIModuleBreakdown';
import ModuleImprovementModal from '@/components/ModuleImprovementModal';

const Create = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [initialIdea, setInitialIdea] = useState('');
  const [currentStep, setCurrentStep] = useState<'chat' | 'grade' | 'modules'>('chat');
  const [completedModules, setCompletedModules] = useState<any[]>([]);
  const [unifiedIdea, setUnifiedIdea] = useState('');
  const [aiGrade, setAiGrade] = useState('');
  const [ideaQuality, setIdeaQuality] = useState<IdeaQuality | null>(null);
  const [chatData, setChatData] = useState<any>(null);
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
      
      // Analyze idea quality for context
      const quality = analyzeIdeaQuality(idea, currentLanguage);
      setIdeaQuality(quality);
      
      // Start with interactive chat for all ideas
      setCurrentStep('chat');
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

  const handleChatComplete = (chatResults: any) => {
    console.log('Chat completed with data:', chatResults);
    setChatData(chatResults);
    
    // Convert chat results to module format
    const modules = Object.entries(chatResults.modules || {}).map(([moduleType, content]) => ({
      id: `temp-${moduleType}-${Date.now()}`,
      module_type: moduleType,
      content: content as string,
      tags: [],
      created_by: user?.id || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      quality_score: chatResults.completionScore ? chatResults.completionScore / 10 : 0.7,
      usage_count: 0
    }));

    setCompletedModules(modules);
    setUnifiedIdea(chatResults.conversationContext || initialIdea);
    
    // Generate AI grade based on completion score
    const gradeMap = ['F', 'D', 'C', 'B', 'A', 'A+'];
    const gradeIndex = Math.min(Math.floor((chatResults.completionScore || 5) / 2), 5);
    setAiGrade(gradeMap[gradeIndex]);
    
    setCurrentStep('grade');
  };

  const handleChatCancel = () => {
    navigate('/');
  };

  const handleProceedToModules = () => {
    setCurrentStep('modules');
  };

  const handleRetryWithEducation = () => {
    setCurrentStep('chat');
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
    console.log('Module improved:', improvedContent);
    setImprovementModal({ isOpen: false, moduleType: '', moduleContent: '' });
  };

  const text = {
    ko: {
      title: '💬 AI와 실시간 대화로 아이디어 완성하기',
      subtitle: 'AI 코치가 실시간으로 질문하며 당신의 아이디어를 완전한 비즈니스 모델로 발전시켜드려요'
    },
    en: {
      title: '💬 Complete Your Idea with Real-time AI Chat',
      subtitle: 'AI coach will ask questions in real-time to develop your idea into a complete business model'
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

          {/* Step-based rendering with conversational chat approach */}
          {currentStep === 'chat' && initialIdea && (
            <InteractiveIdeaChat
              initialIdea={initialIdea}
              currentLanguage={currentLanguage}
              onComplete={handleChatComplete}
              onCancel={handleChatCancel}
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
