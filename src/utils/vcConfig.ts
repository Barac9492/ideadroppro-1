
export interface VCProfile {
  name: string;
  nameEn: string;
  avatar: string;
  type: string;
  typeEn: string;
  fundSize: string;
  fundSizeEn: string;
  specialties: string[];
  specialtiesEn: string[];
}

export const VC_PROFILES: VCProfile[] = [
  {
    name: '대형 VC',
    nameEn: 'Major VC',
    avatar: '💼',
    type: '대기업 계열',
    typeEn: 'Corporate-backed',
    fundSize: '시리즈 A-B 전문',
    fundSizeEn: 'Series A-B Focus',
    specialties: ['펫테크', 'ESG', '헬스케어'],
    specialtiesEn: ['Pet-tech', 'ESG', 'Healthcare']
  },
  {
    name: '초기 전문 VC',
    nameEn: 'Early Stage VC',
    avatar: '📊',
    type: '초기 투자 전문',
    typeEn: 'Early Investment Specialist',
    fundSize: '시드-시리즈 A 리더',
    fundSizeEn: 'Seed-Series A Leader',
    specialties: ['핀테크', 'AI/ML', '블록체인'],
    specialtiesEn: ['Fintech', 'AI/ML', 'Blockchain']
  },
  {
    name: '성장 단계 VC',
    nameEn: 'Growth Stage VC',
    avatar: '📈',
    type: '성장 단계 펀드',
    typeEn: 'Growth Stage Fund',
    fundSize: '프리시드-시드 집중',
    fundSizeEn: 'Pre-seed-Seed Focus',
    specialties: ['딥테크', '로보틱스', 'IoT'],
    specialtiesEn: ['Deep Tech', 'Robotics', 'IoT']
  },
  {
    name: '글로벌 VC',
    nameEn: 'Global VC',
    avatar: '🌐',
    type: '글로벌 펀드',
    typeEn: 'Global Fund',
    fundSize: '시리즈 B+ 전문',
    fundSizeEn: 'Series B+ Specialist',
    specialties: ['B2B SaaS', '모빌리티', '에너지'],
    specialtiesEn: ['B2B SaaS', 'Mobility', 'Energy']
  },
  {
    name: '전문 분야 VC',
    nameEn: 'Sector-focused VC',
    avatar: '🎯',
    type: '산업 전문',
    typeEn: 'Industry Specialist',
    fundSize: '전 단계 투자',
    fundSizeEn: 'All-stage Investment',
    specialties: ['바이오', '교육', '컨텐츠'],
    specialtiesEn: ['Bio', 'Education', 'Content']
  },
  {
    name: '신흥 VC',
    nameEn: 'Emerging VC',
    avatar: '🚀',
    type: '신생 펀드',
    typeEn: 'Emerging Fund',
    fundSize: '시드 집중',
    fundSizeEn: 'Seed Focus',
    specialties: ['Web3', '클린테크', '소셜'],
    specialtiesEn: ['Web3', 'CleanTech', 'Social']
  },
  {
    name: '액셀러레이터',
    nameEn: 'Accelerator',
    avatar: '⚡',
    type: '액셀러레이팅',
    typeEn: 'Accelerating',
    fundSize: '프리시드 전문',
    fundSizeEn: 'Pre-seed Specialist',
    specialties: ['스타트업', '멘토링', '네트워킹'],
    specialtiesEn: ['Startups', 'Mentoring', 'Networking']
  },
  {
    name: '정부 지원 VC',
    nameEn: 'Government-backed VC',
    avatar: '🏛️',
    type: '정부 출자',
    typeEn: 'Government-funded',
    fundSize: '전 단계 지원',
    fundSizeEn: 'All-stage Support',
    specialties: ['혁신기술', '정책사업', 'R&D'],
    specialtiesEn: ['Innovation Tech', 'Policy Business', 'R&D']
  }
];

export const getRandomVC = (): VCProfile => {
  return VC_PROFILES[Math.floor(Math.random() * VC_PROFILES.length)];
};

export const getVCByIndex = (index: number): VCProfile => {
  return VC_PROFILES[index % VC_PROFILES.length];
};
