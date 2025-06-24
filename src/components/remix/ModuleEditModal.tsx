
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ModuleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleType: string;
  currentModule?: any;
  currentLanguage: 'ko' | 'en';
  onSave: (newModule: any) => void;
}

const ModuleEditModal: React.FC<ModuleEditModalProps> = ({
  isOpen,
  onClose,
  moduleType,
  currentModule,
  currentLanguage,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [estimatedScore, setEstimatedScore] = useState(85);

  const text = {
    ko: {
      title: '모듈 편집',
      editTitle: '제목',
      editContent: '내용',
      estimatedScore: '예상 점수',
      save: '저장하기',
      cancel: '취소',
      titlePlaceholder: '모듈 제목을 입력하세요...',
      contentPlaceholder: '모듈 내용을 자세히 설명해주세요...',
      aiHelp: 'AI 도움받기',
      moduleTypes: {
        problem: '문제 정의',
        solution: '솔루션',
        target_customer: '타겟 고객',
        value_proposition: '가치 제안',
        revenue_model: '수익 모델',
        key_activities: '핵심 활동',
        key_resources: '핵심 자원',
        channels: '유통 채널',
        competitive_advantage: '경쟁 우위',
        market_size: '시장 규모',
        team: '팀',
        potential_risks: '잠재 리스크'
      }
    },
    en: {
      title: 'Edit Module',
      editTitle: 'Title',
      editContent: 'Content',
      estimatedScore: 'Estimated Score',
      save: 'Save',
      cancel: 'Cancel',
      titlePlaceholder: 'Enter module title...',
      contentPlaceholder: 'Describe module content in detail...',
      aiHelp: 'Get AI Help',
      moduleTypes: {
        problem: 'Problem',
        solution: 'Solution',
        target_customer: 'Target Customer',
        value_proposition: 'Value Proposition',
        revenue_model: 'Revenue Model',
        key_activities: 'Key Activities',
        key_resources: 'Key Resources',
        channels: 'Channels',
        competitive_advantage: 'Competitive Advantage',
        market_size: 'Market Size',
        team: 'Team',
        potential_risks: 'Potential Risks'
      }
    }
  };

  useEffect(() => {
    if (currentModule) {
      setTitle(currentModule.module_data?.title || currentModule.title || '');
      setContent(currentModule.module_data?.content || currentModule.content || '');
      const score = currentModule.module_data?.score || currentModule.quality_score || 85;
      setEstimatedScore(Math.round(score));
    } else {
      setTitle('');
      setContent('');
      setEstimatedScore(85);
    }
  }, [currentModule, isOpen]);

  // Simple score estimation based on content length and quality
  useEffect(() => {
    if (content.length > 0) {
      let score = 70; // Base score
      if (content.length > 50) score += 10;
      if (content.length > 100) score += 5;
      if (content.includes('고객') || content.includes('customer')) score += 5;
      if (content.includes('시장') || content.includes('market')) score += 5;
      setEstimatedScore(Math.min(95, score));
    }
  }, [content]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: '입력 필요',
        description: '제목과 내용을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    const newModule = {
      id: currentModule?.id || `custom_${Date.now()}`,
      module_type: moduleType,
      module_data: {
        title: title.trim(),
        content: content.trim(),
        score: estimatedScore,
        type: moduleType
      },
      title: title.trim(),
      content: content.trim(),
      quality_score: estimatedScore,
      created_at: new Date().toISOString(),
      is_custom: true
    };

    onSave(newModule);
    
    toast({
      title: '모듈이 저장되었습니다!',
      description: `${text[currentLanguage].moduleTypes[moduleType as keyof typeof text[typeof currentLanguage]['moduleTypes']]} 모듈이 업데이트되었습니다.`,
    });

    onClose();
  };

  const handleAIHelp = () => {
    toast({
      title: 'AI 도움 기능',
      description: '곧 AI가 모듈 작성을 도와드릴 예정입니다!',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Badge variant="default" className="bg-purple-600">
              {text[currentLanguage].moduleTypes[moduleType as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
            </Badge>
            <span>{text[currentLanguage].title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {text[currentLanguage].editTitle}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={text[currentLanguage].titlePlaceholder}
              className="w-full"
            />
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {text[currentLanguage].editContent}
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={text[currentLanguage].contentPlaceholder}
              className="w-full min-h-[120px]"
              rows={6}
            />
          </div>

          {/* Estimated Score */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {text[currentLanguage].estimatedScore}
              </span>
              <Badge variant="outline" className="text-sm">
                {estimatedScore}점
              </Badge>
            </div>
          </div>

          {/* AI Help Button */}
          <Button
            onClick={handleAIHelp}
            variant="outline"
            className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {text[currentLanguage].aiHelp}
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            {text[currentLanguage].cancel}
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            <Save className="w-4 h-4 mr-2" />
            {text[currentLanguage].save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleEditModal;
