import { Injectable, inject, computed } from '@angular/core';
import { LanguageService } from './language.service';

export interface AppTranslations {
  nav: {
    home: string;
    guidance: string;
    birthChart: string;
    palmistry: string;
    signIn: string;
    getStarted: string;
    signOut: string;
    language: string;
  };
  dashboard: {
    welcome: string;
    activeMember: string;
    change: string;
    backToExplore: string;
    exploreTitle: string;
    exploreSubtitle: string;
    cards: {
      problemTitle: string;
      problemSubtitle: string;
      chartTitle: string;
      chartSubtitle: string;
      palmTitle: string;
      palmSubtitle: string;
      actionText: string;
    };
    quickRibbonLabel: string;
    quickRibbon: {
      career: string;
      marriage: string;
      money: string;
      family: string;
    };
    profile: {
      fullName: string;
      email: string;
      languagePref: string;
      authEngine: string;
    };
    guidance: {
      topicsHeading: string;
      dialogueTitle: string;
      inputPlaceholder: string;
      continueBtn: string;
      previewBadge: string;
      readingTitle: string;
      happeningTitle: string;
      actionTitle: string;
      statusNotice: string;
    };
    placeholders: {
      birthChartTitle: string;
      birthChartBadge: string;
      birthChartDesc: string;
      palmTitle: string;
      palmBadge: string;
      palmDesc: string;
      comingSoonBadge: string;
      returnBtn: string;
    };
    topics: {
      career: {
        label: string;
        userPrompt: string;
        guideResponse: string;
        options: string[];
        happening: string;
        action: string;
      };
      marriage: {
        label: string;
        userPrompt: string;
        guideResponse: string;
        options: string[];
        happening: string;
        action: string;
      };
      money: {
        label: string;
        userPrompt: string;
        guideResponse: string;
        options: string[];
        happening: string;
        action: string;
      };
      family: {
        label: string;
        userPrompt: string;
        guideResponse: string;
        options: string[];
        happening: string;
        action: string;
      };
      education: {
        label: string;
        userPrompt: string;
        guideResponse: string;
        options: string[];
        happening: string;
        action: string;
      };
      general: {
        label: string;
        userPrompt: string;
        guideResponse: string;
        options: string[];
        happening: string;
        action: string;
      };
    };
  };
  languageSelect: {
    title: string;
    subtitle: string;
    loading: string;
    noLanguages: string;
    continueBtn: string;
    saving: string;
    retry: string;
  };
  birthDetails: {
    newTitle: string;
    existingTitle: string;
    subtitle: string;
    backBtn: string;
    dobLabel: string;
    dobPlaceholder: string;
    tobLabel: string;
    tobPlaceholder: string;
    tobHelper: string;
    pobLabel: string;
    pobPlaceholder: string;
    locationInfoLabel: string;
    latLabel: string;
    lngLabel: string;
    tzLabel: string;
    saveContinueBtn: string;
    saveChangesBtn: string;
    savingBtn: string;
    deleteBtn: string;
    deleteModalTitle: string;
    deleteModalMsg: string;
    cancelBtn: string;
    confirmDeleteBtn: string;
    deletingBtn: string;
    successSaved: string;
    successDeleted: string;
    errors: {
      required: string;
      validDate: string;
      futureDate: string;
      validTime: string;
      placeRequired: string;
    };
  };
}

const EN_TRANSLATIONS: AppTranslations = {
  nav: {
    home: 'Home',
    guidance: 'Guidance',
    birthChart: 'Birth Chart',
    palmistry: 'Palmistry',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    signOut: 'Sign Out',
    language: 'Language'
  },
  dashboard: {
    welcome: 'Welcome,',
    activeMember: 'Active Member',
    change: 'Change',
    backToExplore: '← Back to Exploration',
    exploreTitle: 'How would you like to explore?',
    exploreSubtitle: 'Choose the path that feels right for you.',
    cards: {
      problemTitle: 'Talk about a problem',
      problemSubtitle: "Start with what's on your mind",
      chartTitle: 'Birth chart',
      chartSubtitle: 'Enter your birth details',
      palmTitle: 'Palm reading',
      palmSubtitle: 'Upload a photo of your palm',
      actionText: 'Explore'
    },
    quickRibbonLabel: 'Quick guidance topics:',
    quickRibbon: {
      career: 'Career reading',
      marriage: 'Relationship',
      money: 'Financial timing',
      family: 'Family peace'
    },
    profile: {
      fullName: 'Full Name',
      email: 'Registered Email',
      languagePref: 'Language Preference',
      authEngine: 'Authentication Engine'
    },
    guidance: {
      topicsHeading: 'Topics',
      dialogueTitle: 'Tell me what is on your mind',
      inputPlaceholder: 'Tell us what you are experiencing...',
      continueBtn: 'Continue',
      previewBadge: 'Personalized Reading Preview',
      readingTitle: "Here's what your reading suggests",
      happeningTitle: 'What may be happening',
      actionTitle: 'What you can do now',
      statusNotice: 'Full algorithmic prediction model is in active development with the FastAPI computational engine.'
    },
    placeholders: {
      birthChartTitle: 'Your Birth Details & Janam Kundli',
      birthChartBadge: 'Vedic Natal Chart',
      birthChartDesc: 'Accurately calculates your 12 astrological houses, Ascendant (Lagna), planetary degrees, and Vimshottari Mahadasha cycles.',
      palmTitle: 'Palm Reading Analysis',
      palmBadge: 'Hastarekha Shastra',
      palmDesc: 'Upload high-resolution photos of your left and right palms for ancient Hastarekha lines, mounts, and life energy readings.',
      comingSoonBadge: 'Coming Soon in Next API Release',
      returnBtn: 'Return to Exploration'
    },
    topics: {
      career: {
        label: 'Career & Job',
        userPrompt: 'I feel stuck in my career.',
        guideResponse: "I understand. What's the main difficulty?",
        options: ['Finding a job', 'No growth', 'Want a change', 'Workplace stress'],
        happening: 'This period may feel slower than expected. Focus on steady progress and practical next steps.',
        action: 'Strengthen existing skills and avoid impulsive transitions until Jupiter moves direct.'
      },
      marriage: {
        label: 'Marriage & Love',
        userPrompt: 'Looking for clarity in my relationship.',
        guideResponse: 'What aspect of your partnership is front of mind?',
        options: ['Compatibility', 'Timing of marriage', 'Communication gap', 'Family approval'],
        happening: 'Venus transits encourage mutual empathy and honest conversations over the coming weeks.',
        action: 'Practice patience and explore Guna Milan compatibility insights.'
      },
      money: {
        label: 'Money & Wealth',
        userPrompt: 'Seeking guidance on financial stability.',
        guideResponse: 'What financial area requires cosmic alignment?',
        options: ['Savings & debt', 'Investment timing', 'Business venture', 'Unexpected expenses'],
        happening: '2nd house planetary ruler indicates disciplined budgeting brings stability.',
        action: 'Focus on steady accumulation rather than high-risk speculative avenues.'
      },
      family: {
        label: 'Family & Home',
        userPrompt: 'Navigating family harmony and dynamics.',
        guideResponse: 'What family dynamic is calling for healing?',
        options: ['Parental expectations', 'Domestic harmony', 'Property matters', 'Relocation'],
        happening: '4th house influences suggest inner peace comes through empathetic listening.',
        action: 'Create space for open dialogue and honor domestic boundaries.'
      },
      education: {
        label: 'Education & Studies',
        userPrompt: 'Seeking focus and direction in learning.',
        guideResponse: 'What is your primary educational objective?',
        options: ['Higher studies', 'Competitive exams', 'Choosing a major', 'Focus & memory'],
        happening: 'Mercury aspecting the 5th house favors analytical disciplines and structured study.',
        action: 'Maintain daily consistency and avoid multitasking.'
      },
      general: {
        label: 'General Guidance',
        userPrompt: 'Seeking general life direction and purpose.',
        guideResponse: 'What area of your life feels most ripe for renewal?',
        options: ['Life purpose', 'Health & vitality', 'Spiritual growth', 'Current Dasha'],
        happening: 'A transitionary cycle is underway, clearing old patterns for new wisdom.',
        action: 'Reflect on personal core values and trust the natural unfolding.'
      }
    }
  },
  languageSelect: {
    title: 'Choose your language',
    subtitle: 'You can always change your preference later.',
    loading: 'Loading available languages...',
    noLanguages: 'No languages available.',
    continueBtn: 'Continue',
    saving: 'Saving preference...',
    retry: 'Retry'
  },
  birthDetails: {
    newTitle: 'Tell us about your birth',
    existingTitle: 'Your Birth Details',
    subtitle: 'Your birth details help us create your personalized astrology experience.',
    backBtn: '← Back to Dashboard',
    dobLabel: 'Date of Birth',
    dobPlaceholder: 'DD / MM / YYYY',
    tobLabel: 'Time of Birth',
    tobPlaceholder: 'HH : MM AM/PM',
    tobHelper: 'Enter your birth time as accurately as possible.',
    pobLabel: 'Place of Birth',
    pobPlaceholder: 'Search your birth place (e.g. Kochi, Kerala, India)',
    locationInfoLabel: 'Location Information',
    latLabel: 'Latitude',
    lngLabel: 'Longitude',
    tzLabel: 'Timezone',
    saveContinueBtn: 'Save & Continue',
    saveChangesBtn: 'Save Changes',
    savingBtn: 'Saving...',
    deleteBtn: 'Delete Birth Details',
    deleteModalTitle: 'Delete birth details?',
    deleteModalMsg: 'This information is used to personalize your astrology experience. Are you sure you want to delete it?',
    cancelBtn: 'Cancel',
    confirmDeleteBtn: 'Delete',
    deletingBtn: 'Deleting...',
    successSaved: 'Birth details saved successfully.',
    successDeleted: 'Birth details deleted successfully.',
    errors: {
      required: 'This field is required',
      validDate: 'Please enter a valid date',
      futureDate: 'Date of birth cannot be in the future',
      validTime: 'Please enter a valid birth time',
      placeRequired: 'Please select your birth place'
    }
  }
};

const ML_TRANSLATIONS: AppTranslations = {
  nav: {
    home: 'ഹോം',
    guidance: 'മാർഗ്ഗനിർദ്ദേശം',
    birthChart: 'ജനന ജാതകം',
    palmistry: 'ഹസ്തരേഖ',
    signIn: 'സൈൻ ഇൻ',
    getStarted: 'ആരംഭിക്കുക',
    signOut: 'സൈൻ ഔട്ട്',
    language: 'മലയാളം'
  },
  dashboard: {
    welcome: 'സ്വാഗതം,',
    activeMember: 'ആക്ടീവ് അംഗം',
    change: 'മാറ്റുക',
    backToExplore: '← തിരികെ പോകുക',
    exploreTitle: 'നിങ്ങൾ എങ്ങനെ പര്യവേക്ഷണം ചെയ്യാൻ ആഗ്രഹിക്കുന്നു?',
    exploreSubtitle: 'നിങ്ങൾക്ക് ശരിയെന്ന് തോന്നുന്ന വഴി തിരഞ്ഞെടുക്കുക.',
    cards: {
      problemTitle: 'ഒരു പ്രശ്നത്തെക്കുറിച്ച് സംസാരിക്കുക',
      problemSubtitle: 'നിങ്ങളുടെ മനസ്സിലുള്ളതിൽ നിന്ന് തുടങ്ങുക',
      chartTitle: 'ജനന ജാതകം',
      chartSubtitle: 'നിങ്ങളുടെ ജനന വിവരങ്ങൾ നൽകുക',
      palmTitle: 'ഹസ്തരേഖാ പരിശോധന',
      palmSubtitle: 'നിങ്ങളുടെ കൈപ്പത്തിയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
      actionText: 'പര്യവേക്ഷണം ചെയ്യുക'
    },
    quickRibbonLabel: 'ദ്രുത മാർഗ്ഗനിർദ്ദേശ വിഷയങ്ങൾ:',
    quickRibbon: {
      career: 'തൊഴിൽ ജാതകം',
      marriage: 'ദാമ്പത്യം & ബന്ധങ്ങൾ',
      money: 'സാമ്പത്തിക സമയം',
      family: 'കുടുംബ സമാധാനം'
    },
    profile: {
      fullName: 'പൂർണ്ണമായ പേര്',
      email: 'രജിസ്റ്റർ ചെയ്ത ഇമെയിൽ',
      languagePref: 'ഭാഷാ മുൻഗണന',
      authEngine: 'ഓതന്റിക്കേഷൻ എഞ്ചിൻ'
    },
    guidance: {
      topicsHeading: 'വിഷയങ്ങൾ',
      dialogueTitle: 'നിങ്ങളുടെ മനസ്സിലുള്ളത് എന്നോട് പറയൂ',
      inputPlaceholder: 'നിങ്ങൾ അനുഭവിക്കുന്നത് ഇവിടെ എഴുതുക...',
      continueBtn: 'തുടരുക',
      previewBadge: 'വ്യക്തിഗത ജ്യോതിഷ വായനാ പ്രിവ്യൂ',
      readingTitle: 'നിങ്ങളുടെ വായന സൂചിപ്പിക്കുന്നത് ഇതാണ്',
      happeningTitle: 'ഇപ്പോൾ സംഭവിക്കാൻ സാധ്യതയുള്ളത്',
      actionTitle: 'നിങ്ങൾക്ക് ഇപ്പോൾ എന്തുചെയ്യാൻ കഴിയും',
      statusNotice: 'FastAPI കമ്പ്യൂട്ടേഷണൽ എഞ്ചിനുമായി സംയോജിപ്പിച്ച സമ്പൂർണ്ണ പ്രവചന മോഡൽ പ്രവർത്തനത്തിലാണ്.'
    },
    placeholders: {
      birthChartTitle: 'നിങ്ങളുടെ ജനന വിവരങ്ങളും ജനം കുണ്ഡലിയും',
      birthChartBadge: 'വേദിക് ജനന ചാർട്ട്',
      birthChartDesc: 'നിങ്ങളുടെ 12 ഭാവങ്ങൾ, ലഗ്നം, ഗ്രഹങ്ങളുടെ ഡിഗ്രികൾ, വിംശോത്തരി മഹാദശ എന്നിവ കൃത്യമായി കണക്കാക്കുന്നു.',
      palmTitle: 'ഹസ്തരേഖാ വിശകലനം',
      palmBadge: 'ഹസ്തരേഖാ ശാസ്ത്രം',
      palmDesc: 'ജീവരേഖ, ശിരോരേഖ, ഹൃദയരേഖ എന്നിവയുടെ വിശകലനത്തിനായി ഇരു കൈപ്പത്തികളുടെയും വ്യക്തമായ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.',
      comingSoonBadge: 'അടുത്ത അപ്‌ഡേറ്റിൽ ലഭ്യമാകും',
      returnBtn: 'തിരികെ പോകുക'
    },
    topics: {
      career: {
        label: 'തൊഴിൽ & ജോലി',
        userPrompt: 'എന്റെ ജോലിയിൽ ഒരു തടസ്സം അനുഭവപ്പെടുന്നു.',
        guideResponse: 'ഞാൻ മനസ്സിലാക്കുന്നു. പ്രധാന ബുദ്ധിമുട്ട് എന്താണ്?',
        options: ['ജോലി കണ്ടെത്തൽ', 'വളർച്ചയില്ലായ്മ', 'മാറ്റം ആഗ്രഹിക്കുന്നു', 'ജോലിയിലെ സമ്മർദ്ദം'],
        happening: 'ഈ കാലഘട്ടം പ്രതീക്ഷിച്ചതിലും സാവധാനത്തിലായേക്കാം. ക്ഷമയോടെയുള്ള മുന്നേറ്റത്തിലും പ്രായോഗിക ചുവടുകളിലും ശ്രദ്ധ കേന്ദ്രീകരിക്കുക.',
        action: 'നിലവിലെ കഴിവുകൾ വർദ്ധിപ്പിക്കുക, വ്യാഴം നേർദിശയിലാകുന്നതുവരെ തിടുക്കത്തിലുള്ള തീരുമാനങ്ങൾ ഒഴിവാക്കുക.'
      },
      marriage: {
        label: 'വിവാഹം & പ്രണയം',
        userPrompt: 'ബന്ധങ്ങളിൽ വ്യക്തത തേടുന്നു.',
        guideResponse: 'നിങ്ങളുടെ പങ്കാളിത്തത്തിൽ ഏത് കാര്യത്തിലാണ് പ്രധാനമായും ശ്രദ്ധ വേണ്ടത്?',
        options: ['പൊരുത്തം', 'വിവാഹ സമയം', 'ആശയവിനിമയ വിടവ്', 'കുടുംബത്തിന്റെ അനുമതി'],
        happening: 'ശുക്രന്റെ സംക്രമണം വരും ആഴ്ചകളിൽ പരസ്പര ധാരണയും തുറന്ന സംഭാഷണങ്ങളും പ്രോത്സാഹിപ്പിക്കുന്നു.',
        action: 'ക്ഷമ പാലിക്കുക, ഗുണമേളന പൊരുത്തം മനസ്സിലാക്കാൻ ശ്രമിക്കുക.'
      },
      money: {
        label: 'ധനം & സമ്പത്ത്',
        userPrompt: 'സാമ്പത്തിക സ്ഥിരതയെക്കുറിച്ച് മാർഗ്ഗനിർദ്ദേശം തേടുന്നു.',
        guideResponse: 'ഏത് സാമ്പത്തിക കാര്യത്തിലാണ് പ്രപഞ്ചാനുഗ്രഹം ആവശ്യമുള്ളത്?',
        options: ['സമ്പാദ്യം & കടം', 'നിക്ഷേപ സമയം', 'ബിസിനസ്സ് സംരംഭം', 'പ്രതീക്ഷിക്കാത്ത ചെലവുകൾ'],
        happening: 'രണ്ടാം ഭാവാധിപൻ സൂചിപ്പിക്കുന്നത് ചിട്ടയായ ബജറ്റിംഗ് സ്ഥിരത നൽകും എന്നാണ്.',
        action: 'അപകടസാധ്യതയുള്ള ഊഹക്കച്ചവടങ്ങൾ ഒഴിവാക്കി സ്ഥിരമായ സമ്പാദ്യത്തിൽ ശ്രദ്ധിക്കുക.'
      },
      family: {
        label: 'കുടുംബം & വീട്',
        userPrompt: 'കുടുംബ ഐക്യവും സമാധാനവും തേടുന്നു.',
        guideResponse: 'കുടുംബത്തിൽ ഏത് കാര്യത്തിലാണ് ഐക്യം ആവശ്യമുള്ളത്?',
        options: ['മാതാപിതാക്കളുടെ പ്രതീക്ഷകൾ', 'ഗാർഹിക സമാധാനം', 'സ്വത്തു വിവരങ്ങൾ', 'സ്ഥലംമാറ്റം'],
        happening: 'നാലാം ഭാവ സ്വാധീനങ്ങൾ സൂചിപ്പിക്കുന്നത് ശ്രദ്ധാപൂർവ്വമായ കേൾവിയിലൂടെ മനഃസമാധാനം ലഭിക്കുമെന്നാണ്.',
        action: 'തുറന്ന സംഭാഷണങ്ങൾക്ക് അവസരമൊരുക്കുക, പരസ്പര ബഹുമാനം നിലനിർത്തുക.'
      },
      education: {
        label: 'വിദ്യാഭ്യാസം & പഠനം',
        userPrompt: 'പഠനത്തിൽ ശ്രദ്ധയും ദിശാബോധവും തേടുന്നു.',
        guideResponse: 'നിങ്ങളുടെ പ്രാഥമിക വിദ്യാഭ്യാസ ലക്ഷ്യം എന്താണ്?',
        options: ['ഉപരിപഠനം', 'മത്സര പരീക്ഷകൾ', 'കോഴ്സ് തിരഞ്ഞെടുപ്പ്', 'ശ്രദ്ധയും ഓർമ്മശക്തിയും'],
        happening: 'ബുധൻ അഞ്ചാം ഭാവത്തിൽ ദൃഷ്ടി പതിപ്പിക്കുന്നത് വിശകലന പഠനങ്ങൾക്ക് അനുകൂലമാണ്.',
        action: 'പ്രതിദിന സ്ഥിരത നിലനിർത്തുക, ഒരു സമയം ഒരു കാര്യത്തിൽ മാത്രം ശ്രദ്ധിക്കുക.'
      },
      general: {
        label: 'പൊതു മാർഗ്ഗനിർദ്ദേശം',
        userPrompt: 'ജീവിത ലക്ഷ്യത്തെക്കുറിച്ചും ഭാവിയെക്കുറിച്ചും മാർഗ്ഗനിർദ്ദേശം തേടുന്നു.',
        guideResponse: 'ജീവിതത്തിലെ ഏത് മേഖലയിലാണ് പുത്തൻ ഉണർവ് ആഗ്രഹിക്കുന്നത്?',
        options: ['ജീവിത ലക്ഷ്യം', 'ആരോഗ്യം & ഊർജ്ജം', 'ആത്മീയ വളർച്ച', 'നിലവിലെ ദശ'],
        happening: 'ഒരു പരിവർത്തന ചക്രം നടക്കുന്നു, പഴയ രീതികൾ മാറി പുതിയ ജ്ഞാനം ലഭ്യമാകുന്നു.',
        action: 'വ്യക്തിഗത മൂല്യങ്ങളെക്കുറിച്ച് ചിന്തിക്കുക, പ്രകൃതിയുടെ സ്വാഭാവിക ഒഴുക്കിനെ വിശ്വസിക്കുക.'
      }
    }
  },
  languageSelect: {
    title: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
    subtitle: 'നിങ്ങൾക്ക് ഈ മുൻഗണന പിന്നീട് എപ്പോൾ വേണമെങ്കിലും മാറ്റാം.',
    loading: 'ലഭ്യമായ ഭാഷകൾ ലോഡ് ചെയ്യുന്നു...',
    noLanguages: 'ഭാഷകൾ ലഭ്യമല്ല.',
    continueBtn: 'തുടരുക',
    saving: 'മുൻഗണന സംരക്ഷിക്കുന്നു...',
    retry: 'വീണ്ടും ശ്രമിക്കുക'
  },
  birthDetails: {
    newTitle: 'നിങ്ങളുടെ ജനന വിവരങ്ങൾ നൽകുക',
    existingTitle: 'നിങ്ങളുടെ ജനന വിവരങ്ങൾ',
    subtitle: 'നിങ്ങളുടെ വ്യക്തിഗത ജ്യോതിഷ വിവരങ്ങൾ തയ്യാറാക്കാൻ ഈ വിവരങ്ങൾ സഹായിക്കുന്നു.',
    backBtn: '← ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക',
    dobLabel: 'ജനന തീയതി',
    dobPlaceholder: 'DD / MM / YYYY',
    tobLabel: 'ജനന സമയം',
    tobPlaceholder: 'HH : MM AM/PM',
    tobHelper: 'കഴിയുന്നത്ര കൃത്യമായി ജനന സമയം നൽകുക.',
    pobLabel: 'ജനിച്ച സ്ഥലം',
    pobPlaceholder: 'നിങ്ങൾ ജനിച്ച സ്ഥലം തിരയുക (ഉദാ: കൊച്ചി, കേരളം)',
    locationInfoLabel: 'ഭൂമിശാസ്ത്ര വിവരങ്ങൾ',
    latLabel: 'അക്ഷാംശം (Latitude)',
    lngLabel: 'രേഖാംശം (Longitude)',
    tzLabel: 'സമയ മേഖല (Timezone)',
    saveContinueBtn: 'സംരക്ഷിച്ച് മുന്നോട്ട് പോകുക',
    saveChangesBtn: 'മാറ്റങ്ങൾ സംരക്ഷിക്കുക',
    savingBtn: 'സംരക്ഷിക്കുന്നു...',
    deleteBtn: 'ജനന വിവരങ്ങൾ ഇല്ലാതാക്കുക',
    deleteModalTitle: 'ജനന വിവരങ്ങൾ ഇല്ലാതാക്കണമോ?',
    deleteModalMsg: 'നിങ്ങളുടെ ജ്യോതിഷ ഫലങ്ങൾ തയ്യാറാക്കാൻ ഈ വിവരങ്ങൾ ഉപയോഗിക്കുന്നു. ഇത് ഇല്ലാതാക്കാൻ നിങ്ങൾ തീർച്ചയായും ആഗ്രഹിക്കുന്നുണ്ടോ?',
    cancelBtn: 'റദ്ദാക്കുക',
    confirmDeleteBtn: 'ഇല്ലാതാക്കുക',
    deletingBtn: 'ഇല്ലാതാക്കുന്നു...',
    successSaved: 'ജനന വിവരങ്ങൾ വിജയകരമായി സംരക്ഷിച്ചു.',
    successDeleted: 'ജനന വിവരങ്ങൾ നീക്കം ചെയ്തു.',
    errors: {
      required: 'ഈ ഫീൽഡ് പൂരിപ്പിക്കേണ്ടതുണ്ട്',
      validDate: 'ശരിയായ തീയതി നൽകുക',
      futureDate: 'ജനന തീയതി ഭാവിയിലാകാൻ പാടില്ല',
      validTime: 'ശരിയായ ജനന സമയം നൽകുക',
      placeRequired: 'ജനിച്ച സ്ഥലം തിരഞ്ഞെടുക്കുക'
    }
  }
};

const HI_TRANSLATIONS: AppTranslations = {
  ...EN_TRANSLATIONS,
  nav: {
    ...EN_TRANSLATIONS.nav,
    home: 'होम',
    guidance: 'मार्गदर्शन',
    birthChart: 'जन्म कुंडली',
    palmistry: 'हस्तरेखा',
    signOut: 'साइन आउट',
    language: 'हिन्दी'
  },
  dashboard: {
    ...EN_TRANSLATIONS.dashboard,
    welcome: 'स्वागत है,',
    activeMember: 'सक्रिय सदस्य',
    change: 'बदलें',
    backToExplore: '← वापस जाएं',
    exploreTitle: 'आप कैसे अन्वेषण करना चाहते हैं?',
    exploreSubtitle: 'वह मार्ग चुनें जो आपके लिए सही लगे।',
    cards: {
      problemTitle: 'समस्या के बारे में बात करें',
      problemSubtitle: 'अपने मन की बात से शुरुआत करें',
      chartTitle: 'जन्म कुंडली',
      chartSubtitle: 'अपनी जन्म तिथि और विवरण दर्ज करें',
      palmTitle: 'हस्तरेखा विश्लेषण',
      palmSubtitle: 'अपनी हथेली की फोटो अपलोड करें',
      actionText: 'अन्वेषण करें'
    },
    quickRibbonLabel: 'त्वरित मार्गदर्शन विषय:',
    quickRibbon: {
      career: 'करियर मार्गदर्शन',
      marriage: 'विवाह और संबंध',
      money: 'वित्तीय समय',
      family: 'पारिवारिक शांति'
    },
    profile: {
      fullName: 'पूरा नाम',
      email: 'पंजीकृत ईमेल',
      languagePref: 'भाषा वरीयता',
      authEngine: 'प्रमाणीकरण इंजन'
    }
  },
  languageSelect: {
    title: 'अपनी भाषा चुनें',
    subtitle: 'आप अपनी पसंद बाद में कभी भी बदल सकते हैं।',
    loading: 'उपलब्ध भाषाएं लोड हो रही हैं...',
    noLanguages: 'कोई भाषा उपलब्ध नहीं है।',
    continueBtn: 'जारी रखें',
    saving: 'प्राथमिकता सहेजी जा रही है...',
    retry: 'पुनः प्रयास करें'
  }
};

const TA_TRANSLATIONS: AppTranslations = {
  ...EN_TRANSLATIONS,
  nav: {
    ...EN_TRANSLATIONS.nav,
    home: 'முகப்பு',
    guidance: 'வழிகாட்டல்',
    birthChart: 'பிறப்பு ஜாதகம்',
    palmistry: 'கைரேகை',
    signOut: 'வெளியேறு',
    language: 'தமிழ்'
  },
  dashboard: {
    ...EN_TRANSLATIONS.dashboard,
    welcome: 'வணக்கம்,',
    activeMember: 'செயலில் உள்ள உறுப்பினர்',
    change: 'மாற்று',
    backToExplore: '← திரும்பிச் செல்',
    exploreTitle: 'நீங்கள் எவ்வாறு ஆராய விரும்புகிறீர்கள்?',
    exploreSubtitle: 'உங்களுக்கு ஏற்ற பாதையைத் தேர்ந்தெடுக்கவும்.',
    cards: {
      problemTitle: 'பிரச்சனையைப் பற்றி பேசுங்கள்',
      problemSubtitle: 'உங்கள் மனதில் உள்ளதில் இருந்து தொடங்குங்கள்',
      chartTitle: 'பிறப்பு ஜாதகம்',
      chartSubtitle: 'உங்கள் பிறப்பு விவரங்களை உள்ளிடவும்',
      palmTitle: 'கைரேகை வாசிப்பு',
      palmSubtitle: 'உங்கள் உள்ளங்கையின் புகைப்படத்தைப் பதிவேற்றவும்',
      actionText: 'ஆராயுங்கள்'
    },
    quickRibbonLabel: 'விரைவான வழிகாட்டல் தலைப்புகள்:',
    quickRibbon: {
      career: 'தொழில் ஜாதகம்',
      marriage: 'திருமணம் & காதல்',
      money: 'நிதி நேரம்',
      family: 'குடும்ப அமைதி'
    },
    profile: {
      fullName: 'முழு பெயர்',
      email: 'பதிவுசெய்த மின்னஞ்சல்',
      languagePref: 'மொழி முன்னுரிமை',
      authEngine: 'அங்கீகார இயந்திரம்'
    }
  },
  languageSelect: {
    title: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    subtitle: 'உங்கள் விருப்பத்தை பின்னர் எப்போது வேண்டுமானாலும் மாற்றலாம்.',
    loading: 'மொழிகள் ஏற்றப்படுகின்றன...',
    noLanguages: 'மொழிகள் கிடைக்கவில்லை.',
    continueBtn: 'தொடரவும்',
    saving: 'சேமிக்கிறது...',
    retry: 'மீண்டும் முயற்சிக்கவும்'
  }
};

const TE_TRANSLATIONS: AppTranslations = {
  ...EN_TRANSLATIONS,
  nav: {
    ...EN_TRANSLATIONS.nav,
    home: 'హోమ్',
    guidance: 'మార్గదర్శకత్వం',
    birthChart: 'జన్మ కుండలి',
    palmistry: 'హస్తసాముద్రికం',
    signOut: 'సైన్ అవుట్',
    language: 'తెలుగు'
  },
  dashboard: {
    ...EN_TRANSLATIONS.dashboard,
    welcome: 'స్వాగతం,',
    activeMember: 'క్రియాశీల సభ్యుడు',
    change: 'మార్చండి',
    backToExplore: '← తిరిగి వెళ్ళు',
    exploreTitle: 'మీరు ఎలా అన్వేషించాలనుకుంటున్నారు?',
    exploreSubtitle: 'మీకు సరైన మార్గాన్ని ఎంచుకోండి.',
    cards: {
      problemTitle: 'సమస్య గురించి మాట్లాడండి',
      problemSubtitle: 'మీ మనస్సులోని విషయంతో ప్రారంభించండి',
      chartTitle: 'జన్మ కుండలి',
      chartSubtitle: 'మీ పుట్టిన వివరాలను నమోదు చేయండి',
      palmTitle: 'హస్తసాముద్రిక పఠనం',
      palmSubtitle: 'మీ అరచేతి ఫోటోను అప్‌లోడ్ చేయండి',
      actionText: 'అన్వేషించండి'
    },
    quickRibbonLabel: 'శీఘ్ర మార్గదర్శక అంశాలు:',
    quickRibbon: {
      career: 'కెరీర్ రీడింగ్',
      marriage: 'వివాహం & సంబంధాలు',
      money: 'ఆర్థిక సమయం',
      family: 'కుటుంబ శాంతి'
    },
    profile: {
      fullName: 'పూర్తి పేరు',
      email: 'నమోదిత ఇమెయిల్',
      languagePref: 'భాష ప్రాధాన్యత',
      authEngine: 'ప్రామాణీకరణ ఇంజిన్'
    }
  },
  languageSelect: {
    title: 'మీ భాషను ఎంచుకోండి',
    subtitle: 'మీరు ఈ ప్రాధాన్యతను తర్వాత ఎప్పుడైనా మార్చవచ్చు.',
    loading: 'భాషలు లోడ్ అవుతున్నాయి...',
    noLanguages: 'భాషలు అందుబాటులో లేవు.',
    continueBtn: 'కొనసాగించండి',
    saving: 'భద్రపరుస్తోంది...',
    retry: 'మళ్ళీ ప్రయత్నించండి'
  }
};

const KN_TRANSLATIONS: AppTranslations = {
  ...EN_TRANSLATIONS,
  nav: {
    ...EN_TRANSLATIONS.nav,
    home: 'ಮುಖಪುಟ',
    guidance: 'ಮಾರ್ಗದರ್ಶನ',
    birthChart: 'ಜನ್ಮ ಕುಂಡಲಿ',
    palmistry: 'ಹಸ್ತಸಾಮುದ್ರಿಕ',
    signOut: 'ಸೈನ್ ಔಟ್',
    language: 'ಕನ್ನಡ'
  },
  dashboard: {
    ...EN_TRANSLATIONS.dashboard,
    welcome: 'ಸ್ವಾಗತ,',
    activeMember: 'ಸಕ್ರಿಯ ಸದಸ್ಯ',
    change: 'ಬದಲಾಯಿಸಿ',
    backToExplore: '← ಹಿಂತಿರುಗಿ',
    exploreTitle: 'ನೀವು ಹೇಗೆ ಅನ್ವೇಷಿಸಲು ಬಯಸುತ್ತೀರಿ?',
    exploreSubtitle: 'ನಿಮಗೆ ಸರಿಹೊಂದುವ ಮಾರ್ಗವನ್ನು ಆರಿಸಿ.',
    cards: {
      problemTitle: 'ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ಮಾತನಾಡಿ',
      problemSubtitle: 'ನಿಮ್ಮ ಮನಸ್ಸಿನಲ್ಲಿರುವ ವಿಷಯದಿಂದ ಪ್ರಾರಂಭಿಸಿ',
      chartTitle: 'ಜನ್ಮ ಕುಂಡಲಿ',
      chartSubtitle: 'ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
      palmTitle: 'ಹಸ್ತಸಾಮುದ್ರಿಕ ಓದುವಿಕೆ',
      palmSubtitle: 'ನಿಮ್ಮ ಅಂಗೈ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      actionText: 'ಅನ್ವೇಷಿಸಿ'
    },
    quickRibbonLabel: 'ತ್ವರಿತ ಮಾರ್ಗದರ್ಶನ ವಿಷಯಗಳು:',
    quickRibbon: {
      career: 'ವೃತ್ತಿ ಓದುವಿಕೆ',
      marriage: 'ವಿವಾಹ & ಪ್ರೀತಿ',
      money: 'ಆರ್ಥಿಕ ಸಮಯ',
      family: 'ಕುಟುಂಬ ಶಾಂತಿ'
    },
    profile: {
      fullName: 'ಪೂರ್ಣ ಹೆಸರು',
      email: 'ನೋಂದಾಯಿತ ಇಮೇಲ್',
      languagePref: 'ಭಾಷಾ ಆದ್ಯತೆ',
      authEngine: 'ದೃಢೀಕರಣ ಎಂಜಿನ್'
    }
  },
  languageSelect: {
    title: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    subtitle: 'ನೀವು ಈ ಆದ್ಯತೆಯನ್ನು ನಂತರ ಯಾವಾಗ ಬೇಕಾದರೂ ಬದಲಾಯಿಸಬಹುದು.',
    loading: 'ಲಭ್ಯವಿರುವ ಭಾಷೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    noLanguages: 'ಯಾವುದೇ ಭಾಷೆಗಳು ಲಭ್ಯವಿಲ್ಲ.',
    continueBtn: 'ಮುಂದುವರಿಯಿರಿ',
    saving: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
    retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ'
  }
};

const TRANSLATION_MAP: Record<string, AppTranslations> = {
  en: EN_TRANSLATIONS,
  ml: ML_TRANSLATIONS,
  hi: HI_TRANSLATIONS,
  ta: TA_TRANSLATIONS,
  te: TE_TRANSLATIONS,
  kn: KN_TRANSLATIONS
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly languageService = inject(LanguageService);

  readonly currentLangCode = computed(() => {
    return this.languageService.currentLanguage()?.code || 'en';
  });

  readonly t = computed<AppTranslations>(() => {
    const code = this.currentLangCode();
    return TRANSLATION_MAP[code] || EN_TRANSLATIONS;
  });
}
