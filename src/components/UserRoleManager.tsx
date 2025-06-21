
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, User, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  role?: 'admin' | 'moderator' | 'user';
}

interface UserRoleManagerProps {
  users: User[];
  currentLanguage: 'ko' | 'en';
  onUsersUpdate: () => void;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ 
  users, 
  currentLanguage, 
  onUsersUpdate 
}) => {
  const text = {
    ko: {
      email: '이메일',
      role: '역할',
      admin: '관리자',
      moderator: '모더레이터',
      user: '사용자',
      updated: '역할이 업데이트되었습니다',
      error: '역할 업데이트 중 오류가 발생했습니다'
    },
    en: {
      email: 'Email',
      role: 'Role',
      admin: 'Admin',
      moderator: 'Moderator',
      user: 'User',
      updated: 'Role updated successfully',
      error: 'Error updating user role'
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'moderator' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: newRole 
        }, { 
          onConflict: 'user_id,role'
        });

      if (error) throw error;

      toast({
        title: text[currentLanguage].updated,
        duration: 3000,
      });

      onUsersUpdate();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: text[currentLanguage].error,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          사용자를 찾을 수 없습니다
        </p>
      ) : (
        users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              {getRoleIcon(user.role)}
              <div>
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-sm text-gray-500">
                  {text[currentLanguage][user.role || 'user']}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={user.role}
                onValueChange={(value: 'admin' | 'moderator' | 'user') => 
                  updateUserRole(user.id, value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{text[currentLanguage].user}</SelectItem>
                  <SelectItem value="moderator">{text[currentLanguage].moderator}</SelectItem>
                  <SelectItem value="admin">{text[currentLanguage].admin}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserRoleManager;
