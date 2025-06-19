
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, User, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  role?: 'admin' | 'moderator' | 'user';
}

interface AdminPanelProps {
  currentLanguage: 'ko' | 'en';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentLanguage }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const text = {
    ko: {
      title: '사용자 관리',
      email: '이메일',
      role: '역할',
      admin: '관리자',
      moderator: '모더레이터',
      user: '사용자',
      updateRole: '역할 업데이트',
      updated: '역할이 업데이트되었습니다',
      error: '역할 업데이트 중 오류가 발생했습니다'
    },
    en: {
      title: 'User Management',
      email: 'Email',
      role: 'Role',
      admin: 'Admin',
      moderator: 'Moderator',
      user: 'User',
      updateRole: 'Update Role',
      updated: 'Role updated successfully',
      error: 'Error updating user role'
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Get all users with their roles
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        return;
      }

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return;
      }

      const usersWithRoles = authUsers.users.map(user => {
        const userRole = userRoles?.find(role => role.user_id === user.id);
        return {
          id: user.id,
          email: user.email || '',
          role: userRole?.role || 'user'
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
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

      fetchUsers();
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getRoleIcon(user.role)}
                <div>
                  <p className="font-medium">{user.email}</p>
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
