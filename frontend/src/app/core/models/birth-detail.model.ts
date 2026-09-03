export interface BirthDetail {
  id: number;
  date_of_birth: string;      // YYYY-MM-DD
  time_of_birth: string;      // HH:MM:SS or HH:MM
  place_of_birth: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BirthDetailCreate {
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
}

export interface BirthDetailUpdate {
  date_of_birth?: string | null;
  time_of_birth?: string | null;
  place_of_birth?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
}

export interface PlaceSuggestion {
  name: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
