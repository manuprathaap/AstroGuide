import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ReadingJourneyService } from '../../../core/services/reading-journey.service';

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

  readonly selectedTopic = this.journeyService.selectedTopic;
  readonly birthDetails = this.journeyService.birthDetails;

  readonly pillars: PreparationPillar[] = [
    {
      icon: '🪐',
      title: 'Your birth details',
      description: 'Your precise date, time, and location calculate your unique planetary positions, lagna, and house cusps.'
    },
    {
      icon: '💬',
      title: 'Your question',
      description: 'Your chosen topic and specific question focus the interpretation on the life areas that matter most to you.'
    },
    {
      icon: '📜',
      title: 'Your astrology analysis',
      description: 'Traditional Vedic planetary strengths, dashas, antardashas, and supportive timing factors are evaluated.'
    },
    {
      icon: '✦',
      title: 'Your personalized guidance',
      description: 'The technical astrology findings are translated into clear, conversational, and thoughtful guidance in your language.'
    }
  ];

  onContinue(): void {
    this.router.navigate(['/reading/question']);
  }

  onBack(): void {
    this.router.navigate(['/birth-details']);
  }
}
