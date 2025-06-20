
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Users, Zap, Shield, Globe, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = React.useState<'ko' | 'en'>('ko');
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const text = {
    ko: {
      title: '서비스 소개',
      subtitle: 'AI 아이디어 평가 서비스에 대해 알아보세요',
      backToHome: '홈으로 돌아가기',
      mission: {
        title: '우리의 미션',
        desc: 'AI 아이디어 평가 서비스는 혁신적인 아이디어를 가진 모든 사람들이 자신의 아이디어를 객관적으로 평가받고, 글로벌 시장에서의 잠재력을 확인할 수 있도록 돕습니다. 우리는 AI 기술을 활용하여 창의적인 아이디어가 현실이 될 수 있는 플랫폼을 제공합니다.'
      },
      features: {
        title: '핵심 기능',
        aiPowered: {
          title: 'AI 기반 분석',
          desc: '최신 인공지능 기술을 활용하여 아이디어의 강점, 약점, 개선 방향을 객관적으로 분석합니다.'
        },
        globalInsight: {
          title: '글로벌 시장 분석',
          desc: '전 세계 시장 동향과 데이터를 바탕으로 아이디어의 글로벌 경쟁력을 평가합니다.'
        },
        community: {
          title: '커뮤니티 피드백',
          desc: '다른 창업가들과 아이디어를 공유하고 실시간 피드백을 받을 수 있습니다.'
        },
        tracking: {
          title: '성장 추적',
          desc: '아이디어 제출 스트릭과 발전 과정을 추적하여 지속적인 혁신을 장려합니다.'
        }
      },
      values: {
        title: '우리의 가치',
        innovation: {
          title: '혁신',
          desc: '창의적인 아이디어를 발굴하고 지원합니다.'
        },
        accessibility: {
          title: '접근성',
          desc: '누구나 쉽게 사용할 수 있는 서비스를 제공합니다.'
        },
        objectivity: {
          title: '객관성',
          desc: 'AI 기반의 공정하고 객관적인 분석을 제공합니다.'
        }
      },
      cta: {
        title: '지금 시작해보세요!',
        desc: '여러분의 혁신적인 아이디어를 AI와 함께 평가해보세요.',
        button: '아이디어 제출하기'
      }
    },
    en: {
      title: 'About Us',
      subtitle: 'Learn about AI Idea Evaluator',
      backToHome: 'Back to Home',
      mission: {
        title: 'Our Mission',
        desc: 'AI Idea Evaluator helps everyone with innovative ideas to receive objective evaluations and discover their potential in global markets. We provide a platform where creative ideas can become reality through AI technology.'
      },
      features: {
        title: 'Core Features',
        aiPowered: {
          title: 'AI-Powered Analysis',
          desc: 'Utilizing cutting-edge AI technology to objectively analyze idea strengths, weaknesses, and improvement directions.'
        },
        globalInsight: {
          title: 'Global Market Analysis',
          desc: 'Evaluate your idea\'s global competitiveness based on worldwide market trends and data.'
        },
        community: {
          title: 'Community Feedback',
          desc: 'Share ideas with other entrepreneurs and receive real-time feedback from the community.'
        },
        tracking: {
          title: 'Growth Tracking',
          desc: 'Track idea submission streaks and development progress to encourage continuous innovation.'
        }
      },
      values: {
        title: 'Our Values',
        innovation: {
          title: 'Innovation',
          desc: 'We discover and support creative ideas.'
        },
        accessibility: {
          title: 'Accessibility',
          desc: 'We provide services that anyone can easily use.'
        },
        objectivity: {
          title: 'Objectivity',
          desc: 'We provide fair and objective AI-based analysis.'
        }
      },
      cta: {
        title: 'Get Started Now!',
        desc: 'Evaluate your innovative ideas with AI assistance.',
        button: 'Submit Your Idea'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header currentLanguage={currentLanguage} onLanguageToggle={toggleLanguage} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
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

        {/* Mission Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
            <Target className="h-6 w-6 mr-2 text-purple-600" />
            {text[currentLanguage].mission.title}
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            {text[currentLanguage].mission.desc}
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {text[currentLanguage].features.title}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.aiPowered.title}</h3>
                <p className="text-slate-600">{text[currentLanguage].features.aiPowered.desc}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.globalInsight.title}</h3>
                <p className="text-slate-600">{text[currentLanguage].features.globalInsight.desc}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.community.title}</h3>
                <p className="text-slate-600">{text[currentLanguage].features.community.desc}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].features.tracking.title}</h3>
                <p className="text-slate-600">{text[currentLanguage].features.tracking.desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl shadow-lg p-6 md:p-8 mb-8 border border-indigo-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {text[currentLanguage].values.title}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].values.innovation.title}</h3>
              <p className="text-slate-600 text-sm">{text[currentLanguage].values.innovation.desc}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].values.accessibility.title}</h3>
              <p className="text-slate-600 text-sm">{text[currentLanguage].values.accessibility.desc}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{text[currentLanguage].values.objectivity.title}</h3>
              <p className="text-slate-600 text-sm">{text[currentLanguage].values.objectivity.desc}</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-lg p-6 md:p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">{text[currentLanguage].cta.title}</h2>
          <p className="text-purple-100 mb-6 text-lg">{text[currentLanguage].cta.desc}</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg px-8 py-3 text-lg font-semibold"
          >
            {text[currentLanguage].cta.button}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
