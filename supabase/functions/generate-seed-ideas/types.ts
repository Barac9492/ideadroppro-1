
export interface SeedIdea {
  text_ko: string;
  text_en: string;
  score: number;
  tags_ko: string[];
  tags_en: string[];
  analysis_ko: string;
  analysis_en: string;
  improvements_ko: string[];
  improvements_en: string[];
  market_potential_ko: string[];
  market_potential_en: string[];
  similar_ideas_ko: string[];
  similar_ideas_en: string[];
  pitch_points_ko: string[];
  pitch_points_en: string[];
}

export interface SeedGenerationRequest {
  language?: 'ko' | 'en';
}

export interface SeedGenerationResponse {
  message: string;
  count: number;
  totalSeedCount: number;
}
