import { Component, OnInit, OnDestroy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ReadingJourneyService } from '../../../core/services/reading-journey.service';
import { GuidanceService } from '../../../core/services/guidance.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslationService } from '../../../core/services/translation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Guidance } from '../../../core/models/guidance.model';

@Component({
  selector: 'app-reading-question',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './reading-question.component.html',
  styleUrl: './reading-question.component.scss'
})
export class ReadingQuestionComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly journeyService = inject(ReadingJourneyService);
  private readonly guidanceService = inject(GuidanceService);
  private readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  private readonly authService = inject(AuthService);

  readonly t = this.translationService.t;
  readonly selectedTopic = this.journeyService.selectedTopic;
  readonly currentQuestion = signal<string>('');
  readonly isSubmitting = signal<boolean>(false);
  readonly loadingPhaseIndex = signal<number>(0);
  readonly errorMessage = signal<string | null>(null);

  readonly currentLanguageName = this.languageService.currentLanguageName;
  readonly suggestions = this.journeyService.suggestedQuestionsForLanguage;
  readonly loadingMessages = computed(() => this.t().readingQuestion.loadingMessages);

  private phaseInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Keep currentQuestion in sync when journeyService updates default suggestion on language switch
    effect(() => {
      const journeyQ = this.journeyService.currentQuestion();
      if (journeyQ && (!this.currentQuestion() || this.suggestions().includes(this.currentQuestion()))) {
        this.currentQuestion.set(journeyQ);
      }
    });
  }

  ngOnInit(): void {
    const existing = this.journeyService.currentQuestion();
    if (existing) {
      this.currentQuestion.set(existing);
    } else {
      const list = this.suggestions();
      if (list.length > 0) {
        this.currentQuestion.set(list[0]);
      }
    }
  }

  ngOnDestroy(): void {
    this.stopLoadingInterval();
  }

  selectSuggestion(question: string): void {
    this.currentQuestion.set(question);
    this.errorMessage.set(null);
  }

  private startLoadingInterval(): void {
    this.loadingPhaseIndex.set(0);
    this.phaseInterval = setInterval(() => {
      const total = this.loadingMessages().length || 3;
      this.loadingPhaseIndex.update(idx => (idx + 1) % total);
    }, 1800);
  }

  private stopLoadingInterval(): void {
    if (this.phaseInterval) {
      clearInterval(this.phaseInterval);
      this.phaseInterval = null;
    }
  }

  onSubmit(): void {
    const questionText = this.currentQuestion().trim();
    if (!questionText || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.journeyService.setQuestion(questionText);
    this.startLoadingInterval();

    const currentLang = this.languageService.currentLanguage();
    const currentUser = this.authService.currentUser();

    // Ensure backend user language matches frontend selection so Gemini translates to user's desired language
    if (this.authService.isAuthenticated() && currentLang?.id && currentUser?.language_id !== currentLang.id) {
      this.languageService.updateUserLanguage(currentLang.id).subscribe({
        next: () => {
          this.authService.updateCurrentUserLanguage(currentLang.id);
          this.executeGuidanceSubmission(questionText);
        },
        error: () => {
          this.executeGuidanceSubmission(questionText);
        }
      });
    } else {
      this.executeGuidanceSubmission(questionText);
    }
  }

  private executeGuidanceSubmission(questionText: string): void {
    this.guidanceService.createGuidance({
      problem: questionText,
      language: this.languageService.currentLanguageName()
    }).subscribe({
      next: (response: Guidance) => {
        this.stopLoadingInterval();
        this.isSubmitting.set(false);
        this.journeyService.setGuidanceResult(response);
        this.router.navigate(['/reading/result'], {
          state: { guidance: response }
        });
      },
      error: (err) => {
        this.stopLoadingInterval();
        this.isSubmitting.set(false);
        if (err.status === 404) {
          const detail = err.error?.detail || '';
          this.errorMessage.set(typeof detail === 'string' && detail ? detail : 'Birth details not found. Please add your birth details first.');
        } else if (err.status === 400) {
          this.errorMessage.set(
            typeof err.error?.detail === 'string'
              ? err.error.detail
              : 'Astrology calculation could not be completed with the provided birth details.'
          );
        } else if (err.status === 502) {
          this.errorMessage.set(
            'Astrology analysis succeeded, but the guidance explanation service is temporarily unavailable. Please try again.'
          );
        } else {
          this.errorMessage.set(this.authService.formatErrorMessage(err));
        }
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/reading/prepare']);
  }
}
