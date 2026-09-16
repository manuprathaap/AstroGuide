import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { GuidanceService } from '../../core/services/guidance.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { LanguageService } from '../../core/services/language.service';
import { Guidance } from '../../core/models/guidance.model';

export type GuidanceCategory =
  | 'Career'
  | 'Relationship'
  | 'Marriage'
  | 'Finance'
  | 'Family'
  | 'Education'
  | 'General';

export interface CategoryItem {
  id: GuidanceCategory;
  label: string;
  icon: string;
  description: string;
  transitFocus: string;
}

export interface ReadingContent {
  happening: string;
  guidance: string;
  action: string;
}

@Component({
  selector: 'app-guidance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './guidance.component.html',
  styleUrl: './guidance.component.scss'
})
export class GuidanceComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly guidanceService = inject(GuidanceService);
  private readonly authService = inject(AuthService);
  private readonly translationService = inject(TranslationService);
  private readonly languageService = inject(LanguageService);

  readonly t = this.translationService.t;
  readonly g = computed(() => this.translationService.t().guidancePage);
  readonly currentLanguage = this.languageService.currentLanguage;
  readonly currentLanguageCode = this.languageService.currentLanguageCode;
  readonly currentLanguageLabel = computed(() => this.languageService.currentLanguage()?.name || 'Language');

  // Step Navigation: 1 (Intro) -> 2 (Category) -> 3 (Problem Form) -> 4 (Processing) -> 5 (Reading)
  readonly currentStep = signal<1 | 2 | 3 | 4 | 5>(1);

  // Available categories matching Figma design dynamically translated
  readonly categories = computed<CategoryItem[]>(() => {
    const cats = this.g().step2.categories;
    return [
      {
        id: 'Career',
        label: cats.career.label,
        icon: '💼',
        description: cats.career.description,
        transitFocus: cats.career.transitFocus
      },
      {
        id: 'Relationship',
        label: cats.relationship.label,
        icon: '💕',
        description: cats.relationship.description,
        transitFocus: cats.relationship.transitFocus
      },
      {
        id: 'Marriage',
        label: cats.marriage.label,
        icon: '💍',
        description: cats.marriage.description,
        transitFocus: cats.marriage.transitFocus
      },
      {
        id: 'Finance',
        label: cats.finance.label,
        icon: '💰',
        description: cats.finance.description,
        transitFocus: cats.finance.transitFocus
      },
      {
        id: 'Family',
        label: cats.family.label,
        icon: '🏡',
        description: cats.family.description,
        transitFocus: cats.family.transitFocus
      },
      {
        id: 'Education',
        label: cats.education.label,
        icon: '🎓',
        description: cats.education.description,
        transitFocus: cats.education.transitFocus
      },
      {
        id: 'General',
        label: cats.general.label,
        icon: '🌟',
        description: cats.general.description,
        transitFocus: cats.general.transitFocus
      }
    ];
  });

  // Local UI State
  readonly selectedCategory = signal<GuidanceCategory>('Career');
  readonly charCount = signal<number>(0);
  readonly isSubmitted = signal<boolean>(false);
  readonly isCreating = signal<boolean>(false);
  readonly createErrorMessage = signal<string | null>(null);

  // Active Guidance result
  readonly createdGuidance = signal<Guidance | null>(null);
  readonly submittedProblemText = signal<string>('');

  // Guidance History State
  readonly guidanceHistory = signal<Guidance[]>([]);
  readonly isLoadingHistory = signal<boolean>(true);
  readonly historyErrorMessage = signal<string | null>(null);

  // Edit Guidance Modal State
  readonly editingGuidance = signal<Guidance | null>(null);
  readonly isUpdating = signal<boolean>(false);
  readonly updateErrorMessage = signal<string | null>(null);

  // Delete Guidance Modal State
  readonly deletingGuidance = signal<Guidance | null>(null);
  readonly isDeleting = signal<boolean>(false);
  readonly deleteErrorMessage = signal<string | null>(null);

  // View Detail Modal State
  readonly viewingGuidance = signal<Guidance | null>(null);

  // Success feedback toast
  readonly toastMessage = signal<string | null>(null);

  // Reactive Forms
  readonly problemForm = this.fb.group({
    problem: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(5000)
      ]
    ]
  });

  readonly editForm = this.fb.group({
    problem: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(5000)
      ]
    ]
  });

  ngOnInit(): void {
    // Dynamic character counter for main problem field
    this.problemForm.get('problem')?.valueChanges.subscribe(value => {
      this.charCount.set(value ? value.length : 0);
    });

    // Load user's guidance history
    this.loadHistory();
  }

  get problemControl() {
    return this.problemForm.get('problem');
  }

  get shouldShowError(): boolean {
    const control = this.problemControl;
    if (!control) {
      return false;
    }
    return control.invalid && (control.touched || control.dirty || this.isSubmitted());
  }

  get errorMessage(): string | null {
    const control = this.problemControl;
    if (!control || !control.errors) {
      return null;
    }
    const errs = this.g().step3.errors;
    if (control.errors['required']) {
      return errs.required;
    }
    if (control.errors['minlength']) {
      return errs.minLength;
    }
    if (control.errors['maxlength']) {
      return errs.maxLength;
    }
    return null;
  }

  get editProblemControl() {
    return this.editForm.get('problem');
  }

  // Current category metadata helper
  readonly currentCategoryItem = computed(() => {
    const id = this.selectedCategory();
    const list = this.categories();
    return list.find(c => c.id === id) || list[0];
  });

  // Dynamic Personalized Reading based on chosen category and current language
  readonly personalizedReading = computed<ReadingContent>(() => {
    const cat = this.selectedCategory();
    const r = this.g().step5.readings;
    switch (cat) {
      case 'Career':
        return r.career;
      case 'Relationship':
        return r.relationship;
      case 'Marriage':
        return r.marriage;
      case 'Finance':
        return r.finance;
      case 'Family':
        return r.family;
      case 'Education':
        return r.education;
      case 'General':
      default:
        return r.general;
    }
  });

  // Step Navigation Methods
  goToStep(step: 1 | 2 | 3 | 4 | 5): void {
    this.currentStep.set(step);
  }

  selectCategory(cat: GuidanceCategory): void {
    this.selectedCategory.set(cat);
  }

  // Logical Back Navigation (Sections 7 & 11)
  goBack(): void {
    const step = this.currentStep();
    if (step === 1) {
      // Step 1: Back -> previous page / dashboard
      this.router.navigate(['/dashboard']);
    } else if (step === 2) {
      // Step 2: Back -> Step 1
      this.currentStep.set(1);
    } else if (step === 3) {
      // Step 3: Back -> Step 2
      this.currentStep.set(2);
    } else if (step === 4) {
      // Step 4: Back disabled while processing
      return;
    } else if (step === 5) {
      // Step 5: Back -> Step 3
      this.currentStep.set(3);
    }
  }

  // Step 3 -> Step 4 -> Step 5: Submit Problem to Backend API
  onSubmitProblem(): void {
    this.isSubmitted.set(true);

    if (this.problemForm.invalid || this.isCreating()) {
      this.problemControl?.markAsTouched();
      return;
    }

    const problemText = this.problemControl?.value?.trim() || '';
    if (!problemText) {
      return;
    }

    this.isCreating.set(true);
    this.createErrorMessage.set(null);
    this.submittedProblemText.set(problemText);

    // Call POST /api/v1/guidance (FastAPI identifies user from JWT Bearer token)
    this.guidanceService.createGuidance({ problem: problemText }).subscribe({
      next: (response: Guidance) => {
        this.isCreating.set(false);
        this.createdGuidance.set(response);

        // Transition to Step 4 (Processing Screen)
        this.currentStep.set(4);

        // Refresh guidance history in background
        this.loadHistory();

        // Simulate celestial transit computation then transition to Step 5 (Personalized Reading)
        setTimeout(() => {
          if (this.currentStep() === 4) {
            this.currentStep.set(5);
            this.showToast(this.g().history.toastCreated);
          }
        }, 2200);
      },
      error: (err: unknown) => {
        this.isCreating.set(false);
        this.createErrorMessage.set(this.authService.formatErrorMessage(err));
      }
    });
  }

  // Reset and start a new guidance consultation
  startNewConsultation(): void {
    this.problemForm.reset();
    this.charCount.set(0);
    this.isSubmitted.set(false);
    this.createErrorMessage.set(null);
    this.currentStep.set(2);
  }

  // Guidance History Methods
  loadHistory(): void {
    this.isLoadingHistory.set(true);
    this.historyErrorMessage.set(null);

    this.guidanceService.getGuidanceHistory().subscribe({
      next: (history: Guidance[]) => {
        this.isLoadingHistory.set(false);
        this.guidanceHistory.set(history || []);
      },
      error: (err: unknown) => {
        this.isLoadingHistory.set(false);
        this.historyErrorMessage.set(this.authService.formatErrorMessage(err));
      }
    });
  }

  // View Details Modal
  openViewModal(item: Guidance): void {
    this.viewingGuidance.set(item);
  }

  closeViewModal(): void {
    this.viewingGuidance.set(null);
  }

  // Edit Guidance
  openEditModal(item: Guidance): void {
    this.editingGuidance.set(item);
    this.updateErrorMessage.set(null);
    this.editForm.setValue({
      problem: item.problem
    });
  }

  closeEditModal(): void {
    this.editingGuidance.set(null);
    this.updateErrorMessage.set(null);
  }

  onUpdateGuidance(): void {
    const item = this.editingGuidance();
    if (!item || this.editForm.invalid || this.isUpdating()) {
      this.editProblemControl?.markAsTouched();
      return;
    }

    const updatedProblem = this.editProblemControl?.value?.trim() || '';
    this.isUpdating.set(true);
    this.updateErrorMessage.set(null);

    this.guidanceService.updateGuidance(item.id, { problem: updatedProblem }).subscribe({
      next: (updated: Guidance) => {
        this.isUpdating.set(false);
        // Update item in local list
        this.guidanceHistory.update(list =>
          list.map(g => (g.id === updated.id ? updated : g))
        );
        this.closeEditModal();
        this.showToast(this.g().history.toastUpdated);
      },
      error: (err: unknown) => {
        this.isUpdating.set(false);
        this.updateErrorMessage.set(this.authService.formatErrorMessage(err));
      }
    });
  }

  // Delete Guidance
  confirmDelete(item: Guidance): void {
    this.deletingGuidance.set(item);
    this.deleteErrorMessage.set(null);
  }

  cancelDelete(): void {
    this.deletingGuidance.set(null);
    this.deleteErrorMessage.set(null);
  }

  onDeleteGuidance(): void {
    const item = this.deletingGuidance();
    if (!item || this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);
    this.deleteErrorMessage.set(null);

    this.guidanceService.deleteGuidance(item.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        // Remove item from local list
        this.guidanceHistory.update(list => list.filter(g => g.id !== item.id));
        this.cancelDelete();
        this.showToast(this.g().history.toastDeleted);
      },
      error: (err: unknown) => {
        this.isDeleting.set(false);
        this.deleteErrorMessage.set(this.authService.formatErrorMessage(err));
      }
    });
  }

  // Toast feedback helper
  showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }

  dismissToast(): void {
    this.toastMessage.set(null);
  }

  // Date formatting helper
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }

  // Scroll to History section smoothly
  scrollToHistory(): void {
    const element = document.getElementById('guidance-history-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
