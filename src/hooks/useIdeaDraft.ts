
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface IdeaDraft {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  type: 'quick' | 'detailed';
}

interface UseIdeaDraftProps {
  currentLanguage: 'ko' | 'en';
}

export const useIdeaDraft = ({ currentLanguage }: UseIdeaDraftProps) => {
  const [drafts, setDrafts] = useState<IdeaDraft[]>([]);
  const [currentDraft, setCurrentDraft] = useState<IdeaDraft | null>(null);
  const { user } = useAuth();

  const text = {
    ko: {
      draftSaved: '임시저장 완료',
      draftLoaded: '초안을 불러왔습니다',
      draftDeleted: '초안이 삭제되었습니다'
    },
    en: {
      draftSaved: 'Draft saved',
      draftLoaded: 'Draft loaded',
      draftDeleted: 'Draft deleted'
    }
  };

  // Load drafts from localStorage
  useEffect(() => {
    if (!user) return;

    const savedDrafts = localStorage.getItem(`ideaDrafts_${user.id}`);
    if (savedDrafts) {
      try {
        const parsed = JSON.parse(savedDrafts);
        setDrafts(parsed.map((draft: any) => ({
          ...draft,
          timestamp: new Date(draft.timestamp)
        })));
      } catch (error) {
        console.error('Error loading drafts:', error);
      }
    }
  }, [user]);

  const saveDraft = (title: string, content: string, type: 'quick' | 'detailed' = 'quick') => {
    if (!user || (!title.trim() && !content.trim())) return;

    const draft: IdeaDraft = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      timestamp: new Date(),
      type
    };

    const updatedDrafts = [draft, ...drafts.slice(0, 4)]; // Keep only 5 drafts
    setDrafts(updatedDrafts);
    setCurrentDraft(draft);

    // Save to localStorage
    localStorage.setItem(`ideaDrafts_${user.id}`, JSON.stringify(updatedDrafts));

    return draft;
  };

  const loadDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      setCurrentDraft(draft);
      return draft;
    }
    return null;
  };

  const deleteDraft = (draftId: string) => {
    const updatedDrafts = drafts.filter(d => d.id !== draftId);
    setDrafts(updatedDrafts);
    
    if (currentDraft?.id === draftId) {
      setCurrentDraft(null);
    }

    // Update localStorage
    if (user) {
      localStorage.setItem(`ideaDrafts_${user.id}`, JSON.stringify(updatedDrafts));
    }
  };

  const autoSave = (title: string, content: string, type: 'quick' | 'detailed' = 'quick') => {
    if (!user || (!title.trim() && !content.trim())) return;

    // Only auto-save if there's substantial content
    if (title.length < 5 && content.length < 10) return;

    const draftId = `autosave_${type}`;
    const existing = drafts.find(d => d.id === draftId);

    const draft: IdeaDraft = {
      id: draftId,
      title: title.trim(),
      content: content.trim(),
      timestamp: new Date(),
      type
    };

    let updatedDrafts;
    if (existing) {
      updatedDrafts = drafts.map(d => d.id === draftId ? draft : d);
    } else {
      updatedDrafts = [draft, ...drafts.slice(0, 3)];
    }

    setDrafts(updatedDrafts);
    localStorage.setItem(`ideaDrafts_${user.id}`, JSON.stringify(updatedDrafts));
  };

  return {
    drafts,
    currentDraft,
    saveDraft,
    loadDraft,
    deleteDraft,
    autoSave
  };
};
