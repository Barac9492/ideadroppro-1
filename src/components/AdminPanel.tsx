
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import IdeaManagement from './IdeaManagement';
import SeedDataManagement from './SeedDataManagement';
import DailyPromptManagement from './DailyPromptManagement';
import UserRoleManager from './UserRoleManager';
import SystemManagement from './SystemManagement';

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
      userManagement: '사용자 관리',
      ideaManagement: '아이디어 관리',
      seedDataManagement: '시드 데이터 관리',
      dailyPromptManagement: '오늘의 주제 관리',
      systemManagement: '시스템 관리',
      loadingUsers: '사용자 정보를 불러오는 중...',
      fetchError: '사용자 정보를 가져오는데 실패했습니다'
    },
    en: {
      userManagement: 'User Management',
      ideaManagement: 'Idea Management',
      seedDataManagement: 'Seed Data Management',
      dailyPromptManagement: 'Daily Prompt Management',
      systemManagement: 'System Management',
      loadingUsers: 'Loading users...',
      fetchError: 'Failed to fetch users'
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-get-users');
      
      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: text[currentLanguage].fetchError,
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: text[currentLanguage].fetchError,
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">{text[currentLanguage].loadingUsers}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="users">{text[currentLanguage].userManagement}</TabsTrigger>
        <TabsTrigger value="ideas">{text[currentLanguage].ideaManagement}</TabsTrigger>
        <TabsTrigger value="seeds">{text[currentLanguage].seedDataManagement}</TabsTrigger>
        <TabsTrigger value="prompts">{text[currentLanguage].dailyPromptManagement}</TabsTrigger>
        <TabsTrigger value="system">{text[currentLanguage].systemManagement}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5" />
              <span>{text[currentLanguage].userManagement}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserRoleManager 
              users={users}
              currentLanguage={currentLanguage}
              onUsersUpdate={fetchUsers}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ideas">
        <IdeaManagement currentLanguage={currentLanguage} />
      </TabsContent>

      <TabsContent value="seeds">
        <SeedDataManagement currentLanguage={currentLanguage} />
      </TabsContent>

      <TabsContent value="prompts">
        <DailyPromptManagement currentLanguage={currentLanguage} />
      </TabsContent>

      <TabsContent value="system">
        <SystemManagement currentLanguage={currentLanguage} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminPanel;
