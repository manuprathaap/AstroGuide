import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ReadingJourneyService, GuidedTopicId } from '../../core/services/reading-journey.service';
import { TranslationService } from '../../core/services/translation.service';

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
  private readonly translationService = inject(TranslationService);

  readonly t = this.translationService.t;
  readonly selectedTopic = this.journeyService.selectedTopic;

  readonly localizedTopics = computed(() => {
    const raw = this.journeyService.availableTopics;
    const tExplore = this.t().explore.topics;
    return raw.map(topic => {
      let localized = { label: topic.label, description: topic.description };
      switch (topic.id) {
        case 'Marriage': localized = tExplore.marriage; break;
        case 'Career': localized = tExplore.career; break;
        case 'Money / Finance': localized = tExplore.money; break;
        case 'Relationships': localized = tExplore.relationships; break;
        case 'Health / Wellness': localized = tExplore.health; break;
        case 'Family': localized = tExplore.family; break;
        case 'Travel / Abroad': localized = tExplore.travel; break;
        case 'General Guidance': localized = tExplore.general; break;
      }
      return {
        id: topic.id,
        icon: topic.icon,
        label: localized?.label || topic.label,
        description: localized?.description || topic.description
      };
    });
  });

  selectTopic(topicId: GuidedTopicId): void {
    this.journeyService.setTopic(topicId);
  }

  onContinue(): void {
    this.router.navigate(['/birth-details']);
  }
}
