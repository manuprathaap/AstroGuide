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
  private readonly authService = inject(AuthService);

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
  readonly categoryTabs: { id: GuidedTopicId; label: string; icon: string }[] = [
    { id: 'Career', label: 'Career', icon: '💼' },
    { id: 'Money / Finance', label: 'Money', icon: '💰' },
    { id: 'Relationships', label: 'Relationships', icon: '💕' },
    { id: 'Family', label: 'Family', icon: '🏡' },
    { id: 'Travel / Abroad', label: 'Travel', icon: '✈️' },
    { id: 'Health / Wellness', label: 'Health', icon: '🌿' },
    { id: 'General Guidance', label: 'Personal Growth', icon: '✦' }
  ];

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
  readonly planStatus = signal({
    planName: 'Personal Seeker Plan',
    readingsRemaining: 'Unlimited basic inquiry access',
    isPremium: true
  });

  // Palm Reading modal / status (Screen 11)
  readonly palmReadingMessage = signal<string | null>(null);

  // Suggested Contextual Follow-up Questions
  readonly suggestedFollowUps = computed<string[]>(() => {
    const cat = (this.lastGuidance()?.category || '').toUpperCase();
    const langCode = this.languageService.currentLanguageCode().toLowerCase();
    const isMalayalam = langCode.startsWith('ml');

    if (cat.includes('MARRIAGE')) {
      return isMalayalam
        ? ['Athinte reason enthaanu?', 'Partner engane ayirikkum?', '2027-il chance undo?']
        : ['What are the astrological reasons?', 'What does my chart say about my partner?', 'Is there a favorable window in 2027?'];
    }
    if (cat.includes('CAREER')) {
      return isMalayalam
        ? ['Job change cheyyan nalla samayam aano?', 'Promotion kittan chance undo?', 'Business start cheyyan pattumo?']
        : ['Is this a favorable time for a job change?', 'When are supportive periods for career growth?', 'Does my chart favor starting a business?'];
    }
    if (cat.includes('FINANCE')) {
      return isMalayalam
        ? ['Saambathika sthithi eppol nannakum?', 'Investments cheyyan safe aano?']
        : ['When will financial stability improve?', 'What planetary cycles indicate wealth growth?'];
    }
    if (cat.includes('TRAVEL') || cat.includes('FOREIGN')) {
      return isMalayalam
        ? ['Abroad pokan eppol samayam aakum?', 'Permanent settlement chance undo?']
        : ['When are supportive periods to travel abroad?', 'Is foreign settlement indicated in my chart?'];
    }
    return isMalayalam
      ? ['Athinte reason enthaanu?', 'Adutha nalla samayam eppolanu?', 'Ente life-il ippo enthaanu main focus?']
      : ['What are the primary planetary reasons?', 'When is the next supportive period?', 'What should my main focus be right now?'];
  });

  ngOnInit(): void {
    // 1. Hydrate from router transition state if available
    if (history.state?.guidance) {
      this.journeyService.setGuidanceResult(history.state.guidance as Guidance);
    }

    // 2. Fetch birth details profile if not present in memory
    if (!this.birthDetails()) {
      this.birthDetailService.getBirthDetails().subscribe({
        next: (details) => {
          this.journeyService.setBirthDetails(details);
        },
        error: () => {
          // Non-blocking
        }
      });
    }

    // 3. If messages empty, load recent history to populate conversation
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
        error: () => {
          // Non-blocking
        }
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

    // 1. Immediately append user message
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

    // 2. Ensure user language sync
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
    this.guidanceService.createGuidance({ problem: questionText }).subscribe({
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
        this.lastError.set('Something went wrong while preparing your guidance.');
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

  formatCategory(category?: string | null): string | null {
    if (!category) return null;
    switch (category) {
      case 'MARRIAGE_TIMING':
        return 'Marriage Timing';
      case 'MARRIAGE':
        return 'Marriage';
      case 'CAREER_TIMING':
      case 'CAREER':
        return 'Career';
      case 'FINANCE':
        return 'Money / Finance';
      case 'RELATIONSHIP':
        return 'Relationships';
      case 'FAMILY':
        return 'Family';
      case 'TRAVEL':
      case 'FOREIGN_SETTLEMENT':
        return 'Travel / Abroad';
      case 'HEALTH':
        return 'Health / Wellness';
      case 'EDUCATION':
        return 'Education';
      case 'BUSINESS':
        return 'Business';
      case 'LIFE_OVERVIEW':
      case 'GENERAL':
        return 'General Guidance';
      default:
        return category;
    }
  }
}
