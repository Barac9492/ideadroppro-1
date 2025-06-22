
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Plus, Save, Clock } from 'lucide-react';
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
      placeholder: '당신의 아이디어를 적어보세요...\n\nShift+Enter로 줄바꿈, Enter로 빠른 제출\nCtrl+Enter로 상세 작성',
      quickSubmit: '빠른 제출',
      enhancedSubmit: '상세 작성',
      keyboardHint: 'Shift+Enter: 줄바꿈 | Enter: 빠른 제출 | Ctrl+Enter: 상세 작성',
      draftSaved: '임시저장 완료',
      recentDrafts: '최근 초안'
    },
    en: {
      placeholder: 'Write your idea here...\n\nShift+Enter for new line, Enter for quick submit\nCtrl+Enter for detailed writing',
      quickSubmit: 'Quick Submit',
      enhancedSubmit: 'Detailed Writing',
      keyboardHint: 'Shift+Enter: New line | Enter: Quick submit | Ctrl+Enter: Detailed writing',
      draftSaved: 'Draft saved',
      recentDrafts: 'Recent Drafts'
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
              onClick={onEnhancedSubmit}
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
  );
};

export default IdeaInputForm;
