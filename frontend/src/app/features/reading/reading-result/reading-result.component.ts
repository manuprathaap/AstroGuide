import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { MarkdownPipe } from '../../../shared/pipes/markdown.pipe';
import { ReadingJourneyService, GuidedTopicId } from '../../../core/services/reading-journey.service';
import { GuidanceService } from '../../../core/services/guidance.service';
import { AuthService } from '../../../core/services/auth.service';
import { AstrologyMarriageAnalysis, AstrologyMarriageTimingWindow } from '../../../core/models/astrology.model';

@Component({
  selector: 'app-reading-result',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MarkdownPipe],
  templateUrl: './reading-result.component.html',
  styleUrl: './reading-result.component.scss'
})
export class ReadingResultComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly journeyService = inject(ReadingJourneyService);
  private readonly guidanceService = inject(GuidanceService);
  private readonly authService = inject(AuthService);

  readonly question = this.journeyService.currentQuestion;
  readonly topic = this.journeyService.selectedTopic;
  readonly readingResponse = this.journeyService.readingResult;
  readonly analysis = this.journeyService.astrologyAnalysis;
  readonly birthDetails = this.journeyService.birthDetails;

  // Collapsible Astrology Details toggle (Screen 8)
  readonly showAstrologyDetails = signal<boolean>(false);

  // Active Category Tab for Screen 12 (Career & Life Guidance)
  readonly activeCategoryTab = signal<GuidedTopicId>('Career');

  readonly categoryTabs: { id: GuidedTopicId; label: string; icon: string }[] = [
    { id: 'Career', label: 'Career', icon: '💼' },
    { id: 'Money / Finance', label: 'Money', icon: '💰' },
    { id: 'Relationships', label: 'Relationships', icon: '💕' },
    { id: 'Family', label: 'Family', icon: '🏡' },
    { id: 'Travel / Abroad', label: 'Travel', icon: '✈️' },
    { id: 'Health / Wellness', label: 'Health', icon: '🌿' },
    { id: 'General Guidance', label: 'Personal Growth', icon: '✦' }
  ];

  // Timing Windows extracted from backend analysis (Screen 9)
  readonly timingWindows = computed<AstrologyMarriageTimingWindow[]>(() => {
    const ana = this.analysis();
    if (!ana || !ana.timing_windows) {
      return [];
    }
    return ana.timing_windows;
  });

  // Supporting factors extracted from backend analysis
  readonly supportingFactors = computed(() => {
    const ana = this.analysis();
    return ana?.timing?.supporting_factors || [];
  });

  // Caution/Challenging factors extracted from backend analysis
  readonly cautionFactors = computed(() => {
    const ana = this.analysis();
    return ana?.timing?.caution_factors || [];
  });

  // Mock plan details ready for future API integration (Screen 10)
  readonly planStatus = signal({
    planName: 'Personal Seeker Plan',
    readingsRemaining: 'Unlimited basic inquiry access',
    isPremium: true
  });

  // Palm Reading modal / status (Screen 11)
  readonly palmReadingMessage = signal<string | null>(null);

  ngOnInit(): void {
    // If no reading response yet in state, fetch the latest from guidance history or redirect to ask
    if (!this.readingResponse()) {
      this.guidanceService.getGuidanceHistory().subscribe({
        next: (history) => {
          if (history && history.length > 0) {
            const latest = history[0];
            this.journeyService.setGuidanceResult(latest);
            if (latest.problem) {
              this.journeyService.setQuestion(latest.problem);
            }
          } else {
            this.router.navigate(['/reading/question']);
          }
        },
        error: () => {
          this.router.navigate(['/reading/question']);
        }
      });
    }
  }

  toggleAstrologyDetails(): void {
    this.showAstrologyDetails.update(v => !v);
  }

  selectCategoryTab(tabId: GuidedTopicId): void {
    this.activeCategoryTab.set(tabId);
    this.journeyService.setTopic(tabId);
  }

  askNewQuestion(): void {
    this.journeyService.resetJourney();
    this.router.navigate(['/reading/question']);
  }

  analyzePalm(): void {
    // Integration point for future Palm Reading API
    this.palmReadingMessage.set(
      'Palm reading analysis module is initialized. Camera/upload integration point is ready for backend integration.'
    );
    setTimeout(() => {
      this.palmReadingMessage.set(null);
    }, 4500);
  }

  viewHistory(): void {
    this.router.navigate(['/guidance/history']);
  }
}
