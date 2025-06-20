
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, Users, Mail, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useInvitations } from '@/hooks/useInvitations';

const InvitationManager: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { invitations, loading, createInvitation, copyInvitationLink } = useInvitations();

  const handleCreateInvitation = async () => {
    setIsCreating(true);
    try {
      await createInvitation(email.trim() || undefined);
      setEmail('');
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted': return <Badge className="bg-green-100 text-green-700">수락됨</Badge>;
      case 'expired': return <Badge className="bg-red-100 text-red-700">만료됨</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-700">대기중</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const acceptedCount = invitations.filter(inv => inv.status === 'accepted').length;
  const pendingCount = invitations.filter(inv => inv.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Invitation Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
                <div className="text-sm text-gray-500">성공한 초대</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-sm text-gray-500">대기중인 초대</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Invitation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>새 초대 링크 만들기</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-700 mb-2">🎉 초대 보상</h4>
            <ul className="text-sm text-purple-600 space-y-1">
              <li>• 친구 가입 & 아이디어 제출 시 <strong>+50점</strong></li>
              <li>• 초대한 친구가 리믹스 생성 시 <strong>+10점/건</strong></li>
              <li>• 영향력 점수로 아이디어 상단 노출 기회 증가</li>
            </ul>
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="친구 이메일 (선택사항)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Button 
              onClick={handleCreateInvitation}
              disabled={isCreating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isCreating ? '생성중...' : '링크 생성'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invitation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>내 초대 현황</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">로딩중...</p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>아직 초대를 보내지 않았습니다.</p>
              <p className="text-sm">친구를 초대해서 영향력 점수를 획득해보세요!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(invitation.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          {invitation.email && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span>{invitation.email}</span>
                            </div>
                          )}
                          {invitation.profiles?.username && (
                            <Badge variant="outline">
                              {invitation.profiles.username}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(invitation.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(invitation.status)}
                      {invitation.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyInvitationLink(invitation.invitation_code)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          복사
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationManager;
