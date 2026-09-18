import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LanguageService } from '../../../core/services/language.service';
import { TranslationService } from '../../../core/services/translation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Language } from '../../../core/models/language.model';

@Component({
  selector: 'app-language-selection',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './language-selection.component.html',
  styleUrl: './language-selection.component.scss'
})
export class LanguageSelectionComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly t = this.translationService.t;
  readonly languages = signal<Language[]>([]);
  readonly selectedLanguageId = signal<number | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly saveErrorMessage = signal<string | null>(null);

  private readonly defaultLanguages: Language[] = [
    { id: 1, code: 'en', name: 'English', native_name: 'English' },
    { id: 2, code: 'ml', name: 'Malayalam', native_name: 'മലയാളം' },
    { id: 3, code: 'hi', name: 'Hindi', native_name: 'हिन्दी' },
    { id: 4, code: 'te', name: 'Telugu', native_name: 'తెలుగు' },
    { id: 5, code: 'ta', name: 'Tamil', native_name: 'தமிழ்' },
    { id: 6, code: 'kn', name: 'Kannada', native_name: 'ಕನ್ನಡ' }
  ];

  ngOnInit(): void {
    this.loadLanguages();
  }

  loadLanguages(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.languageService.getLanguages().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        const list = (data && data.length > 0) ? data : this.defaultLanguages;
        this.languages.set(list);

        // Pre-select user's current language if previously saved
        const currentUser = this.authService.currentUser();
        const savedLangId = currentUser?.language_id ?? this.authService.getSavedLanguageId() ?? this.languageService.currentLanguage()?.id;
        if (savedLangId) {
          this.selectedLanguageId.set(savedLangId);
        } else if (list.length > 0) {
          this.selectedLanguageId.set(list[0].id);
        }
      },
      error: () => {
        // Graceful fallback to default supported languages
        this.isLoading.set(false);
        this.languages.set(this.defaultLanguages);
        const savedLang = this.languageService.currentLanguage();
        this.selectedLanguageId.set(savedLang ? savedLang.id : 1);
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

    const matched = this.languages().find(l => l.id === langId) || this.defaultLanguages.find(l => l.id === langId);
    if (matched) {
      this.languageService.setCurrentLanguage(matched);
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (this.authService.isAuthenticated()) {
      this.languageService.updateUserLanguage(langId).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.authService.updateCurrentUserLanguage(langId);
          this.navigateNext(returnUrl);
        },
        error: () => {
          // Even if backend call fails, keep local state and proceed
          this.isSaving.set(false);
          this.navigateNext(returnUrl);
        }
      });
    } else {
      this.isSaving.set(false);
      this.navigateNext(returnUrl);
    }
  }

  private navigateNext(returnUrl: string | null): void {
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/explore']);
    }
  }
}
