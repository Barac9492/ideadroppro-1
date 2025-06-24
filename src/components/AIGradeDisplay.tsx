
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Shuffle, ArrowRight } from 'lucide-react';

interface AIGradeDisplayProps {
  currentLanguage: 'ko' | 'en';
  grade: string;
  unifiedIdea: string;
  onProceedToModules: () => void;
}

const AIGradeDisplay: React.FC<AIGradeDisplayProps> = ({
  currentLanguage,
  grade,
  unifiedIdea,
  onProceedToModules
}) => {
  const text = {
    ko: {
      title: '1차 아이디어 완성!',
      gradeLabel: 'AI 평가 등급',
      ideaLabel: '완성된 아이디어',
      nextStep: '이제 모듈로 분해해보겠습니다',
      proceedButton: '모듈 카드로 분해하기',
      improveTip: '더 높은 등급을 원한다면? 리믹스로 개선해보세요!',
      gradeDescriptions: {
        'A+': '완벽한 아이디어! 즉시 실행 가능합니다',
        'A': '매우 우수한 아이디어입니다',
        'B+': '좋은 아이디어! 약간의 개선이 필요해요',
        'B': '괜찮은 아이디어입니다',
        'C+': '보통 수준의 아이디어예요',
        'C': '개선이 필요한 아이디어입니다',
        'D': '많은 개선이 필요해요',
        'F': '처음부터 다시 생각해보세요'
      }
    },
    en: {
      title: '1st Idea Complete!',
      gradeLabel: 'AI Grade',
      ideaLabel: 'Completed Idea',
      nextStep: 'Now let\'s break it down into modules',
      proceedButton: 'Break into Module Cards',
      improveTip: 'Want a higher grade? Try improving with remix!',
      gradeDescriptions: {
        'A+': 'Perfect idea! Ready for immediate execution',
        'A': 'Excellent idea',
        'B+': 'Good idea! Needs slight improvement',
        'B': 'Decent idea',
        'C+': 'Average level idea',
        'C': 'Needs improvement',
        'D': 'Needs significant improvement',
        'F': 'Think again from the beginning'
      }
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'from-green-500 to-emerald-500';
    if (grade.startsWith('B')) return 'from-blue-500 to-cyan-500';
    if (grade.startsWith('C')) return 'from-yellow-500 to-orange-500';
    if (grade === 'D') return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const getGradeTextColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-700';
    if (grade.startsWith('B')) return 'text-blue-700';
    if (grade.startsWith('C')) return 'text-yellow-700';
    if (grade === 'D') return 'text-orange-700';
    return 'text-red-700';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="animate-bounce">
            <Star className="w-16 h-16 text-yellow-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          {text[currentLanguage].title}
        </h1>
      </div>

      {/* Grade Display */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getGradeColor(grade)} flex items-center justify-center shadow-2xl`}>
                <span className="text-5xl font-bold text-white">{grade}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Badge className={`${getGradeTextColor(grade)} bg-transparent border-current text-lg px-4 py-2`}>
                {text[currentLanguage].gradeLabel}
              </Badge>
              <p className={`text-xl font-semibold ${getGradeTextColor(grade)}`}>
                {text[currentLanguage].gradeDescriptions[grade as keyof typeof text[typeof currentLanguage]['gradeDescriptions']]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Idea */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span>{text[currentLanguage].ideaLabel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
            <p className="text-lg text-gray-800 leading-relaxed">{unifiedIdea}</p>
          </div>
        </CardContent>
      </Card>

      {/* Next Step */}
      <Card className="border-2 border-dashed border-purple-300">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {text[currentLanguage].nextStep}
            </h3>
            <p className="text-gray-600">
              {text[currentLanguage].improveTip}
            </p>
          </div>
          
          <Button
            onClick={onProceedToModules}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            {text[currentLanguage].proceedButton}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIGradeDisplay;
