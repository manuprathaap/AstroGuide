import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslationService } from '../../core/services/translation.service';
import { User } from '../../core/models/user.model';
import { Language } from '../../core/models/language.model';

interface ExplorationCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  actionText: string;
}

interface GuidanceTopic {
  id: string;
  label: string;
  userPrompt: string;
  guideResponse: string;
  options: string[];
  readingPreview: {
    happening: string;
    action: string;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  readonly t = this.translationService.t;
  readonly languages = signal<Language[]>([]);
  readonly currentLanguage = signal<Language | null>(this.languageService.currentLanguage());
  readonly currentLanguageName = signal<string>(this.languageService.currentLanguage()?.name || 'English');
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  // Active Exploration Mode: 'overview' | 'problem_guidance' | 'birth_chart' | 'palm_reading'
  readonly activeView = signal<'overview' | 'problem_guidance' | 'birth_chart' | 'palm_reading'>('overview');
  readonly selectedTopicId = signal<string>('career');
  readonly selectedOption = signal<string>('');
  readonly customQuery = signal<string>('');
  readonly showReadingResult = signal<boolean>(false);

  readonly explorationCards = computed<ExplorationCard[]>(() => {
    const cards = this.t().dashboard.cards;
    return [
      {
        id: 'problem',
        title: cards.problemTitle,
        subtitle: cards.problemSubtitle,
        icon: '💬',
        actionText: cards.actionText
      },
      {
        id: 'chart',
        title: cards.chartTitle,
        subtitle: cards.chartSubtitle,
        icon: '🪐',
        actionText: cards.actionText
      },
      {
        id: 'palm',
        title: cards.palmTitle,
        subtitle: cards.palmSubtitle,
        icon: '✋',
        actionText: cards.actionText
      }
    ];
  });

  readonly topics = computed<GuidanceTopic[]>(() => {
    const tp = this.t().dashboard.topics;
    return [
      {
        id: 'career',
        label: tp.career.label,
        userPrompt: tp.career.userPrompt,
        guideResponse: tp.career.guideResponse,
        options: tp.career.options,
        readingPreview: {
          happening: tp.career.happening,
          action: tp.career.action
        }
      },
      {
        id: 'marriage',
        label: tp.marriage.label,
        userPrompt: tp.marriage.userPrompt,
        guideResponse: tp.marriage.guideResponse,
        options: tp.marriage.options,
        readingPreview: {
          happening: tp.marriage.happening,
          action: tp.marriage.action
        }
      },
      {
        id: 'money',
        label: tp.money.label,
        userPrompt: tp.money.userPrompt,
        guideResponse: tp.money.guideResponse,
        options: tp.money.options,
        readingPreview: {
          happening: tp.money.happening,
          action: tp.money.action
        }
      },
      {
        id: 'family',
        label: tp.family.label,
        userPrompt: tp.family.userPrompt,
        guideResponse: tp.family.guideResponse,
        options: tp.family.options,
        readingPreview: {
          happening: tp.family.happening,
          action: tp.family.action
        }
      },
      {
        id: 'education',
        label: tp.education.label,
        userPrompt: tp.education.userPrompt,
        guideResponse: tp.education.guideResponse,
        options: tp.education.options,
        readingPreview: {
          happening: tp.education.happening,
          action: tp.education.action
        }
      },
      {
        id: 'general',
        label: tp.general.label,
        userPrompt: tp.general.userPrompt,
        guideResponse: tp.general.guideResponse,
        options: tp.general.options,
        readingPreview: {
          happening: tp.general.happening,
          action: tp.general.action
        }
      }
    ];
  });

  get currentTopic(): GuidanceTopic {
    const list = this.topics();
    return list.find(t => t.id === this.selectedTopicId()) || list[0];
  }

  ngOnInit(): void {
    this.loadProfileAndLanguages();
  }

  loadProfileAndLanguages(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.getMe().subscribe({
      next: (user: User) => {
        this.languageService.getLanguages().subscribe({
          next: (langs: Language[]) => {
            this.languages.set(langs);
            const targetLangId = user.language_id ?? this.authService.getSavedLanguageId() ?? this.languageService.currentLanguage()?.id;
            if (targetLangId) {
              const matched = langs.find(l => l.id === targetLangId);
              if (matched) {
                this.currentLanguage.set(matched);
                this.currentLanguageName.set(matched.name);
                this.languageService.setCurrentLanguage(matched);
                this.authService.updateCurrentUserLanguage(matched.id);
              }
            } else if (this.languageService.currentLanguage()) {
              const current = this.languageService.currentLanguage()!;
              this.currentLanguage.set(current);
              this.currentLanguageName.set(current.name);
            }
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.authService.formatErrorMessage(err));
      }
    });
  }

  openExploration(id: string): void {
    if (id === 'problem') {
      this.activeView.set('problem_guidance');
    } else if (id === 'chart') {
      this.router.navigate(['/birth-details']);
    } else if (id === 'palm') {
      this.activeView.set('palm_reading');
    }
  }

  setTopic(topicId: string): void {
    this.selectedTopicId.set(topicId);
    this.selectedOption.set(this.currentTopic.options[0]);
    this.showReadingResult.set(false);
  }

  selectOption(opt: string): void {
    this.selectedOption.set(opt);
  }

  submitGuidanceQuery(): void {
    this.showReadingResult.set(true);
  }

  resetToOverview(): void {
    this.activeView.set('overview');
    this.showReadingResult.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
