
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // For now, make admin check simple - you can enhance this later
    // Check if email contains 'admin' or is a specific admin email
    const adminEmails = ['admin@ideadrop.com', 'test@admin.com'];
    const isUserAdmin = adminEmails.includes(user.email || '') || 
                      (user.email || '').includes('admin');
    
    setIsAdmin(isUserAdmin);
    setLoading(false);
  }, [user]);

  return { isAdmin, loading };
};
