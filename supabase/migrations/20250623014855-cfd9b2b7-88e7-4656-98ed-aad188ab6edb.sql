
-- Insert basic module templates for each module type
INSERT INTO public.module_templates (module_type, template_name, description, example_content) VALUES
-- Problem modules
('problem', '효율성 문제', '업무나 일상에서의 효율성 관련 문제', '사람들이 반복적인 작업으로 시간을 낭비하고 있습니다'),
('problem', '비용 문제', '높은 비용으로 인한 접근성 문제', '기존 솔루션들이 너무 비싸서 일반 사용자들이 이용하기 어렵습니다'),
('problem', '접근성 문제', '정보나 서비스에 대한 접근 장벽', '전문적인 지식이나 도구가 없으면 이용하기 어려운 서비스입니다'),

-- Solution modules  
('solution', 'AI 자동화', 'AI를 활용한 자동화 솔루션', 'AI 기술을 활용하여 반복적인 작업을 자동화합니다'),
('solution', '플랫폼 연결', '여러 서비스를 연결하는 플랫폼', '다양한 서비스들을 하나의 플랫폼에서 통합 관리할 수 있습니다'),
('solution', '모바일 앱', '모바일 기반 솔루션', '언제 어디서나 접근 가능한 모바일 앱으로 문제를 해결합니다'),

-- Target Customer modules
('target_customer', '직장인', '업무 효율성을 중시하는 직장인', '시간 부족에 시달리는 바쁜 직장인들'),
('target_customer', '스타트업', '빠른 성장을 원하는 스타트업', '제한된 리소스로 최대 효과를 원하는 초기 스타트업'),
('target_customer', '중소기업', '디지털 전환을 원하는 중소기업', '전통적인 방식에서 벗어나려는 중소기업'),

-- Value Proposition modules
('value_proposition', '시간 절약', '업무 시간을 대폭 단축', '기존 대비 80% 시간 절약으로 생산성 향상'),
('value_proposition', '비용 절감', '운영 비용을 크게 줄임', '기존 솔루션 대비 50% 비용 절감'),
('value_proposition', '사용 편의성', '누구나 쉽게 사용 가능', '복잡한 설정 없이 바로 사용할 수 있는 직관적 인터페이스'),

-- Revenue Model modules
('revenue_model', 'SaaS 구독', '월간/연간 구독 모델', '월 구독료를 통한 안정적인 수익 구조'),
('revenue_model', '프리미엄', '무료 + 유료 기능 모델', '기본 기능은 무료, 고급 기능은 유료로 제공'),
('revenue_model', '거래 수수료', '플랫폼 이용 수수료', '거래 발생 시 일정 비율의 수수료를 받는 모델');

-- Insert sample idea modules with proper user reference
INSERT INTO public.idea_modules (module_type, content, tags, created_by, quality_score, usage_count) VALUES
-- Problem modules
('problem', '사람들이 매일 같은 업무를 반복하면서 시간을 낭비하고 있습니다', ARRAY['효율성', '자동화', '시간절약'], (SELECT id FROM auth.users LIMIT 1), 8.5, 0),
('problem', '중소기업들이 복잡한 업무 관리 도구 때문에 어려움을 겪고 있습니다', ARRAY['중소기업', '업무관리', '복잡성'], (SELECT id FROM auth.users LIMIT 1), 7.8, 0),
('problem', '개인 사용자들이 여러 앱을 오가며 정보를 관리하는 것이 번거롭습니다', ARRAY['개인사용자', '정보관리', '통합'], (SELECT id FROM auth.users LIMIT 1), 8.2, 0),

-- Solution modules
('solution', 'AI 기반 업무 자동화 플랫폼으로 반복 작업을 자동화합니다', ARRAY['AI', '자동화', '플랫폼'], (SELECT id FROM auth.users LIMIT 1), 9.0, 0),
('solution', '직관적인 드래그앤드롭 인터페이스로 누구나 쉽게 사용할 수 있습니다', ARRAY['UI/UX', '사용성', '직관적'], (SELECT id FROM auth.users LIMIT 1), 8.7, 0),
('solution', '모든 데이터를 한 곳에서 통합 관리할 수 있는 대시보드를 제공합니다', ARRAY['통합', '대시보드', '데이터'], (SELECT id FROM auth.users LIMIT 1), 8.4, 0),

-- Target Customer modules
('target_customer', '시간에 쫓기는 직장인과 소상공인', ARRAY['직장인', '소상공인', '시간부족'], (SELECT id FROM auth.users LIMIT 1), 8.1, 0),
('target_customer', '디지털 전환을 원하는 전통적인 중소기업', ARRAY['중소기업', '디지털전환', '전통기업'], (SELECT id FROM auth.users LIMIT 1), 7.9, 0),
('target_customer', '효율성을 추구하는 개인 사업자와 프리랜서', ARRAY['개인사업자', '프리랜서', '효율성'], (SELECT id FROM auth.users LIMIT 1), 8.3, 0),

-- Value Proposition modules
('value_proposition', '하루 2시간씩 절약되는 시간으로 더 중요한 일에 집중할 수 있습니다', ARRAY['시간절약', '집중', '생산성'], (SELECT id FROM auth.users LIMIT 1), 8.8, 0),
('value_proposition', '복잡한 설정 없이 5분 만에 바로 시작할 수 있습니다', ARRAY['간편성', '빠른시작', '설정불필요'], (SELECT id FROM auth.users LIMIT 1), 8.6, 0),
('value_proposition', '기존 도구들보다 70% 저렴한 가격으로 동일한 기능을 제공합니다', ARRAY['저렴함', '가성비', '비용절감'], (SELECT id FROM auth.users LIMIT 1), 8.0, 0),

-- Revenue Model modules
('revenue_model', '월 9,900원 구독료로 모든 기능 무제한 이용', ARRAY['구독모델', '저렴함', '무제한'], (SELECT id FROM auth.users LIMIT 1), 7.5, 0),
('revenue_model', '기본 기능 무료, 고급 기능 월 19,900원', ARRAY['프리미엄', '무료체험', '단계적'], (SELECT id FROM auth.users LIMIT 1), 8.1, 0),
('revenue_model', '플랫폼 거래액의 3% 수수료', ARRAY['수수료', '플랫폼', '거래기반'], (SELECT id FROM auth.users LIMIT 1), 7.2, 0);
