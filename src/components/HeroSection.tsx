
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Rocket, Lightbulb, Code, Flame, Plus, Save, Clock } from 'lucide-react';
import IdeaReactionSystem from './IdeaReactionSystem';
import EnhancedIdeaModal from './EnhancedIdeaModal';
import { useIdeaDraft } from '@/hooks/useIdeaDraft';
import { toast } from '@/hooks/use-toast';

interface HeroSectionProps {
  currentLanguage: 'ko' | 'en';
  onIdeaDrop: (idea: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ currentLanguage, onIdeaDrop }) => {
  const [ideaText, setIdeaText] = useState('');
  const [showReactionSystem, setShowReactionSystem] = useState(false);
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [submittedIdea, setSubmittedIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { drafts, saveDraft, loadDraft, autoSave } = useIdeaDraft({ currentLanguage });

  const text = {
    ko: {
      title: '아이디어를 던지세요, 기회를 잡으세요',
      subtitle: '단 몇 초 만에 아이디어를 던지고 실시간 피드백을 받으세요.',
      placeholder: '당신의 아이디어를 적어보세요...\n\nShift+Enter로 줄바꿈, Enter로 빠른 제출\nCtrl+Enter로 상세 작성',
      quickSubmit: '빠른 제출',
      enhancedSubmit: '상세 작성',
      saveDraft: '임시저장',
      loadDraft: '불러오기',
      trustIndicators: '수천 명의 혁신가들이 이미 아이디어를 던졌습니다.',
      keyboardHint: 'Shift+Enter: 줄바꿈 | Enter: 빠른 제출 | Ctrl+Enter: 상세 작성',
      draftSaved: '임시저장 완료',
      recentDrafts: '최근 초안',
      exampleIdeas: '예시 아이디어',
      example1: 'AI 농업 솔루션',
      example2: '블록체인 투표',
      example3: '친환경 앱',
      example4: '스마트 헬스케어',
      example5: 'AR 교육 플랫폼'
    },
    en: {
      title: 'Drop Your Idea, Catch Opportunity',
      subtitle: 'Drop your idea in seconds and get real-time feedback.',
      placeholder: 'Write your idea here...\n\nShift+Enter for new line, Enter for quick submit\nCtrl+Enter for detailed writing',
      quickSubmit: 'Quick Submit',
      enhancedSubmit: 'Detailed Writing',
      saveDraft: 'Save Draft',
      loadDraft: 'Load Draft',
      trustIndicators: 'Thousands of innovators have already dropped their ideas.',
      keyboardHint: 'Shift+Enter: New line | Enter: Quick submit | Ctrl+Enter: Detailed writing',
      draftSaved: 'Draft saved',
      recentDrafts: 'Recent Drafts',
      exampleIdeas: 'Example Ideas',
      example1: 'AI Agriculture',
      example2: 'Blockchain Voting',
      example3: 'Green Tech App',
      example4: 'Smart Healthcare',
      example5: 'AR Education'
    }
  };

  // Auto-save while typing
  useEffect(() => {
    if (ideaText.length > 10) {
      const timer = setTimeout(() => {
        autoSave('', ideaText, 'quick');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [ideaText, autoSave]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Enter: Open enhanced modal
        e.preventDefault();
        if (ideaText.trim()) {
          setShowEnhancedModal(true);
        }
      } else if (!e.shiftKey) {
        // Enter (without Shift): Quick submit
        e.preventDefault();
        if (ideaText.trim()) {
          handleQuickSubmit();
        }
      }
      // Shift+Enter: Default behavior (new line)
    }
  };

  const handleQuickSubmit = async () => {
    if (ideaText.trim()) {
      setSubmittedIdea(ideaText.trim());
      setShowReactionSystem(true);
      setIsSubmitting(true);
      
      try {
        await onIdeaDrop(ideaText.trim());
        setIdeaText('');
      } catch (error) {
        console.error('Quick submit error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEnhancedSubmit = async (title: string, fullIdea: string) => {
    setSubmittedIdea(fullIdea);
    setShowEnhancedModal(false);
    setShowReactionSystem(true);
    setIsSubmitting(true);
    
    try {
      await onIdeaDrop(fullIdea);
      setIdeaText('');
    } catch (error) {
      console.error('Enhanced submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactionComplete = (reactions: any) => {
    console.log('Reactions completed:', reactions);
    setShowReactionSystem(false);
    setSubmittedIdea('');
    setIsSubmitting(false);
  };

  const handleSaveDraft = () => {
    if (ideaText.trim()) {
      saveDraft('', ideaText, 'quick');
      toast({
        title: text[currentLanguage].draftSaved,
        duration: 2000,
      });
    }
  };

  const handleLoadDraft = (draftId: string) => {
    const draft = loadDraft(draftId);
    if (draft) {
      setIdeaText(draft.content);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 opacity-50"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        {/* Header Content */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {text[currentLanguage].title}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          {text[currentLanguage].subtitle}
        </p>

        {/* Main Input Form */}
        {!showReactionSystem ? (
          <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
              <Textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={text[currentLanguage].placeholder}
                className="w-full min-h-[150px] md:min-h-[120px] border-0 focus:ring-0 text-base md:text-lg resize-none"
                style={{ fontSize: '16px' }} // Prevent iOS zoom
                maxLength={500}
              />
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {text[currentLanguage].keyboardHint}
                </div>
                <div className="text-sm text-gray-500">
                  {ideaText.length}/500
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col md:flex-row gap-3 mt-4">
                <div className="flex gap-3 flex-1">
                  <Button
                    onClick={handleQuickSubmit}
                    disabled={!ideaText.trim() || isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 min-h-[48px]"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    {text[currentLanguage].quickSubmit}
                  </Button>
                  
                  <Button
                    onClick={() => setShowEnhancedModal(true)}
                    disabled={!ideaText.trim()}
                    variant="outline"
                    className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 min-h-[48px]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {text[currentLanguage].enhancedSubmit}
                  </Button>
                </div>

                {/* Draft controls */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveDraft}
                    disabled={!ideaText.trim()}
                    variant="outline"
                    size="sm"
                    className="min-h-[48px] px-3"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Recent drafts */}
              {drafts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">{text[currentLanguage].recentDrafts}:</p>
                  <div className="flex flex-wrap gap-2">
                    {drafts.slice(0, 3).map((draft) => (
                      <Button
                        key={draft.id}
                        onClick={() => handleLoadDraft(draft.id)}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-gray-50 hover:bg-gray-100"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {draft.content.slice(0, 20)}...
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Immediate Reaction System */
          <div className="w-full max-w-3xl mx-auto mb-12">
            <Card className="shadow-2xl border-2 border-purple-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  💫 "{submittedIdea.split('\n')[0]}" 분석 중...
                </h3>
                <IdeaReactionSystem
                  ideaText={submittedIdea}
                  onReactionComplete={handleReactionComplete}
                  currentLanguage={currentLanguage}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trust Indicators */}
        <p className="text-sm text-gray-500 mb-4">
          <Sparkles className="inline-block w-4 h-4 mr-1" />
          {text[currentLanguage].trustIndicators}
        </p>

        {/* Example Ideas */}
        <div className="mb-8">
          <h4 className="text-gray-600 font-semibold mb-2">{text[currentLanguage].exampleIdeas}</h4>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Lightbulb className="w-4 h-4 mr-2" />
              {text[currentLanguage].example1}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Code className="w-4 h-4 mr-2" />
              {text[currentLanguage].example2}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Flame className="w-4 h-4 mr-2" />
              {text[currentLanguage].example3}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Rocket className="w-4 h-4 mr-2" />
              {text[currentLanguage].example4}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Sparkles className="w-4 h-4 mr-2" />
              {text[currentLanguage].example5}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Idea Modal */}
      <EnhancedIdeaModal
        isOpen={showEnhancedModal}
        onClose={() => setShowEnhancedModal(false)}
        onSubmit={handleEnhancedSubmit}
        initialTitle={ideaText.trim()}
        currentLanguage={currentLanguage}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default HeroSection;
