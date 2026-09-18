import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { GuidanceService } from '../../../core/services/guidance.service';
import { ReadingJourneyService, GuidedTopicId } from '../../../core/services/reading-journey.service';
import { Guidance } from '../../../core/models/guidance.model';

@Component({
  selector: 'app-reading-history',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './reading-history.component.html',
  styleUrl: './reading-history.component.scss'
})
export class ReadingHistoryComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly guidanceService = inject(GuidanceService);
  private readonly journeyService = inject(ReadingJourneyService);

  readonly historyItems = signal<Guidance[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  // Edit State
  readonly editingItem = signal<Guidance | null>(null);
  readonly editProblemText = signal<string>('');
  readonly isUpdating = signal<boolean>(false);

  // Delete State
  readonly deletingItem = signal<Guidance | null>(null);
  readonly isDeleting = signal<boolean>(false);

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.guidanceService.getGuidanceHistory().subscribe({
      next: (items) => {
        this.isLoading.set(false);
        this.historyItems.set(items || []);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Unable to load guidance history. Please try again.');
      }
    });
  }

  openReading(item: Guidance): void {
    this.journeyService.setGuidanceResult(item);
    this.journeyService.setQuestion(item.problem);
    if (item.category) {
      if (item.category.includes('MARRIAGE')) {
        this.journeyService.setTopic('Marriage');
      } else if (item.category.includes('CAREER')) {
        this.journeyService.setTopic('Career');
      } else if (item.category.includes('FINANCE')) {
        this.journeyService.setTopic('Money / Finance');
      }
    }
    this.router.navigate(['/reading/result']);
  }

  startNewReading(): void {
    this.journeyService.resetJourney();
    this.router.navigate(['/explore']);
  }

  openEditModal(event: Event, item: Guidance): void {
    event.stopPropagation();
    this.editingItem.set(item);
    this.editProblemText.set(item.problem);
  }

  closeEditModal(): void {
    this.editingItem.set(null);
  }

  saveEdit(): void {
    const item = this.editingItem();
    const updated = this.editProblemText().trim();
    if (!item || !updated || this.isUpdating()) {
      return;
    }

    this.isUpdating.set(true);
    this.guidanceService.updateGuidance(item.id, { problem: updated }).subscribe({
      next: (result) => {
        this.isUpdating.set(false);
        this.historyItems.update(list => list.map(g => (g.id === result.id ? { ...g, problem: result.problem } : g)));
        this.closeEditModal();
      },
      error: () => {
        this.isUpdating.set(false);
      }
    });
  }

  openDeleteModal(event: Event, item: Guidance): void {
    event.stopPropagation();
    this.deletingItem.set(item);
  }

  closeDeleteModal(): void {
    this.deletingItem.set(null);
  }

  confirmDelete(): void {
    const item = this.deletingItem();
    if (!item || this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);
    this.guidanceService.deleteGuidance(item.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.historyItems.update(list => list.filter(g => g.id !== item.id));
        this.closeDeleteModal();
      },
      error: () => {
        this.isDeleting.set(false);
      }
    });
  }
}
