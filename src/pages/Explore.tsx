
import React, { useState } from 'react';
import Header from '@/components/Header';
import IdeaCard from '@/components/IdeaCard';
import RemixableIdeasSection from '@/components/RemixableIdeasSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIdeas } from '@/hooks/useIdeas';

const Explore = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');
  const { ideas, loading } = useIdeas(currentLanguage);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const text = {
    ko: {
      title: '💡 아이디어 탐색',
      subtitle: '다른 사람들의 창의적인 아이디어를 둘러보세요',
      tabs: {
        all: '모든 아이디어',
        remixable: '리믹스 가능'
      }
    },
    en: {
      title: '💡 Explore Ideas',
      subtitle: 'Discover creative ideas from the community',
      tabs: {
        all: 'All Ideas',
        remixable: 'Remixable'
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {text[currentLanguage].title}
          </h1>
          <p className="text-xl text-gray-600">
            {text[currentLanguage].subtitle}
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">{text[currentLanguage].tabs.all}</TabsTrigger>
            <TabsTrigger value="remixable">{text[currentLanguage].tabs.remixable}</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">아이디어를 불러오는 중...</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {ideas.map((idea) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      currentLanguage={currentLanguage}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="remixable">
            <RemixableIdeasSection currentLanguage={currentLanguage} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Explore;
