import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from './language.service';
import { BirthDetailService } from './birth-detail.service';
import { GuidanceService } from './guidance.service';
import { AuthService } from './auth.service';
import { Language } from '../models/language.model';
import { BirthDetail } from '../models/birth-detail.model';
import { Guidance, ChatMessage } from '../models/guidance.model';
import { AstrologyMarriageAnalysis } from '../models/astrology.model';

export type GuidedTopicId =
  | 'Marriage'
  | 'Career'
  | 'Money / Finance'
  | 'Relationships'
  | 'Health / Wellness'
  | 'Family'
  | 'Travel / Abroad'
  | 'General Guidance';

export interface TopicOption {
  id: GuidedTopicId;
  label: string;
  icon: string;
  description: string;
  suggestedQuestions: {
    en: string;
    ml: string;
    hi?: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReadingJourneyService {
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  private readonly birthDetailService = inject(BirthDetailService);
  private readonly guidanceService = inject(GuidanceService);
  private readonly authService = inject(AuthService);

  // Topics supported by the application and mapped to the backend question classifier
  readonly availableTopics: TopicOption[] = [
    {
      id: 'Marriage',
      label: 'Marriage',
      icon: '💍',
      description: 'Marriage timing, planetary alignments, 7th house and dasha indications.',
      suggestedQuestions: [
        {
          en: 'When will I get married?',
          ml: 'Ente kalyanam eppol nadakkum?',
          hi: 'मेरी शादी कब होगी?'
        },
        {
          en: 'What are the supportive periods for marriage in my chart?',
          ml: 'വിവാഹത്തിന് അനുകൂലമായ സമയം എപ്പോഴാണ്?',
          hi: 'विवाह के लिए कौन सा समय अनुकूल है?'
        },
        {
          en: 'How will my married life be?',
          ml: 'Ente relationship engane ayirikkum?',
          hi: 'मेरा वैवाहिक जीवन कैसा रहेगा?'
        }
      ]
    },
    {
      id: 'Career',
      label: 'Career',
      icon: '💼',
      description: 'Professional growth, job transitions, and leadership periods.',
      suggestedQuestions: [
        {
          en: 'How will my career progress in the coming years?',
          ml: 'Ente career engane ayirikkum?',
          hi: 'मेरा करियर कैसा रहेगा?'
        },
        {
          en: 'Is this the right time to change my job or career path?',
          ml: 'ജോലി മാറ്റാൻ പറ്റിയ സമയമാണോ?',
          hi: 'क्या यह नौकरी बदलने का सही समय है?'
        }
      ]
    },
    {
      id: 'Money / Finance',
      label: 'Money / Finance',
      icon: '💰',
      description: 'Wealth accumulation, investments, and financial cycles.',
      suggestedQuestions: [
        {
          en: 'What does my chart indicate about wealth and financial stability?',
          ml: 'സാമ്പത്തിക സ്ഥിതി മെച്ചപ്പെടാൻ സാധ്യതയുണ്ടോ?',
          hi: 'मेरी आर्थिक स्थिति कब सुधरेगी?'
        },
        {
          en: 'When will I experience financial growth?',
          ml: 'സാമ്പത്തിക വളർച്ച എപ്പോൾ ഉണ്ടാകും?',
          hi: 'धन लाभ के क्या योग हैं?'
        }
      ]
    },
    {
      id: 'Relationships',
      label: 'Relationships',
      icon: '💕',
      description: 'Partnership harmony, emotional bonds, and compatibility.',
      suggestedQuestions: [
        {
          en: 'What does my chart reveal about long-term relationships?',
          ml: 'ബന്ധങ്ങളിൽ ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ എന്തൊക്കെയാണ്?',
          hi: 'रिश्तों के मामले में मेरी कुंडली क्या कहती है?'
        }
      ]
    },
    {
      id: 'Health / Wellness',
      label: 'Health / Wellness',
      icon: '🌿',
      description: 'Vitality, planetary influences on well-being, and energetic balance.',
      suggestedQuestions: [
        {
          en: 'What astrological factors should I be mindful of for wellness?',
          ml: 'ആരോഗ്യ കാര്യങ്ങളിൽ ശ്രദ്ധിക്കേണ്ടത് എന്തൊക്കെയാണ്?',
          hi: 'स्वास्थ्य के प्रति क्या सावधानी रखनी चाहिए?'
        }
      ]
    },
    {
      id: 'Family',
      label: 'Family',
      icon: '🏡',
      description: 'Domestic harmony, parents, and family peace.',
      suggestedQuestions: [
        {
          en: 'How do planetary transits influence my home and family peace?',
          ml: 'കുടുംബ സമാധാനത്തെക്കുറിച്ച് ജാതകം എന്ത് പറയുന്നു?',
          hi: 'पारिवारिक सुख के बारे में ग्रह क्या संकेत देते हैं?'
        }
      ]
    },
    {
      id: 'Travel / Abroad',
      label: 'Travel / Abroad',
      icon: '✈️',
      description: 'Foreign opportunities, overseas relocation, and journeys.',
      suggestedQuestions: [
        {
          en: 'Are there strong opportunities to travel or settle abroad?',
          ml: 'Enikku abroad pokan chance undo?',
          hi: 'क्या विदेश जाने के योग हैं?'
        }
      ]
    },
    {
      id: 'General Guidance',
      label: 'General Guidance',
      icon: '✦',
      description: 'Current dasha influence, overall life path, and planetary alignment.',
      suggestedQuestions: [
        {
          en: 'What is the primary planetary focus in my life right now?',
          ml: 'ഇപ്പോൾ എന്റെ ജീവിതത്തിലെ പ്രധാന ഗ്രഹ സ്വാധീനം എന്താണ്?',
          hi: 'वर्तमान समय में कौन सा ग्रह सबसे प्रभावी है?'
        }
      ]
    }
  ];

  private readonly guidanceStorageKey = 'astroguide_last_guidance';
  private readonly chatMessagesStorageKey = 'astroguide_chat_messages';

  private getInitialStoredGuidance(): Guidance | null {
    try {
      const item = sessionStorage.getItem(this.guidanceStorageKey);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  private readonly initialGuidance = this.getInitialStoredGuidance();

  private getInitialStoredMessages(): ChatMessage[] {
    try {
      const item = sessionStorage.getItem(this.chatMessagesStorageKey);
      if (item) {
        return JSON.parse(item);
      }
      if (this.initialGuidance && this.initialGuidance.problem) {
        const list: ChatMessage[] = [
          {
            id: `user-${this.initialGuidance.id || Date.now()}`,
            role: 'user',
            content: this.initialGuidance.problem,
            createdAt: this.initialGuidance.created_at || new Date().toISOString(),
            category: this.initialGuidance.category
          }
        ];
        if (this.initialGuidance.message) {
          const rawAnalysis = this.initialGuidance.analysis as any;
          list.push({
            id: `assistant-${this.initialGuidance.id || Date.now()}`,
            role: 'assistant',
            content: this.initialGuidance.message,
            createdAt: this.initialGuidance.updated_at || new Date().toISOString(),
            category: this.initialGuidance.category,
            analysis: this.initialGuidance.analysis,
            timingWindows: rawAnalysis?.timing_windows || []
          });
        }
        return list;
      }
      return [];
    } catch {
      return [];
    }
  }

  // Journey State Signals
  readonly selectedLanguage = this.languageService.currentLanguage;
  readonly selectedTopic = signal<GuidedTopicId>('Marriage');
  readonly birthDetails = signal<BirthDetail | null>(null);
  readonly currentQuestion = signal<string>(this.initialGuidance?.problem || 'Ente kalyanam eppol nadakkum?');
  readonly isLoading = signal<boolean>(false);
  readonly loadingPhaseIndex = signal<number>(0);
  readonly readingResult = signal<string | null>(this.initialGuidance?.message || null);
  readonly astrologyAnalysis = signal<AstrologyMarriageAnalysis | null>(this.initialGuidance?.analysis as AstrologyMarriageAnalysis || null);
  readonly lastGuidance = signal<Guidance | null>(this.initialGuidance);
  readonly guidanceError = signal<string | null>(null);
  readonly chatMessages = signal<ChatMessage[]>(this.getInitialStoredMessages());

  // Loading Sequence Messages
  readonly loadingMessages = [
    'Understanding your reading...',
    'Looking at your chart...',
    'Preparing your guidance...'
  ];

  readonly currentTopicOption = computed(() => {
    const current = this.selectedTopic();
    return this.availableTopics.find(t => t.id === current) || this.availableTopics[0];
  });

  // Suggested questions tailored to user's selected language
  readonly suggestedQuestionsForLanguage = computed(() => {
    const topic = this.currentTopicOption();
    const langCode = this.languageService.currentLanguageCode().toLowerCase();
    return topic.suggestedQuestions.map(sq => {
      if (langCode.startsWith('ml') && sq.ml) return sq.ml;
      if (langCode.startsWith('hi') && sq.hi) return sq.hi;
      return sq.en;
    });
  });

  setTopic(topic: GuidedTopicId): void {
    this.selectedTopic.set(topic);
    // Set a default sensible question for the topic
    const suggestions = this.suggestedQuestionsForLanguage();
    if (suggestions.length > 0) {
      this.currentQuestion.set(suggestions[0]);
    }
  }

  setQuestion(q: string): void {
    this.currentQuestion.set(q);
  }

  setBirthDetails(details: BirthDetail | null): void {
    this.birthDetails.set(details);
  }

  addChatMessage(message: ChatMessage): void {
    this.chatMessages.update(msgs => {
      const updated = [...msgs, message];
      try {
        sessionStorage.setItem(this.chatMessagesStorageKey, JSON.stringify(updated));
      } catch {
        // Ignore storage quotas
      }
      return updated;
    });
  }

  setChatMessages(messages: ChatMessage[]): void {
    this.chatMessages.set(messages);
    try {
      sessionStorage.setItem(this.chatMessagesStorageKey, JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }

  clearChatMessages(): void {
    this.chatMessages.set([]);
    try {
      sessionStorage.removeItem(this.chatMessagesStorageKey);
    } catch {
      // Ignore
    }
  }

  setGuidanceResult(guidance: Guidance): void {
    this.lastGuidance.set(guidance);
    this.readingResult.set(guidance.message || null);
    this.astrologyAnalysis.set(guidance.analysis as AstrologyMarriageAnalysis || null);
    if (guidance.problem) {
      this.currentQuestion.set(guidance.problem);
    }

    // If chatMessages is empty or doesn't have this guidance, initialize it
    const existing = this.chatMessages();
    const hasTurn = existing.some(m => m.id === `assistant-${guidance.id}` || m.content === guidance.message);
    if (!hasTurn && guidance.problem) {
      const turns: ChatMessage[] = [];
      const hasUserMsg = existing.some(m => m.role === 'user' && m.content === guidance.problem);
      if (!hasUserMsg) {
        turns.push({
          id: `user-${guidance.id || Date.now()}`,
          role: 'user',
          content: guidance.problem,
          createdAt: guidance.created_at || new Date().toISOString(),
          category: guidance.category
        });
      }
      if (guidance.message) {
        const rawAnalysis = guidance.analysis as any;
        turns.push({
          id: `assistant-${guidance.id || Date.now()}`,
          role: 'assistant',
          content: guidance.message,
          createdAt: guidance.updated_at || new Date().toISOString(),
          category: guidance.category,
          analysis: guidance.analysis,
          timingWindows: rawAnalysis?.timing_windows || []
        });
      }
      if (turns.length > 0) {
        this.setChatMessages([...existing, ...turns]);
      }
    }

    try {
      sessionStorage.setItem(this.guidanceStorageKey, JSON.stringify(guidance));
    } catch {
      // Ignore storage errors in restricted private browsing
    }
  }

  resetJourney(): void {
    this.readingResult.set(null);
    this.astrologyAnalysis.set(null);
    this.lastGuidance.set(null);
    this.guidanceError.set(null);
    this.isLoading.set(false);
    this.clearChatMessages();
    try {
      sessionStorage.removeItem(this.guidanceStorageKey);
    } catch {
      // Ignore
    }
  }
}
