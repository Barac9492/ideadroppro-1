
import { useIdeaSubmission } from './useIdeaSubmission';
import { useAnalysisGeneration } from './useAnalysisGeneration';
import { useVerdictManagement } from './useVerdictManagement';
import { useGlobalAnalysis } from './useGlobalAnalysis';

interface IdeaOperationsProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => void;
}

export const useIdeaOperations = ({ currentLanguage, user, fetchIdeas }: IdeaOperationsProps) => {
  const { submitIdea } = useIdeaSubmission({ currentLanguage, user, fetchIdeas });
  const { generateAnalysis } = useAnalysisGeneration({ currentLanguage, user, fetchIdeas });
  const { saveFinalVerdict } = useVerdictManagement({ currentLanguage, user, fetchIdeas });
  const { generateGlobalAnalysis } = useGlobalAnalysis({ currentLanguage, user, fetchIdeas });

  return {
    submitIdea,
    generateAnalysis,
    saveFinalVerdict,
    generateGlobalAnalysis
  };
};
