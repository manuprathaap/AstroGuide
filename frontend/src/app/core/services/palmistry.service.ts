import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PalmAnalysisRequest, PalmAnalysisResponse } from '../models/palmistry.model';

@Injectable({
  providedIn: 'root'
})
export class PalmistryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly storageKey = 'astroguide_current_palm_reading';
  private readonly guestTokenKey = 'astroguide_palm_guest_token';

  readonly currentReading = signal<PalmAnalysisResponse | null>(this.getStoredReading());
  readonly isAnalyzing = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  private getStoredReading(): PalmAnalysisResponse | null {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  saveReading(data: PalmAnalysisResponse | null): void {
    this.currentReading.set(data);
    if (data) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch {}
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  analyzePalm(req: PalmAnalysisRequest): Observable<PalmAnalysisResponse> {
    this.isAnalyzing.set(true);
    this.error.set(null);

    return this.postGuestAnalysis(
      `${this.apiUrl}/palmistry/analyze`,
      req,
    ).pipe(
      tap({
        next: (res) => {
          this.isAnalyzing.set(false);
          this.saveReading(res);
        },
        error: (err) => {
          this.isAnalyzing.set(false);
          const msg = err.error?.detail || 'Failed to complete palm analysis. Please try again.';
          this.error.set(msg);
        }
      })
    );
  }

  uploadAndAnalyze(formData: FormData): Observable<PalmAnalysisResponse> {
    this.isAnalyzing.set(true);
    this.error.set(null);

    return this.postGuestAnalysis(
      `${this.apiUrl}/palmistry/upload-and-analyze`,
      formData,
    ).pipe(
      tap({
        next: (res) => {
          this.isAnalyzing.set(false);
          this.saveReading(res);
        },
        error: (err) => {
          this.isAnalyzing.set(false);
          const msg = err.error?.detail || 'Failed to upload and analyze photos.';
          this.error.set(msg);
        }
      })
    );
  }

  getSampleAnalysis(language: string = 'English'): Observable<PalmAnalysisResponse> {
    this.isAnalyzing.set(true);
    this.error.set(null);

    return this.http.get<PalmAnalysisResponse>(`${this.apiUrl}/palmistry/sample?language=${encodeURIComponent(language)}`).pipe(
      tap({
        next: (res) => {
          this.isAnalyzing.set(false);
          this.saveReading(res);
        },
        error: (err) => {
          this.isAnalyzing.set(false);
          const msg = err.error?.detail || 'Could not load sample palm reading.';
          this.error.set(msg);
        }
      })
    );
  }

  clear(): void {
    this.saveReading(null);
    this.error.set(null);
  }

  private postGuestAnalysis(
    url: string,
    body: PalmAnalysisRequest | FormData,
  ): Observable<PalmAnalysisResponse> {
    const token = localStorage.getItem(this.guestTokenKey);
    const headers = token
      ? new HttpHeaders({ 'X-Palm-Guest-Token': token })
      : new HttpHeaders();

    return this.http.post<PalmAnalysisResponse>(url, body, {
      headers,
      observe: 'response',
    }).pipe(
      map((response: HttpResponse<PalmAnalysisResponse>) => {
        const nextToken = response.headers.get('X-Palm-Guest-Token');
        if (nextToken) {
          localStorage.setItem(this.guestTokenKey, nextToken);
        }

        if (!response.body) {
          throw new Error('Palm analysis returned an empty response.');
        }
        return response.body;
      }),
    );
  }
}
