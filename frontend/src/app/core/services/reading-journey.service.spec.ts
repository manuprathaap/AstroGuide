import { TestBed } from '@angular/core/testing';
import { ReadingJourneyService } from './reading-journey.service';
import { LanguageService } from './language.service';
import { BirthDetailService } from './birth-detail.service';
import { GuidanceService } from './guidance.service';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('ReadingJourneyService', () => {
  let service: ReadingJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReadingJourneyService,
        LanguageService,
        BirthDetailService,
        GuidanceService,
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    service = TestBed.inject(ReadingJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have 8 guided topics defined matching backend question types', () => {
    expect(service.availableTopics.length).toBe(8);
    const topicIds = service.availableTopics.map(t => t.id);
    expect(topicIds).toContain('Marriage');
    expect(topicIds).toContain('Career');
    expect(topicIds).toContain('Money / Finance');
  });

  it('should update topic and set question suggestions accordingly', () => {
    service.setTopic('Career');
    expect(service.selectedTopic()).toBe('Career');
    expect(service.currentQuestion()).toContain('career');
  });

  it('should store guidance result and extract reading and analysis', () => {
    const mockGuidance = {
      id: 1,
      user_id: 1,
      problem: 'Ente kalyanam eppol nadakkum?',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message: 'Marriage is indicated in 2027-2028',
      analysis: {
        seventh_house_sign: 'Taurus',
        seventh_house_lord: 'Venus',
        factors: [],
        timing_windows: []
      }
    };

    service.setGuidanceResult(mockGuidance);
    expect(service.readingResult()).toBe('Marriage is indicated in 2027-2028');
    expect(service.astrologyAnalysis()?.seventh_house_sign).toBe('Taurus');
  });
});
