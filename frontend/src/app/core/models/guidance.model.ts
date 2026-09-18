import { AstrologyMarriageAnalysis } from './astrology.model';

export type QuestionCategory =
  | 'MARRIAGE_TIMING'
  | 'MARRIAGE'
  | 'CAREER'
  | 'FINANCE'
  | 'HEALTH'
  | 'EDUCATION'
  | 'GENERAL';

export interface Guidance {
  id: number;
  user_id: number;
  problem: string;
  created_at: string;
  updated_at: string;
  category?: QuestionCategory | null;
  supported?: boolean | null;
  message?: string | null;
  analysis?: AstrologyMarriageAnalysis | null;
}

export interface GuidanceCreate {
  problem: string;
}

export interface GuidanceUpdate {
  problem: string;
}

export interface GuidanceResponse extends Guidance {}
