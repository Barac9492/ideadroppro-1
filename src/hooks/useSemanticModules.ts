
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSemanticModules = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const generateEmbeddings = async (moduleId?: string, content?: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-module-embeddings', {
        body: { 
          moduleId, 
          content,
          batchProcess: !moduleId 
        }
      });

      if (error) throw error;

      toast({
        title: "임베딩 생성 완료",
        description: moduleId 
          ? "모듈 벡터화가 완료되었습니다"
          : `${data.processed}개 모듈을 처리했습니다`,
      });

      return data;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      toast({
        title: "임베딩 생성 실패",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const clusterModules = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('cluster-modules');

      if (error) throw error;

      toast({
        title: "클러스터링 완료",
        description: `${data.clustersCreated}개 클러스터가 생성되었습니다`,
      });

      return data;
    } catch (error) {
      console.error('Error clustering modules:', error);
      toast({
        title: "클러스터링 실패",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const findSimilarModules = async (moduleId: string, threshold = 0.8) => {
    try {
      const { data, error } = await supabase.rpc('find_similar_modules', {
        target_module_id: moduleId,
        similarity_threshold: threshold,
        limit_count: 10
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding similar modules:', error);
      toast({
        title: "유사 모듈 검색 실패",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  const getModuleClusters = async () => {
    try {
      const { data, error } = await supabase
        .from('module_clusters')
        .select('*')
        .order('member_count', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching clusters:', error);
      return [];
    }
  };

  return {
    generateEmbeddings,
    clusterModules,
    findSimilarModules,
    getModuleClusters,
    isProcessing
  };
};
