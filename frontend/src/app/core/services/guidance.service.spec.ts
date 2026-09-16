import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { GuidanceService } from './guidance.service';
import { Guidance, GuidanceCreate, GuidanceUpdate } from '../models/guidance.model';
import { environment } from '../../../environments/environment';

describe('GuidanceService', () => {
  let service: GuidanceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GuidanceService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(GuidanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create guidance via POST /api/v1/guidance without sending user_id', () => {
    const requestData: GuidanceCreate = { problem: 'I need career guidance regarding a job switch.' };
    const mockResponse: Guidance = {
      id: 101,
      user_id: 1,
      problem: 'I need career guidance regarding a job switch.',
      created_at: '2026-09-05T01:00:00Z',
      updated_at: '2026-09-05T01:00:00Z'
    };

    service.createGuidance(requestData).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.id).toBe(101);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/guidance`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ problem: 'I need career guidance regarding a job switch.' });
    expect(req.request.body.user_id).toBeUndefined();
    req.flush(mockResponse);
  });

  it('should fetch guidance history via GET /api/v1/guidance', () => {
    const mockList: Guidance[] = [
      {
        id: 1,
        user_id: 1,
        problem: 'First problem statement test',
        created_at: '2026-09-01T10:00:00Z',
        updated_at: '2026-09-01T10:00:00Z'
      },
      {
        id: 2,
        user_id: 1,
        problem: 'Second problem statement test',
        created_at: '2026-09-02T12:00:00Z',
        updated_at: '2026-09-02T12:00:00Z'
      }
    ];

    service.getGuidanceHistory().subscribe(list => {
      expect(list.length).toBe(2);
      expect(list[0].id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/guidance`);
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('should update guidance via PUT /api/v1/guidance/{id}', () => {
    const updateData: GuidanceUpdate = { problem: 'Updated problem description.' };
    const mockResponse: Guidance = {
      id: 5,
      user_id: 1,
      problem: 'Updated problem description.',
      created_at: '2026-09-01T10:00:00Z',
      updated_at: '2026-09-05T01:00:00Z'
    };

    service.updateGuidance(5, updateData).subscribe(res => {
      expect(res.problem).toBe('Updated problem description.');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/guidance/5`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  it('should delete guidance via DELETE /api/v1/guidance/{id}', () => {
    service.deleteGuidance(10).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/guidance/10`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
