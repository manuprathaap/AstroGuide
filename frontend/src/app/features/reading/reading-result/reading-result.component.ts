import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { MarkdownPipe } from '../../../shared/pipes/markdown.pipe';
import { ReadingJourneyService, GuidedTopicId } from '../../../core/services/reading-journey.service';
import { GuidanceService } from '../../../core/services/guidance.service';
import { BirthDetailService } from '../../../core/services/birth-detail.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslationService } from '../../../core/services/translation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Guidance, ChatMessage } from '../../../core/models/guidance.model';
import { AstrologyMarriageAnalysis, AstrologyMarriageTimingWindow } from '../../../core/models/astrology.model';

@Component({
  selector: 'app-reading-result',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, MarkdownPipe],
  templateUrl: './reading-result.component.html',
  styleUrl: './reading-result.component.scss'
})
export class ReadingResultComponent implements OnInit, AfterViewInit {
  @ViewChild('chatScrollArea') private chatScrollArea?: ElementRef<HTMLElement>;

  private readonly router = inject(Router);
  private readonly journeyService = inject(ReadingJourneyService);
  private readonly guidanceService = inject(GuidanceService);
  private readonly birthDetailService = inject(BirthDetailService);
  private readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  private readonly authService = inject(AuthService);

  readonly t = this.translationService.t;

  // Chat Conversation State
  readonly messages = this.journeyService.chatMessages;
  readonly inputQuestion = signal<string>('');
  readonly isTyping = signal<boolean>(false);
  readonly lastError = signal<string | null>(null);
  readonly failedQuestion = signal<string | null>(null);

  // Sidebar Context Signals
  readonly lastGuidance = this.journeyService.lastGuidance;
  readonly question = computed(() => this.lastGuidance()?.problem || this.journeyService.currentQuestion());
  readonly topic = computed(() => this.formatCategory(this.lastGuidance()?.category) || this.journeyService.selectedTopic());
  readonly readingResponse = computed(() => this.lastGuidance()?.message || this.journeyService.readingResult());
  readonly birthDetails = this.journeyService.birthDetails;

  // Latest Astrology Details
  readonly analysis = computed(() => this.lastGuidance()?.analysis as AstrologyMarriageAnalysis || this.journeyService.astrologyAnalysis());
  readonly showAstrologyDetails = signal<boolean>(false);

  // Active Category Tab for Explore
  readonly activeCategoryTab = signal<GuidedTopicId>('Career');
  readonly categoryTabs = computed(() => {
    const tabs = this.t().readingResult.guidanceTabs.tabs;
    return [
      { id: 'Career' as GuidedTopicId, label: tabs.career, icon: '💼' },
      { id: 'Money / Finance' as GuidedTopicId, label: tabs.money, icon: '💰' },
      { id: 'Relationships' as GuidedTopicId, label: tabs.relationships, icon: '💕' },
      { id: 'Family' as GuidedTopicId, label: tabs.family, icon: '🏡' },
      { id: 'Travel / Abroad' as GuidedTopicId, label: tabs.travel, icon: '✈️' },
      { id: 'Health / Wellness' as GuidedTopicId, label: tabs.health, icon: '🌿' },
      { id: 'General Guidance' as GuidedTopicId, label: tabs.growth, icon: '✦' }
    ];
  });

  // Timing Windows extracted from latest analysis
  readonly timingWindows = computed<AstrologyMarriageTimingWindow[]>(() => {
    const ana = this.analysis() as any;
    return ana?.timing_windows || [];
  });

  // Supporting factors extracted from backend analysis
  readonly supportingFactors = computed(() => {
    const ana = this.analysis() as any;
    return ana?.timing?.supporting_factors || [];
  });

  // Caution factors extracted from backend analysis
  readonly cautionFactors = computed(() => {
    const ana = this.analysis() as any;
    return ana?.timing?.caution_factors || [];
  });

  // Plan Details (Screen 10)
  readonly planStatus = computed(() => {
    const pl = this.t().readingResult.plan;
    return {
      planName: pl.name,
      readingsRemaining: pl.remaining,
      isPremium: true
    };
  });

  // Palm Reading modal / status (Screen 11)
  readonly palmReadingMessage = signal<string | null>(null);

  // Suggested Contextual Follow-up Questions
  readonly suggestedFollowUps = computed<string[]>(() => {
    const cat = (this.lastGuidance()?.category || '').toUpperCase();
    const f = this.t().readingResult.followUps;

    if (cat.includes('MARRIAGE')) {
      return f.marriage;
    }
    if (cat.includes('CAREER')) {
      return f.career;
    }
    if (cat.includes('FINANCE')) {
      return f.finance;
    }
    if (cat.includes('TRAVEL') || cat.includes('FOREIGN')) {
      return f.travel;
    }
    return f.general;
  });

  ngOnInit(): void {
    if (history.state?.guidance) {
      this.journeyService.setGuidanceResult(history.state.guidance as Guidance);
    }

    if (!this.birthDetails()) {
      this.birthDetailService.getBirthDetails().subscribe({
        next: (details) => {
          this.journeyService.setBirthDetails(details);
        },
        error: () => {}
      });
    }

    if (this.messages().length === 0) {
      this.guidanceService.getGuidanceHistory().subscribe({
        next: (historyItems) => {
          const valid = (historyItems || []).filter(item => item.message).reverse();
          if (valid.length > 0) {
            const thread: ChatMessage[] = [];
            valid.forEach(item => {
              thread.push({
                id: `user-${item.id}`,
                role: 'user',
                content: item.problem,
                createdAt: item.created_at,
                category: item.category
              });
              const raw = item.analysis as any;
              thread.push({
                id: `assistant-${item.id}`,
                role: 'assistant',
                content: item.message || '',
                createdAt: item.updated_at,
                category: item.category,
                analysis: item.analysis,
                timingWindows: raw?.timing_windows || []
              });
            });
            this.journeyService.setChatMessages(thread);
            this.journeyService.setGuidanceResult(valid[valid.length - 1]);
            this.scrollToBottom();
          }
        },
        error: () => {}
      });
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  sendMessage(customQuestion?: string): void {
    const questionText = (customQuestion || this.inputQuestion()).trim();
    if (!questionText || this.isTyping()) {
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: questionText,
      createdAt: new Date().toISOString()
    };
    this.journeyService.addChatMessage(userMsg);
    this.inputQuestion.set('');
    this.lastError.set(null);
    this.failedQuestion.set(null);
    this.isTyping.set(true);
    this.scrollToBottom();

    const currentLang = this.languageService.currentLanguage();
    const currentUser = this.authService.currentUser();
    if (this.authService.isAuthenticated() && currentLang?.id && currentUser?.language_id !== currentLang.id) {
      this.languageService.updateUserLanguage(currentLang.id).subscribe({
        next: () => {
          this.authService.updateCurrentUserLanguage(currentLang.id);
          this.executeGuidanceCall(questionText);
        },
        error: () => {
          this.executeGuidanceCall(questionText);
        }
      });
    } else {
      this.executeGuidanceCall(questionText);
    }
  }

  private executeGuidanceCall(questionText: string): void {
    this.guidanceService.createGuidance({
      problem: questionText,
      language: this.languageService.currentLanguageName()
    }).subscribe({
      next: (response: Guidance) => {
        this.isTyping.set(false);
        const rawAnalysis = response.analysis as any;
        const assistantMsg: ChatMessage = {
          id: `assistant-${response.id || Date.now()}`,
          role: 'assistant',
          content: response.message || 'Astrology analysis completed for your question.',
          createdAt: response.updated_at || new Date().toISOString(),
          category: response.category,
          analysis: response.analysis,
          timingWindows: rawAnalysis?.timing_windows || []
        };
        this.journeyService.addChatMessage(assistantMsg);
        this.journeyService.setGuidanceResult(response);
        this.scrollToBottom();
      },
      error: () => {
        this.isTyping.set(false);
        this.lastError.set(this.t().readingResult.chat.readingChart || 'Something went wrong while preparing your guidance.');
        this.failedQuestion.set(questionText);
        this.scrollToBottom();
      }
    });
  }

  retryLastQuestion(): void {
    const failed = this.failedQuestion();
    if (failed) {
      this.sendMessage(failed);
    }
  }

  onInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatScrollArea?.nativeElement) {
        this.chatScrollArea.nativeElement.scrollTop = this.chatScrollArea.nativeElement.scrollHeight;
      }
    }, 80);
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
    this.palmReadingMessage.set(this.t().readingResult.palm.alertMessage);
    setTimeout(() => {
      this.palmReadingMessage.set(null);
    }, 4500);
  }

  viewHistory(): void {
    this.router.navigate(['/guidance/history']);
  }

  formatCategory(category?: string | null): string | null {
    if (!category) return null;
    const c = this.t().readingResult.categories;
    switch (category) {
      case 'MARRIAGE_TIMING':
        return c.marriageTiming;
      case 'MARRIAGE':
        return c.marriage;
      case 'CAREER_TIMING':
        return c.careerTiming;
      case 'CAREER':
        return c.career;
      case 'FINANCE':
        return c.money;
      case 'RELATIONSHIP':
        return c.relationships;
      case 'FAMILY':
        return c.family;
      case 'TRAVEL':
      case 'FOREIGN_SETTLEMENT':
        return c.travel;
      case 'HEALTH':
        return c.health;
      case 'EDUCATION':
        return c.education;
      case 'BUSINESS':
        return c.business;
      case 'LIFE_OVERVIEW':
      case 'GENERAL':
        return c.general;
      default:
        return category;
    }
  }
}
