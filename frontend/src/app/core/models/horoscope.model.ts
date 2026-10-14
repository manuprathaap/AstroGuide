export interface HoroscopeGenerateRequest {
  name: string;
  gender: string;
  date_of_birth: string; // YYYY-MM-DD
  time_of_birth: string; // HH:MM:SS or HH:MM
  place_of_birth: string;
  latitude: number;
  longitude: number;
  timezone: string;
  chart_style?: string;
  language?: string;
  email?: string;
  phone_number?: string;
}

export interface ChartPlanet {
  name: string;
  malayalam: string;
  abbreviation: string;
  degree: number;
  display_name?: string;
  is_retrograde?: boolean;
  house?: number;
}

export interface ChartBox {
  box_index: number;
  sign_number: number;
  sign_name: string;
  sign_malayalam: string;
  sign_display?: string;
  planets: ChartPlanet[];
}


export interface ChartData {
  center_title: string;
  center_subtitle?: string;
  boxes: ChartBox[];
}

export interface PlanetaryPositionItem {
  graha: string;
  malayalam: string;
  abbreviation: string;
  sign: string;
  sign_malayalam: string;
  degree: number;
  formatted_degree: string;
  house: number;
  nakshatra: string;
  nakshatra_malayalam: string;
  pada: number;
  is_retrograde: boolean;
}

export interface SubTableRow {
  label: string;
  value: string;
}

export interface SubTable {
  title: string;
  rows: SubTableRow[];
}

export interface ChapterItem {
  title?: string;
  subtitle?: string;
  value?: string;
  description?: string;
  ribbon_title?: string;
  subtitle_accent?: string;
  significance_box?: string;
  prediction_text?: string;
  meta_note?: string;
  sub_tables?: SubTable[];
  timeline_cards?: Array<{
    status: string;
    status_type: string;
    age_range: string;
    date_range: string;
    duration: string;
    progress_percent: number;
  }>;
}

export interface HoroscopeChapter {
  chapter_number: number;
  title: string;
  subtitle?: string;
  preamble?: string;
  items: ChapterItem[];
}

export interface PredictionSummaryCard {
  category: string;
  category_malayalam: string;
  count: number;
  description: string;
  highlight?: string;
}

export interface TableOfPredictions {
  header: string;
  summary_text: string;
  cards: PredictionSummaryCard[];
}

export interface HoroscopeResponse {
  personal_info: {
    name: string;
    gender: string;
    gender_malayalam: string;
    gender_display?: string;
    age: number;
    age_display?: string;
    date_of_birth: string;
    date_of_birth_formatted: string;
    day_of_week: string;
    day_of_week_malayalam: string;
    day_of_week_display?: string;
    time_of_birth: string;
    time_of_birth_formatted: string;
    place_of_birth: string;
    latitude: number;
    longitude: number;
    timezone: string;
    ayanamsa: string;
    ayanamsa_degrees: number;
  };
  sun_sign: {
    name: string;
    malayalam: string;
    sign_display?: string;
    degree: number;
    symbol: string;
    label: string;
  };
  moon_sign: {
    name: string;
    malayalam: string;
    sign_display?: string;
    degree: number;
    symbol: string;
    label: string;
  };
  ascendant: {
    sign: string;
    sign_malayalam: string;
    degree: number;
    nakshatra: string;
    nakshatra_malayalam: string;
    pada: number;
  };
  panchanga: {
    vara: { name: string; malayalam: string; lord: string; quality?: string };
    nakshatra: { name: string; malayalam: string; pada: number; lord: string; quality?: string };
    tithi: { name: string; malayalam: string; paksha: string; paksha_malayalam: string };
    karana: { name: string; malayalam: string };
    yoga: { name: string; malayalam: string };
  };
  rashi_chart: ChartData;
  navamsha_chart: ChartData;
  planetary_positions: PlanetaryPositionItem[];
  shloka: {
    sanskrit: string;
    malayalam_script: string;
    meaning: string;
  };
  table_of_predictions?: TableOfPredictions;
  chapters: HoroscopeChapter[];
}
