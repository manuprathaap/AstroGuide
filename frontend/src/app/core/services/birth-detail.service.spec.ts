import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BirthDetailService } from './birth-detail.service';
import { BirthDetail, BirthDetailCreate, BirthDetailUpdate, BirthPlaceSearchResponse } from '../models/birth-detail.model';
import { environment } from '../../../environments/environment';

describe('BirthDetailService', () => {
  let service: BirthDetailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BirthDetailService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(BirthDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchBirthPlaces', () => {
    it('should query GET /api/v1/birth-details/places/search with query param', () => {
      const mockResponse: BirthPlaceSearchResponse = {
        results: [
          {
            place_name: 'Kochi',
            formatted_address: 'Kochi, Kerala, India',
            latitude: 9.9312,
            longitude: 76.2673,
            timezone: 'Asia/Kolkata',
            country: 'India'
          }
        ]
      };

      service.searchBirthPlaces('Kochi').subscribe(res => {
        expect(res).toEqual(mockResponse);
        expect(res.results.length).toBe(1);
        expect(res.results[0].place_name).toBe('Kochi');
        expect(res.results[0].formatted_address).toBe('Kochi, Kerala, India');
        expect(res.results[0].latitude).toBe(9.9312);
        expect(res.results[0].longitude).toBe(76.2673);
        expect(res.results[0].timezone).toBe('Asia/Kolkata');
        expect(res.results[0].country).toBe('India');
      });

      const req = httpMock.expectOne(request => 
        request.url === `${environment.apiUrl}/birth-details/places/search` &&
        request.params.get('query') === 'Kochi'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should query multiple places like Bangalore and Thrissur', () => {
      const mockResponse: BirthPlaceSearchResponse = {
        results: [
          {
            place_name: 'Bangalore',
            formatted_address: 'Bengaluru, Karnataka, India',
            latitude: 12.9716,
            longitude: 77.5946,
            timezone: 'Asia/Kolkata',
            country: 'India'
          }
        ]
      };

      service.searchBirthPlaces('Bangalore').subscribe(res => {
        expect(res.results[0].place_name).toBe('Bangalore');
      });

      const req = httpMock.expectOne(request => 
        request.url === `${environment.apiUrl}/birth-details/places/search` &&
        request.params.get('query') === 'Bangalore'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getBirthDetails', () => {
    it('should fetch birth details via GET /api/v1/birth-details', () => {
      const mockDetail: BirthDetail = {
        id: 1,
        date_of_birth: '1995-05-15',
        time_of_birth: '14:30:00',
        place_of_birth: 'Kochi, Kerala, India',
        latitude: 9.9312,
        longitude: 76.2673,
        timezone: 'Asia/Kolkata'
      };

      service.getBirthDetails().subscribe(detail => {
        expect(detail).toEqual(mockDetail);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/birth-details`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDetail);
    });
  });

  describe('createBirthDetails', () => {
    it('should create birth details via POST /api/v1/birth-details', () => {
      const payload: BirthDetailCreate = {
        date_of_birth: '1995-05-15',
        time_of_birth: '14:30:00',
        place_of_birth: 'Kochi, Kerala, India',
        latitude: 9.9312,
        longitude: 76.2673,
        timezone: 'Asia/Kolkata'
      };

      service.createBirthDetails(payload).subscribe(detail => {
        expect(detail.id).toBe(1);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/birth-details`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush({ ...payload, id: 1 });
    });
  });

  describe('updateBirthDetails', () => {
    it('should update birth details via PUT /api/v1/birth-details', () => {
      const payload: BirthDetailUpdate = {
        place_of_birth: 'Thrissur, Kerala, India',
        latitude: 10.5276,
        longitude: 76.2144
      };

      service.updateBirthDetails(payload).subscribe(detail => {
        expect(detail.place_of_birth).toBe('Thrissur, Kerala, India');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/birth-details`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush({
        id: 1,
        date_of_birth: '1995-05-15',
        time_of_birth: '14:30:00',
        place_of_birth: 'Thrissur, Kerala, India',
        latitude: 10.5276,
        longitude: 76.2144,
        timezone: 'Asia/Kolkata'
      });
    });
  });

  describe('deleteBirthDetails', () => {
    it('should delete birth details via DELETE /api/v1/birth-details', () => {
      service.deleteBirthDetails().subscribe(res => {
        expect(res).toBeNull();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/birth-details`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
