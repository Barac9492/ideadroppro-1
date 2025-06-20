
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Zap, TrendingUp, Users, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ideaPreview, setIdeaPreview] = useState<string | null>(null);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for idea text from drop flow
  useEffect(() => {
    const state = location.state as { ideaText?: string } | null;
    if (state?.ideaText) {
      setIdeaPreview(state.ideaText);
      setIsSignUp(true); // Default to signup for new users
    }
  }, [location.state]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true, state: location.state });
    }
  }, [user, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, username);
        if (error) {
          setError(error.message);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-white hover:bg-white/10 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          홈으로 돌아가기
        </Button>

        {/* Idea Preview Card */}
        {ideaPreview && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">당신의 아이디어</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              "{ideaPreview}"
            </p>
            <div className="mt-4 flex items-center space-x-4 text-xs text-white/70">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>GPT 분석 준비 완료</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>투자자 피드 대기 중</span>
              </div>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {ideaPreview ? '아이디어를 드랍하려면' : '시작하기'}
            </h1>
            <p className="text-gray-600">
              {ideaPreview 
                ? '계정을 만들고 GPT 분석을 받아보세요'
                : isSignUp 
                  ? '새 계정을 만들어 아이디어를 공유하세요'
                  : '기존 계정으로 로그인하세요'
              }
            </p>
          </div>

          {/* Social Proof */}
          {ideaPreview && (
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-800">오늘 23명이 가입</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-800">12건 투자 연결</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field for signup */}
            {isSignUp && (
              <div>
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  사용자명 (선택사항)
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디어 크리에이터명을 입력하세요"
                  className="mt-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>

            {/* Password field */}
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                비밀번호
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  className="pr-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>처리 중...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>
                    {ideaPreview 
                      ? '아이디어 드랍하기' 
                      : isSignUp ? '계정 만들기' : '로그인'
                    }
                  </span>
                </div>
              )}
            </Button>
          </form>

          {/* Toggle between signin/signup */}
          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-600 hover:text-purple-700"
            >
              {isSignUp 
                ? '이미 계정이 있으신가요? 로그인하기'
                : '계정이 없으신가요? 회원가입하기'
              }
            </Button>
          </div>

          {/* Additional info for idea drop flow */}
          {ideaPreview && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>가입 후 즉시 GPT 분석 및 투자자 피드 노출</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
