export interface AgeMilestone {
  age_range: string;
  event: string;
  significance_type?: 'favorable' | 'transformative' | 'caution';
}

export interface PalmLineDetail {
  key: string;
  name: string;
  sanskrit_name: string;
  quality: string;
  length: string;
  strength_score: number;
  interpretation: string;
  age_milestones: AgeMilestone[];
}

export interface PalmMountDetail {
  key: string;
  name: string;
  graha: string;
  development: string;
  significance: string;
  score: number;
  remedy: string;
}

export interface SpecialSignDetail {
  symbol: string;
  sanskrit_symbol: string;
  location: string;
  significance: string;
  auspiciousness: string;
}

export interface HandConstitution {
  element: string;
  element_description: string;
  palm_shape: string;
  finger_proportions: string;
  vitality_index: number;
}

export interface GemstoneRecommendation {
  gemstone: string;
  graha: string;
  finger: string;
  metal: string;
  purpose: string;
}

export interface PalmAnalysisRequest {
  name: string;
  gender: string;
  dominant_hand: string;
  language: string;
  left_hand_image?: string | null;
  right_hand_image?: string | null;
  notes?: string;
}

export interface PalmAnalysisResponse {
  id: string;
  analyzed_at: string;
  native_name: string;
  gender: string;
  dominant_hand: string;
  language: string;
  hand_constitution: HandConstitution;
  prarabdha_vs_purushartha_summary: string;
  major_lines: PalmLineDetail[];
  planetary_mounts: PalmMountDetail[];
  special_signs: SpecialSignDetail[];
  life_predictions: Record<string, string>;
  sacred_remedies: string[];
  gemstone_recommendations: GemstoneRecommendation[];
  left_image_analyzed?: boolean;
  right_image_analyzed?: boolean;
}
