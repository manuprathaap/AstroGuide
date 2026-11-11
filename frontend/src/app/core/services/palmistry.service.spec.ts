import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PalmAnalysisRequest, PalmAnalysisResponse } from '../models/palmistry.model';
import { environment } from '../../../environments/environment';
import { PalmistryService } from './palmistry.service';

describe('PalmistryService', () => {
  let service: PalmistryService;
  let httpMock: HttpTestingController;

  const request: PalmAnalysisRequest = {
    name: 'Seeker',
    gender: 'Male',
    dominant_hand: 'Right',
    language: 'English',
  };
  const response: PalmAnalysisResponse = {
    id: 'reading-1',
    analyzed_at: '2026-01-01T00:00:00Z',
    native_name: 'Seeker',
    gender: 'Male',
    dominant_hand: 'Right',
    language: 'English',
    hand_constitution: {
      element: 'Air',
      element_description: 'Balanced',
      palm_shape: 'Square',
      finger_proportions: 'Balanced',
      vitality_index: 80,
    },
    prarabdha_vs_purushartha_summary: 'Summary',
    major_lines: [],
    planetary_mounts: [],
    special_signs: [],
    life_predictions: {},
    sacred_remedies: [],
    gemstone_recommendations: [],
  };

  beforeEach(() => {
    localStorage.removeItem('astroguide_current_palm_reading');
    localStorage.removeItem('astroguide_palm_guest_token');
    TestBed.configureTestingModule({
      providers: [
        PalmistryService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PalmistryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('stores the signed guest token and sends it with the next analysis', () => {
    service.analyzePalm(request).subscribe();
    const first = httpMock.expectOne(`${environment.apiUrl}/palmistry/analyze`);
    expect(first.request.headers.has('X-Palm-Guest-Token')).toBe(false);
    first.flush(response, {
      headers: new HttpHeaders({ 'X-Palm-Guest-Token': 'signed-guest-token' }),
    });

    expect(localStorage.getItem('astroguide_palm_guest_token')).toBe(
      'signed-guest-token',
    );

    service.analyzePalm(request).subscribe();
    const second = httpMock.expectOne(`${environment.apiUrl}/palmistry/analyze`);
    expect(second.request.headers.get('X-Palm-Guest-Token')).toBe(
      'signed-guest-token',
    );
    second.flush(response);
  });

  it('keeps the sample analysis public without sending a guest token', () => {
    localStorage.setItem('astroguide_palm_guest_token', 'signed-guest-token');
    service.getSampleAnalysis().subscribe();

    const sample = httpMock.expectOne(
      `${environment.apiUrl}/palmistry/sample?language=English`,
    );
    expect(sample.request.method).toBe('GET');
    expect(sample.request.headers.has('X-Palm-Guest-Token')).toBe(false);
    sample.flush(response);
  });
});
