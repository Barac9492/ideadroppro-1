
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UserModule {
  id: string;
  module_data: any;
  module_type: string;
  original_idea_text?: string;
  created_at: string;
  updated_at: string;
}

interface UseModuleLibraryProps {
  currentLanguage: 'ko' | 'en';
}

export const useModuleLibrary = ({ currentLanguage }: UseModuleLibraryProps) => {
  const [modules, setModules] = useState<UserModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const text = {
    ko: {
      saved: '모듈이 라이브러리에 저장되었습니다!',
      saveError: '저장 중 오류가 발생했습니다',
      loadError: '모듈을 불러오는 중 오류가 발생했습니다',
      deleteSuccess: '모듈이 삭제되었습니다',
      deleteError: '삭제 중 오류가 발생했습니다'
    },
    en: {
      saved: 'Module saved to your library!',
      saveError: 'Error occurred while saving',
      loadError: 'Error occurred while loading modules',
      deleteSuccess: 'Module deleted',
      deleteError: 'Error occurred while deleting'
    }
  };

  // 사용자 모듈 라이브러리 로드
  const loadModules = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_module_library')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModules(data || []);
    } catch (error: any) {
      console.error('Error loading modules:', error);
      toast({
        title: text[currentLanguage].loadError,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 모듈을 라이브러리에 저장
  const saveModulesToLibrary = async (moduleCards: any[], originalIdea: string) => {
    if (!user) return false;
    
    setSaving(true);
    try {
      const modulesToSave = moduleCards.map(module => ({
        user_id: user.id,
        module_data: {
          type: module.type,
          title: module.title,
          content: module.content,
          score: module.score,
          icon: module.icon?.toString(),
          color: module.color
        },
        module_type: module.type,
        original_idea_text: originalIdea
      }));

      const { error } = await supabase
        .from('user_module_library')
        .insert(modulesToSave);

      if (error) throw error;

      toast({
        title: text[currentLanguage].saved,
        description: `${moduleCards.length}개의 모듈이 저장되었습니다`,
        duration: 3000,
      });

      await loadModules(); // 새로 저장된 모듈들 로드
      return true;
    } catch (error: any) {
      console.error('Error saving modules:', error);
      toast({
        title: text[currentLanguage].saveError,
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // 모듈 삭제
  const deleteModule = async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from('user_module_library')
        .delete()
        .eq('id', moduleId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: text[currentLanguage].deleteSuccess,
        duration: 2000,
      });

      await loadModules();
    } catch (error: any) {
      console.error('Error deleting module:', error);
      toast({
        title: text[currentLanguage].deleteError,
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // 모듈 타입별 필터링
  const getModulesByType = (moduleType: string) => {
    return modules.filter(module => module.module_type === moduleType);
  };

  useEffect(() => {
    if (user) {
      loadModules();
    }
  }, [user]);

  return {
    modules,
    loading,
    saving,
    loadModules,
    saveModulesToLibrary,
    deleteModule,
    getModulesByType
  };
};
