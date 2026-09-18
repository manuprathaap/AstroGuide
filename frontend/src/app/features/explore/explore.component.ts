import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ReadingJourneyService, GuidedTopicId, TopicOption } from '../../core/services/reading-journey.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent {
  private readonly router = inject(Router);
  private readonly journeyService = inject(ReadingJourneyService);

  readonly topics = this.journeyService.availableTopics;
  readonly selectedTopic = this.journeyService.selectedTopic;

  selectTopic(topicId: GuidedTopicId): void {
    this.journeyService.setTopic(topicId);
  }

  onContinue(): void {
    this.router.navigate(['/birth-details']);
  }
}
