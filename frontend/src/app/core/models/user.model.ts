export interface User {
  id: number;
  full_name: string;
  email: string;
  language_id: number | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}
