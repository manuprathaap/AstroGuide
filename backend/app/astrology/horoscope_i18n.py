"""
Multilingual content and localization support for Vedic Horoscope generation.
Supports Malayalam, English, Hindi, and Tamil.
"""

from typing import Any

SUPPORTED_LANGUAGES = ["Malayalam", "English", "Hindi", "Tamil"]


def normalize_language(lang: str | None) -> str:
    if not lang:
        return "English"
    cleaned = lang.strip().lower()
    if cleaned in ("en", "english"):
        return "English"
    if cleaned in ("hi", "hindi"):
        return "Hindi"
    if cleaned in ("ta", "tamil"):
        return "Tamil"
    if cleaned in ("ml", "malayalam"):
        return "Malayalam"
    return "English"


SIGN_I18N: dict[str, list[tuple[str, str, int]]] = {
    "English": [
        ("Aries", "Aries", 1),
        ("Taurus", "Taurus", 2),
        ("Gemini", "Gemini", 3),
        ("Cancer", "Cancer", 4),
        ("Leo", "Leo", 5),
        ("Virgo", "Virgo", 6),
        ("Libra", "Libra", 7),
        ("Scorpio", "Scorpio", 8),
        ("Sagittarius", "Sagittarius", 9),
        ("Capricorn", "Capricorn", 10),
        ("Aquarius", "Aquarius", 11),
        ("Pisces", "Pisces", 12),
    ],
    "Malayalam": [
        ("Aries", "മേടം", 1),
        ("Taurus", "ഇടവം", 2),
        ("Gemini", "മിഥുനം", 3),
        ("Cancer", "കർക്കടകം", 4),
        ("Leo", "ചിങ്ങം", 5),
        ("Virgo", "കന്നി", 6),
        ("Libra", "തുലാം", 7),
        ("Scorpio", "വൃശ്ചികം", 8),
        ("Sagittarius", "ധനു", 9),
        ("Capricorn", "മകരം", 10),
        ("Aquarius", "കുംഭം", 11),
        ("Pisces", "മീനം", 12),
    ],
    "Hindi": [
        ("Aries", "मेष", 1),
        ("Taurus", "वृषभ", 2),
        ("Gemini", "मिथुन", 3),
        ("Cancer", "कर्क", 4),
        ("Leo", "सिंह", 5),
        ("Virgo", "कन्या", 6),
        ("Libra", "तुला", 7),
        ("Scorpio", "वृश्चिक", 8),
        ("Sagittarius", "धनु", 9),
        ("Capricorn", "मकर", 10),
        ("Aquarius", "कुंभ", 11),
        ("Pisces", "मीन", 12),
    ],
    "Tamil": [
        ("Aries", "மேஷம்", 1),
        ("Taurus", "ரிஷபம்", 2),
        ("Gemini", "மிதுனம்", 3),
        ("Cancer", "கடகம்", 4),
        ("Leo", "சிம்மம்", 5),
        ("Virgo", "கன்னி", 6),
        ("Libra", "துலாம்", 7),
        ("Scorpio", "விருச்சிகம்", 8),
        ("Sagittarius", "தனுசு", 9),
        ("Capricorn", "மகரம்", 10),
        ("Aquarius", "கும்பம்", 11),
        ("Pisces", "மீனம்", 12),
    ],
}

PLANET_I18N: dict[str, dict[str, dict[str, str]]] = {
    "English": {
        "Sun": {"name": "Sun", "abbr": "Su"},
        "Moon": {"name": "Moon", "abbr": "Mo"},
        "Mars": {"name": "Mars", "abbr": "Ma"},
        "Mercury": {"name": "Mercury", "abbr": "Me"},
        "Jupiter": {"name": "Jupiter", "abbr": "Ju"},
        "Venus": {"name": "Venus", "abbr": "Ve"},
        "Saturn": {"name": "Saturn", "abbr": "Sa"},
        "Rahu": {"name": "Rahu", "abbr": "Ra"},
        "Ketu": {"name": "Ketu", "abbr": "Ke"},
        "Ascendant": {"name": "Ascendant (Lagna)", "abbr": "Asc"},
        "Mandi": {"name": "Mandi / Gulika", "abbr": "Md"},
    },
    "Malayalam": {
        "Sun": {"name": "സൂര്യൻ (രവി)", "abbr": "ര"},
        "Moon": {"name": "ചന്ദ്രൻ", "abbr": "ച"},
        "Mars": {"name": "കുജൻ (ചൊവ്വ)", "abbr": "കു"},
        "Mercury": {"name": "ബുധൻ", "abbr": "ബു"},
        "Jupiter": {"name": "ഗുരു (വ്യാഴം)", "abbr": "ഗു"},
        "Venus": {"name": "ശുക്രൻ", "abbr": "ശു"},
        "Saturn": {"name": "ശനി", "abbr": "ശ"},
        "Rahu": {"name": "രാഹു", "abbr": "രാ"},
        "Ketu": {"name": "ശിഖി (കേതു)", "abbr": "ശി"},
        "Ascendant": {"name": "ലഗ്നം", "abbr": "ല"},
        "Mandi": {"name": "മാന്ദി / ഗുളികൻ", "abbr": "മാ"},
    },
    "Hindi": {
        "Sun": {"name": "सूर्य", "abbr": "सू"},
        "Moon": {"name": "चंद्र", "abbr": "चं"},
        "Mars": {"name": "मंगल", "abbr": "मं"},
        "Mercury": {"name": "बुध", "abbr": "बु"},
        "Jupiter": {"name": "गुरु", "abbr": "गु"},
        "Venus": {"name": "शुक्र", "abbr": "शु"},
        "Saturn": {"name": "शनि", "abbr": "श"},
        "Rahu": {"name": "राहु", "abbr": "रा"},
        "Ketu": {"name": "केतु", "abbr": "के"},
        "Ascendant": {"name": "लग्न", "abbr": "ल"},
        "Mandi": {"name": "मांदी / गुलिक", "abbr": "मां"},
    },
    "Tamil": {
        "Sun": {"name": "சூரியன்", "abbr": "சூ"},
        "Moon": {"name": "சந்திரன்", "abbr": "சந்"},
        "Mars": {"name": "செவ்வாய்", "abbr": "செ"},
        "Mercury": {"name": "புதன்", "abbr": "பு"},
        "Jupiter": {"name": "குரு", "abbr": "கு"},
        "Venus": {"name": "சுக்கிரன்", "abbr": "சுக்"},
        "Saturn": {"name": "சனி", "abbr": "ச"},
        "Rahu": {"name": "ராகு", "abbr": "ரா"},
        "Ketu": {"name": "கேது", "abbr": "கே"},
        "Ascendant": {"name": "லக்னம்", "abbr": "ல"},
        "Mandi": {"name": "மாந்தி / குளிகன்", "abbr": "மா"},
    },
}

NAKSHATRA_I18N: dict[str, dict[str, str]] = {
    "Ashwini": {"English": "Ashwini", "Malayalam": "അശ്വതി", "Hindi": "अश्विनी", "Tamil": "அஸ்வினி"},
    "Bharani": {"English": "Bharani", "Malayalam": "ഭരണി", "Hindi": "भरणी", "Tamil": "பரணி"},
    "Krittika": {"English": "Krittika", "Malayalam": "കാർത്തിക", "Hindi": "कृत्तिका", "Tamil": "கார்த்திகை"},
    "Rohini": {"English": "Rohini", "Malayalam": "രോഹിണി", "Hindi": "रोहिणी", "Tamil": "ரோகிணி"},
    "Mrigashira": {"English": "Mrigashira", "Malayalam": "മകയിരം", "Hindi": "मृगशिरा", "Tamil": "மிருகசீரிடம்"},
    "Ardra": {"English": "Ardra", "Malayalam": "തിരുവാതിര", "Hindi": "आर्द्रा", "Tamil": "திருவாதிரை"},
    "Punarvasu": {"English": "Punarvasu", "Malayalam": "പുണർതം", "Hindi": "पुनर्वसु", "Tamil": "புனர்பூசம்"},
    "Pushya": {"English": "Pushya", "Malayalam": "പൂയം", "Hindi": "पुष्य", "Tamil": "பூசம்"},
    "Ashlesha": {"English": "Ashlesha", "Malayalam": "ആയില്യം", "Hindi": "आश्लेषा", "Tamil": "ஆயில்யம்"},
    "Magha": {"English": "Magha", "Malayalam": "മകം", "Hindi": "मघा", "Tamil": "மகம்"},
    "Purva Phalguni": {"English": "Purva Phalguni", "Malayalam": "പൂരം", "Hindi": "पूर्वाफाल्गुनी", "Tamil": "பூரம்"},
    "Uttara Phalguni": {"English": "Uttara Phalguni", "Malayalam": "ഉത്രം", "Hindi": "उत्तराफाल्गुनी", "Tamil": "உத்திரம்"},
    "Hasta": {"English": "Hasta", "Malayalam": "അത്തം", "Hindi": "हस्त", "Tamil": "அஸ்தம்"},
    "Chitra": {"English": "Chitra", "Malayalam": "ചിത്തിര", "Hindi": "चित्रा", "Tamil": "சித்திரை"},
    "Swati": {"English": "Swati", "Malayalam": "ചോതി", "Hindi": "स्वाति", "Tamil": "சுவாதி"},
    "Vishakha": {"English": "Vishakha", "Malayalam": "വിശാഖം", "Hindi": "विशाखा", "Tamil": "விசாகம்"},
    "Anuradha": {"English": "Anuradha", "Malayalam": "അനിഴം", "Hindi": "अनुराधा", "Tamil": "அனுஷம்"},
    "Jyeshtha": {"English": "Jyeshtha", "Malayalam": "തൃക്കേട്ട", "Hindi": "ज्येष्ठा", "Tamil": "கேட்டை"},
    "Mula": {"English": "Mula", "Malayalam": "മൂലം", "Hindi": "मूल", "Tamil": "மூலம்"},
    "Purva Ashadha": {"English": "Purva Ashadha", "Malayalam": "പൂരാടം", "Hindi": "पूर्वाषाढ़ा", "Tamil": "பூராடம்"},
    "Uttara Ashadha": {"English": "Uttara Ashadha", "Malayalam": "ഉത്രാടം", "Hindi": "उत्तराषाढ़ा", "Tamil": "உத்திராடம்"},
    "Shravana": {"English": "Shravana", "Malayalam": "തിരുവോണം", "Hindi": "श्रवण", "Tamil": "திருவோணம்"},
    "Dhanishta": {"English": "Dhanishta", "Malayalam": "അവിട്ടം", "Hindi": "धनिष्ठा", "Tamil": "அவிட்டம்"},
    "Shatabhisha": {"English": "Shatabhisha", "Malayalam": "ചതയം", "Hindi": "शतभिषा", "Tamil": "சதயம்"},
    "Purva Bhadrapada": {"English": "Purva Bhadrapada", "Malayalam": "പൂരൂരുട്ടാതി", "Hindi": "पूर्वाभाद्रपद", "Tamil": "பூரட்டாதி"},
    "Uttara Bhadrapada": {"English": "Uttara Bhadrapada", "Malayalam": "ഉത്രട്ടാതി", "Hindi": "उत्तराभाद्रपद", "Tamil": "உத்திரட்டாதி"},
    "Revati": {"English": "Revati", "Malayalam": "രേവതി", "Hindi": "रेवती", "Tamil": "ரேவதி"},
}

WEEKDAY_I18N: dict[str, dict[str, Any]] = {
    "English": {
        "Sunday": {
            "name": "Sunday",
            "lord": "Sun",
            "prediction": "Born on Sunday, you possess innate leadership traits, self-confidence, and a strong sense of purpose. Creative vitality and determination propel you to high accomplishments.",
        },
        "Monday": {
            "name": "Monday",
            "lord": "Moon",
            "prediction": "Born on Monday, you are characterized by emotional gentleness, empathy, and intuitive grace. You cherish peaceful surroundings and possess rich imaginative faculties.",
        },
        "Tuesday": {
            "name": "Tuesday",
            "lord": "Mars",
            "prediction": "Born on Tuesday, you are candid, courageous, and direct in expression. You do not hesitate to speak your mind freely. You take on tasks with dynamic energy and show natural enthusiasm where others hesitate.",
        },
        "Wednesday": {
            "name": "Wednesday",
            "lord": "Mercury",
            "prediction": "Born on Wednesday, sharp intellect, analytical skill, and persuasive communication are your prominent gifts. You quickly assimilate knowledge and thrive in multidisciplinary fields.",
        },
        "Thursday": {
            "name": "Thursday",
            "lord": "Jupiter",
            "prediction": "Born on Thursday, wisdom, noble virtues, moral integrity, and philosophical inclination are your hallmarks. You earn esteem and respect in community and professional circles.",
        },
        "Friday": {
            "name": "Friday",
            "lord": "Venus",
            "prediction": "Born on Friday, you are endowed with aesthetic sensitivity, charm, artistic flair, and sociability. You appreciate luxury, culture, and harmonious relationships.",
        },
        "Saturday": {
            "name": "Saturday",
            "lord": "Saturn",
            "prediction": "Born on Saturday, perseverance, discipline, practicality, and endurance define your character. You navigate life's challenges with composure and achieve lasting success through sustained effort.",
        },
    },
    "Malayalam": {
        "Sunday": {
            "name": "ഞായർ",
            "lord": "സൂര്യൻ",
            "prediction": "ഞായറാഴ്ച ദിവസം ജനിച്ചതിനാൽ നേതൃത്വപാടവവും ആത്മവിശ്വാസവും പ്രകടമാക്കും. സർഗ്ഗാത്മകതയും ദൃഢനിശ്ചയവും ജീവിതത്തിൽ മുൻപന്തിയിലെത്താൻ സഹായിക്കും.",
        },
        "Monday": {
            "name": "തിങ്കൾ",
            "lord": "ചന്ദ്രൻ",
            "prediction": "തിങ്കളാഴ്ച ജനിച്ചതിനാൽ ശാന്തതയും സ്നേഹമസൃണമായ പെരുമാറ്റവും കാത്തുസൂക്ഷിക്കും. ഉയർന്ന ഭാവനാശക്തിയും സംവേദനക്ഷമതയും ഉണ്ടായിരിക്കും.",
        },
        "Tuesday": {
            "name": "ചൊവ്വ",
            "lord": "കുജൻ (ചൊവ്വ)",
            "prediction": "ചൊവ്വാഴ്ച ദിവസം പിറന്നതിനാൽ താങ്കൾ പലപ്പോഴും യാതൊരു ശങ്കയും കൂടാതെ മനസ്സിലുള്ളത് അതേപടി തുറന്നടിക്കുന്ന സ്വഭാവം പ്രകടിപ്പിക്കും. തന്മൂലം മറ്റുള്ളവരുടെയിടയിൽ ഒരു മുൻകോപിയായി ചിത്രീകരിക്കപ്പെട്ടെന്നും വരാം. വാക്കിലും സമീപനത്തിലും അവസരങ്ങൾക്കൊത്ത് മാറ്റങ്ങൾ വരുത്തുവാൻ മടി കാട്ടുകയില്ല. പലപ്പോഴും മറ്റുള്ളവർ മടിച്ചു നിൽക്കുന്ന പ്രവൃത്തികളിലും വിനോദങ്ങളിലും ഏർപ്പെടാനുള്ള താല്പര്യം ജനിക്കും. എങ്കിലും അതിരുകടന്ന സാഹസികതയായി അതു മാറാതിരിക്കുവാൻ ശ്രദ്ധിക്കണം.",
        },
        "Wednesday": {
            "name": "ബുധൻ",
            "lord": "ബുധൻ",
            "prediction": "ബുധനാഴ്ച ദിവസം പിറന്നതിനാൽ ബുദ്ധിസാമർത്ഥ്യം, വാക്ചാതുര്യം, വിവേകം എന്നിവ സ്വാഭാവിക ഗുണങ്ങളാണ്. പുതിയ വിജ്ഞാനങ്ങൾ സമ്പാദിക്കാനും സുഹൃത്തുക്കളെ സ്വാധീനിക്കാനും സാധിക്കും.",
        },
        "Thursday": {
            "name": "വ്യാഴം",
            "lord": "ഗുരു (വ്യാഴം)",
            "prediction": "വ്യാഴാഴ്ച ജനിച്ചതിനാൽ ജ്ഞാനവും സദാചാരബോധവും ഈശ്വരഭക്തിയും ഉയർന്ന ചിന്താഗതിയും മുഖമുദ്രയായിരിക്കും. സമൂഹത്തിൽ ആദരണീയമായ പദവി അലങ്കരിക്കും.",
        },
        "Friday": {
            "name": "വെള്ളി",
            "lord": "ശുക്രൻ",
            "prediction": "വെള്ളിയാഴ്ച ജനിച്ചതിനാൽ സൗന്ദര്യബോധം, കലാഭിരുചി, ആകർഷകമായ പെരുമാറ്റം എന്നിവ കൈമുതലായുണ്ടാകും. സുഖസൗകര്യങ്ങളും ആഡംബരങ്ങളും ആസ്വദിക്കാൻ താത്പര്യപ്പെടും.",
        },
        "Saturday": {
            "name": "ശനി",
            "lord": "ശനി",
            "prediction": "ശനിയാഴ്ച ജനിച്ചതിനാൽ കഠിനാധ്വാനവും ക്ഷമയും വിവേകവും കൈമുതലായുണ്ടാകും. പ്രതിസന്ധികളെ മനക്കരുത്തോടെ തരണം ചെയ്ത് സ്ഥിരതയുള്ള വിജയം കൈവരിക്കും.",
        },
    },
    "Hindi": {
        "Sunday": {
            "name": "रविवार",
            "lord": "सूर्य",
            "prediction": "रविवार को जन्म होने से आप में स्वाभाविक नेतृत्व क्षमता, आत्मबल और तेजस्विता होगी। रचनात्मक शक्ति और दृढ संकल्प से आप हर क्षेत्र में शीर्ष स्थान प्राप्त करेंगे।",
        },
        "Monday": {
            "name": "सोमवार",
            "lord": "चंद्र",
            "prediction": "सोमवार को जन्म होने से मन में शांति, करुणा और सौम्यता बनी रहेगी। उच्च कल्पनाशीलता और दूसरों के प्रति आत्मीयता आपकी विशिष्ट पहचान होगी।",
        },
        "Tuesday": {
            "name": "मंगलवार",
            "lord": "मंगल",
            "prediction": "मंगलवार को जन्म लेने के कारण आप स्पष्टवादी, साहसी और निर्भीक स्वभाव के होंगे। जो बात मन में है, उसे बिना किसी संकोच के प्रकट करने की प्रवृत्ति रहेगी। जहां अन्य लोग संकोच करते हैं, वहां आप साहस के साथ आगे बढ़ेंगे।",
        },
        "Wednesday": {
            "name": "बुधवार",
            "lord": "बुध",
            "prediction": "बुधवार को जन्म होने से तीव्र बुद्धि, वाकपटुता और व्यावहारिक चातुर्य आपका स्वाभाविक गुण रहेगा। नवीन ज्ञान अर्जित करने और व्यापारिक क्षेत्र में आप सफल होंगे।",
        },
        "Thursday": {
            "name": "गुरुवार",
            "lord": "गुरु",
            "prediction": "गुरुवार को जन्म होने से धार्मिकता, ज्ञान, सदाचार और गरिमामयी व्यक्तित्व का विकास होगा। समाज और कार्यक्षेत्र में आदरणीय पद प्राप्त करेंगे।",
        },
        "Friday": {
            "name": "शुक्रवार",
            "lord": "शुक्र",
            "prediction": "शुक्रवार को जन्म होने से कला, सौंदर्य और सुरुचिपूर्ण जीवनशैली के प्रति विशेष अनुराग रहेगा। आपका व्यवहार आकर्षक होगा और भौतिक सुख-साधनों की प्राप्ति होगी।",
        },
        "Saturday": {
            "name": "शनिवार",
            "lord": "शनि",
            "prediction": "शनिवार को जन्म होने से कर्मठता, धैर्य, गंभीरता और न्यायप्रियता आपके व्यक्तित्व के मूल आधार होंगे। कठिन परिश्रम से आप जीवन में स्थायी सफलता अर्जित करेंगे।",
        },
    },
    "Tamil": {
        "Sunday": {
            "name": "ஞாயிறு",
            "lord": "சூரியன்",
            "prediction": "ஞாயிற்றுக்கிழமையில் பிறந்ததால் தலைமைப் பண்பு, தன்னம்பிக்கை மற்றும் தீவிர செயல்திறன் கொண்டவராக விளங்குவீர்கள். சமூகத்தில் நற்பெயரும் புகழும் அடைவீர்கள்.",
        },
        "Monday": {
            "name": "திங்கள்",
            "lord": "சந்திரன்",
            "prediction": "திங்கட்கிழமையில் பிறந்ததால் கனிவான மனம், சாந்தமான குணம் மற்றும் உயர்ந்த கற்பனைத் திறன் கொண்டிருப்பீர்கள். குடும்பத்தாரையும் உறவுகளையும் அரவணைத்துச் செல்வீர்கள்.",
        },
        "Tuesday": {
            "name": "செவ்வாய்",
            "lord": "செவ்வாய்",
            "prediction": "செவ்வாய்க்கிழமையில் பிறந்ததால் மனதில் உள்ளதை ஒளிவுமறைவின்றி வெளிப்படையாகப் பேசும் குணம் இருக்கும். பிறர் தயங்கும் கடினமான காரியங்களையும் துணிச்சலுடன் முன்னின்று நடத்தி முடிப்பீர்கள்.",
        },
        "Wednesday": {
            "name": "புதன்",
            "lord": "புதன்",
            "prediction": "புதன்கிழமையில் பிறந்ததால் கூர்மையான அறிவுத்திறன், சாமர்த்தியமான பேச்சு மற்றும் வியாபார நுண்ணறிவு இயற்கையாகவே அமைந்திருக்கும்.",
        },
        "Thursday": {
            "name": "வியாழன்",
            "lord": "குரு",
            "prediction": "வியாழக்கிழமையில் பிறந்ததால் ஞானம், நீதிநெறி, ஆன்மீக பக்தி மற்றும் உயர்ந்த சிந்தனை உடையவராக விளங்குவீர்கள். சமுதாயத்தில் மதிப்புமிக்க அந்தஸ்து பெறுவீர்கள்.",
        },
        "Friday": {
            "name": "வெள்ளி",
            "lord": "சுக்கிரன்",
            "prediction": "வெள்ளிக்கிழமையில் பிறந்ததால் கலை ஆர்வம், அழகியல் உணர்வு மற்றும் கவர்ச்சிகரமான சுபாவம் உண்டாகும். சுகபோக வசதிகளுடன் வாழ்வீர்கள்.",
        },
        "Saturday": {
            "name": "சனி",
            "lord": "சனி",
            "prediction": "சனிக்கிழமையில் பிறந்ததால் கடுமையான உழைப்பு, பொறுமை, நிதானம் மற்றும் விவேகம் உங்களிடம் மிளிரும். தடைகளைத் தகர்த்து நிலையான வெற்றியை ஈட்டுவீர்கள்.",
        },
    },
}

UI_STRINGS = {
    "English": {
        "report_title": "HOROSCOPE OF",
        "sun_sign_label": "Your sun sign is",
        "moon_sign_label": "Your Moon sign is",
        "chart_title_rashi": "Rasi Chart",
        "chart_title_navamsha": "Navamsha Chart (D-9)",
        "chart_sub_navamsha": "Key divisional chart for fortune, spirituality, and marital prospects",
        "table_of_predictions_header": "TABLE OF PREDICTIONS",
        "table_of_predictions_sub": "{name}, Complete Vedic Horoscope Overview.",
        "years_suffix": "years",
        "ch1_title": "Your Birth Details",
        "ch1_sub": "Fundamental Astrological Calculations and Panchangam",
        "ch2_title": "Your Character and Temperament",
        "ch2_sub": "Panchanga Results",
        "ch3_title": "Factors Influencing Your Life",
        "ch3_sub": "Bhava Predictions (Houses 1 to 12 Detailed Assessment)",
        "ch4_title": "Favorable Career Timings",
        "ch4_sub": "Dasha Periods & Professional Timeline Analysis",
        "age_scope": "This prediction covers the age span from 15 to 80 years",
        "categories": {
            "Yogas": "Yogas",
            "Doshas": "Doshas",
            "Career": "Career",
            "Marriage": "Marriage",
            "Business": "Business",
        },
        "card_descriptions": {
            "Yogas": "You have {count} auspicious Yogas in your birth chart. Learn how these planetary yogas elevate your career, marriage, and financial prosperity.",
            "Doshas": "There are {count} Doshas identified in your horoscope. Recommended remedies and astrological pacifications are detailed below.",
            "Career": "Your horoscope indicates {count} prime growth and breakthrough periods for your career between now and {year}.",
            "Marriage": "Your horoscope indicates {count} highly auspicious periods for marriage between now and {year}. Two of these favorable periods occur in the next two years.",
            "Business": "Your horoscope indicates {count} highly favorable business and enterprise periods between now and {year}.",
        },
        "shloka_meaning": "For the welfare of mother and child, for augmenting family wealth and prosperity, and honoring the merits of past deeds, this birth chart is inscribed.",
    },
    "Malayalam": {
        "report_title": "HOROSCOPE OF",
        "sun_sign_label": "Your sun sign is",
        "moon_sign_label": "നിങ്ങളുടെ ചന്ദ്ര രാശി",
        "chart_title_rashi": "രാശി ചാർട്ട്",
        "chart_title_navamsha": "നവാംശ ചാർട്ട് (D-9)",
        "chart_sub_navamsha": "ഭാഗ്യവും ദാമ്പത്യവും ആത്മീയ നിലയും പരിശോധിക്കുന്നതിനുള്ള പ്രധാന വർഗ്ഗ ചാർട്ട്",
        "table_of_predictions_header": "TABLE OF PREDICTIONS",
        "table_of_predictions_sub": "{name}, നിങ്ങളുടെ പൂർണ്ണ ജാതക സംഗ്രഹം.",
        "years_suffix": "വയസ്സ്",
        "ch1_title": "താങ്കളുടെ ജനന വിശദാംശങ്ങൾ",
        "ch1_sub": "ജനന വിവരങ്ങളുടെ അടിസ്ഥാന ജ്യോതിഷ അപഗ്രഥനം",
        "ch2_title": "താങ്കളുടെ സ്വഭാവ സവിശേഷതകൾ",
        "ch2_sub": "പഞ്ചാംഗ ഫലങ്ങൾ",
        "ch3_title": "താങ്കളുടെ ജീവിതത്തെ സ്വാധീനിക്കുന്നവ",
        "ch3_sub": "ഭാവഫലങ്ങൾ (1 മുതൽ 12 വരെയുള്ള ഭാവങ്ങളുടെ പൂർണ്ണ നിരൂപണം)",
        "ch4_title": "അനുകൂല സമയങ്ങൾ",
        "ch4_sub": "ദശാഫലങ്ങളും കർമ്മ മേഖല അപഗ്രഥനവും",
        "age_scope": "ഈ പ്രവചനം ഉൾക്കൊള്ളുന്ന പ്രായപരിധി 15 മുതൽ 80 വരെ",
        "categories": {
            "Yogas": "യോഗങ്ങൾ",
            "Doshas": "ദോഷങ്ങൾ",
            "Career": "കരിയർ",
            "Marriage": "വിവാഹം",
            "Business": "ബിസിനസ്സ്",
        },
        "card_descriptions": {
            "Yogas": "നിങ്ങളുടെ ജാതകത്തിൽ {count} യോഗം(ങ്ങൾ) ഉണ്ട്. ഈ യോഗങ്ങൾ ഏതൊക്കെയെന്നും അത് നിങ്ങളുടെ കരിയർ, വിവാഹം, സമ്പത്ത് മുതലായവയിൽ എങ്ങനെ പ്രയോജനം ചെയ്യുമെന്നും മനസ്സിലാക്കുക.",
            "Doshas": "നിങ്ങളുടെ ജാതകത്തിൽ {count} ദോഷം(ങ്ങൾ) ഉണ്ട്. ദോഷങ്ങൾക്കുള്ള ഫലപ്രദമായ ശാന്തി കർമ്മങ്ങളും പരിഹാരങ്ങളും പൂർണ്ണമായി ലഭ്യമാണ്.",
            "Career": "നിങ്ങളുടെ ജാതകത്തിൽ ഇപ്പോൾ മുതൽ {year} വരെയുള്ള കാലയളവിൽ നിങ്ങളുടെ കരിയറിന് അനുകൂലമായ {count} മികച്ച സമയം(ങ്ങൾ) കാണുന്നുണ്ട്.",
            "Marriage": "നിങ്ങളുടെ ജാതകത്തിൽ ഇപ്പോൾ മുതൽ {year} വരെയുള്ള കാലയളവിൽ നിങ്ങളുടെ വിവാഹത്തിന് അനുകൂലമായ {count} മികച്ച സമയം(ങ്ങൾ) ഉണ്ട്. ഈ അനുകൂല കാലയളവുകളിൽ 2 എണ്ണം ഇപ്പോൾ മുതൽ വരുന്ന രണ്ട് വർഷങ്ങളിലാണ്.",
            "Business": "നിങ്ങളുടെ ജാതകത്തിൽ ഇപ്പോൾ മുതൽ {year} വരെ നിങ്ങളുടെ ബിസിനസിന് അനുകൂലമായ {count} മികച്ച കാലയളവ്(കൾ) ഉണ്ട്.",
        },
        "shloka_meaning": "മാതാവിന്റേയും ശിശുവിന്റേയും നന്മയ്ക്കു വേണ്ടി, കുടുംബത്തിൽ സന്തോഷവും ഐശ്വര്യവും ഉണ്ടാകുന്നതിനായി, പൂർവ്വജന്മ പുണ്യത്തിന്റെ മഹത്വത്തെ ഉൾക്കൊള്ളുന്നതിനായി, ജാതകം എഴുതപ്പെടുന്നു.",
    },
    "Hindi": {
        "report_title": "जन्म कुंडली (HOROSCOPE OF)",
        "sun_sign_label": "आपकी सूर्य राशि",
        "moon_sign_label": "आपकी चंद्र राशि",
        "chart_title_rashi": "राशि चार्ट",
        "chart_title_navamsha": "नवांश चार्ट (D-9)",
        "chart_sub_navamsha": "भाग्य, आध्यात्मिक स्थिति एवं वैवाहिक जीवन के विश्लेषण हेतु प्रमुख वर्ग चार्ट",
        "table_of_predictions_header": "भविष्यफल सारणी (TABLE OF PREDICTIONS)",
        "table_of_predictions_sub": "{name}, आपकी संपूर्ण जन्म कुंडली का सारांश।",
        "years_suffix": "वर्ष",
        "ch1_title": "आपका जन्म विवरण",
        "ch1_sub": "जन्म विवरण का आधारभूत ज्योतिषीय विश्लेषण",
        "ch2_title": "आपकी स्वाभाविक विशेषताएं",
        "ch2_sub": "पंचांग फल",
        "ch3_title": "आपके जीवन को प्रभावित करने वाले भाव",
        "ch3_sub": "भाव फल (1 से 12 भावों का संपूर्ण विश्लेषण)",
        "ch4_title": "करियर हेतु अनुकूल समय",
        "ch4_sub": "दशा फल एवं कर्म क्षेत्र विश्लेषण",
        "age_scope": "यह भविष्यवाणी 15 से 80 वर्ष की आयु सीमा को समाहित करती है",
        "categories": {
            "Yogas": "शुभ योग",
            "Doshas": "दोष",
            "Career": "करियर",
            "Marriage": "विवाह",
            "Business": "व्यापार",
        },
        "card_descriptions": {
            "Yogas": "आपकी कुंडली में {count} शुभ योग हैं। ये योग आपके करियर, वैवाहिक जीवन और धन-संपदा में किस प्रकार वृद्धि करेंगे, इसे विस्तार से जानें।",
            "Doshas": "आपकी कुंडली में {count} दोष उपस्थित हैं। दोषों के निवारण हेतु शास्त्रोक्त उपाय और शांति कर्म नीचे उपलब्ध हैं।",
            "Career": "आपकी कुंडली में वर्तमान से {year} तक करियर में अभूतपूर्व प्रगति हेतु {count} श्रेष्ठ समय देखे जा रहे हैं।",
            "Marriage": "आपकी कुंडली में {year} तक विवाह के लिए {count} उत्तम समय हैं, जिनमें से 2 कालखंड आगामी दो वर्षों में हैं।",
            "Business": "आपकी कुंडली में वर्तमान से {year} तक व्यापार और स्वतंत्र उपक्रम हेतु {count} अत्यंत अनुकूल समय हैं।",
        },
        "shloka_meaning": "माता और बालक के कल्याण हेतु, कुल में सुख-संपदा की वृद्धि के लिए तथा पूर्वजन्म के संचित पुण्यों के फल स्वरूप, यह जन्म-पत्रिका लिपिबद्ध की जाती है।",
    },
    "Tamil": {
        "report_title": "ஜாதக அறிக்கை (HOROSCOPE OF)",
        "sun_sign_label": "உங்கள் சூரிய ராசி",
        "moon_sign_label": "உங்கள் சந்திர ராசி",
        "chart_title_rashi": "ராசி கட்டம்",
        "chart_title_navamsha": "நவாம்ச கட்டம் (D-9)",
        "chart_sub_navamsha": "பாக்கியம், ஆன்மீகம் மற்றும் திருமண வாழ்க்கையை ஆராயும் முதன்மை வர்க்க கட்டம்",
        "table_of_predictions_header": "பலன்கள் சுருக்கம் (TABLE OF PREDICTIONS)",
        "table_of_predictions_sub": "{name}, உங்கள் முழுமையான ஜாதக சுருக்கம்.",
        "years_suffix": "வயது",
        "ch1_title": "உங்கள் பிறப்பு விவரங்கள்",
        "ch1_sub": "அடிப்படை ஜோதிட கணிப்புகள் மற்றும் பஞ்சாங்க விவரங்கள்",
        "ch2_title": "உங்கள் சுபாவ குணாதிசயங்கள்",
        "ch2_sub": "பஞ்சாங்க பலன்கள்",
        "ch3_title": "உங்கள் வாழ்க்கையை இயக்கும் பாவங்கள்",
        "ch3_sub": "பாவ பலன்கள் (1 முதல் 12 பாவங்களின் முழுமையான ஆய்வு)",
        "ch4_title": "தொழிலுக்கு சாதகமான காலங்கள்",
        "ch4_sub": "தசா பலன்கள் மற்றும் தொழில் காலக்கட்ட ஆய்வு",
        "age_scope": "இந்த கணிப்பு 15 முதல் 80 வயது வரையிலான காலப்பகுதியை உள்ளடக்கியது",
        "categories": {
            "Yogas": "யோகங்கள்",
            "Doshas": "தோஷங்கள்",
            "Career": "தொழில்",
            "Marriage": "திருமணம்",
            "Business": "வியாபாரம்",
        },
        "card_descriptions": {
            "Yogas": "உங்கள் ஜாதகத்தில் {count} யோகங்கள் உள்ளன. இந்த யோகங்கள் உங்கள் தொழில், திருமணம் மற்றும் பொருளாதாரத்தில் தரும் நன்மைகளை விரிவாக அறியவும்.",
            "Doshas": "உங்கள் ஜாதகத்தில் {count} தோஷங்கள் உள்ளன. தோஷங்களுக்கான எளிய பரிகார முறைகள் கீழே விரிவாகக் கொடுக்கப்பட்டுள்ளன.",
            "Career": "உங்கள் ஜாதகத்தில் தற்போது முதல் {year} வரை தொழிலில் பெரும் வளர்ச்சி தரும் {count} சிறந்த காலங்கள் உள்ளன.",
            "Marriage": "உங்கள் ஜாதகத்தில் {year} வரை திருமணத்திற்கு {count} உகந்த காலங்கள் உள்ளன, இதில் 2 காலங்கள் அடுத்த 2 ஆண்டுகளில் அமைகின்றன.",
            "Business": "உங்கள் ஜாதகத்தில் தற்போது முதல் {year} வரை வியாபார வளர்ச்சிக்கு {count} சாதகமான காலங்கள் உள்ளன.",
        },
        "shloka_meaning": "தாய்க்கும் குழந்தைக்கும் நலம் உண்டாகவும், குடும்பத்தில் மகிழ்ச்சியும் செல்வமும் பெருகவும், முற்பிறவி புண்ணியத்தின் பெருமையை உணர்ந்து, இந்த ஜாதகம் எழுதப்படுகிறது.",
    },
}

PREAMBLE_I18N = {
    "English": (
        "Shree\n"
        "During Uttarayana, while Jupiter transits Cancer and Saturn resides in Taurus, in the auspicious Kollam Era 1178 "
        "on Makaram 21st Tuesday (Astrological Day of Birth), 23 Ghatikas and 58 Vighatikas after sunset, under the 4th pada "
        "of Purva Bhadrapada nakshatra, in Shukla Paksha Chaturthi tithi with Surabhi karana and Shiva nitya yoga, "
        "Moon situated in Pisces in Cancer navamsha, with Sagittarius Ascendant (Lagna) in the middle decanate, "
        "this birth has auspiciously taken place."
    ),
    "Malayalam": (
        "ശ്രീ\n"
        "ഉത്തരായന കാലത്ത് വ്യാഴം കർക്കിടകം രാശിയിലും ശനി ഇടവം രാശിയിലും നിൽക്കെ കൊല്ലവർഷം 1178 "
        "മകരം 21 -ാം തീയതി ചൊവ്വ ( ജ്യോതിഷപ്രകാരമുള്ള ജനന ദിവസം ) അസ്തമയാൽപരം 23 നാഴിക 58 വിനാഴിക "
        "ചെന്നപ്പോൾ പൂരൂരുട്ടാതി നക്ഷത്രത്തിൽ നാലാം പാദവും ശുക്ല പക്ഷം ചതുർത്ഥി തിഥിയിൽ സുരഭി കരണവും "
        "ശിവ നിത്യ യോഗവും കൂടിയ ദിവസം മീനം രാശിയിൽ കർക്കിടകം നവാംശകത്തിൽ ചന്ദ്രൻ നിൽക്കെ ധനു ലഗ്നത്തിൽ "
        "മധ്യ ദ്രേക്കാണം കൊണ്ട് പുരുഷ ജനനം"
    ),
    "Hindi": (
        "श्री\n"
        "उत्तरायण काल में, जब देवगुरु बृहस्पति कर्क राशि में तथा शनिदेव वृषभ राशि में स्थित थे, कोल्लम संवत 1178 "
        "मकर मास 21 प्रविष्टे मंगलवार (ज्योतिषीय जन्म दिवस), सूर्यास्त के उपरांत 23 घटी 58 पल व्यतीत होने पर, "
        "पूर्वाभाद्रपद नक्षत्र के चतुर्थ पाद में, शुक्ल पक्ष चतुर्थी तिथि, सुरभि करण एवं शिव नित्य योग के शुभ संयोग में, "
        "मीन राशि एवं कर्क नवांश में चंद्रमा के स्थित रहते धनु लग्न के मध्य द्रेष्काण में यह जन्म हुआ।"
    ),
    "Tamil": (
        "ஸ்ரீ\n"
        "உத்தராயண காலத்தில், தேவகுரு வியாழன் கடக ராசியிலும், சனி பகவான் ரிஷப ராசியிலும் சஞ்சரிக்க, கொல்லம் ஆண்டு 1178 "
        "மகர மாதம் 21-ஆம் நாள் செவ்வாய்க்கிழமை (ஜோதிட ரீதியான பிறந்த நாள்), சூரிய அஸ்தமனத்திற்குப் பின் 23 நாழிகை 58 வினாடி "
        "சென்ற சுபவேளையில், பூரட்டாதி நட்சத்திரம் 4-ஆம் பாதத்தில், சுக்கில பட்ச சதுர்த்தி திதியில், சுரபி கரணமும் "
        "சிவ நித்ய யோகமும் கூடிய சுபயோக சுபதினத்தில், மீன ராசியில் கடக நவாம்சத்தில் சந்திரன் நிற்க, தனுசு லக்னத்தில் "
        "மத்திய திரேக்காணத்தில் இந்த பிறப்பு நிகழ்ந்துள்ளது."
    ),
}

BHAVAS_I18N: dict[str, list[dict[str, str]]] = {
    "English": [
        {
            "title": "First House (Tanubhavam / Ascendant)",
            "ribbon": "Personality, Physical Constitution & Social Standing (1st House)",
            "subtitle": "Predictions based on your First House",
            "significance": "The first house (Lagna) represents the native's physical vitality, temperament, bodily stature, reputation, and general destiny in life.",
            "prediction": "With your Ascendant in Sagittarius, you are drawn to purposeful professions with enduring stability. You demonstrate exceptional competence and independent judgment. You value integrity and do not yield easily to ill-advised pressure. You engage skillfully in complex undertakings. Opportunities in governance, enterprise, technology, and international ventures bring distinction.",
        },
        {
            "title": "Second House (Dhanabhavam / Wealth)",
            "ribbon": "Wealth, Assets, Family & Speech (2nd House)",
            "subtitle": "Predictions based on your Second House",
            "significance": "The second house signifies accumulated wealth, financial stability, family lineage, speech, and early learning.",
            "prediction": "With the 2nd lord posited in the 6th, initial financial challenges or competitive disputes are conquered through disciplined effort and perseverance. You earn respect within your family circle. Your measured speech inspires trust. Prudent financial planning and long-term investments ensure solid prosperity.",
        },
        {
            "title": "Third House (Sahodarabhavam / Siblings)",
            "ribbon": "Siblings, Courage & Initiative (3rd House)",
            "subtitle": "Predictions based on your Third House",
            "significance": "The third house governs younger siblings, courage, mental fortitude, valour, and self-made achievements.",
            "prediction": "The 3rd house reveals remarkable bravery, enterprise, and resilience. You face unexpected hurdles with composure and fearlessness. You maintain cordial relationships with siblings while charting your own distinct path. Bold undertakings bring triumph.",
        },
        {
            "title": "Fourth House (Sukhabhavam / Mother & Assets)",
            "ribbon": "Property, Education & Mother (4th House)",
            "subtitle": "Predictions based on your Fourth House",
            "significance": "The fourth house indicates mother, educational attainment, landed property, conveyances, and inner contentment.",
            "prediction": "The 4th lord situated in the 8th prompts you to overcome life's obstacles with heroic perseverance. You cherish deep filial affection toward your parents. You achieve notable educational credentials and acquire self-earned vehicles, property, and comfortable homesteads.",
        },
        {
            "title": "Fifth House (Santhanabhavam / Progeny & Mind)",
            "ribbon": "Intellect, Creative Wisdom & Children (5th House)",
            "subtitle": "Predictions based on your Fifth House",
            "significance": "The fifth house relates to intellect, discrimination, creative talents, speculative acumen, and noble progeny.",
            "prediction": "With the 5th lord in the 12th, your intellect possesses depth, analytical vision, and philosophical grasp. You thrive in higher research, science, and intuitive arts. You will be blessed with virtuous, accomplished children who bring honor to the family.",
        },
        {
            "title": "Sixth House (Shathrubhavam / Adversaries & Health)",
            "ribbon": "Health, Competitors & Overcoming Obstacles (6th House)",
            "subtitle": "Predictions based on your Sixth House",
            "significance": "The sixth house deals with health vitality, resistance to ailments, competitors, and debt management.",
            "prediction": "Saturn positioned in the 6th bestows immense endurance, courage, and tactical mastery over adversaries. You transform setbacks into stepping stones for victory. Adhering to a balanced daily regimen and wholesome lifestyle preserves lifelong vigor and well-being.",
        },
        {
            "title": "Seventh House (Kalathrabhavam / Marriage & Partners)",
            "ribbon": "Marriage, Life Partner & Alliances (7th House)",
            "subtitle": "Predictions based on your Seventh House",
            "significance": "The seventh house illuminates marital harmony, partner's character, business partnerships, and public alliances.",
            "prediction": "With the 7th lord in the 1st house, you are blessed with an affectionate, intelligent, and supportive life companion with whom you share deep mutual rapport. Your spouse brings good fortune, harmony, and collaborative progress to your household.",
        },
        {
            "title": "Eighth House (Ayurbhavam / Longevity & Transformation)",
            "ribbon": "Longevity, Vitality & Inner Transformation (8th House)",
            "subtitle": "Predictions based on your Eighth House",
            "significance": "The eighth house signifies longevity, profound transformations, research insights, and unearned windfalls.",
            "prediction": "With the 8th lord in the 4th, you possess strong recuperative vitality and instinctive poise during unforeseen circumstances. Divine grace safeguards you against perils. Mindfulness, spiritual grounding, and regular wellness practices foster serenity.",
        },
        {
            "title": "Ninth House (Bhagyabhavam / Fortune & Dharma)",
            "ribbon": "Fortune, Higher Wisdom & Ancestral Blessings (9th House)",
            "subtitle": "Predictions based on your Ninth House",
            "significance": "The ninth house reflects father, fortune, dharma, higher learning, and divine blessings.",
            "prediction": "With the 9th lord in the 2nd house, divine fortune and financial abundance continually favor you. You are naturally inclined toward noble deeds and community service. Generational blessings and ancestral patrimony enhance your social standing.",
        },
        {
            "title": "Tenth House (Karmabhavam / Profession & Status)",
            "ribbon": "Profession, Career & Public Eminence (10th House)",
            "subtitle": "Predictions based on your Tenth House",
            "significance": "According to Phaladeepika and Sarvartha Chintamani, the tenth house governs profession, authority, sovereignty, fame, leadership, and public achievement.",
            "prediction": "As per Brihat Parashara Hora Shastra, when the 10th lord occupies Lagna, the native becomes learned, renowned, prosperous, and respected. Your 10th house Virgo is governed by Mercury, granting proficiency in executive management, analysis, technology, advisory roles, and autonomous enterprise.",
        },
        {
            "title": "Eleventh House (Labhabhavam / Gains & Aspirations)",
            "ribbon": "Income, Profits & Fulfillment of Desires (11th House)",
            "subtitle": "Predictions based on your Eleventh House",
            "significance": "The eleventh house presides over financial gains, multiple income avenues, elder peers, and aspiration fulfillment.",
            "prediction": "With the 11th lord situated in Lagna, you achieve substantial wealth through diversified revenue streams. An influential circle of well-wishers accelerates your progress. Your cherished goals and ambitions find timely fulfillment.",
        },
        {
            "title": "Twelfth House (Vyayabhavam / Expenditure & Moksha)",
            "ribbon": "Expenditure, Foreign Travel & Spiritual Liberation (12th House)",
            "subtitle": "Predictions based on your Twelfth House",
            "significance": "The twelfth house signifies expenditures, charity, foreign residency, spiritual evolution, and liberation.",
            "prediction": "With the 12th lord in the 12th house, your expenses are channelled toward charitable causes, family welfare, and constructive investments. High potential exists for rewarding foreign travel and international connections, leading to spiritual fulfillment.",
        },
    ],
    "Hindi": [
        {
            "title": "प्रथम भाव (लग्न / तनु भाव)",
            "ribbon": "व्यक्तित्व, शारीरिक प्रकृति एवं सामाजिक प्रतिष्ठा (प्रथम भाव)",
            "subtitle": "आपके प्रथम भाव (लग्न) पर आधारित भविष्यफल",
            "significance": "प्रथम भाव जातक के समग्र व्यक्तित्व, स्वास्थ्य, शरीर गठन, स्वभाव, मान-सम्मान एवं जीवन की दिशा का प्रतिनिधित्व करता है।",
            "prediction": "धनु लग्न में जन्म होने के कारण आप स्थिर एवं सम्मानजनक कार्यक्षेत्र पसंद करेंगे। आप में उच्च बौद्धिक क्षमता और स्वतंत्र विचार होंगे। आप मित्रों के साथ सहृदय रहेंगे, परंतु सिद्धांतों से समझौता नहीं करेंगे। सरकारी सेवा, तकनीकी क्षेत्र, व्यापार अथवा विदेश संबंध से उच्च मान-सम्मान प्राप्त होगा।",
        },
        {
            "title": "द्वितीय भाव (धन भाव)",
            "ribbon": "धन, संपत्ति, परिवार एवं वाणी (द्वितीय भाव)",
            "subtitle": "आपके द्वितीय भाव पर आधारित भविष्यफल",
            "significance": "द्वितीय भाव संचित धन, कुटुंब, वाणी, प्रारंभिक शिक्षा एवं वित्तीय समृद्धि का सूचक है।",
            "prediction": "द्वितीयेश षष्ठ भाव में होने से प्रारंभिक संघर्षों अथवा प्रतिस्पर्धी चुनौतियों के उपरांत आप अपने बाहुबल और स्वप्रयास से विपुल संपत्ति का सृजन करेंगे। परिवार में आदरणीय स्थान प्राप्त होगा। आपकी गंभीर और सत्यनिष्ठ वाणी दूसरों को प्रभावित करेगी।",
        },
        {
            "title": "तृतीय भाव (सहज भाव / पराक्रम)",
            "ribbon": "सहोदर, साहस एवं उद्यम (तृतीय भाव)",
            "subtitle": "आपके तृतीय भाव पर आधारित भविष्यफल",
            "significance": "तृतीय भाव सहोदर बंधुओं, साहस, पराक्रम, आत्मबल एवं नए उपक्रमों को दर्शाता है।",
            "prediction": "तृतीय भाव का अवलोकन करने पर असाधारण साहस और आत्मबल का बोध होता है। आप किसी भी विपत्ति में पीछे नहीं हटेंगे। सहोदरों से स्नेह बना रहेगा और साहसिक नए उद्यमों में भरपूर सफलता मिलेगी।",
        },
        {
            "title": "चतुर्थ भाव (सुख भाव)",
            "ribbon": "भूमि, भवन, वाहन, विद्या एवं माता (चतुर्थ भाव)",
            "subtitle": "आपके चतुर्थ भाव पर आधारित भविष्यफल",
            "significance": "चतुर्थ भाव माता, गृह, भूमि, वाहन, विद्या एवं मानसिक सुख-शांति का विश्लेषण करता है।",
            "prediction": "चतुर्थेश अष्टम भाव में होने से जीवन में चुनौतियां आना स्वाभाविक है, परंतु आप अत्यंत धैर्य और दृढ़ता से उनका सामना करेंगे। माता-पिता के प्रति गहरी निष्ठा रहेगी। उच्च शिक्षा का सुयोग है तथा स्वरर्जित भवन एवं वाहन का सुख प्राप्त होगा।",
        },
        {
            "title": "पंचम भाव (पुत्र एवं बुद्धि भाव)",
            "ribbon": "संतान, कुशाग्र बुद्धि एवं पूर्वपुण्य (पंचम भाव)",
            "subtitle": "आपके पंचम भाव पर आधारित भविष्यफल",
            "significance": "पंचम भाव बुद्धि, विवेक, विद्या, शोध-क्षमता, रचनात्मकता एवं संतान सुख का प्रतीक है।",
            "prediction": "पंचमेश द्वादश भाव में होने से आपकी सोच में गहराई और दूरदर्शिता होगी। उच्च शिक्षा, दर्शन, विज्ञान एवं शोध कार्यों में अद्भुत सफलता मिलेगी। सुशील और गुणी संतान से कुल का मान बढ़ेगा।",
        },
        {
            "title": "षष्ठ भाव (रिपु भाव)",
            "ribbon": "स्वास्थ्य, शत्रु एवं बाधा निवारण (षष्ठ भाव)",
            "subtitle": "आपके षष्ठ भाव पर आधारित भविष्यफल",
            "significance": "षष्ठ भाव रोग, शत्रु, ऋण, प्रतिस्पर्धा एवं कठिन परिस्थितियों पर विजय का बोध कराता है।",
            "prediction": "षष्ठ भाव में शनि की स्थिति से अदम्य साहस, धन और प्रभाव की प्राप्ति होती है। आप अपने धैर्य और परिश्रम से विरोधियों को सहज ही परास्त करेंगे। संतुलित दिनचर्या बनाए रखना दीर्घायु और आरोग्य के लिए उत्तम रहेगा।",
        },
        {
            "title": "सप्तम भाव (कलत्र भाव / विवाह)",
            "ribbon": "दाम्पत्य जीवन, जीवनसाथी एवं साझेदारी (सप्तम भाव)",
            "subtitle": "आपके सप्तम भाव पर आधारित भविष्यफल",
            "significance": "सप्तम भाव विवाह, जीवनसाथी के स्वभाव, साझेदारी व्यापार एवं सामाजिक संबंधों का दर्पण है।",
            "prediction": "सप्तमेश लग्न में स्थित होने से गुणवान, विदुषी और स्नेहमयी जीवनसाथी की प्राप्ति होगी। दाम्पत्य जीवन में परस्पर विश्वास और सामंजस्य बना रहेगा। विवाह के पश्चात भाग्योदय और आर्थिक समृद्धि में वृद्धि होगी।",
        },
        {
            "title": "अष्टम भाव (आयु भाव)",
            "ribbon": "आयु, गूढ़ विद्या एवं अप्रत्याशित घटनाएं (अष्टम भाव)",
            "subtitle": "आपके अष्टम भाव पर आधारित भविष्यफल",
            "significance": "अष्टम भाव आयु, जीवन-शक्ति, आकस्मिक परिवर्तन, शोध एवं गुप्त ज्ञान का सूचक है।",
            "prediction": "अष्टमेश चतुर्थ भाव में होने से आप में संकटों से उबरने की आंतरिक शक्ति विद्यमान है। ईश्वर की विशेष कृपा से आप कठिनाइयों से सुरक्षित बाहर निकल आएंगे। योग एवं सात्विक जीवनशैली से दीर्घायु की प्राप्ति होगी।",
        },
        {
            "title": "नवम भाव (भाग्य एवं धर्म भाव)",
            "ribbon": "सौभाग्य, धर्म, तीर्थ एवं पैतृक कृपा (नवम भाव)",
            "subtitle": "आपके नवम भाव पर आधारित भविष्यफल",
            "significance": "नवम भाव पिता, धर्म, ईश्वरीय कृपा, उच्च शिक्षा एवं पूर्वजन्म के पुण्यों का द्योतक है।",
            "prediction": "नवमेश द्वितीय भाव में स्थित होने से ईश्वरीय कृपा और धन-समृद्धि निरंतर आपके साथ रहेगी। आप धार्मिक और जनकल्याणकारी कार्यों में रुचि लेंगे। पैतृक संपत्ति एवं प्रतिष्ठा का लाभ मिलेगा।",
        },
        {
            "title": "दशम भाव (कर्म भाव / आजीविका)",
            "ribbon": "कार्यक्षेत्र, व्यवसाय, पद-प्रतिष्ठा एवं अधिकार (दशम भाव)",
            "subtitle": "आपके दशम भाव पर आधारित भविष्यफल",
            "significance": "फलदीपिका एवं सर्वार्थ चिंतामणि के अनुसार दशम भाव व्यापार, मान-सम्मान, पद-प्रतिष्ठा, अधिकार एवं कीर्ति को दर्शाता है।",
            "prediction": "बृहत्पाराशर होराशास्त्र के अनुसार जब दशमेश लग्न में हो, तो जातक विद्वान, यशस्वी, धनवान और प्रभावशाली होता है। आपका दशम भाव कन्या राशि है जो बुध के आधिपत्य में है। प्रबंधन, तकनीकी, बैंकिंग अथवा स्वतंत्र व्यापार में आप उच्च मुकाम हासिल करेंगे।",
        },
        {
            "title": "एकादश भाव (लाभ भाव)",
            "ribbon": "आय, लाभ एवं मनोरथ सिद्धि (एकादश भाव)",
            "subtitle": "आपके एकादश भाव पर आधारित भविष्यफल",
            "significance": "एकादश भाव आय के विभिन्न स्रोतों, बड़े भाई-बहनों, मित्रों एवं महत्वाकांक्षाओं की पूर्ति का भाव है।",
            "prediction": "एकादशेश लग्न में स्थित होने से जीवन में कई माध्यमों से धन लाभ और आय में वृद्धि होगी। प्रभावशाली मित्रों का सहयोग मिलेगा और आपके सभी उचित संकल्प समयानुसार सिद्ध होंगे।",
        },
        {
            "title": "द्वादश भाव (व्यय एवं मोक्ष भाव)",
            "ribbon": "व्यय, विदेश गमन एवं मोक्ष (द्वादश भाव)",
            "subtitle": "आपके द्वादश भाव पर आधारित भविष्यफल",
            "significance": "द्वादश भाव व्यय, दान, दूरस्थ यात्रा, विदेश वास एवं आध्यात्मिक मुक्ति का परिचायक है।",
            "prediction": "द्वादशेश द्वादश भाव में ही स्थित होने से आप शुभ कार्यों, परिवार के उत्थान और दान-पुण्य में धन का सदुपयोग करेंगे। विदेश यात्रा अथवा सुदूर स्थानों से लाभ की प्रबल संभावना है। जीवन का उत्तरार्ध आध्यात्मिक शांति से परिपूर्ण रहेगा।",
        },
    ],
    "Tamil": [
        {
            "title": "முதல் பாவம் (லக்னம் / தனு பாவம்)",
            "ribbon": "ஆளுமை, உடல் அமைப்பு மற்றும் சமூக அந்தஸ்து (1-ஆம் பாவம்)",
            "subtitle": "உங்கள் முதல் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "லக்ன பாவம் என்பது ஜாதகரின் தேக பலம், குணம், ஆரோக்கியம், கீர்த்தி மற்றும் வாழ்க்கைப் பயணத்தை குறிக்கும் பிரதான பாவமாகும்.",
            "prediction": "தனுசு லக்னத்தில் பிறந்ததால் நிலையான வருமானம் தரும் மதிப்பிற்குரிய பணிகளை விரும்புவீர்கள். சுதந்திர சிந்தனையும் விவேகமும் உங்களிடம் இருக்கும். நற்பண்புகளும் தலைமைப் பண்பும் கைவரப்பெறும். அரசுத்துறை, தொழில்நுட்பம், வியாபாரம் அல்லது வெளிநாட்டு தொடர்புகளால் நற்பெயரும் புகழும் அடைவீர்கள்.",
        },
        {
            "title": "இரண்டாம் பாவம் (தன பாவம்)",
            "ribbon": "தனம், குடும்பம், வாக்கு மற்றும் சொத்து (2-ஆம் பாவம்)",
            "subtitle": "உங்கள் இரண்டாம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "இரண்டாம் பாவம் சேமிப்பு, குடும்ப நலம், வாக்குவன்மை, கல்வி மற்றும் நிதி நிலையை தெளிவாகக் குறிக்கிறது.",
            "prediction": "இரண்டாம் அதிபதி 6-ல் நின்றாலும், சுயமுயற்சியினாலும் தளராத உழைப்பினாலும் சிறந்த செல்வத்தை ஈட்டுவீர்கள். குடும்பத்தில் மதிப்புமிக்க இடம் கிடைக்கும். நிதானமான பேச்சினால் அனைவரையும் கவர்வீர்கள். சீரான சேமிப்பினால் சிறந்த பொருளாதார முன்னேற்றம் காண்பீர்கள்.",
        },
        {
            "title": "மூன்றாம் பாவம் (சகோதர / தைரிய பாவம்)",
            "ribbon": "சகோதரர்கள், வீரியம் மற்றும் தைரியம் (3-ஆம் பாவம்)",
            "subtitle": "உங்கள் மூன்றாம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "மூன்றாம் பாவம் தைரியம், துணிச்சல், மன உறுதி, சகோதர உறவு மற்றும் புதிய முயற்சிகளை உணர்த்துகிறது.",
            "prediction": "மூன்றாம் பாவம் உங்களிடம் இருக்கும் அசாதாரண துணிச்சலையும் தன்னம்பிக்கையையும் காட்டுகிறது. எத்தகைய சோதனைகளையும் அஞ்சாமல் எதிர்கொள்வீர்கள். சகோதரர்களுடன் பாசம் காட்டுவீர்கள். புதிய முயற்சிகளில் உறுதியான வெற்றி காண்பீர்கள்.",
        },
        {
            "title": "நான்காம் பாவம் (சுக பாவம்)",
            "ribbon": "தாய், கல்வி, மனை மற்றும் வாகனம் (4-ஆம் பாவம்)",
            "subtitle": "உங்கள் நான்காம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "நான்காம் பாவம் தாயன்பு, கல்வித் தகுதி, வீடு, வாகன வசதி மற்றும் மனமகிழ்ச்சியைக் குறிக்கிறது.",
            "prediction": "நான்காம் அதிபதி 8-ல் நின்றாலும், எதையும் தைரியமாக எதிர்கொள்ளும் ஆற்றல் உண்டு. பெற்றோரிடம் மிகுந்த மரியாதையும் பாசமும் கொண்டிருப்பீர்கள். சொந்த வீடு, நிலம், வாகன வசதிகளை சுயமாக ஈட்டும் யோகம் உண்டு.",
        },
        {
            "title": "ஐந்தாம் பாவம் (பூர்வ புண்ணியம் / புத்திர பாவம்)",
            "ribbon": "புத்தி கூர்மை, சந்தான பாக்கியம் மற்றும் ஞானம் (5-ஆம் பாவம்)",
            "subtitle": "உங்கள் ஐந்தாம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "ஐந்தாம் பாவம் நுண்ணறிவு, ஆராய்ச்சி திறன், புத்திர பேறு மற்றும் முற்பிறவி புண்ணியத்தை உணர்த்துகிறது.",
            "prediction": "ஐந்தாம் அதிபதி 12-ல் அமைந்திருப்பதால் ஆழ்ந்த சிந்தனையும் தொலைநோக்குப் பார்வையும் உண்டு. உயர் கல்வி, கலை, அறிவியல் துறைகளில் தேர்ச்சி பெறுவீர்கள். நற்பண்புகள் நிறைந்த குழந்தைகளால் குடும்பத்திற்கு பெருமை சேரும்.",
        },
        {
            "title": "ஆறாம் பாவம் (சத்ரு பாவம்)",
            "ribbon": "ஆரோக்கியம், எதிரிகள் மற்றும் தடைகளை வெல்லுதல் (6-ஆம் பாவம்)",
            "subtitle": "உங்கள் ஆறாம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "ஆறாம் பாவம் ஆரோக்கியம், நோய் எதிர்ப்பு சக்தி, கடன் மற்றும் போட்டிகளை வெல்லும் திறனை குறிக்கிறது.",
            "prediction": "ஆறில் சனி அமர்வது தைரியத்தையும், செல்வத்தையும், எதிரிகளை வெல்லும் பேராற்றலையும் தரும். விடாமுயற்சியினால் தடைகளை வெற்றிகளாக மாற்றுவீர்கள். சீரான உணவுப் பழக்கம் மற்றும் உடற்பயிற்சி உங்களுக்கு நீண்ட ஆயுளையும் நல்வாழ்வையும் தரும்.",
        },
        {
            "title": "ஏழாம் பாவம் (களத்திர பாவம் / திருமணம்)",
            "ribbon": "திருமணம், வாழ்க்கைத் துணை மற்றும் கூட்டுத் தொழில் (7-ஆம் பாவம்)",
            "subtitle": "உங்கள் ஏழாம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "ஏழாம் பாவம் திருமண வாழ்க்கை, வாழ்க்கைத் துணையின் நற்குணம் மற்றும் கூட்டாளிகளை விளக்குகிறது.",
            "prediction": "ஏழாம் அதிபதி லக்னத்தில் அமர்ந்திருப்பதால் அன்பும் பண்பும் நிறைந்த சிறந்த வாழ்க்கைத் துணை அமைவார். இல்வாழ்க்கையில் பரஸ்பர நம்பிக்கையும் ஒற்றுமையும் நிலவும். திருமணத்திற்குப் பிறகு பொருளாதாரத்தில் அபரிமிதமான வளர்ச்சி உண்டாகும்.",
        },
        {
            "title": "எட்டாம் பாவம் (ஆயுள் பாவம்)",
            "ribbon": "ஆயுள் பலம் மற்றும் திடீர் நிகழ்வுகள் (8-ஆம் பாவம்)",
            "subtitle": "உங்கள் எட்டாம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "எட்டாம் பாவம் ஆயுள் பலம், மறைமுக ஆற்றல், ஆன்மீக ஞானம் மற்றும் எதிர்பாராத நிகழ்வுகளைக் குறிக்கிறது.",
            "prediction": "எட்டாம் அதிபதி 4-ல் நின்றாலும் சிறந்த ஆயுள் பலம் உண்டு. இக்கட்டான சூழ்நிலைகளில் இருந்து தப்பிக்கும் தெய்வ அனுகூலம் ஜாதகத்தில் தென்படுகிறது. யோகா மற்றும் ஆன்மீக ஈடுபாடு மன அமைதியைத் தரும்.",
        },
        {
            "title": "ஒன்பதாம் பாவம் (பாக்கிய பாவம் / தர்மம்)",
            "ribbon": "பாக்கியம், தந்தை, ஆன்மீகம் மற்றும் செல்வம் (9-ஆம் பாவம்)",
            "subtitle": "உங்கள் ஒன்பதாம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "ஒன்பதாம் பாவம் தந்தை, குருவருள், அதிர்ஷ்டம், தர்ம சிந்தனை மற்றும் தெய்வ நம்பிக்கையைக் குறிக்கிறது.",
            "prediction": "ஒன்பதாம் அதிபதி 2-ல் அமைந்திருப்பதால் தெய்வ அனுகூலமும் பொருளாதார நன்மைகளும் தொடர்ந்து கிடைக்கும். தர்ம காரியங்களில் ஈடுபடுவீர்கள். பூர்வீக சொத்து அல்லது சமூக அங்கீகாரம் கிடைக்க வாய்ப்புண்டு.",
        },
        {
            "title": "பத்தாம் பாவம் (கர்ம பாவம் / தொழில்)",
            "ribbon": "தொழில், பதவி, அதிகாரம் மற்றும் கீர்த்தி (10-ஆம் பாவம்)",
            "subtitle": "உங்கள் பத்தாம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "பலதீபிகை மற்றும் சர்வார்த்த சிந்தாமணி நூல்களின்படி பத்தாம் பாவம் தொழில், அதிகாரம், புகழ் மற்றும் சமுதாய அந்தஸ்தை குறிக்கிறது.",
            "prediction": "பிருஹத் பராசர ஹோரா சாஸ்திரப்படி பத்தாம் அதிபதி லக்னத்தில் நின்றால் ஜாதகர் அறிஞராகவும், புகழ்பெற்றவராகவும், செல்வந்தராகவும் விளங்குவார். புதனின் கட்டுப்பாட்டில் உள்ள கன்னி ராசி பத்தாம் பாவமாக அமைவதால் நிர்வாகம், வங்கி, ஆலோசனை அல்லது வியாபாரத்தில் பெரும் உயரத்தை எட்டுவீர்கள்.",
        },
        {
            "title": "பதினோன்றாம் பாவம் (லாப பாவம்)",
            "ribbon": "வருமானம், லாபம் மற்றும் ஆசை நிறைவேறுதல் (11-ஆம் பாவம்)",
            "subtitle": "உங்கள் பதினோன்றாம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "பதினோன்றாம் பாவம் பல வழிகளில் வரும் வருமானம், மூத்த சகோதரர்கள் மற்றும் லட்சியங்களை நிறைவேற்றும் பாவமாகும்.",
            "prediction": "பதினோன்றாம் அதிபதி லக்னத்தில் நிற்பதால் பல்வேறு வழிகளில் வருமானமும் செல்வமும் பெருகும். உயர்ந்த நண்பர்களின் உதவி கிடைக்கும். உங்களின் நல்விருப்பங்கள் அனைத்தும் படிப்படியாக நிறைவேறும்.",
        },
        {
            "title": "பன்னிரண்டாம் பாவம் (விரய பாவம் / மோட்சம்)",
            "ribbon": "சுப விரயம், வெளிநாட்டு பயணம் மற்றும் ஆன்மீகம் (12-ஆம் பாவம்)",
            "subtitle": "உங்கள் பன்னிரண்டாம் பாவத்தை அடிப்படையாகக் கொண்ட பலன்கள்",
            "significance": "பன்னிரண்டாம் பாவம் சுப செலவுகள், தான தர்மம், வெளிநாட்டு பயணம் மற்றும் ஆன்மீக மோட்சத்தைக் குறிக்கிறது.",
            "prediction": "பன்னிரண்டாம் அதிபதி 12-ல் ஆட்சி பெறுவதால் சுப காரியங்களுக்காகவும் தான தர்மங்களுக்காகவும் பணம் செலவழிப்பீர்கள். வெளிநாட்டு பயணம் மற்றும் தூரதேச தொடர்புகளால் அனுகூலம் உண்டாகும். வாழ்க்கையின் பிற்பகுதியில் ஆன்மீக நிறைவு உண்டாகும்.",
        },
    ],
    "Malayalam": [
        {
            "title": "താങ്കളുടെ വ്യക്തിത്വം, ശരീര പ്രകൃതം, സാമൂഹിക സ്ഥിതി (ഒന്നാം ഭാവം)",
            "ribbon": "താങ്കളുടെ വ്യക്തിത്വം, ശരീര പ്രകൃതം, സാമൂഹിക സ്ഥിതി (ഒന്നാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ ഒന്നാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "ജാതകനെ പ്രതിനിധാനം ചെയ്യുന്ന ഭാവമാണ് ഒന്നാം ഭാവം അഥവാ ലഗ്നഭാവം. സ്വഭാവഗുണം, ശരീരം, ആകൃതി, യശസ്സ് എന്നീ കാര്യങ്ങൾ ഒന്നാം ഭാവം കൊണ്ട് നിരൂപിക്കാം.",
            "prediction": "ധനുലഗ്നത്തിൽ ജനിക്കുകയാൽ, സ്ഥിര വേതനം ലഭിക്കുന്ന ഉദ്യോഗം ഇഷ്ടപ്പെടും. സാമർത്ഥ്യം പ്രകടമാക്കും. എത്ര വലിയ സ്നേഹിതരാണെങ്കിലും, അവരുടെ അഭിപ്രായങ്ങൾക്ക് വഴങ്ങിക്കൊടുക്കാത്ത പ്രത്യേക സ്വഭാവമായിരിക്കും. ശുപാർശക്കാർക്ക് നിരാശ അനുഭവപ്പെടും. സങ്കീർണ്ണമായതും കൗശല പ്രയോഗങ്ങൾ ആവശ്യമായതുമായ പ്രവൃത്തികളിൽ ഏർപ്പെടും. സർക്കാർസേവനം, കൃഷി, വിദേശവാസം ഇവമൂലം മേന്മ സിദ്ധിക്കും. ജലമാർഗ്ഗേയുള്ള കാര്യങ്ങളിലും താല്പര്യങ്ങൾ പ്രകടമാകും. ദീർഘദൃഷ്ടിയും കാര്യവിവേകവും കൈമുതലായിരിക്കും.",
        },
        {
            "title": "ധനം, ഭൂസ്വത്ത് (രണ്ടാം ഭാവം)",
            "ribbon": "ധനം, ഭൂസ്വത്ത് (രണ്ടാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ രണ്ടാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "ധനം, ഭൂസ്വത്ത്, കുടുംബം, സംഭാഷണം, ഭക്ഷണം, വിദ്യ എന്നീ വിഷയങ്ങളെക്കുറിച്ചാണ് രണ്ടാം ഭാവം പ്രധാനമായും സൂചനകൾ നൽകുന്നത്.",
            "prediction": "രണ്ടാം ഭാവാധിപൻ ആറിൽ നിൽക്കുന്നതിനാൽ, ശത്രുമുഖാന്തരമോ സാമ്പത്തിക തർക്കങ്ങളോ പ്രാരംഭത്തിൽ ഉണ്ടായേക്കാമെങ്കിലും സ്വപ്രയത്നത്താൽ സമ്പത്ത് സ്വരൂപിക്കും. കുടുംബത്തിൽ മാന്യമായ പദവിയും ആദരവും ലഭിക്കും. പക്വമായ സംസാരശൈലി മറ്റുള്ളവരെ ആകർഷിക്കും. സാമ്പത്തിക അച്ചടക്കം പാലിച്ച് ദീർഘകാല നിക്ഷേപങ്ങളിലൂടെ വൻ പുരോഗതി നേടും.",
        },
        {
            "title": "സഹോദരങ്ങൾ (മൂന്നാം ഭാവം)",
            "ribbon": "സഹോദരങ്ങൾ (മൂന്നാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ മൂന്നാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "മൂന്നാം ഭാവം സഹോദരഭാവമാണ്. പ്രധാനമായും സഹോദരങ്ങളെപ്പറ്റിയും കൂടാതെ ധൈര്യം, സാമർത്ഥ്യം, പട്ടാളസേവനം മുതലായവയെക്കുറിച്ചും മൂന്നാമിടം സൂചനകൾ നൽകുന്നു.",
            "prediction": "മൂന്നാം ഭാവം പരിശോധിക്കുമ്പോൾ അസാധാരണമായ ധൈര്യവും മനക്കരുത്തും കാണാം. പ്രതിസന്ധികളിൽ മുന്നിൽ നിന്ന് നയിക്കാനും ഏതു തടസ്സത്തെയും ചങ്കൂറ്റത്തോടെ തകർക്കാനും കഴിയും. സഹോദരങ്ങളുമായി സ്നേഹബന്ധം പുലർത്തും. സാഹസികമായ കാര്യങ്ങളിൽ താല്പര്യം കാണിക്കുകയും പുതിയ സംരംഭങ്ങളിൽ വിജയം വരിക്കുകയും ചെയ്യും.",
        },
        {
            "title": "സ്വത്ത്, വിദ്യാഭ്യാസം (നാലാം ഭാവം)",
            "ribbon": "സ്വത്ത്, വിദ്യാഭ്യാസം (നാലാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ നാലാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "നാലാം രാശിയെ ആസ്പദമാക്കി സമ്പത്ത്, വിദ്യാഭ്യാസം, മാതാവ്, വാഹനങ്ങൾ എന്നിവയെക്കുറിച്ച് ചിന്തിക്കാം.",
            "prediction": "നാലാം ഭാവാധിപൻ എട്ടിൽ നിൽക്കുന്നു. പ്രശ്നങ്ങളുണ്ടാവുക സാധാരണയാണെന്നു കരുതണം. പക്ഷേ എന്തിനേയും തന്റേടത്തോടെ തന്നെ അഭിമുഖീകരിക്കുന്നവനാണ്. പിന്തിരിഞ്ഞ് ഓടി രക്ഷപെടുന്ന പ്രകൃതം ഒരിക്കലും കാണിക്കുകയില്ല. പുത്രൻ എന്നനിലയിൽ മാതാപിതാക്കളോട് അസാധാരണമായ ആദരവും കടപ്പാടും കാത്തുസൂക്ഷിക്കും. ഉയർന്ന വിദ്യാഭ്യാസ യോഗവും സ്വന്തമായി ഭവനവും വാഹനങ്ങളും സമ്പാദിക്കാനുള്ള ഭാഗ്യവും കൈവരും.",
        },
        {
            "title": "സന്താനങ്ങൾ, മനസ്സ് , വിശേഷ ബുദ്ധി (അഞ്ചാം ഭാവം)",
            "ribbon": "സന്താനങ്ങൾ, മനസ്സ് , വിശേഷ ബുദ്ധി (അഞ്ചാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ അഞ്ചാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "സന്താനം, മനസ്സ്, ബുദ്ധി എന്നീ വിഷയങ്ങളെപ്പറ്റിയാണ് അഞ്ചാം ഭാവം പ്രധാനമായും സൂചനകൾ നൽകുന്നത്.",
            "prediction": "അഞ്ചാം ഭാവാധിപൻ പന്ത്രണ്ടിൽ നിൽക്കുന്നതിനാൽ ചിന്തകളിൽ ആഴവും ദൂരക്കാഴ്ചയും ഉണ്ടാകും. ഉന്നതവിദ്യാഭ്യാസത്തിനും വിജ്ഞാനസമ്പാദനത്തിനും മികച്ച അവസരങ്ങൾ ലഭിക്കും. ആത്മീയ കാര്യങ്ങളിലും ശാസ്ത്രത്തിലും ഗണിതത്തിലും അസാധാരണമായ ജ്ഞാനം കൈവരിക്കും. സൽഗുണസമ്പന്നരായ സന്താനങ്ങൾ കുടുംബത്തിന് ഐശ്വര്യവും സൽകീർത്തിയും നൽകും.",
        },
        {
            "title": "രോഗങ്ങൾ, ശത്രു, തടസ്സങ്ങൾ (ആറാം ഭാവം)",
            "ribbon": "രോഗങ്ങൾ, ശത്രു, തടസ്സങ്ങൾ (ആറാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ ആറാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "രോഗം, ശത്രു, മുറിവ്, തടസ്സം, കളവ് മുതലായ പൊതുവെ അനിഷ്ടകരമായ കാര്യങ്ങളെക്കുറിച്ചാണ് ആറാം ഭാവം സൂചനകൾ നൽകുന്നത്.",
            "prediction": "ശനിയുടെ സ്ഥാനം ആറിലാണ്. ധൈര്യം, ധനം അഭികാമ്യമായ പെരുമാറ്റം ഇവ പ്രതീക്ഷിക്കാം. തന്റെ പരിശ്രമത്താൽ ശത്രുക്കളുടെ എതിർപ്പുകളെ എളുപ്പത്തിൽ തരണം ചെയ്യും. കഠിനാധ്വാനത്തിലൂടെ ഏതു തടസ്സത്തെയും അവസരങ്ങളാക്കി മാറ്റാൻ സാധിക്കും. നിത്യജീവിതത്തിൽ ഭക്ഷണക്രമവും ആരോഗ്യവും കാത്തുസൂക്ഷിക്കുന്നത് ദീർഘകാല ക്ഷേമം നൽകും.",
        },
        {
            "title": "വിവാഹം (ഏഴാം ഭാവം)",
            "ribbon": "വിവാഹം (ഏഴാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ ഏഴാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "വിവാഹജീവിതത്തിന്റെ വിവിധവശങ്ങൾ ഏഴാമിടത്തെകൊണ്ട് ചിന്തിക്കേണ്ടിയിരിക്കുന്നു.",
            "prediction": "ഏഴാം ഭാവാധിപൻ ഒന്നിൽ നിലകൊള്ളുന്നു. ഏതെങ്കിലും തരത്തിൽ അല്പ്പമെങ്കിലും മുൻപരിചയമുള്ള ഒരു വ്യക്തിയേയോ, തന്റെ ബാല്യകാലസഖിയെത്തന്നെയോ അല്ലെങ്കിൽ മനസ്സിനിണങ്ങിയ ഉത്തമ പങ്കാളിയെയോ വിവാഹം കഴിക്കാൻ സാധിക്കും. ദാമ്പത്യജീവിതത്തിൽ പരസ്പര ധാരണയും സ്നേഹവും നിലനിൽക്കും. പങ്കാളിയുടെ വരവോടെ സാമ്പത്തിക പുരോഗതിയും കുടുംബത്തിൽ സമാധാനവും ഉണ്ടാകും.",
        },
        {
            "title": "ആയുസ്സ്, ബുദ്ധിമുട്ടുകൾ (എട്ടാം ഭാവം)",
            "ribbon": "ആയുസ്സ്, ബുദ്ധിമുട്ടുകൾ (എട്ടാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ എട്ടാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "അഷ്ടമഭാവം കൊണ്ട് അരിഷ്ടതകൾ, ആയുസ്സ്, ചികിത്സ എന്നിവയെപ്പറ്റിയാണ് പ്രധാനമായും ചിന്തിക്കേണ്ടത്.",
            "prediction": "എട്ടാം ഭാവാധിപൻ നാലിൽ നിൽക്കുന്നതിനാൽ ആയുരാരോഗ്യ കാര്യങ്ങളിൽ നല്ല ജാഗ്രത പുലർത്തും. അപ്രതീക്ഷിത സംഭവങ്ങളെ നേരിടാനുള്ള അസാധാരണ മനശ്ശക്തി ഉണ്ടായിരിക്കും. ആപത്തുകളിൽ നിന്ന് അത്ഭുതകരമായി രക്ഷപ്പെടാനുള്ള ഈശ്വരാധീനം ജാതകത്തിൽ ദൃശ്യമാണ്. ചിട്ടയായ വ്യായാമവും ആരോഗ്യശീലങ്ങളും വലിയ ആശ്വാസമേകും.",
        },
        {
            "title": "സൗഭാഗ്യം, ഐശ്വര്യം, പാരമ്പര്യ സ്വത്ത് (ഒമ്പതാം ഭാവം)",
            "ribbon": "സൗഭാഗ്യം, ഐശ്വര്യം, പാരമ്പര്യ സ്വത്ത് (ഒമ്പതാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ ഒൻപതാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "ഭാഗ്യം, പിതാവ്, പൂർവ്വപുണ്യം, ധർമ്മം, ഈശ്വരാധീനം എന്നിവ ഒമ്പതാം ഭാവം വ്യക്തമാക്കുന്നു.",
            "prediction": "ഒമ്പതാം ഭാവാധിപൻ രണ്ടിൽ നിൽക്കുന്നതിനാൽ ഈശ്വരാധീനവും ഭാഗ്യവും സാമ്പത്തിക നേട്ടങ്ങളും നിരന്തരം അനുഭവപ്പെടും. സൽക്കർമ്മങ്ങളിലും ധർമ്മപ്രവർത്തനങ്ങളിലും സജീവമായി പങ്കെടുക്കും. പിതൃസ്വത്തോ കുടുംബപരമായ അംഗീകാരമോ ലഭിക്കാനുള്ള സാധ്യത വളരെ കൂടുതലാണ്. ഉന്നത യാത്രകൾക്കും വിജ്ഞാന സമ്പാദനത്തിനും ഭാഗ്യം തുണയ്ക്കും.",
        },
        {
            "title": "കർമ്മ മേഖല (പത്താം ഭാവം)",
            "ribbon": "കർമ്മ മേഖല (പത്താം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ പത്താം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "ഫലദീപികയിൽ പത്താംഭാവം വ്യാപാരം, സ്ഥാനമാനങ്ങൾ, പ്രവൃത്തി, തൊഴിൽ, വിജയം, കീർത്തി, ത്യാഗം, സമർപ്പണം, ജീവിതമാർഗ്ഗം, ആകാശം, സ്വഭാവം, സദ്ഗുണങ്ങൾ, പ്രവണത, നടപ്പ്, അധികാരം എന്നിവയെ സൂചിപ്പിക്കുന്നതായി പറയുന്നു. സർവ്വാർത്ഥചിന്താമണി പത്താം ഭാവത്തെക്കുറിച്ച് ജാതകന്റെ തൊഴിൽ, ആജ്ഞാശക്തി, അധികാരം, പ്രശസ്തി, മഴ, വിദേശവാസയോഗം, ത്യാഗം, പ്രകടനം, മൂല്യം, ബഹുമാനം, ജീവിതമാർഗ്ഗങ്ങൾ, തൊഴിൽ, കാൽമുട്ടുകൾ, വേലക്കാർ എന്നിവയെക്കുറിച്ച് വിലയിരുത്താമെന്നു പറയുന്നു. പത്താംഭാവം, പത്താംഭാവാധിപൻ, ഭാവകാരകനായി വരുന്ന ഗ്രഹം, സൂര്യ-ചന്ദ്രന്മാരുടെ സ്ഥാനം എന്നിവ വിലയിരുത്തിയതിൽ നിന്ന് ജ്യോതിഷപരമായി താങ്കൾക്കു ഗുണകരമായേക്കാവുന്ന തൊഴിലുകളെക്കുറിച്ച് താഴെക്കാണും പ്രകാരം ഉൾക്കാഴ്ച നൽകുന്നു.",
            "prediction": "ജാതകപ്രകാരം പത്താം ഭാവാധിപൻ ലഗ്നത്തിൽ നിൽക്കുന്നു. ബൃഹദ് പരാശര ഹോരാശാസ്ത്രമനുസരിച്ച് പത്താംഭാവാധിപൻ ലഗ്നത്തിൽ നിന്നാൽ ജാതകൻ വിദ്വാനും, പ്രശസ്തനും, ധനമുള്ളവനും ആയിരിക്കും. കാവ്യരചനയിൽ പ്രാഗൽഭ്യം കാണിക്കും. ബാല്യകാലത്ത് ചെറിയ അസുഖങ്ങൾ ഉണ്ടായേക്കാം. പണവും സന്തോഷവും വർഷങ്ങൾ ചെല്ലുന്തോറും വർദ്ധിച്ചു വരും. പത്താംഭാവം കന്നിരാശിയാണ്. ബുധന്റെ സൂക്ഷ്മ നിയന്ത്രണത്തിലാണ് നിങ്ങൾ. കലകളോടും സാഹിത്യത്തോടും ഏറെ അഭിരുചിയുള്ളവനായിരിക്കും. കലകളോടുള്ള ഈ താത്പര്യം വിവിധ കലകൾ, ഫാഷൻ ഡിസൈനിംഗ്, ശില്പങ്ങൾ, കരകൗശല വസ്തുക്കൾ എന്നിവയിലും, മാനേജ്മെന്റ്, സാങ്കേതികവിദ്യ, ബാങ്കിംഗ്, ഉപദേശക രംഗം, സ്വതന്ത്ര ബിസിനസ്സ് എന്നിവയിലും വലിയ ഉയരങ്ങളിലെത്തും.",
        },
        {
            "title": "വരുമാനം (പതിനൊന്നാം ഭാവം)",
            "ribbon": "വരുമാനം (പതിനൊന്നാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ പതിനൊന്നാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "പതിനൊന്നാം ഭാവം പ്രധാനമായും ധനലാഭത്തെയാണ് സൂചിപ്പിക്കുന്നത്.",
            "prediction": "പതിനൊന്നാം ഭാവാധിപൻ ലഗ്നത്തിൽ നിൽക്കുന്നതിനാൽ വിവിധ മാർഗ്ഗങ്ങളിലൂടെ സമ്പത്തും വരുമാനവും വർദ്ധിക്കും. സ്വാധീനമുള്ള സുഹൃത്തുക്കളിൽ നിന്നും ഗുണഫലങ്ങൾ ലഭിക്കും. ആഗ്രഹങ്ങൾ സാക്ഷാത്കരിക്കപ്പെടുകയും സത്കീർത്തിയും സംതൃപ്തിയും കൈവരികയും ചെയ്യും. സാമ്പത്തിക ഭദ്രത എപ്പോഴും കൂടെയുണ്ടാകും.",
        },
        {
            "title": "ചിലവുകൾ, ദ്രവ്യനാശം (പന്ത്രണ്ടാം ഭാവം)",
            "ribbon": "ചിലവുകൾ, ദ്രവ്യനാശം (പന്ത്രണ്ടാം ഭാവം)",
            "subtitle": "നിങ്ങളുടെ പന്ത്രണ്ടാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
            "significance": "പന്ത്രണ്ടാം ഭാവം കൊണ്ട് ചിലവുകൾ, ദ്രവ്യനാശം, കഷ്ടനഷ്ടങ്ങൾ എന്നിവയെപ്പറ്റിയാണ് ചിന്തിക്കേണ്ടത്.",
            "prediction": "പന്ത്രണ്ടാം ഭാവാധിപൻ പന്ത്രണ്ടിൽ നിൽക്കുന്നതിനാൽ വർദ്ധിച്ച ചിലവുകൾ താങ്ങേണ്ടതായി വന്നാലും ശുഭകാര്യങ്ങൾക്കും ധർമ്മകാര്യങ്ങൾക്കുമായി പണം ചിലവഴിക്കും. വിദേശയാത്രകൾക്കും വിദേശവാസത്തിനും അനുകൂലമായ സാഹചര്യങ്ങൾ ഉണ്ടാകും. സാമ്പത്തിക അച്ചടക്കം പാലിക്കുന്നത് സുരക്ഷിതത്വം ഉറപ്പാക്കും. ജീവിതത്തിന്റെ ഉത്തരഘട്ടത്തിൽ ആത്മീയ ചിന്തകളും സമാധാനവും നിറയും.",
        },
    ],
}


GENDER_I18N: dict[str, dict[str, str]] = {
    "English": {"Male": "Male", "Female": "Female", "Other": "Other"},
    "Malayalam": {"Male": "പുരുഷൻ", "Female": "സ്ത്രീ", "Other": "മറ്റുള്ളവ"},
    "Hindi": {"Male": "पुरुष", "Female": "महिला", "Other": "अन्य"},
    "Tamil": {"Male": "ஆண்", "Female": "பெண்", "Other": "மற்றவை"},
}


TITHI_I18N: dict[str, dict[str, str]] = {
    "Prathama": {"English": "Prathama", "Malayalam": "പ്രഥമ", "Hindi": "प्रतिपदा", "Tamil": "பிரதமை"},
    "Dwitiya": {"English": "Dwitiya", "Malayalam": "ദ്വിതീയ", "Hindi": "द्वितीया", "Tamil": "துவிதியை"},
    "Tritiya": {"English": "Tritiya", "Malayalam": "തൃതീയ", "Hindi": "तृतीया", "Tamil": "திருதியை"},
    "Chaturthi": {"English": "Chaturthi", "Malayalam": "ചതുർത്ഥി", "Hindi": "चतुर्थी", "Tamil": "சதுர்த்தி"},
    "Panchami": {"English": "Panchami", "Malayalam": "പഞ്ചമി", "Hindi": "पंचमी", "Tamil": "பஞ்சமி"},
    "Shasthi": {"English": "Shasthi", "Malayalam": "ഷഷ്ഠി", "Hindi": "षष्ठी", "Tamil": "சஷ்டி"},
    "Saptami": {"English": "Saptami", "Malayalam": "സപ്തമി", "Hindi": "सप्तमी", "Tamil": "சப்தமி"},
    "Ashtami": {"English": "Ashtami", "Malayalam": "അഷ്ടമി", "Hindi": "अष्टमी", "Tamil": "அஷ்டமி"},
    "Navami": {"English": "Navami", "Malayalam": "നവമി", "Hindi": "नवमी", "Tamil": "நவமி"},
    "Dashami": {"English": "Dashami", "Malayalam": "ദശമി", "Hindi": "दशमी", "Tamil": "தசமி"},
    "Ekadashi": {"English": "Ekadashi", "Malayalam": "ഏകാദശി", "Hindi": "एकादशी", "Tamil": "ஏகாதசி"},
    "Dvadashi": {"English": "Dvadashi", "Malayalam": "ദ്വാദശി", "Hindi": "द्वादशी", "Tamil": "துவாதசி"},
    "Trayodashi": {"English": "Trayodashi", "Malayalam": "ത്രയോദശി", "Hindi": "त्रयोदशी", "Tamil": "திரயோதசி"},
    "Chaturdashi": {"English": "Chaturdashi", "Malayalam": "ചതുർദ്ദശി", "Hindi": "चतुर्दशी", "Tamil": "சதுர்த்தசி"},
    "Purnima": {"English": "Purnima", "Malayalam": "പൗർണ്ണമി", "Hindi": "पूर्णिमा", "Tamil": "பௌர்ணமி"},
    "Amavasya": {"English": "Amavasya", "Malayalam": "അമാവാസി", "Hindi": "अमावस्या", "Tamil": "அமாவாசை"},
}


PAKSHA_I18N: dict[str, dict[str, str]] = {
    "Shukla": {"English": "Shukla Paksha", "Malayalam": "ശുക്ലപക്ഷം", "Hindi": "शुक्ल पक्ष", "Tamil": "சுக்கில பட்சம்"},
    "Krishna": {"English": "Krishna Paksha", "Malayalam": "കൃഷ്ണപക്ഷം", "Hindi": "कृष्ण पक्ष", "Tamil": "கிருஷ்ண பட்சம்"},
}


MONTHS_I18N: dict[str, dict[int, str]] = {
    "English": {
        1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
        7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December",
    },
    "Malayalam": {
        1: "ജനുവരി", 2: "ഫെബ്രുവരി", 3: "മാർച്ച്", 4: "ഏപ്രിൽ", 5: "മെയ്", 6: "ജൂൺ",
        7: "ജൂലൈ", 8: "ആഗസ്റ്റ്", 9: "സെപ്റ്റംബർ", 10: "ഒക്ടോബർ", 11: "നവംബർ", 12: "ഡിസംബർ",
    },
    "Hindi": {
        1: "जनवरी", 2: "फरवरी", 3: "मार्च", 4: "अप्रैल", 5: "मई", 6: "जून",
        7: "जुलाई", 8: "अगस्त", 9: "सितंबर", 10: "अक्टूबर", 11: "नवंबर", 12: "दिसंबर",
    },
    "Tamil": {
        1: "ஜனவரி", 2: "பிப்ரவரி", 3: "மார்ச்", 4: "ஏப்ரல்", 5: "மே", 6: "ஜூன்",
        7: "ஜூலை", 8: "ஆகஸ்ட்", 9: "செப்டம்பர்", 10: "அக்டோபர்", 11: "நவம்பர்", 12: "டிசம்பர்",
    },
}


CHAPTER2_ITEMS_I18N: dict[str, dict[str, Any]] = {
    "English": {
        "item1_title": "Your Inherent Nature",
        "item1_sub": "Predictions based on day of birth ({day})",
        "item2_title": "Your Moral Principles & Values",
        "item2_sub": "Predictions based on birth star ({nakshatra})",
        "item2_text_tmpl": (
            "Your birth star is {nakshatra}. You place the highest value on truth, sincerity, and righteousness. "
            "You are ever willing to enforce discipline, curb wrongdoing, and champion just causes. "
            "You possess natural leadership authority. You excel in scholarship, literature, critique, science, and mathematics. "
            "You shine brilliantly in education, governance, banking, and investigative research. "
            "With persuasive diplomacy, you easily win over even severe detractors. You attain great affluence through knowledge.\n\n"
            "Sacred Star Associations for {nakshatra}: Gana - {ganam}, Yoni - {yoni}, Animal - {animal}, Bird - {bird}, Tree - {tree}, Element - {element}, Deity - {deity}.\n\n"
            "According to traditional scriptures, honoring and protecting these sacred elements while offering sincere devotions to the presiding deity bestows longevity, wealth, and abundant blessings."
        ),
        "item3_title": "Ethical Values",
        "item3_sub": "Predictions based on Tithi (Lunar Day): {tithi}",
        "item3_text_tmpl": (
            "Born in {tithi} tithi, courage in intellectual debate and analytical rigor are your key strengths. "
            "You possess extraordinary diplomatic tact to articulate matters effectively and adapt strategies as needed. "
            "This focused willpower empowers you to achieve high worldly and personal milestones."
        ),
        "item4_title": "Your Habits",
        "item4_sub": "Predictions based on Karana: {karana}",
        "item4_text_tmpl": (
            "Born under {karana} karana, you possess an appreciative mindset for fine arts, culture, and harmonious living. "
            "You continually cultivate your innate talents and show conscientious care toward personal health and well-being. "
            "Your inner nature remains pristine, kind-hearted, and honest."
        ),
        "item5_title": "Your Interests & Mindset",
        "item5_sub": "Predictions based on Nitya Yoga: {yoga}",
        "item5_text_tmpl": (
            "With {yoga} nitya yoga in your horoscope, you display distinguished dignity and natural gravitas. "
            "You never embark on important endeavors without thorough contemplation. You remain modest, confident that your work speaks for itself. "
            "Deep spiritual awareness and reverence for the divine provide you with steady inner fortitude."
        ),
        "item6_title": "Planetary Positions at Birth",
        "item6_sub": "Rashi Chart & Navamsha Chart",
        "item6_text_tmpl": "{nakshatra} {date_str} {time_str} Rashi\nBalance of Dasha at Birth = {lord} 1 year, 0 months, 13 days.",
    },
    "Malayalam": {
        "item1_title": "താങ്കളുടെ സ്വതസിദ്ധ പ്രകൃതം",
        "item1_sub": "നിങ്ങളുടെ ജനന ദിവസത്തെ (ആഴ്ച ) അടിസ്ഥാനമാക്കിയുള്ള ഫലങ്ങൾ ({day})",
        "item2_title": "താങ്കളുടെ ധാർമ്മിക തത്വങ്ങളും മൂല്യങ്ങളും",
        "item2_sub": "നിങ്ങളുടെ ജനന നക്ഷത്രത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനം ({nakshatra})",
        "item2_text_tmpl": (
            "{nakshatra}യാണ് ജന്മനക്ഷത്രം. സത്യത്തിനും, ആത്മാർത്ഥതയ്ക്കും വലിയ മുൻഗണന കൽപ്പിക്കുന്ന വ്യക്തിയായിരിക്കും. "
            "ശിക്ഷണം നൽകുന്നതിനും, അവിഹിതമായത് നിയന്ത്രിക്കുന്നതിനും, വേണ്ടിവന്നാൽ നശിപ്പിക്കുന്നതിനും സന്നദ്ധനായിരിക്കും. "
            "സ്വന്തം നേതൃത്വ ശക്തി വർദ്ധിപ്പിക്കുന്നതിൽ ജാഗരൂകനാണ്. ശാസ്ത്രം, സാഹിത്യം, നിരൂപണം, ഗണിതം മുതലായ വിഷയങ്ങളിൽ പ്രാപ്തനായിരിക്കും. "
            "ഒരിക്കൽ ചെയ്ത തെറ്റുകളോ, അപാകതകളോ വീണ്ടും ആവർത്തിക്കാതിരിക്കുവാൻ തക്കതായ നടപടികൾ അപ്പപ്പോൾ കരുതുകയില്ല. അതൊരു ന്യൂനതയായി പറയാതെ തരമില്ല. "
            "അധ്യാപകൻ എന്ന നിലയിൽ ശോഭിക്കും. ബാങ്കിങ്ങ്, ഗവേഷണ പ്രവർത്തനങ്ങളും യോജിച്ചത് തന്നെ. "
            "എത്ര ദേഷ്യപ്പെട്ടിരിക്കുന്നവരെയും അനുരഞ്ജന വാക്കുകൾ പറഞ്ഞ് സ്നേഹപൂർവ്വം തന്റെ പക്ഷത്തേക്ക് കൊണ്ടുവരുവാൻ കഴിയും. "
            "ആവശ്യമുള്ളപ്പോൾ ക്ഷോഭിക്കുകയും ഉടൻ തന്നെ ശാന്തനാവുകയും ചെയ്യും. വിദ്യാഭ്യാസം കൊണ്ട് ധനം നേടുമെന്ന് കാണുന്നതിനാൽ ഉദ്യോഗസ്ഥനാവുമെന്ന് പറയാം. "
            "പക്ഷേ ഏതുവിധേനയും പണം സമ്പാദിക്കണമെന്ന മോഹം ഉണ്ടാവുകയില്ല.\n\n"
            "{nakshatra} നക്ഷത്രത്തിന് ബാധകമായ മൃഗവൃക്ഷാദികൾ-- ഗണം - {ganam}, യോനി - {yoni}, മൃഗം - {animal}, പക്ഷി - {bird}, വൃക്ഷം - {tree}, ഭൂതം - {element}, ദേവത - {deity}.\n\n"
            "{nakshatra} നക്ഷത്രത്തിൽ ജനിക്കുകയാൽ ശാസ്ത്രവിധിപ്രകാരം മുകളിൽ പറയുന്ന പക്ഷിമൃഗാദികളെ ഉപദ്രവിക്കാതിരിക്കുകയും, വൃക്ഷത്തെ ഛേദിക്കുകയോ നശിപ്പിക്കുകയോ ചെയ്യാതെ വേണ്ടതുപോലെ സംരക്ഷിക്കുകയും, ഭൂത ദേവതകളെ ഭക്തിയോടെ ഉപാസിക്കുകയും ചെയ്താൽ ആയുസ്സും സമ്പത്തും ഐശ്വര്യങ്ങളും വർദ്ധിക്കും."
        ),
        "item3_title": "സദാചാര മൂല്യങ്ങൾ",
        "item3_sub": "നിങ്ങളുടെ തിഥിയെ (ചാന്ദ്ര ദിനം) അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനം : {tithi}",
        "item3_text_tmpl": (
            "{tithi} തിഥിയിൽ ജനനം. തർക്കവും എതിർപ്പും ഒരു തനതു സ്വഭാവമായി കണക്കാക്കാം. "
            "സ്വന്തം ഉയർച്ചയ്ക്കുവേണ്ടി കാര്യങ്ങൾ നയപരമായി അവതരിപ്പിക്കുന്നതിനും, ആവശ്യാനുസരണം രൂപാന്തരപ്പെടുത്തി സമർത്ഥിക്കുന്നതിനുമുള്ള കഴിവ് അപാരമാണ്. "
            "ലക്ഷ്യബോധത്തോടെ മുന്നേറാൻ ഈ ഇച്ഛാശക്തി സഹായിക്കും."
        ),
        "item4_title": "താങ്കളുടെ ശീലങ്ങൾ",
        "item4_sub": "നിങ്ങളുടെ കരണത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനം : {karana}",
        "item4_text_tmpl": (
            "പശുക്കരണത്തിൽ ({karana}) പിറന്നതിനാൽ കലാപരമായ സൃഷ്ടികളെ അംഗീകരിക്കാനുള്ള മനസ്ഥിതി ഉണ്ടായിരിക്കും. "
            "സ്വന്തം കഴിവുകളെ പരമാവധി പ്രയോജനപ്പെടുത്താൻ ശ്രമിക്കും. ആരോഗ്യസ്ഥിതിയിൽ വരുന്ന ചെറിയ മാറ്റങ്ങളെപ്പോലും ശ്രദ്ധയോടെ നോക്കിക്കാണുകയും മുൻകരുതലുകൾ എടുക്കുകയും ചെയ്യും. "
            "എന്നിരുന്നാലും മനസ്സിനുള്ളിൽ നിർമ്മലമായ സ്നേഹവും സത്യസന്ധതയും കാത്തുസൂക്ഷിക്കും."
        ),
        "item5_title": "താങ്കളുടെ താല്പര്യങ്ങൾ",
        "item5_sub": "നിങ്ങളുടെ നിത്യയോഗയെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനം : {yoga}",
        "item5_text_tmpl": (
            "{yoga} നിത്യയോഗം ജാതകത്തിൽ കാണുന്നു. മറ്റുള്ളവരാൽ ശ്രദ്ധിക്കപ്പെടുന്ന ഗാംഭീര്യം. "
            "പര്യാലോചനയില്ലാതെ ഒരുകാര്യത്തിലും ഏർപ്പെടുകയില്ല. സ്വത്തും കഴിവുകളും ആരുടെ മുമ്പിലും പ്രദർശിപ്പിക്കേണ്ടതില്ലെന്നും, "
            "മറ്റുളളവർ സ്വയം ശ്രദ്ധിച്ചുകൊള്ളുമെന്നും ഉറപ്പായിരിക്കും. സർവ്വശക്തനെക്കുറിച്ചുള്ള ബോധം താനേ പ്രകടമാകും. "
            "അവിടെ ശരണം പ്രാപിക്കുകയും ചെയ്യും. ആത്മധൈര്യത്തിന് ഇത് സഹായകരമായിത്തീരും."
        ),
        "item6_title": "ജനന സമയത്തെ ഗ്രഹ സ്ഥാനം",
        "item6_sub": "രാശി ചാർട്ട് & നവാംശ ചാർട്ട്",
        "item6_text_tmpl": "{nakshatra} {date_str} {time_str} രാശി\nജന്മ ശിഷ്ടദശ = {lord} 1 വർഷം, 0 മാസം, 13 ദിവസം.",
    },
    "Hindi": {
        "item1_title": "आपका स्वाभाविक स्वभाव",
        "item1_sub": "जन्म वार ({day}) पर आधारित फल",
        "item2_title": "आपके नैतिक सिद्धांत एवं जीवन मूल्य",
        "item2_sub": "जन्म नक्षत्र ({nakshatra}) पर आधारित फल",
        "item2_text_tmpl": (
            "आपका जन्म नक्षत्र {nakshatra} है। आप सत्य, निष्ठा और धर्म को जीवन में सर्वोच्च प्राथमिकता देते हैं। "
            "अनुशासन बनाए रखने और अनुचित प्रवृत्तियों का विरोध करने में आप सदैव तत्पर रहते हैं। "
            "आप में स्वाभाविक नेतृत्व शक्ति और विद्वता है। साहित्य, विज्ञान, गणित और प्रशासनिक विषयों में विशेष योग्यता होगी। "
            "शिक्षा, बैंकिंग, परामर्श और अनुसंधान के क्षेत्र में आप विशेष ख्याति अर्जित करेंगे। "
            "विवादों को प्रेमपूर्ण संवाद से सुलझाने की अद्भुत कला आप में है। ज्ञान और विद्या से उच्च पद और संपन्नता प्राप्त करेंगे।\n\n"
            "{nakshatra} नक्षत्र के आराध्य तत्व: गण - {ganam}, योनि - {yoni}, पशु - {animal}, पक्षी - {bird}, वृक्ष - {tree}, तत्व - {element}, देवता - {deity}।\n\n"
            "शास्त्रों के अनुसार इन पवित्र तत्वों का सम्मान करने तथा इष्ट देव की उपासना करने से दीर्घायु, धन और यश की वृद्धि होती है।"
        ),
        "item3_title": "सदाचार एवं दृष्टिकोण",
        "item3_sub": "जन्म तिथि ({tithi}) पर आधारित फल",
        "item3_text_tmpl": (
            "{tithi} तिथि में जन्म होने से तर्क और यथार्थवादी दृष्टिकोण आपका मुख्य स्वभाव होगा। "
            "अपने विचारों को प्रभावशाली ढंग से प्रस्तुत करने और परिस्थितियों के अनुसार नीति निर्धारित करने में आप प्रवीण हैं। "
            "यह दृढ संकल्प आपको जीवन में निरंतर उन्नति दिलाएगा।"
        ),
        "item4_title": "आपकी आदतें एवं आचरण",
        "item4_sub": "करण ({karana}) पर आधारित फल",
        "item4_text_tmpl": (
            "{karana} करण में जन्म होने से कला, संस्कृति और रचनात्मक कार्यों के प्रति विशेष रुचि रहेगी। "
            "आप अपनी योग्यताओं का सदुपयोग करने का निरंतर प्रयास करेंगे तथा स्वास्थ्य के प्रति जागरूक रहेंगे। "
            "आपका हृदय सरल, प्रेमपूर्ण और सत्यनिष्ठ रहेगा।"
        ),
        "item5_title": "आपकी रुचियां एवं मानसिक स्थिति",
        "item5_sub": "नित्य योग ({yoga}) पर आधारित फल",
        "item5_text_tmpl": (
            "आपकी कुंडली में {yoga} नित्य योग है। आपके व्यक्तित्व में स्वाभाविक तेज और गरिमा होगी। "
            "गहन विचार-विमर्श के बिना कोई कार्य नहीं करेंगे। ईश्वरीय सत्ता पर प्रगाढ़ विश्वास आपको हर परिस्थिति में आत्मबल प्रदान करेगा।"
        ),
        "item6_title": "जन्म समय ग्रह स्थिति",
        "item6_sub": "राशि चक्र एवं नवांश चक्र",
        "item6_text_tmpl": "{nakshatra} {date_str} {time_str} राशि\nजन्म भुक्त दशा = {lord} 1 वर्ष, 0 माह, 13 दिन।",
    },
    "Tamil": {
        "item1_title": "உங்கள் இயல்பான குணம்",
        "item1_sub": "பிறந்த கிழமை ({day}) அடிப்படையிலான பலன்கள்",
        "item2_title": "உங்கள் தார்மீக கொள்கைகள் மற்றும் நற்பண்புகள்",
        "item2_sub": "பிறந்த நட்சத்திரம் ({nakshatra}) அடிப்படையிலான பலன்கள்",
        "item2_text_tmpl": (
            "உங்கள் ஜென்ம நட்சத்திரம் {nakshatra}. உண்மைக்கும் நேர்மைக்கும் நீங்கள் முதலிடம் அளிப்பீர்கள். "
            "ஒழுக்க நெறிகளைப் பாதுகாப்பதிலும், அநீதியை எதிர்ப்பதிலும் தயங்கமாட்டீர்கள். "
            "இயற்கையிலேயே சிறந்த தலைமைப் பண்பும் நுண்ணறிவும் கொண்டிருப்பீர்கள். அறிவியல், இலக்கியம், கணிதம் மற்றும் மேலாண்மைத் துறைகளில் சிறந்து விளங்குவீர்கள். "
            "ஆசிரியப் பணி, வங்கி, நிதி மற்றும் ஆராய்ச்சித் துறைகள் உங்களுக்கு மிகவும் ஏற்றவை. "
            "சமாதானப் பேச்சினால் எதிரிகளையும் நண்பர்களாக்கும் ஆற்றல் உண்டு. கல்வி அறிவினால் பெரும் செல்வமும் புகழும் ஈட்டுவீர்கள்.\n\n"
            "{nakshatra} நட்சத்திரத்திற்குரிய புனித அம்சங்கள்: கணம் - {ganam}, யோனி - {yoni}, மிருகம் - {animal}, பறவை - {bird}, மரம் - {tree}, பூதம் - {element}, தெய்வம் - {deity}.\n\n"
            "சாஸ்திர முறைப்படி இந்த அம்சங்களை மதித்து, இஷ்ட தெய்வத்தை பக்தி பூர்வமாக வழிபட்டு வர ஆயுளும், செல்வமும், நல்வாழ்வும் பெருகும்."
        ),
        "item3_title": "ஒழுக்க நெறிமுறைகள்",
        "item3_sub": "பிறந்த திதி ({tithi}) அடிப்படையிலான பலன்கள்",
        "item3_text_tmpl": (
            "{tithi} திதியில் பிறந்ததால் விவாதத் திறமையும் எதார்த்தமான சிந்தனையும் இயல்பாக இருக்கும். "
            "காரியங்களை சாதுரியமாக கையாண்டு வெற்றி பெறும் ஆற்றல் உண்டு. "
            "உறுதியான மனோபலம் உங்கள் லட்சியங்களை அடைய உதவும்."
        ),
        "item4_title": "உங்கள் பழக்கவழக்கங்கள்",
        "item4_sub": "கரணம் ({karana}) அடிப்படையிலான பலன்கள்",
        "item4_text_tmpl": (
            "{karana} கரணத்தில் பிறந்ததால் கலை மற்றும் இலக்கியத்தின் மீது ஆர்வம் இருக்கும். "
            "சுய திறமைகளை மெருகேற்றி உழைப்பீர்கள். உடல் ஆரோக்கியத்தில் கூடுதல் கவனம் செலுத்துவீர்கள். "
            "உள்ளத்தில் தூய அன்பையும் நேர்மையையும் பேணிப் பாதுகாப்பீர்கள்."
        ),
        "item5_title": "உங்கள் ஆர்வங்கள் மற்றும் மனநிலை",
        "item5_sub": "நித்ய யோகம் ({yoga}) அடிப்படையிலான பலன்கள்",
        "item5_text_tmpl": (
            "{yoga} நித்ய யோகத்தில் பிறந்ததால் மற்றவர்கள் மதிக்கும் கம்பீரமான தோற்றமும் நிதானமும் இருக்கும். "
            "தீர்க்கமாக யோசித்த பின்னரே முக்கிய முடிவுகளை எடுப்பீர்கள். இறை நம்பிக்கை உங்கள் மனதிற்கு அளவற்ற தைரியத்தையும் பலத்தையும் அளிக்கும்."
        ),
        "item6_title": "பிறந்த நேர கிரக நிலைகள்",
        "item6_sub": "ராசி சக்கரம் & நவாம்ச சக்கரம்",
        "item6_text_tmpl": "{nakshatra} {date_str} {time_str} ராசி\nபிறப்பு இருப்பு தசா = {lord} 1 வருடம், 0 மாதம், 13 நாள்.",
    },
}


CAREER_TIMELINE_I18N: dict[str, dict[str, Any]] = {
    "English": {
        "title": "Favorable Career Timings",
        "subtitle": "Analysis covering ages 15 to 80",
        "significance": (
            "Considering the lords of Houses 2, 9, 10, and 11, Jupiter's aspect on the Ascendant and 11th House, "
            "Dasha / Antardasha periods, and other relevant astrological factors, the following career timeline is derived:"
        ),
        "statuses": {
            "low": "Low Favorable",
            "favorable": "Favorable",
            "neutral": "Normal",
            "excellent": "Excellent",
        },
        "age_text": "Age {start} to {end}",
        "duration_text": "Duration: {dur}",
        "from_to_text": "{start_date} to {end_date}",
    },
    "Malayalam": {
        "title": "കർമ്മ മേഖലയ്ക്ക് അനുകൂല സമയങ്ങൾ",
        "subtitle": "15 വയസ്സ് മുതൽ 80 വയസ്സ് വരെയുള്ള അപഗ്രഥനം",
        "significance": (
            "രണ്ട്, ഒൻപത്, പത്ത്, പതിനൊന്ന് ഭാവാധിപന്മാരെ പരിഗണിച്ചും, "
            "ലഗ്നത്തിലേയ്ക്കും പതിനൊന്നാം ഭാവത്തിലേയ്ക്കുമുള്ള ഗുരു ദൃഷ്ടി, ദശ/ അന്തർദശ കാലഘട്ടം, "
            "കൂടാതെ മറ്റു പ്രസക്തമായ ഘടകങ്ങൾ എന്നിവ കണക്കിലെടുത്ത് കർമ്മ മേഖലയെ കുറിച്ച് ഇനിപ്പറയുന്ന നിഗമനങ്ങളിൽ എത്തിച്ചേരാം"
        ),
        "statuses": {
            "low": "കുറഞ്ഞ അനുകൂലം",
            "favorable": "അനുകൂലം",
            "neutral": "സാധാരണ",
            "excellent": "ഉത്തമം",
        },
        "age_text": "വയസ്സ് {start} മുതൽ {end} വരെ",
        "duration_text": "കാലാവധി: {dur}",
        "from_to_text": "{start_date} മുതൽ {end_date} വരെ",
    },
    "Hindi": {
        "title": "करियर के लिए अनुकूल समय",
        "subtitle": "15 वर्ष से 80 वर्ष तक का विश्लेषण",
        "significance": (
            "द्वितीय, नवम, दशम और एकादश भाव के स्वामियों, लग्न और एकादश भाव पर देवगुरु बृहस्पति की दृष्टि, "
            "दशा/अंतर्दशा काल तथा अन्य महत्वपूर्ण ज्योतिषीय कारकों को ध्यान में रखते हुए करियर के लिए निम्नलिखित निष्कर्ष प्राप्त होते हैं:"
        ),
        "statuses": {
            "low": "कम अनुकूल",
            "favorable": "अनुकूल",
            "neutral": "सामान्य",
            "excellent": "उत्कृष्ट",
        },
        "age_text": "आयु {start} से {end} तक",
        "duration_text": "अवधि: {dur}",
        "from_to_text": "{start_date} से {end_date} तक",
    },
    "Tamil": {
        "title": "தொழிலுக்கு சாதகமான காலங்கள்",
        "subtitle": "15 வயது முதல் 80 வயது வரையிலான பகுப்பாய்வு",
        "significance": (
            "2, 9, 10, 11-ஆம் பாவாதிபதிகள், லக்னம் மற்றும் 11-ஆம் பாவத்தின் மீதான குரு பார்வை, "
            "தசா/புக்தி காலங்கள் மற்றும் இதர முக்கிய ஜோதிட அமைப்புகளைக் கருத்தில் கொண்டு தொழில் தொடர்பான கணிப்புகள்:"
        ),
        "statuses": {
            "low": "குறைந்த சாதகம்",
            "favorable": "சாதகமானது",
            "neutral": "சராசரி",
            "excellent": "மிகவும் உத்தமம்",
        },
        "age_text": "வயது {start} முதல் {end} வரை",
        "duration_text": "கால அளவு: {dur}",
        "from_to_text": "{start_date} முதல் {end_date} வரை",
    },
}


SUBTABLES_CONFIG: dict[str, dict[str, Any]] = {
    "English": {
        "t1_title": "Birth Details",
        "t1_name": "Name",
        "t1_gender": "Gender",
        "t1_dob": "Date of Birth",
        "t1_kollavarsham": "Kollavarsham Date",
        "t1_tob": "Time of Birth (Hr.Min.Sec)",
        "t1_tz": "Time Zone (Hrs.Mins)",
        "t1_pob": "Place of Birth",
        "t1_long_lat": "Longitude & Latitude",
        "t1_ayanamsa": "Ayanamsa",
        "t1_star_pada": "Birth Star & Pada",
        "t1_star_note_tmpl": (
            "Your birth star would have been {prev_star}, if you were born 5 minutes before. This is as per Chitra Paksha calculation.\n"
            "Note: In case you misunderstood your Star sign so far, going forward you may consider {curr_star} as your Star sign."
        ),
        "t1_moon_sign_lord": "Moon Sign & Lord",
        "t1_asc_sign_lord": "Ascendant & Lord",
        "t1_tithi": "Tithi",
        "t1_east": "East",
        "t1_north": "North",
        "t1_deg": "deg.",
        "t1_min": "min.",
        "t1_sec": "sec.",
        "t1_chitra_paksha": "Chitra Paksha",
        "t1_standard_time": "Standard Time",
        "t1_east_greenwich": "East of Greenwich",

        "t2_title": "Sunrise, Sunset & Ephemeris Details",
        "t2_sunrise": "Sunrise",
        "t2_sunset": "Sunset",
        "t2_day_length_hrs": "Day Length (Hrs.Mins)",
        "t2_day_length_ghati": "Day Length (Nazhika.Vinazhika)",
        "t2_lmt": "Local Mean Time",
        "t2_vedic_day": "Astrological Day of Birth",
        "t2_kali_day": "Kali Dina Number",
        "t2_dasha_system": "Dasha System",
        "t2_dasha_val": "Vimshottari, Year = 365.25 Days",

        "t3_title": "Nakshatra Attributes",
        "t3_star_lord": "Star Lord",
        "t3_ganam_yoni_animal": "Ganam, Yoni, Animal",
        "t3_ganam_yoni_animal_val": "Manushya, Male, Man",
        "t3_bird_tree": "Bird, Tree",
        "t3_bird_tree_val": "Peacock, Mango Tree",
        "t3_chandra_avastha": "Chandra Avastha",
        "t3_chandra_vela": "Chandra Vela",
        "t3_chandra_kriya": "Chandra Kriya",
        "t3_dagdha_rashi": "Dagdha Rashi",
        "t3_dagdha_rashi_val": "Taurus, Aquarius",
        "t3_karana": "Karana",
        "t3_nitya_yoga": "Nitya Yoga",
        "t3_sun_star": "Sun Sign - Star Longitude",
        "t3_angadityan": "Angadityan",
        "t3_angadityan_val": "Face (Mukham)",
        "t3_western_sign": "Zodiac sign (Western System)",

        "t4_title": "Yogi, Karaka & Arudha Details",
        "t4_yogi_point_star": "Yogi Point - Yogi Star",
        "t4_yogi_planet": "Yogi Planet",
        "t4_saha_yogi": "Saha Yogi",
        "t4_avayogi": "Avayogi Star - Planet",
        "t4_atmakaraka": "Atmakaraka - Karakamsha",
        "t4_amatyakaraka": "Amatyakaraka (Mind / Intellect)",
        "t4_lagna_arudha": "Lagna Arudha",
        "t4_dhana_arudha": "Dhana Arudha",
    },
    "Malayalam": {
        "t1_title": "ജനന വിശദാംശങ്ങൾ",
        "t1_name": "പേര്",
        "t1_gender": "ലിംഗം",
        "t1_dob": "ജനന തീയതി",
        "t1_kollavarsham": "കൊല്ലവർഷ തീയതി",
        "t1_tob": "ജനന സമയം (Hr.Min.Sec)",
        "t1_tz": "സമയ മേഖല (Hrs.Mins)",
        "t1_pob": "ജനന സ്ഥലം",
        "t1_long_lat": "രേഖാംശം & അക്ഷാംശം",
        "t1_ayanamsa": "അയനാംശം",
        "t1_star_pada": "ജന്മനക്ഷത്രം നക്ഷത്ര പാദം",
        "t1_star_note_tmpl": (
            "Your birth star would have been {prev_star}, if you were born 5 minutes before. This is as per Chitra Paksha calculation.\n"
            "Note: In case you misunderstood your Star sign so far, going forward you may consider {curr_star} as your Star sign."
        ),
        "t1_moon_sign_lord": "ജന്മരാശി രാശ്യാധിപൻ",
        "t1_asc_sign_lord": "ലഗ്നം ലഗ്നാധിപൻ",
        "t1_tithi": "തിഥി",
        "t1_east": "കിഴക്ക്",
        "t1_north": "വടക്ക്",
        "t1_deg": "ഡി.",
        "t1_min": "മി.",
        "t1_sec": "സെ.",
        "t1_chitra_paksha": "ചിത്രപക്ഷ",
        "t1_standard_time": "Standard Time",
        "t1_east_greenwich": "ഗ്രീനിച്ചിനു കിഴക്ക്",

        "t2_title": "സൂര്യോദയം, കലിദിന വിവരങ്ങൾ",
        "t2_sunrise": "ഉദയം",
        "t2_sunset": "അസ്തമയം",
        "t2_day_length_hrs": "ദിനമാനം (Hrs.Mins)",
        "t2_day_length_ghati": "ദിനമാനം (Nazhika.Vinazhika)",
        "t2_lmt": "പ്രാദേശിക സമയം",
        "t2_vedic_day": "ജ്യോതിഷപ്രകാരമുള്ള ജനന ദിവസം",
        "t2_kali_day": "കലിദിനസംഖ്യ",
        "t2_dasha_system": "ദശാരീതി",
        "t2_dasha_val": "വിംശോത്തരി, വർഷം = 365.25 ദിവസം",

        "t3_title": "നക്ഷത്ര ഗുണങ്ങൾ",
        "t3_star_lord": "നക്ഷത്രാധിപൻ",
        "t3_ganam_yoni_animal": "ഗണം, യോനി, മൃഗം",
        "t3_ganam_yoni_animal_val": "മാനുഷം, പുരുഷൻ, നരൻ",
        "t3_bird_tree": "പക്ഷി, വൃക്ഷം",
        "t3_bird_tree_val": "മയിൽ, തേന്മാവ്",
        "t3_chandra_avastha": "ചന്ദ്രാവസ്ഥ",
        "t3_chandra_vela": "ചന്ദ്രവേള",
        "t3_chandra_kriya": "ചന്ദ്രകിയ",
        "t3_dagdha_rashi": "ഭഗ്ദരാശി",
        "t3_dagdha_rashi_val": "ഇടവം, കുംഭം",
        "t3_karana": "കരണം",
        "t3_nitya_yoga": "നിത്യയോഗം",
        "t3_sun_star": "സൂര്യ രാശി - നക്ഷത്രസ്ഫുടം",
        "t3_angadityan": "അംഗാദിത്യൻ",
        "t3_angadityan_val": "മുഖം",
        "t3_western_sign": "Zodiac sign (Western System)",

        "t4_title": "യോഗി, കാരക, ആരൂഡ വിവരങ്ങൾ",
        "t4_yogi_point_star": "യോഗി ബിന്ദു - യോഗി നക്ഷത്രം",
        "t4_yogi_planet": "യോഗി ഗ്രഹം",
        "t4_saha_yogi": "അപരയോഗി",
        "t4_avayogi": "അവയോഗി നക്ഷത്രം - ഗ്രഹം",
        "t4_atmakaraka": "ആത്മകാരകൻ - കാരകാംശം",
        "t4_amatyakaraka": "അമത്യകാരകൻ (ബുദ്ധി / മനസ്സ്)",
        "t4_lagna_arudha": "ലഗ്നാരൂഡം",
        "t4_dhana_arudha": "ധനാരൂഡം",
    },
    "Hindi": {
        "t1_title": "जन्म विवरण",
        "t1_name": "नाम",
        "t1_gender": "लिंग",
        "t1_dob": "जन्म तिथि",
        "t1_kollavarsham": "कोल्लवर्षम तिथि",
        "t1_tob": "जन्म समय (घंटे.मिनट.सेकंड)",
        "t1_tz": "समय क्षेत्र (घंटे.मिनट)",
        "t1_pob": "जन्म स्थान",
        "t1_long_lat": "देशांतर एवं अक्षांश",
        "t1_ayanamsa": "अयनांश",
        "t1_star_pada": "जन्म नक्षत्र एवं पद",
        "t1_star_note_tmpl": (
            "यदि आपका जन्म 5 मिनट पूर्व हुआ होता तो आपका नक्षत्र {prev_star} होता। यह चित्रा पक्ष गणना के अनुसार है।\n"
            "विशेष: यदि अब तक आपने नक्षत्र को अन्यथा समझा हो, तो भविष्य में {curr_star} को अपना नक्षत्र मानें।"
        ),
        "t1_moon_sign_lord": "जन्म राशि एवं स्वामी",
        "t1_asc_sign_lord": "लग्न एवं लग्नेश",
        "t1_tithi": "तिथि",
        "t1_east": "पूर्व",
        "t1_north": "उत्तर",
        "t1_deg": "अंश",
        "t1_min": "कला",
        "t1_sec": "विकला",
        "t1_chitra_paksha": "चित्रा पक्ष",
        "t1_standard_time": "मानक समय (Standard Time)",
        "t1_east_greenwich": "ग्रीनविच से पूर्व",

        "t2_title": "सूर्योदय, सूर्यास्त एवं पंचांग विवरण",
        "t2_sunrise": "सूर्योदय",
        "t2_sunset": "सूर्यास्त",
        "t2_day_length_hrs": "दिनमान (घंटे.मिनट)",
        "t2_day_length_ghati": "दिनमान (घटी.विघटी)",
        "t2_lmt": "स्थानीय समय (LMT)",
        "t2_vedic_day": "ज्योतिषीय जन्म वार",
        "t2_kali_day": "कलिदिन संख्या",
        "t2_dasha_system": "दशा पद्धति",
        "t2_dasha_val": "विंशोत्तरी, वर्ष = 365.25 दिन",

        "t3_title": "नक्षत्र गुण एवं विशेषताएं",
        "t3_star_lord": "नक्षत्र स्वामी",
        "t3_ganam_yoni_animal": "गण, योनि, पशु",
        "t3_ganam_yoni_animal_val": "मनुष्य, पुरुष, नर",
        "t3_bird_tree": "पक्षी, वृक्ष",
        "t3_bird_tree_val": "मयूर, आम का वृक्ष",
        "t3_chandra_avastha": "चंद्रावस्था",
        "t3_chandra_vela": "चंद्रवेला",
        "t3_chandra_kriya": "चंद्रक्रिया",
        "t3_dagdha_rashi": "दग्ध राशि",
        "t3_dagdha_rashi_val": "वृषभ, कुंभ",
        "t3_karana": "करण",
        "t3_nitya_yoga": "नित्य योग",
        "t3_sun_star": "सूर्य राशि - नक्षत्र",
        "t3_angadityan": "अंगादित्य",
        "t3_angadityan_val": "मुख",
        "t3_western_sign": "पाश्चात्य राशि (Western System)",

        "t4_title": "योगी, कारक एवं आरूढ़ विवरण",
        "t4_yogi_point_star": "योगी बिंदु - योगी नक्षत्र",
        "t4_yogi_planet": "योगी ग्रह",
        "t4_saha_yogi": "सह-योगी",
        "t4_avayogi": "अवयोगी नक्षत्र - ग्रह",
        "t4_atmakaraka": "आत्मकारक - कारकांश",
        "t4_amatyakaraka": "अमात्यकारक (बुद्धि / मन)",
        "t4_lagna_arudha": "लग्नांश आरूढ़",
        "t4_dhana_arudha": "धनांश आरूढ़",
    },
    "Tamil": {
        "t1_title": "பிறப்பு விவரங்கள்",
        "t1_name": "பெயர்",
        "t1_gender": "பாலினம்",
        "t1_dob": "பிறந்த தேதி",
        "t1_kollavarsham": "கொல்லவர்ஷம் தேதி",
        "t1_tob": "பிறந்த நேரம் (மணி.நிமி.நொடி)",
        "t1_tz": "நேர மண்டலம்",
        "t1_pob": "பிறந்த இடம்",
        "t1_long_lat": "தீர்க்கரேகை & அட்சரேகை",
        "t1_ayanamsa": "அயனாம்சம்",
        "t1_star_pada": "ஜென்ம நட்சத்திரம் & பாதம்",
        "t1_star_note_tmpl": (
            "உங்கள் பிறப்பு 5 நிமிடங்களுக்கு முன் நிகழ்ந்திருந்தால், உங்கள் நட்சத்திரம் {prev_star} ஆகியிருக்கும்.\n"
            "குறிப்பு: இதுவரை நட்சத்திரத்தில் ஏதேனும் குழப்பம் இருந்திருந்தால், இனி {curr_star} என்பதை உங்கள் நட்சத்திரமாகக் கருதலாம்."
        ),
        "t1_moon_sign_lord": "ஜென்ம ராசி & ராசிநாதன்",
        "t1_asc_sign_lord": "லக்னம் & லக்னாதிபதி",
        "t1_tithi": "திதி",
        "t1_east": "கிழக்கு",
        "t1_north": "வடக்கு",
        "t1_deg": "பாகை",
        "t1_min": "கலை",
        "t1_sec": "விகலை",
        "t1_chitra_paksha": "சித்ர பக்ஷம்",
        "t1_standard_time": "திட்ட நேரம் (Standard Time)",
        "t1_east_greenwich": "கிரீன்விச்சிற்கு கிழக்கு",

        "t2_title": "சூரிய உதயம் & பஞ்சாங்க விவரங்கள்",
        "t2_sunrise": "சூரிய உதயம்",
        "t2_sunset": "சூரிய அஸ்தமனம்",
        "t2_day_length_hrs": "பகல் அளவு (மணி.நிமி)",
        "t2_day_length_ghati": "பகல் அளவு (நாழிகை.விநாழிகை)",
        "t2_lmt": "உள்ளூர் நேரம் (LMT)",
        "t2_vedic_day": "ஜோதிடப் பிறப்பு நாள்",
        "t2_kali_day": "கலிதின எண்",
        "t2_dasha_system": "தசா முறை",
        "t2_dasha_val": "விம்சோத்தரி, ஆண்டு = 365.25 நாட்கள்",

        "t3_title": "நட்சத்திர பண்புகள்",
        "t3_star_lord": "நட்சத்திராதிபதி",
        "t3_ganam_yoni_animal": "கணம், யோனி, மிருகம்",
        "t3_ganam_yoni_animal_val": "மானிட கணம், ஆண், மனிதன்",
        "t3_bird_tree": "பறவை, மரம்",
        "t3_bird_tree_val": "மயில், மாமரம்",
        "t3_chandra_avastha": "சந்திர அவஸ்தை",
        "t3_chandra_vela": "சந்திர வேளை",
        "t3_chandra_kriya": "சந்திர கிரியை",
        "t3_dagdha_rashi": "தக்த ராசி",
        "t3_dagdha_rashi_val": "ரிஷபம், கும்பம்",
        "t3_karana": "கரணம்",
        "t3_nitya_yoga": "நித்ய யோகம்",
        "t3_sun_star": "சூரிய ராசி - நட்சத்திரம்",
        "t3_angadityan": "அங்காதித்யன்",
        "t3_angadityan_val": "முகம்",
        "t3_western_sign": "மேற்கத்திய ராசி (Western System)",

        "t4_title": "யோகி, காரகர் மற்றும் ஆரூட விவரங்கள்",
        "t4_yogi_point_star": "யோகி புள்ளி - யோகி நட்சத்திரம்",
        "t4_yogi_planet": "யோகி கிரகம்",
        "t4_saha_yogi": "சக யோகி",
        "t4_avayogi": "அவயோகி நட்சத்திரம் - கிரகம்",
        "t4_atmakaraka": "ஆத்மகாரகர் - காரகாம்சம்",
        "t4_amatyakaraka": "அமாத்யகாரகர் (புத்தி / மனம்)",
        "t4_lagna_arudha": "லக்ன ஆரூடம்",
        "t4_dhana_arudha": "தன ஆரூடம்",
    },
}

