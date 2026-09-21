export interface TopicTranslation {
  label: string;
  description: string;
}

export interface ExploreTranslations {
  stepBadge: string;
  title: string;
  subtitle: string;
  continueBtn: string;
  topics: {
    marriage: TopicTranslation;
    career: TopicTranslation;
    money: TopicTranslation;
    relationships: TopicTranslation;
    health: TopicTranslation;
    family: TopicTranslation;
    travel: TopicTranslation;
    general: TopicTranslation;
  };
}

export interface PillarTranslation {
  title: string;
  description: string;
}

export interface ReadingPrepareTranslations {
  stepBadge: string;
  title: string;
  subtitle: string;
  pillars: {
    birthDetails: PillarTranslation;
    question: PillarTranslation;
    astrologyAnalysis: PillarTranslation;
    personalizedGuidance: PillarTranslation;
  };
  backBtn: string;
  continueBtn: string;
}

export interface ReadingQuestionTranslations {
  stepBadge: string;
  topicLabel: string;
  title: string;
  subtitle: string;
  inputPlaceholder: string;
  suggestedIn: string;
  loadingMessages: string[];
  loadingSubtext: string;
  backBtn: string;
  askBtn: string;
}

export interface ReadingResultTranslations {
  askAnother: string;
  viewHistory: string;
  currentInquiry: string;
  category: string;
  yourQuestion: string;
  birthProfile: string;
  newQuestion: string;
  plan: {
    name: string;
    badge: string;
    remaining: string;
    status: string;
  };
  chat: {
    title: string;
    subtitle: string;
    liveSession: string;
    you: string;
    readingChart: string;
    suggestedFollowUps: string;
    inputPlaceholder: string;
    send: string;
  };
  timing: {
    supportivePeriods: string;
  };
  astrologyDetails: {
    toggle: string;
    seventhHouse: string;
    seventhLord: string;
    venus: string;
    jupiter: string;
    mahadasha: string;
    antardasha: string;
    house: string;
    supportingFactors: string;
    cautionFactors: string;
  };
  guidanceTabs: {
    heading: string;
    subheading: string;
    curiousAbout: string;
    askAbout: string;
    tabs: {
      career: string;
      money: string;
      relationships: string;
      family: string;
      travel: string;
      health: string;
      growth: string;
    };
  };
  palm: {
    title: string;
    desc: string;
    btn: string;
    badge: string;
    alertMessage: string;
  };
  recommendations: {
    heading: string;
    career: string;
    money: string;
    travel: string;
  };
  categories: {
    marriageTiming: string;
    marriage: string;
    careerTiming: string;
    career: string;
    money: string;
    relationships: string;
    family: string;
    travel: string;
    health: string;
    education: string;
    business: string;
    general: string;
  };
  followUps: {
    marriage: string[];
    career: string[];
    finance: string[];
    travel: string[];
    general: string[];
  };
}

export interface ReadingHistoryTranslations {
  title: string;
  subtitle: string;
  newQuestion: string;
  loading: string;
  emptyTitle: string;
  emptyDesc: string;
  startReading: string;
  viewFullReading: string;
  editModalTitle: string;
  deleteModalTitle: string;
  deleteModalDesc: string;
  cancel: string;
  save: string;
  delete: string;
  saving: string;
  deleting: string;
}

export interface LandingTranslations {
  badge: string;
  heroTitle: string;
  heroTitleGold: string;
  heroSubtext: string;
  dashboardBtn: string;
  getStartedBtn: string;
  signInBtn: string;
  miniProblemTitle: string;
  miniProblemSub: string;
  miniChartTitle: string;
  miniChartSub: string;
  miniPalmTitle: string;
  miniPalmSub: string;
  sectionTag: string;
  sectionTitle: string;
  sectionSubtitle: string;
  pillarProblemTitle: string;
  pillarProblemDesc: string;
  pillarProblemBtn: string;
  pillarChartTitle: string;
  pillarChartDesc: string;
  pillarChartBtn: string;
  pillarPalmTitle: string;
  pillarPalmDesc: string;
  pillarPalmBtn: string;
  calloutTag: string;
  calloutTitle: string;
  calloutDesc: string;
  changeLangBtn: string;
  getStartedLangBtn: string;
}

export interface FooterTranslations {
  brandDesc: string;
  quote: string;
  exploration: string;
  guides: string;
  trust: string;
  copyright: string;
  disclaimer: string;
}

export interface JourneyTranslations {
  tagline: string;
  explore: ExploreTranslations;
  readingPrepare: ReadingPrepareTranslations;
  readingQuestion: ReadingQuestionTranslations;
  readingResult: ReadingResultTranslations;
  readingHistory: ReadingHistoryTranslations;
  landing: LandingTranslations;
  footer: FooterTranslations;
}

// ----------------------------------------------------------------------
// ENGLISH
// ----------------------------------------------------------------------
export const EN_JOURNEY_TRANSLATIONS: JourneyTranslations = {
  tagline: 'Personal Vedic Astrology & Guidance',
  explore: {
    stepBadge: 'STEP 2 OF 5 · EXPLORE TOPIC',
    title: 'What would you like to explore today?',
    subtitle: "Tell us what you're curious about.",
    continueBtn: 'Continue',
    topics: {
      marriage: {
        label: 'Marriage',
        description: 'Marriage timing, planetary alignments, 7th house and dasha indications.'
      },
      career: {
        label: 'Career',
        description: 'Professional growth, job transitions, and leadership periods.'
      },
      money: {
        label: 'Money / Finance',
        description: 'Wealth accumulation, investments, and financial cycles.'
      },
      relationships: {
        label: 'Relationships',
        description: 'Partnership harmony, emotional bonds, and compatibility.'
      },
      health: {
        label: 'Health / Wellness',
        description: 'Vitality, planetary influences on well-being, and energetic balance.'
      },
      family: {
        label: 'Family',
        description: 'Domestic harmony, parents, and family peace.'
      },
      travel: {
        label: 'Travel / Abroad',
        description: 'Foreign opportunities, overseas relocation, and journeys.'
      },
      general: {
        label: 'General Guidance',
        description: 'Current dasha influence, overall life path, and planetary alignment.'
      }
    }
  },
  readingPrepare: {
    stepBadge: 'STEP 4 OF 5 · HOW YOUR READING WORKS',
    title: 'Understanding your reading',
    subtitle: 'Here is how AstroGuide creates personalized guidance tailored to your chart.',
    pillars: {
      birthDetails: {
        title: 'Your birth details',
        description: 'Your precise date, time, and location calculate your unique planetary positions, lagna, and house cusps.'
      },
      question: {
        title: 'Your question',
        description: 'Your chosen topic and specific question focus the interpretation on the life areas that matter most to you.'
      },
      astrologyAnalysis: {
        title: 'Your astrology analysis',
        description: 'Traditional Vedic planetary strengths, dashas, antardashas, and supportive timing factors are evaluated.'
      },
      personalizedGuidance: {
        title: 'Your personalized guidance',
        description: 'The technical astrology findings are translated into clear, conversational, and thoughtful guidance in your language.'
      }
    },
    backBtn: 'Back',
    continueBtn: 'Continue to Question'
  },
  readingQuestion: {
    stepBadge: 'STEP 5 OF 5 · ASK ASTROGUIDE',
    topicLabel: 'Topic',
    title: 'What would you like to know?',
    subtitle: 'Ask any question about your life or select a suggested question below.',
    inputPlaceholder: 'Ask a question about your life...',
    suggestedIn: 'Suggested in',
    loadingMessages: [
      'Understanding your reading...',
      'Looking at your chart...',
      'Preparing your guidance...'
    ],
    loadingSubtext: 'Analyzing planetary transits, dasha cycles, and house placements...',
    backBtn: 'Back',
    askBtn: 'Ask AstroGuide'
  },
  readingResult: {
    askAnother: 'Ask another question',
    viewHistory: 'View Guidance History',
    currentInquiry: 'CURRENT INQUIRY',
    category: 'Category',
    yourQuestion: 'Your Question',
    birthProfile: 'Birth Chart Profile',
    newQuestion: '+ New Question',
    plan: {
      name: 'Personal Seeker Plan',
      badge: 'Active Seeker',
      remaining: 'Unlimited basic inquiry access',
      status: '✓ Vedic calculations enabled'
    },
    chat: {
      title: 'AstroGuide',
      subtitle: 'Personal Vedic Astrologer & Guidance',
      liveSession: 'Live Chart Session',
      you: 'You',
      readingChart: 'AstroGuide is reading your chart...',
      suggestedFollowUps: 'Suggested follow-ups:',
      inputPlaceholder: 'Ask AstroGuide anything...',
      send: 'Send'
    },
    timing: {
      supportivePeriods: 'Supportive Periods Indicated'
    },
    astrologyDetails: {
      toggle: 'View Astrology Details',
      seventhHouse: '7th House',
      seventhLord: '7th Lord',
      venus: 'Venus',
      jupiter: 'Jupiter',
      mahadasha: 'Mahadasha',
      antardasha: 'Antardasha',
      house: 'House',
      supportingFactors: 'Supporting Factors',
      cautionFactors: 'Factors to Be Mindful Of'
    },
    guidanceTabs: {
      heading: 'Career & Life Guidance',
      subheading: 'Explore guidance across other areas of your life without restarting your profile.',
      curiousAbout: 'Curious about',
      askAbout: 'Ask About',
      tabs: {
        career: 'Career',
        money: 'Money',
        relationships: 'Relationships',
        family: 'Family',
        travel: 'Travel',
        health: 'Health',
        growth: 'Personal Growth'
      }
    },
    palm: {
      title: 'Palm Reading',
      desc: 'Analyze key palmistry lines — life, heart, and destiny lines — to complement your Vedic chart insights.',
      btn: 'Analyze Palm',
      badge: 'Integration Point Ready',
      alertMessage: 'Palm reading analysis module is initialized. Camera/upload integration point is ready for backend integration.'
    },
    recommendations: {
      heading: 'Recommended for You',
      career: 'Career Progression & Timing',
      money: 'Financial Stability Cycles',
      travel: 'Foreign Travel / Relocation'
    },
    categories: {
      marriageTiming: 'Marriage Timing',
      marriage: 'Marriage',
      careerTiming: 'Career Timing',
      career: 'Career',
      money: 'Money / Finance',
      relationships: 'Relationships',
      family: 'Family',
      travel: 'Travel / Abroad',
      health: 'Health / Wellness',
      education: 'Education',
      business: 'Business',
      general: 'General Guidance'
    },
    followUps: {
      marriage: [
        'What are the astrological reasons?',
        'What does my chart say about my partner?',
        'Is there a favorable window in 2027?'
      ],
      career: [
        'Is this a favorable time for a job change?',
        'When are supportive periods for career growth?',
        'Does my chart favor starting a business?'
      ],
      finance: [
        'When will financial stability improve?',
        'What planetary cycles indicate wealth growth?'
      ],
      travel: [
        'When are supportive periods to travel abroad?',
        'Is foreign settlement indicated in my chart?'
      ],
      general: [
        'What are the primary planetary reasons?',
        'When is the next supportive period?',
        'What should my main focus be right now?'
      ]
    }
  },
  readingHistory: {
    title: 'Guidance History',
    subtitle: 'Review your past astrological consultations and AI explanations.',
    newQuestion: '+ Ask New Question',
    loading: 'Loading your guidance history...',
    emptyTitle: 'No guidance history yet',
    emptyDesc: 'When you ask AstroGuide a question about your chart, your readings will be saved here for easy review.',
    startReading: 'Begin Your First Reading',
    viewFullReading: 'View Full Reading →',
    editModalTitle: 'Edit Question',
    deleteModalTitle: 'Delete Inquiry?',
    deleteModalDesc: 'Are you sure you want to remove this guidance record?',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    saving: 'Saving...',
    deleting: 'Deleting...'
  },
  landing: {
    badge: 'Language-first + Problem-first + Vedic Astrology',
    heroTitle: "Guiding Your Life's Journey with",
    heroTitleGold: 'Celestial Clarity',
    heroSubtext: 'Whether you are navigating career transitions, relationship questions, or seeking your Vedic birth chart, AstroGuide delivers personalized, interactive guidance in your native language.',
    dashboardBtn: 'Go to Your Dashboard',
    getStartedBtn: 'Get Started',
    signInBtn: 'Sign In',
    miniProblemTitle: 'Talk about a problem',
    miniProblemSub: "Start with what's on your mind",
    miniChartTitle: 'Birth chart',
    miniChartSub: 'Enter your birth details',
    miniPalmTitle: 'Palm reading',
    miniPalmSub: 'Upload a photo of your palm',
    sectionTag: 'Explore Your Path',
    sectionTitle: 'How would you like to explore?',
    sectionSubtitle: 'Choose the path that feels right for you. Each journey provides traditional insights tailored to your life.',
    pillarProblemTitle: 'Talk about a problem',
    pillarProblemDesc: "Start with what's on your mind. Explore guidance on career, marriage & love, family, and money.",
    pillarProblemBtn: 'Explore Guidance',
    pillarChartTitle: 'Birth chart (Kundli)',
    pillarChartDesc: "Explore your life's path through traditional Vedic Jyotish, 12 houses, and planetary Mahadashas.",
    pillarChartBtn: 'Explore Chart',
    pillarPalmTitle: 'Palm reading',
    pillarPalmDesc: 'Discover ancient Hastarekha palmistry insights from your heart line, head line, and mount patterns.',
    pillarPalmBtn: 'Explore Palm',
    calloutTag: 'Language-First Experience',
    calloutTitle: 'Astrological Wisdom in Your Mother Tongue',
    calloutDesc: 'AstroGuide is localized into multiple regional Indian languages including English, हिन्दी, தமிழ், తెలుగు, ಕನ್ನಡ, and മലയാളം, dynamically loaded from our FastAPI backend.',
    changeLangBtn: 'Change Language',
    getStartedLangBtn: 'Get Started in Your Language'
  },
  footer: {
    brandDesc: "Bridging ancient Vedic astrological wisdom with cutting-edge computational intelligence to illuminate your life's path.",
    quote: '"As above, so below; as within, so without."',
    exploration: 'Exploration',
    guides: 'Astrology Guides',
    trust: 'Trust & Privacy',
    copyright: 'AstroGuide. All rights reserved. Crafted with celestial precision.',
    disclaimer: 'Astrological readings are for self-discovery, spiritual awareness, and entertainment purposes.'
  }
};

// ----------------------------------------------------------------------
// MALAYALAM (മലയാളം)
// ----------------------------------------------------------------------
export const ML_JOURNEY_TRANSLATIONS: JourneyTranslations = {
  tagline: 'വ്യക്തിഗത വേദിക് ജ്യോതിഷവും മാർഗ്ഗനിർദ്ദേശവും',
  explore: {
    stepBadge: 'ഘട്ടം 2 / 5 · വിഷയം തിരഞ്ഞെടുക്കുക',
    title: 'ഇന്ന് നിങ്ങൾ എന്താണ് പര്യവേക്ഷണം ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?',
    subtitle: 'നിങ്ങൾക്ക് അറിയാൻ താല്പര്യമുള്ള വിഷയം തിരഞ്ഞെടുക്കുക.',
    continueBtn: 'തുടരുക',
    topics: {
      marriage: {
        label: 'വിവാഹം & ബന്ധങ്ങൾ',
        description: 'വിവാഹ സമയം, ഗ്രഹനില, ഏഴാം ഭാവം, ദശാ സൂചനകൾ.'
      },
      career: {
        label: 'തൊഴിൽ & ജോലി',
        description: 'കരിയർ വളർച്ച, ജോലി മാറ്റം, നേതൃത്വ കാലഘട്ടങ്ങൾ.'
      },
      money: {
        label: 'ധനം & സമ്പത്ത്',
        description: 'ധനാഗമനം, നിക്ഷേപങ്ങൾ, സാമ്പത്തിക ചക്രങ്ങൾ.'
      },
      relationships: {
        label: 'ബന്ധങ്ങൾ & പ്രണയം',
        description: 'പങ്കാളിത്ത പൊരുത്തം, വൈകാരിക ഐക്യം, അനുയോജ്യത.'
      },
      health: {
        label: 'ആരോഗ്യം & ക്ഷേമം',
        description: 'ആരോഗ്യം, ഊർജ്ജസ്വലത, ഗ്രഹ സ്വാധീനങ്ങൾ.'
      },
      family: {
        label: 'കുടുംബം & ഗാർഹികം',
        description: 'കുടുംബ സമാധാനം, മാതാപിതാക്കൾ, ഗാർഹിക ഐക്യം.'
      },
      travel: {
        label: 'യാത്ര / വിദേശവാസം',
        description: 'വിദേശ അവസരങ്ങൾ, കുടിയേറ്റം, യാത്രകൾ.'
      },
      general: {
        label: 'പൊതു മാർഗ്ഗനിർദ്ദേശം',
        description: 'നിലവിലെ ദശാ സ്വാധീനം, സമഗ്ര ജീവിത പാത, ഗ്രഹ സന്തുലനം.'
      }
    }
  },
  readingPrepare: {
    stepBadge: 'ഘട്ടം 4 / 5 · നിങ്ങളുടെ വായന എങ്ങനെ തയ്യാറാക്കുന്നു',
    title: 'നിങ്ങളുടെ ജ്യോതിഷ വായന മനസ്സിലാക്കുക',
    subtitle: 'നിങ്ങളുടെ ജനന ചാർട്ടിനെ അടിസ്ഥാനമാക്കി ആസ്ട്രോഗൈഡ് എങ്ങനെ വ്യക്തിഗത മാർഗ്ഗനിർദ്ദേശം നൽകുന്നുവെന്ന് അറിയുക.',
    pillars: {
      birthDetails: {
        title: 'നിങ്ങളുടെ ജനന വിവരങ്ങൾ',
        description: 'കൃത്യമായ തീയതി, സമയം, സ്ഥലം എന്നിവ നിങ്ങളുടെ ഗ്രഹനിലയും ലഗ്നവും കൃത്യമായി നിർണ്ണയിക്കുന്നു.'
      },
      question: {
        title: 'നിങ്ങളുടെ ചോദ്യം',
        description: 'നിങ്ങൾ തിരഞ്ഞെടുക്കുന്ന വിഷയവും ചോദ്യവും നിങ്ങൾക്ക് ഏറ്റവും പ്രധാനപ്പെട്ട ജീവിത മേഖലയിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നു.'
      },
      astrologyAnalysis: {
        title: 'വേദിക് ജ്യോതിഷ വിശകലനം',
        description: 'പരമ്പരാഗത ഗ്രഹബലങ്ങൾ, ദശകൾ, അപഹാരങ്ങൾ, അനുകൂല സമയങ്ങൾ എന്നിവ ശാസ്ത്രീയമായി പരിശോധിക്കുന്നു.'
      },
      personalizedGuidance: {
        title: 'വ്യക്തിഗത മാർഗ്ഗനിർദ്ദേശം',
        description: 'സാങ്കേതിക ജ്യോതിഷ ഫലങ്ങൾ നിങ്ങളുടെ മാതൃഭാഷയിൽ വ്യക്തവും സരളവുമായ മാർഗ്ഗനിർദ്ദേശമായി ലഭ്യമാക്കുന്നു.'
      }
    },
    backBtn: 'തിരികെ',
    continueBtn: 'ചോദ്യത്തിലേക്ക് തുടരുക'
  },
  readingQuestion: {
    stepBadge: 'ഘട്ടം 5 / 5 · ആസ്ട്രോഗൈഡിനോട് ചോദിക്കുക',
    topicLabel: 'വിഷയം',
    title: 'നിങ്ങൾക്ക് എന്താണ് അറിയേണ്ടത്?',
    subtitle: 'നിങ്ങളുടെ ജീവിതത്തെക്കുറിച്ച് ഏത് ചോദ്യവും ചോദിക്കുക അല്ലെങ്കിൽ നിർദ്ദേശിച്ച ചോദ്യങ്ങളിൽ നിന്ന് തിരഞ്ഞെടുക്കുക.',
    inputPlaceholder: 'നിങ്ങളുടെ ജീവിതത്തെക്കുറിച്ച് ഒരു ചോദ്യം ചോദിക്കുക...',
    suggestedIn: 'നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ',
    loadingMessages: [
      'നിങ്ങളുടെ വായന മനസ്സിലാക്കുന്നു...',
      'ജനന ചാർട്ട് പരിശോധിക്കുന്നു...',
      'മാർഗ്ഗനിർദ്ദേശം തയ്യാറാക്കുന്നു...'
    ],
    loadingSubtext: 'ഗ്രഹ സംക്രമണങ്ങളും ദശാ ചക്രങ്ങളും ഭാവ നിലകളും പരിശോധിക്കുന്നു...',
    backBtn: 'തിരികെ',
    askBtn: 'ആസ്ട്രോഗൈഡിനോട് ചോദിക്കുക'
  },
  readingResult: {
    askAnother: 'മറ്റൊരു ചോദ്യം ചോദിക്കുക',
    viewHistory: 'മാർഗ്ഗനിർദ്ദേശ ചരിത്രം കാണുക',
    currentInquiry: 'നിലവിലെ ചോദ്യം',
    category: 'വിഭാഗം',
    yourQuestion: 'നിങ്ങളുടെ ചോദ്യം',
    birthProfile: 'ജനന ചാർട്ട് പ്രൊഫൈൽ',
    newQuestion: '+ പുതിയ ചോദ്യം',
    plan: {
      name: 'വ്യക്തിഗത അന്വേഷണ പ്ലാൻ',
      badge: 'സജീവ അംഗം',
      remaining: 'പരിധിയില്ലാത്ത അടിസ്ഥാന ചോദ്യങ്ങൾ',
      status: '✓ വേദിക് കണക്കുകൂട്ടലുകൾ സജീവം'
    },
    chat: {
      title: 'ആസ്ട്രോഗൈഡ്',
      subtitle: 'വ്യക്തിഗത വേദിക് ജ്യോതിഷ മാർഗ്ഗദർശി',
      liveSession: 'ലൈവ് ചാർട്ട് സെഷൻ',
      you: 'നിങ്ങൾ',
      readingChart: 'ആസ്ട്രോഗൈഡ് നിങ്ങളുടെ ചാർട്ട് വായിക്കുന്നു...',
      suggestedFollowUps: 'നിർദ്ദേശിച്ച തുടർചോദ്യങ്ങൾ:',
      inputPlaceholder: 'ആസ്ട്രോഗൈഡിനോട് എന്തും ചോദിക്കൂ...',
      send: 'അയക്കുക'
    },
    timing: {
      supportivePeriods: 'അനുകൂലമായ കാലഘട്ടങ്ങൾ'
    },
    astrologyDetails: {
      toggle: 'ജ്യോതിഷ വിവരങ്ങൾ കാണുക',
      seventhHouse: 'ഏഴാം ഭാവം',
      seventhLord: 'ഏഴാം ഭാവാധിപൻ',
      venus: 'ശുക്രൻ',
      jupiter: 'വ്യാഴം',
      mahadasha: 'മഹാദശ',
      antardasha: 'അപഹാരം (അന്തർദശ)',
      house: 'ഭാവം',
      supportingFactors: 'അനുകൂല ഘടകങ്ങൾ',
      cautionFactors: 'ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ'
    },
    guidanceTabs: {
      heading: 'തൊഴിൽ & ജീവിത മാർഗ്ഗനിർദ്ദേശം',
      subheading: 'പ്രൊഫൈൽ പുനരാരംഭിക്കാതെ മറ്റ് ജീവിത മേഖലകളിലെ മാർഗ്ഗനിർദ്ദേശങ്ങൾ അറിയുക.',
      curiousAbout: 'താൽപ്പര്യമുണ്ടോ',
      askAbout: 'ചോദിക്കുക',
      tabs: {
        career: 'തൊഴിൽ',
        money: 'ധനം',
        relationships: 'ബന്ധങ്ങൾ',
        family: 'കുടുംബം',
        travel: 'യാത്ര',
        health: 'ആരോഗ്യം',
        growth: 'വ്യക്തിഗത വളർച്ച'
      }
    },
    palm: {
      title: 'ഹസ്തരേഖാ പരിശോധന',
      desc: 'നിങ്ങളുടെ ഗ്രഹനിലയ്ക്ക് പൂരകമായി ജീവരേഖ, ശിരോരേഖ, ഹൃദയരേഖ എന്നിവ വിശകലനം ചെയ്യുക.',
      btn: 'ഹസ്തരേഖ പരിശോധിക്കുക',
      badge: 'ലഭ്യമാണ്',
      alertMessage: 'ഹസ്തരേഖാ പരിശോധനാ മൊഡ്യൂൾ സജ്ജമാണ്.'
    },
    recommendations: {
      heading: 'നിങ്ങൾക്കായി നിർദ്ദേശിക്കുന്നത്',
      career: 'തൊഴിൽ പുരോഗതിയും സമയവും',
      money: 'സാമ്പത്തിക സ്ഥിരത ചക്രങ്ങൾ',
      travel: 'വിദേശ യാത്രയും താമസവും'
    },
    categories: {
      marriageTiming: 'വിവാഹ സമയം',
      marriage: 'വിവാഹം',
      careerTiming: 'തൊഴിൽ സമയം',
      career: 'തൊഴിൽ',
      money: 'ധനം & സമ്പത്ത്',
      relationships: 'ബന്ധങ്ങൾ',
      family: 'കുടുംബം',
      travel: 'യാത്ര / വിദേശവാസം',
      health: 'ആരോഗ്യം',
      education: 'വിദ്യാഭ്യാസം',
      business: 'ബിസിനസ്സ്',
      general: 'പൊതു മാർഗ്ഗനിർദ്ദേശം'
    },
    followUps: {
      marriage: [
        'ഇതിന്റെ ജ്യോതിഷപരമായ കാരണം എന്താണ്?',
        'എന്റെ പങ്കാളി എങ്ങനെയുള്ള ആളായിരിക്കും?',
        'വിവാഹത്തിന് ഏറ്റവും അനുകൂലമായ വർഷം ഏതാണ്?'
      ],
      career: [
        'ജോലി മാറ്റാൻ നല്ല സമയമാണോ?',
        'കരിയറിൽ പുരോഗതി എപ്പോൾ പ്രതീക്ഷിക്കാം?',
        'ബിസിനസ്സ് തുടങ്ങാൻ ജാതകം അനുകൂലമാണോ?'
      ],
      finance: [
        'സാമ്പത്തിക സ്ഥിതി എപ്പോൾ മെച്ചപ്പെടും?',
        'നിക്ഷേപങ്ങൾക്ക് പറ്റിയ സമയമാണോ?'
      ],
      travel: [
        'വിദേശത്ത് പോകാൻ എപ്പോഴാണ് അനുകൂല സമയം?',
        'വിദേശത്ത് സ്ഥിരതാമസത്തിന് സാധ്യതയുണ്ടോ?'
      ],
      general: [
        'ഇപ്പോൾ എന്റെ ജീവിതത്തിലെ പ്രധാന ഗ്രഹ സ്വാധീനം എന്താണ്?',
        'അടുത്ത അനുകൂല കാലഘട്ടം എപ്പോഴാണ്?',
        'ഇപ്പോൾ ഞാൻ എന്തിലാണ് പ്രധാനമായും ശ്രദ്ധിക്കേണ്ടത്?'
      ]
    }
  },
  readingHistory: {
    title: 'മാർഗ്ഗനിർദ്ദേശ ചരിത്രം',
    subtitle: 'നിങ്ങളുടെ മുൻകാല ജ്യോതിഷ കൂടിയാലോചനകളും AI വിശദീകരണങ്ങളും പരിശോധിക്കുക.',
    newQuestion: '+ പുതിയ ചോദ്യം ചോദിക്കുക',
    loading: 'മാർഗ്ഗനിർദ്ദേശ ചരിത്രം ലോഡ് ചെയ്യുന്നു...',
    emptyTitle: 'ചരിത്രം ഇതുവരെ ലഭ്യമല്ല',
    emptyDesc: 'ആസ്ട്രോഗൈഡിനോട് നിങ്ങൾ ചോദിക്കുന്ന ചോദ്യങ്ങളും ഉത്തരങ്ങളും ഇവിടെ സൂക്ഷിക്കപ്പെടും.',
    startReading: 'ആദ്യ വായന ആരംഭിക്കുക',
    viewFullReading: 'പൂർണ്ണ വായന കാണുക →',
    editModalTitle: 'ചോദ്യം തിരുത്തുക',
    deleteModalTitle: 'ചോദ്യം ഇല്ലാതാക്കണമോ?',
    deleteModalDesc: 'ഈ മാർഗ്ഗനിർദ്ദേശ രേഖ നീക്കം ചെയ്യാൻ നിങ്ങൾ ആഗ്രഹിക്കുന്നുണ്ടോ?',
    cancel: 'റദ്ദാക്കുക',
    save: 'സംരക്ഷിക്കുക',
    delete: 'ഇല്ലാതാക്കുക',
    saving: 'സംരക്ഷിക്കുന്നു...',
    deleting: 'ഇല്ലാതാക്കുന്നു...'
  },
  landing: {
    badge: 'ഭാഷാ മുൻഗണന + പ്രശ്ന പരിഹാരം + വേദിക് ജ്യോതിഷം',
    heroTitle: 'നിങ്ങളുടെ ജീവിതയാത്രയ്ക്ക് വഴികാട്ടിയായി',
    heroTitleGold: 'ജ്യോതിഷ വെളിച്ചം',
    heroSubtext: 'തൊഴിൽ മാറ്റങ്ങൾ, ബന്ധങ്ങളിലെ സംശയങ്ങൾ, അല്ലെങ്കിൽ നിങ്ങളുടെ വേദിക് ജാതകം എന്നിവയിൽ നിങ്ങളുടെ മാതൃഭാഷയിൽ വ്യക്തിഗത മാർഗ്ഗനിർദ്ദേശം ആസ്ട്രോഗൈഡ് നൽകുന്നു.',
    dashboardBtn: 'ഡാഷ്‌ബോർഡിലേക്ക് പോകുക',
    getStartedBtn: 'ആരംഭിക്കുക',
    signInBtn: 'സൈൻ ഇൻ',
    miniProblemTitle: 'പ്രശ്നത്തെക്കുറിച്ച് സംസാരിക്കുക',
    miniProblemSub: 'മനസ്സിലുള്ളതിൽ നിന്ന് തുടങ്ങുക',
    miniChartTitle: 'ജനന ജാതകം',
    miniChartSub: 'ജനന വിവരങ്ങൾ നൽകുക',
    miniPalmTitle: 'ഹസ്തരേഖാ പരിശോധന',
    miniPalmSub: 'കൈപ്പത്തിയുടെ ഫോട്ടോ നൽകുക',
    sectionTag: 'നിങ്ങളുടെ വഴി തിരഞ്ഞെടുക്കുക',
    sectionTitle: 'നിങ്ങൾ എങ്ങനെ പര്യവേക്ഷണം ചെയ്യാൻ ആഗ്രഹിക്കുന്നു?',
    sectionSubtitle: 'നിങ്ങൾക്ക് അനുയോജ്യമായ പാത തിരഞ്ഞെടുക്കുക.',
    pillarProblemTitle: 'പ്രശ്നത്തെക്കുറിച്ച് സംസാരിക്കുക',
    pillarProblemDesc: 'തൊഴിൽ, വിവാഹം, കുടുംബം, സാമ്പത്തികം എന്നിവയിലെ സംശയങ്ങൾക്ക് ഉത്തരം കണ്ടെത്തുക.',
    pillarProblemBtn: 'മാർഗ്ഗനിർദ്ദേശം തേടുക',
    pillarChartTitle: 'ജനന ജാതകം (കുണ്ഡലി)',
    pillarChartDesc: '12 ഭാവങ്ങളും ഗ്രഹങ്ങളുടെ ദശാകാലങ്ങളും പരമ്പരാഗത ജ്യോതിഷത്തിലൂടെ അറിയുക.',
    pillarChartBtn: 'ജാതകം പരിശോധിക്കുക',
    pillarPalmTitle: 'ഹസ്തരേഖാ പരിശോധന',
    pillarPalmDesc: 'ജീവരേഖ, ശിരോരേഖ, ഹൃദയരേഖ എന്നിവയിലൂടെ പുരാതന ഹസ്തരേഖാ ശാസ്ത്രം മനസ്സിലാക്കുക.',
    pillarPalmBtn: 'ഹസ്തരേഖ പരിശോധിക്കുക',
    calloutTag: 'മാതൃഭാഷാ അനുഭവം',
    calloutTitle: 'ജ്യോതിഷ ജ്ഞാനം നിങ്ങളുടെ മാതൃഭാഷയിൽ',
    calloutDesc: 'ആസ്ട്രോഗൈഡ് മലയാളം, हिन्दी, தமிழ், తెలుగు, ಕನ್ನಡ, ഇംഗ്ലീഷ് തുടങ്ങിയ ഭാഷകളിൽ ലഭ്യമാണ്.',
    changeLangBtn: 'ഭാഷ മാറ്റുക',
    getStartedLangBtn: 'നിങ്ങളുടെ ഭാഷയിൽ ആരംഭിക്കുക'
  },
  footer: {
    brandDesc: 'പുരാതന വേദിക് ജ്യോതിഷ ജ്ഞാനവും അത്യാധുനിക കമ്പ്യൂട്ടേഷണൽ ബുദ്ധിയും സംയോജിപ്പിച്ച് നിങ്ങളുടെ ജീവിത പാത പ്രകാശിപ്പിക്കുന്നു.',
    quote: '"പ്രപഞ്ചത്തിൽ എങ്ങനെയോ, അതുപോലെ ഉള്ളിലും."',
    exploration: 'പര്യവേക്ഷണം',
    guides: 'ജ്യോതിഷ വഴികാട്ടി',
    trust: 'വിശ്വാസ്യത & സ്വകാര്യത',
    copyright: 'ആസ്ട്രോഗൈഡ്. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
    disclaimer: 'ജ്യോതിഷ വായനകൾ സ്വയം കണ്ടെത്തലിനും ആത്മീയ അവബോധത്തിനുമുള്ളതാണ്.'
  }
};

// ----------------------------------------------------------------------
// HINDI (हिन्दी)
// ----------------------------------------------------------------------
export const HI_JOURNEY_TRANSLATIONS: JourneyTranslations = {
  tagline: 'व्यक्तिगत वैदिक ज्योतिष एवं मार्गदर्शन',
  explore: {
    stepBadge: 'चरण 2 / 5 · विषय चुनें',
    title: 'आज आप क्या जानना चाहते हैं?',
    subtitle: 'अपनी जिज्ञासा के अनुसार विषय का चयन करें।',
    continueBtn: 'जारी रखें',
    topics: {
      marriage: {
        label: 'विवाह और संबंध',
        description: 'विवाह का समय, ग्रह स्थिति, सातवां भाव और दशा संकेत।'
      },
      career: {
        label: 'करियर और नौकरी',
        description: 'व्यावसायिक विकास, नौकरी परिवर्तन और नेतृत्व काल।'
      },
      money: {
        label: 'धन और वित्त',
        description: 'धन संचय, निवेश और वित्तीय चक्र।'
      },
      relationships: {
        label: 'संबंध और प्रेम',
        description: 'साझेदारी में सामंजस्य, भावनात्मक जुड़ाव और अनुकूलता।'
      },
      health: {
        label: 'स्वास्थ्य और कल्याण',
        description: 'ऊर्जा, स्वास्थ्य पर ग्रहों का प्रभाव और जीवन संतुलन।'
      },
      family: {
        label: 'परिवार और गृह',
        description: 'घरेलू शांति, माता-पिता और पारिवारिक सद्भाव।'
      },
      travel: {
        label: 'यात्रा / विदेश गमन',
        description: 'विदेशी अवसर, विदेश में बसने के योग और यात्राएं।'
      },
      general: {
        label: 'सामान्य मार्गदर्शन',
        description: 'वर्तमान दशा प्रभाव, समग्र जीवन पथ और ग्रह संरेखण।'
      }
    }
  },
  readingPrepare: {
    stepBadge: 'चरण 4 / 5 · आपकी कुंडली कैसे काम करती है',
    title: 'अपनी ज्योतिषीय गणना को समझें',
    subtitle: 'जानिए कि एस्ट्रोगाइड आपकी कुंडली के आधार पर व्यक्तिगत मार्गदर्शन कैसे तैयार करता है।',
    pillars: {
      birthDetails: {
        title: 'आपके जन्म का विवरण',
        description: 'आपकी सटीक जन्म तिथि, समय और स्थान से आपकी अनूठी ग्रह स्थिति, लग्न और भाव तय होते हैं।'
      },
      question: {
        title: 'आपका प्रश्न',
        description: 'आपका चुना हुआ विषय और विशिष्ट प्रश्न उस जीवन क्षेत्र पर ध्यान केंद्रित करता है जो आपके लिए सबसे महत्वपूर्ण है।'
      },
      astrologyAnalysis: {
        title: 'वैदिक ज्योतिष विश्लेषण',
        description: 'पारंपरिक वैदिक ग्रह बल, महादशा, अंतर्दशा और अनुकूल समय कारकों का वैज्ञानिक मूल्यांकन किया जाता है।'
      },
      personalizedGuidance: {
        title: 'आपका व्यक्तिगत मार्गदर्शन',
        description: 'तकनीकी ज्योतिषीय निष्कर्षों को आपकी भाषा में सरल, स्पष्ट और व्यावहारिक मार्गदर्शन में बदला जाता है।'
      }
    },
    backBtn: 'वापस',
    continueBtn: 'प्रश्न पूछने के लिए आगे बढ़ें'
  },
  readingQuestion: {
    stepBadge: 'चरण 5 / 5 · एस्ट्रोगाइड से पूछें',
    topicLabel: 'विषय',
    title: 'आप क्या जानना चाहते हैं?',
    subtitle: 'अपने जीवन के बारे में कोई भी प्रश्न पूछें या नीचे दिए गए सुझावों में से चुनें।',
    inputPlaceholder: 'अपने जीवन के बारे में एक प्रश्न पूछें...',
    suggestedIn: 'सुझाए गए प्रश्न',
    loadingMessages: [
      'आपकी कुंडली समझी जा रही है...',
      'ग्रह गोचर का विश्लेषण हो रहा है...',
      'आपका मार्गदर्शन तैयार किया जा रहा है...'
    ],
    loadingSubtext: 'ग्रह गोचर, महादशा चक्र और भाव स्थितियों का विश्लेषण जारी है...',
    backBtn: 'वापस',
    askBtn: 'एस्ट्रोगाइड से पूछें'
  },
  readingResult: {
    askAnother: 'दूसरा प्रश्न पूछें',
    viewHistory: 'पिछला इतिहास देखें',
    currentInquiry: 'वर्तमान प्रश्न',
    category: 'श्रेणी',
    yourQuestion: 'आपका प्रश्न',
    birthProfile: 'जन्म कुंडली प्रोफ़ाइल',
    newQuestion: '+ नया प्रश्न',
    plan: {
      name: 'व्यक्तिगत साधक योजना',
      badge: 'सक्रिय सदस्य',
      remaining: 'असीमित बुनियादी मार्गदर्शन',
      status: '✓ वैदिक गणना सक्रिय'
    },
    chat: {
      title: 'एस्ट्रोगाइड',
      subtitle: 'व्यक्तिगत वैदिक ज्योतिषी एवं मार्गदर्शक',
      liveSession: 'लाइव कुंडली सत्र',
      you: 'आप',
      readingChart: 'एस्ट्रोगाइड आपकी कुंडली का अध्ययन कर रहा है...',
      suggestedFollowUps: 'सुझाए गए अनुवर्ती प्रश्न:',
      inputPlaceholder: 'एस्ट्रोगाइड से कुछ भी पूछें...',
      send: 'भेजें'
    },
    timing: {
      supportivePeriods: 'अनुकूल समय चक्र'
    },
    astrologyDetails: {
      toggle: 'ज्योतिषीय विवरण देखें',
      seventhHouse: '7वां भाव',
      seventhLord: '7वें भाव का स्वामी',
      venus: 'शुक्र',
      jupiter: 'बृहस्पति (गुरु)',
      mahadasha: 'महादशा',
      antardasha: 'अंतर्दशा',
      house: 'भाव',
      supportingFactors: 'अनुकूल कारक',
      cautionFactors: 'ध्यान रखने योग्य बातें'
    },
    guidanceTabs: {
      heading: 'करियर एवं जीवन मार्गदर्शन',
      subheading: 'बिना प्रोफ़ाइल रीसेट किए जीवन के अन्य क्षेत्रों में मार्गदर्शन प्राप्त करें।',
      curiousAbout: 'जानना चाहते हैं',
      askAbout: 'पूछें',
      tabs: {
        career: 'करियर',
        money: 'धन',
        relationships: 'संबंध',
        family: 'परिवार',
        travel: 'यात्रा',
        health: 'स्वास्थ्य',
        growth: 'व्यक्तिगत विकास'
      }
    },
    palm: {
      title: 'हस्तरेखा विश्लेषण',
      desc: 'वैदिक कुंडली की पुष्टि के लिए जीवन रेखा, हृदय रेखा और भाग्य रेखा का विश्लेषण करें।',
      btn: 'हस्तरेखा देखें',
      badge: 'उपलब्ध है',
      alertMessage: 'हस्तरेखा विश्लेषण मॉड्यूल तैयार है।'
    },
    recommendations: {
      heading: 'आपके लिए अनुशंसित',
      career: 'करियर प्रगति और समय',
      money: 'वित्तीय स्थिरता चक्र',
      travel: 'विदेश यात्रा और योग'
    },
    categories: {
      marriageTiming: 'विवाह समय',
      marriage: 'विवाह',
      careerTiming: 'करियर समय',
      career: 'करियर',
      money: 'धन एवं वित्त',
      relationships: 'संबंध',
      family: 'परिवार',
      travel: 'यात्रा / विदेश गमन',
      health: 'स्वास्थ्य',
      education: 'शिक्षा',
      business: 'व्यवसाय',
      general: 'सामान्य मार्गदर्शन'
    },
    followUps: {
      marriage: [
        'इसके ज्योतिषीय कारण क्या हैं?',
        'मेरी कुंडली मेरे जीवनसाथी के बारे में क्या बताती है?',
        'विवाह के लिए सबसे अनुकूल वर्ष कौन सा है?'
      ],
      career: [
        'क्या यह नौकरी बदलने का सही समय है?',
        'करियर में उन्नति कब होगी?',
        'क्या मेरी कुंडली में व्यापार के अच्छे योग हैं?'
      ],
      finance: [
        'आर्थिक स्थिति कब बेहतर होगी?',
        'क्या निवेश के लिए यह समय सुरक्षित है?'
      ],
      travel: [
        'विदेश यात्रा के योग कब बन रहे हैं?',
        'क्या विदेश में स्थायी निवास संभव है?'
      ],
      general: [
        'वर्तमान में मेरे जीवन पर किस ग्रह का सबसे अधिक प्रभाव है?',
        'अगला शुभ समय कब शुरू होगा?',
        'इस समय मुझे मुख्य रूप से किस बात पर ध्यान देना चाहिए?'
      ]
    }
  },
  readingHistory: {
    title: 'मार्गदर्शन इतिहास',
    subtitle: 'अपने पिछले ज्योतिषीय प्रश्नों और AI परामर्श की समीक्षा करें।',
    newQuestion: '+ नया प्रश्न पूछें',
    loading: 'मार्गदर्शन इतिहास लोड हो रहा है...',
    emptyTitle: 'कोई इतिहास उपलब्ध नहीं है',
    emptyDesc: 'जब आप एस्ट्रोगाइड से अपनी कुंडली के बारे में प्रश्न पूछेंगे, तो वे यहाँ सुरक्षित रहेंगे।',
    startReading: 'अपना पहला परामर्श शुरू करें',
    viewFullReading: 'पूरा परामर्श देखें →',
    editModalTitle: 'प्रश्न संपादित करें',
    deleteModalTitle: 'परामर्श हटाएं?',
    deleteModalDesc: 'क्या आप वाकई इस मार्गदर्शन रिकॉर्ड को हटाना चाहते हैं?',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    saving: 'सहेजा जा रहा है...',
    deleting: 'हटाया जा रहा है...'
  },
  landing: {
    badge: 'भाषा-प्रथम + समस्या-समाधान + वैदिक ज्योतिष',
    heroTitle: 'आपके जीवन की यात्रा का मार्गदर्शन',
    heroTitleGold: 'दिव्य स्पष्टता के साथ',
    heroSubtext: 'चाहे आप करियर, रिश्तों या अपनी वैदिक जन्म कुंडली के बारे में मार्गदर्शन चाहते हों, एस्ट्रोगाइड आपकी अपनी भाषा में व्यक्तिगत और सटीक समाधान प्रदान करता है।',
    dashboardBtn: 'डैशबोर्ड पर जाएं',
    getStartedBtn: 'शुरुआत करें',
    signInBtn: 'साइन इन',
    miniProblemTitle: 'समस्या के बारे में बात करें',
    miniProblemSub: 'अपने मन की बात से शुरुआत करें',
    miniChartTitle: 'जन्म कुंडली',
    miniChartSub: 'जन्म विवरण दर्ज करें',
    miniPalmTitle: 'हस्तरेखा विश्लेषण',
    miniPalmSub: 'अपनी हथेली की फोटो अपलोड करें',
    sectionTag: 'अपना मार्ग चुनें',
    sectionTitle: 'आप कैसे अन्वेषण करना चाहते हैं?',
    sectionSubtitle: 'वह मार्ग चुनें जो आपके लिए सही लगे।',
    pillarProblemTitle: 'समस्या के बारे में बात करें',
    pillarProblemDesc: 'करियर, विवाह, परिवार और धन से जुड़े प्रश्नों के समाधान पाएं।',
    pillarProblemBtn: 'मार्गदर्शन प्राप्त करें',
    pillarChartTitle: 'जन्म कुंडली (कुण्डली)',
    pillarChartDesc: '12 भावों और ग्रह महादशाओं के माध्यम से अपने जीवन पथ को समझें।',
    pillarChartBtn: 'कुंडली देखें',
    pillarPalmTitle: 'हस्तरेखा विश्लेषण',
    pillarPalmDesc: 'जीवन रेखा, मस्तिष्क रेखा और हृदय रेखा के माध्यम से हस्तरेखा शास्त्र को समझें।',
    pillarPalmBtn: 'हस्तरेखा देखें',
    calloutTag: 'मातृभाषा अनुभव',
    calloutTitle: 'ज्योतिषीय ज्ञान आपकी अपनी भाषा में',
    calloutDesc: 'एस्ट्रोगाइड हिन्दी, മലയാളം, தமிழ், తెలుగు, ಕನ್ನಡ और English में उपलब्ध है।',
    changeLangBtn: 'भाषा बदलें',
    getStartedLangBtn: 'अपनी भाषा में शुरुआत करें'
  },
  footer: {
    brandDesc: 'प्राचीन वैदिक ज्योतिष ज्ञान और अत्याधुनिक तकनीक का अनूठा संगम, आपके जीवन पथ को प्रकाशित करने के लिए।',
    quote: '"जैसा ब्रह्मांड में, वैसा ही स्वयं में।"',
    exploration: 'अन्वेषण',
    guides: 'ज्योतिष गाइड',
    trust: 'विश्वास एवं गोपनीयता',
    copyright: 'एस्ट्रोगाइड। सर्वाधिकार सुरक्षित।',
    disclaimer: 'ज्योतिषीय परामर्श आत्म-खोज और आध्यात्मिक जागरूकता के लिए हैं।'
  }
};

// ----------------------------------------------------------------------
// TAMIL (தமிழ்)
// ----------------------------------------------------------------------
export const TA_JOURNEY_TRANSLATIONS: JourneyTranslations = {
  tagline: 'தனிப்பயனாக்கப்பட்ட வேத ஜோதிடம் & வழிகாட்டல்',
  explore: {
    stepBadge: 'படி 2 / 5 · தலைப்பைத் தேர்ந்தெடுக்கவும்',
    title: 'இன்று நீங்கள் எதைப் பற்றி ஆராய விரும்புகிறீர்கள்?',
    subtitle: 'உங்கள் ஆர்வத்திற்கு ஏற்ற தலைப்பைத் தேர்வுசெய்யவும்.',
    continueBtn: 'தொடரவும்',
    topics: {
      marriage: {
        label: 'திருமணம் & காதல்',
        description: 'திருமண நேரம், கிரக நிலைகள், 7ஆம் பாவம் மற்றும் தசா கணிப்புகள்.'
      },
      career: {
        label: 'தொழில் & வேலை',
        description: 'தொழில் வளர்ச்சி, வேலை மாற்றம் மற்றும் தலைமைத்துவ காலங்கள்.'
      },
      money: {
        label: 'பணம் & நிதி',
        description: 'செல்வ சேர்க்கை, முதலீடுகள் மற்றும் நிதி சுழற்சிகள்.'
      },
      relationships: {
        label: 'உறவுகள் & நட்பு',
        description: 'இணக்கமான கூட்டு, உணர்வுபூர்வமான பிணைப்பு மற்றும் பொருத்தம்.'
      },
      health: {
        label: 'உடல்நலம் & நல்வாழ்வு',
        description: 'ஆரோக்கியம், கிரகங்களின் தாக்கம் மற்றும் ஆற்றல் சமநிலை.'
      },
      family: {
        label: 'குடும்பம் & அமைதி',
        description: 'குடும்ப அமைதி, பெற்றோர் மற்றும் வீட்டு நல்லிணக்கம்.'
      },
      travel: {
        label: 'பயணம் / வெளிநாடு',
        description: 'வெளிநாட்டு வாய்ப்புகள், குடியிருப்பு மற்றும் பயணங்கள்.'
      },
      general: {
        label: 'பொது வழிகாட்டல்',
        description: 'தற்போதைய தசா பலன்கள், வாழ்க்கை பாதை மற்றும் கிரக அமைப்பு.'
      }
    }
  },
  readingPrepare: {
    stepBadge: 'படி 4 / 5 · உங்கள் ஜாதகம் எவ்வாறு செயல்படுகிறது',
    title: 'உங்கள் ஜோதிடக் கணிப்பைப் புரிந்து கொள்ளுங்கள்',
    subtitle: 'உங்கள் பிறப்பு ஜாதகத்தை அடிப்படையாகக் கொண்டு ஆஸ்ட்ரோகைடு எவ்வாறு வழிகாட்டுகிறது என்பதை அறியுங்கள்.',
    pillars: {
      birthDetails: {
        title: 'உங்கள் பிறப்பு விவரங்கள்',
        description: 'துல்லியமான தேதி, நேரம், இடம் ஆகியவை உங்கள் தனித்துவமான கிரக நிலைகளையும் லக்னத்தையும் நிர்ணயிக்கின்றன.'
      },
      question: {
        title: 'உங்கள் கேள்வி',
        description: 'நீங்கள் தேர்ந்தெடுக்கும் தலைப்பும் கேள்வியும் உங்களுக்கு முக்கியமான வாழ்க்கைப் பகுதியில் கவனம் செலுத்துகின்றன.'
      },
      astrologyAnalysis: {
        title: 'வேத ஜோதிட ஆய்வு',
        description: 'பாரம்பரிய கிரக பலங்கள், மகா தசா, புக்தி மற்றும் சாதகமான நேரக் காரணிகள் மதிப்பீடு செய்யப்படுகின்றன.'
      },
      personalizedGuidance: {
        title: 'தனிப்பயனாக்கப்பட்ட வழிகாட்டல்',
        description: 'நுட்பமான ஜோதிட உண்மைகள் உங்கள் தாய்மொழியில் தெளிவான மற்றும் பயனுள்ள வழிகாட்டலாக வழங்கப்படுகின்றன.'
      }
    },
    backBtn: 'பின்செல்',
    continueBtn: 'கேள்விக்குச் செல்லவும்'
  },
  readingQuestion: {
    stepBadge: 'படி 5 / 5 · ஆஸ்ட்ரோகைடிடம் கேளுங்கள்',
    topicLabel: 'தலைப்பு',
    title: 'நீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?',
    subtitle: 'உங்கள் வாழ்க்கையைப் பற்றி எந்தக் கேள்வியையும் கேளுங்கள் அல்லது பரிந்துரைக்கப்பட்ட கேள்விகளிலிருந்து தேர்வுசெய்யவும்.',
    inputPlaceholder: 'உங்கள் வாழ்க்கையைப் பற்றி ஒரு கேள்வியைக் கேளுங்கள்...',
    suggestedIn: 'பரிந்துரைக்கப்பட்ட கேள்விகள்',
    loadingMessages: [
      'உங்கள் ஜாதகம் ஆராயப்படுகிறது...',
      'கிரக நிலைகள் கணக்கிடப்படுகின்றன...',
      'உங்கள் வழிகாட்டல் தயாராகிறது...'
    ],
    loadingSubtext: 'கிரகப் பெயர்ச்சிகள், தசா சுழற்சிகள் மற்றும் பாவ நிலைகள் ஆய்வு செய்யப்படுகின்றன...',
    backBtn: 'பின்செல்',
    askBtn: 'ஆஸ்ட்ரோகைடிடம் கேளுங்கள்'
  },
  readingResult: {
    askAnother: 'மற்றொரு கேள்வி கேளுங்கள்',
    viewHistory: 'வழிகாட்டல் வரலாறு',
    currentInquiry: 'தற்போதைய கேள்வி',
    category: 'பிரிவு',
    yourQuestion: 'உங்கள் கேள்வி',
    birthProfile: 'பிறப்பு ஜாதக விவரம்',
    newQuestion: '+ புதிய கேள்வி',
    plan: {
      name: 'தனிநபர் தேடல் திட்டம்',
      badge: 'செயலில் உள்ள உறுப்பினர்',
      remaining: 'வரம்பற்ற அடிப்படை வழிகாட்டல்',
      status: '✓ வேத கணிப்புகள் செயலில் உள்ளன'
    },
    chat: {
      title: 'ஆஸ்ட்ரோகைடு',
      subtitle: 'தனிப்பயனாக்கப்பட்ட வேத ஜோதிடர் & வழிகாட்டி',
      liveSession: 'நேரடி ஜாதக அமர்வு',
      you: 'நீங்கள்',
      readingChart: 'ஆஸ்ட்ரோகைடு உங்கள் ஜாதகத்தை வாசிக்கிறது...',
      suggestedFollowUps: 'பரிந்துரைக்கப்பட்ட கேள்விகள்:',
      inputPlaceholder: 'ஆஸ்ட்ரோகைடிடம் எதையும் கேளுங்கள்...',
      send: 'அனுப்பு'
    },
    timing: {
      supportivePeriods: 'சாதகமான காலங்கள்'
    },
    astrologyDetails: {
      toggle: 'ஜோதிட விவரங்களைக் காண்க',
      seventhHouse: '7ஆம் பாவம்',
      seventhLord: '7ஆம் அதிபதி',
      venus: 'சுக்கிரன்',
      jupiter: 'குரு',
      mahadasha: 'மகா தசை',
      antardasha: 'புக்தி (அந்தர்தசை)',
      house: 'பாவம்',
      supportingFactors: 'சாதகமான காரணிகள்',
      cautionFactors: 'கவனிக்க வேண்டியவை'
    },
    guidanceTabs: {
      heading: 'தொழில் & வாழ்க்கை வழிகாட்டல்',
      subheading: 'மற்ற வாழ்க்கைப் பகுதிகளுக்கான வழிகாட்டலை எளிதாகப் பெறுங்கள்.',
      curiousAbout: 'அறிய விரும்புகிறீர்களா',
      askAbout: 'கேளுங்கள்',
      tabs: {
        career: 'தொழில்',
        money: 'பணம்',
        relationships: 'உறவுகள்',
        family: 'குடும்பம்',
        travel: 'பயணம்',
        health: 'உடல்நலம்',
        growth: 'தனிப்பட்ட வளர்ச்சி'
      }
    },
    palm: {
      title: 'கைரேகை வாசிப்பு',
      desc: 'உங்கள் வேத ஜாதகத்திற்கு வலு சேர்க்க ஆயுள் ரேகை, புத்தி ரேகை, இருதய ரேகைகளை ஆராயுங்கள்.',
      btn: 'கைரேகை காண்க',
      badge: 'தயாராக உள்ளது',
      alertMessage: 'கைரேகை வாசிப்பு தொகுதி தயாராக உள்ளது.'
    },
    recommendations: {
      heading: 'உங்களுக்காகப் பரிந்துரைக்கப்படுபவை',
      career: 'தொழில் முன்னேற்றமும் நேரமும்',
      money: 'நிதி ஸ்திரத்தன்மை சுழற்சிகள்',
      travel: 'வெளிநாட்டு பயணம் & குடியிருப்பு'
    },
    categories: {
      marriageTiming: 'திருமண நேரம்',
      marriage: 'திருமணம்',
      careerTiming: 'தொழில் நேரம்',
      career: 'தொழில்',
      money: 'பணம் & நிதி',
      relationships: 'உறவுகள்',
      family: 'குடும்பம்',
      travel: 'பயணம் / வெளிநாடு',
      health: 'உடல்நலம்',
      education: 'கல்வி',
      business: 'வணிகம்',
      general: 'பொது வழிகாட்டல்'
    },
    followUps: {
      marriage: [
        'இதற்கான ஜோதிடக் காரணம் என்ன?',
        'என் வாழ்க்கைத் துணையைப் பற்றி ஜாதகம் என்ன கூறுகிறது?',
        'திருமணத்திற்கு மிகவும் சாதகமான காலம் எது?'
      ],
      career: [
        'வேலை மாறுவதற்கு இது நல்ல நேரமா?',
        'தொழில் வளர்ச்சி எப்போது ஏற்படும்?',
        'தொழில் தொடங்குவதற்கு ஜாதகம் சாதகமாக உள்ளதா?'
      ],
      finance: [
        'நிதி நிலைமை எப்போது சீரடையும்?',
        'முதலீடுகள் செய்ய இது பாதுகாப்பான நேரமா?'
      ],
      travel: [
        'வெளிநாடு செல்வதற்கான வாய்ப்பு எப்போது உள்ளது?',
        'வெளிநாட்டில் நிரந்தரமாக வாழ வழி உள்ளதா?'
      ],
      general: [
        'தற்போது என் வாழ்க்கையில் எந்த கிரகத்தின் ஆதிக்கம் அதிகம்?',
        'அடுத்த நல்ல காலம் எப்போது தொடங்கும்?',
        'இப்போது நான் எதில் கவனம் செலுத்த வேண்டும்?'
      ]
    }
  },
  readingHistory: {
    title: 'வழிகாட்டல் வரலாறு',
    subtitle: 'உங்கள் கடந்தகால ஜோதிட ஆலோசனைகளை மதிப்பாய்வு செய்யுங்கள்.',
    newQuestion: '+ புதிய கேள்வி கேளுங்கள்',
    loading: 'வரலாறு ஏற்றப்படுகிறது...',
    emptyTitle: 'வரலாறு இன்னும் இல்லை',
    emptyDesc: 'நீங்கள் கேட்கும் கேள்விகளும் பதில்களும் இங்கே பாதுகாக்கப்படும்.',
    startReading: 'முதல் ஆலோசனையைத் தொடங்குங்கள்',
    viewFullReading: 'முழு விவரம் காண்க →',
    editModalTitle: 'கேள்வியைத் திருத்தவும்',
    deleteModalTitle: 'கேள்வியை நீக்கவா?',
    deleteModalDesc: 'இந்த வழிகாட்டல் பதிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
    cancel: 'ரத்துசெய்',
    save: 'சேமி',
    delete: 'நீக்கு',
    saving: 'சேமிக்கப்படுகிறது...',
    deleting: 'நீக்கப்படுகிறது...'
  },
  landing: {
    badge: 'மொழி-முன்னுரிமை + பிரச்சனை-தீர்வு + வேத ஜோதிடம்',
    heroTitle: 'உங்கள் வாழ்க்கைப் பயணத்திற்கு வழிகாட்டும்',
    heroTitleGold: 'தெளிவான ஜோதிட வழிகாட்டல்',
    heroSubtext: 'தொழில் மாற்றங்கள், உறவுமுறை சிக்கல்கள் அல்லது உங்கள் வேத ஜாதகம் எதுவாக இருந்தாலும், உங்கள் சொந்த மொழியில் ஆஸ்ட்ரோகைடு வழிகாட்டுகிறது.',
    dashboardBtn: 'முகப்புக்குச் செல்லவும்',
    getStartedBtn: 'தொடங்குங்கள்',
    signInBtn: 'உள்நுழைக',
    miniProblemTitle: 'பிரச்சனையைப் பற்றி பேசுங்கள்',
    miniProblemSub: 'உங்கள் மனதில் உள்ளதில் இருந்து தொடங்குங்கள்',
    miniChartTitle: 'பிறப்பு ஜாதகம்',
    miniChartSub: 'பிறப்பு விவரங்களை உள்ளிடவும்',
    miniPalmTitle: 'கைரேகை வாசிப்பு',
    miniPalmSub: 'உள்ளங்கையின் புகைப்படத்தைப் பதிவேற்றவும்',
    sectionTag: 'உங்கள் பாதையைத் தேர்ந்தெடுக்கவும்',
    sectionTitle: 'நீங்கள் எவ்வாறு ஆராய விரும்புகிறீர்கள்?',
    sectionSubtitle: 'உங்களுக்கு ஏற்ற பாதையைத் தேர்வுசெய்யவும்.',
    pillarProblemTitle: 'பிரச்சனையைப் பற்றி பேசுங்கள்',
    pillarProblemDesc: 'தொழில், திருமணம், குடும்பம், நிதி சார்ந்த கேள்விகளுக்கு விடை காணுங்கள்.',
    pillarProblemBtn: 'வழிகாட்டல் பெறுக',
    pillarChartTitle: 'பிறப்பு ஜாதகம் (குண்டலி)',
    pillarChartDesc: '12 பாவங்கள் மற்றும் கிரக தசா காலங்கள் மூலம் உங்கள் வாழ்க்கைப் பாதையை அறியுங்கள்.',
    pillarChartBtn: 'ஜாதகம் காண்க',
    pillarPalmTitle: 'கைரேகை வாசிப்பு',
    pillarPalmDesc: 'ஆயுள் ரேகை, புத்தி ரேகை, இருதய ரேகை மூலம் கைரேகை சாஸ்திரத்தை அறியுங்கள்.',
    pillarPalmBtn: 'கைரேகை காண்க',
    calloutTag: 'தாய்மொழி அனுபவம்',
    calloutTitle: 'ஜோதிட ஞானம் உங்கள் சொந்த மொழியில்',
    calloutDesc: 'ஆஸ்ட்ரோகைடு தமிழ், हिन्दी, മലയാളം, తెలుగు, ಕನ್ನಡ மற்றும் English மொழிகளில் கிடைக்கிறது.',
    changeLangBtn: 'மொழியை மாற்றவும்',
    getStartedLangBtn: 'உங்கள் மொழியில் தொடங்குங்கள்'
  },
  footer: {
    brandDesc: 'பண்டைய வேத ஜோதிட ஞானமும் அதிநவீன தொழில்நுட்பமும் இணைந்து உங்கள் வாழ்க்கை பாதையை பிரகாசமாக்குகிறது.',
    quote: '"அண்டத்தில் உள்ளதே பிண்டத்திலும்."',
    exploration: 'ஆய்வு',
    guides: 'ஜோதிட வழிகாட்டிகள்',
    trust: 'நம்பகத்தன்மை & தனியுரிமை',
    copyright: 'ஆஸ்ட்ரோகைடு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    disclaimer: 'ஜோதிட வாசிப்புகள் சுய விழிப்புணர்வு மற்றும் ஆன்மீக வழிகாட்டலுக்கானவை.'
  }
};

// ----------------------------------------------------------------------
// TELUGU (తెలుగు)
// ----------------------------------------------------------------------
export const TE_JOURNEY_TRANSLATIONS: JourneyTranslations = {
  tagline: 'వ్యక్తిగత వైదిక జ్యోతిష్యం & మార్గదర్శకత్వం',
  explore: {
    stepBadge: 'దశ 2 / 5 · అంశాన్ని ఎంచుకోండి',
    title: 'ఈ రోజు మీరు దేనిని అన్వేషించాలనుకుంటున్నారు?',
    subtitle: 'మీ ఆసక్తికి తగిన అంశాన్ని ఎంచుకోండి.',
    continueBtn: 'కొనసాగించండి',
    topics: {
      marriage: {
        label: 'వివాహం & సంబంధాలు',
        description: 'వివాహ సమయం, గ్రహ స్థానాలు, 7వ భావం మరియు దశ సూచనలు.'
      },
      career: {
        label: 'కెరీర్ & ఉద్యోగం',
        description: 'వృత్తిపరమైన అభివృద్ధి, ఉద్యోగ మార్పులు మరియు నాయకత్వ కాలాలు.'
      },
      money: {
        label: 'ధనం & ఆర్థిక స్థితి',
        description: 'సంపద సమకూర్పు, పెట్టుబడులు మరియు ఆర్థిక చక్రాలు.'
      },
      relationships: {
        label: 'సంబంధాలు & ప్రేమ',
        description: 'భాగస్వామ్య సామరస్యం, భావోద్వేగ బంధాలు మరియు అనుకూలత.'
      },
      health: {
        label: 'ఆరోగ్యం & శ్రేయస్సు',
        description: 'ఆరోగ్యం, శ్రేయస్సుపై గ్రహాల ప్రభావాలు మరియు శక్తి సమతుల్యత.'
      },
      family: {
        label: 'కుటుంబం & శాంతి',
        description: 'గృహ శాంతి, తల్లిదండ్రులు మరియు కుటుంబ సామరస్యం.'
      },
      travel: {
        label: 'ప్రయాణం / విదేశాలు',
        description: 'విదేశీ అవకాశాలు, స్థిరనివాసం మరియు ప్రయాణాలు.'
      },
      general: {
        label: 'సాధారణ మార్గదర్శకత్వం',
        description: 'ప్రస్తుత దశ ప్రభావం, సమగ్ర జీవిత మార్గం మరియు గ్రహ అమరిక.'
      }
    }
  },
  readingPrepare: {
    stepBadge: 'దశ 4 / 5 · మీ జాతకం ఎలా పనిచేస్తుంది',
    title: 'మీ జ్యోతిష్య విశ్లేషణను అర్థం చేసుకోండి',
    subtitle: 'మీ జన్మ కుండలి ఆధారంగా ఆస్ట్రోగైడ్ వ్యక్తిగత మార్గదర్శకత్వాన్ని ఎలా సిద్ధం చేస్తుందో తెలుసుకోండి.',
    pillars: {
      birthDetails: {
        title: 'మీ జన్మ వివరాలు',
        description: 'ఖచ్చితమైన తేదీ, సమయం మరియు ప్రదేశం మీ గ్రహ స్థానాలను, లగ్నాన్ని ఖచ్చితంగా గణిస్తాయి.'
      },
      question: {
        title: 'మీ ప్రశ్న',
        description: 'మీరు ఎంచుకున్న అంశం మరియు నిర్దిష్ట ప్రశ్న మీకు అత్యంత ముఖ్యమైన జీవిత రంగంపై దృష్టి పెడతాయి.'
      },
      astrologyAnalysis: {
        title: 'వైదిక జ్యోతిష్య విశ్లేషణ',
        description: 'సాంప్రదాయ గ్రహ బలాలు, మహాదశలు, అంతర్దశలు మరియు అనుకూల సమయాలు విశ్లేషించబడతాయి.'
      },
      personalizedGuidance: {
        title: 'వ్యక్తిగత మార్గదర్శకత్వం',
        description: 'జ్యోతిష్య ఫలితాలు మీ మాతృభాషలో స్పష్టమైన, ఆచరణాత్మక మార్గదర్శకత్వంగా మార్చబడతాయి.'
      }
    },
    backBtn: 'వెనుకకు',
    continueBtn: 'ప్రశ్నకు కొనసాగించండి'
  },
  readingQuestion: {
    stepBadge: 'దశ 5 / 5 · ఆస్ట్రోగైడ్‌ను అడగండి',
    topicLabel: 'అంశం',
    title: 'మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?',
    subtitle: 'మీ జీవితం గురించి ఏదైనా ప్రశ్న అడగండి లేదా క్రింద సూచించిన ప్రశ్నల నుండి ఎంచుకోండి.',
    inputPlaceholder: 'మీ జీవితం గురించి ఒక ప్రశ్న అడగండి...',
    suggestedIn: 'సూచించిన ప్రశ్నలు',
    loadingMessages: [
      'మీ జాతకం పరిశీలించబడుతోంది...',
      'గ్రహ స్థానాలు విశ్లేషించబడుతున్నాయి...',
      'మీ మార్గదర్శకత్వం సిద్ధమవుతోంది...'
    ],
    loadingSubtext: 'గ్రహ గోచారాలు, దశా చక్రాలు మరియు భావ స్థానాలు విశ్లేషించబడుతున్నాయి...',
    backBtn: 'వెనుకకు',
    askBtn: 'ఆస్ట్రోగైడ్‌ను అడగండి'
  },
  readingResult: {
    askAnother: 'మరొక ప్రశ్న అడగండి',
    viewHistory: 'మార్గదర్శక చరిత్ర',
    currentInquiry: 'ప్రస్తుత ప్రశ్న',
    category: 'వర్గం',
    yourQuestion: 'మీ ప్రశ్న',
    birthProfile: 'జన్మ కుండలి వివరాలు',
    newQuestion: '+ కొత్త ప్రశ్న',
    plan: {
      name: 'వ్యక్తిగత అన్వేషక ప్రణాళిక',
      badge: 'క్రియాశీల సభ్యుడు',
      remaining: 'అపరిమిత ప్రాథమిక ప్రశ్నలు',
      status: '✓ వైదిక గణనలు ప్రారంభించబడ్డాయి'
    },
    chat: {
      title: 'ఆస్ట్రోగైడ్',
      subtitle: 'వ్యక్తిగత వైదిక జ్యోతిష్కుడు & మార్గదర్శి',
      liveSession: 'ప్రత్యక్ష కుండలి సెషన్',
      you: 'మీరు',
      readingChart: 'ఆస్ట్రోగైడ్ మీ జాతకాన్ని చదువుతోంది...',
      suggestedFollowUps: 'సూచించిన తదుపరి ప్రశ్నలు:',
      inputPlaceholder: 'ఆస్ట్రోగైడ్‌ను ఏదైనా అడగండి...',
      send: 'పంపు'
    },
    timing: {
      supportivePeriods: 'అనుకూలమైన కాలాలు'
    },
    astrologyDetails: {
      toggle: 'జ్యోతిష్య వివరాలను చూడండి',
      seventhHouse: '7వ భావం',
      seventhLord: '7వ భావాధిపతి',
      venus: 'శుక్రుడు',
      jupiter: 'బృహస్పతి (గురు)',
      mahadasha: 'మహాదశ',
      antardasha: 'అంతర్దశ',
      house: 'భావం',
      supportingFactors: 'అనుకూల అంశాలు',
      cautionFactors: 'జాగ్రత్త వహించాల్సిన అంశాలు'
    },
    guidanceTabs: {
      heading: 'కెరీర్ & జీవిత మార్గదర్శకత్వం',
      subheading: 'ఇతర జీవిత రంగాలలో మార్గదర్శకత్వాన్ని సులభంగా అన్వేషించండి.',
      curiousAbout: 'తెలుసుకోవాలనుకుంటున్నారా',
      askAbout: 'అడగండి',
      tabs: {
        career: 'కెరీర్',
        money: 'ధనం',
        relationships: 'సంబంధాలు',
        family: 'కుటుంబం',
        travel: 'ప్రయాణం',
        health: 'ఆరోగ్యం',
        growth: 'వ్యక్తిగత అభివృద్ధి'
      }
    },
    palm: {
      title: 'హస్తసాముద్రిక పఠనం',
      desc: 'మీ వైదిక జాతకాన్ని ధృవీకరించడానికి ఆయుష్షు రేఖ, హృదయ రేఖ, జ్ఞాన రేఖలను విశ్లేషించండి.',
      btn: 'హస్తసాముద్రికం విశ్లేషించండి',
      badge: 'సిద్ధంగా ఉంది',
      alertMessage: 'హస్తసాముద్రిక విశ్లేషణ మాడ్యూల్ సిద్ధంగా ఉంది.'
    },
    recommendations: {
      heading: 'మీ కోసం సూచించినవి',
      career: 'కెరీర్ ప్రగతి మరియు సమయం',
      money: 'ఆర్థిక స్థిరత్వ చక్రాలు',
      travel: 'విదేశీ ప్రయాణం & నివాసం'
    },
    categories: {
      marriageTiming: 'వివాహ సమయం',
      marriage: 'వివాహం',
      careerTiming: 'కెరీర్ సమయం',
      career: 'కెరీర్',
      money: 'ధనం & ఆర్థికం',
      relationships: 'సంబంధాలు',
      family: 'కుటుంబం',
      travel: 'ప్రయాణం / విదేశాలు',
      health: 'ఆరోగ్యం',
      education: 'విద్య',
      business: 'వ్యాపారం',
      general: 'సాధారణ మార్గదర్శకత్వం'
    },
    followUps: {
      marriage: [
        'దీనికి గల జ్యోతిష్య కారణాలు ఏమిటి?',
        'నా జీవిత భాగస్వామి గురించి నా జాతకం ఏమి చెబుతోంది?',
        'వివాహానికి అత్యంత అనుకూలమైన సంవత్సరం ఏది?'
      ],
      career: [
        'ఉద్యోగం మారడానికి ఇది మంచి సమయమా?',
        'కెరీర్‌లో పురోగతి ఎప్పుడు ఉంటుంది?',
        'వ్యాపారం ప్రారంభించడానికి జాతకం అనుకూలంగా ఉందా?'
      ],
      finance: [
        'ఆర్థిక పరిస్థితి ఎప్పుడు మెరుగుపడుతుంది?',
        'పెట్టుబడులు పెట్టడానికి ఇది సురక్షితమైన సమయమా?'
      ],
      travel: [
        'విదేశాలకు వెళ్లే యోగం ఎప్పుడు ఉంది?',
        'విదేశాల్లో శాశ్వత నివాసం సాధ్యమేనా?'
      ],
      general: [
        'ప్రస్తుతం నా జీవితంపై ఏ గ్రహ ప్రభావం ఎక్కువగా ఉంది?',
        'తదుపరి అనుకూల కాలం ఎప్పుడు ప్రారంభమవుతుంది?',
        'ఈ సమయంలో నేను ప్రధానంగా దేనిపై దృష్టి పెట్టాలి?'
      ]
    }
  },
  readingHistory: {
    title: 'మార్గదర్శక చరిత్ర',
    subtitle: 'మీ మునుపటి జ్యోతిష్య సంప్రదింపులను సమీక్షించండి.',
    newQuestion: '+ కొత్త ప్రశ్న అడగండి',
    loading: 'చరిత్ర లోడ్ అవుతోంది...',
    emptyTitle: 'చరిత్ర ఇంకా అందుబాటులో లేదు',
    emptyDesc: 'మీరు అడిగే ప్రశ్నలు మరియు సమాధానాలు ఇక్కడ సురక్షితంగా ఉంటాయి.',
    startReading: 'మొదటి విశ్లేషణను ప్రారంభించండి',
    viewFullReading: 'పూర్తి వివరాలు చూడండి →',
    editModalTitle: 'ప్రశ్నను సవరించండి',
    deleteModalTitle: 'ప్రశ్నను తొలగించాలా?',
    deleteModalDesc: 'మీరు ఖచ్చితంగా ఈ రికార్డును తొలగించాలనుకుంటున్నారా?',
    cancel: 'రద్దు చేయండి',
    save: 'భద్రపరచండి',
    delete: 'తొలగించండి',
    saving: 'భద్రపరుస్తోంది...',
    deleting: 'తొలగిస్తోంది...'
  },
  landing: {
    badge: 'భాష-ప్రాధాన్యత + సమస్య-పరిష్కారం + వైదిక జ్యోతిష్యం',
    heroTitle: 'మీ జీవిత ప్రయాణానికి దిశా నిర్దేశం',
    heroTitleGold: 'స్పష్టమైన జ్యోతిష్య వెలుగుతో',
    heroSubtext: 'కెరీర్ మార్పులు, సంబంధాల సందేహాలు లేదా మీ వైదిక జన్మ కుండలి ఏదైనా, మీ మాతృభాషలోనే ఆస్ట్రోగైడ్ ఖచ్చితమైన సమాధానాలను అందిస్తుంది.',
    dashboardBtn: 'డాష్‌బోర్డ్‌కు వెళ్ళండి',
    getStartedBtn: 'ప్రారంభించండి',
    signInBtn: 'సైన్ ఇన్',
    miniProblemTitle: 'సమస్య గురించి మాట్లాడండి',
    miniProblemSub: 'మీ మనస్సులోని విషయంతో ప్రారంభించండి',
    miniChartTitle: 'జన్మ కుండలి',
    miniChartSub: 'పుట్టిన వివరాలను నమోదు చేయండి',
    miniPalmTitle: 'హస్తసాముద్రిక పఠనం',
    miniPalmSub: 'అరచేతి ఫోటోను అప్‌లోడ్ చేయండి',
    sectionTag: 'మీ మార్గాన్ని ఎంచుకోండి',
    sectionTitle: 'మీరు ఎలా అన్వేషించాలనుకుంటున్నారు?',
    sectionSubtitle: 'మీకు తగిన మార్గాన్ని ఎంచుకోండి.',
    pillarProblemTitle: 'సమస్య గురించి మాట్లాడండి',
    pillarProblemDesc: 'కెరీర్, వివాహం, కుటుంబం మరియు ధన సంబంధిత ప్రశ్నలకు సమాధానాలు పొందండి.',
    pillarProblemBtn: 'మార్గదర్శకత్వం పొందండి',
    pillarChartTitle: 'జన్మ కుండలి (కుండలి)',
    pillarChartDesc: '12 భావాలు మరియు గ్రహ మహాదశల ద్వారా మీ జీవిత మార్గాన్ని తెలుసుకోండి.',
    pillarChartBtn: 'కుండలి చూడండి',
    pillarPalmTitle: 'హస్తసాముద్రిక పఠనం',
    pillarPalmDesc: 'జీవిత రేఖ, హృదయ రేఖ మరియు జ్ఞాన రేఖల ద్వారా హస్తసాముద్రికాన్ని అర్థం చేసుకోండి.',
    pillarPalmBtn: 'హస్తసాముద్రికం చూడండి',
    calloutTag: 'మాతృభాషా అనుభవం',
    calloutTitle: 'జ్యోతిష్య జ్ఞానం మీ స్వంత భాషలో',
    calloutDesc: 'ఆస్ట్రోగైడ్ తెలుగు, हिन्दी, മലയാളം, தமிழ், ಕನ್ನಡ మరియు English భాషలలో అందుబాటులో ఉంది.',
    changeLangBtn: 'భాషను మార్చండి',
    getStartedLangBtn: 'మీ భాషలో ప్రారంభించండి'
  },
  footer: {
    brandDesc: 'పురాతన వైదిక జ్యోతిష్య జ్ఞానం మరియు ఆధునిక సాంకేతికత కలయిక, మీ జీవిత మార్గాన్ని ప్రకాశవంతం చేయడానికి.',
    quote: '"విశ్వంలో ఎలాగో, మనస్సులోనూ అలాగే."',
    exploration: 'అన్వేషణ',
    guides: 'జ్యోతిష్య మార్గదర్శకాలు',
    trust: 'విశ్వసనీయత & గోప్యత',
    copyright: 'ఆస్ట్రోగైడ్. సర్వహక్కులు ప్రత్యేకించబడ్డాయి.',
    disclaimer: 'జ్యోతిష్య ఫలితాలు ఆత్మపరిశీలన మరియు ఆధ్యాత్మిక అవగాహన కోసం మాత్రమే.'
  }
};

// ----------------------------------------------------------------------
// KANNADA (ಕನ್ನಡ)
// ----------------------------------------------------------------------
export const KN_JOURNEY_TRANSLATIONS: JourneyTranslations = {
  tagline: 'ವೈಯಕ್ತಿಕ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ',
  explore: {
    stepBadge: 'ಹಂತ 2 / 5 · ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    title: 'ಇಂದು ನೀವು ಏನನ್ನು ಅನ್ವೇಷಿಸಲು ಬಯಸುತ್ತೀರಿ?',
    subtitle: 'ನಿಮ್ಮ ಆಸಕ್ತಿಗೆ ತಕ್ಕಂತೆ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    continueBtn: 'ಮುಂದುವರಿಯಿರಿ',
    topics: {
      marriage: {
        label: 'ವಿವಾಹ & ಸಂಬಂಧಗಳು',
        description: 'ವಿವಾಹದ ಸಮಯ, ಗ್ರಹಗಳ ಸ್ಥಿತಿ, 7ನೇ ಭಾವ ಮತ್ತು ದಶಾ ಸೂಚನೆಗಳು.'
      },
      career: {
        label: 'ವೃತ್ತಿಜೀವನ & ಉದ್ಯೋಗ',
        description: 'ವೃತ್ತಿಪರ ಬೆಳವಣಿಗೆ, ಉದ್ಯೋಗ ಬದಲಾವಣೆ ಮತ್ತು ನಾಯಕತ್ವದ ಸಮಯಗಳು.'
      },
      money: {
        label: 'ಹಣ & ಆರ್ಥಿಕತೆ',
        description: 'ಸಂಪತ್ತಿನ ಸಂಚಯ, ಹೂಡಿಕೆಗಳು ಮತ್ತು ಆರ್ಥಿಕ ಚಕ್ರಗಳು.'
      },
      relationships: {
        label: 'ಸಂಬಂಧಗಳು & ಪ್ರೀತಿ',
        description: 'ಸಹಭಾಗಿತ್ವದ ಸಾಮರಸ್ಯ, ಭಾವನಾತ್ಮಕ ಬಂಧಗಳು ಮತ್ತು ಹೊಂದಾಣಿಕೆ.'
      },
      health: {
        label: 'ಆರೋಗ್ಯ & ಕ್ಷೇಮ',
        description: 'ಆರೋಗ್ಯ, ಗ್ರಹಗಳ ಪ್ರಭಾವಗಳು ಮತ್ತು ಶಕ್ತಿಯ ಸಮತೋಲನ.'
      },
      family: {
        label: 'ಕುಟುಂಬ & ಶಾಂತಿ',
        description: 'ಮನೆಯ ಶಾಂತಿ, ಪೋಷಕರು ಮತ್ತು ಕುಟುಂಬ ಸಾಮರಸ್ಯ.'
      },
      travel: {
        label: 'ಪ್ರಯಾಣ / ವಿದೇಶ ವಾಸ',
        description: 'ವಿದೇಶಿ ಅವಕಾಶಗಳು, ಸ್ಥಳಾಂತರ ಮತ್ತು ಪ್ರಯಾಣಗಳು.'
      },
      general: {
        label: 'ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನ',
        description: 'ಪ್ರಸ್ತುತ ದಶೆಯ ಪ್ರಭಾವ, ಒಟ್ಟಾರೆ ಜೀವನ ಪಥ ಮತ್ತು ಗ್ರಹಗಳ ಜೋಡಣೆ.'
      }
    }
  },
  readingPrepare: {
    stepBadge: 'ಹಂತ 4 / 5 · ನಿಮ್ಮ ಜಾತಕ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    title: 'ನಿಮ್ಮ ಜ್ಯೋತಿಷ್ಯ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ',
    subtitle: 'ನಿಮ್ಮ ಜನ್ಮ ಕುಂಡಲಿಯನ್ನು ಆಧರಿಸಿ ಆಸ್ಟ್ರೋಗೈಡ್ ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನವನ್ನು ಹೇಗೆ ಸಿದ್ಧಪಡಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ತಿಳಿಯಿರಿ.',
    pillars: {
      birthDetails: {
        title: 'ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳು',
        description: 'ನಿಖರವಾದ ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳ ನಿಮ್ಮ ಗ್ರಹಗಳ ಸ್ಥಾನಗಳನ್ನು ಮತ್ತು ಲಗ್ನವನ್ನು ನಿಖರವಾಗಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತವೆ.'
      },
      question: {
        title: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ',
        description: 'ನೀವು ಆಯ್ಕೆಮಾಡುವ ವಿಷಯ ಮತ್ತು ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆ ನಿಮಗೆ ಅತ್ಯಂತ ಮುಖ್ಯವಾದ ಜೀವನ ಕ್ಷೇತ್ರದ ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸುತ್ತದೆ.'
      },
      astrologyAnalysis: {
        title: 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ವಿಶ್ಲೇಷಣೆ',
        description: 'ಸಾಂಪ್ರದಾಯಿಕ ಗ್ರಹ ಬಲಗಳು, ಮಹಾದಶೆಗಳು, ಅಂತರ್ದಶೆಗಳು ಮತ್ತು ಅನುಕೂಲಕರ ಸಮಯಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುತ್ತದೆ.'
      },
      personalizedGuidance: {
        title: 'ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ',
        description: 'ತಾಂತ್ರಿಕ ಜ್ಯೋತಿಷ್ಯ ಫಲಿತಾಂಶಗಳನ್ನು ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಸ್ಪಷ್ಟ, ಸರಳ ಮಾರ್ಗದರ್ಶನವಾಗಿ ನೀಡಲಾಗುತ್ತದೆ.'
      }
    },
    backBtn: 'ಹಿಂದೆ',
    continueBtn: 'ಪ್ರಶ್ನೆಗೆ ಮುಂದುವರಿಯಿರಿ'
  },
  readingQuestion: {
    stepBadge: 'ಹಂತ 5 / 5 · ಆಸ್ಟ್ರೋಗೈಡ್ ಅನ್ನು ಕೇಳಿ',
    topicLabel: 'ವಿಷಯ',
    title: 'ನೀವು ಏನನ್ನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?',
    subtitle: 'ನಿಮ್ಮ ಜೀವನದ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ ಅಥವಾ ಕೆಳಗೆ ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳಿಂದ ಆರಿಸಿ.',
    inputPlaceholder: 'ನಿಮ್ಮ ಜೀವನದ ಬಗ್ಗೆ ಒಂದು ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...',
    suggestedIn: 'ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು',
    loadingMessages: [
      'ನಿಮ್ಮ ಜಾತಕವನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
      'ಗ್ರಹಗಳ ಸ್ಥಾನಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      'ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶನವನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...'
    ],
    loadingSubtext: 'ಗ್ರಹಗಳ ಗೋಚಾರಗಳು, ದಶಾ ಚಕ್ರಗಳು ಮತ್ತು ಭಾವ ಸ್ಥಾನಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    backBtn: 'ಹಿಂದೆ',
    askBtn: 'ಆಸ್ಟ್ರೋಗೈಡ್ ಅನ್ನು ಕೇಳಿ'
  },
  readingResult: {
    askAnother: 'ಮತ್ತೊಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ',
    viewHistory: 'ಮಾರ್ಗದರ್ಶನ ಇತಿಹಾಸ',
    currentInquiry: 'ಪ್ರಸ್ತುತ ಪ್ರಶ್ನೆ',
    category: 'ವಿಭಾಗ',
    yourQuestion: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ',
    birthProfile: 'ಜನ್ಮ ಕುಂಡಲಿ ಪ್ರೊಫೈಲ್',
    newQuestion: '+ ಹೊಸ ಪ್ರಶ್ನೆ',
    plan: {
      name: 'ವೈಯಕ್ತಿಕ ಅನ್ವೇಷಕ ಯೋಜನೆ',
      badge: 'ಸಕ್ರಿಯ ಸದಸ್ಯ',
      remaining: 'ಅನಿಯಮಿತ ಮೂಲಭೂತ ಪ್ರಶ್ನೆಗಳು',
      status: '✓ ವೈದಿಕ ಲೆಕ್ಕಾಚಾರಗಳು ಸಕ್ರಿಯವಾಗಿವೆ'
    },
    chat: {
      title: 'ಆಸ್ಟ್ರೋಗೈಡ್',
      subtitle: 'ವೈಯಕ್ತಿಕ ವೈದಿಕ ಜ್ಯೋತಿಷಿ & ಮಾರ್ಗದರ್ಶಿ',
      liveSession: 'ಲೈವ್ ಕುಂಡಲಿ ಸೆಷನ್',
      you: 'ನೀವು',
      readingChart: 'ಆಸ್ಟ್ರೋಗೈಡ್ ನಿಮ್ಮ ಜಾತಕವನ್ನು ಓದುತ್ತಿದೆ...',
      suggestedFollowUps: 'ಸೂಚಿಸಲಾದ ಮುಂದಿನ ಪ್ರಶ್ನೆಗಳು:',
      inputPlaceholder: 'ಆಸ್ಟ್ರೋಗೈಡ್ ಅನ್ನು ಏನನ್ನಾದರೂ ಕೇಳಿ...',
      send: 'ಕಳುಹಿಸಿ'
    },
    timing: {
      supportivePeriods: 'ಅನುಕೂಲಕರ ಅವಧಿಗಳು'
    },
    astrologyDetails: {
      toggle: 'ಜ್ಯೋತಿಷ್ಯ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
      seventhHouse: '7ನೇ ಭಾವ',
      seventhLord: '7ನೇ ಅಧಿಪತಿ',
      venus: 'ಶುಕ್ರ',
      jupiter: 'ಗುರು',
      mahadasha: 'ಮಹಾದಶೆ',
      antardasha: 'ಅಂತರ್ದಶೆ',
      house: 'ಭಾವ',
      supportingFactors: 'ಅನುಕೂಲಕರ ಅಂಶಗಳು',
      cautionFactors: 'ಎಚ್ಚರಿಕೆ ವಹಿಸಬೇಕಾದ ಅಂಶಗಳು'
    },
    guidanceTabs: {
      heading: 'ವೃತ್ತಿ & ಜೀವನ ಮಾರ್ಗದರ್ಶನ',
      subheading: 'ಪ್ರೊಫೈಲ್ ಅನ್ನು ಮರುಹೊಂದಿಸದೆ ಇತರ ಜೀವನ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.',
      curiousAbout: 'ತಿಳಿಯಲು ಬಯಸುವಿರಾ',
      askAbout: 'ಕೇಳಿ',
      tabs: {
        career: 'ವೃತ್ತಿ',
        money: 'ಹಣ',
        relationships: 'ಸಂಬಂಧಗಳು',
        family: 'ಕುಟುಂಬ',
        travel: 'ಪ್ರಯಾಣ',
        health: 'ಆರೋಗ್ಯ',
        growth: 'ವೈಯಕ್ತಿಕ ಬೆಳವಣಿಗೆ'
      }
    },
    palm: {
      title: 'ಹಸ್ತಸಾಮುದ್ರಿಕ ಓದುವಿಕೆ',
      desc: 'ನಿಮ್ಮ ವೈದಿಕ ಜಾತಕಕ್ಕೆ ಪೂರಕವಾಗಿ ಜೀವ ರೇಖೆ, ಹೃದಯ ರೇಖೆ, ಬುದ್ಧಿ ರೇಖೆಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ.',
      btn: 'ಹಸ್ತಸಾಮುದ್ರಿಕ ನೋಡಿ',
      badge: 'ಲಭ್ಯವಿದೆ',
      alertMessage: 'ಹಸ್ತಸಾಮುದ್ರಿಕ ವಿಶ್ಲೇಷಣಾ ಮಾಡ್ಯೂಲ್ ಸಿದ್ಧವಾಗಿದೆ.'
    },
    recommendations: {
      heading: 'ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
      career: 'ವೃತ್ತಿ ಪ್ರಗತಿ ಮತ್ತು ಸಮಯ',
      money: 'ಆರ್ಥಿಕ ಸ್ಥಿರತೆಯ ಚಕ್ರಗಳು',
      travel: 'ವಿದೇಶ ಪ್ರಯಾಣ & ನೆಲೆಸುವಿಕೆ'
    },
    categories: {
      marriageTiming: 'ವಿವಾಹದ ಸಮಯ',
      marriage: 'ವಿವಾಹ',
      careerTiming: 'ವೃತ್ತಿ ಸಮಯ',
      career: 'ವೃತ್ತಿ',
      money: 'ಹಣ & ಸಂಪತ್ತು',
      relationships: 'ಸಂಬಂಧಗಳು',
      family: 'ಕುಟುಂಬ',
      travel: 'ಪ್ರಯಾಣ / ವಿದೇಶ ವಾಸ',
      health: 'ಆರೋಗ್ಯ',
      education: 'ಶಿಕ್ಷಣ',
      business: 'ವ್ಯವಹಾರ',
      general: 'ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನ'
    },
    followUps: {
      marriage: [
        'ಇದಕ್ಕೆ ಜ್ಯೋತಿಷ್ಯ ಕಾರಣಗಳು ಯಾವುವು?',
        'ನನ್ನ ಜೀವನ ಸಂಗಾತಿಯ ಬಗ್ಗೆ ಜಾತಕ ಏನು ಹೇಳುತ್ತದೆ?',
        'ವಿವಾಹಕ್ಕೆ ಅತ್ಯಂತ ಅನುಕೂಲಕರವಾದ ವರ್ಷ ಯಾವುದು?'
      ],
      career: [
        'ಉದ್ಯೋಗ ಬದಲಾಯಿಸಲು ಇದು ಒಳ್ಳೆಯ ಸಮಯವೇ?',
        'ವೃತ್ತಿಯಲ್ಲಿ ಬೆಳವಣಿಗೆ ಯಾವಾಗ ನಿರೀಕ್ಷಿಸಬಹುದು?',
        'ವ್ಯವಹಾರ ಪ್ರಾರಂಭಿಸಲು ಜಾತಕ ಅನುಕೂಲವಾಗಿದೆಯೇ?'
      ],
      finance: [
        'ಆರ್ಥಿಕ ಪರಿಸ್ಥಿತಿ ಯಾವಾಗ ಸುಧಾರಿಸುತ್ತದೆ?',
        'ಹೂಡಿಕೆ ಮಾಡಲು ಇದು ಸುರಕ್ಷಿತ ಸಮಯವೇ?'
      ],
      travel: [
        'ವಿದೇಶಕ್ಕೆ ಹೋಗಲು ಯಾವಾಗ ಅವಕಾಶವಿದೆ?',
        'ವಿದೇಶದಲ್ಲಿ ಶಾಶ್ವತವಾಗಿ ನೆಲೆಸಲು ಸಾಧ್ಯವೇ?'
      ],
      general: [
        'ಪ್ರಸ್ತುತ ನನ್ನ ಜೀವನದ ಮೇಲೆ ಯಾವ ಗ್ರಹದ ಪ್ರಭಾವ ಹೆಚ್ಚಾಗಿದೆ?',
        'ಮುಂದಿನ ಶುಭ ಸಮಯ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ?',
        'ಈ ಸಮಯದಲ್ಲಿ ನಾನು ಮುಖ್ಯವಾಗಿ ಯಾವುದರ ಮೇಲೆ ಗಮನಹರಿಸಬೇಕು?'
      ]
    }
  },
  readingHistory: {
    title: 'ಮಾರ್ಗದರ್ಶನ ಇತಿಹಾಸ',
    subtitle: 'ನಿಮ್ಮ ಹಿಂದಿನ ಜ್ಯೋತಿಷ್ಯ ಸಮಾಲೋಚನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    newQuestion: '+ ಹೊಸ ಪ್ರಶ್ನೆ ಕೇಳಿ',
    loading: 'ಇತಿಹಾಸ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    emptyTitle: 'ಇತಿಹಾಸ ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ',
    emptyDesc: 'ನೀವು ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಉತ್ತರಗಳು ಇಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.',
    startReading: 'ಮೊದಲ ಸಮಾಲೋಚನೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ',
    viewFullReading: 'ಪೂರ್ಣ ವಿವರ ನೋಡಿ →',
    editModalTitle: 'ಪ್ರಶ್ನೆಯನ್ನು ಸಂಪಾದಿಸಿ',
    deleteModalTitle: 'ಪ್ರಶ್ನೆಯನ್ನು ಅಳಿಸುವುದೇ?',
    deleteModalDesc: 'ನೀವು ಖಚಿತವಾಗಿ ಈ ದಾಖಲೆಯನ್ನು ತೆಗೆದುಹಾಕಲು ಬಯಸುವಿರಾ?',
    cancel: 'ರದ್ದುಮಾಡಿ',
    save: 'ಉಳಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    saving: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
    deleting: 'ಅಳಿಸಲಾಗುತ್ತಿದೆ...'
  },
  landing: {
    badge: 'ಭಾಷಾ-ಆದ್ಯತೆ + ಸಮಸ್ಯೆ-ಪರಿಹಾರ + ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ',
    heroTitle: 'ನಿಮ್ಮ ಜೀವನ ಪಯಣಕ್ಕೆ ದಾರಿದೀಪ',
    heroTitleGold: 'ಸ್ಪಷ್ಟ ಜ್ಯೋತಿಷ್ಯ ಮಾರ್ಗದರ್ಶನ',
    heroSubtext: 'ವೃತ್ತಿ ಬದಲಾವಣೆಗಳು, ಸಂಬಂಧಗಳ ಗೊಂದಲಗಳು ಅಥವಾ ನಿಮ್ಮ ವೈದಿಕ ಜನ್ಮ ಕುಂಡಲಿ ಏನೇ ಇರಲಿ, ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲೇ ಆಸ್ಟ್ರೋಗೈಡ್ ನಿಖರ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.',
    dashboardBtn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ',
    getStartedBtn: 'ಪ್ರಾರಂಭಿಸಿ',
    signInBtn: 'ಸೈನ್ ಇನ್',
    miniProblemTitle: 'ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ಮಾತನಾಡಿ',
    miniProblemSub: 'ನಿಮ್ಮ ಮನಸ್ಸಿನಲ್ಲಿರುವ ವಿಷಯದಿಂದ ಪ್ರಾರಂಭಿಸಿ',
    miniChartTitle: 'ಜನ್ಮ ಕುಂಡಲಿ',
    miniChartSub: 'ಜನ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
    miniPalmTitle: 'ಹಸ್ತಸಾಮುದ್ರಿಕ ಓದುವಿಕೆ',
    miniPalmSub: 'ಅಂಗೈ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    sectionTag: 'ನಿಮ್ಮ ಮಾರ್ಗವನ್ನು ಆರಿಸಿ',
    sectionTitle: 'ನೀವು ಹೇಗೆ ಅನ್ವೇಷಿಸಲು ಬಯಸುತ್ತೀರಿ?',
    sectionSubtitle: 'ನಿಮಗೆ ಸರಿಹೊಂದುವ ಮಾರ್ಗವನ್ನು ಆರಿಸಿ.',
    pillarProblemTitle: 'ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ಮಾತನಾಡಿ',
    pillarProblemDesc: 'ವೃತ್ತಿ, ವಿವಾಹ, ಕುಟುಂಬ ಮತ್ತು ಹಣಕಾಸಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ.',
    pillarProblemBtn: 'ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ',
    pillarChartTitle: 'ಜನ್ಮ ಕುಂಡಲಿ (ಕುಂಡಲಿ)',
    pillarChartDesc: '12 ಭಾವಗಳು ಮತ್ತು ಗ್ರಹ ಮಹಾದಶೆಗಳ ಮೂಲಕ ನಿಮ್ಮ ಜೀವನ ಪಥವನ್ನು ತಿಳಿಯಿರಿ.',
    pillarChartBtn: 'ಕುಂಡಲಿ ನೋಡಿ',
    pillarPalmTitle: 'ಹಸ್ತಸಾಮುದ್ರಿಕ ಓದುವಿಕೆ',
    pillarPalmDesc: 'ಜೀವ ರೇಖೆ, ಹೃದಯ ರೇಖೆ, ಬುದ್ಧಿ ರೇಖೆಗಳ ಮೂಲಕ ಹಸ್ತಸಾಮುದ್ರಿಕವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
    pillarPalmBtn: 'ಹಸ್ತಸಾಮುದ್ರಿಕ ನೋಡಿ',
    calloutTag: 'ಮಾತೃಭಾಷಾ ಅನುಭವ',
    calloutTitle: 'ಜ್ಯೋತಿಷ್ಯ ಜ್ಞಾನ ನಿಮ್ಮ ಸ್ವಂತ ಭಾಷೆಯಲ್ಲಿ',
    calloutDesc: 'ಆಸ್ಟ್ರೋಗೈಡ್ ಕನ್ನಡ, हिन्दी, മലയാളം, தமிழ், తెలుగు ಮತ್ತು English ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ.',
    changeLangBtn: 'ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ',
    getStartedLangBtn: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಪ್ರಾರಂಭಿಸಿ'
  },
  footer: {
    brandDesc: 'ಪುರಾತನ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಜ್ಞಾನ ಮತ್ತು ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನದ ಸಮನ್ವಯ, ನಿಮ್ಮ ಜೀವನ ಪಥವನ್ನು ಬೆಳಗಿಸಲು.',
    quote: '"ಬ್ರಹ್ಮಾಂಡದಲ್ಲಿ ಹೇಗೋ, ಪಿಂಡಾಂಡದಲ್ಲೂ ಹಾಗೆ."',
    exploration: 'ಅನ್ವೇಷಣೆ',
    guides: 'ಜ್ಯೋತಿಷ್ಯ ಮಾರ್ಗದರ್ಶಿಗಳು',
    trust: 'ವಿಶ್ವಾಸಾರ್ಹತೆ & ಗೌಪ್ಯತೆ',
    copyright: 'ಆಸ್ಟ್ರೋಗೈಡ್. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    disclaimer: 'ಜ್ಯೋತಿಷ್ಯ ವಾಚನಗಳು ಆತ್ಮಾವಲೋಕನ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಅರಿವಿಗಾಗಿ ಮಾತ್ರ.'
  }
};
