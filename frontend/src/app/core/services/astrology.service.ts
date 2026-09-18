import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AstrologyChartResult, AstrologyMarriageAnalysis } from '../models/astrology.model';

export interface MarriageAnalysisResponse {
  analysis: AstrologyMarriageAnalysis;
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class AstrologyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Fetch complete calculated Vedic birth chart for current authenticated user.
   * NOTE: Calculation is performed entirely on backend Python Vedic engine.
   */
  getBirthChart(): Observable<AstrologyChartResult> {
    return this.http.get<AstrologyChartResult>(`${this.apiUrl}/astrology/birth-chart`);
  }

  /**
   * Run marriage timing analysis for current authenticated user.
   * Returns calculated analysis along with Gemini natural language explanation.
   */
  analyzeMarriage(): Observable<MarriageAnalysisResponse> {
    return this.http.post<MarriageAnalysisResponse>(`${this.apiUrl}/astrology/analyze-marriage`, {});
  }
}
