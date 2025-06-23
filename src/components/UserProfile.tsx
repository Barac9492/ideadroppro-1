
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserProfileProps {
  currentLanguage: 'ko' | 'en';
}

interface Profile {
  username: string | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ currentLanguage }) => {
  const [profile, setProfile] = useState<Profile>({
    username: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const text = {
    ko: {
      title: '내 프로필',
      username: '사용자명',
      email: '이메일',
      joinDate: '가입일',
      save: '저장',
      saving: '저장 중...',
      profileUpdated: '프로필이 업데이트되었습니다',
      loadError: '프로필을 불러올 수 없습니다',
      saveError: '프로필 저장에 실패했습니다'
    },
    en: {
      title: 'My Profile',
      username: 'Username',
      email: 'Email',
      joinDate: 'Join Date',
      save: 'Save',
      saving: 'Saving...',
      profileUpdated: 'Profile updated successfully',
      loadError: 'Failed to load profile',
      saveError: 'Failed to save profile'
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({ username: data.username });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: text[currentLanguage].loadError,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: profile.username,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: text[currentLanguage].profileUpdated
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: text[currentLanguage].saveError,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl">
              {profile.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span className="text-sm">{user?.email}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span className="text-sm">
                {text[currentLanguage].joinDate}: {new Date(user?.created_at || '').toLocaleDateString()}
              </span>
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">{text[currentLanguage].username}</Label>
          <Input
            id="username"
            value={profile.username || ''}
            onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Enter username"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? text[currentLanguage].saving : text[currentLanguage].save}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
