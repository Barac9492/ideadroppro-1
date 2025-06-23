
import React, { useState } from 'react';
import Header from '@/components/Header';
import IdeaBuilder from '@/components/IdeaBuilder';
import ModuleMixMatch from '@/components/ModuleMixMatch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Builder = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en'>('ko');

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const text = {
    ko: {
      title: '🧬 아이디어 빌더',
      subtitle: 'AI와 함께 아이디어를 만들고 발전시켜보세요',
      tabs: {
        builder: '아이디어 빌더',
        mixmatch: '모듈 믹스앤매치'
      }
    },
    en: {
      title: '🧬 Idea Builder',
      subtitle: 'Create and evolve ideas with AI',
      tabs: {
        builder: 'Idea Builder',
        mixmatch: 'Module Mix & Match'
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

        <Tabs defaultValue="builder" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">{text[currentLanguage].tabs.builder}</TabsTrigger>
            <TabsTrigger value="mixmatch">{text[currentLanguage].tabs.mixmatch}</TabsTrigger>
          </TabsList>

          <TabsContent value="builder">
            <IdeaBuilder currentLanguage={currentLanguage} />
          </TabsContent>

          <TabsContent value="mixmatch">
            <ModuleMixMatch currentLanguage={currentLanguage} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Builder;
