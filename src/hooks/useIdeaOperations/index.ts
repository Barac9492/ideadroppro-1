
import { useIdeaSubmission } from './useIdeaSubmission';
import { useAnalysisGeneration } from './useAnalysisGeneration';
import { useVerdictManagement } from './useVerdictManagement';
import { useGlobalAnalysis } from './useGlobalAnalysis';
import { useRemixLeverage } from '../useRemixLeverage';
import { useInfluenceIntegration } from './useInfluenceIntegration';

interface IdeaOperationsProps {
  currentLanguage: 'ko' | 'en';
  user: any;
  fetchIdeas: () => Promise<void>;
}

export const useIdeaOperations = ({ currentLanguage, user, fetchIdeas }: IdeaOperationsProps) => {
  const { submitIdea } = useIdeaSubmission({ currentLanguage, user, fetchIdeas });
  const { generateAnalysis } = useAnalysisGeneration({ currentLanguage, user, fetchIdeas });
  const { saveFinalVerdict } = useVerdictManagement({ currentLanguage, user, fetchIdeas });
  const { generateGlobalAnalysis } = useGlobalAnalysis({ currentLanguage, user, fetchIdeas });
  const { processRemixLeverage } = useRemixLeverage({ currentLanguage });
  const influenceIntegration = useInfluenceIntegration({ currentLanguage, user });

  const submitIdeaWithNetworkEffects = async (ideaText: string) => {
    // Submit the idea
    await submitIdea(ideaText);
    
    // Trigger network effects
    await influenceIntegration.handleIdeaSubmitted();
  };

  const createRemix = async (originalIdeaId: string, remixText: string, originalScore: number) => {
    try {
      // Submit remix as new idea
      await submitIdea(remixText);
      
      // Calculate score improvement (mock for now)
      const scoreImprovement = Math.random() * 4; // 0-4 points
      
      // Process remix leverage
      await processRemixLeverage(originalIdeaId, remixText, scoreImprovement);
      
      console.log('✅ Remix created with leverage system');
    } catch (error) {
      console.error('❌ Error creating remix:', error);
      throw error;
    }
  };

  return {
    submitIdea: submitIdeaWithNetworkEffects,
    generateAnalysis,
    saveFinalVerdict,
    generateGlobalAnalysis,
    createRemix,
    processRemixLeverage
  };
};
