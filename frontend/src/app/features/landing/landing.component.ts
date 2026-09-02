import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';

interface FeatureCard {
  icon: string;
  title: string;
  tag: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  private readonly authService = inject(AuthService);
  readonly isAuthenticated = this.authService.isAuthenticated;

  readonly features: FeatureCard[] = [
    {
      icon: '☀️',
      title: 'Daily Horoscope',
      tag: 'Real-time',
      description: 'Accurate daily celestial forecasts crafted around your exact lagna and planetary alignments.'
    },
    {
      icon: '🪐',
      title: 'Vedic Kundli',
      tag: 'Ancient Wisdom',
      description: 'Generate deep Janam Patrika charts revealing 12 astrological houses, dasha cycles, and karmic strengths.'
    },
    {
      icon: '✨',
      title: 'Celestial Compatibility',
      tag: 'Synastry',
      description: 'Discover cosmic affinity in love, partnerships, and friendships with detailed Guna Milan scores.'
    },
    {
      icon: '🌙',
      title: 'Planetary Transits',
      tag: 'Gochar',
      description: 'Track ongoing planetary movements and retrograde periods impacting your astrological houses.'
    },
    {
      icon: '🔮',
      title: 'Ask AstroGuide',
      tag: 'Intelligence',
      description: 'Seek clarity on relationships, career timing, and spiritual decisions through insightful astrological synthesis.'
    },
    {
      icon: '🌐',
      title: 'Multi-Language Support',
      tag: 'Localized',
      description: 'Experience your celestial readings seamlessly in your preferred native language.'
    }
  ];

  readonly zodiacSigns = [
    { name: 'Aries', symbol: '♈', element: 'Fire' },
    { name: 'Taurus', symbol: '♉', element: 'Earth' },
    { name: 'Gemini', symbol: '♊', element: 'Air' },
    { name: 'Cancer', symbol: '♋', element: 'Water' },
    { name: 'Leo', symbol: '♌', element: 'Fire' },
    { name: 'Virgo', symbol: '♍', element: 'Earth' },
    { name: 'Libra', symbol: '♎', element: 'Air' },
    { name: 'Scorpio', symbol: '♏', element: 'Water' },
    { name: 'Sagittarius', symbol: '♐', element: 'Fire' },
    { name: 'Capricorn', symbol: '♑', element: 'Earth' },
    { name: 'Aquarius', symbol: '♒', element: 'Air' },
    { name: 'Pisces', symbol: '♓', element: 'Water' }
  ];
}
