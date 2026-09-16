export interface Guidance {
  id: number;
  user_id: number;
  problem: string;
  created_at: string;
  updated_at: string;
}

export interface GuidanceCreate {
  problem: string;
}

export interface GuidanceUpdate {
  problem: string;
}
