
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Bell, Eye, Shield, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserSettingsProps {
  currentLanguage: 'ko' | 'en';
}

interface UserSettings {
  email_notifications: boolean;
  remix_notifications: boolean;
  public_profile: boolean;
  show_in_leaderboard: boolean;
}

const UserSettings: React.FC<UserSettingsProps> = ({ currentLanguage }) => {
  const [settings, setSettings] = useState<UserSettings>({
    email_notifications: true,
    remix_notifications: true,
    public_profile: true,
    show_in_leaderboard: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const text = {
    ko: {
      title: '설정',
      notifications: '알림 설정',
      emailNotifications: '이메일 알림',
      emailNotificationsDesc: '새로운 활동에 대한 이메일 알림을 받습니다',
      remixNotifications: '리믹스 알림',
      remixNotificationsDesc: '내 아이디어가 리믹스될 때 알림을 받습니다',
      privacy: '개인정보 설정',
      publicProfile: '공개 프로필',
      publicProfileDesc: '다른 사용자들이 내 프로필을 볼 수 있습니다',
      showInLeaderboard: '리더보드 표시',
      showInLeaderboardDesc: '리더보드에 내 이름이 표시됩니다',
      dangerZone: '위험 구역',
      deleteAccount: '계정 삭제',
      deleteAccountDesc: '계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.',
      save: '저장',
      saving: '저장 중...',
      settingsUpdated: '설정이 업데이트되었습니다',
      loadError: '설정을 불러올 수 없습니다',
      saveError: '설정 저장에 실패했습니다'
    },
    en: {
      title: 'Settings',
      notifications: 'Notification Settings',
      emailNotifications: 'Email Notifications',
      emailNotificationsDesc: 'Receive email notifications for new activities',
      remixNotifications: 'Remix Notifications',
      remixNotificationsDesc: 'Get notified when your ideas are remixed',
      privacy: 'Privacy Settings',
      publicProfile: 'Public Profile',
      publicProfileDesc: 'Allow other users to view your profile',
      showInLeaderboard: 'Show in Leaderboard',
      showInLeaderboardDesc: 'Display your name in the leaderboard',
      dangerZone: 'Danger Zone',
      deleteAccount: 'Delete Account',
      deleteAccountDesc: 'Permanently delete your account. This action cannot be undone.',
      save: 'Save',
      saving: 'Saving...',
      settingsUpdated: 'Settings updated successfully',
      loadError: 'Failed to load settings',
      saveError: 'Failed to save settings'
    }
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
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
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: text[currentLanguage].settingsUpdated
      });
    } catch (error) {
      console.error('Error saving settings:', error);
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
          <p className="text-gray-600">Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>{text[currentLanguage].title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notifications */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <h3 className="text-lg font-semibold">{text[currentLanguage].notifications}</h3>
          </div>
          
          <div className="space-y-4 ml-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-notifications">{text[currentLanguage].emailNotifications}</Label>
                <p className="text-sm text-gray-500">{text[currentLanguage].emailNotificationsDesc}</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.email_notifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="remix-notifications">{text[currentLanguage].remixNotifications}</Label>
                <p className="text-sm text-gray-500">{text[currentLanguage].remixNotificationsDesc}</p>
              </div>
              <Switch
                id="remix-notifications"
                checked={settings.remix_notifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, remix_notifications: checked }))}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Privacy */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <h3 className="text-lg font-semibold">{text[currentLanguage].privacy}</h3>
          </div>
          
          <div className="space-y-4 ml-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="public-profile">{text[currentLanguage].publicProfile}</Label>
                <p className="text-sm text-gray-500">{text[currentLanguage].publicProfileDesc}</p>
              </div>
              <Switch
                id="public-profile"
                checked={settings.public_profile}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, public_profile: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="show-leaderboard">{text[currentLanguage].showInLeaderboard}</Label>
                <p className="text-sm text-gray-500">{text[currentLanguage].showInLeaderboardDesc}</p>
              </div>
              <Switch
                id="show-leaderboard"
                checked={settings.show_in_leaderboard}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_in_leaderboard: checked }))}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? text[currentLanguage].saving : text[currentLanguage].save}
        </Button>

        <Separator />

        {/* Danger Zone */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-red-500" />
            <h3 className="text-lg font-semibold text-red-500">{text[currentLanguage].dangerZone}</h3>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-800">{text[currentLanguage].deleteAccount}</h4>
                <p className="text-sm text-red-600 mt-1">{text[currentLanguage].deleteAccountDesc}</p>
                <Button variant="destructive" size="sm" className="mt-3">
                  {text[currentLanguage].deleteAccount}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSettings;
