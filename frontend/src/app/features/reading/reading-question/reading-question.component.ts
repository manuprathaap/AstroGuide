import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ReadingJourneyService } from '../../../core/services/reading-journey.service';
import { GuidanceService } from '../../../core/services/guidance.service';
import { LanguageService } from '../../../core/services/language.service';
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

  readonly selectedTopic = this.journeyService.selectedTopic;
  readonly currentQuestion = signal<string>('');
  readonly isSubmitting = signal<boolean>(false);
  readonly loadingPhaseIndex = signal<number>(0);
  readonly errorMessage = signal<string | null>(null);

  readonly currentLanguageName = this.languageService.currentLanguageName;
  readonly suggestions = this.journeyService.suggestedQuestionsForLanguage;

  readonly loadingMessages = [
    'Understanding your reading...',
    'Looking at your chart...',
    'Preparing your guidance...'
  ];

  private phaseInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Initialize question from journey service or default suggestion
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
      this.loadingPhaseIndex.update(idx => (idx + 1) % this.loadingMessages.length);
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

    this.guidanceService.createGuidance({ problem: questionText }).subscribe({
      next: (response: Guidance) => {
        this.stopLoadingInterval();
        this.isSubmitting.set(false);
        this.journeyService.setGuidanceResult(response);
        this.router.navigate(['/reading/result']);
      },
      error: (err) => {
        this.stopLoadingInterval();
        this.isSubmitting.set(false);
        if (err.status === 404) {
          this.errorMessage.set('Please check your birth details and try again.');
        } else {
          this.errorMessage.set("We couldn't prepare your reading right now. Please try again.");
        }
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/reading/prepare']);
  }
}
