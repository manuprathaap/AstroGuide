import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadingResultComponent } from './reading-result.component';
import { ReadingJourneyService } from '../../../core/services/reading-journey.service';
import { GuidanceService } from '../../../core/services/guidance.service';
import { BirthDetailService } from '../../../core/services/birth-detail.service';
import { AuthService } from '../../../core/services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Guidance } from '../../../core/models/guidance.model';

describe('ReadingResultComponent', () => {
  let component: ReadingResultComponent;
  let fixture: ComponentFixture<ReadingResultComponent>;
  let journeyService: ReadingJourneyService;

  const mockGuidance: Guidance = {
    id: 101,
    user_id: 1,
    problem: 'Ente kalyanam eppol nadakkum?',
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-18T10:00:00Z',
    category: 'MARRIAGE_TIMING',
    supported: true,
    message: 'നിങ്ങളുടെ ജാതക വിശകലനം അനുസരിച്ച് ശുക്രന്റെ ദശ അനുകൂലമാണ്.',
    analysis: {
      seventh_house_sign: 'Taurus',
      seventh_house_lord: 'Venus',
      seventh_lord_sign: 'Cancer',
      seventh_lord_house: 9,
      venus_sign: 'Cancer',
      venus_house: 9,
      jupiter_sign: 'Gemini',
      jupiter_house: 8,
      current_mahadasha: 'Venus',
      current_antardasha: 'Jupiter',
      factors: [],
      timing_windows: [
        {
          start: '2026-06-01T00:00:00',
          end: '2027-12-31T00:00:00',
          mahadasha_lord: 'Venus',
          antardasha_lord: 'Jupiter',
          reasons: ['Favorable transit']
        }
      ],
      timing: {
        current_period: null,
        candidate_periods: [],
        supporting_factors: [{ planet: 'Venus', rule: '7th Lord', reason: 'Well placed' }],
        caution_factors: [],
        limitations: []
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingResultComponent],
      providers: [
        ReadingJourneyService,
        GuidanceService,
        BirthDetailService,
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    journeyService = TestBed.inject(ReadingJourneyService);
    journeyService.setGuidanceResult(mockGuidance);

    fixture = TestBed.createComponent(ReadingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ReadingResultComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should accurately expose the AI guidance message and formatted category', () => {
    expect(component.readingResponse()).toBe(mockGuidance.message);
    expect(component.topic()).toBe('Marriage Timing');
    expect(component.question()).toBe('Ente kalyanam eppol nadakkum?');
  });

  it('should render the chat conversation with user and assistant messages', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-bubble .bubble-text')?.textContent).toContain(
      'Ente kalyanam eppol nadakkum?'
    );
    expect(compiled.querySelector('.natural-language-response')?.textContent).toContain(
      'നിങ്ങളുടെ ജാതക വിശകലനം അനുസരിച്ച്'
    );
    expect(compiled.querySelector('.msg-timing-card')?.textContent).toContain('2026 – 2027');
  });

  it('should append follow-up message to conversation and call guidance service without navigating away', () => {
    const guidanceService = TestBed.inject(GuidanceService);
    const followUpResponse: Guidance = {
      id: 102,
      user_id: 1,
      problem: 'Athinte reason enthaanu?',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: 'FOLLOW_UP',
      supported: true,
      message: 'കാരണം ശുക്രൻ ഒൻപതാം ഭാവത്തിൽ നിലകൊള്ളുന്നു.',
      analysis: null
    };

    const createSpy = vi.spyOn(guidanceService, 'createGuidance').mockReturnValue(of(followUpResponse));

    component.inputQuestion.set('Athinte reason enthaanu?');
    component.sendMessage();

    expect(createSpy).toHaveBeenCalledWith({
      problem: 'Athinte reason enthaanu?',
      language: 'English'
    });
    expect(component.messages().length).toBeGreaterThanOrEqual(4); // 2 initial + 2 new (user + assistant)
    expect(component.isTyping()).toBe(false);
  });

  it('should toggle astrology details view when clicked', () => {
    expect(component.showAstrologyDetails()).toBe(false);
    component.toggleAstrologyDetails();
    expect(component.showAstrologyDetails()).toBe(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.astrology-details-body')).toBeTruthy();
  });
});
