
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Sparkles, Wand2, Save } from 'lucide-react';
import { IdeaModule } from '@/hooks/useModularIdeas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ModuleCombinatorProps {
  selectedModules: IdeaModule[];
  currentLanguage: 'ko' | 'en';
  onBack: () => void;
}

const ModuleCombinator: React.FC<ModuleCombinatorProps> = ({
  selectedModules,
  currentLanguage,
  onBack
}) => {
  const [combinedIdea, setCombinedIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const text = {
    ko: {
      title: '모듈 조합하기',
      subtitle: '선택한 모듈들을 조합해서 새로운 아이디어를 만들어보세요',
      selectedModules: '선택된 모듈들',
      generateIdea: 'AI로 아이디어 생성',
      editIdea: '아이디어 편집',
      saveIdea: '아이디어 저장',
      back: '뒤로가기',
      generatedIdea: '생성된 아이디어',
      generating: 'AI가 아이디어를 생성하는 중...',
      saving: '저장 중...',
      saved: '아이디어가 저장되었습니다!',
      loginRequired: '아이디어를 저장하려면 로그인이 필요합니다',
      moduleTypes: {
        problem: '문제점',
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
      title: 'Combine Modules',
      subtitle: 'Create new ideas by combining selected modules',
      selectedModules: 'Selected Modules',
      generateIdea: 'Generate Idea with AI',
      editIdea: 'Edit Idea',
      saveIdea: 'Save Idea',
      back: 'Back',
      generatedIdea: 'Generated Idea',
      generating: 'AI is generating idea...',
      saving: 'Saving...',
      saved: 'Idea saved successfully!',
      loginRequired: 'Login required to save ideas',
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

  const handleGenerateIdea = async () => {
    setIsGenerating(true);
    try {
      const modulesObj = selectedModules.reduce((acc, module) => {
        acc[module.module_type] = module.content;
        return acc;
      }, {} as Record<string, string>);

      const { data, error } = await supabase.functions.invoke('generate-unified-idea', {
        body: {
          originalIdea: '선택된 모듈들을 조합한 아이디어',
          modules: modulesObj,
          language: currentLanguage
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate idea');
      }

      setCombinedIdea(data.unifiedIdea);
      
      toast({
        title: currentLanguage === 'ko' ? '아이디어 생성 완료!' : 'Idea generated successfully!',
        description: currentLanguage === 'ko' ? '생성된 아이디어를 확인하고 편집해보세요' : 'Review and edit the generated idea',
      });
    } catch (error: any) {
      console.error('Error generating idea:', error);
      toast({
        title: currentLanguage === 'ko' ? '오류 발생' : 'Error occurred',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveIdea = async () => {
    if (!user) {
      toast({
        title: text[currentLanguage].loginRequired,
        variant: 'destructive',
      });
      return;
    }

    if (!combinedIdea.trim()) {
      toast({
        title: currentLanguage === 'ko' ? '아이디어를 입력해주세요' : 'Please enter an idea',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert({
          text: combinedIdea.trim(),
          user_id: user.id,
          is_modular: true
        })
        .select()
        .single();

      if (error) throw error;

      // Create composition records for the modules used
      if (data) {
        const compositionPromises = selectedModules.map(module => 
          supabase
            .from('idea_compositions')
            .insert({
              idea_id: data.id,
              module_id: module.id
            })
        );
        
        await Promise.all(compositionPromises);
      }

      toast({
        title: text[currentLanguage].saved,
        description: currentLanguage === 'ko' ? '내 작업실에서 확인할 수 있습니다' : 'You can view it in your workspace',
      });

      navigate('/ideas');
    } catch (error: any) {
      console.error('Error saving idea:', error);
      toast({
        title: currentLanguage === 'ko' ? '저장 실패' : 'Save failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{text[currentLanguage].title}</h2>
          <p className="text-gray-600">{text[currentLanguage].subtitle}</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {text[currentLanguage].back}
        </Button>
      </div>

      {/* Selected modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {text[currentLanguage].selectedModules} ({selectedModules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {selectedModules.map((module) => (
              <div key={module.id} className="border rounded-lg p-4 space-y-2">
                <Badge variant="secondary">
                  {text[currentLanguage].moduleTypes[module.module_type as keyof typeof text[typeof currentLanguage]['moduleTypes']]}
                </Badge>
                <p className="text-sm text-gray-700">{module.content}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={handleGenerateIdea}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                text[currentLanguage].generating
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  {text[currentLanguage].generateIdea}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated idea section */}
      {combinedIdea && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                <span>{text[currentLanguage].generatedIdea}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={combinedIdea}
                onChange={(e) => setCombinedIdea(e.target.value)}
                rows={6}
                className="resize-none"
                placeholder={text[currentLanguage].editIdea}
              />
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleSaveIdea}
                  disabled={isSaving || !user}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isSaving ? (
                    text[currentLanguage].saving
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {text[currentLanguage].saveIdea}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ModuleCombinator;
