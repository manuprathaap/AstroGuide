import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirthDetailsComponent } from './birth-details.component';
import { BirthDetailService } from '../../core/services/birth-detail.service';
import { AuthService } from '../../core/services/auth.service';
import { ReadingJourneyService } from '../../core/services/reading-journey.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BirthDetail, BirthPlaceSearchResponse } from '../../core/models/birth-detail.model';

describe('BirthDetailsComponent', () => {
  let component: BirthDetailsComponent;
  let fixture: ComponentFixture<BirthDetailsComponent>;
  let birthDetailService: BirthDetailService;

  const mockExistingDetails: BirthDetail = {
    id: 1,
    date_of_birth: '1995-05-15',
    time_of_birth: '14:30:00',
    place_of_birth: 'Kochi, Kerala, India',
    latitude: 9.9312,
    longitude: 76.2673,
    timezone: 'Asia/Kolkata'
  };

  const mockSearchResults: BirthPlaceSearchResponse = {
    results: [
      {
        place_name: 'Kochi',
        formatted_address: 'Kochi, Kerala, India',
        latitude: 9.9312,
        longitude: 76.2673,
        timezone: 'Asia/Kolkata',
        country: 'India'
      },
      {
        place_name: 'Thrissur',
        formatted_address: 'Thrissur, Kerala, India',
        latitude: 10.5276,
        longitude: 76.2144,
        timezone: 'Asia/Kolkata',
        country: 'India'
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthDetailsComponent],
      providers: [
        BirthDetailService,
        AuthService,
        ReadingJourneyService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    birthDetailService = TestBed.inject(BirthDetailService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function createComponent(existingData: BirthDetail | null = null) {
    if (existingData) {
      vi.spyOn(birthDetailService, 'getBirthDetails').mockReturnValue(of(existingData));
    } else {
      vi.spyOn(birthDetailService, 'getBirthDetails').mockReturnValue(throwError(() => ({ status: 404 })));
    }
    fixture = TestBed.createComponent(BirthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create and load empty form when no existing details (404)', () => {
    createComponent(null);
    expect(component).toBeTruthy();
    expect(component.isExisting()).toBe(false);
    expect(component.birthForm.get('timezone')?.value).toBe('Asia/Kolkata');
  });

  it('should load existing details into form and view state', () => {
    createComponent(mockExistingDetails);
    expect(component.isExisting()).toBe(true);
    expect(component.birthForm.get('place_of_birth')?.value).toBe('Kochi, Kerala, India');
    expect(component.birthForm.get('latitude')?.value).toBe(9.9312);
    expect(component.birthForm.get('longitude')?.value).toBe(76.2673);
  });

  describe('Place Autocomplete Search', () => {
    beforeEach(() => {
      createComponent(null);
    });

    it('should search places after debounce for queries >= 2 characters', () => {
      vi.useFakeTimers();
      const searchSpy = vi.spyOn(birthDetailService, 'searchBirthPlaces').mockReturnValue(of(mockSearchResults));

      component.onPlaceInput({ target: { value: 'Ko' } } as unknown as Event);
      vi.advanceTimersByTime(200);
      expect(searchSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200); // Total 400ms > 350ms debounce
      expect(searchSpy).toHaveBeenCalledWith('Ko');
      expect(component.placeSuggestions().length).toBe(2);
      expect(component.showPlaceDropdown()).toBe(true);
      expect(component.isSearchingPlaces()).toBe(false);
    });

    it('should not search when input has fewer than 2 characters or is empty', () => {
      vi.useFakeTimers();
      const searchSpy = vi.spyOn(birthDetailService, 'searchBirthPlaces').mockReturnValue(of(mockSearchResults));

      component.onPlaceInput({ target: { value: 'K' } } as unknown as Event);
      vi.advanceTimersByTime(400);
      expect(searchSpy).not.toHaveBeenCalled();
      expect(component.placeSuggestions().length).toBe(0);
      expect(component.showPlaceDropdown()).toBe(false);

      component.onPlaceInput({ target: { value: '' } } as unknown as Event);
      vi.advanceTimersByTime(400);
      expect(searchSpy).not.toHaveBeenCalled();
      expect(component.placeSuggestions().length).toBe(0);
    });

    it('should set place_of_birth, latitude, longitude, and timezone when selecting a place result', () => {
      const selected = mockSearchResults.results[0];
      component.selectPlace(selected);

      expect(component.birthForm.get('place_of_birth')?.value).toBe('Kochi, Kerala, India');
      expect(component.birthForm.get('latitude')?.value).toBe(9.9312);
      expect(component.birthForm.get('longitude')?.value).toBe(76.2673);
      expect(component.birthForm.get('timezone')?.value).toBe('Asia/Kolkata');
      expect(component.selectedPlace()).toEqual(selected);
      expect(component.showPlaceDropdown()).toBe(false);
    });

    it('should clear coordinates and timezone if the user manually edits the place input after selection', () => {
      const selected = mockSearchResults.results[0];
      component.selectPlace(selected);
      expect(component.birthForm.get('latitude')?.value).toBe(9.9312);
      expect(component.birthForm.get('timezone')?.value).toBe('Asia/Kolkata');

      // User types a backspace or new character
      component.onPlaceInput({ target: { value: 'Kochi, Kerala' } } as unknown as Event);

      expect(component.birthForm.get('latitude')?.value).toBeNull();
      expect(component.birthForm.get('longitude')?.value).toBeNull();
      expect(component.birthForm.get('timezone')?.value).toBeNull();
      expect(component.selectedPlace()).toBeNull();
    });

    it('should handle API errors gracefully (503 / 502 / 401 / 403) without raw backend error', () => {
      vi.useFakeTimers();
      vi.spyOn(birthDetailService, 'searchBirthPlaces').mockReturnValue(
        throwError(() => ({ status: 503, statusText: 'Service Unavailable' }))
      );

      component.onPlaceInput({ target: { value: 'Bangalore' } } as unknown as Event);
      vi.advanceTimersByTime(400);

      expect(component.isSearchingPlaces()).toBe(false);
      expect(component.placeSuggestions().length).toBe(0);
      expect(component.showPlaceDropdown()).toBe(true);
      expect(component.placeSearchError()).toBe('Location service is temporarily unavailable. Please try again in a moment.');
    });

    it('should show "No places found" state when results array is empty', () => {
      vi.useFakeTimers();
      vi.spyOn(birthDetailService, 'searchBirthPlaces').mockReturnValue(
        of({ results: [] })
      );

      component.onPlaceInput({ target: { value: 'UnknownPlaceXYZ' } } as unknown as Event);
      vi.advanceTimersByTime(400);

      expect(component.isSearchingPlaces()).toBe(false);
      expect(component.placeSuggestions().length).toBe(0);
      expect(component.hasSearched()).toBe(true);
      expect(component.showPlaceDropdown()).toBe(true);
    });

    it('should support keyboard navigation: ArrowDown, ArrowUp, Enter, and Escape', () => {
      component.placeSuggestions.set(mockSearchResults.results);
      component.showPlaceDropdown.set(true);

      // ArrowDown
      component.onPlaceKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(component.highlightedIndex()).toBe(0);

      // ArrowDown again
      component.onPlaceKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(component.highlightedIndex()).toBe(1);

      // ArrowUp
      component.onPlaceKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(component.highlightedIndex()).toBe(0);

      // Enter selects highlighted
      component.onPlaceKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(component.birthForm.get('place_of_birth')?.value).toBe('Kochi, Kerala, India');
      expect(component.birthForm.get('latitude')?.value).toBe(9.9312);
      expect(component.showPlaceDropdown()).toBe(false);

      // Escape closes dropdown
      component.showPlaceDropdown.set(true);
      component.onPlaceKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(component.showPlaceDropdown()).toBe(false);
    });

    it('should persist selected coordinates when saving the form', () => {
      const createSpy = vi.spyOn(birthDetailService, 'createBirthDetails').mockReturnValue(
        of({ ...mockExistingDetails, id: 2 })
      );

      component.birthForm.patchValue({
        date_of_birth: '1998-08-20',
        time_of_birth: '10:15',
        place_of_birth: 'Thrissur, Kerala, India',
        latitude: 10.5276,
        longitude: 76.2144,
        timezone: 'Asia/Kolkata'
      });

      component.onSubmit();

      expect(createSpy).toHaveBeenCalledWith({
        date_of_birth: '1998-08-20',
        time_of_birth: '10:15:00',
        place_of_birth: 'Thrissur, Kerala, India',
        latitude: 10.5276,
        longitude: 76.2144,
        timezone: 'Asia/Kolkata'
      });
    });
  });
});
