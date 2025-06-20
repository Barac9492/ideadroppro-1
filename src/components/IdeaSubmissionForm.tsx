import React, { useState, useEffect } from 'react';
import { Send, Loader, Zap, AlertTriangle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkInappropriateContent, checkTextQuality, getContentWarning, getQualityWarning } from '@/utils/contentFilter';
import { useNavigate } from 'react-router-dom';
import CopyrightNotice from '@/components/CopyrightNotice';

interface IdeaSubmissionFormProps {
  currentLanguage: 'ko' | 'en';
  onSubmit: (idea: string) => Promise<void>;
  initialText?: string;
  isAuthenticated: boolean;
}

const IdeaSubmissionForm: React.FC<IdeaSubmissionFormProps> = ({ 
  currentLanguage, 
  onSubmit, 
  initialText = '',
  isAuthenticated
}) => {
  const [idea, setIdea] = useState(initialText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  // Update idea text when initialText prop changes
  useEffect(() => {
    if (initialText && initialText !== idea) {
      setIdea(initialText);
    }
  }, [initialText]);

  const text = {
    ko: {
      placeholder: '당신의 혁신적인 아이디어를 500자 이내로 공유해주세요...',
      submit: 'AI 분석으로 아이디어 제출',
      submitting: 'AI가 분석 중입니다...',
      charCount: '글자',
      guidelines: '커뮤니티 가이드라인: 폭력적이거나 성적인 내용, 혐오 표현은 금지됩니다.',
      loginRequired: '아이디어를 제출하려면 로그인이 필요합니다',
      loginButton: '로그인 / 회원가입',
      loginDescription: '로그인하여 혁신적인 아이디어를 공유하고 AI 피드백을 받아보세요!',
      viewOnly: '로그인 후 아이디어를 제출할 수 있습니다',
      retryButton: '다시 시도',
      submitSuccess: '제출 완료!',
      authError: '인증 오류가 발생했습니다. 다시 로그인해주세요.',
      generalError: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    },
    en: {
      placeholder: 'Share your innovative idea in 500 characters or less...',
      submit: 'Submit Idea with AI Analysis',
      submitting: 'AI is analyzing...',
      charCount: 'characters',
      guidelines: 'Community Guidelines: Violent, sexual, or hateful content is prohibited.',
      loginRequired: 'Login required to submit ideas',
      loginButton: 'Sign In / Sign Up',
      loginDescription: 'Sign in to share your innovative ideas and get instant AI feedback!',
      viewOnly: 'Sign in to submit ideas',
      retryButton: 'Try Again',
      submitSuccess: 'Submitted!',
      authError: 'Authentication error occurred. Please log in again.',
      generalError: 'An error occurred. Please try again later.'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit triggered, authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to auth');
      navigate('/auth');
      return;
    }
    
    if (idea.trim().length === 0 || idea.length > 500) {
      console.log('Invalid idea length:', idea.length);
      return;
    }

    // Enhanced content filtering
    try {
      // Check text quality first
      const qualityCheck = checkTextQuality(idea.trim(), currentLanguage);
      if (!qualityCheck.isValid) {
        console.log('Text quality check failed:', qualityCheck.reason);
        setWarningMessage(qualityCheck.reason || '');
        setShowWarning(true);
        return;
      }

      // Check for inappropriate content
      if (checkInappropriateContent(idea.trim(), currentLanguage)) {
        console.log('Content flagged by inappropriate filter');
        const warning = getContentWarning(currentLanguage);
        setWarningMessage(warning[currentLanguage].message);
        setShowWarning(true);
        return;
      }
    } catch (filterError) {
      console.error('Content filter error:', filterError);
      // Continue with submission if filter fails
    }

    setIsSubmitting(true);
    setShowWarning(false);
    setSubmitError(null);
    
    try {
      console.log('Calling onSubmit with idea:', idea.trim().substring(0, 50) + '...');
      await onSubmit(idea.trim());
      console.log('onSubmit completed successfully');
      setIdea(''); // Clear form on success
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Submit error in form:', error);
      
      // Handle different types of errors
      let errorMessage = text[currentLanguage].generalError;
      
      if (error.message === 'User not authenticated' || 
          error.message === 'User ID missing' || 
          error.message?.includes('authentication')) {
        errorMessage = text[currentLanguage].authError;
        // Redirect to login after short delay
        setTimeout(() => navigate('/auth'), 2000);
      } else if (error.message === 'Content flagged as inappropriate' || 
                 error.message === 'Text quality check failed') {
        const warning = getContentWarning(currentLanguage);
        setWarningMessage(warning[currentLanguage].message);
        setShowWarning(true);
        return;
      }
      
      setSubmitError(errorMessage);
      setRetryCount(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIdea(e.target.value);
    setShowWarning(false);
    setSubmitError(null);
    setWarningMessage('');
  };

  const handleRetry = () => {
    setSubmitError(null);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const remainingChars = 500 - idea.length;
  const warning = getContentWarning(currentLanguage);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="text-center">
          <div className="mb-4">
            <LogIn className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {text[currentLanguage].loginRequired}
            </h3>
            <p className="text-gray-600 mb-6">
              {text[currentLanguage].loginDescription}
            </p>
          </div>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <LogIn className="h-4 w-4 mr-2" />
            {text[currentLanguage].loginButton}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      {showWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div>
              <p className="font-medium">
                {warningMessage.includes('키보드') || warningMessage.includes('keystrokes') ? 
                  (currentLanguage === 'ko' ? '텍스트 품질 검사' : 'Text Quality Check') :
                  (currentLanguage === 'ko' ? '콘텐츠 검사' : 'Content Check')
                }
              </p>
              <p className="text-sm mt-1">{warningMessage}</p>
              {warningMessage.includes('키보드') || warningMessage.includes('keystrokes') ? (
                <div className="mt-2">
                  <p className="text-xs font-medium mb-1">
                    {currentLanguage === 'ko' ? '좋은 아이디어 작성 팁:' : 'Tips for good ideas:'}
                  </p>
                  <ul className="text-xs space-y-1">
                    {getQualityWarning(currentLanguage)[currentLanguage].suggestions.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {submitError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">제출 오류</p>
                <p className="text-sm mt-1">{submitError}</p>
                {retryCount > 0 && (
                  <p className="text-xs mt-1 opacity-75">시도 횟수: {retryCount}</p>
                )}
              </div>
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="ml-4"
                disabled={isSubmitting}
              >
                {text[currentLanguage].retryButton}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={idea}
            onChange={handleTextChange}
            placeholder={text[currentLanguage].placeholder}
            className="min-h-[120px] resize-none border-2 border-purple-100 focus:border-purple-400 transition-colors duration-300"
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className={`absolute bottom-3 right-3 text-sm ${remainingChars < 50 ? 'text-red-500' : 'text-gray-400'}`}>
            {remainingChars} {text[currentLanguage].charCount}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <AlertTriangle className="h-3 w-3 inline mr-1" />
          {text[currentLanguage].guidelines}
        </div>
        
        {/* Compact Copyright Notice */}
        <CopyrightNotice currentLanguage={currentLanguage} variant="compact" />
        
        <Button
          type="submit"
          disabled={idea.trim().length === 0 || idea.length > 500 || isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Loader className="h-4 w-4 animate-spin" />
              <Zap className="h-4 w-4 animate-pulse text-yellow-300" />
              <span>{text[currentLanguage].submitting}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <Send className="h-4 w-4" />
              <span>{text[currentLanguage].submit}</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default IdeaSubmissionForm;
