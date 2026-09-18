import { Component, OnInit, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { BirthDetailService } from '../../core/services/birth-detail.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { ReadingJourneyService } from '../../core/services/reading-journey.service';
import { BirthDetail, BirthDetailCreate, BirthDetailUpdate, PlaceSuggestion } from '../../core/models/birth-detail.model';

function pastOrTodayDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const inputDate = new Date(control.value);
  if (isNaN(inputDate.getTime())) {
    return { invalidDate: true };
  }
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (inputDate > today) {
    return { futureDate: true };
  }
  if (inputDate.getFullYear() < 1900) {
    return { invalidDate: true };
  }
  return null;
}

@Component({
  selector: 'app-birth-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './birth-details.component.html',
  styleUrl: './birth-details.component.scss'
})
export class BirthDetailsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly birthDetailService = inject(BirthDetailService);
  private readonly authService = inject(AuthService);
  private readonly translationService = inject(TranslationService);
  private readonly journeyService = inject(ReadingJourneyService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  readonly t = this.translationService.t;
  readonly currentUser = this.authService.currentUser;

  readonly isLoadingDetails = signal<boolean>(true);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);
  readonly isExisting = signal<boolean>(false);
  readonly isEditingMode = signal<boolean>(false);
  readonly savedDetails = signal<BirthDetail | null>(null);

  readonly showDeleteModal = signal<boolean>(false);
  readonly successToast = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly placeSuggestions = signal<PlaceSuggestion[]>([]);
  readonly showPlaceDropdown = signal<boolean>(false);

  // Maximum allowed date for date picker (today)
  readonly maxDate = new Date().toISOString().split('T')[0];

  readonly birthForm = this.fb.group({
    date_of_birth: ['', [Validators.required, pastOrTodayDateValidator]],
    time_of_birth: ['', [Validators.required]],
    place_of_birth: ['', [Validators.required, Validators.minLength(2)]],
    latitude: [null as number | null],
    longitude: [null as number | null],
    timezone: ['Asia/Kolkata']
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showPlaceDropdown.set(false);
    }
  }

  ngOnInit(): void {
    this.loadExistingDetails();
  }

  loadExistingDetails(): void {
    this.isLoadingDetails.set(true);
    this.errorMessage.set(null);

    this.birthDetailService.getBirthDetails().subscribe({
      next: (details: BirthDetail) => {
        this.isExisting.set(true);
        this.savedDetails.set(details);
        this.journeyService.setBirthDetails(details);

        let formattedTime = details.time_of_birth || '';
        if (formattedTime.length > 5) {
          formattedTime = formattedTime.substring(0, 5);
        }

        this.birthForm.patchValue({
          date_of_birth: details.date_of_birth,
          time_of_birth: formattedTime,
          place_of_birth: details.place_of_birth,
          latitude: details.latitude,
          longitude: details.longitude,
          timezone: details.timezone || 'Asia/Kolkata'
        });
        this.isEditingMode.set(false);
        this.isLoadingDetails.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.isExisting.set(false);
          this.isEditingMode.set(true);
          this.birthForm.patchValue({ timezone: 'Asia/Kolkata' });
        } else {
          this.errorMessage.set(this.authService.formatErrorMessage(err));
          this.isEditingMode.set(true);
        }
        this.isLoadingDetails.set(false);
      }
    });
  }

  onPlaceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value || '';
    const results = this.birthDetailService.searchPlaces(query);
    this.placeSuggestions.set(results);
    this.showPlaceDropdown.set(results.length > 0);
  }

  selectPlace(suggestion: PlaceSuggestion): void {
    this.birthForm.patchValue({
      place_of_birth: suggestion.name,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      timezone: suggestion.timezone
    });
    this.showPlaceDropdown.set(false);
  }

  enableEdit(): void {
    this.isEditingMode.set(true);
  }

  cancelEdit(): void {
    if (this.isExisting()) {
      this.isEditingMode.set(false);
    }
  }

  continueToReading(): void {
    this.router.navigate(['/reading/prepare']);
  }

  onSubmit(): void {
    if (this.birthForm.invalid || this.isSaving()) {
      this.birthForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const formVal = this.birthForm.getRawValue();
    let timeStr = formVal.time_of_birth || '12:00';
    if (timeStr.length === 5) {
      timeStr = `${timeStr}:00`;
    }

    if (this.isExisting()) {
      const updatePayload: BirthDetailUpdate = {
        date_of_birth: formVal.date_of_birth!,
        time_of_birth: timeStr,
        place_of_birth: formVal.place_of_birth!,
        latitude: formVal.latitude,
        longitude: formVal.longitude,
        timezone: formVal.timezone
      };

      this.birthDetailService.updateBirthDetails(updatePayload).subscribe({
        next: (updated) => {
          this.isSaving.set(false);
          this.savedDetails.set(updated);
          this.journeyService.setBirthDetails(updated);
          this.triggerSuccessAndRedirect();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.authService.formatErrorMessage(err));
        }
      });
    } else {
      const createPayload: BirthDetailCreate = {
        date_of_birth: formVal.date_of_birth!,
        time_of_birth: timeStr,
        place_of_birth: formVal.place_of_birth!,
        latitude: formVal.latitude,
        longitude: formVal.longitude,
        timezone: formVal.timezone
      };

      this.birthDetailService.createBirthDetails(createPayload).subscribe({
        next: (created) => {
          this.isSaving.set(false);
          this.isExisting.set(true);
          this.savedDetails.set(created);
          this.journeyService.setBirthDetails(created);
          this.triggerSuccessAndRedirect();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.authService.formatErrorMessage(err));
        }
      });
    }
  }

  triggerSuccessAndRedirect(): void {
    this.successToast.set('Birth details saved successfully.');
    setTimeout(() => {
      this.router.navigate(['/reading/prepare']);
    }, 600);
  }

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    if (!this.isDeleting()) {
      this.showDeleteModal.set(false);
    }
  }

  confirmDelete(): void {
    this.isDeleting.set(true);
    this.birthDetailService.deleteBirthDetails().subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.showDeleteModal.set(false);
        this.isExisting.set(false);
        this.savedDetails.set(null);
        this.journeyService.setBirthDetails(null);
        this.birthForm.reset({ timezone: 'Asia/Kolkata' });
        this.isEditingMode.set(true);
        this.successToast.set('Birth details removed.');
        setTimeout(() => {
          this.successToast.set(null);
        }, 3000);
      },
      error: (err) => {
        this.isDeleting.set(false);
        this.showDeleteModal.set(false);
        this.errorMessage.set(this.authService.formatErrorMessage(err));
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/explore']);
  }
}
