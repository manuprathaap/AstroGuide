export interface AstrologyNakshatra {
  name: string;
  index: number;
  lord: string;
  pada: number;
  degrees_into_nakshatra: number;
}

export interface AstrologyPoint {
  longitude: number;
  sign: string;
  degree_in_sign: number;
  nakshatra: AstrologyNakshatra;
}

export interface AstrologyPlanetPosition extends AstrologyPoint {
  graha: string;
  house: number;
}

export interface AstrologyHouseCusp {
  house: number;
  longitude: number;
  sign: string;
  degree_in_sign: number;
}

export interface AstrologyMahadasha {
  lord: string;
  start: string;
  end: string;
  duration_years: number;
}

export interface AstrologyAntardasha {
  mahadasha_lord: string;
  lord: string;
  start: string;
  end: string;
  duration_years: number;
}

export interface AstrologyDashaResult {
  moon_nakshatra: AstrologyNakshatra;
  mahadashas: AstrologyMahadasha[];
  antardashas: AstrologyAntardasha[];
  current_mahadasha: AstrologyMahadasha | null;
  current_antardasha: AstrologyAntardasha | null;
}

export interface AstrologyMarriageFactor {
  factor: string;
  value: string | number | null;
  description: string;
}

export interface AstrologyMarriageTimingFactor {
  rule: string;
  planet?: string | null;
  house?: number | null;
  value?: string | number | null;
  reason: string;
  weight?: number | null;
}

export interface AstrologyMarriageTimingWindow {
  mahadasha_lord: string;
  antardasha_lord: string;
  start: string;
  end: string;
  reasons: string[];
  factors?: AstrologyMarriageTimingFactor[];
}

export interface AstrologyMarriageCurrentPeriod {
  mahadasha_lord: string;
  antardasha_lord: string;
  mahadasha_start: string;
  mahadasha_end: string;
  antardasha_start: string;
  antardasha_end: string;
}

export interface AstrologyMarriageTimingResult {
  current_period: AstrologyMarriageCurrentPeriod | null;
  candidate_periods: AstrologyMarriageTimingWindow[];
  supporting_factors: AstrologyMarriageTimingFactor[];
  caution_factors: AstrologyMarriageTimingFactor[];
  limitations: string[];
}

export interface AstrologyMarriageAnalysis {
  seventh_house_sign: string;
  seventh_house_lord: string;
  seventh_lord_sign?: string | null;
  seventh_lord_house?: number | null;
  venus_sign?: string | null;
  venus_house?: number | null;
  jupiter_sign?: string | null;
  jupiter_house?: number | null;
  current_mahadasha?: string | null;
  current_antardasha?: string | null;
  factors: AstrologyMarriageFactor[];
  timing_windows: AstrologyMarriageTimingWindow[];
  timing?: AstrologyMarriageTimingResult | null;
}

export interface AstrologyChartResult {
  birth_datetime: string;
  place_of_birth: string;
  latitude: number;
  longitude: number;
  timezone: string;
  ayanamsa_system: string;
  ayanamsa_degrees: number;
  ascendant: AstrologyPoint;
  planets: AstrologyPlanetPosition[];
  houses: AstrologyHouseCusp[];
  dasha: AstrologyDashaResult;
}
