
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type ModuleType = Database['public']['Enums']['module_type'];

export interface IdeaModule {
  id: string;
  module_type: ModuleType;
  content: string;
  tags: string[];
  original_idea_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  version: number;
  quality_score: number;
  usage_count: number;
}

export interface ModuleTemplate {
  id: string;
  module_type: ModuleType;
  template_name: string;
  description: string;
  example_content: string;
}

interface UseModularIdeasProps {
  currentLanguage: 'ko' | 'en';
}

export const useModularIdeas = ({ currentLanguage }: UseModularIdeasProps) => {
  const [modules, setModules] = useState<IdeaModule[]>([]);
  const [templates, setTemplates] = useState<ModuleTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [decomposing, setDecomposing] = useState(false);

  const text = {
    ko: {
      decomposing: 'AI가 아이디어를 분해하는 중...',
      decomposed: '아이디어가 성공적으로 모듈로 분해되었습니다!',
      error: '오류가 발생했습니다',
      modulesLoaded: '모듈을 불러왔습니다',
      moduleCreated: '모듈이 생성되었습니다',
      moduleUpdated: '모듈이 업데이트되었습니다',
      moduleDeleted: '모듈이 삭제되었습니다'
    },
    en: {
      decomposing: 'AI is decomposing the idea...',
      decomposed: 'Idea successfully decomposed into modules!',
      error: 'An error occurred',
      modulesLoaded: 'Modules loaded',
      moduleCreated: 'Module created',
      moduleUpdated: 'Module updated',
      moduleDeleted: 'Module deleted'
    }
  };

  // Fetch all modules
  const fetchModules = async (moduleType?: ModuleType) => {
    setLoading(true);
    try {
      let query = supabase
        .from('idea_modules')
        .select(`
          *,
          profiles!idea_modules_created_by_fkey(username)
        `)
        .order('quality_score', { ascending: false });

      if (moduleType) {
        query = query.eq('module_type', moduleType);
      }

      const { data, error } = await query;

      if (error) throw error;

      setModules(data || []);
    } catch (error: any) {
      console.error('Error fetching modules:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch module templates
  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('module_templates')
        .select('*')
        .order('module_type');

      if (error) throw error;

      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
    }
  };

  // Decompose idea into modules using AI
  const decomposeIdea = async (ideaText: string) => {
    setDecomposing(true);
    try {
      toast({
        title: text[currentLanguage].decomposing,
        duration: 3000,
      });

      const { data, error } = await supabase.functions.invoke('decompose-idea', {
        body: { ideaText, language: currentLanguage }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Decomposition failed');
      }

      toast({
        title: text[currentLanguage].decomposed,
        duration: 3000,
      });

      return data.decomposition;
    } catch (error: any) {
      console.error('Error decomposing idea:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setDecomposing(false);
    }
  };

  // Create a new module
  const createModule = async (moduleData: {
    module_type: ModuleType;
    content: string;
    tags?: string[];
    original_idea_id?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('idea_modules')
        .insert({
          module_type: moduleData.module_type,
          content: moduleData.content,
          tags: moduleData.tags || [],
          original_idea_id: moduleData.original_idea_id,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: text[currentLanguage].moduleCreated,
        duration: 2000,
      });

      await fetchModules();
      return data;
    } catch (error: any) {
      console.error('Error creating module:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update a module
  const updateModule = async (moduleId: string, updates: {
    content?: string;
    tags?: string[];
  }) => {
    try {
      const { data, error } = await supabase
        .from('idea_modules')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          version: supabase.rpc('increment_version', { module_id: moduleId })
        })
        .eq('id', moduleId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: text[currentLanguage].moduleUpdated,
        duration: 2000,
      });

      await fetchModules();
      return data;
    } catch (error: any) {
      console.error('Error updating module:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Delete a module
  const deleteModule = async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from('idea_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      toast({
        title: text[currentLanguage].moduleDeleted,
        duration: 2000,
      });

      await fetchModules();
    } catch (error: any) {
      console.error('Error deleting module:', error);
      toast({
        title: text[currentLanguage].error,
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Get module recommendations
  const getModuleRecommendations = async (
    selectedModules: IdeaModule[],
    targetModuleType: ModuleType
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('recommend-modules', {
        body: {
          selectedModules,
          targetModuleType,
          language: currentLanguage
        }
      });

      if (error) throw error;

      return data.recommendations || [];
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchModules();
    fetchTemplates();
  }, []);

  return {
    modules,
    templates,
    loading,
    decomposing,
    fetchModules,
    fetchTemplates,
    decomposeIdea,
    createModule,
    updateModule,
    deleteModule,
    getModuleRecommendations
  };
};
