import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { TranslationService } from '../../../core/services/translation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Language } from '../../../core/models/language.model';

@Component({
  selector: 'app-language-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selection.component.html',
  styleUrl: './language-selection.component.scss'
})
export class LanguageSelectionComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly t = this.translationService.t;
  readonly languages = signal<Language[]>([]);
  readonly selectedLanguageId = signal<number | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly saveErrorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadLanguages();
  }

  loadLanguages(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.languageService.getLanguages().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.languages.set(data || []);

        // Pre-select user's current language if previously saved
        const currentUser = this.authService.currentUser();
        const savedLangId = currentUser?.language_id ?? this.authService.getSavedLanguageId() ?? this.languageService.currentLanguage()?.id;
        if (savedLangId) {
          this.selectedLanguageId.set(savedLangId);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.status === 0
            ? 'Unable to connect to server. Please check your backend connection.'
            : 'Unable to load languages. Please try again.'
        );
      }
    });
  }

  selectLanguage(id: number): void {
    this.selectedLanguageId.set(id);
    this.saveErrorMessage.set(null);
    const chosen = this.languages().find(l => l.id === id);
    if (chosen) {
      this.languageService.setCurrentLanguage(chosen);
    }
  }

  onContinue(): void {
    const langId = this.selectedLanguageId();
    if (!langId || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.saveErrorMessage.set(null);

    this.languageService.updateUserLanguage(langId).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.authService.updateCurrentUserLanguage(langId);
        const matched = this.languages().find(l => l.id === langId);
        if (matched) {
          this.languageService.setCurrentLanguage(matched);
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveErrorMessage.set(this.authService.formatErrorMessage(err));
      }
    });
  }

  skipOrCancel(): void {
    // If user already has a language selected, they can return to dashboard
    if (this.authService.currentUser()?.language_id) {
      this.router.navigate(['/dashboard']);
    }
  }
}
