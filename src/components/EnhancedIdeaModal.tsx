
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Zap, Send, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EnhancedIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
  initialTitle: string;
  currentLanguage: 'ko' | 'en';
  isSubmitting: boolean;
}

const EnhancedIdeaModal: React.FC<EnhancedIdeaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTitle,
  currentLanguage,
  isSubmitting
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState('');
  const [showTitleWarning, setShowTitleWarning] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const text = {
    ko: {
      modalTitle: '아이디어 세부사항 작성',
      titleLabel: '아이디어 제목',
      titlePlaceholder: '당신의 아이디어를 한 줄로 요약해주세요...',
      descriptionLabel: '상세 설명 (선택사항)',
      descriptionPlaceholder: '아이디어에 대해 더 자세히 설명해주세요...\n\n예시:\n- 어떤 문제를 해결하나요?\n- 어떻게 작동하나요?\n- 누가 사용하게 될까요?\n- 왜 필요한가요?',
      submitButton: 'AI 분석으로 제출하기',
      cancelButton: '취소',
      submitting: 'AI가 분석 중...',
      titleRequired: '아이디어 제목을 입력해주세요',
      charCount: '글자',
      keyboardShortcuts: 'Shift+Enter: 줄바꿈 | Ctrl+Enter: 제출',
      tip: '💡 팁: 구체적일수록 더 정확한 AI 분석을 받을 수 있습니다'
    },
    en: {
      modalTitle: 'Write Idea Details',
      titleLabel: 'Idea Title',
      titlePlaceholder: 'Summarize your idea in one line...',
      descriptionLabel: 'Detailed Description (Optional)',
      descriptionPlaceholder: 'Describe your idea in more detail...\n\nExample:\n- What problem does it solve?\n- How does it work?\n- Who will use it?\n- Why is it needed?',
      submitButton: 'Submit with AI Analysis',
      cancelButton: 'Cancel',
      submitting: 'AI analyzing...',
      titleRequired: 'Please enter an idea title',
      charCount: 'characters',
      keyboardShortcuts: 'Shift+Enter: New line | Ctrl+Enter: Submit',
      tip: '💡 Tip: More specific details lead to better AI analysis'
    }
  };

  useEffect(() => {
    if (isOpen && initialTitle) {
      setTitle(initialTitle);
      // Focus on description if title is pre-filled
      setTimeout(() => {
        if (descriptionRef.current) {
          descriptionRef.current.focus();
        }
      }, 100);
    } else if (isOpen) {
      // Focus on title if empty
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, initialTitle]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setShowTitleWarning(true);
      if (titleRef.current) {
        titleRef.current.focus();
      }
      return;
    }
    
    const combinedIdea = description.trim() 
      ? `${title.trim()}\n\n${description.trim()}`
      : title.trim();
    
    onSubmit(title.trim(), combinedIdea);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'title' | 'description') => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Enter or Cmd+Enter: Submit
        e.preventDefault();
        handleSubmit();
      } else if (field === 'title') {
        // Enter in title: Move to description
        e.preventDefault();
        if (descriptionRef.current) {
          descriptionRef.current.focus();
        }
      }
      // For description, Enter normally creates new line (default behavior)
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setShowTitleWarning(false);
  };

  const totalChars = title.length + description.length;
  const maxChars = 1000;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Lightbulb className="w-6 h-6 text-purple-600" />
            <span>{text[currentLanguage].modalTitle}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {text[currentLanguage].titleLabel} <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">
                {title.length}/100
              </span>
            </div>
            <Input
              ref={titleRef}
              value={title}
              onChange={handleTitleChange}
              onKeyDown={(e) => handleKeyDown(e, 'title')}
              placeholder={text[currentLanguage].titlePlaceholder}
              className={`${showTitleWarning ? 'border-red-500' : ''}`}
              maxLength={100}
              disabled={isSubmitting}
            />
            {showTitleWarning && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {text[currentLanguage].titleRequired}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {text[currentLanguage].descriptionLabel}
              </label>
              <span className="text-xs text-gray-500">
                {description.length}/900
              </span>
            </div>
            <Textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'description')}
              placeholder={text[currentLanguage].descriptionPlaceholder}
              className="min-h-[200px] resize-none"
              maxLength={900}
              disabled={isSubmitting}
            />
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700 mb-1">
              {text[currentLanguage].keyboardShortcuts}
            </p>
            <p className="text-xs text-blue-600">
              {text[currentLanguage].tip}
            </p>
          </div>

          {/* Character Count & Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {totalChars}/{maxChars} {text[currentLanguage].charCount}
              </Badge>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {text[currentLanguage].cancelButton}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!title.trim() || totalChars > maxChars || isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{text[currentLanguage].submitting}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <Send className="w-4 h-4" />
                    <span>{text[currentLanguage].submitButton}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedIdeaModal;
