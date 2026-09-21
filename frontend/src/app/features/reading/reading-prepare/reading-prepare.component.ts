import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ReadingJourneyService } from '../../../core/services/reading-journey.service';
import { TranslationService } from '../../../core/services/translation.service';

interface PreparationPillar {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-reading-prepare',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './reading-prepare.component.html',
  styleUrl: './reading-prepare.component.scss'
})
export class ReadingPrepareComponent {
  private readonly router = inject(Router);
  private readonly journeyService = inject(ReadingJourneyService);
  private readonly translationService = inject(TranslationService);

  readonly t = this.translationService.t;
  readonly selectedTopic = this.journeyService.selectedTopic;
  readonly birthDetails = this.journeyService.birthDetails;

  readonly pillars = computed<PreparationPillar[]>(() => {
    const p = this.t().readingPrepare.pillars;
    return [
      {
        icon: '🪐',
        title: p.birthDetails.title,
        description: p.birthDetails.description
      },
      {
        icon: '💬',
        title: p.question.title,
        description: p.question.description
      },
      {
        icon: '📜',
        title: p.astrologyAnalysis.title,
        description: p.astrologyAnalysis.description
      },
      {
        icon: '✦',
        title: p.personalizedGuidance.title,
        description: p.personalizedGuidance.description
      }
    ];
  });

  onContinue(): void {
    this.router.navigate(['/reading/question']);
  }

  onBack(): void {
    this.router.navigate(['/birth-details']);
  }
}
