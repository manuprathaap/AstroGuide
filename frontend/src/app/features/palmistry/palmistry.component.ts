import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { PalmistryService } from '../../core/services/palmistry.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslationService } from '../../core/services/translation.service';
import { AuthService } from '../../core/services/auth.service';
import {
  PalmAnalysisRequest,
  PalmAnalysisResponse,
  PalmLineDetail,
  PalmMountDetail,
} from '../../core/models/palmistry.model';

@Component({
  selector: 'app-palmistry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './palmistry.component.html',
  styleUrl: './palmistry.component.scss',
})
export class PalmistryComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly palmService = inject(PalmistryService);
  private readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly reading = this.palmService.currentReading;
  readonly isAnalyzing = this.palmService.isAnalyzing;
  readonly error = this.palmService.error;
  readonly t = this.translationService.t;
  readonly isAuthenticated = this.authService.isAuthenticated;

  // Views: 'form' | 'scanning' | 'result'
  readonly activeView = signal<'form' | 'scanning' | 'result'>('form');

  // Scanning animation state
  readonly scanProgress = signal<number>(0);
  readonly scanStatusText = signal<string>('Detecting palm landmarks...');

  // Form selections
  readonly selectedGender = signal<'Male' | 'Female'>('Male');
  readonly selectedDominantHand = signal<'Right' | 'Left'>('Right');
  readonly selectedLanguage = signal<string>('English');

  readonly leftImagePreview = signal<string | null>(null);
  readonly rightImagePreview = signal<string | null>(null);

  // Interactive diagram selection
  readonly activeLineKey = signal<string | null>(null);
  readonly activeMountKey = signal<string | null>(null);

  readonly isDownloadingPdf = signal<boolean>(false);
  readonly requiresLogin = signal<boolean>(false);

  readonly languages = [
    { id: 'English', label: 'English' },
    { id: 'Malayalam', label: 'Malayalam' },
    { id: 'Hindi', label: 'Hindi' },
    { id: 'Tamil', label: 'Tamil' },
  ];

  readonly form = this.fb.group({
    name: ['Manu Prathap', [Validators.required, Validators.minLength(2)]],
    notes: [''],
  });

  isMalayalam(): boolean {
    return this.selectedLanguage() === 'Malayalam';
  }

  ngOnInit(): void {
    // Sync language with global service
    const globalLang = this.languageService.currentLanguage();
    if (globalLang) {
      const match = this.languages.find(
        (l) => l.id.toLowerCase() === globalLang.name.toLowerCase()
      );
      if (match) {
        this.selectedLanguage.set(match.id);
      }
    }

    // If an existing reading exists, display result
    if (this.reading()) {
      this.activeView.set('result');
    }
  }

  setGender(gender: 'Male' | 'Female'): void {
    this.selectedGender.set(gender);
  }

  setDominantHand(hand: 'Right' | 'Left'): void {
    this.selectedDominantHand.set(hand);
  }

  setLanguage(lang: string): void {
    this.selectedLanguage.set(lang);
    if (this.activeView() === 'result') {
      this.onSubmit();
    }
  }

  onLanguageSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.setLanguage(target.value);
    }
  }

  onFileSelected(event: Event, side: 'left' | 'right'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        if (side === 'left') {
          this.leftImagePreview.set(base64);
        } else {
          this.rightImagePreview.set(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(side: 'left' | 'right', event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (side === 'left') {
      this.leftImagePreview.set(null);
    } else {
      this.rightImagePreview.set(null);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.requiresLogin.set(false);
    const val = this.form.value;
    const req: PalmAnalysisRequest = {
      name: val.name || 'Seeker',
      gender: this.selectedGender(),
      dominant_hand: this.selectedDominantHand(),
      language: this.selectedLanguage(),
      left_hand_image: this.leftImagePreview(),
      right_hand_image: this.rightImagePreview(),
      notes: val.notes || undefined,
    };

    // Transition to scanning animation
    this.activeView.set('scanning');
    this.runScanAnimation();

    this.palmService.analyzePalm(req).subscribe({
      next: () => {
        this.activeView.set('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error: HttpErrorResponse) => {
        this.activeView.set('form');
        this.requiresLogin.set(error.status === 403);
      },
    });
  }

  signInForAnotherAnalysis(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: '/palmistry' },
    });
  }

  useSampleDemo(): void {
    this.activeView.set('scanning');
    this.runScanAnimation();

    this.palmService.getSampleAnalysis(this.selectedLanguage()).subscribe({
      next: () => {
        this.activeView.set('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.activeView.set('form');
      },
    });
  }

  private runScanAnimation(): void {
    this.scanProgress.set(10);
    this.scanStatusText.set('Aligning hand geometry & palm contours...');

    setTimeout(() => {
      this.scanProgress.set(35);
      this.scanStatusText.set('Measuring Ayur Rekha & Mastishk Rekha curvature...');
    }, 600);

    setTimeout(() => {
      this.scanProgress.set(65);
      this.scanStatusText.set('Evaluating Sapta Graha Parvatas (Planetary Mounts)...');
    }, 1200);

    setTimeout(() => {
      this.scanProgress.set(90);
      this.scanStatusText.set('Deciphering Prarabdha vs Purushartha karmic balance...');
    }, 1800);

    setTimeout(() => {
      this.scanProgress.set(100);
      this.scanStatusText.set('Hastarekha Shastra synthesis ready!');
    }, 2400);
  }

  selectLine(key: string): void {
    this.activeLineKey.set(this.activeLineKey() === key ? null : key);
  }

  selectMount(key: string): void {
    this.activeMountKey.set(this.activeMountKey() === key ? null : key);
  }

  showForm(): void {
    this.activeView.set('form');
  }

  newReading(): void {
    this.palmService.clear();
    this.leftImagePreview.set(null);
    this.rightImagePreview.set(null);
    this.form.reset({ name: 'Manu Prathap', notes: '' });
    this.activeView.set('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  printReport(): void {
    window.print();
  }

  async downloadPdf(): Promise<void> {
    window.print();
  }
}
