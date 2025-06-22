
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Code, Flame, Rocket, Sparkles } from 'lucide-react';

interface ExampleIdeasProps {
  currentLanguage: 'ko' | 'en';
}

const ExampleIdeas: React.FC<ExampleIdeasProps> = ({ currentLanguage }) => {
  const text = {
    ko: {
      exampleIdeas: '예시 아이디어',
      example1: 'AI 농업 솔루션',
      example2: '블록체인 투표',
      example3: '친환경 앱',
      example4: '스마트 헬스케어',
      example5: 'AR 교육 플랫폼'
    },
    en: {
      exampleIdeas: 'Example Ideas',
      example1: 'AI Agriculture',
      example2: 'Blockchain Voting',
      example3: 'Green Tech App',
      example4: 'Smart Healthcare',
      example5: 'AR Education'
    }
  };

  return (
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
  );
};

export default ExampleIdeas;
