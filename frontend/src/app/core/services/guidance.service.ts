import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Guidance, GuidanceCreate, GuidanceUpdate } from '../models/guidance.model';

@Injectable({
  providedIn: 'root'
})
export class GuidanceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Create a new guidance request with user's problem description.
   * Note: The backend automatically identifies current_user from the JWT Bearer token.
   */
  createGuidance(data: GuidanceCreate): Observable<Guidance> {
    return this.http.post<Guidance>(`${this.apiUrl}/guidance`, data);
  }

  /**
   * Fetch all past guidance inquiries for the authenticated user.
   */
  getGuidanceHistory(): Observable<Guidance[]> {
    return this.http.get<Guidance[]>(`${this.apiUrl}/guidance`);
  }

  /**
   * Update an existing guidance problem record.
   */
  updateGuidance(id: number, data: GuidanceUpdate): Observable<Guidance> {
    return this.http.put<Guidance>(`${this.apiUrl}/guidance/${id}`, data);
  }

  /**
   * Delete a guidance record by ID.
   */
  deleteGuidance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/guidance/${id}`);
  }
}
