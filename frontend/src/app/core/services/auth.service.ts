import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'access_token';
  private readonly languageStorageKey = 'astroguide_user_language_id';

  // Reactive State using Angular Signals
  readonly currentUser = signal<User | null>(null);
  readonly hasToken = signal<boolean>(!!this.getToken());
  readonly isAuthenticated = computed(() => this.hasToken());

  constructor() {
    // If token exists on app initialization, fetch user profile
    if (this.getToken()) {
      this.getMe().subscribe({
        error: () => {
          this.removeToken();
          this.currentUser.set(null);
          this.hasToken.set(false);
        }
      });
    }
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.hasToken.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.hasToken.set(false);
  }

  saveLanguageId(languageId: number): void {
    localStorage.setItem(this.languageStorageKey, languageId.toString());
  }

  getSavedLanguageId(): number | null {
    const val = localStorage.getItem(this.languageStorageKey);
    return val ? parseInt(val, 10) : null;
  }

  removeLanguageId(): void {
    localStorage.removeItem(this.languageStorageKey);
  }

  register(payload: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, payload);
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap((res) => {
        if (res?.access_token) {
          this.saveToken(res.access_token);
        }
      })
    );
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`).pipe(
      tap((user) => {
        const savedLangId = this.getSavedLanguageId();
        const effectiveLangId = user.language_id ?? savedLangId;
        const resolvedUser: User = {
          ...user,
          language_id: effectiveLangId
        };
        if (effectiveLangId) {
          this.saveLanguageId(effectiveLangId);
        }
        this.currentUser.set(resolvedUser);
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.removeLanguageId();
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  updateCurrentUserLanguage(languageId: number): void {
    this.saveLanguageId(languageId);
    const current = this.currentUser();
    if (current) {
      this.currentUser.set({
        ...current,
        language_id: languageId
      });
    }
  }

  /**
   * Helper to format FastAPI error responses into human-friendly strings
   */
  formatErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Unable to connect to the AstroGuide server. Please check your connection or backend server.';
      }

      if (error.error) {
        const errObj = error.error;
        if (typeof errObj.detail === 'string') {
          return errObj.detail;
        }
        if (Array.isArray(errObj.detail)) {
          // FastAPI Pydantic validation error array
          return errObj.detail.map((d: { msg?: string }) => d.msg || 'Invalid field').join(', ');
        }
        if (typeof errObj.message === 'string') {
          return errObj.message;
        }
      }

      switch (error.status) {
        case 400:
          return 'Invalid request. Please verify your information.';
        case 401:
          return 'Invalid email or password. Please try again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'Resource not found.';
        case 422:
          return 'Validation error. Please verify the input values.';
        case 500:
          return 'An unexpected server error occurred. Please try again later.';
        default:
          return `Error: ${error.statusText || 'Operation failed'}`;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }
}
