
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, HelpCircle, CheckCircle, X } from 'lucide-react';

interface ModuleImprovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleType: string;
  moduleContent: string;
  currentLanguage: 'ko' | 'en';
  onImprove: (improvedContent: string) => void;
}

const ModuleImprovementModal: React.FC<ModuleImprovementModalProps> = ({
  isOpen,
  onClose,
  moduleType,
  moduleContent,
  currentLanguage,
  onImprove
}) => {
  const [improvedContent, setImprovedContent] = useState(moduleContent);
  const [isImproving, setIsImproving] = useState(false);

  const text = {
    ko: {
      title: '모듈 개선하기',
      currentContent: '현재 내용',
      improvementTips: '개선 팁',
      improvedContent: '개선된 내용',
      applyChanges: '변경사항 적용',
      cancel: '취소',
      improving: '개선 중...',
      helpQuestions: {
        problem: [
          '문제가 충분히 구체적인가요?',
          '문제의 규모나 심각성이 명확한가요?',
          '누가 이 문제로 가장 고통받고 있나요?'
        ],
        solution: [
          '솔루션이 문제를 직접적으로 해결하나요?',
          '구현 가능성은 어떤가요?',
          '기존 솔루션과 어떻게 다른가요?'
        ],
        target_customer: [
          '타겟 고객이 구체적으로 정의되었나요?',
          '이들의 구매력과 니즈가 명확한가요?',
          '접근 가능한 고객층인가요?'
        ],
        value_proposition: [
          '고객이 얻는 핵심 가치는 무엇인가요?',
          '왜 경쟁사 대신 우리를 선택해야 하나요?',
          '가치가 측정 가능한가요?'
        ]
      }
    },
    en: {
      title: 'Improve Module',
      currentContent: 'Current Content',
      improvementTips: 'Improvement Tips',
      improvedContent: 'Improved Content',
      applyChanges: 'Apply Changes',
      cancel: 'Cancel',
      improving: 'Improving...',
      helpQuestions: {
        problem: [
          'Is the problem specific enough?',
          'Is the scale or severity of the problem clear?',
          'Who suffers most from this problem?'
        ],
        solution: [
          'Does the solution directly address the problem?',
          'How feasible is the implementation?',
          'How is it different from existing solutions?'
        ],
        target_customer: [
          'Are target customers specifically defined?',
          'Are their purchasing power and needs clear?',
          'Is this an accessible customer segment?'
        ],
        value_proposition: [
          'What is the core value customers receive?',
          'Why should they choose us over competitors?',
          'Is the value measurable?'
        ]
      }
    }
  };

  const getHelpQuestions = () => {
    const questions = text[currentLanguage].helpQuestions;
    return questions[moduleType as keyof typeof questions] || questions.problem;
  };

  const handleImprove = async () => {
    setIsImproving(true);
    // Simulate AI improvement
    setTimeout(() => {
      onImprove(improvedContent);
      setIsImproving(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <span>{text[currentLanguage].title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Content */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Badge variant="outline" className="mr-2">현재</Badge>
              {text[currentLanguage].currentContent}
            </h4>
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-700 leading-relaxed">{moduleContent}</p>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Tips */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <HelpCircle className="w-4 h-4 text-blue-500 mr-2" />
              {text[currentLanguage].improvementTips}
            </h4>
            <div className="space-y-2">
              {getHelpQuestions().map((question, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">{question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Improved Content */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Badge className="mr-2 bg-green-600">개선</Badge>
              {text[currentLanguage].improvedContent}
            </h4>
            <Textarea
              value={improvedContent}
              onChange={(e) => setImprovedContent(e.target.value)}
              className="min-h-[120px] text-base"
              placeholder="위의 질문들을 참고해서 내용을 개선해보세요..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              {text[currentLanguage].cancel}
            </Button>
            <Button 
              onClick={handleImprove}
              disabled={isImproving || improvedContent.trim().length < 20}
              className="bg-green-600 hover:bg-green-700"
            >
              {isImproving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {isImproving ? text[currentLanguage].improving : text[currentLanguage].applyChanges}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleImprovementModal;
