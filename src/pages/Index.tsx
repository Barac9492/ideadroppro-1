
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import IdeaSubmissionForm from '@/components/IdeaSubmissionForm';
import IdeaCard from '@/components/IdeaCard';
import { toast } from '@/hooks/use-toast';

// Mock data for demonstration (will be replaced with real backend)
interface Idea {
  id: string;
  text: string;
  score: number;
  tags: string[];
  likes: number;
  hasLiked: boolean;
  timestamp: Date;
  aiAnalysis?: string;
  improvements?: string[];
  marketPotential?: string[];
  similarIdeas?: string[];
  pitchPoints?: string[];
}

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: '1',
      text: '스마트폰 카메라로 음식을 촬영하면 자동으로 칼로리와 영양소를 분석해주는 AI 앱. 개인의 건강 목표에 맞춰 맞춤형 식단을 추천하고, 부족한 영양소를 보충할 수 있는 레시피를 제안합니다.',
      score: 8.5,
      tags: ['AI', '헬스케어', '모바일앱', '영양분석'],
      likes: 24,
      hasLiked: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      aiAnalysis: '혁신적인 헬스케어 솔루션으로 개인화된 영양 관리의 새로운 패러다임을 제시합니다. 컴퓨터 비전과 영양학 데이터베이스의 결합으로 실용적인 가치를 창출할 수 있습니다.'
    },
    {
      id: '2',
      text: 'VR 기술을 활용한 원격 회의 플랫폼. 참석자들이 가상 공간에서 만나 실제처럼 상호작용하며, 3D 객체를 조작하고 협업할 수 있는 환경을 제공합니다.',
      score: 7.2,
      tags: ['VR', '원격근무', '협업툴', '메타버스'],
      likes: 18,
      hasLiked: true,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: '3',
      text: '버려지는 플라스틱을 3D 프린터 필라멘트로 재활용하는 소형 장비. 가정이나 소규모 사업장에서 직접 플라스틱 폐기물을 유용한 3D 프린팅 재료로 변환할 수 있습니다.',
      score: 9.1,
      tags: ['환경', '3D프린팅', '재활용', '지속가능성'],
      likes: 31,
      hasLiked: false,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    }
  ]);

  const text = {
    ko: {
      submitSuccess: '아이디어가 성공적으로 제출되었습니다!',
      submitError: '아이디어 제출 중 오류가 발생했습니다.',
      noIdeas: '아직 제출된 아이디어가 없습니다. 첫 번째 아이디어를 공유해보세요!',
      loadingIdeas: '아이디어를 불러오는 중...'
    },
    en: {
      submitSuccess: 'Idea submitted successfully!',
      submitError: 'Error occurred while submitting idea.',
      noIdeas: 'No ideas submitted yet. Be the first to share your innovative idea!',
      loadingIdeas: 'Loading ideas...'
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleIdeaSubmit = async (ideaText: string) => {
    try {
      // Simulate AI analysis (will be replaced with real API calls)
      const newIdea: Idea = {
        id: Date.now().toString(),
        text: ideaText,
        score: Math.round((Math.random() * 3 + 7) * 10) / 10, // Random score between 7-10
        tags: generateMockTags(ideaText),
        likes: 0,
        hasLiked: false,
        timestamp: new Date(),
        aiAnalysis: '이 아이디어는 시장에서 높은 관심을 받을 가능성이 있습니다. 실행 가능성과 혁신성을 모두 갖춘 흥미로운 컨셉입니다.'
      };

      setIdeas(prev => [newIdea, ...prev]);
      toast({
        title: text[currentLanguage].submitSuccess,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast({
        title: text[currentLanguage].submitError,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const generateMockTags = (text: string): string[] => {
    // Simple mock tag generation (will be replaced with AI)
    const possibleTags = ['AI', '기술', '모바일', '웹', '스타트업', '혁신', '비즈니스', '헬스케어', '교육', '환경'];
    return possibleTags.slice(0, Math.floor(Math.random() * 4) + 2);
  };

  const handleLike = (ideaId: string) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId 
        ? { 
            ...idea, 
            likes: idea.hasLiked ? idea.likes - 1 : idea.likes + 1,
            hasLiked: !idea.hasLiked 
          }
        : idea
    ));
  };

  const handleGenerateAnalysis = async (ideaId: string) => {
    // Mock AI analysis generation (will be replaced with real API)
    const mockAnalysis = {
      improvements: [
        '타겟 사용자층을 더 구체적으로 정의해보세요',
        '기술적 구현의 난이도와 비용을 고려해보세요',
        '경쟁 제품 대비 차별화 포인트를 명확히 하세요'
      ],
      marketPotential: [
        '글로벌 시장 규모가 지속적으로 성장하고 있습니다',
        '모바일 우선 접근법이 유리할 것으로 보입니다',
        'B2B와 B2C 모두에서 수요가 예상됩니다'
      ]
    };

    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId 
        ? { ...idea, ...mockAnalysis }
        : idea
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <main className="container mx-auto px-4 py-8">
        <IdeaSubmissionForm
          currentLanguage={currentLanguage}
          onSubmit={handleIdeaSubmit}
        />
        
        <div className="space-y-6">
          {ideas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{text[currentLanguage].noIdeas}</p>
            </div>
          ) : (
            ideas.map(idea => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                currentLanguage={currentLanguage}
                onLike={handleLike}
                onGenerateAnalysis={handleGenerateAnalysis}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
