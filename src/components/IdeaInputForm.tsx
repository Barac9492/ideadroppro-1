
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Rocket, Plus, Save, Clock, Zap, Gift } from 'lucide-react';
import { useIdeaDraft } from '@/hooks/useIdeaDraft';
import { toast } from '@/hooks/use-toast';

interface IdeaInputFormProps {
  currentLanguage: 'ko' | 'en';
  onQuickSubmit: (idea: string) => Promise<void>;
  onEnhancedSubmit: () => void;
  isSubmitting: boolean;
}

const IdeaInputForm: React.FC<IdeaInputFormProps> = ({
  currentLanguage,
  onQuickSubmit,
  onEnhancedSubmit,
  isSubmitting
}) => {
  const [ideaText, setIdeaText] = useState('');
  const { drafts, saveDraft, loadDraft, autoSave } = useIdeaDraft({ currentLanguage });

  const text = {
    ko: {
      placeholder: '💡 어떤 아이디어든 환영합니다!\n\n예시:\n• "배달음식 포장지를 재활용하는 앱"\n• "AI로 반려동물 건강 체크하는 서비스"\n• "중고차 실시간 경매 플랫폼"\n\n🚀 Enter로 바로 제출, Ctrl+Enter로 상세 작성',
      quickSubmit: '🚀 지금 바로 제출',
      enhancedSubmit: '📝 상세하게 작성',
      keyboardHint: '💡 팁: Shift+Enter로 줄바꿈 | Enter로 바로 제출 | Ctrl+Enter로 상세 작성',
      draftSaved: '💾 임시저장 완료',
      recentDrafts: '📋 최근 작성 중인 아이디어',
      bonusReward: '🎁 첫 제출 보너스',
      fastSubmit: '⚡ 30초 완성',
      getReward: '보상 받기'
    },
    en: {
      placeholder: '💡 Any idea is welcome!\n\nExamples:\n• "App to rec}cle food delivery packaging"\n• "AI pet health check service"\n• "Real-time used car auction platform"\n\n🚀 Enter to submit, Ctrl+Enter for detailed writing',
      quickSubmit: '🚀 Submit Now',
      enhancedSubmit: '📝 Detailed Writing',
      keyboardHint: '💡 Tip: Shift+Enter for new line | Enter to submit | Ctrl+Enter for detailed',
      draftSaved: '💾 Draft saved',
      recentDrafts: '📋 Recent drafts',
      bonusReward: '🎁 First Submit Bonus',
      fastSubmit: '⚡ 30sec Complete',
      getReward: 'Get Reward'
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
          onEnhancedSubmit();
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
      await onQuickSubmit(ideaText.trim());
      setIdeaText('');
    }
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
    <div className="w-full max-w-3xl mx-auto mb-12">
      {/* Korean Bonus Banner */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 mb-4 text-white text-center shadow-lg">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Gift className="w-5 h-5 animate-bounce" />
          <span className="font-bold">{text[currentLanguage].bonusReward}</span>
          <Gift className="w-5 h-5 animate-bounce" />
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-white/20 rounded-lg p-2">
            <div className="font-bold">+100 XP</div>
            <div className="text-xs">경험치</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="font-bold">무료 분석</div>
            <div className="text-xs">AI 평가</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <div className="font-bold">VC 노출</div>
            <div className="text-xs">우선 추천</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200">
        {/* Speed Indicator */}
        <div className="flex items-center justify-center mb-4">
          <Badge className="bg-red-100 text-red-700 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            {text[currentLanguage].fastSubmit}
          </Badge>
        </div>

        <Textarea
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={text[currentLanguage].placeholder}
          className="w-full min-h-[180px] md:min-h-[160px] border-2 border-purple-100 focus:border-purple-300 text-base md:text-lg resize-none rounded-xl"
          style={{ fontSize: '16px' }} // Prevent iOS zoom
          maxLength={500}
        />
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 leading-relaxed">
            {text[currentLanguage].keyboardHint}
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {ideaText.length}/500
          </div>
        </div>
        
        {/* Enhanced Action buttons - Korean Mobile Optimized */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleQuickSubmit}
              disabled={!ideaText.trim() || isSubmitting}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 text-lg shadow-lg transform hover:scale-105 transition-all"
              size="lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              {text[currentLanguage].quickSubmit}
            </Button>
            
            <Button
              onClick={onEnhancedSubmit}
              disabled={!ideaText.trim()}
              variant="outline"
              size="lg"
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-bold py-4 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              {text[currentLanguage].enhancedSubmit}
            </Button>
          </div>

          {/* Draft controls - Korean Style */}
          <div className="flex justify-center">
            <Button
              onClick={handleSaveDraft}
              disabled={!ideaText.trim()}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-purple-600"
            >
              <Save className="w-4 h-4 mr-2" />
              임시저장
            </Button>
          </div>
        </div>

        {/* Recent drafts - Korean UX */}
        {drafts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-3 font-medium">{text[currentLanguage].recentDrafts}:</p>
            <div className="grid grid-cols-1 gap-2">
              {drafts.slice(0, 3).map((draft) => (
                <Button
                  key={draft.id}
                  onClick={() => handleLoadDraft(draft.id)}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left bg-gray-50 hover:bg-purple-50 border-gray-200 p-3"
                >
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{draft.content.slice(0, 40)}...</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaInputForm;
