
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Target, 
  ArrowRight, 
  Sparkles,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InputModeSelectorProps {
  currentLanguage: 'ko' | 'en';
  onModeSelect: (mode: 'simple' | 'builder') => void;
}

const InputModeSelector: React.FC<InputModeSelectorProps> = ({
  currentLanguage,
  onModeSelect
}) => {
  const navigate = useNavigate();

  const text = {
    ko: {
      title: '어떻게 아이디어를 작성하시겠어요?',
      simple: {
        title: '간단 입력',
        description: '자유롭게 아이디어를 작성하면 AI가 즉시 분석해드립니다',
        features: ['빠른 입력', 'AI 즉시 분석', '초보자 추천'],
        button: '간단하게 시작'
      },
      builder: {
        title: '모듈 빌더',
        description: '체계적인 12개 모듈로 완성도 높은 아이디어를 구성해보세요',
        features: ['체계적 구성', '모듈별 분석', '전문가 추천'],
        button: '빌더로 이동'
      },
      recommended: '추천'
    },
    en: {
      title: 'How would you like to create your idea?',
      simple: {
        title: 'Simple Input',
        description: 'Write your idea freely and get instant AI analysis',
        features: ['Quick input', 'Instant AI analysis', 'Beginner friendly'],
        button: 'Start Simple'
      },
      builder: {
        title: 'Module Builder',
        description: 'Create comprehensive ideas with 12 structured modules',
        features: ['Systematic approach', 'Module-wise analysis', 'Expert recommended'],
        button: 'Go to Builder'
      },
      recommended: 'Recommended'
    }
  };

  const handleBuilderMode = () => {
    navigate('/builder');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        {text[currentLanguage].title}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Simple Mode */}
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">{text[currentLanguage].simple.title}</h3>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 leading-relaxed">
              {text[currentLanguage].simple.description}
            </p>
            
            <div className="space-y-2 mb-6">
              {text[currentLanguage].simple.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => onModeSelect('simple')}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {text[currentLanguage].simple.button}
            </Button>
          </CardContent>
        </Card>

        {/* Builder Mode */}
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-purple-200 relative">
          <Badge className="absolute -top-2 right-4 bg-purple-500">
            {text[currentLanguage].recommended}
          </Badge>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">{text[currentLanguage].builder.title}</h3>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 leading-relaxed">
              {text[currentLanguage].builder.description}
            </p>
            
            <div className="space-y-2 mb-6">
              {text[currentLanguage].builder.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleBuilderMode}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              <Target className="w-4 h-4 mr-2" />
              {text[currentLanguage].builder.button}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InputModeSelector;
