import { AstrologyMarriageAnalysis, AstrologyMarriageTimingWindow } from './astrology.model';

export type QuestionCategory =
  | 'MARRIAGE_TIMING'
  | 'MARRIAGE'
  | 'CAREER_TIMING'
  | 'CAREER'
  | 'FINANCE'
  | 'RELATIONSHIP'
  | 'FAMILY'
  | 'TRAVEL'
  | 'FOREIGN_SETTLEMENT'
  | 'HEALTH'
  | 'EDUCATION'
  | 'BUSINESS'
  | 'LIFE_OVERVIEW'
  | 'TIMING'
  | 'FOLLOW_UP'
  | 'GENERAL';

export interface Guidance {
  id: number;
  user_id: number;
  problem: string;
  created_at: string;
  updated_at: string;
  category?: QuestionCategory | null;
  language?: string | null;
  supported?: boolean | null;
  message?: string | null;
  analysis?: AstrologyMarriageAnalysis | Record<string, any> | null;
}

export interface GuidanceCreate {
  problem: string;
  language?: string;
}

export interface GuidanceUpdate {
  problem: string;
  language?: string;
}

export interface GuidanceResponse extends Guidance {}

export type ChatMessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string | number;
  role: ChatMessageRole;
  content: string;
  createdAt: string | Date;
  category?: QuestionCategory | string | null;
  analysis?: AstrologyMarriageAnalysis | Record<string, any> | null;
  timingWindows?: AstrologyMarriageTimingWindow[];
  isError?: boolean;
}
