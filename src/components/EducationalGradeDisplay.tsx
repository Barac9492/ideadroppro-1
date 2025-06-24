
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Lightbulb, ArrowRight, Target } from 'lucide-react';
import { IdeaQuality } from './IdeaQualityAnalyzer';

interface EducationalGradeDisplayProps {
  currentLanguage: 'ko' | 'en';
  grade: string;
  unifiedIdea: string;
  originalQuality: IdeaQuality;
  onProceedToModules: () => void;
  onRetryWithEducation: () => void;
}

const EducationalGradeDisplay: React.FC<EducationalGradeDisplayProps> = ({
  currentLanguage,
  grade,
  unifiedIdea,
  originalQuality,
  onProceedToModules,
  onRetryWithEducation
}) => {
  const isLowGrade = ['D', 'F'].includes(grade);
  
  const text = {
    ko: {
      title: '1차 아이디어 완성!',
      gradeLabel: 'AI 평가 등급',
      ideaLabel: '완성된 아이디어',
      nextStep: '이제 모듈로 분해해보겠습니다',
      proceedButton: '모듈 카드로 분해하기',
      educationMode: '학습 모드로 개선하기',
      learningTitle: '💡 학습 포인트',
      lowGradeMessage: '아직 개선할 여지가 많습니다! 함께 더 나은 아이디어로 발전시켜보세요.',
      successCases: '성공 사례들',
      improvementTips: '개선 방법',
      gradeDescriptions: {
        'A+': '완벽한 아이디어! 즉시 실행 가능합니다',
        'A': '매우 우수한 아이디어입니다',
        'B+': '좋은 아이디어! 약간의 개선이 필요해요',
        'B': '괜찮은 아이디어입니다',
        'C+': '보통 수준의 아이디어예요',
        'C': '개선이 필요한 아이디어입니다',
        'D': '많은 개선이 필요해요 - 함께 발전시켜보세요!',
        'F': '새로운 관점으로 다시 생각해보세요!'
      },
      improvementSuggestions: {
        'D': [
          '문제 정의를 더 구체적으로 해보세요',
          '타겟 고객을 명확히 정의해보세요',
          '경쟁사와의 차별점을 찾아보세요'
        ],
        'F': [
          '실제 존재하는 문제인지 검증해보세요',
          '시장의 니즈를 조사해보세요',
          '비슷한 성공 사례를 참고해보세요'
        ]
      }
    },
    en: {
      title: '1st Idea Complete!',
      gradeLabel: 'AI Grade',
      ideaLabel: 'Completed Idea',
      nextStep: 'Now let\'s break it down into modules',
      proceedButton: 'Break into Module Cards',
      educationMode: 'Improve with Learning Mode',
      learningTitle: '💡 Learning Points',
      lowGradeMessage: 'There\'s still room for improvement! Let\'s develop it into a better idea together.',
      successCases: 'Success Cases',
      improvementTips: 'Improvement Methods',
      gradeDescriptions: {
        'A+': 'Perfect idea! Ready for immediate execution',
        'A': 'Excellent idea',
        'B+': 'Good idea! Needs slight improvement',
        'B': 'Decent idea',
        'C+': 'Average level idea',
        'C': 'Needs improvement',
        'D': 'Needs significant improvement - let\'s develop it together!',
        'F': 'Think again with a new perspective!'
      },
      improvementSuggestions: {
        'D': [
          'Define the problem more specifically',
          'Clearly define target customers',
          'Find differentiation from competitors'
        ],
        'F': [
          'Verify if this is a real problem',
          'Research market needs',
          'Reference similar success cases'
        ]
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Grade Display */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {text[currentLanguage].title}
            </h1>
            
            <div className="flex justify-center">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getGradeColor(grade)} flex items-center justify-center shadow-2xl`}>
                <span className="text-5xl font-bold text-white">{grade}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Badge className="text-lg px-4 py-2">
                {text[currentLanguage].gradeLabel}
              </Badge>
              <p className="text-xl font-semibold text-gray-700">
                {text[currentLanguage].gradeDescriptions[grade as keyof typeof text[typeof currentLanguage]['gradeDescriptions']]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Section for Low Grades */}
      {isLowGrade && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <BookOpen className="w-5 h-5" />
              <span>{text[currentLanguage].learningTitle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-yellow-700">{text[currentLanguage].lowGradeMessage}</p>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-yellow-800">{text[currentLanguage].improvementTips}</h4>
              <ul className="list-disc list-inside space-y-1">
                {(text[currentLanguage].improvementSuggestions[grade as 'D' | 'F'] || []).map((tip, index) => (
                  <li key={index} className="text-sm text-yellow-700">{tip}</li>
                ))}
              </ul>
            </div>
            
            <Button
              onClick={onRetryWithEducation}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              {text[currentLanguage].educationMode}
            </Button>
          </CardContent>
        </Card>
      )}

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
          <h3 className="text-2xl font-bold text-gray-900">
            {text[currentLanguage].nextStep}
          </h3>
          
          <Button
            onClick={onProceedToModules}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            {text[currentLanguage].proceedButton}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationalGradeDisplay;
