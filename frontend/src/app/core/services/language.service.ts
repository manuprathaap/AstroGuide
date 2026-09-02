import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Language, UpdateUserLanguageRequest } from '../models/language.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly selectedLangStorageKey = 'astroguide_selected_language';

  readonly currentLanguage = signal<Language | null>(this.getInitialStoredLanguage());
  readonly currentLanguageName = computed(() => this.currentLanguage()?.name || 'English');
  readonly currentLanguageCode = computed(() => this.currentLanguage()?.code || 'en');

  private getInitialStoredLanguage(): Language | null {
    try {
      const item = localStorage.getItem(this.selectedLangStorageKey);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.apiUrl}/languages`);
  }

  updateUserLanguage(languageId: number): Observable<User> {
    const payload: UpdateUserLanguageRequest = {
      language_id: languageId
    };
    return this.http.patch<User>(`${this.apiUrl}/users/me/language`, payload);
  }

  setCurrentLanguage(language: Language | null): void {
    this.currentLanguage.set(language);
    if (language) {
      localStorage.setItem(this.selectedLangStorageKey, JSON.stringify(language));
    } else {
      localStorage.removeItem(this.selectedLangStorageKey);
    }
  }
}

