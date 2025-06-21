
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthRedirectOptions {
  onIdeaDrop?: (ideaText: string) => void;
}

export const useAuthRedirect = ({ onIdeaDrop }: UseAuthRedirectOptions = {}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { ideaText?: string } | null;
    if (state?.ideaText && user && onIdeaDrop) {
      onIdeaDrop(state.ideaText);
      navigate('/', { replace: true, state: null });
    }
  }, [user, location.state, navigate, onIdeaDrop]);
};
