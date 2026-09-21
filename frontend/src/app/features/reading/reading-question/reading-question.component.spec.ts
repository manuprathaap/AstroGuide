import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadingQuestionComponent } from './reading-question.component';
import { ReadingJourneyService } from '../../../core/services/reading-journey.service';
import { GuidanceService } from '../../../core/services/guidance.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Guidance } from '../../../core/models/guidance.model';

describe('ReadingQuestionComponent', () => {
  let component: ReadingQuestionComponent;
  let fixture: ComponentFixture<ReadingQuestionComponent>;
  let guidanceService: GuidanceService;
  let journeyService: ReadingJourneyService;
  let router: Router;

  const mockGuidanceResponse: Guidance = {
    id: 102,
    user_id: 1,
    problem: 'How will my career progress in the coming years?',
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-18T10:00:00Z',
    category: 'CAREER',
    supported: false,
    message: 'Astrology analysis for CAREER is not supported yet.',
    analysis: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingQuestionComponent],
      providers: [
        ReadingJourneyService,
        GuidanceService,
        LanguageService,
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    guidanceService = TestBed.inject(GuidanceService);
    journeyService = TestBed.inject(ReadingJourneyService);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(ReadingQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ReadingQuestionComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call guidanceService.createGuidance with actual question text on submit', () => {
    const createSpy = vi.spyOn(guidanceService, 'createGuidance').mockReturnValue(of(mockGuidanceResponse));
    const navSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.currentQuestion.set('How will my career progress in the coming years?');
    component.onSubmit();

    expect(createSpy).toHaveBeenCalledWith({
      problem: 'How will my career progress in the coming years?',
      language: 'English'
    });
    expect(navSpy).toHaveBeenCalledWith(['/reading/result'], {
      state: { guidance: mockGuidanceResponse }
    });
    expect(journeyService.lastGuidance()?.id).toBe(102);
  });

  it('should display appropriate error message if backend returns 404 birth details missing', () => {
    vi.spyOn(guidanceService, 'createGuidance').mockReturnValue(
      throwError(() => ({
        status: 404,
        error: { detail: 'Birth details not found. Please add your birth details first.' }
      }))
    );

    component.currentQuestion.set('Ente kalyanam eppol nadakkum?');
    component.onSubmit();

    expect(component.errorMessage()).toBe('Birth details not found. Please add your birth details first.');
    expect(component.isSubmitting()).toBe(false);
  });
});
