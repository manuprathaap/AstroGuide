import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HoroscopeGenerateRequest, HoroscopeResponse } from '../models/horoscope.model';

@Injectable({
  providedIn: 'root'
})
export class HoroscopeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly storageKey = 'astroguide_current_horoscope';
  private readonly formStorageKey = 'astroguide_horoscope_form_data';

  readonly currentHoroscope = signal<HoroscopeResponse | null>(this.getStoredHoroscope());
  readonly isGenerating = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  private getStoredHoroscope(): HoroscopeResponse | null {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  saveFormData(data: any): void {
    try {
      localStorage.setItem(this.formStorageKey, JSON.stringify(data));
    } catch {}
  }

  getSavedFormData(): any | null {
    try {
      const saved = localStorage.getItem(this.formStorageKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  generateHoroscope(req: HoroscopeGenerateRequest): Observable<HoroscopeResponse> {
    this.isGenerating.set(true);
    this.error.set(null);

    return this.http.post<HoroscopeResponse>(`${this.apiUrl}/horoscope/generate`, req).pipe(
      tap({
        next: (res) => {
          this.currentHoroscope.set(res);
          this.isGenerating.set(false);
          try {
            localStorage.setItem(this.storageKey, JSON.stringify(res));
          } catch {}
        },
        error: (err) => {
          this.isGenerating.set(false);
          const msg = err.error?.detail || 'Failed to generate horoscope. Please check birth details.';
          this.error.set(msg);
        }
      })
    );
  }

  clear(): void {
    this.currentHoroscope.set(null);
    this.error.set(null);
    try {
      localStorage.removeItem(this.storageKey);
    } catch {}
  }

  resetAll(): void {
    this.clear();
    try {
      localStorage.removeItem(this.formStorageKey);
    } catch {}
  }
}
