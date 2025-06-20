
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lightbulb, Heart, BarChart3, Globe, Zap } from 'lucide-react';

const Guide: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState<'ko' | 'en'>('ko');
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const text = {
    ko: {
      title: '사용법 가이드',
      subtitle: 'AI 아이디어 평가 서비스 사용 방법',
      backToHome: '홈으로 돌아가기',
      getStarted: '시작하기',
      steps: {
        step1: {
          title: '1. 회원가입 및 로그인',
          desc: '상단 우측의 "로그인" 버튼을 클릭하여 계정을 만들거나 로그인하세요.'
        },
        step2: {
          title: '2. 아이디어 제출',
          desc: '메인 페이지의 텍스트 상자에 여러분의 아이디어를 입력하고 "아이디어 제출" 버튼을 클릭하세요.'
        },
        step3: {
          title: '3. AI 분석 받기',
          desc: '제출된 아이디어 카드에서 "AI 분석 생성" 버튼을 클릭하여 상세한 분석을 받아보세요.'
        },
        step4: {
          title: '4. 글로벌 시장 분석',
          desc: '"글로벌 분석 생성" 버튼으로 전 세계 시장에서의 아이디어 잠재력을 확인하세요.'
        },
        step5: {
          title: '5. 다른 아이디어와 소통',
          desc: '마음에 드는 아이디어에 좋아요를 누르고 다른 사용자들과 소통하세요.'
        },
        step6: {
          title: '6. 연속 제출로 스트릭 쌓기',
          desc: '매일 아이디어를 제출하여 연속 제출 기록을 쌓고 특별한 배지를 획득하세요.'
        }
      },
      features: {
        title: '주요 기능',
        aiAnalysis: {
          title: 'AI 분석',
          desc: '아이디어의 강점, 개선점, 시장 잠재력을 AI가 분석해드립니다.'
        },
        globalAnalysis: {
          title: '글로벌 분석',
          desc: '전 세계 시장 동향과 비교하여 아이디어의 글로벌 경쟁력을 평가합니다.'
        },
        community: {
          title: '커뮤니티',
          desc: '다른 사용자들의 아이디어를 보고 좋아요로 응원할 수 있습니다.'
        }
      },
      tips: {
        title: '💡 사용 팁',
        tip1: '구체적이고 상세한 아이디어일수록 더 정확한 AI 분석을 받을 수 있습니다.',
        tip2: '일일 프롬프트를 활용하여 새로운 아이디어 영감을 얻어보세요.',
        tip3: '다른 사용자들의 아이디어를 참고하여 새로운 관점을 발견해보세요.'
      }
    },
    en: {
      title: 'How to Use',
      subtitle: 'Guide to using AI Idea Evaluator',
      backToHome: 'Back to Home',
      getStarted: 'Get Started',
      steps: {
        step1: {
          title: '1. Sign Up & Login',
          desc: 'Click the "Sign In" button in the top right to create an account or log in.'
        },
        step2: {
          title: '2. Submit Ideas',
          desc: 'Enter your idea in the text box on the main page and click "Submit Idea".'
        },
        step3: {
          title: '3. Get AI Analysis',
          desc: 'Click "Generate AI Analysis" on your idea card to receive detailed analysis.'
        },
        step4: {
          title: '4. Global Market Analysis',
          desc: 'Use "Generate Global Analysis" to check your idea\'s potential in global markets.'
        },
        step5: {
          title: '5. Engage with Community',
          desc: 'Like ideas you enjoy and engage with other users in the community.'
        },
        step6: {
          title: '6. Build Streaks',
          desc: 'Submit ideas daily to build streaks and earn special badges.'
        }
      },
      features: {
        title: 'Key Features',
        aiAnalysis: {
          title: 'AI Analysis',
          desc: 'AI analyzes your idea\'s strengths, improvements, and market potential.'
        },
        globalAnalysis: {
          title: 'Global Analysis',
          desc: 'Evaluate your idea\'s global competitiveness against worldwide market trends.'
        },
        community: {
          title: 'Community',
          desc: 'View other users\' ideas and show support with likes.'
        }
      },
      tips: {
        title: '💡 Usage Tips',
        tip1: 'More specific and detailed ideas receive more accurate AI analysis.',
        tip2: 'Use daily prompts to get inspiration for new ideas.',
        tip3: 'Check out other users\' ideas to discover new perspectives.'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header currentLanguage={currentLanguage} onLanguageToggle={toggleLanguage} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {text[currentLanguage].backToHome}
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {text[currentLanguage].title}
          </h1>
          <p className="text-lg text-slate-600">{text[currentLanguage].subtitle}</p>
        </div>

        {/* Getting Started Steps */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-purple-600" />
            {text[currentLanguage].getStarted}
          </h2>
          
          <div className="space-y-6">
            {Object.values(text[currentLanguage].steps).map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {text[currentLanguage].features.title}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.aiAnalysis.title}</h3>
              <p className="text-slate-600 text-sm">{text[currentLanguage].features.aiAnalysis.desc}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.globalAnalysis.title}</h3>
              <p className="text-slate-600 text-sm">{text[currentLanguage].features.globalAnalysis.desc}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.community.title}</h3>
              <p className="text-slate-600 text-sm">{text[currentLanguage].features.community.desc}</p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl shadow-lg p-6 md:p-8 border border-yellow-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-yellow-600" />
            {text[currentLanguage].tips.title}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-700">{text[currentLanguage].tips.tip1}</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-700">{text[currentLanguage].tips.tip2}</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-700">{text[currentLanguage].tips.tip3}</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg px-8 py-3 text-lg"
          >
            {text[currentLanguage].getStarted}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Guide;
