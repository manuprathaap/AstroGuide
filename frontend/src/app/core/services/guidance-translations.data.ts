export interface GuidanceReadingSection {
  happening: string;
  guidance: string;
  action: string;
}

export interface GuidanceCategoryTranslation {
  label: string;
  description: string;
  transitFocus: string;
}

export interface GuidanceTranslations {
  backToDashboard: string;
  backToOverview: string;
  backToTopics: string;
  backToQuestion: string;
  back: string;
  historyBtn: string;
  stepWord: string;
  ofWord: string;
  steps: {
    overview: string;
    topic: string;
    problem: string;
    analyzing: string;
    reading: string;
  };
  step1: {
    title: string;
    subtitle: string;
    badge: string;
    introTitle: string;
    introDesc: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    beginBtn: string;
  };
  step2: {
    title: string;
    subtitle: string;
    continueBtn: string;
    backBtn: string;
    categories: {
      career: GuidanceCategoryTranslation;
      relationship: GuidanceCategoryTranslation;
      marriage: GuidanceCategoryTranslation;
      finance: GuidanceCategoryTranslation;
      family: GuidanceCategoryTranslation;
      education: GuidanceCategoryTranslation;
      general: GuidanceCategoryTranslation;
    };
  };
  step3: {
    title: string;
    subtitle: string;
    selectedTopic: string;
    changeTopic: string;
    label: string;
    sublabel: string;
    placeholder: string;
    submitBtn: string;
    submittingBtn: string;
    privacyNote: string;
    errors: {
      required: string;
      minLength: string;
      maxLength: string;
    };
  };
  step4: {
    title: string;
    subtitle: string;
    synthesis: string;
    remedies: string;
  };
  step5: {
    title: string;
    subtitle: string;
    analysisBadge: string;
    happeningTitle: string;
    guidanceTitle: string;
    remedyTitle: string;
    askAnotherBtn: string;
    viewHistoryBtn: string;
    readings: {
      career: GuidanceReadingSection;
      relationship: GuidanceReadingSection;
      marriage: GuidanceReadingSection;
      finance: GuidanceReadingSection;
      family: GuidanceReadingSection;
      education: GuidanceReadingSection;
      general: GuidanceReadingSection;
    };
  };
  history: {
    title: string;
    badge: string;
    emptyHeading: string;
    emptyDesc: string;
    popularTopics: string;
    viewBtn: string;
    editBtn: string;
    deleteBtn: string;
    viewModalTitle: string;
    problemStatement: string;
    transitPerspective: string;
    transitPerspectiveText: string;
    closeBtn: string;
    editProblemBtn: string;
    editModalTitle: string;
    editLabel: string;
    cancelBtn: string;
    saveChangesBtn: string;
    savingBtn: string;
    deleteModalTitle: string;
    deleteConfirmText: string;
    deleteWarningSub: string;
    deletePermanentBtn: string;
    deletingBtn: string;
    toastUpdated: string;
    toastDeleted: string;
    toastCreated: string;
  };
}

export const EN_GUIDANCE_TRANSLATIONS: GuidanceTranslations = {
  backToDashboard: 'Back to Dashboard',
  backToOverview: 'Back to Overview',
  backToTopics: 'Back to Topics',
  backToQuestion: 'Back to Question',
  back: 'Back',
  historyBtn: 'History',
  stepWord: 'Step',
  ofWord: 'of',
  steps: {
    overview: 'Overview',
    topic: 'Topic',
    problem: 'Problem',
    analyzing: 'Analyzing',
    reading: 'Reading'
  },
  step1: {
    title: 'Talk About Your Problem',
    subtitle: "Share what's on your mind and get personalized guidance.",
    badge: 'Vedic Astrological Counsel',
    introTitle: 'What is on your mind?',
    introDesc: 'Whether you are confronting career uncertainty, relationship crossroads, financial decisions, or personal life purpose, AstroGuide provides clarity based on planetary movements and Vedic wisdom.',
    pillar1Title: 'Planetary Transits',
    pillar1Desc: 'Analyze active planetary influences, Dasha periods, and astrological houses impacting your situation.',
    pillar2Title: 'Private & Confidential',
    pillar2Desc: 'Your inquiry is completely private and protected under authenticated JWT security.',
    pillar3Title: 'Actionable Remedies',
    pillar3Desc: 'Receive constructive guidance, auspicious timing suggestions, and Vedic remediation actions.',
    beginBtn: 'Begin Consultation'
  },
  step2: {
    title: 'Select Problem Domain',
    subtitle: 'Choose the area of your life you are seeking astrological insight and clarity on.',
    continueBtn: 'Continue to Problem Form',
    backBtn: 'Back',
    categories: {
      career: {
        label: 'Career',
        description: 'Job transitions, promotions & professional vocation',
        transitFocus: '10th House (Karma Bhava) & Saturn / Sun Transits'
      },
      relationship: {
        label: 'Relationship',
        description: 'Love life, emotional bonds & partnerships',
        transitFocus: '7th & 5th Houses & Venusian Aspects'
      },
      marriage: {
        label: 'Marriage',
        description: 'Kundli matching, marital harmony & union timing',
        transitFocus: '7th House Lord, Jupiter & Mangal Dosha checks'
      },
      finance: {
        label: 'Finance',
        description: 'Wealth, investments & financial stability',
        transitFocus: '2nd & 11th Houses (Dhana Yogas) & Mercury'
      },
      family: {
        label: 'Family',
        description: 'Domestic peace, parental & ancestral bonds',
        transitFocus: '4th House (Matru Bhava) & Moon Transits'
      },
      education: {
        label: 'Education',
        description: 'Studies, exams & higher intellectual learning',
        transitFocus: '5th & 9th Houses & Mercury / Jupiter blessings'
      },
      general: {
        label: 'General',
        description: 'Life direction, purpose & cosmic clarity',
        transitFocus: 'Lagna Lord & Mahadasha / Antardasha cycles'
      }
    }
  },
  step3: {
    title: 'Tell Us About Your Problem',
    subtitle: "Share what's on your mind. Provide details on your thoughts, current situation, and what clarity you seek.",
    selectedTopic: 'Selected Topic',
    changeTopic: 'Change Topic',
    label: "What's on your mind?",
    sublabel: "Tell us what you're going through... Be as detailed as possible to allow accurate planetary alignment analysis.",
    placeholder: "Tell us what you're going through...",
    submitBtn: 'Get Guidance',
    submittingBtn: 'Analyzing Transits...',
    privacyNote: 'Your consultation is strictly confidential and saved securely to your personal account.',
    errors: {
      required: 'Please describe your problem.',
      minLength: 'Please enter at least 10 characters.',
      maxLength: 'Maximum 5000 characters allowed.'
    }
  },
  step4: {
    title: 'Understanding your reading...',
    subtitle: 'Analyzing planetary transits, astrological houses, and astrological periods for your guidance...',
    synthesis: 'Vedic Synthesis',
    remedies: 'Remedial Remedies'
  },
  step5: {
    title: 'Your Personalized Reading',
    subtitle: 'Astrological insights and Vedic remedial guidance tailored to your inquiry.',
    analysisBadge: 'Vedic Life Analysis',
    happeningTitle: 'What may be happening',
    guidanceTitle: 'Vedic guidance & insight',
    remedyTitle: 'What you can do now',
    askAnotherBtn: 'Ask Another Question',
    viewHistoryBtn: 'View Guidance History',
    readings: {
      career: {
        happening: 'Saturn and the Sun are highlighting your 10th House of professional manifestation. You are in a transition phase where past discipline is culminating in a pivot toward purposeful work.',
        guidance: 'Do not rush immediate validation. The planetary transits favor strategic upskilling, clear boundary setting, and aligning with projects that resonate with your inner calling.',
        action: 'Perform a mindful contemplation during Thursday morning sunrise. Update your resume with clarity and avoid hasty confrontations with authorities over the next two lunar cycles.'
      },
      relationship: {
        happening: 'Venus aspects indicate a strong emotional re-evaluation period. Your 7th House indicates a need for clear, authentic communication rather than unspoken expectations.',
        guidance: 'Give space for mutual emotional honesty. Healing occurs when both individuals articulate vulnerability rather than defensive assumptions.',
        action: 'Practice active listening. Light a white candle on Friday evenings and focus on heartfelt expressions of appreciation.'
      },
      marriage: {
        happening: 'Jupiter is transiting through an auspicious trine to your marital axis. While minor Rahu influences may cause temporary doubts, the foundational bond has cosmic support.',
        guidance: 'Focus on shared long-term life values rather than transient minor irritations. Patience and mutual respect will dissolve misunderstandings.',
        action: 'Engage in a joint quiet ritual or shared peaceful walk. Offer yellow flowers on Thursdays as an auspicious tribute to Jupiter (Brihaspati).'
      },
      finance: {
        happening: 'Mercury and the 2nd and 11th House lords indicate gradual accumulation of wealth. Speculative risks are cautioned right now, but steady investments are protected.',
        guidance: 'Prioritize liquidity and debt clearance. The astrological climate rewards methodical budgeting and sensible savings over high-risk gambles.',
        action: 'Audit your recurring expenses this week. Keep a brass bowl with clean water in the north-east corner of your study or office.'
      },
      family: {
        happening: 'The 4th House (Matru Bhava) and Moon transit suggest domestic sensitivities. Old unresolved memories or generational patterns may be surfacing for healing.',
        guidance: 'Act as the peacemaker rather than reacting to provocations. Cultivate empathy for the elder generations while protecting your own emotional serenity.',
        action: 'Spend quiet quality time with family members without bringing up past grievances. Maintain a harmonious atmosphere with calming sandalwood incense.'
      },
      education: {
        happening: 'Mercury and the 5th House of intellect show high receptivity for deep learning. Fluctuations in focus may occur during Mercury retrograde periods, but retention is strong.',
        guidance: 'Break complex subjects into manageable daily segments. Consistency and morning study hours will produce superior results.',
        action: 'Begin your study sessions facing East. Recite the Saraswati Vandana or take three deep cleansing breaths before opening study materials.'
      },
      general: {
        happening: 'Your Ascendant (Lagna) is receiving uplifting planetary aspects, marking a transformative juncture of self-discovery, reinvention, and inner alignment.',
        guidance: 'Trust your inner compass. When planetary shifts challenge familiar comfort zones, they are clearing the path for greater personal authenticity.',
        action: 'Maintain a daily gratitude journal. Dedicate 10 minutes each morning to silent meditation to ground your thoughts before commencing daily tasks.'
      }
    }
  },
  history: {
    title: 'Guidance History & Previous Inquiries',
    badge: 'Vedic Archive',
    emptyHeading: 'No Previous Guidance Inquiries',
    emptyDesc: 'Your submitted problems, planetary transit analyses, and personalized guidance readings will be archived here for your lifelong review.',
    popularTopics: 'Popular topics:',
    viewBtn: 'View',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    viewModalTitle: 'Archived Guidance Consultation',
    problemStatement: 'Your Problem Statement:',
    transitPerspective: 'Vedic Transit Perspective:',
    transitPerspectiveText: 'Planetary transits continue to evolve based on your natal houses and planetary periods (Dasha). Focus on purposeful action and grounding meditation.',
    closeBtn: 'Close',
    editProblemBtn: 'Edit Problem',
    editModalTitle: 'Update Your Problem Statement',
    editLabel: 'Problem Description',
    cancelBtn: 'Cancel',
    saveChangesBtn: 'Save Changes',
    savingBtn: 'Saving...',
    deleteModalTitle: 'Delete Guidance Inquiry',
    deleteConfirmText: 'Are you sure you want to delete this guidance consultation?',
    deleteWarningSub: 'This action permanently removes the record and its consultation details from your account.',
    deletePermanentBtn: 'Delete Permanently',
    deletingBtn: 'Deleting...',
    toastUpdated: 'Guidance inquiry updated successfully.',
    toastDeleted: 'Guidance record removed.',
    toastCreated: 'Your personalized astrological guidance is ready!'
  }
};

export const ML_GUIDANCE_TRANSLATIONS: GuidanceTranslations = {
  backToDashboard: 'ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക',
  backToOverview: 'അവലോകനത്തിലേക്ക് മടങ്ങുക',
  backToTopics: 'വിഷയങ്ങളിലേക്ക് മടങ്ങുക',
  backToQuestion: 'ചോദ്യത്തിലേക്ക് മടങ്ങുക',
  back: 'തിരികെ',
  historyBtn: 'ചരിത്രം',
  stepWord: 'ഘട്ടം',
  ofWord: '/',
  steps: {
    overview: 'അവലോകനം',
    topic: 'വിഷയം',
    problem: 'പ്രശ്നം',
    analyzing: 'വിശകലനം',
    reading: 'ഫലം'
  },
  step1: {
    title: 'നിങ്ങളുടെ പ്രശ്നത്തെക്കുറിച്ച് സംസാരിക്കുക',
    subtitle: 'നിങ്ങളുടെ മനസ്സിലുള്ളത് പങ്കുവെക്കൂ, വ്യക്തിഗത ജ്യോതിഷ മാർഗ്ഗനിർദ്ദേശം നേടൂ.',
    badge: 'വേദ ജ്യോതിഷ ഉപദേശം',
    introTitle: 'നിങ്ങളുടെ മനസ്സിൽ എന്താണ്?',
    introDesc: 'തൊഴിൽ അനിശ്ചിതത്വം, ബന്ധങ്ങളിലെ വെല്ലുവിളികൾ, സാമ്പത്തിക തീരുമാനങ്ങൾ, ജീവിത ലക്ഷ്യം എന്നിവയിൽ വേദ ജ്യോതിഷ ഗ്രഹചലനങ്ങളുടെ അടിസ്ഥാനത്തിൽ വ്യക്തത നേടൂ.',
    pillar1Title: 'ഗ്രഹചലന വിശകലനം',
    pillar1Desc: 'നിങ്ങളുടെ അവസ്ഥയെ സ്വാധീനിക്കുന്ന സജീവ ഗ്രഹങ്ങൾ, ദശാപഹാരങ്ങൾ, ഭാവങ്ങൾ എന്നിവ വിശകലനം ചെയ്യുന്നു.',
    pillar2Title: 'സ്വകാര്യവും സുരക്ഷിതവും',
    pillar2Desc: 'നിങ്ങളുടെ ചോദ്യങ്ങൾ പൂർണ്ണമായും രഹസ്യവും JWT എൻക്രിപ്ഷനാൽ സുരക്ഷിതവുമാണ്.',
    pillar3Title: 'പ്രായോഗിക പരിഹാരങ്ങൾ',
    pillar3Desc: 'നിർമ്മാണാത്മക നിർദ്ദേശങ്ങളും അനുകൂല സമയങ്ങളും വേദ പ്രതിവിധികളും നേടുക.',
    beginBtn: 'ആലോചന ആരംഭിക്കുക'
  },
  step2: {
    title: 'പ്രശ്ന വിഷയം തിരഞ്ഞെടുക്കുക',
    subtitle: 'നിങ്ങൾക്ക് ജ്യോതിഷപരമായ വ്യക്തത ആവശ്യമുള്ള ജീവിത മേഖല തിരഞ്ഞെടുക്കുക.',
    continueBtn: 'പ്രശ്ന ഫോമിലേക്ക് തുടരുക',
    backBtn: 'തിരികെ',
    categories: {
      career: {
        label: 'തൊഴിൽ & കരിയർ',
        description: 'ജോലി മാറ്റങ്ങൾ, സ്ഥാനക്കയറ്റം, പുതിയ അവസരങ്ങൾ',
        transitFocus: 'പത്താം ഭാവം (കർമ്മ ഭാവം) & ശനി/സൂര്യ സ്വാധീനം'
      },
      relationship: {
        label: 'പ്രണയം & ബന്ധങ്ങൾ',
        description: 'സ്നേഹബന്ധങ്ങൾ, വൈകാരിക പൊരുത്തം, സൗഹൃദങ്ങൾ',
        transitFocus: 'ഏഴാം & അഞ്ചാം ഭാവങ്ങൾ & ശുക്ര ദൃഷ്ടി'
      },
      marriage: {
        label: 'വിവാഹം & ദാമ്പത്യം',
        description: 'ജാതക പൊരുത്തം, ദാമ്പത്യ സൗഖ്യം, വിവാഹ സമയം',
        transitFocus: 'ഏഴാം ഭാവധിപൻ, വ്യാഴം & ചൊവ്വാ ദോഷ പരിശോധന'
      },
      finance: {
        label: 'സാമ്പത്തികം & ധനം',
        description: 'സമ്പത്ത്, നിക്ഷേപങ്ങൾ, സാമ്പത്തിക സുരക്ഷിതത്വം',
        transitFocus: 'രണ്ടാം & പതിനൊന്നാം ഭാവങ്ങൾ (ധനയോഗങ്ങൾ) & ബുധൻ'
      },
      family: {
        label: 'കുടുംബം & സ്വസ്ഥത',
        description: 'ഗാർഹിക സമാധാനം, മാതാപിതാക്കളുമായുള്ള ബന്ധം',
        transitFocus: 'നാലാം ഭാവം (മാതൃ ഭാവം) & ചന്ദ്ര സ്വാധീനം'
      },
      education: {
        label: 'വിദ്യാഭ്യാസം & പഠനം',
        description: 'പരീക്ഷകൾ, ഉപരിപഠനം, ഏകാഗ്രത',
        transitFocus: 'അഞ്ചാം & ഒൻപതാം ഭാവങ്ങൾ & സരസ്വതി യോഗം'
      },
      general: {
        label: 'പൊതു മാർഗ്ഗനിർദ്ദേശം',
        description: 'ജീവിത ദിശ, ആത്മീയ വ്യക്തത, ജീവിത ലക്ഷ്യം',
        transitFocus: 'ലഗ്നാധിപൻ & മഹാദശ / അപഹാര ചക്രങ്ങൾ'
      }
    }
  },
  step3: {
    title: 'നിങ്ങളുടെ പ്രശ്നത്തെക്കുറിച്ച് പറയൂ',
    subtitle: 'നിങ്ങളുടെ മനസ്സിലുള്ളത് പങ്കുവെക്കൂ. കൃത്യമായ ഗ്രഹവിശകലനത്തിനായി കൂടുതൽ വിവരങ്ങൾ നൽകുക.',
    selectedTopic: 'തിരഞ്ഞെടുത്ത വിഷയം',
    changeTopic: 'വിഷയം മാറ്റുക',
    label: 'നിങ്ങളുടെ മനസ്സിൽ എന്താണ്?',
    sublabel: 'നിങ്ങൾ അനുഭവിക്കുന്നത് ഇവിടെ വിവരിക്കുക... കൂടുതൽ വിവരങ്ങൾ കൃത്യമായ ജ്യോതിഷ ഫലത്തിന് സഹായിക്കും.',
    placeholder: 'നിങ്ങൾ അനുഭവിക്കുന്ന പ്രശ്നത്തെക്കുറിച്ച് വിശദമായി എഴുതുക...',
    submitBtn: 'മാർഗ്ഗനിർദ്ദേശം നേടുക',
    submittingBtn: 'ഗ്രഹങ്ങൾ വിശകലനം ചെയ്യുന്നു...',
    privacyNote: 'നിങ്ങളുടെ വിവരങ്ങൾ പൂർണ്ണമായും രഹസ്യമായിരിക്കും, നിങ്ങളുടെ അക്കൗണ്ടിൽ മാത്രം സംരക്ഷിക്കപ്പെടും.',
    errors: {
      required: 'ദയവായി നിങ്ങളുടെ പ്രശ്നം വിവരിക്കുക.',
      minLength: 'ദയവായി കുറഞ്ഞത് 10 അക്ഷരങ്ങളെങ്കിലും നൽകുക.',
      maxLength: 'പരമാവധി 5000 അക്ഷരങ്ങൾ മാത്രമേ അനുവദിക്കൂ.'
    }
  },
  step4: {
    title: 'നിങ്ങളുടെ ജാതക ഫലം വിശകലനം ചെയ്യുന്നു...',
    subtitle: 'നിങ്ങൾക്കായി ഗ്രഹചലനങ്ങളും ജ്യോതിഷ ഭാവങ്ങളും ദശാകാലങ്ങളും സമന്വയിപ്പിക്കുന്നു...',
    synthesis: 'വേദ സമന്വയം',
    remedies: 'ജ്യോതിഷ പരിഹാരങ്ങൾ'
  },
  step5: {
    title: 'നിങ്ങളുടെ വ്യക്തിഗത ജ്യോതിഷ ഫലം',
    subtitle: 'നിങ്ങളുടെ ചോദ്യത്തിന് വേദ ജ്യോതിഷ തത്ത്വങ്ങളുടെ അടിസ്ഥാനത്തിലുള്ള മാർഗ്ഗനിർദ്ദേശം.',
    analysisBadge: 'വേദ ജ്യോതിഷ വിശകലനം',
    happeningTitle: 'ഇപ്പോൾ സംഭവിക്കാൻ സാധ്യതയുള്ളത്',
    guidanceTitle: 'ജ്യോതിഷ മാർഗ്ഗനിർദ്ദേശവും കാഴ്ചപ്പാടും',
    remedyTitle: 'നിങ്ങൾക്ക് ഇപ്പോൾ എന്തുചെയ്യാൻ കഴിയും',
    askAnotherBtn: 'മറ്റൊരു ചോദ്യം ചോദിക്കുക',
    viewHistoryBtn: 'മാർഗ്ഗനിർദ്ദേശ ചരിത്രം കാണുക',
    readings: {
      career: {
        happening: 'ശനിയും സൂര്യനും നിങ്ങളുടെ പത്താം ഭാവമായ കർമ്മഭാവത്തെ ഉണർത്തുന്നു. കഴിഞ്ഞകാല അധ്വാനത്തിന്റെ ഫലം കരിയറിലെ മാറ്റങ്ങളിലേക്ക് വഴിതെളിക്കുന്ന സമയമാണിത്.',
        guidance: 'പെട്ടെന്നുള്ള വിജയത്തിനായി ധൃതി കാണിക്കരുത്. അറിവ് വർദ്ധിപ്പിക്കാനും വ്യവസ്ഥാപിതമായ ആസൂത്രണത്തിനും സമയം അനുകൂലമാണ്.',
        action: 'വ്യാഴാഴ്ച രാവിലെ ധ്യാനിക്കുക. ഉദ്യോഗസ്ഥരുമായുള്ള അനാവശ്യ തർക്കങ്ങൾ ഒഴിവാക്കുക.'
      },
      relationship: {
        happening: 'ശുക്ര സ്വാധീനം നിങ്ങളുടെ ഏഴാം ഭാവത്തെ സജീവമാക്കുന്നു. മനസ്സുതുറന്നുള്ള ആശയവിനിമയമാണ് ഈ സമയത്ത് ആവശ്യം.',
        guidance: 'പരസ്പര ബഹുമാനവും വൈകാരിക സത്യസന്ധതയും പുലർത്തുക. തെറ്റിദ്ധാരണകൾ സംസാരിച്ചു പരിഹരിക്കാം.',
        action: 'വെള്ളിയാഴ്ച വൈകുന്നേരങ്ങളിൽ നെയ്യ് ദീപം തെളിയിക്കുക. സ്നേഹപൂർവ്വമായ സംഭാഷണങ്ങൾക്ക് മുൻഗണന നൽകുക.'
      },
      marriage: {
        happening: 'വ്യാഴ ഗ്രഹം വിവാഹ ഭാവത്തിന് അനുകൂലമായ ഭാവത്തിലാണ് സഞ്ചരിക്കുന്നത്. ബന്ധത്തിൽ ശുഭകരമായ മാറ്റങ്ങൾ പ്രതീക്ഷിക്കാം.',
        guidance: 'ചെറിയ തർക്കങ്ങൾ അവഗണിച്ച് ദീർഘകാല മൂല്യങ്ങൾക്ക് മുൻഗണന നൽകുക. ക്ഷമ ഐശ്വര്യം കൊണ്ടുവരും.',
        action: 'വ്യാഴാഴ്ചകളിൽ മഞ്ഞ പൂക്കൾ സമർപ്പിച്ച് പ്രാർത്ഥിക്കുക. പരസ്പര ധാരണ വളർത്തുക.'
      },
      finance: {
        happening: 'രണ്ടാം, പതിനൊന്നാം ഭാവങ്ങളിലെ ഗ്രഹസ്ഥിതി സ്ഥിരമായ ധനലാഭത്തെ സൂചിപ്പിക്കുന്നു. ഊഹക്കച്ചവടങ്ങൾ ഒഴിവാക്കുക.',
        guidance: 'അനാവശ്യ ചെലവുകൾ ചുരുക്കുക. ദീർഘകാല നിക്ഷേപങ്ങൾക്ക് മുൻഗണന നൽകുക.',
        action: 'വരവ് ചെലവ് കണക്കുകൾ കൃത്യമായി സൂക്ഷിക്കുക. വടക്കുകിഴക്ക് ഭാഗത്ത് ശുദ്ധജലം വയ്ക്കുക.'
      },
      family: {
        happening: 'നാലാം ഭാവത്തിലെ ചന്ദ്ര സ്വാധീനം ഗാർഹികമായ സമാധാനവും വൈകാരിക ഐക്യവും ആവശ്യപ്പെടുന്നു.',
        guidance: 'പ്രകോപനങ്ങളിൽ പ്രതികരിക്കാതെ സമാധാനത്തിന്റെ വക്താവാകുക. കുടുംബാംഗങ്ങളുടെ വികാരങ്ങളെ മാനിക്കുക.',
        action: 'കുടുംബത്തോടൊപ്പം സായാഹ്നങ്ങൾ പങ്കിടുക. വീട്ടിൽ ചന്ദനത്തിരി കത്തിച്ച് മനസ്സ് ശാന്തമാക്കുക.'
      },
      education: {
        happening: 'അഞ്ചാം ഭാവത്തിലെ ബുധ സ്വാധീനം ബുദ്ധിശക്തിയും പഠനമികവും വർദ്ധിപ്പിക്കുന്നു.',
        guidance: 'ദിവസേനയുള്ള ചിട്ടയായ പഠനം വിജയത്തിലേക്ക് നയിക്കും. പ്രഭാത സമയങ്ങളിലെ പഠനം ഫലപ്രദമാകും.',
        action: 'കിഴക്കോട്ട് തിരിഞ്ഞിരുന്ന് പഠിക്കുക. സരസ്വതി സ്തോത്രം ജപിക്കുന്നത് ഏകാഗ്രത നൽകും.'
      },
      general: {
        happening: 'നിങ്ങളുടെ ലഗ്നത്തിന് ഉണർവ്വ് നൽകുന്ന ഗ്രഹസ്ഥിതിയാണ് നിലവിലുള്ളത്. ജീവിതത്തിലെ പുതിയ തുടക്കങ്ങൾക്ക് സമയം അനുകൂലമാണ്.',
        guidance: 'നിങ്ങളുടെ ഉള്ളിലെ ബോധ്യങ്ങളെ വിശ്വസിക്കുക. മാറ്റങ്ങൾ വളർച്ചയ്ക്കുള്ള അവസരങ്ങളാണ്.',
        action: 'ദിവസവും 10 മിനിറ്റ് പ്രഭാത ധ്യാനം ശീലമാക്കുക. പോസിറ്റീവ് ചിന്തകൾ നിലനിർത്തുക.'
      }
    }
  },
  history: {
    title: 'മാർഗ്ഗനിർദ്ദേശ ചരിത്രവും മുൻകാല ചോദ്യങ്ങളും',
    badge: 'വേദ ആർക്കൈവ്',
    emptyHeading: 'മുൻകാല ചോദ്യങ്ങൾ ഒന്നും ലഭ്യമല്ല',
    emptyDesc: 'നിങ്ങൾ ചോദിച്ച പ്രശ്നങ്ങളും ജ്യോതിഷ ഫലങ്ങളും ഇവിടെ എന്നെന്നേക്കുമായി സംരക്ഷിക്കപ്പെടും.',
    popularTopics: 'ജനപ്രിയ വിഷയങ്ങൾ:',
    viewBtn: 'കാണുക',
    editBtn: 'മാറ്റുക',
    deleteBtn: 'ഒഴിവാക്കുക',
    viewModalTitle: 'സംരക്ഷിച്ച ജ്യോതിഷ ആലോചന',
    problemStatement: 'നിങ്ങളുടെ പ്രശ്നം:',
    transitPerspective: 'ഗ്രഹചലന കാഴ്ചപ്പാട്:',
    transitPerspectiveText: 'നിങ്ങളുടെ ഗ്രഹ നിലകൾക്കനുസരിച്ച് ഫലങ്ങൾ രൂപപ്പെടുന്നു. ആത്മവിശ്വാസത്തോടെ മുന്നേറുക.',
    closeBtn: 'അടയ്ക്കുക',
    editProblemBtn: 'പ്രശ്നം തിരുത്തുക',
    editModalTitle: 'പ്രശ്ന വിവരണം മാറ്റുക',
    editLabel: 'പ്രശ്ന വിവരണം',
    cancelBtn: 'റദ്ദാക്കുക',
    saveChangesBtn: 'മാറ്റങ്ങൾ സംരക്ഷിക്കുക',
    savingBtn: 'സംരക്ഷിക്കുന്നു...',
    deleteModalTitle: 'ചോദ്യം ഒഴിവാക്കണമോ?',
    deleteConfirmText: 'ഈ ജ്യോതിഷ ചോദ്യം പൂർണ്ണമായും നീക്കം ചെയ്യാൻ നിങ്ങൾ ആഗ്രഹിക്കുന്നുണ്ടോ?',
    deleteWarningSub: 'ഈ പ്രവർത്തനം നിങ്ങളുടെ അക്കൗണ്ടിൽ നിന്ന് ഈ വിവരങ്ങൾ ശാശ്വതമായി ഒഴിവാക്കും.',
    deletePermanentBtn: 'ശാശ്വതമായി ഒഴിവാക്കുക',
    deletingBtn: 'ഒഴിവാക്കുന്നു...',
    toastUpdated: 'വിവരങ്ങൾ വിജയകരമായി പുതുക്കി.',
    toastDeleted: 'ചോദ്യം നീക്കം ചെയ്തു.',
    toastCreated: 'നിങ്ങളുടെ ജ്യോതിഷ ഫലം തയ്യാറാണ്!'
  }
};

export const HI_GUIDANCE_TRANSLATIONS: GuidanceTranslations = {
  ...EN_GUIDANCE_TRANSLATIONS,
  backToDashboard: 'डैशबोर्ड पर वापस जाएं',
  backToOverview: 'अवलोकन पर वापस जाएं',
  backToTopics: 'विषयों पर वापस जाएं',
  backToQuestion: 'प्रश्न पर वापस जाएं',
  back: 'वापस',
  historyBtn: 'इतिहास',
  stepWord: 'चरण',
  ofWord: 'का',
  steps: {
    overview: 'अवलोकन',
    topic: 'विषय',
    problem: 'समस्या',
    analyzing: 'विश्लेषण',
    reading: 'मार्गदर्शन'
  },
  step1: {
    title: 'अपनी समस्या के बारे में बात करें',
    subtitle: 'अपने मन की बात साझा करें और व्यक्तिगत मार्गदर्शन प्राप्त करें।',
    badge: 'वैदिक ज्योतिषीय परामर्श',
    introTitle: 'आपके मन में क्या है?',
    introDesc: 'करियर, रिश्ते, विवाह, वित्त या व्यक्तिगत जीवन उद्देश्य में ग्रहों की स्थिति और वैदिक ज्ञान के आधार पर स्पष्ट मार्गदर्शन प्राप्त करें।',
    pillar1Title: 'ग्रह गोचर विश्लेषण',
    pillar1Desc: 'आपकी स्थिति को प्रभावित करने वाले ग्रहों, दशाओं और भावों का सटीक विश्लेषण।',
    pillar2Title: 'गोपनीय और सुरक्षित',
    pillar2Desc: 'आपकी समस्या पूरी तरह से सुरक्षित और गोपनीय है।',
    pillar3Title: 'सटीक वैदिक उपाय',
    pillar3Desc: 'शुभ मुहूर्त, व्यवहार्य उपाय और सकारात्मक जीवन दिशा प्राप्त करें।',
    beginBtn: 'परामर्श शुरू करें'
  },
  step2: {
    title: 'समस्या का विषय चुनें',
    subtitle: 'अपने जीवन का वह क्षेत्र चुनें जिस पर आप ज्योतिषीय मार्गदर्शन चाहते हैं।',
    continueBtn: 'समस्या फॉर्म पर जाएं',
    backBtn: 'वापस',
    categories: {
      career: { label: 'करियर', description: 'नौकरी परिवर्तन, पदोन्नति और व्यवसाय', transitFocus: 'दसवां भाव (कर्म भाव) और शनि/सूर्य गोचर' },
      relationship: { label: 'संबंध और प्रेम', description: 'प्रेम जीवन, भावनात्मक समझ और साझेदारी', transitFocus: 'सातवां और पांचवां भाव और शुक्र दृष्टि' },
      marriage: { label: 'विवाह', description: 'कुंडली मिलान, वैवाहिक सुख और विवाह समय', transitFocus: 'सप्तमेश, गुरु और मंगल दोष' },
      finance: { label: 'वित्त और धन', description: 'धन संचय, निवेश और आर्थिक स्थिरता', transitFocus: 'द्वितीय व एकादश भाव (धन योग) और बुध' },
      family: { label: 'परिवार', description: 'पारिवारिक शांति और माता-पिता के संबंध', transitFocus: 'चतुर्थ भाव (मातृ भाव) और चंद्र गोचर' },
      education: { label: 'शिक्षा', description: 'पढ़ाई, परीक्षाएं और उच्च शिक्षा', transitFocus: 'पंचम व नवम भाव और सरस्वती योग' },
      general: { label: 'सामान्य मार्गदर्शन', description: 'जीवन दिशा, उद्देश्य और स्पष्टता', transitFocus: 'लग्नेश और महादशा/अंतर्दशा चक्र' }
    }
  },
  step3: {
    title: 'हमें अपनी समस्या बताएं',
    subtitle: 'विस्तार से बताएं कि आप किस परिस्थिति से गुजर रहे हैं।',
    selectedTopic: 'चयनित विषय',
    changeTopic: 'विषय बदलें',
    label: 'आपके मन में क्या है?',
    sublabel: 'अपनी स्थिति का विस्तार से वर्णन करें ताकि सटीक ज्योतिषीय विश्लेषण किया जा सके।',
    placeholder: 'अपनी समस्या का विवरण यहां लिखें...',
    submitBtn: 'मार्गदर्शन प्राप्त करें',
    submittingBtn: 'ग्रहों का विश्लेषण हो रहा है...',
    privacyNote: 'आपका परामर्श पूरी तरह से गोपनीय है।',
    errors: {
      required: 'कृपया अपनी समस्या का वर्णन करें।',
      minLength: 'कृपया कम से कम 10 अक्षर दर्ज करें।',
      maxLength: 'अधिकतम 5000 अक्षरों की अनुमति है।'
    }
  },
  step4: {
    title: 'आपकी कुंडली का विश्लेषण हो रहा है...',
    subtitle: 'ग्रह गोचर, दशाएं और भावों का समन्वय किया जा रहा है...',
    synthesis: 'वैदिक संश्लेषण',
    remedies: 'ज्योतिषीय उपाय'
  },
  step5: {
    title: 'आपका व्यक्तिगत ज्योतिषीय मार्गदर्शन',
    subtitle: 'आपकी समस्या के लिए वैदिक सिद्धांतों पर आधारित परामर्श।',
    analysisBadge: 'वैदिक विश्लेषण',
    happeningTitle: 'वर्तमान ग्रह स्थिति',
    guidanceTitle: 'ज्योतिषीय दृष्टिकोण',
    remedyTitle: 'आप क्या उपाय कर सकते हैं',
    askAnotherBtn: 'दूसरा प्रश्न पूछें',
    viewHistoryBtn: 'मार्गदर्शन इतिहास देखें',
    readings: {
      career: {
        happening: 'शनि और सूर्य आपके दशम कर्म भाव को सक्रिय कर रहे हैं। करियर में महत्वपूर्ण बदलाव के संकेत हैं।',
        guidance: 'जल्दबाजी से बचें और अपनी क्षमताओं को निखारें। योजनाबद्ध तरीके से आगे बढ़ें।',
        action: 'गुरुवार को सूर्योदय के समय ध्यान करें। अधिकारियों से व्यर्थ विवाद न करें।'
      },
      relationship: {
        happening: 'शुक्र का प्रभाव संवाद की आवश्यकता को दर्शाता है। मनमुटाव बातचीत से सुलझ सकते हैं।',
        guidance: 'पारस्परिक समझ और सच्चाई को प्राथमिकता दें।',
        action: 'शुक्रवार की शाम को दीपक जलाएं और प्रेमपूर्वक संवाद करें।'
      },
      marriage: {
        happening: 'गुरु का गोचर वैवाहिक जीवन में स्थिरता का संकेत दे रहा है।',
        guidance: 'धैर्य रखें और आपसी सम्मान बनाए रखें।',
        action: 'गुरुवार को पीले फूल अर्पित करें और शांति बनाए रखें।'
      },
      finance: {
        happening: 'धन भाव में शुभ दृष्टि से वित्तीय स्थिति में सुधार होगा। जोखिम भरे निवेश से बचें।',
        guidance: 'बचत और ऋणमुक्ति पर ध्यान दें।',
        action: 'उत्तर-पूर्व दिशा में जल का पात्र रखें और खर्चों पर नियंत्रण रखें।'
      },
      family: {
        happening: 'चतुर्थ भाव घरेलू शांति और भावनात्मक संतुलन की मांग कर रहा है।',
        guidance: 'पारिवारिक बातचीत में शांति बनाए रखें।',
        action: 'परिवार के साथ समय बिताएं और घर में चंदन की धूप जलाएं।'
      },
      education: {
        happening: 'पंचम भाव में बुध का प्रभाव अध्ययन के लिए अत्यंत शुभ है।',
        guidance: 'नियमित रूप से सुबह के समय अध्ययन करें।',
        action: 'पूर्व दिशा की ओर मुख करके अध्ययन करें और एकाग्र रहें।'
      },
      general: {
        happening: 'लग्न पर शुभ ग्रहों का प्रभाव नए आत्मविश्वास का संचार कर रहा है।',
        guidance: 'अपनी अंतरात्मा की आवाज सुनें और आगे बढ़ें।',
        action: 'प्रतिदिन सुबह 10 मिनट ध्यान करें।'
      }
    }
  },
  history: {
    title: 'मार्गदर्शन इतिहास और पूर्व परामर्श',
    badge: 'वैदिक अभिलेखागार',
    emptyHeading: 'कोई पूर्व परामर्श नहीं मिला',
    emptyDesc: 'आपके द्वारा पूछे गए प्रश्न और ज्योतिषीय मार्गदर्शन यहां हमेशा उपलब्ध रहेंगे।',
    popularTopics: 'लोकप्रिय विषय:',
    viewBtn: 'देखें',
    editBtn: 'संपादित करें',
    deleteBtn: 'हटाएं',
    viewModalTitle: 'परामर्श विवरण',
    problemStatement: 'आपकी समस्या:',
    transitPerspective: 'ग्रह गोचर परिप्रेक्ष्य:',
    transitPerspectiveText: 'ग्रह गोचर आपकी जन्म कुंडली के आधार पर कार्य करते हैं। सकारात्मक बने रहें।',
    closeBtn: 'बंद करें',
    editProblemBtn: 'समस्या बदलें',
    editModalTitle: 'समस्या विवरण संपादित करें',
    editLabel: 'समस्या विवरण',
    cancelBtn: 'रद्द करें',
    saveChangesBtn: 'परिवर्तन सहेजें',
    savingBtn: 'सहेजा जा रहा है...',
    deleteModalTitle: 'क्या आप इसे हटाना चाहते हैं?',
    deleteConfirmText: 'क्या आप इस परामर्श को स्थायी रूप से हटाना चाहते हैं?',
    deleteWarningSub: 'यह क्रिया इस रिकॉर्ड को आपके खाते से हमेशा के लिए हटा देगी।',
    deletePermanentBtn: 'स्थायी रूप से हटाएं',
    deletingBtn: 'हटाया जा रहा है...',
    toastUpdated: 'परामर्श सफलतापूर्वक अपडेट किया गया।',
    toastDeleted: 'परामर्श हटा दिया गया।',
    toastCreated: 'आपका ज्योतिषीय मार्गदर्शन तैयार है!'
  }
};

export const TA_GUIDANCE_TRANSLATIONS: GuidanceTranslations = {
  ...EN_GUIDANCE_TRANSLATIONS,
  backToDashboard: 'டாஷ்போர்டுக்கு திரும்புக',
  backToOverview: 'மேலோட்டத்திற்கு திரும்புக',
  backToTopics: 'தலைப்புகளுக்கு திரும்புக',
  backToQuestion: 'கேள்விக்கு திரும்புக',
  back: 'பின்செல்',
  historyBtn: 'வரலாறு',
  stepWord: 'படி',
  ofWord: '/',
  steps: {
    overview: 'மேலோட்டம்',
    topic: 'தலைப்பு',
    problem: 'பிரச்சனை',
    analyzing: 'ஆய்வு',
    reading: 'வழிகாட்டல்'
  },
  step1: {
    title: 'உங்கள் பிரச்சனையைப் பற்றி பேசுங்கள்',
    subtitle: 'உங்கள் மனதில் உள்ளதைப் பகிர்ந்து, தனிப்பயனாக்கப்பட்ட வழிகாட்டலைப் பெறுங்கள்.',
    badge: 'வேத ஜோதிட ஆலோசனை',
    introTitle: 'உங்கள் மனதில் என்ன இருக்கிறது?',
    introDesc: 'தொழில், உறவுகள், திருமணம், நிதி போன்ற வாழ்க்கை விவகாரங்களில் கிரக நிலைகளின் அடிப்படையில் தெளிவான வழிகாட்டல் பெறுங்கள்.',
    pillar1Title: 'கிரக சஞ்சார ஆய்வு',
    pillar1Desc: 'உங்கள் ஜாதக கட்டங்களையும் கிரக சஞ்சாரங்களையும் துல்லியமாக ஆராய்கிறது.',
    pillar2Title: 'ரகசியமானது & பாதுகாப்பானது',
    pillar2Desc: 'உங்கள் தகவல்கள் முழுமையாகப் பாதுகாக்கப்படுகின்றன.',
    pillar3Title: 'பயனுள்ள பரிகாரங்கள்',
    pillar3Desc: 'நடைமுறைக்கு ஏற்ற வழிமுறைகளும் ஆன்மீக பரிகாரங்களும்.',
    beginBtn: 'ஆலோசனையைத் தொடங்குங்கள்'
  },
  step2: {
    title: 'தலைப்பைத் தேர்ந்தெடுக்கவும்',
    subtitle: 'நீங்கள் தெளிவு பெற விரும்பும் வாழ்க்கைப் பகுதியைத் தேர்ந்தெடுக்கவும்.',
    continueBtn: 'பிரச்சனை படிவத்திற்கு தொடரவும்',
    backBtn: 'பின்செல்',
    categories: {
      career: { label: 'தொழில்', description: 'வேலை மாற்றம், பதவி உயர்வு மற்றும் தொழில் வாய்ப்புகள்', transitFocus: '10-ஆம் இடம் (கர்ம ஸ்தானம்) மற்றும் சனி/சூரியன் பார்வை' },
      relationship: { label: 'உறவுகள்', description: 'காதல் வாழ்க்கை மற்றும் பாசப் பிணைப்புகள்', transitFocus: '7 மற்றும் 5-ஆம் வீடுகள் & சுக்கிரன் பார்வை' },
      marriage: { label: 'திருமணம்', description: 'பொருத்தம், திருமண வாழ்க்கை அமைதி மற்றும் காலம்', transitFocus: '7-ஆம் அதிபதி, குரு பார்வை மற்றும் செவ்வாய் தோஷம்' },
      finance: { label: 'நிதி & செல்வம்', description: 'பொருளாதார வளர்ச்சி மற்றும் முதலீடுகள்', transitFocus: '2 மற்றும் 11-ஆம் வீடுகள் (தன யோகம்) & புதன்' },
      family: { label: 'குடும்பம்', description: 'குடும்ப ஒற்றுமை மற்றும் மன அமைதி', transitFocus: '4-ஆம் வீடு (மாத்ரு ஸ்தானம்) மற்றும் சந்திரன் பார்வை' },
      education: { label: 'கல்வி', description: 'படிப்பு, தேர்வுகள் மற்றும் உயர் கல்வி', transitFocus: '5 மற்றும் 9-ஆம் வீடுகள் & புதன்/குரு அருள்' },
      general: { label: 'பொது வழிகாட்டல்', description: 'வாழ்க்கை திசை மற்றும் தெளிவு', transitFocus: 'லக்னாதிபதி மற்றும் தசாபுத்தி அமைப்புகள்' }
    }
  },
  step3: {
    title: 'உங்கள் பிரச்சனையை விளக்குங்கள்',
    subtitle: 'உங்கள் மனதில் உள்ளதை விரிவாகப் பகிருங்கள்.',
    selectedTopic: 'தேர்ந்தெடுக்கப்பட்ட தலைப்பு',
    changeTopic: 'தலைப்பை மாற்று',
    label: 'உங்கள் மனதில் என்ன இருக்கிறது?',
    sublabel: 'சரியான ஜோதிட கணிப்புக்கு தேவையான விவரங்களை உள்ளிடவும்.',
    placeholder: 'உங்கள் பிரச்சனையை இங்கே விரிவாக எழுதவும்...',
    submitBtn: 'வழிகாட்டல் பெறுக',
    submittingBtn: 'கிரகங்கள் ஆராயப்படுகின்றன...',
    privacyNote: 'உங்கள் ஆலோசனை முற்றிலும் ரகசியமானது.',
    errors: {
      required: 'தயவுசெய்து உங்கள் பிரச்சனையை விவரிக்கவும்.',
      minLength: 'குறைந்தது 10 எழுத்துக்களை உள்ளிடவும்.',
      maxLength: 'அதிகபட்சம் 5000 எழுத்துக்கள் மட்டுமே அனுமதிக்கப்படும்.'
    }
  },
  step4: {
    title: 'உங்கள் ஜாதகம் ஆராயப்படுகிறது...',
    subtitle: 'கிரக அமைப்புகளும் தசாபுத்திகளும் ஒருங்கிணைக்கப்படுகின்றன...',
    synthesis: 'வேத ஒருங்கிணைப்பு',
    remedies: 'ஜோதிட பரிகாரங்கள்'
  },
  step5: {
    title: 'உங்கள் தனிப்பயனாக்கப்பட்ட வழிகாட்டல்',
    subtitle: 'வேத ஜோதிட விதிகளின்படியான தனிப்பட்ட ஆலோசனை.',
    analysisBadge: 'வேத ஜோதிட ஆய்வு',
    happeningTitle: 'தற்போதைய கிரக நிலை',
    guidanceTitle: 'ஜோதிட பார்வை',
    remedyTitle: 'நீங்கள் செய்யக்கூடியவை',
    askAnotherBtn: 'மற்றொரு கேள்வி கேளுங்கள்',
    viewHistoryBtn: 'வரலாற்றைக் காண்க',
    readings: {
      career: { happening: '10-ஆம் வீட்டில் சனியின் தாக்கம் தொழில் மாற்றங்களை உணர்த்துகிறது.', guidance: 'பொறுமையுடன் திட்டமிட்டு செயல்படுங்கள்.', action: 'வியாழக்கிழமைகளில் தியானம் செய்யுங்கள்.' },
      relationship: { happening: 'சுக்கிரன் பார்வை உரையாடலின் அவசியத்தை உணர்த்துகிறது.', guidance: 'மனம் திறந்து அன்போடு பேசுங்கள்.', action: 'வெள்ளிக்கிழமைகளில் நெய் தீபம் ஏற்றுங்கள்.' },
      marriage: { happening: 'குரு பார்வை திருமண வாழ்க்கைக்கு பலம் சேர்க்கிறது.', guidance: 'பரஸ்பர மரியாதையுடன் அணுகவும்.', action: 'வியாழக்கிழமைகளில் மஞ்சள் மலர்கள் சமர்ப்பியுங்கள்.' },
      finance: { happening: 'தன ஸ்தானம் சீரான வருமானத்தை உறுதி செய்கிறது.', guidance: 'ஆபத்தான முதலீடுகளைத் தவிர்க்கவும்.', action: 'வடகிழக்கு திசையில் சுத்தமான நீர் வைக்கவும்.' },
      family: { happening: '4-ஆம் வீடு குடும்ப அமைதியை வேண்டுகிறது.', guidance: 'கோபத்தைத் தவிர்த்து அமைதி காக்கவும்.', action: 'குடும்பத்துடன் அமைதியாக நேரம் செலவிடுங்கள்.' },
      education: { happening: 'புதன் பார்வை கல்விக்கு நற்பலன்களைத் தருகிறது.', guidance: 'அதிகாலைப் படிப்பை வழக்கமாக்குங்கள்.', action: 'கிழக்கு நோக்கி அமர்ந்து படிக்கவும்.' },
      general: { happening: 'லக்னம் புதிய தொடக்கங்களை ஆதரிக்கிறது.', guidance: 'நம்பிக்கையுடன் செயல்படுங்கள்.', action: 'தினமும் காலையில் தியானம் செய்யுங்கள்.' }
    }
  },
  history: {
    title: 'வழிகாட்டல் வரலாறு & முந்தைய ஆலோசனைகள்',
    badge: 'வேத காப்பகம்',
    emptyHeading: 'முந்தைய ஆலோசனைகள் எதுவும் இல்லை',
    emptyDesc: 'நீங்கள் கேட்ட கேள்விகளும் வழிகாட்டல்களும் இங்கே பாதுகாக்கப்படும்.',
    popularTopics: 'பிரபலமான தலைப்புகள்:',
    viewBtn: 'காண்க',
    editBtn: 'திருத்து',
    deleteBtn: 'நீக்கு',
    viewModalTitle: 'சேமிக்கப்பட்ட ஆலோசனை',
    problemStatement: 'உங்கள் பிரச்சனை:',
    transitPerspective: 'கிரக பார்வை:',
    transitPerspectiveText: 'கிரக நிலைகள் மாற்றத்திற்கு உட்பட்டவை. நம்பிக்கையுடன் முன்னேறுங்கள்.',
    closeBtn: 'மூடுக',
    editProblemBtn: 'பிரச்சனையைத் திருத்து',
    editModalTitle: 'பிரச்சனை விவரத்தைத் திருத்துக',
    editLabel: 'பிரச்சனை விளக்கம்',
    cancelBtn: 'ரத்துசெய்',
    saveChangesBtn: 'சேமிக்க',
    savingBtn: 'சேமிக்கிறது...',
    deleteModalTitle: 'நீக்க வேண்டுமா?',
    deleteConfirmText: 'இந்த ஆலோசனையை நிரந்தரமாக நீக்க விரும்புகிறீர்களா?',
    deleteWarningSub: 'இந்த செயல் உங்கள் கணக்கிலிருந்து இதை முழுமையாக அகற்றிவிடும்.',
    deletePermanentBtn: 'நிரந்தரமாக நீக்கு',
    deletingBtn: 'நீக்குகிறது...',
    toastUpdated: 'வெற்றிகரமாக புதுப்பிக்கப்பட்டது.',
    toastDeleted: 'பதிவு நீக்கப்பட்டது.',
    toastCreated: 'உங்கள் வழிகாட்டல் தயாராக உள்ளது!'
  }
};

export const TE_GUIDANCE_TRANSLATIONS: GuidanceTranslations = {
  ...EN_GUIDANCE_TRANSLATIONS,
  backToDashboard: 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి',
  backToOverview: 'అవలోకనానికి తిరిగి వెళ్లండి',
  backToTopics: 'విషయాలకు తిరిగి వెళ్లండి',
  backToQuestion: 'ప్రశ్నకు తిరిగి వెళ్లండి',
  back: 'వెనుకకు',
  historyBtn: 'చరిత్ర',
  stepWord: 'దశ',
  ofWord: '/',
  steps: {
    overview: 'అవలోకనం',
    topic: 'విషయం',
    problem: 'సమస్య',
    analyzing: 'విశ్లేషణ',
    reading: 'మార్గదర్శకత్వం'
  },
  step1: {
    title: 'మీ సమస్య గురించి మాట్లాడండి',
    subtitle: 'మీ మనసులోని భావాలను పంచుకోండి మరియు వ్యక్తిగత మార్గదర్శకత్వాన్ని పొందండి.',
    badge: 'వేద జ్యోతిష్య సలహా',
    introTitle: 'మీ మనసులో ఏముంది?',
    introDesc: 'కెరీర్, సంబంధాలు, వివాహం, ఆర్థికం లేదా జీవిత లక్ష్యాలలో గ్రహ స్థితుల ఆధారంగా స్పష్టమైన మార్గదర్శకత్వం పొందండి.',
    pillar1Title: 'గ్రహ గోచార విశ్లేషణ',
    pillar1Desc: 'మీ పరిస్థితిపై ప్రభావం చూపే గ్రహాలు, దశలు మరియు భావాల పరిశీలన.',
    pillar2Title: 'గోప్యమైనది & సురక్షితం',
    pillar2Desc: 'మీ సమస్య పూర్తిగా గోప్యంగా మరియు సురక్షితంగా ఉంటుంది.',
    pillar3Title: 'ఆచరణాత్మక పరిహారాలు',
    pillar3Desc: 'శుభ సమయాలు, సరైన ఆలోచనలు మరియు వేద పరిహారాలు.',
    beginBtn: 'సంప్రదింపు ప్రారంభించండి'
  },
  step2: {
    title: 'సమస్య రంగాన్ని ఎంచుకోండి',
    subtitle: 'మీరు జ్యోతిష్య సలహా కోరుకునే జీవిత రంగాన్ని ఎంచుకోండి.',
    continueBtn: 'సమస్య ఫారమ్‌కు కొనసాగించండి',
    backBtn: 'వెనుకకు',
    categories: {
      career: { label: 'కెరీర్ & ఉద్యోగం', description: 'ఉద్యోగ మార్పు, ప్రమోషన్ మరియు వృత్తి అవకాశాలు', transitFocus: '10వ భావం (కర్మ స్థానం) మరియు శని/సూర్య గోచారం' },
      relationship: { label: 'సంబంధాలు & ప్రేమ', description: 'ప్రేమ జీవితం, భావోద్వేగ అనుబంధాలు', transitFocus: '7 మరియు 5వ భావాలు & శుక్ర దృష్టి' },
      marriage: { label: 'వివాహం', description: 'కుండలి అనుకూలత, దాంపత్య సుఖం మరియు సమయం', transitFocus: 'సప్తమాధిపతి, గురు అనుగ్రహం మరియు కుజ దోషం' },
      finance: { label: 'ఆర్థికం & ధనం', description: 'సంపద, పెట్టుబడులు మరియు ఆర్థిక స్థిరత్వం', transitFocus: '2 మరియు 11వ భావాలు (ధన యోగాలు) & బుధుడు' },
      family: { label: 'కుటుంబం', description: 'గృహ శాంతి, తల్లిదండ్రులతో సంబంధాలు', transitFocus: '4వ భావం (మాతృ స్థానం) మరియు చంద్ర దృష్టి' },
      education: { label: 'విద్య', description: 'చదువు, పరీక్షలు మరియు ఉన్నత విద్య', transitFocus: '5 మరియు 9వ భావాలు & సరస్వతీ యోగం' },
      general: { label: 'సాధారణ మార్గదర్శకత్వం', description: 'జీవిత దిశ, లక్ష్యం మరియు స్పష్టత', transitFocus: 'లగ్నాధిపతి మరియు దశాభుక్తి చక్రాలు' }
    }
  },
  step3: {
    title: 'మీ సమస్యను వివరించండి',
    subtitle: 'మీ పరిస్థితులను మాకు వివరంగా తెలియజేయండి.',
    selectedTopic: 'ఎంచుకున్న రంగం',
    changeTopic: 'రంగం మార్చండి',
    label: 'మీ మనసులో ఏముంది?',
    sublabel: 'సరియైన జ్యోతిష్య ఫలితాల కోసం పూర్తి వివరాలను నమోదు చేయండి.',
    placeholder: 'మీరు ఎదుర్కొంటున్న పరిస్థితులను ఇక్కడ వివరించండి...',
    submitBtn: 'మార్గదర్శకత్వం పొందండి',
    submittingBtn: 'గ్రహాల విశ్లేషణ జరుగుతోంది...',
    privacyNote: 'మీ సంప్రదింపు పూర్తిగా గోప్యంగా ఉంచబడుతుంది.',
    errors: {
      required: 'దయచేసి మీ సమస్యను వివరించండి.',
      minLength: 'దయచేసి కనీసం 10 అక్షరాలు నమోదు చేయండి.',
      maxLength: 'గరిష్టంగా 5000 అక్షరాలు మాత్రమే అనుమతించబడతాయి.'
    }
  },
  step4: {
    title: 'మీ జాతక విశ్లేషణ జరుగుతోంది...',
    subtitle: 'గ్రహ గోచారాలు మరియు జ్యోతిష్య స్థితులను సమన్వయం చేస్తున్నాము...',
    synthesis: 'వేద సమన్వయం',
    remedies: 'జ్యోతిష్య పరిహారాలు'
  },
  step5: {
    title: 'మీ వ్యక్తిగత జ్యోతిష్య మార్గదర్శకత్వం',
    subtitle: 'వేద జ్యోతిష్య సూత్రాల ఆధారంగా వ్యక్తిగత సలహా.',
    analysisBadge: 'వేద జ్యోతిష్య విశ్లేషణ',
    happeningTitle: 'ప్రస్తుత గ్రహ స్థితి',
    guidanceTitle: 'జ్యోతిష్య దృక్పథం',
    remedyTitle: 'మీరు చేయగలిగిన పరిహారాలు',
    askAnotherBtn: 'మరొక ప్రశ్న అడగండి',
    viewHistoryBtn: 'చరిత్రను చూడండి',
    readings: {
      career: { happening: '10వ స్థానంలో శని ప్రభావం కెరీర్‌లో మార్పులకు సూచనగా ఉంది.', guidance: 'ఓపికతో సరైన ప్రణాళికతో ముందుకు సాగండి.', action: 'గురువారం ఉదయం ధ్యానం చేయండి.' },
      relationship: { happening: 'శుక్రుని ప్రభావం మంచి సంభాషణను సూచిస్తోంది.', guidance: 'భావోద్వేగాలను పంచుకోండి.', action: 'శుక్రవారం సాయంత్రం దీపం వెలిగించండి.' },
      marriage: { happening: 'గురుని అనుగ్రహం దాంపత్య జీవితానికి శుభకరం.', guidance: 'పరస్పర గౌరవంతో మెలగండి.', action: 'గురువారం పసుపు పువ్వులతో పూజించండి.' },
      finance: { happening: 'ధన స్థానం స్థిరమైన ఆదాయాన్ని సూచిస్తుంది.', guidance: 'రిస్క్ పెట్టుబడులను నివారించండి.', action: 'ఈశాన్య మూలలో శుభ్రమైన నీరు ఉంచండి.' },
      family: { happening: '4వ భావం కుటుంబ శాంతిని కోరుతోంది.', guidance: 'శాంతంగా ఉండండి.', action: 'కుటుంబంతో గడపండి.' },
      education: { happening: 'బుధ ప్రభావం జ్ఞాపకశక్తికి మేలు చేస్తుంది.', guidance: 'ఉదయాన్నే చదవండి.', action: 'తూర్పు ముఖంగా కూర్చుని చదవండి.' },
      general: { happening: 'లగ్నం కొత్త ప్రారంభాలను ప్రోత్సహిస్తుంది.', guidance: 'ఆత్మవిశ్వాసంతో ఉండండి.', action: 'రోజూ ధ్యానం చేయండి.' }
    }
  },
  history: {
    title: 'మార్గదర్శకత్వ చరిత్ర & మునుపటి ప్రశ్నలు',
    badge: 'వేద ఆర్కైవ్',
    emptyHeading: 'మునుపటి ప్రశ్నలు లేవు',
    emptyDesc: 'మీరు అడిగిన ప్రశ్నలు మరియు జ్యోతిష్య సలహాలు ఇక్కడ భద్రపరచబడతాయి.',
    popularTopics: 'ప్రసిద్ధ రంగాలు:',
    viewBtn: 'చూడండి',
    editBtn: 'మార్చండి',
    deleteBtn: 'తొలగించండి',
    viewModalTitle: 'భద్రపరచిన సలహా',
    problemStatement: 'మీ సమస్య:',
    transitPerspective: 'గ్రహ దృక్పథం:',
    transitPerspectiveText: 'గ్రహ స్థితులు మారుతుంటాయి. ధైర్యంగా ముందుకు సాగండి.',
    closeBtn: 'మూసివేయి',
    editProblemBtn: 'సమస్యను సవరించు',
    editModalTitle: 'సమస్య వివరణను సవరించండి',
    editLabel: 'సమస్య వివరణ',
    cancelBtn: 'రద్దు చేయి',
    saveChangesBtn: 'మార్పులను సేవ్ చేయి',
    savingBtn: 'సేవ్ అవుతోంది...',
    deleteModalTitle: 'తొలగించాలా?',
    deleteConfirmText: 'మీరు ఈ ప్రశ్నను శాశ్వతంగా తొలగించాలనుకుంటున్నారా?',
    deleteWarningSub: 'ఈ చర్య మీ ఖాతా నుండి దీనిని పూర్తిగా తొలగిస్తుంది.',
    deletePermanentBtn: 'శాశ్వతంగా తొలగించు',
    deletingBtn: 'తొలగిస్తోంది...',
    toastUpdated: 'వివరాలు విజయవంతంగా అప్‌డేట్ చేయబడ్డాయి.',
    toastDeleted: 'ప్రశ్న తొలగించబడింది.',
    toastCreated: 'మీ జ్యోతిష్య మార్గదర్శకత్వం సిద్ధంగా ఉంది!'
  }
};

export const KN_GUIDANCE_TRANSLATIONS: GuidanceTranslations = {
  ...EN_GUIDANCE_TRANSLATIONS,
  backToDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ',
  backToOverview: 'ಅವಲೋಕನಕ್ಕೆ ಹಿಂತಿರುಗಿ',
  backToTopics: 'ವಿಷಯಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
  backToQuestion: 'ಪ್ರಶ್ನೆಗೆ ಹಿಂತಿರುಗಿ',
  back: 'ಹಿಂತಿರುಗಿ',
  historyBtn: 'ಇತಿಹಾಸ',
  stepWord: 'ಹಂತ',
  ofWord: '/',
  steps: {
    overview: 'ಅವಲೋಕನ',
    topic: 'ವಿಷಯ',
    problem: 'ಸಮಸ್ಯೆ',
    analyzing: 'ವಿಶ್ಲೇಷಣೆ',
    reading: 'ಮಾರ್ಗದರ್ಶನ'
  },
  step1: {
    title: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ಮಾತನಾಡಿ',
    subtitle: 'ನಿಮ್ಮ ಮನಸ್ಸಿನಲ್ಲಿರುವ ವಿಷಯವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.',
    badge: 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಸಲಹೆ',
    introTitle: 'ನಿಮ್ಮ ಮನಸ್ಸಿನಲ್ಲಿ ಏನಿದೆ?',
    introDesc: 'ವೃತ್ತಿ, ಸಂಬಂಧಗಳು, ವಿವಾಹ, ಹಣಕಾಸು ಅಥವಾ ಜೀವನದ ಉದ್ದೇಶಗಳಲ್ಲಿ ಗ್ರಹಗಳ ಚಲನೆಯ ಆಧಾರದ ಮೇಲೆ ಸ್ಪಷ್ಟ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.',
    pillar1Title: 'ಗ್ರಹ ಗೋಚಾರ ವಿಶ್ಲೇಷಣೆ',
    pillar1Desc: 'ನಿಮ್ಮ ಸ್ಥಿತಿಯ ಮೇಲೆ ಪ್ರಭಾವ ಬೀರುವ ಗ್ರಹಗಳು, ದಶೆಗಳು ಮತ್ತು ಭಾವಗಳ ವಿಶ್ಲೇಷಣೆ.',
    pillar2Title: 'ಖಾಸಗಿ ಮತ್ತು ಸುರಕ್ಷಿತ',
    pillar2Desc: 'ನಿಮ್ಮ ಸಮಸ್ಯೆ ಸಂಪೂರ್ಣವಾಗಿ ಗೌಪ್ಯವಾಗಿರುತ್ತದೆ.',
    pillar3Title: 'ಪ್ರಾಯೋಗಿಕ ಪರಿಹಾರಗಳು',
    pillar3Desc: 'ಶುಭ ಸಮಯಗಳು ಮತ್ತು ವೈದಿಕ ಪರಿಹಾರಗಳು.',
    beginBtn: 'ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ'
  },
  step2: {
    title: 'ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    subtitle: 'ನೀವು ಜ್ಯೋತಿಷ್ಯ ಸ್ಪಷ್ಟತೆ ಬಯಸುವ ಜೀವನದ ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    continueBtn: 'ಸಮಸ್ಯೆ ನಮೂನೆಗೆ ಮುಂದುವರಿಯಿರಿ',
    backBtn: 'ಹಿಂತಿರುಗಿ',
    categories: {
      career: { label: 'ವೃತ್ತಿ & ಉದ್ಯೋಗ', description: 'ಉದ್ಯೋಗ ಬದಲಾವಣೆ, ಬಡ್ತಿ ಮತ್ತು ವೃತ್ತಿ ಅವಕಾಶಗಳು', transitFocus: '10ನೇ ಮನೆ (ಕರ್ಮ ಸ್ಥಾನ) ಮತ್ತು ಶನಿ/ಸೂರ್ಯ ಗೋಚಾರ' },
      relationship: { label: 'ಸಂಬಂಧಗಳು & ಪ್ರೀತಿ', description: 'ಪ್ರೀತಿ ಜೀವನ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಬಾಂಧವ್ಯ', transitFocus: '7 ಮತ್ತು 5ನೇ ಮನೆಗಳು & ಶುಕ್ರ ದೃಷ್ಟಿ' },
      marriage: { label: 'ವಿವಾಹ', description: 'ಕುಂಡಲಿ ಹೊಂದಾಣಿಕೆ, ದಾಂಪತ್ಯ ಶಾಂತಿ ಮತ್ತು ಸಮಯ', transitFocus: 'ಸಪ್ತಮಾಧಿಪತಿ, ಗುರು ಮತ್ತು ಕುಜ ದೋಷ' },
      finance: { label: 'ಹಣಕಾಸು & ಸಂಪತ್ತು', description: 'ಸಂಪತ್ತು, ಹೂಡಿಕೆಗಳು ಮತ್ತು ಆರ್ಥಿಕ ಸ್ಥಿರತೆ', transitFocus: '2 ಮತ್ತು 11ನೇ ಮನೆಗಳು (ಧನ ಯೋಗಗಳು) & ಬುಧ' },
      family: { label: 'ಕುಟುಂಬ', description: 'ಕೌಟುಂಬಿಕ ಶಾಂತಿ, ಪೋಷಕರೊಂದಿಗಿನ ಸಂಬಂಧ', transitFocus: '4ನೇ ಮನೆ (ಮಾತೃ ಸ್ಥಾನ) ಮತ್ತು ಚಂದ್ರ ಗೋಚಾರ' },
      education: { label: 'ಶಿಕ್ಷಣ & ಅಧ್ಯಯನ', description: 'ಅಧ್ಯಯನ, ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ಉನ್ನತ ಶಿಕ್ಷಣ', transitFocus: '5 ಮತ್ತು 9ನೇ ಮನೆಗಳು & ಸರಸ್ವತಿ ಯೋಗ' },
      general: { label: 'ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನ', description: 'ಜೀವನದ ದಿಕ್ಕು, ಉದ್ದೇಶ ಮತ್ತು ಸ್ಪಷ್ಟತೆ', transitFocus: 'ಲಗ್ನಾಧಿಪತಿ ಮತ್ತು ಮಹಾದಶಾ ಚಕ್ರಗಳು' }
    }
  },
  step3: {
    title: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ನಮಗೆ ತಿಳಿಸಿ',
    subtitle: 'ನಿಮ್ಮ ಮನಸ್ಸಿನಲ್ಲಿರುವುದನ್ನು ವಿವರವಾಗಿ ಹಂಚಿಕೊಳ್ಳಿ.',
    selectedTopic: 'ಆಯ್ಕೆಮಾಡಿದ ವಿಷಯ',
    changeTopic: 'ವಿಷಯ ಬದಲಾಯಿಸಿ',
    label: 'ನಿಮ್ಮ ಮನಸ್ಸಿನಲ್ಲಿ ಏನಿದೆ?',
    sublabel: 'ನಿಖರವಾದ ಜ್ಯೋತಿಷ್ಯ ಫಲಿತಾಂಶಕ್ಕಾಗಿ ಸಂಪೂರ್ಣ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.',
    placeholder: 'ನೀವು ಎದುರಿಸುತ್ತಿರುವ ಪರಿಸ್ಥಿತಿಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
    submitBtn: 'ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ',
    submittingBtn: 'ಗ್ರಹಗಳ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...',
    privacyNote: 'ನಿಮ್ಮ ಸಮಾಲೋಚನೆ ಸಂಪೂರ್ಣವಾಗಿ ರಹಸ್ಯವಾಗಿರುತ್ತದೆ.',
    errors: {
      required: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ.',
      minLength: 'ದಯವಿಟ್ಟು ಕನಿಷ್ಠ 10 ಅಕ್ಷರಗಳನ್ನು ನಮೂದಿಸಿ.',
      maxLength: 'ಗರಿಷ್ಠ 5000 ಅಕ್ಷರಗಳಿಗೆ ಮಾತ್ರ ಅವಕಾಶವಿದೆ.'
    }
  },
  step4: {
    title: 'ನಿಮ್ಮ ಜಾತಕವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    subtitle: 'ಗ್ರಹ ಗೋಚಾರ ಮತ್ತು ಜ್ಯೋತಿಷ್ಯ ಭಾವಗಳನ್ನು ಸಮನ್ವಯಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
    synthesis: 'ವೈದಿಕ ಸಮನ್ವಯ',
    remedies: 'ಜ್ಯೋತಿಷ್ಯ ಪರಿಹಾರಗಳು'
  },
  step5: {
    title: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಜ್ಯೋತಿಷ್ಯ ಮಾರ್ಗದರ್ಶನ',
    subtitle: 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ತತ್ವಗಳ ಆಧಾರದ ಮೇಲೆ ಸಿದ್ಧಪಡಿಸಿದ ಮಾರ್ಗದರ್ಶನ.',
    analysisBadge: 'ವೈದಿಕ ವಿಶ್ಲೇಷಣೆ',
    happeningTitle: 'ಪ್ರಸ್ತುತ ಗ್ರಹ ಸ್ಥಿತಿ',
    guidanceTitle: 'ಜ್ಯೋತಿಷ್ಯ ದೃಷ್ಟಿಕೋನ',
    remedyTitle: 'ನೀವು ಮಾಡಬಹುದಾದ ಪರಿಹಾರಗಳು',
    askAnotherBtn: 'ಮತ್ತೊಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ',
    viewHistoryBtn: 'ಇತಿಹಾಸವನ್ನು ವೀಕ್ಷಿಸಿ',
    readings: {
      career: { happening: '10ನೇ ಮನೆಯಲ್ಲಿ ಶನಿಯ ಪ್ರಭಾವ ವೃತ್ತಿ ಬದಲಾವಣೆಗೆ ಕಾರಣವಾಗಿದೆ.', guidance: 'ಯೋಜನಾಬದ್ಧವಾಗಿ ಮುನ್ನಡೆಯಿರಿ.', action: 'ಗುರುವಾರ ಮುಂಜಾನೆ ಧ್ಯಾನ ಮಾಡಿ.' },
      relationship: { happening: 'ಶುಕ್ರನ ಪ್ರಭಾವ ಸಂವಾದದ ಅಗತ್ಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ.', guidance: 'ಮನಸ್ಸು ತೆರೆದು ಮಾತನಾಡಿ.', action: 'ಶುಕ್ರವಾರ ಸಂಜೆ ತುಪ್ಪದ ದೀಪ ಹಚ್ಚಿ.' },
      marriage: { happening: 'ಗುರುವಿನ ಅನುಗ್ರಹ ದಾಂಪತ್ಯಕ್ಕೆ ಶುಭಕರ.', guidance: 'ಪರಸ್ಪರ ಗೌರವದಿಂದ ವರ್ತಿಸಿ.', action: 'ಗುರುವಾರ ಹಳದಿ ಹೂಗಳನ್ನು ಅರ್ಪಿಸಿ.' },
      finance: { happening: 'ಧನ ಸ್ಥಾನ ಸ್ಥಿರ ಆದಾಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ.', guidance: 'ಅನಗತ್ಯ ಖರ್ಚುಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ.', action: 'ಈಶಾನ್ಯ ಮೂಲೆಯಲ್ಲಿ ಶುದ್ಧ ನೀರನ್ನು ಇರಿಸಿ.' },
      family: { happening: '4ನೇ ಮನೆ ಕೌಟುಂಬಿಕ ಶಾಂತಿಯನ್ನು ಬಯಸುತ್ತದೆ.', guidance: 'ಶಾಂತಿಯುತವಾಗಿರಿ.', action: 'ಕುಟುಂಬದೊಂದಿಗೆ ಸಮಯ ಕಳೆಯಿರಿ.' },
      education: { happening: 'ಬುಧನ ಪ್ರಭಾವ ಅಧ್ಯಯನಕ್ಕೆ ಉತ್ತಮ.', guidance: 'ಮುಂಜಾನೆ ಅಧ್ಯಯನ ಮಾಡಿ.', action: 'ಪೂರ್ವ ದಿಕ್ಕಿಗೆ ಮುಖ ಮಾಡಿ ಓದಿ.' },
      general: { happening: 'ಲಗ್ನವು ಹೊಸ ಆರಂಭಗಳಿಗೆ ಅನುಕೂಲಕರವಾಗಿದೆ.', guidance: 'ಆತ್ಮವಿಶ್ವಾಸದಿಂದಿರಿ.', action: 'ಪ್ರತಿದಿನ ಧ್ಯಾನ ಮಾಡಿ.' }
    }
  },
  history: {
    title: 'ಮಾರ್ಗದರ್ಶನ ಇತಿಹಾಸ ಮತ್ತು ಹಿಂದಿನ ಸಮಾಲೋಚನೆಗಳು',
    badge: 'ವೈದಿಕ ದಾಖಲೆ',
    emptyHeading: 'ಹಿಂದಿನ ಸಮಾಲೋಚನೆಗಳು ಲಭ್ಯವಿಲ್ಲ',
    emptyDesc: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಜ್ಯೋತಿಷ್ಯ ಫಲಿತಾಂಶಗಳು ಇಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.',
    popularTopics: 'ಜನಪ್ರಿಯ ವಿಷಯಗಳು:',
    viewBtn: 'ವೀಕ್ಷಿಸಿ',
    editBtn: 'ತಿದ್ದಿ',
    deleteBtn: 'ಅಳಿಸಿ',
    viewModalTitle: 'ಉಳಿಸಿದ ಸಮಾಲೋಚನೆ',
    problemStatement: 'ನಿಮ್ಮ ಸಮಸ್ಯೆ:',
    transitPerspective: 'ಗ್ರಹ ದೃಷ್ಟಿಕೋನ:',
    transitPerspectiveText: 'ಗ್ರಹಗಳ ಸ್ಥಿತಿ ನಿರಂತರವಾಗಿ ಬದಲಾಗುತ್ತದೆ. ಧನಾತ್ಮಕವಾಗಿ ಯೋಚಿಸಿ.',
    closeBtn: 'ಮುಚ್ಚಿ',
    editProblemBtn: 'ಸಮಸ್ಯೆ ಬದಲಾಯಿಸಿ',
    editModalTitle: 'ಸಮಸ್ಯೆ ವಿವರಣೆಯನ್ನು ನವೀಕರಿಸಿ',
    editLabel: 'ಸಮಸ್ಯೆ ವಿವರಣೆ',
    cancelBtn: 'ರದ್ದುಮಾಡಿ',
    saveChangesBtn: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    savingBtn: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
    deleteModalTitle: 'ಅಳಿಸಬೇಕೇ?',
    deleteConfirmText: 'ನೀವು ಈ ಸಮಾಲೋಚನೆಯನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲು ಬಯಸುವಿರಾ?',
    deleteWarningSub: 'ಈ ಕ್ರಿಯೆಯು ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಇದನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ತೆಗೆದುಹಾಕುತ್ತದೆ.',
    deletePermanentBtn: 'ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಿ',
    deletingBtn: 'ಅಳಿಸಲಾಗುತ್ತಿದೆ...',
    toastUpdated: 'ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.',
    toastDeleted: 'ದಾಖಲೆ ತೆಗೆದುಹಾಕಲಾಗಿದೆ.',
    toastCreated: 'ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶನ ಸಿದ್ಧವಾಗಿದೆ!'
  }
};
