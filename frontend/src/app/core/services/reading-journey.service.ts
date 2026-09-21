import { Injectable, inject, signal, computed, effect } from '@angular/core';
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
    hi: string;
    ta: string;
    te: string;
    kn: string;
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

  readonly availableTopics: TopicOption[] = [
    {
      id: 'Marriage',
      label: 'Marriage',
      icon: '💍',
      description: 'Marriage timing, planetary alignments, 7th house and dasha indications.',
      suggestedQuestions: [
        {
          en: 'When will I get married?',
          ml: 'എന്റെ വിവാഹം എപ്പോൾ നടക്കും?',
          hi: 'मेरी शादी कब होगी?',
          ta: 'எனக்கு எப்போது திருமணம் நடக்கும்?',
          te: 'నా వివాహం ఎప్పుడు జరుగుతుంది?',
          kn: 'ನನ್ನ ಮದುವೆ ಯಾವಾಗ ಆಗುತ್ತದೆ?'
        },
        {
          en: 'What are the supportive periods for marriage in my chart?',
          ml: 'വിവാഹത്തിന് അനുകൂലമായ സമയം എപ്പോഴാണ്?',
          hi: 'विवाह के लिए कौन सा समय अनुकूल है?',
          ta: 'திருமணத்திற்கு சாதகமான காலம் எது?',
          te: 'వివాహానికి అనుకూలమైన సమయం ఏది?',
          kn: 'ವಿವಾಹಕ್ಕೆ ಅನುಕೂಲಕರವಾದ ಸಮಯ ಯಾವುದು?'
        },
        {
          en: 'How will my married life be?',
          ml: 'എന്റെ ദാമ്പത്യ ജീവിതം എങ്ങനെയായിരിക്കും?',
          hi: 'मेरा वैवाहिक जीवन कैसा रहेगा?',
          ta: 'என் திருமண வாழ்க்கை எப்படி இருக்கும்?',
          te: 'నా వైవాహిక జీవితం ఎలా ఉంటుంది?',
          kn: 'ನನ್ನ ವೈವಾಹಿಕ ಜೀವನ ಹೇಗಿರುತ್ತದೆ?'
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
          ml: 'വരും വർഷങ്ങളിൽ എന്റെ കരിയർ എങ്ങനെയായിരിക്കും?',
          hi: 'मेरा करियर कैसा रहेगा?',
          ta: 'வரும் ஆண்டுகளில் என் தொழில் வளர்ச்சி எப்படி இருக்கும்?',
          te: 'రాబోయే సంవత్సరాల్లో నా కెరీర్ ఎలా ఉంటుంది?',
          kn: 'ಮುಂದಿನ ವರ್ಷಗಳಲ್ಲಿ ನನ್ನ ವೃತ್ತಿಜೀವನ ಹೇಗಿರುತ್ತದೆ?'
        },
        {
          en: 'Is this the right time to change my job or career path?',
          ml: 'ജോലി മാറ്റാൻ പറ്റിയ സമയമാണോ?',
          hi: 'क्या यह नौकरी बदलने का सही समय है?',
          ta: 'வேலை மாறுவதற்கு இது சரியான நேரமா?',
          te: 'ఉద్యోగం మారడానికి ఇది సరైన సమయమా?',
          kn: 'ಉದ್ಯೋಗ ಬದಲಾಯಿಸಲು ಇದು ಸರಿಯಾದ ಸಮಯವೇ?'
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
          hi: 'मेरी आर्थिक स्थिति कब सुधरेगी?',
          ta: 'என் நிதி நிலைமை எப்போது சீரடையும்?',
          te: 'నా ఆర్థిక పరిస్థితి ఎప్పుడు మెరుగుపడుతుంది?',
          kn: 'ಆರ್ಥಿಕ ಪರಿಸ್ಥಿತಿ ಯಾವಾಗ ಸುಧಾರಿಸುತ್ತದೆ?'
        },
        {
          en: 'When will I experience financial growth?',
          ml: 'സാമ്പത്തിക വളർച്ച എപ്പോൾ ഉണ്ടാകും?',
          hi: 'धन लाभ के क्या योग हैं?',
          ta: 'பண வரவு எப்போது அதிகரிக்கும்?',
          te: 'ధన లాభం ఎప్పుడు కలుగుతుంది?',
          kn: 'ಧನ ಲಾಭ ಯಾವಾಗ ಆಗುತ್ತದೆ?'
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
          hi: 'रिश्तों के मामले में मेरी कुंडली क्या कहती है?',
          ta: 'உறவுகளில் நான் கவனிக்க வேண்டியவை யாவை?',
          te: 'సంబంధాలలో నేను జాగ్రత్త వహించాల్సినవి ఏమిటి?',
          kn: 'ಸಂಬಂಧಗಳಲ್ಲಿ ನಾನು ಗಮನಿಸಬೇಕಾದ ಅಂಶಗಳು ಯಾವುವು?'
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
          hi: 'स्वास्थ्य के प्रति क्या सावधानी रखनी चाहिए?',
          ta: 'ஆரோக்கியத்தில் நான் கவனிக்க வேண்டியவை என்ன?',
          te: 'ఆరోగ్యం విషయంలో ఎలాంటి జాగ్రత్తలు తీసుకోవాలి?',
          kn: 'ಆರೋಗ್ಯದ ವಿಷಯದಲ್ಲಿ ಯಾವ ಎಚ್ಚರಿಕೆ ವಹಿಸಬೇಕು?'
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
          hi: 'पारिवारिक सुख के बारे में ग्रह क्या संकेत देते हैं?',
          ta: 'குடும்ப அமைதி பற்றி கிரகங்கள் என்ன கூறுகின்றன?',
          te: 'కుటుంబ శాంతి గురించి గ్రహాలు ఏమి సూచిస్తున్నాయి?',
          kn: 'ಕುಟುಂಬ ಶಾಂತಿಯ ಬಗ್ಗೆ ಗ್ರಹಗಳು ಏನು ಹೇಳುತ್ತವೆ?'
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
          ml: 'വിദേശത്ത് പോകാൻ സാധ്യതയുണ്ടോ?',
          hi: 'क्या विदेश जाने के योग हैं?',
          ta: 'வெளிநாடு செல்ல வாய்ப்பு உள்ளதா?',
          te: 'విదేశాలకు వెళ్లే అవకాశాలు ఉన్నాయా?',
          kn: 'ವಿದೇಶಕ್ಕೆ ಹೋಗಲು ಬಲವಾದ ಅವಕಾಶಗಳಿವೆಯೇ?'
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
          hi: 'वर्तमान समय में कौन सा ग्रह सबसे प्रभावी है?',
          ta: 'தற்போது என் வாழ்க்கையில் எந்த கிரகம் அதிகம் ஆதிக்கம் செலுத்துகிறது?',
          te: 'ప్రస్తుతం నా జీవితంలో ఏ గ్రహం అత్యంత ప్రభావవంతంగా ఉంది?',
          kn: 'ಪ್ರಸ್ತುತ ನನ್ನ ಜೀವನದಲ್ಲಿ ಯಾವ ಗ್ರಹವು ಹೆಚ್ಚು ಪ್ರಭಾವಶಾಲಿಯಾಗಿದೆ?'
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
  readonly currentQuestion = signal<string>(this.initialGuidance?.problem || '');
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
      if (langCode.startsWith('ml')) return sq.ml;
      if (langCode.startsWith('hi')) return sq.hi;
      if (langCode.startsWith('ta')) return sq.ta;
      if (langCode.startsWith('te')) return sq.te;
      if (langCode.startsWith('kn')) return sq.kn;
      return sq.en;
    });
  });

  constructor() {
    // When language or topic changes, dynamically update the default suggested question
    effect(() => {
      const suggestions = this.suggestedQuestionsForLanguage();
      const current = this.currentQuestion();
      if (!current || this.isDefaultOrSuggestedQuestion(current)) {
        if (suggestions.length > 0) {
          this.currentQuestion.set(suggestions[0]);
        }
      }
    });
  }

  /**
   * Helper to check if a question matches any known default suggestion across all topics/languages
   */
  private isDefaultOrSuggestedQuestion(q: string): boolean {
    const trimmed = q.trim();
    if (trimmed === 'Ente kalyanam eppol nadakkum?') return true;
    for (const topic of this.availableTopics) {
      for (const sq of topic.suggestedQuestions) {
        if (
          sq.en === trimmed ||
          sq.ml === trimmed ||
          sq.hi === trimmed ||
          sq.ta === trimmed ||
          sq.te === trimmed ||
          sq.kn === trimmed
        ) {
          return true;
        }
      }
    }
    return false;
  }

  setTopic(topic: GuidedTopicId): void {
    this.selectedTopic.set(topic);
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
