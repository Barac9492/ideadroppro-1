import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { subscriptionManager } from '@/utils/subscriptionManager';

interface Invitation {
  id: string;
  invitation_code: string;
  email: string | null;
  status: 'pending' | 'accepted' | 'expired';
  accepted_at: string | null;
  created_at: string;
  expires_at: string;
  invitee_id: string | null;
  profiles?: {
    username: string | null;
  } | null;
}

export const useInvitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const componentId = useRef(`invitations-${Math.random().toString(36).substring(7)}`);
  const subscriptionKey = useRef<string | null>(null);

  const generateInvitationCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const createInvitation = async (email?: string) => {
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
        variant: 'destructive',
        duration: 3000,
      });
      return null;
    }

    try {
      const invitationCode = generateInvitationCode();
      
      const { data, error } = await supabase
        .from('user_invitations')
        .insert({
          inviter_id: user.id,
          invitation_code: invitationCode,
          email: email || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating invitation:', error);
        toast({
          title: '초대 링크 생성 실패',
          description: '다시 시도해주세요.',
          variant: 'destructive',
          duration: 3000,
        });
        return null;
      }

      toast({
        title: '🎉 초대 링크 생성 완료!',
        description: '링크를 복사해서 친구에게 공유하세요.',
        duration: 3000,
      });

      // Refresh the invitations list after creating a new one
      fetchInvitations();
      return data;
    } catch (error) {
      console.error('Error creating invitation:', error);
      return null;
    }
  };

  const getInvitationUrl = (code: string) => {
    return `${window.location.origin}/auth?invite=${code}`;
  };

  const copyInvitationLink = async (code: string) => {
    const url = getInvitationUrl(code);
    
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: '🔗 링크 복사 완료!',
        description: '친구에게 공유해보세요.',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: '복사 실패',
        description: '수동으로 링크를 복사해주세요.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const fetchInvitations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select(`
          *,
          profiles!user_invitations_invitee_id_fkey(username)
        `)
        .eq('inviter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invitations:', error);
        return;
      }

      const typedInvitations = (data || []).map(invitation => ({
        ...invitation,
        status: invitation.status as 'pending' | 'accepted' | 'expired'
      })) as Invitation[];

      setInvitations(typedInvitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const processInvitationAcceptance = async (invitationCode: string, newUserId: string) => {
    try {
      const { error } = await supabase
        .from('user_invitations')
        .update({
          status: 'accepted',
          invitee_id: newUserId,
          accepted_at: new Date().toISOString()
        })
        .eq('invitation_code', invitationCode)
        .eq('status', 'pending');

      if (error) {
        console.error('Error processing invitation acceptance:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error processing invitation acceptance:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchInvitations();

      // Clean up existing subscription
      if (subscriptionKey.current) {
        subscriptionManager.unsubscribe(subscriptionKey.current);
        subscriptionKey.current = null;
      }

      // Set up new subscription
      const newSubscriptionKey = subscriptionManager.subscribe(
        'invitation-changes',
        componentId.current,
        {
          event: '*',
          schema: 'public',
          table: 'user_invitations',
          filter: `inviter_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Invitation change detected:', payload);
          fetchInvitations();
        }
      );

      subscriptionKey.current = newSubscriptionKey;
    } else {
      setLoading(false);
    }

    return () => {
      if (subscriptionKey.current) {
        subscriptionManager.unsubscribe(subscriptionKey.current);
        subscriptionKey.current = null;
      }
    };
  }, [user]);

  return {
    invitations,
    loading,
    createInvitation,
    copyInvitationLink,
    getInvitationUrl,
    fetchInvitations,
    processInvitationAcceptance
  };
};
