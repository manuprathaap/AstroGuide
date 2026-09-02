export interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string;
}

export interface UpdateUserLanguageRequest {
  language_id: number;
}
