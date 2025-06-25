
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AutomationStatus {
  auto_embedding_enabled: boolean;
  auto_clustering_enabled: boolean;
  clustering_schedule: string;
  min_modules_for_clustering: number;
  last_clustering_date: string | null;
  modules_with_embeddings: number;
  modules_without_embeddings: number;
  total_modules: number;
  total_clusters: number;
  clustered_modules: number;
  embeddings_last_24h: number;
  clusterings_last_week: number;
}

interface AutomationLog {
  id: string;
  operation_type: 'embedding' | 'clustering';
  status: 'pending' | 'running' | 'completed' | 'failed';
  trigger_type: 'auto' | 'manual' | 'scheduled';
  modules_processed: number;
  clusters_created: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export const useSemanticAutomation = () => {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('semantic_automation_status')
        .select('*')
        .single();

      if (error) throw error;
      setStatus(data);
    } catch (error) {
      console.error('Error fetching automation status:', error);
      toast({
        title: "상태 조회 실패",
        description: "자동화 상태를 가져오는데 실패했습니다",
        variant: "destructive",
      });
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('semantic_automation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching automation logs:', error);
    }
  };

  const updateConfig = async (config: Partial<{
    auto_embedding_enabled: boolean;
    auto_clustering_enabled: boolean;
    min_modules_for_clustering: number;
  }>) => {
    try {
      const { error } = await supabase
        .from('semantic_automation_config')
        .update({ ...config, updated_at: new Date().toISOString() })
        .eq('id', (await supabase.from('semantic_automation_config').select('id').single()).data?.id);

      if (error) throw error;

      toast({
        title: "설정 업데이트 완료",
        description: "자동화 설정이 업데이트되었습니다",
      });

      await fetchStatus();
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: "설정 업데이트 실패",
        description: "설정을 업데이트하는데 실패했습니다",
        variant: "destructive",
      });
    }
  };

  const triggerManualClustering = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('cluster-modules');
      
      if (error) throw error;

      toast({
        title: "수동 클러스터링 시작",
        description: "클러스터링이 수동으로 실행되었습니다",
      });

      await fetchLogs();
      await fetchStatus();
    } catch (error) {
      console.error('Error triggering manual clustering:', error);
      toast({
        title: "수동 클러스터링 실패",
        description: "클러스터링을 실행하는데 실패했습니다",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStatus(), fetchLogs()]);
      setLoading(false);
    };

    loadData();

    // 30초마다 상태 업데이트
    const interval = setInterval(() => {
      fetchStatus();
      fetchLogs();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    status,
    logs,
    loading,
    updateConfig,
    triggerManualClustering,
    refresh: () => {
      fetchStatus();
      fetchLogs();
    }
  };
};
