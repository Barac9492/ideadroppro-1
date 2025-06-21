
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Shuffle, Zap, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RemixButtonProps {
  originalText: string;
  originalScore: number;
  remixCount: number;
  chainDepth: number;
  onRemix: (remixText: string) => void;
  isRemixing: boolean;
  currentLanguage: 'ko' | 'en';
  isAuthenticated: boolean;
  disabled?: boolean;
}

const RemixButton: React.FC<RemixButtonProps> = ({
  originalText,
  originalScore,
  remixCount,
  chainDepth,
  onRemix,
  isRemixing,
  currentLanguage,
  isAuthenticated,
  disabled = false
}) => {
  const [remixText, setRemixText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const text = {
    ko: {
      remix: '리믹스하기',
      remixTitle: '아이디어 리믹스',
      remixPlaceholder: '이 아이디어를 어떻게 개선하시겠습니까?',
      submit: '리믹스 제출',
      cancel: '취소',
      originalIdea: '원본 아이디어',
      yourRemix: '당신의 리믹스',
      remixCount: '개의 리믹스',
      chainDepth: '단계 리믹스',
      earnPoints: '+8 영향력 점수 획득!'
    },
    en: {
      remix: 'Remix',
      remixTitle: 'Remix Idea',
      remixPlaceholder: 'How would you improve this idea?',
      submit: 'Submit Remix',
      cancel: 'Cancel',
      originalIdea: 'Original Idea',
      yourRemix: 'Your Remix',
      remixCount: 'remixes',
      chainDepth: 'level remix',
      earnPoints: '+8 Influence Points!'
    }
  };

  const handleSubmit = () => {
    if (remixText.trim()) {
      onRemix(remixText.trim());
      setRemixText('');
      setIsOpen(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100 group relative overflow-hidden"
        >
          <div className="flex items-center space-x-2">
            <Shuffle className="w-4 h-4 text-purple-600 group-hover:animate-spin" />
            <span className="text-purple-700 font-medium">{text[currentLanguage].remix}</span>
            {remixCount > 0 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                {remixCount}
              </Badge>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shuffle className="w-5 h-5 text-purple-600" />
            <span>{text[currentLanguage].remixTitle}</span>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Zap className="w-3 h-3 mr-1" />
              {text[currentLanguage].earnPoints}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Remix Chain Info */}
          {(remixCount > 0 || chainDepth > 0) && (
            <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div className="text-sm text-purple-700">
                {remixCount > 0 && <span>{remixCount} {text[currentLanguage].remixCount}</span>}
                {chainDepth > 0 && <span className="ml-2">{chainDepth} {text[currentLanguage].chainDepth}</span>}
              </div>
            </div>
          )}

          {/* Original Idea */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {text[currentLanguage].originalIdea}
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-gray-800">{originalText}</p>
              <div className="mt-2">
                <Badge variant="outline">Score: {originalScore.toFixed(1)}</Badge>
              </div>
            </div>
          </div>

          {/* Remix Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {text[currentLanguage].yourRemix}
            </label>
            <Textarea
              value={remixText}
              onChange={(e) => setRemixText(e.target.value)}
              placeholder={text[currentLanguage].remixPlaceholder}
              className="min-h-32 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {remixText.length}/500
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isRemixing}
            >
              {text[currentLanguage].cancel}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!remixText.trim() || isRemixing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isRemixing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                text[currentLanguage].submit
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemixButton;
