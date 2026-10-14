import { Component, OnInit, OnDestroy, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil } from 'rxjs';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HoroscopeService } from '../../core/services/horoscope.service';
import { BirthDetailService } from '../../core/services/birth-detail.service';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslationService } from '../../core/services/translation.service';
import { HoroscopeGenerateRequest, HoroscopeResponse, ChartBox } from '../../core/models/horoscope.model';
import { BirthPlaceSearchResult } from '../../core/models/birth-detail.model';
import { Language } from '../../core/models/language.model';

@Component({
  selector: 'app-horoscope',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './horoscope.component.html',
  styleUrl: './horoscope.component.scss',
})
export class HoroscopeComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly horoscopeService = inject(HoroscopeService);
  private readonly birthDetailService = inject(BirthDetailService);
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  readonly t = this.translationService.t;
  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly horoscope = this.horoscopeService.currentHoroscope;
  readonly isGenerating = this.horoscopeService.isGenerating;
  readonly error = this.horoscopeService.error;

  private readonly defaultLanguages: Language[] = [
    { id: 1, code: 'en', name: 'English', native_name: 'English' },
    { id: 2, code: 'ml', name: 'Malayalam', native_name: 'മലയാളം' },
    { id: 3, code: 'hi', name: 'Hindi', native_name: 'हिन्दी' },
    { id: 4, code: 'ta', name: 'Tamil', native_name: 'தமிழ்' },
    { id: 5, code: 'te', name: 'Telugu', native_name: 'తెలుగు' },
    { id: 6, code: 'kn', name: 'Kannada', native_name: 'ಕನ್ನಡ' },
    { id: 7, code: 'bn', name: 'Bengali', native_name: 'বাংলা' },
    { id: 8, code: 'mr', name: 'Marathi', native_name: 'मराठी' },
    { id: 9, code: 'gu', name: 'Gujarati', native_name: 'ગુજરાતી' },
  ];
  private availableLanguages: Language[] = [...this.defaultLanguages];

  // View state
  readonly activeView = signal<'form' | 'result'>('form');
  readonly selectedGender = signal<'Male' | 'Female' | null>(null);
  readonly genderSelectionError = signal(false);
  readonly selectedChartStyle = signal<string>('Kerala');
  readonly selectedLanguage = signal<string>('Malayalam');
  readonly selectedAmPm = signal<'AM' | 'PM'>('AM');
  readonly activeChapter = signal<number>(1);
  readonly expandedItems = signal<Set<string>>(new Set(['item-0', 'item-1', 'item-2']));
  readonly isDownloadingPdf = signal<boolean>(false);

  // Place Autocomplete
  readonly isSearchingPlaces = signal<boolean>(false);
  readonly placeSuggestions = signal<BirthPlaceSearchResult[]>([]);
  readonly showPlaceDropdown = signal<boolean>(false);
  readonly highlightedIndex = signal<number>(-1);
  readonly selectedPlace = signal<BirthPlaceSearchResult | null>(null);

  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject$ = new Subject<string>();

  readonly languages = [
    { id: 'Malayalam', label: 'Malayalam' },
    { id: 'English', label: 'English' },
    { id: 'Tamil', label: 'Tamil' },
    { id: 'Hindi', label: 'Hindi' },
    { id: 'Telugu', label: 'Telugu' },
    { id: 'Kannada', label: 'Kannada' },
    { id: 'Bengali', label: 'Bengali' },
    { id: 'Marathi', label: 'Marathi' },
    { id: 'Gujarati', label: 'Gujarati' },
  ];

  readonly chartStyles = [
    { id: 'Kerala', label: 'Kerala' },
    { id: 'South Indian', label: 'South Indian' },
    { id: 'North Indian', label: 'North Indian' },
    { id: 'East Indian', label: 'East Indian' },
    { id: 'Srilankan', label: 'Srilankan' },
  ];

  readonly form = this.fb.group({
    name: ['Manu Prathap', [Validators.required, Validators.minLength(2)]],
    dob_day: ['05', [Validators.required, Validators.pattern(/^\d{1,2}$/), Validators.min(1), Validators.max(31)]],
    dob_month: ['02', [Validators.required, Validators.pattern(/^\d{1,2}$/), Validators.min(1), Validators.max(12)]],
    dob_year: ['2003', [Validators.required, Validators.pattern(/^\d{4}$/), Validators.min(1900), Validators.max(2100)]],
    tob_hour: ['04', [Validators.required, Validators.pattern(/^\d{1,2}$/), Validators.min(1), Validators.max(12)]],
    tob_minute: ['05', [Validators.required, Validators.pattern(/^\d{1,2}$/), Validators.min(0), Validators.max(59)]],
    place_of_birth: ['Pannimattom, Kerala, India', [Validators.required]],
    latitude: [9.92 as number | null],
    longitude: [76.84 as number | null],
    timezone: ['Asia/Kolkata'],
    email: [''],
    phone_code: ['+91'],
    phone_number: [''],
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const placeContainer = this.elementRef.nativeElement.querySelector('.place-autocomplete-container');
    if (placeContainer && !placeContainer.contains(target)) {
      this.showPlaceDropdown.set(false);
      this.highlightedIndex.set(-1);
    }
  }

  ngOnInit(): void {
    this.setupPlaceAutocomplete();

    // Fetch active languages from backend to ensure ID synchronization
    this.languageService.getLanguages().pipe(takeUntil(this.destroy$)).subscribe({
      next: (langs) => {
        if (langs && langs.length > 0) {
          const merged = [...langs];
          for (const def of this.defaultLanguages) {
            if (!merged.some(m => m.code === def.code || m.name.toLowerCase() === def.name.toLowerCase())) {
              merged.push(def);
            }
          }
          this.availableLanguages = merged;
        }
      },
      error: () => {},
    });

    // Restore saved form inputs so navigating away never clears user's entered data
    const savedForm = this.horoscopeService.getSavedFormData();
    if (savedForm) {
      if (savedForm.formValues) {
        this.form.patchValue(savedForm.formValues);
      }
      if (savedForm.gender === 'Male' || savedForm.gender === 'Female') {
        this.selectedGender.set(savedForm.gender);
      }
      if (savedForm.ampm) this.selectedAmPm.set(savedForm.ampm);
      if (savedForm.chartStyle) this.selectedChartStyle.set(savedForm.chartStyle);
      if (savedForm.language) this.selectedLanguage.set(savedForm.language);
    }

    // Sync selectedLanguage with global language if one is already active and no saved form
    const currentGlobal = this.languageService.currentLanguage();
    if (currentGlobal && !savedForm?.language) {
      const match = this.languages.find(
        l => l.id.toLowerCase() === currentGlobal.name.toLowerCase() ||
             l.id.toLowerCase() === currentGlobal.code.toLowerCase()
      );
      if (match) {
        this.selectedLanguage.set(match.id);
      }
    }

    // If horoscope already exists, show result
    if (this.horoscope()) {
      this.activeView.set('result');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setGender(gender: 'Male' | 'Female'): void {
    this.selectedGender.set(gender);
    this.genderSelectionError.set(false);
  }

  setAmPm(ampm: 'AM' | 'PM'): void {
    this.selectedAmPm.set(ampm);
  }

  setChartStyle(style: string): void {
    this.selectedChartStyle.set(style);
  }

  setLanguage(lang: string): void {
    this.selectedLanguage.set(lang);

    const matched = this.findMatchingLanguage(lang);
    if (matched) {
      this.languageService.setCurrentLanguage(matched);

      if (this.authService.isAuthenticated() && matched.id <= 6) {
        this.languageService.updateUserLanguage(matched.id).subscribe({
          next: () => this.authService.updateCurrentUserLanguage(matched.id),
          error: () => {},
        });
      }
    }
  }

  private findMatchingLanguage(lang: string): Language | undefined {
    const normalized = lang.trim().toLowerCase();
    return (
      this.availableLanguages.find(
        l => l.name.toLowerCase() === normalized || l.code.toLowerCase() === normalized
      ) ||
      this.defaultLanguages.find(
        l => l.name.toLowerCase() === normalized || l.code.toLowerCase() === normalized
      )
    );
  }

  setNoBirthTime(): void {
    this.form.patchValue({
      tob_hour: '12',
      tob_minute: '00',
    });
    this.selectedAmPm.set('PM');
  }

  onPlaceInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.searchSubject$.next(input);
  }

  selectPlace(place: BirthPlaceSearchResult): void {
    this.selectedPlace.set(place);
    this.form.patchValue({
      place_of_birth: place.formatted_address || place.place_name,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: place.timezone || 'Asia/Kolkata',
    });
    this.showPlaceDropdown.set(false);
    this.highlightedIndex.set(-1);
  }

  private setupPlaceAutocomplete(): void {
    this.searchSubject$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(query => {
        const trimmed = query ? query.trim() : '';
        if (trimmed.length < 2) {
          this.isSearchingPlaces.set(false);
          this.placeSuggestions.set([]);
          this.showPlaceDropdown.set(false);
          return of(null);
        }

        this.isSearchingPlaces.set(true);
        return this.birthDetailService.searchBirthPlaces(trimmed).pipe(
          catchError(() => {
            this.isSearchingPlaces.set(false);
            return of(null);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.isSearchingPlaces.set(false);
      if (response && response.results) {
        this.placeSuggestions.set(response.results);
        this.showPlaceDropdown.set(true);
      }
    });
  }

  onSubmit(): void {
    const gender = this.selectedGender();
    if (!gender) {
      this.genderSelectionError.set(true);
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const year = String(val.dob_year).padStart(4, '0');
    const month = String(val.dob_month).padStart(2, '0');
    const day = String(val.dob_day).padStart(2, '0');
    const dob = `${year}-${month}-${day}`;

    let hour = parseInt(val.tob_hour || '12', 10);
    const minute = String(val.tob_minute || '00').padStart(2, '0');

    if (this.selectedAmPm() === 'PM' && hour < 12) {
      hour += 12;
    } else if (this.selectedAmPm() === 'AM' && hour === 12) {
      hour = 0;
    }
    const tob = `${String(hour).padStart(2, '0')}:${minute}:00`;

    const req: HoroscopeGenerateRequest = {
      name: val.name || 'Seeker',
      gender,
      date_of_birth: dob,
      time_of_birth: tob,
      place_of_birth: val.place_of_birth || 'Kochi, Kerala',
      latitude: val.latitude ?? 9.9312,
      longitude: val.longitude ?? 76.2673,
      timezone: val.timezone || 'Asia/Kolkata',
      chart_style: this.selectedChartStyle(),
      language: this.selectedLanguage(),
      email: val.email || undefined,
      phone_number: val.phone_number ? `${val.phone_code} ${val.phone_number}` : undefined,
    };

    // Persist form state so leaving page never clears user data
    this.saveCurrentState();

    this.horoscopeService.generateHoroscope(req).subscribe({
      next: () => {
        this.activeView.set('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  }

  showForm(): void {
    this.activeView.set('form');
  }

  toggleItem(key: string): void {
    const current = new Set(this.expandedItems());
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    this.expandedItems.set(current);
  }

  isItemExpanded(key: string): boolean {
    return this.expandedItems().has(key);
  }

  scrollToChapter(chNumber: number): void {
    this.activeChapter.set(chNumber);
    if (chNumber === 0) {
      const topElem = document.getElementById('horoscope-summary-top') || document.getElementById('printable-horoscope-report');
      if (topElem) {
        topElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    const elem = document.getElementById(`chapter-${chNumber}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  nextChapter(): void {
    const cur = this.activeChapter();
    if (cur < 4) {
      this.scrollToChapter(cur + 1);
    }
  }

  prevChapter(): void {
    const cur = this.activeChapter();
    if (cur > 0) {
      this.scrollToChapter(cur - 1);
    }
  }

  scrollToBuyOffer(): void {
    const el = document.getElementById('full-horoscope-buy-offer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  loginToUnlock(): void {
    if (this.authService.isAuthenticated()) {
      // User is already logged in: stay on page and scroll down to predictions
      this.scrollToChapter(3);
    } else {
      // Save current state so returning after login retains full horoscope and inputs
      this.saveCurrentState();
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/horoscope' } });
    }
  }

  goToGuidance(): void {
    this.saveCurrentState();
    this.router.navigate(['/guidance']);
  }

  saveCurrentState(): void {
    this.horoscopeService.saveFormData({
      formValues: this.form.value,
      gender: this.selectedGender(),
      ampm: this.selectedAmPm(),
      chartStyle: this.selectedChartStyle(),
      language: this.selectedLanguage(),
    });
  }

  createNewHoroscope(): void {
    this.horoscopeService.resetAll();
    this.form.reset({
      name: '',
      dob_day: '',
      dob_month: '',
      dob_year: '',
      tob_hour: '12',
      tob_minute: '00',
      place_of_birth: '',
      latitude: null,
      longitude: null,
      timezone: 'Asia/Kolkata',
      email: '',
      phone_code: '+91',
      phone_number: '',
    });
    this.selectedGender.set(null);
    this.genderSelectionError.set(false);
    this.selectedAmPm.set('AM');
    this.activeView.set('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  printReport(): void {
    window.print();
  }

  async downloadPdf(): Promise<void> {
    const reportElem = document.querySelector('.report-sheet') as HTMLElement;
    if (!reportElem) {
      window.print();
      return;
    }

    this.isDownloadingPdf.set(true);

    try {
      const rawName = this.horoscope()?.personal_info?.name || 'Vedic_Horoscope';
      const cleanName = rawName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
      const filename = `${cleanName || 'Vedic'}_Horoscope_Report.pdf`;

      // Dynamically import html2pdf.js to avoid SSR or bundle issues
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule as any).default || html2pdfModule;

      const opt = {
        margin: [10, 8, 12, 8] as [number, number, number, number],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          windowWidth: 1100,
          ignoreElements: (element: Element) => element.classList.contains('no-print'),
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(opt).from(reportElem).save();
    } catch (err) {
      console.warn('Direct PDF export encountered an issue; falling back to browser print:', err);
      window.print();
    } finally {
      this.isDownloadingPdf.set(false);
    }
  }
}
