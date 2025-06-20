
import { useInfluenceScore } from '@/hooks/useInfluenceScore';

interface UseInfluenceIntegrationProps {
  currentLanguage: 'ko' | 'en';
  user: any;
}

export const useInfluenceIntegration = ({ currentLanguage, user }: UseInfluenceIntegrationProps) => {
  const { scoreActions } = useInfluenceScore();

  const handleIdeaSubmitted = async () => {
    if (!user) return;
    
    // Award points for keyword participation
    await scoreActions.keywordParticipation();
  };

  const handleIdeaLiked = async (ideaUserId: string) => {
    if (!user || user.id === ideaUserId) return;
    
    // No direct points for liking, but could be used for engagement tracking
  };

  const handleIdeaRemixed = async (originalIdeaUserId: string) => {
    if (!user || user.id === originalIdeaUserId) return;
    
    // Award points to the original idea creator
    if (originalIdeaUserId) {
      // This would be called from a server function or trigger
      // For now, we'll handle it in the remix creation process
    }
  };

  const handleVCInterest = async (ideaId: string) => {
    if (!user) return;
    
    // Award VC interest points
    await scoreActions.vcInterest();
  };

  const calculateInfluenceBoost = (influenceScore: number): number => {
    if (influenceScore >= 1000) return 0.5;
    if (influenceScore >= 500) return 0.3;
    if (influenceScore >= 200) return 0.2;
    if (influenceScore >= 50) return 0.1;
    return 0.0;
  };

  return {
    handleIdeaSubmitted,
    handleIdeaLiked,
    handleIdeaRemixed,
    handleVCInterest,
    calculateInfluenceBoost
  };
};
