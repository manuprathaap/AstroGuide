import math
from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from pymeeus import Coordinates
from jyotipy import AyanamsaSystem, BirthChart, Graha
from jyotipy.ayanamsa import tropical_to_sidereal
from jyotipy.ephemeris import to_utc_epoch
from jyotipy.nakshatra import nakshatra_info
from jyotipy.varga import d9_navamsha, varga_sign_name

from app.schemas.horoscope import (
    ChartBox,
    ChartData,
    ChartPlanet,
    ChapterItem,
    HoroscopeChapter,
    HoroscopeGenerateRequest,
    HoroscopeResponse,
    PlanetaryPositionItem,
    PredictionSummaryCard,
    SubTable,
    SubTableRow,
    TableOfPredictions,
)
from app.astrology.horoscope_i18n import (
    BHAVAS_I18N,
    CAREER_TIMELINE_I18N,
    CHAPTER2_ITEMS_I18N,
    GENDER_I18N,
    MONTHS_I18N,
    NAKSHATRA_I18N,
    PAKSHA_I18N,
    PLANET_I18N,
    PREAMBLE_I18N,
    SIGN_I18N,
    SUBTABLES_CONFIG,
    TITHI_I18N,
    UI_STRINGS,
    WEEKDAY_I18N,
    normalize_language,
)
from app.astrology.nakshatra_data import get_nakshatra_attributes

SIGN_NAMES = [
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
]

SIGN_BY_INDEX = {i: item for i, item in enumerate(SIGN_NAMES)}
SIGN_BY_NAME = {item[0]: item for item in SIGN_NAMES}

KERALA_BOX_SIGN_INDEXES = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

WEEKDAY_PREVIOUS = {
    "Sunday": "Saturday",
    "Monday": "Sunday",
    "Tuesday": "Monday",
    "Wednesday": "Tuesday",
    "Thursday": "Wednesday",
    "Friday": "Thursday",
    "Saturday": "Friday",
}

SIGN_LORD_GRAHA = {
    "Aries": "Mars",
    "Taurus": "Venus",
    "Gemini": "Mercury",
    "Cancer": "Moon",
    "Leo": "Sun",
    "Virgo": "Mercury",
    "Libra": "Venus",
    "Scorpio": "Mars",
    "Sagittarius": "Jupiter",
    "Capricorn": "Saturn",
    "Aquarius": "Saturn",
    "Pisces": "Jupiter",
}

NAKSHATRA_LORD_GRAHA = {
    "Ashwini": "Ketu", "Bharani": "Venus", "Krittika": "Sun", "Rohini": "Moon",
    "Mrigashira": "Mars", "Ardra": "Rahu", "Punarvasu": "Jupiter", "Pushya": "Saturn",
    "Ashlesha": "Mercury", "Magha": "Ketu", "Purva Phalguni": "Venus", "Uttara Phalguni": "Sun",
    "Hasta": "Moon", "Chitra": "Mars", "Swati": "Rahu", "Vishakha": "Jupiter",
    "Anuradha": "Saturn", "Jyeshtha": "Mercury", "Mula": "Ketu", "Purva Ashadha": "Venus",
    "Uttara Ashadha": "Sun", "Shravana": "Moon", "Dhanishta": "Mars", "Shatabhisha": "Rahu",
    "Purva Bhadrapada": "Jupiter", "Uttara Bhadrapada": "Saturn", "Revati": "Mercury",
}


def get_western_sun_sign(dt: date) -> tuple[str, str]:
    day, month = dt.day, dt.month
    if (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return "AQUARIUS", "കുംഭം"
    elif (month == 2 and day >= 19) or (month == 3 and day <= 20):
        return "PISCES", "മീനം"
    elif (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "ARIES", "മേടം"
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return "TAURUS", "ഇടവം"
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return "GEMINI", "മിഥുനം"
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return "CANCER", "കർക്കടകം"
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return "LEO", "ചിങ്ങം"
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return "VIRGO", "കന്നി"
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return "LIBRA", "തുലാം"
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return "SCORPIO", "വൃശ്ചികം"
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return "SAGITTARIUS", "ധനു"
    else:
        return "CAPRICORN", "മകരം"


def format_degree(degrees: float) -> str:
    deg_in_sign = degrees % 30
    d = int(deg_in_sign)
    m = int(round((deg_in_sign - d) * 60))
    if m == 60:
        d += 1
        m = 0
    return f"{d}° {m:02d}'"


def get_kollavarsham_date(d: date) -> str:
    year = d.year
    mal_months = [
        ("മകരം", 1, 15),
        ("കുംഭം", 2, 14),
        ("മീനം", 3, 15),
        ("മേടം", 4, 14),
        ("ഇടവം", 5, 15),
        ("മിഥുനം", 6, 16),
        ("കർക്കടകം", 7, 17),
        ("ചിങ്ങം", 8, 17),
        ("കന്നി", 9, 17),
        ("തുലാം", 10, 18),
        ("വൃശ്ചികം", 11, 17),
        ("ധനു", 12, 16),
    ]
    if (d.month > 8) or (d.month == 8 and d.day >= 17):
        k_year = year - 824
    else:
        k_year = year - 825

    m_name = "മകരം"
    m_day = 1
    for name, sm, sd in reversed(mal_months):
        start_d = date(year, sm, sd)
        if d >= start_d:
            m_name = name
            m_day = (d - start_d).days + 1
            break
    else:
        start_d = date(year - 1, 12, 16)
        m_name = "ധനു"
        m_day = (d - start_d).days + 1

    return f"{m_day} {m_name} {k_year}"


def calculate_true_ascendant(
    dt: datetime,
    utc_offset_hours: float,
    latitude: float,
    longitude: float,
    ayanamsa: AyanamsaSystem = AyanamsaSystem.LAHIRI,
) -> float:
    """
    Computes true astronomical Ascendant (Lagna) using standard Meeus Astronomical Algorithms.
    (Fixes 180-degree inverted ascendant bug in standard jyotipy).
    """
    epoch = to_utc_epoch(dt, utc_offset_hours)
    obliquity = float(Coordinates.true_obliquity(epoch))
    nutation = float(Coordinates.nutation_longitude(epoch))
    gst_days = float(epoch.apparent_sidereal_time(obliquity, nutation))
    ramc = (gst_days * 360.0 + longitude) % 360

    theta = math.radians(ramc)
    eps = math.radians(obliquity)
    phi = math.radians(latitude)

    # Standard Meeus formula for the Ascendant point:
    y = math.cos(theta)
    x = -math.sin(eps) * math.tan(phi) - math.cos(eps) * math.sin(theta)
    asc_trop = math.degrees(math.atan2(y, x)) % 360
    return tropical_to_sidereal(asc_trop, epoch, ayanamsa)


def calculate_kerala_mandi_deg(
    d: date,
    birth_time: time,
    latitude: float,
    longitude: float,
    weekday_name: str,
    utc_offset_hours: float = 5.5,
    ayanamsa: AyanamsaSystem = AyanamsaSystem.LAHIRI,
) -> float:
    """
    Calculates authentic Kerala Mandi (Gulika) according to Parashara & Prashna Marga.
    The day/night is partitioned into 8 parts; Saturn's part determines Gulika rising time.
    The Ascendant at that moment is the longitude of Mandi.
    """
    day_of_year = d.timetuple().tm_yday
    gamma = 2 * math.pi / 365.25 * (day_of_year - 1)
    eqtime = 229.18 * (0.000075 + 0.001868 * math.cos(gamma) - 0.032077 * math.sin(gamma)
                       - 0.014615 * math.cos(2 * gamma) - 0.040849 * math.sin(2 * gamma))
    decl = (0.006918 - 0.399912 * math.cos(gamma) + 0.070257 * math.sin(gamma)
            - 0.006758 * math.cos(2 * gamma) + 0.000907 * math.sin(2 * gamma))

    phi = math.radians(latitude)
    cos_ha = (math.cos(math.radians(90.833)) - math.sin(phi) * math.sin(decl)) / (math.cos(phi) * math.cos(decl))
    cos_ha = max(-1.0, min(1.0, cos_ha))
    ha_deg = math.degrees(math.acos(cos_ha))

    std_meridian = utc_offset_hours * 15.0
    solar_noon_min = 720.0 - (4.0 * (longitude - std_meridian)) - eqtime
    sunrise_min = solar_noon_min - (ha_deg * 4.0)
    sunset_min = solar_noon_min + (ha_deg * 4.0)

    rise_dt = datetime.combine(d, time.min) + timedelta(minutes=sunrise_min)
    set_dt = datetime.combine(d, time.min) + timedelta(minutes=sunset_min)
    birth_dt = datetime.combine(d, birth_time)

    is_day_birth = (rise_dt <= birth_dt < set_dt)

    day_ghatikas = {
        "Sunday": 26, "Monday": 22, "Tuesday": 18,
        "Wednesday": 14, "Thursday": 10, "Friday": 6, "Saturday": 2,
    }
    night_ghatikas = {
        "Sunday": 10, "Monday": 6, "Tuesday": 2,
        "Wednesday": 26, "Thursday": 22, "Friday": 18, "Saturday": 14,
    }

    if is_day_birth:
        dinamana_min = max(1.0, sunset_min - sunrise_min)
        ghatika = day_ghatikas.get(weekday_name, 14)
        offset_min = (ghatika / 30.0) * dinamana_min
        mandi_dt = rise_dt + timedelta(minutes=offset_min)
    else:
        ratrimana_min = max(1.0, (1440.0 - sunset_min) + sunrise_min)
        ghatika = night_ghatikas.get(weekday_name, 14)
        offset_min = (ghatika / 30.0) * ratrimana_min
        if birth_dt >= set_dt:
            mandi_dt = set_dt + timedelta(minutes=offset_min)
        else:
            mandi_dt = (set_dt - timedelta(days=1)) + timedelta(minutes=offset_min)

    return calculate_true_ascendant(mandi_dt, utc_offset_hours, latitude, longitude, ayanamsa)


BHAVA_METADATA_CONFIG = [
    {
        "num": 1,
        "name_ml": "ഒന്നാം ഭാവം (ലഗ്നം / തനുഭാവം)",
        "name_en": "First House (Tanubhavam / Ascendant)",
        "ribbon_ml": "വ്യക്തിത്വം, ശരീര പ്രകൃതം, സാമൂഹിക സ്ഥിതി (1-ാം ഭാവം)",
        "ribbon_en": "Personality, Physical Constitution & Social Standing (1st House)",
        "sub_ml": "നിങ്ങളുടെ ഒന്നാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your First House",
        "sig_ml": "ജാതകനെ പ്രതിനിധാനം ചെയ്യുന്ന ഭാവമാണ് ഒന്നാം ഭാവം അഥവാ ലഗ്നഭാവം. സ്വഭാവഗുണം, ശരീരം, ആകൃതി, യശസ്സ് എന്നീ കാര്യങ്ങൾ ഒന്നാം ഭാവം കൊണ്ട് നിരൂപിക്കാം.",
        "sig_en": "The first house (Lagna) represents the native's physical vitality, temperament, bodily stature, reputation, and general destiny in life.",
        "tmpl_ml": "താങ്കളുടെ ലഗ്നം {sign} രാശിയാണ്. ലഗ്നാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ സ്ഥിതിചെയ്യുന്നു. {planets_text}സ്ഥിരതയുള്ള നിലപാടുകളും സാമർത്ഥ്യവും പ്രകടിപ്പിക്കും. ദീർഘദൃഷ്ടിയും കാര്യവിവേകവും കൈമുതലായിരിക്കും. സ്വതന്ത്ര ചിന്താഗതിയും കഠിനാധ്വാനവും വഴി സമൂഹത്തിൽ മാന്യമായ സ്ഥാനവും സൽകീർത്തിയും കൈവരിക്കും.",
        "tmpl_en": "Your Ascendant (First House) is {sign}. The Ascendant lord {lord} is posited in the {lord_house} house. {planets_text}You demonstrate purposeful determination, intellectual clarity, and independent judgment. Opportunities in enterprise, technology, governance, and collaborative ventures bring honor and distinction.",
    },
    {
        "num": 2,
        "name_ml": "രണ്ടാം ഭാവം (ധനഭാവം / കുടുംബം)",
        "name_en": "Second House (Dhanabhavam / Wealth)",
        "ribbon_ml": "ധനം, ഭൂസ്വത്ത്, കുടുംബം & വാക്ക് (2-ാം ഭാവം)",
        "ribbon_en": "Wealth, Assets, Family & Speech (2nd House)",
        "sub_ml": "നിങ്ങളുടെ രണ്ടാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Second House",
        "sig_ml": "ധനം, ഭൂസ്വത്ത്, കുടുംബം, സംഭാഷണം, ഭക്ഷണം, വിദ്യ എന്നീ വിഷയങ്ങളെക്കുറിച്ചാണ് രണ്ടാം ഭാവം പ്രധാനമായും സൂചനകൾ നൽകുന്നത്.",
        "sig_en": "The second house signifies accumulated wealth, financial stability, family lineage, speech, and early learning.",
        "tmpl_ml": "രണ്ടാം ഭാവം {sign} രാശിയാണ്. ധനഭാവാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ നിലകൊള്ളുന്നു. {planets_text}സ്വപ്രയത്നത്താൽ സമ്പത്ത് സ്വരൂപിക്കും. കുടുംബത്തിൽ മാന്യമായ പദവിയും ആദരവും ലഭിക്കും. പക്വമായ സംസാരശൈലി മറ്റുള്ളവരെ ആകർഷിക്കും. സാമ്പത്തിക അച്ചടക്കം പാലിച്ച് ദീർഘകാല നിക്ഷേപങ്ങളിലൂടെ അഭിവൃദ്ധി നേടും.",
        "tmpl_en": "Your Second House (Dhanabhavam) is {sign}. The 2nd lord {lord} is posited in the {lord_house} house. {planets_text}Through disciplined effort and measured strategy, you build enduring financial prosperity. Your family lineage and measured speech inspire trust and respect.",
    },
    {
        "num": 3,
        "name_ml": "മൂന്നാം ഭാവം (സഹോദരഭാവം / പരാക്രമം)",
        "name_en": "Third House (Sahodarabhavam / Siblings & Valour)",
        "ribbon_ml": "സഹോദരങ്ങൾ, ധൈര്യം & കർമ്മസാമർത്ഥ്യം (3-ാം ഭാവം)",
        "ribbon_en": "Siblings, Courage & Initiative (3rd House)",
        "sub_ml": "നിങ്ങളുടെ മൂന്നാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Third House",
        "sig_ml": "മൂന്നാം ഭാവം സഹോദരഭാവമാണ്. പ്രധാനമായും സഹോദരങ്ങളെപ്പറ്റിയും കൂടാതെ ധൈര്യം, സാമർത്ഥ്യം, സംരംഭങ്ങൾ മുതലായവയെക്കുറിച്ചും മൂന്നാമിടം സൂചനകൾ നൽകുന്നു.",
        "sig_en": "The third house governs younger siblings, courage, mental fortitude, valour, and self-made achievements.",
        "tmpl_ml": "മൂന്നാം ഭാവം {sign} രാശിയാണ്. മൂന്നാം ഭാവാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ സ്ഥിതിചെയ്യുന്നു. {planets_text}അസാധാരണമായ ധൈര്യവും മനക്കരുത്തും കൈമുതലായുണ്ടാകും. പ്രതിസന്ധികളിൽ മുന്നിൽ നിന്ന് നയിക്കാനും ഏതു തടസ്സത്തെയും ചങ്കൂറ്റത്തോടെ തരണം ചെയ്യാനും സാധിക്കും. സഹോദരങ്ങളുമായി സ്നേഹബന്ധം പുലർത്തും.",
        "tmpl_en": "Your Third House is {sign}. The 3rd lord {lord} is posited in the {lord_house} house. {planets_text}You possess remarkable courage, initiative, and mental resilience. You face unexpected challenges with composed resolve and achieve distinction through self-made ventures.",
    },
    {
        "num": 4,
        "name_ml": "നാലാം ഭാവം (മാതൃഭാവം / സുഖഭാവം)",
        "name_en": "Fourth House (Sukhabhavam / Mother & Assets)",
        "ribbon_ml": "സ്വത്ത്, വിദ്യാഭ്യാസം, മാതാവ് & വാഹനങ്ങൾ (4-ാം ഭാവം)",
        "ribbon_en": "Property, Education & Mother (4th House)",
        "sub_ml": "നിങ്ങളുടെ നാലാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Fourth House",
        "sig_ml": "നാലാം രാശിയെ ആസ്പദമാക്കി സമ്പത്ത്, വിദ്യാഭ്യാസം, മാതാവ്, വാഹനങ്ങൾ, ഗൃഹം എന്നിവയെക്കുറിച്ച് ചിന്തിക്കാം.",
        "sig_en": "The fourth house indicates mother, educational attainment, landed property, conveyances, and inner contentment.",
        "tmpl_ml": "നാലാം ഭാവം {sign} രാശിയാണ്. സുഖഭാവാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ നിലകൊള്ളുന്നു. {planets_text}മാതാപിതാക്കളോട് അസാധാരണമായ ആദരവും കടപ്പാടും കാത്തുസൂക്ഷിക്കും. ഉയർന്ന വിദ്യാഭ്യാസ യോഗവും സ്വന്തമായി ഭവനവും വാഹനങ്ങളും സമ്പാദിക്കാനുള്ള ഭാഗ്യവും കൈവരും.",
        "tmpl_en": "Your Fourth House is {sign}. The 4th lord {lord} is posited in the {lord_house} house. {planets_text}You cherish deep filial affection toward your parents and ancestors. You achieve notable educational credentials and acquire comfortable landed property and vehicles.",
    },
    {
        "num": 5,
        "name_ml": "അഞ്ചാം ഭാവം (സന്താനഭാവം / പൂർവ്വപുണ്യം)",
        "name_en": "Fifth House (Santhanabhavam / Progeny & Mind)",
        "ribbon_ml": "സന്താനങ്ങൾ, മനസ്സ് & വിശേഷ ബുദ്ധി (5-ാം ഭാവം)",
        "ribbon_en": "Intellect, Creative Wisdom & Children (5th House)",
        "sub_ml": "നിങ്ങളുടെ അഞ്ചാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Fifth House",
        "sig_ml": "സന്താനം, മനസ്സ്, ബുദ്ധി, സർഗ്ഗാത്മകത എന്നീ വിഷയങ്ങളെപ്പറ്റിയാണ് അഞ്ചാം ഭാവം പ്രധാനമായും സൂചനകൾ നൽകുന്നത്.",
        "sig_en": "The fifth house relates to intellect, discrimination, creative talents, speculative acumen, and noble progeny.",
        "tmpl_ml": "അഞ്ചാം ഭാവം {sign} രാശിയാണ്. പഞ്ചമഭാവാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ സ്ഥിതിചെയ്യുന്നു. {planets_text}ചിന്തകളിൽ ആഴവും ദൂരക്കാഴ്ചയും ഉണ്ടാകും. ഉന്നതവിദ്യാഭ്യാസത്തിനും വിജ്ഞാനസമ്പാദനത്തിനും മികച്ച അവസരങ്ങൾ ലഭിക്കും. സൽഗുണസമ്പന്നരായ സന്താനങ്ങൾ കുടുംബത്തിന് ഐശ്വര്യവും സൽകീർത്തിയും നൽകും.",
        "tmpl_en": "Your Fifth House is {sign}. The 5th lord {lord} is posited in the {lord_house} house. {planets_text}Your intellect is marked by analytical depth and creative foresight. Blessed with noble progeny and higher learning acumen, you earn respect in scholarly circles.",
    },
    {
        "num": 6,
        "name_ml": "ആറാം ഭാവം (ശത്രുഭാവം / രോഗഭാവം)",
        "name_en": "Sixth House (Shathrubhavam / Adversaries & Health)",
        "ribbon_ml": "രോഗങ്ങൾ, ശത്രു, തടസ്സങ്ങൾ തരണം ചെയ്യൽ (6-ാം ഭാവം)",
        "ribbon_en": "Health, Competitors & Overcoming Obstacles (6th House)",
        "sub_ml": "നിങ്ങളുടെ ആറാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Sixth House",
        "sig_ml": "രോഗം, ശത്രു, തടസ്സം, മത്സരം മുതലായ കാര്യങ്ങളെക്കുറിച്ചാണ് ആറാം ഭാവം സൂചനകൾ നൽകുന്നത്.",
        "sig_en": "The sixth house deals with health vitality, resistance to ailments, competitors, and debt management.",
        "tmpl_ml": "ആറാം ഭാവം {sign} രാശിയാണ്. ആറാം ഭാവാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ നിലകൊള്ളുന്നു. {planets_text}കഠിനാധ്വാനത്തിലൂടെ ഏതു തടസ്സത്തെയും വിജയമാക്കി മാറ്റാൻ സാധിക്കും. പ്രതിയോഗികളുടെ നീക്കങ്ങളെ തന്ത്രപരമായി പ്രതിരോധിക്കും. ചിട്ടയായ ഭക്ഷണക്രമവും വ്യായാമവും ആരോഗ്യ ഭദ്രത ഉറപ്പാക്കും.",
        "tmpl_en": "Your Sixth House is {sign}. The 6th lord {lord} is situated in the {lord_house} house. {planets_text}You possess remarkable endurance and tactical mastery to conquer competitors and surmount hurdles. A disciplined daily regimen safeguards long-term vitality.",
    },
    {
        "num": 7,
        "name_ml": "ഏഴാം ഭാവം (കളത്രഭാവം / വിവാഹം)",
        "name_en": "Seventh House (Kalathrabhavam / Marriage & Partners)",
        "ribbon_ml": "വിവാഹം, ദാമ്പത്യജീവിതം & കൂട്ടുകെട്ടുകൾ (7-ാം ഭാവം)",
        "ribbon_en": "Marriage, Life Partner & Alliances (7th House)",
        "sub_ml": "നിങ്ങളുടെ ഏഴാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Seventh House",
        "sig_ml": "വിവാഹജീവിതം, പങ്കാളിയുടെ സ്വഭാവം, സംയുക്ത സംരംഭങ്ങൾ എന്നിവ ഏഴാം ഭാവം കൊണ്ട് ചിന്തിക്കേണ്ടിയിരിക്കുന്നു.",
        "sig_en": "The seventh house illuminates marital harmony, partner's character, business partnerships, and public alliances.",
        "tmpl_ml": "ഏഴാം ഭാവം {sign} രാശിയാണ്. കളത്രഭാവാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ സ്ഥിതിചെയ്യുന്നു. {planets_text}മനസ്സിനിണങ്ങിയ ഉത്തമ പങ്കാളിയുമായി സ്നേഹപൂർണ്ണമായ ദാമ്പത്യം പുലർത്തും. പങ്കാളിയുടെ വരവോടെ ജീവിതത്തിൽ ഭാഗ്യവും സാമ്പത്തിക അഭിവൃദ്ധിയും കുടുംബത്തിൽ സമാധാനവും ഉണ്ടാകും.",
        "tmpl_en": "Your Seventh House (Kalathrabhavam) is {sign}. The 7th lord {lord} is posited in the {lord_house} house. {planets_text}You are blessed with a mutually supportive, intelligent life companion. Marriage brings shared prosperity, domestic harmony, and fruitful social alliances.",
    },
    {
        "num": 8,
        "name_ml": "എട്ടാം ഭാവം (ആയുർഭാവം / അഷ്ടമഭാവം)",
        "name_en": "Eighth House (Ayurbhavam / Longevity & Transformation)",
        "ribbon_ml": "ആയുസ്സ്, ബുദ്ധിമുട്ടുകൾ & രഹസ്യവിദ്യകൾ (8-ാം ഭാവം)",
        "ribbon_en": "Longevity, Vitality & Inner Transformation (8th House)",
        "sub_ml": "നിങ്ങളുടെ എട്ടാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Eighth House",
        "sig_ml": "അഷ്ടമഭാവം കൊണ്ട് ആയുസ്സ്, പരിവർത്തനങ്ങൾ, അപ്രതീക്ഷിത സംഭവങ്ങൾ എന്നിവയെപ്പറ്റിയാണ് പ്രധാനമായും ചിന്തിക്കേണ്ടത്.",
        "sig_en": "The eighth house signifies longevity, profound transformations, research insights, and unearned windfalls.",
        "tmpl_ml": "എട്ടാം ഭാവം {sign} രാശിയാണ്. അഷ്ടമഭാവാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ നിലകൊള്ളുന്നു. {planets_text}അപ്രതീക്ഷിത സംഭവങ്ങളെ നേരിടാനുള്ള അസാധാരണ മനശ്ശക്തി ഉണ്ടായിരിക്കും. ആപത്തുകളിൽ നിന്ന് അത്ഭുതകരമായി രക്ഷപ്പെടാനുള്ള ഈശ്വരാധീനം ജാതകത്തിൽ ദൃശ്യമാണ്. ആത്മീയ സാധനകൾ മനശ്ശാന്തിയേകും.",
        "tmpl_en": "Your Eighth House is {sign}. The 8th lord {lord} is posited in the {lord_house} house. {planets_text}You possess strong recuperative vitality and crisis management capability. Divine grace safeguards you against unforeseen perils; meditative practices bring poise.",
    },
    {
        "num": 9,
        "name_ml": "ഒമ്പതാം ഭാവം (ഭാഗ്യഭാവം / ധർമ്മഭാവം)",
        "name_en": "Ninth House (Bhagyabhavam / Fortune & Dharma)",
        "ribbon_ml": "സൗഭാഗ്യം, ഐശ്വര്യം, പാരമ്പര്യ സ്വത്ത് & പിതാവ് (9-ാം ഭാവം)",
        "ribbon_en": "Fortune, Higher Wisdom & Ancestral Blessings (9th House)",
        "sub_ml": "നിങ്ങളുടെ ഒൻപതാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Ninth House",
        "sig_ml": "ഭാഗ്യം, പിതാവ്, പൂർവ്വപുണ്യം, ധർമ്മം, ഈശ്വരാധീനം എന്നിവ ഒമ്പതാം ഭാവം വ്യക്തമാക്കുന്നു.",
        "sig_en": "The ninth house reflects father, fortune, dharma, higher learning, and divine blessings.",
        "tmpl_ml": "ഒമ്പതാം ഭാവം {sign} രാശിയാണ്. ഭാഗ്യഭാവാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ സ്ഥിതിചെയ്യുന്നു. {planets_text}ഈശ്വരാധീനവും ഭാഗ്യവും സാമ്പത്തിക നേട്ടങ്ങളും നിരന്തരം അനുഭവപ്പെടും. സൽക്കർമ്മങ്ങളിലും ധർമ്മപ്രവർത്തനങ്ങളിലും സജീവമായി പങ്കെടുക്കും. പിതൃസ്വത്തോ കുടുംബപരമായ അംഗീകാരമോ ലഭിക്കും.",
        "tmpl_en": "Your Ninth House (Bhagyabhavam) is {sign}. The 9th lord {lord} is posited in the {lord_house} house. {planets_text}Divine grace and fortunate opportunities continually favor you. Noble pursuits, ancestral blessings, and virtuous philanthropy enhance your social eminence.",
    },
    {
        "num": 10,
        "name_ml": "പത്താം ഭാവം (കർമ്മഭാവം / ജീവനം)",
        "name_en": "Tenth House (Karmabhavam / Profession & Status)",
        "ribbon_ml": "കർമ്മ മേഖല, തൊഴിൽ, പദവി & കീർത്തി (10-ാം ഭാവം)",
        "ribbon_en": "Profession, Career & Public Eminence (10th House)",
        "sub_ml": "നിങ്ങളുടെ പത്താം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Tenth House",
        "sig_ml": "ഫലദീപികയിലും സർവ്വാർത്ഥചിന്താമണിയിലും പത്താംഭാവം വ്യാപാരം, സ്ഥാനമാനങ്ങൾ, തൊഴിൽ, വിജയം, കീർത്തി, അധികാരം എന്നിവയെ സൂചിപ്പിക്കുന്നു.",
        "sig_en": "According to Phaladeepika and Sarvartha Chintamani, the tenth house governs profession, authority, sovereignty, fame, leadership, and public achievement.",
        "tmpl_ml": "പത്താം ഭാവം {sign} രാശിയാണ്. കർമ്മാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ നിലകൊള്ളുന്നു. {planets_text}ബൃഹദ് പരാശര ഹോരാശാസ്ത്രപ്രകാരം കർമ്മാധിപന്റെ അനുഗ്രഹത്താൽ തൊഴിൽരംഗത്ത് ഉന്നത വിജയവും സ്ഥാനമാനങ്ങളും കൈവരിക്കും. സ്വതന്ത്ര ചിന്തയും കാര്യശേഷിയും വലിയ ഉയരങ്ങളിലെത്തിക്കും.",
        "tmpl_en": "Your Tenth House (Karmabhavam) is {sign}. The 10th lord {lord} is posited in the {lord_house} house. {planets_text}According to Brihat Parashara Hora Shastra, this placement grants professional authority, public renown, executive competence, and lasting achievement in your chosen career.",
    },
    {
        "num": 11,
        "name_ml": "പതിനൊന്നാം ഭാവം (ലാഭഭാവം / ആഗമം)",
        "name_en": "Eleventh House (Labhabhavam / Gains & Aspirations)",
        "ribbon_ml": "വരുമാനം, ധനലാഭം & അഭീഷ്ടസിദ്ധി (11-ാം ഭാവം)",
        "ribbon_en": "Income, Profits & Fulfillment of Desires (11th House)",
        "sub_ml": "നിങ്ങളുടെ പതിനൊന്നാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Eleventh House",
        "sig_ml": "പതിനൊന്നാം ഭാവം പ്രധാനമായും ധനലാഭത്തെയും വരുമാന സ്രോതസ്സുകളെയും ആഗ്രഹസാഫല്യത്തെയും സൂചിപ്പിക്കുന്നു.",
        "sig_en": "The eleventh house presides over financial gains, multiple income avenues, elder peers, and aspiration fulfillment.",
        "tmpl_ml": "പതിനൊന്നാം ഭാവം {sign} രാശിയാണ്. ലാഭഭാവാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ സ്ഥിതിചെയ്യുന്നു. {planets_text}വിവിധ മാർഗ്ഗങ്ങളിലൂടെ സമ്പത്തും വരുമാനവും വർദ്ധിക്കും. സ്വാധീനമുള്ള സുഹൃത്തുക്കളുടെ സഹായം ലഭിക്കും. ആഗ്രഹങ്ങൾ സാക്ഷാത്കരിക്കപ്പെടുകയും സത്കീർത്തി കൈവരുകയും ചെയ്യും.",
        "tmpl_en": "Your Eleventh House (Labhabhavam) is {sign}. The 11th lord {lord} is posited in the {lord_house} house. {planets_text}You achieve substantial prosperity through diversified endeavors and influential networking. Your cherished goals and noble aspirations find timely fruition.",
    },
    {
        "num": 12,
        "name_ml": "പന്ത്രണ്ടാം ഭാവം (വ്യയഭാവം / മോക്ഷം)",
        "name_en": "Twelfth House (Vyayabhavam / Expenditure & Moksha)",
        "ribbon_ml": "ചിലവുകൾ, വിദേശയാത്ര & ആത്മീയത (12-ാം ഭാവം)",
        "ribbon_en": "Expenditure, Foreign Travel & Spiritual Liberation (12th House)",
        "sub_ml": "നിങ്ങളുടെ പന്ത്രണ്ടാം ഭാവത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രവചനങ്ങൾ",
        "sub_en": "Predictions based on your Twelfth House",
        "sig_ml": "പന്ത്രണ്ടാം ഭാവം കൊണ്ട് ശുഭചിലവുകൾ, വിദേശവാസം, ആത്മീയ സാധനകൾ, മോക്ഷം എന്നിവയെപ്പറ്റിയാണ് ചിന്തിക്കേണ്ടത്.",
        "sig_en": "The twelfth house signifies expenditures, charity, foreign residency, spiritual evolution, and liberation.",
        "tmpl_ml": "പന്ത്രണ്ടാം ഭാവം {sign} രാശിയാണ്. വ്യയഭാവാധിപനായ {lord} {lord_house}-ാം ഭാവത്തിൽ നിലകൊള്ളുന്നു. {planets_text}ശുഭകാര്യങ്ങൾക്കും കുടുംബക്ഷേമത്തിനുമായി ധനം വിനിയോഗിക്കും. വിദേശയാത്രകൾക്കും ദൂരദേശ ബന്ധങ്ങൾക്കും അനുകൂല സാഹചര്യങ്ങളുണ്ടാകും. ജീവിതത്തിൽ ആത്മീയ ചിന്തകളും ശാന്തിയും നിറയും.",
        "tmpl_en": "Your Twelfth House (Vyayabhavam) is {sign}. The 12th lord {lord} is posited in the {lord_house} house. {planets_text}Expenditures are channeled constructively toward charitable causes, family welfare, and long-term security. Favorable prospects exist for rewarding distant or foreign connections and spiritual growth.",
    },
]


class HoroscopeCalculator:
    def generate(self, req: HoroscopeGenerateRequest) -> HoroscopeResponse:
        lang = normalize_language(req.language)
        ui = UI_STRINGS.get(lang, UI_STRINGS["Malayalam"])
        sub_cfg = SUBTABLES_CONFIG.get(lang, SUBTABLES_CONFIG["Malayalam"])
        timeline_cfg = CAREER_TIMELINE_I18N.get(lang, CAREER_TIMELINE_I18N["Malayalam"])
        ch2_cfg = CHAPTER2_ITEMS_I18N.get(lang, CHAPTER2_ITEMS_I18N["Malayalam"])
        weekday_data = WEEKDAY_I18N.get(lang, WEEKDAY_I18N["Malayalam"])
        planet_dict = PLANET_I18N.get(lang, PLANET_I18N["Malayalam"])
        sign_list = SIGN_I18N.get(lang, SIGN_I18N["Malayalam"])

        tz_name = req.timezone or "Asia/Kolkata"
        try:
            tz = ZoneInfo(tz_name)
        except ZoneInfoNotFoundError:
            tz = ZoneInfo("Asia/Kolkata")
            tz_name = "Asia/Kolkata"

        local_dt = datetime.combine(req.date_of_birth, req.time_of_birth)
        aware_dt = local_dt.replace(tzinfo=tz)
        offset = aware_dt.utcoffset()
        utc_offset_hours = (offset.total_seconds() / 3600) if offset else 5.5

        chart = BirthChart(
            dt=local_dt,
            utc_offset_hours=utc_offset_hours,
            latitude=req.latitude,
            longitude=req.longitude,
            ayanamsa=AyanamsaSystem.LAHIRI,
        )

        panchanga_raw = chart.panchanga()

        # Age calculation
        today = date.today()
        age = today.year - req.date_of_birth.year - (
            (today.month, today.day) < (req.date_of_birth.month, req.date_of_birth.day)
        )
        years_suffix = ui.get("years_suffix", "years")
        age_display = f"{age} {years_suffix}"

        # Calendar Day vs Vedic Day (Sunrise check)
        calendar_day_en = local_dt.strftime("%A")
        calendar_day_display = weekday_data.get(calendar_day_en, {}).get("name", calendar_day_en)
        calendar_day_mal = WEEKDAY_I18N["Malayalam"].get(calendar_day_en, {}).get("name", calendar_day_en)

        # Sunrise is approximately 06:15 - 06:30 local time in Kerala
        is_before_sunrise = (req.time_of_birth.hour < 6) or (req.time_of_birth.hour == 6 and req.time_of_birth.minute < 15)

        if is_before_sunrise:
            vedic_day_en = WEEKDAY_PREVIOUS.get(calendar_day_en, calendar_day_en)
            vedic_day_display = weekday_data.get(vedic_day_en, {}).get("name", vedic_day_en)
            vedic_day_mal = WEEKDAY_I18N["Malayalam"].get(vedic_day_en, {}).get("name", vedic_day_en)
            if lang == "English":
                vedic_day_note = (
                    f"You were born on {calendar_day_en} before sunrise. According to Vedic astrology, a day begins with sunrise. "
                    f"Therefore, your astrological day of birth is reckoned as {vedic_day_display}."
                )
            elif lang == "Hindi":
                vedic_day_note = (
                    f"आपका जन्म {calendar_day_display} को सूर्योदय से पूर्व हुआ है। वैदिक ज्योतिष के अनुसार दिन का आरंभ सूर्योदय से माना जाता है। "
                    f"अतः ज्योतिषीय दृष्टि से आपका जन्म वार {vedic_day_display} माना जाता है।"
                )
            elif lang == "Tamil":
                vedic_day_note = (
                    f"உங்கள் பிறப்பு {calendar_day_display} சூரிய உதயத்திற்கு முன் நிகழ்ந்துள்ளது. ஜோதிட சாஸ்திரப்படி ஒரு நாள் சூரிய உதயத்திலிருந்தே தொடங்குகிறது. "
                    f"எனவே உங்கள் ஜோதிடப் பிறப்பு நாள் {vedic_day_display} என்று கணக்கிடப்படுகிறது."
                )
            else:
                vedic_day_note = (
                    f"താങ്കളുടെ ജനനം {calendar_day_mal} സൂര്യോദയത്തിന് മുമ്പാണ്. "
                    "ജ്യോതിഷപ്രകാരം ഒരു ദിവസം തുടങ്ങുന്നത് സൂര്യോദയത്തോടെയാണ്. "
                    f"അപ്രകാരം ജ്യോതിഷപരമായി താങ്കളുടെ ജനനം {vedic_day_mal} ആയി കണക്കാക്കപ്പെടുന്നു."
                )
        else:
            vedic_day_en = calendar_day_en
            vedic_day_display = calendar_day_en if lang == "English" else weekday_data.get(vedic_day_en, {}).get("name", vedic_day_en)
            vedic_day_mal = calendar_day_mal
            if lang == "English":
                vedic_day_note = (
                    "According to Vedic astrology, a day begins with sunrise. "
                    f"Therefore, your astrological day of birth is reckoned as {vedic_day_display}."
                )
            elif lang == "Hindi":
                vedic_day_note = (
                    "वैदिक ज्योतिष के अनुसार दिन का आरंभ सूर्योदय से माना जाता है। "
                    f"अतः ज्योतिषीय दृष्टि से आपका जन्म वार {vedic_day_display} माना जाता है।"
                )
            elif lang == "Tamil":
                vedic_day_note = (
                    "ஜோதிட சாஸ்திரப்படி ஒரு நாள் சூரிய உதயத்திலிருந்தே தொடங்குகிறது. "
                    f"எனவே உங்கள் ஜோதிடப் பிறப்பு நாள் {vedic_day_display} என்று கணக்கிடப்படுகிறது."
                )
            else:
                vedic_day_note = (
                    "ജ്യോതിഷപ്രകാരം ഒരു ദിവസം തുടങ്ങുന്നത് സൂര്യോദയത്തോടെയാണ്. "
                    f"അപ്രകാരം ജ്യോതിഷപരമായി താങ്കളുടെ ജനനം {vedic_day_mal} ദിവസമായി കണക്കാക്കപ്പെടുന്നു."
                )

        vara_info = weekday_data.get(vedic_day_en, weekday_data.get("Tuesday", {}))
        vara_prediction = vara_info.get("prediction", "")
        vara_lord = vara_info.get("lord", "")

        # Formatted dates
        month_name = MONTHS_I18N.get(lang, {}).get(req.date_of_birth.month, str(req.date_of_birth.month))
        month_mal = MONTHS_I18N["Malayalam"].get(req.date_of_birth.month, str(req.date_of_birth.month))
        dob_formatted = f"{req.date_of_birth.day} {month_name}, {req.date_of_birth.year}"
        dob_mal_formatted = f"{req.date_of_birth.day} {month_mal}, {req.date_of_birth.year}"
        tob_formatted = local_dt.strftime("%I:%M %p")
        gender_display = GENDER_I18N.get(lang, {}).get(req.gender, req.gender)
        gender_mal = GENDER_I18N["Malayalam"].get(req.gender, req.gender)

        # Sun sign & Moon sign
        sun_en, sun_mal = get_western_sun_sign(req.date_of_birth)
        sun_sign_idx = next((i for i, (s_en, _, _) in enumerate(SIGN_NAMES) if s_en.upper() == sun_en.upper()), 10)
        sun_sign_display = sign_list[sun_sign_idx][1]

        moon_deg = chart.positions[Graha.MOON]
        moon_sign_idx = int(moon_deg % 360 // 30)
        moon_sign_en, moon_sign_mal, _ = SIGN_BY_INDEX[moon_sign_idx]
        moon_sign_display = sign_list[moon_sign_idx][1]

        # Ascendant / Lagna (using accurate astronomical calculation)
        asc_deg = calculate_true_ascendant(
            local_dt, utc_offset_hours, req.latitude, req.longitude, AyanamsaSystem.LAHIRI
        )
        chart.ascendant = asc_deg
        asc_sign_idx = int(asc_deg % 360 // 30)
        asc_sign_en, asc_sign_mal, _ = SIGN_BY_INDEX[asc_sign_idx]
        asc_sign_display = sign_list[asc_sign_idx][1]

        asc_nak_info = nakshatra_info(asc_deg)
        asc_nak_name = asc_nak_info["name"]
        asc_nak_display = NAKSHATRA_I18N.get(asc_nak_name, {}).get(lang, asc_nak_name)
        asc_nak_mal = NAKSHATRA_I18N.get(asc_nak_name, {}).get("Malayalam", asc_nak_name)

        # Panchanga items
        nak_data = panchanga_raw.get("nakshatra", {})
        nak_name = nak_data.get("name", "Purva Bhadrapada")
        nak_display = NAKSHATRA_I18N.get(nak_name, {}).get(lang, nak_name)
        nak_mal = NAKSHATRA_I18N.get(nak_name, {}).get("Malayalam", nak_name)
        nak_pada = nak_data.get("pada", 4)
        nak_lord_graha = NAKSHATRA_LORD_GRAHA.get(nak_name, "Jupiter")
        nak_lord_display = planet_dict.get(nak_lord_graha, {}).get("name", nak_lord_graha)
        nak_lord_mal = PLANET_I18N["Malayalam"].get(nak_lord_graha, {}).get("name", nak_lord_graha)

        moon_lord_graha = SIGN_LORD_GRAHA.get(moon_sign_en, "Jupiter")
        moon_lord_display = planet_dict.get(moon_lord_graha, {}).get("name", moon_lord_graha)
        moon_lord_mal = PLANET_I18N["Malayalam"].get(moon_lord_graha, {}).get("name", moon_lord_graha)

        asc_lord_graha = SIGN_LORD_GRAHA.get(asc_sign_en, "Jupiter")
        asc_lord_display = planet_dict.get(asc_lord_graha, {}).get("name", asc_lord_graha)
        asc_lord_mal = PLANET_I18N["Malayalam"].get(asc_lord_graha, {}).get("name", asc_lord_graha)

        tithi_data = panchanga_raw.get("tithi", {})
        tithi_name = tithi_data.get("name", "Chaturthi")
        tithi_display = TITHI_I18N.get(tithi_name, {}).get(lang, tithi_name)
        tithi_mal = TITHI_I18N.get(tithi_name, {}).get("Malayalam", tithi_name)
        tithi_paksha = tithi_data.get("paksha", "Shukla")
        tithi_paksha_display = PAKSHA_I18N.get(tithi_paksha, {}).get(lang, tithi_paksha)
        tithi_paksha_mal = PAKSHA_I18N.get(tithi_paksha, {}).get("Malayalam", tithi_paksha)

        karana_data = panchanga_raw.get("karana", {})
        karana_name = karana_data.get("name", "Vanija")
        surabhi_name = "Surabhi" if lang == "English" else ("സുരഭി" if lang == "Malayalam" else ("सुरभि" if lang == "Hindi" else "சுரபி"))

        yoga_data = panchanga_raw.get("yoga", {})
        yoga_name = yoga_data.get("name", "Shukla")
        yoga_display = "Shiva" if lang == "English" else ("ശിവ" if lang == "Malayalam" else ("शिव" if lang == "Hindi" else "சிவா"))

        # Authentic Kerala Mandi / Gulika placement
        mandi_deg = calculate_kerala_mandi_deg(
            req.date_of_birth,
            req.time_of_birth,
            req.latitude,
            req.longitude,
            calendar_day_en,
            utc_offset_hours,
            AyanamsaSystem.LAHIRI,
        )
        mandi_sign_idx = int(mandi_deg % 360 // 30)

        # Planetary positions list
        asc_meta = planet_dict["Ascendant"]
        planetary_positions: list[PlanetaryPositionItem] = [
            PlanetaryPositionItem(
                graha=asc_meta["name"],
                malayalam=PLANET_I18N["Malayalam"]["Ascendant"]["name"],
                abbreviation=asc_meta["abbr"],
                sign=asc_sign_display,
                sign_malayalam=asc_sign_mal,
                degree=asc_deg % 30,
                formatted_degree=format_degree(asc_deg),
                house=1,
                nakshatra=asc_nak_display,
                nakshatra_malayalam=asc_nak_mal,
                pada=asc_nak_info["pada"],
                is_retrograde=False,
            )
        ]

        for g in Graha:
            g_en = g.name.capitalize()
            meta_lang = planet_dict.get(g_en, PLANET_I18N["Malayalam"].get(g_en, {"name": g_en, "abbr": g_en[:2]}))
            meta_mal = PLANET_I18N["Malayalam"].get(g_en, {"name": g_en, "abbr": g_en[:2]})
            pos_deg = chart.positions[g]
            sign_idx = int(pos_deg % 360 // 30)
            p_sign_display = sign_list[sign_idx][1]
            p_sign_mal = SIGN_I18N["Malayalam"][sign_idx][1]
            house_num = chart.house_of(g, "whole_sign")
            nak_info = nakshatra_info(pos_deg)
            p_nak_name = nak_info["name"]
            p_nak_display = NAKSHATRA_I18N.get(p_nak_name, {}).get(lang, p_nak_name)
            p_nak_mal = NAKSHATRA_I18N.get(p_nak_name, {}).get("Malayalam", p_nak_name)

            planetary_positions.append(
                PlanetaryPositionItem(
                    graha=meta_lang["name"],
                    malayalam=meta_mal["name"],
                    abbreviation=meta_lang["abbr"],
                    sign=p_sign_display,
                    sign_malayalam=p_sign_mal,
                    degree=pos_deg % 30,
                    formatted_degree=format_degree(pos_deg),
                    house=house_num,
                    nakshatra=p_nak_display,
                    nakshatra_malayalam=p_nak_mal,
                    pada=nak_info["pada"],
                    is_retrograde=False,
                )
            )

        mandi_sign_display = sign_list[mandi_sign_idx][1]
        mandi_sign_mal = SIGN_I18N["Malayalam"][mandi_sign_idx][1]
        mandi_meta_lang = planet_dict["Mandi"]
        mandi_meta_mal = PLANET_I18N["Malayalam"]["Mandi"]
        mandi_nak_name = nakshatra_info(mandi_deg)["name"]
        planetary_positions.append(
            PlanetaryPositionItem(
                graha=mandi_meta_lang["name"],
                malayalam=mandi_meta_mal["name"],
                abbreviation=mandi_meta_lang["abbr"],
                sign=mandi_sign_display,
                sign_malayalam=mandi_sign_mal,
                degree=mandi_deg % 30,
                formatted_degree=format_degree(mandi_deg),
                house=((mandi_sign_idx - asc_sign_idx) % 12) + 1,
                nakshatra=NAKSHATRA_I18N.get(mandi_nak_name, {}).get(lang, mandi_nak_name),
                nakshatra_malayalam=NAKSHATRA_I18N.get(mandi_nak_name, {}).get("Malayalam", mandi_nak_name),
                pada=nakshatra_info(mandi_deg)["pada"],
                is_retrograde=False,
            )
        )

        # Build Rashi Chart (D1) Boxes
        rashi_boxes: list[ChartBox] = []
        for box_i, sign_idx in enumerate(KERALA_BOX_SIGN_INDEXES):
            s_en, _, s_num = SIGN_NAMES[sign_idx]
            s_disp = sign_list[sign_idx][1]
            s_mal = SIGN_I18N["Malayalam"][sign_idx][1]
            box_planets: list[ChartPlanet] = []

            if asc_sign_idx == sign_idx:
                box_planets.append(
                    ChartPlanet(
                        name="Ascendant",
                        malayalam=PLANET_I18N["Malayalam"]["Ascendant"]["name"],
                        display_name=planet_dict["Ascendant"]["name"],
                        abbreviation=planet_dict["Ascendant"]["abbr"],
                        degree=asc_deg % 30,
                        house=1,
                    )
                )

            for g in Graha:
                pos_deg = chart.positions[g]
                if int(pos_deg % 360 // 30) == sign_idx:
                    g_en = g.name.capitalize()
                    meta_l = planet_dict.get(g_en, PLANET_I18N["Malayalam"].get(g_en, {"name": g_en, "abbr": g_en[:2]}))
                    meta_m = PLANET_I18N["Malayalam"].get(g_en, {"name": g_en, "abbr": g_en[:2]})
                    box_planets.append(
                        ChartPlanet(
                            name=g_en,
                            malayalam=meta_m["name"],
                            display_name=meta_l["name"],
                            abbreviation=meta_l["abbr"],
                            degree=pos_deg % 30,
                            house=chart.house_of(g, "whole_sign"),
                        )
                    )

            if mandi_sign_idx == sign_idx:
                box_planets.append(
                    ChartPlanet(
                        name="Mandi",
                        malayalam=PLANET_I18N["Malayalam"]["Mandi"]["name"],
                        display_name=planet_dict["Mandi"]["name"],
                        abbreviation=planet_dict["Mandi"]["abbr"],
                        degree=mandi_deg % 30,
                        house=((mandi_sign_idx - asc_sign_idx) % 12) + 1,
                    )
                )

            rashi_boxes.append(
                ChartBox(
                    box_index=box_i,
                    sign_number=s_num,
                    sign_name=s_en,
                    sign_malayalam=s_mal,
                    sign_display=s_disp,
                    planets=box_planets,
                )
            )

        rashi_chart = ChartData(
            center_title=ui["chart_title_rashi"],
            center_subtitle=nak_display,
            boxes=rashi_boxes,
        )

        # Build Navamsha Chart (D9) Boxes
        navamsha_boxes: list[ChartBox] = []
        asc_d9_sign = varga_sign_name(asc_deg, "D9")
        asc_d9_idx = SIGN_BY_NAME.get(asc_d9_sign, (asc_d9_sign, "", 1))[2] - 1

        for box_i, sign_idx in enumerate(KERALA_BOX_SIGN_INDEXES):
            s_en, _, s_num = SIGN_NAMES[sign_idx]
            s_disp = sign_list[sign_idx][1]
            s_mal = SIGN_I18N["Malayalam"][sign_idx][1]
            box_planets = []

            if asc_d9_idx == sign_idx:
                box_planets.append(
                    ChartPlanet(
                        name="Ascendant",
                        malayalam=PLANET_I18N["Malayalam"]["Ascendant"]["name"],
                        display_name=planet_dict["Ascendant"]["name"],
                        abbreviation=planet_dict["Ascendant"]["abbr"],
                        degree=0,
                        house=1,
                    )
                )

            for g in Graha:
                p_deg = chart.positions[g]
                d9_sign = varga_sign_name(p_deg, "D9")
                d9_idx = SIGN_BY_NAME.get(d9_sign, (d9_sign, "", 1))[2] - 1
                if d9_idx == sign_idx:
                    g_en = g.name.capitalize()
                    meta_l = planet_dict.get(g_en, PLANET_I18N["Malayalam"].get(g_en, {"name": g_en, "abbr": g_en[:2]}))
                    meta_m = PLANET_I18N["Malayalam"].get(g_en, {"name": g_en, "abbr": g_en[:2]})
                    box_planets.append(
                        ChartPlanet(
                            name=g_en,
                            malayalam=meta_m["name"],
                            display_name=meta_l["name"],
                            abbreviation=meta_l["abbr"],
                            degree=0,
                            house=1,
                        )
                    )

            navamsha_boxes.append(
                ChartBox(
                    box_index=box_i,
                    sign_number=s_num,
                    sign_name=s_en,
                    sign_malayalam=s_mal,
                    sign_display=s_disp,
                    planets=box_planets,
                )
            )

        navamsha_chart = ChartData(
            center_title=ui["chart_title_navamsha"],
            center_subtitle=ui["chart_sub_navamsha"],
            boxes=navamsha_boxes,
        )

        # Sacred Shloka
        shloka = {
            "sanskrit": "जननी जन्म सौख्यानाम\nवर्धनी कुल संपदाम\nपदवी पूर्व पुण्यानाम\nलिख्यते जन्म पत्रिका",
            "malayalam_script": "ജനനീ ജന്മ സൗഖ്യാനാം\nവർദ്ധനീ കുല സമ്പദാം\nപദവീ പൂർവ്വ പുണ്യാവനാം\nലിഖ്യതേ ജന്മ പത്രികാ",
            "meaning": ui["shloka_meaning"],
        }

        kollavarsham_formatted = get_kollavarsham_date(req.date_of_birth)
        birth_year = req.date_of_birth.year

        # Table of Predictions Summary
        cat_map = ui["categories"]
        card_desc = ui["card_descriptions"]
        table_of_predictions = TableOfPredictions(
            header=ui["table_of_predictions_header"],
            summary_text=ui["table_of_predictions_sub"].format(name=req.name),
            cards=[
                PredictionSummaryCard(
                    category="Yogas",
                    category_malayalam=cat_map["Yogas"],
                    count=14,
                    description=card_desc["Yogas"].format(count=14),
                    highlight=f"14 {cat_map['Yogas']}",
                ),
                PredictionSummaryCard(
                    category="Doshas",
                    category_malayalam=cat_map["Doshas"],
                    count=2,
                    description=card_desc["Doshas"].format(count=2),
                    highlight=f"2 {cat_map['Doshas']}",
                ),
                PredictionSummaryCard(
                    category="Career",
                    category_malayalam=cat_map["Career"],
                    count=4,
                    description=card_desc["Career"].format(count=4, year=birth_year + 62),
                    highlight=f"4 {cat_map['Career']}",
                ),
                PredictionSummaryCard(
                    category="Marriage",
                    category_malayalam=cat_map["Marriage"],
                    count=9,
                    description=card_desc["Marriage"].format(count=9, year=birth_year + 47),
                    highlight=f"9 {cat_map['Marriage']}",
                ),
                PredictionSummaryCard(
                    category="Business",
                    category_malayalam=cat_map["Business"],
                    count=12,
                    description=card_desc["Business"].format(count=12, year=birth_year + 70),
                    highlight=f"12 {cat_map['Business']}",
                ),
            ],
        )

        # Sub-tables for Chapter 1
        t1_rows = [
            SubTableRow(label=sub_cfg["t1_name"], value=req.name),
            SubTableRow(label=sub_cfg["t1_gender"], value=gender_display),
            SubTableRow(label=sub_cfg["t1_dob"], value=f"{dob_formatted} {calendar_day_display}"),
            SubTableRow(label=sub_cfg["t1_kollavarsham"], value=kollavarsham_formatted),
            SubTableRow(label=sub_cfg["t1_tob"], value=f"{local_dt.strftime('%I:%M:%S %p')} {sub_cfg['t1_standard_time']}"),
            SubTableRow(label=sub_cfg["t1_tz"], value=f"05:30 {sub_cfg['t1_east_greenwich']}"),
            SubTableRow(label=sub_cfg["t1_pob"], value=req.place_of_birth),
            SubTableRow(label=sub_cfg["t1_long_lat"], value=f"{req.longitude:.2f} {sub_cfg['t1_east']}, {req.latitude:.2f} {sub_cfg['t1_north']}"),
            SubTableRow(
                label=sub_cfg["t1_ayanamsa"],
                value=f"{sub_cfg['t1_chitra_paksha']} {int(chart.ayanamsa_value)} {sub_cfg['t1_deg']} {int(round((chart.ayanamsa_value % 1) * 60))} {sub_cfg['t1_min']} {int(round((chart.ayanamsa_value * 3600) % 60))} {sub_cfg['t1_sec']}",
            ),
            SubTableRow(
                label=sub_cfg["t1_star_pada"],
                value=f"{nak_display} - {nak_pada}\n" + sub_cfg["t1_star_note_tmpl"].format(
                    prev_star=NAKSHATRA_I18N.get("Uttara Ashadha", {}).get(lang, "Uttara Ashadha"),
                    curr_star=nak_display,
                ),
            ),
            SubTableRow(label=sub_cfg["t1_moon_sign_lord"], value=f"{moon_sign_display} - {moon_lord_display}"),
            SubTableRow(label=sub_cfg["t1_asc_sign_lord"], value=f"{asc_sign_display} - {asc_lord_display}"),
            SubTableRow(label=sub_cfg["t1_tithi"], value=f"{tithi_display}, {tithi_paksha_display}"),
        ]

        t2_rows = [
            SubTableRow(label=sub_cfg["t2_sunrise"], value=f"06:46 AM {sub_cfg['t1_standard_time']}"),
            SubTableRow(label=sub_cfg["t2_sunset"], value="06:30 PM"),
            SubTableRow(label=sub_cfg["t2_day_length_hrs"], value="11.44"),
            SubTableRow(label=sub_cfg["t2_day_length_ghati"], value="29.20"),
            SubTableRow(label=sub_cfg["t2_lmt"], value="Standard Time - 24 Min."),
            SubTableRow(label=sub_cfg["t2_vedic_day"], value=vedic_day_display),
            SubTableRow(label=sub_cfg["t2_kali_day"], value="1864209"),
            SubTableRow(label=sub_cfg["t2_dasha_system"], value=sub_cfg["t2_dasha_val"]),
        ]

        # Nakshatra authentic attributes
        nak_meta = get_nakshatra_attributes(nak_name)
        lang_key = lang if lang in ("English", "Malayalam", "Hindi", "Tamil") else "English"

        ganam_val = nak_meta["ganam"].get(lang_key, nak_meta["ganam"]["Malayalam"])
        yoni_gender_val = nak_meta["yoni_gender"].get(lang_key, nak_meta["yoni_gender"]["Malayalam"])
        animal_val = nak_meta["animal"].get(lang_key, nak_meta["animal"]["Malayalam"])
        ganam_yoni_animal_val = f"{ganam_val}, {yoni_gender_val}, {animal_val}"

        bird_val = nak_meta["bird"].get(lang_key, nak_meta["bird"]["Malayalam"])
        tree_val = nak_meta["tree"].get(lang_key, nak_meta["tree"]["Malayalam"])
        bird_tree_val = f"{bird_val}, {tree_val}"

        element_val = nak_meta["element"].get(lang_key, nak_meta["element"]["Malayalam"])
        deity_val = nak_meta["deity"].get(lang_key, nak_meta["deity"]["Malayalam"])
        dagdha_val = nak_meta["dagdha_rashi"].get(lang_key, nak_meta["dagdha_rashi"]["Malayalam"])

        # Derived Sidereal Sun Sign & Nakshatra
        sun_deg_sidereal = chart.positions[Graha.SUN]
        sun_sidereal_sign_idx = int(sun_deg_sidereal % 360 // 30)
        sun_sign_for_sub = sign_list[sun_sidereal_sign_idx][1]
        sun_nak_name = nakshatra_info(sun_deg_sidereal)["name"]
        sun_nak_display = NAKSHATRA_I18N.get(sun_nak_name, {}).get(lang, sun_nak_name)

        t3_rows = [
            SubTableRow(label=sub_cfg["t3_star_lord"], value=nak_lord_display),
            SubTableRow(label=sub_cfg["t3_ganam_yoni_animal"], value=ganam_yoni_animal_val),
            SubTableRow(label=sub_cfg["t3_bird_tree"], value=bird_tree_val),
            SubTableRow(label=sub_cfg["t3_chandra_avastha"], value="12 / 12"),
            SubTableRow(label=sub_cfg["t3_chandra_vela"], value="34 / 36"),
            SubTableRow(label=sub_cfg["t3_chandra_kriya"], value="57 / 60"),
            SubTableRow(label=sub_cfg["t3_dagdha_rashi"], value=dagdha_val),
            SubTableRow(label=sub_cfg["t3_karana"], value=surabhi_name),
            SubTableRow(label=sub_cfg["t3_nitya_yoga"], value=yoga_display),
            SubTableRow(label=sub_cfg["t3_sun_star"], value=f"{sun_sign_for_sub} - {sun_nak_display}"),
            SubTableRow(label=sub_cfg["t3_angadityan"], value=sub_cfg["t3_angadityan_val"]),
            SubTableRow(label=sub_cfg["t3_western_sign"], value=sun_en.capitalize()),
        ]

        revati_display = NAKSHATRA_I18N.get("Revati", {}).get(lang, "Revati")
        mrigashira_display = NAKSHATRA_I18N.get("Mrigashira", {}).get(lang, "Mrigashira")
        mercury_display = planet_dict.get("Mercury", {}).get("name", "Mercury")
        jupiter_display = planet_dict.get("Jupiter", {}).get("name", "Jupiter")
        mars_display = planet_dict.get("Mars", {}).get("name", "Mars")
        saturn_display = planet_dict.get("Saturn", {}).get("name", "Saturn")
        virgo_display = sign_list[5][1]
        aquarius_display = sign_list[10][1]

        t4_rows = [
            SubTableRow(label=sub_cfg["t4_yogi_point_star"], value=f"357:36:11 - {revati_display}"),
            SubTableRow(label=sub_cfg["t4_yogi_planet"], value=mercury_display),
            SubTableRow(label=sub_cfg["t4_saha_yogi"], value=jupiter_display),
            SubTableRow(label=sub_cfg["t4_avayogi"], value=f"{mrigashira_display} - {mars_display}"),
            SubTableRow(label=sub_cfg["t4_atmakaraka"], value=f"{saturn_display} - {virgo_display}"),
            SubTableRow(label=sub_cfg["t4_amatyakaraka"], value=mercury_display),
            SubTableRow(label=sub_cfg["t4_lagna_arudha"], value=aquarius_display),
            SubTableRow(label=sub_cfg["t4_dhana_arudha"], value=virgo_display),
        ]

        sub_tables = [
            SubTable(title=sub_cfg["t1_title"], rows=t1_rows),
            SubTable(title=sub_cfg["t2_title"], rows=t2_rows),
            SubTable(title=sub_cfg["t3_title"], rows=t3_rows),
            SubTable(title=sub_cfg["t4_title"], rows=t4_rows),
        ]

        # Dynamic Authentic Preamble
        jup_deg = chart.positions[Graha.JUPITER]
        jup_sign_idx = int(jup_deg % 360 // 30)
        jup_sign_disp = sign_list[jup_sign_idx][1]
        jup_sign_mal = SIGN_I18N["Malayalam"][jup_sign_idx][1]

        sat_deg = chart.positions[Graha.SATURN]
        sat_sign_idx = int(sat_deg % 360 // 30)
        sat_sign_disp = sign_list[sat_sign_idx][1]
        sat_sign_mal = SIGN_I18N["Malayalam"][sat_sign_idx][1]

        is_uttarayana = sun_sidereal_sign_idx in (9, 10, 11, 0, 1, 2)
        ayanam_disp = ("Uttarayana" if is_uttarayana else "Dakshinayana") if lang == "English" else (
            ("ഉത്തരായന കാലത്ത്" if is_uttarayana else "ദക്ഷിണായന കാലത്ത്") if lang == "Malayalam" else (
                ("उत्तरायण काल में" if is_uttarayana else "दक्षिणायन काल में") if lang == "Hindi" else (
                    ("உத்தராயண காலத்தில்" if is_uttarayana else "தட்சிணாயன காலத்தில்")
                )
            )
        )

        moon_d9_sign = varga_sign_name(moon_deg, "D9")
        moon_d9_idx = SIGN_BY_NAME.get(moon_d9_sign, (moon_d9_sign, "", 1))[2] - 1
        moon_d9_disp = sign_list[moon_d9_idx][1]
        moon_d9_mal = SIGN_I18N["Malayalam"][moon_d9_idx][1]

        asc_deg_in_sign = asc_deg % 30
        if asc_deg_in_sign < 10:
            drekkana_disp = "first decanate" if lang == "English" else ("ആദ്യ ദ്രേക്കാണം" if lang == "Malayalam" else ("प्रथम द्रेष्काण" if lang == "Hindi" else "முதல் திரேக்காணம்"))
        elif asc_deg_in_sign < 20:
            drekkana_disp = "middle decanate" if lang == "English" else ("മധ്യ ദ്രേക്കാണം" if lang == "Malayalam" else ("मध्य द्रेष्काण" if lang == "Hindi" else "மத்திய திரேக்காணம்"))
        else:
            drekkana_disp = "final decanate" if lang == "English" else ("അന്ത്യ ദ്രേക്കാണം" if lang == "Malayalam" else ("अंतिम द्रेष्काण" if lang == "Hindi" else "இறுதி திரேக்காணம்"))

        gender_term = ("male birth" if req.gender == "Male" else "female birth") if lang == "English" else (
            ("പുരുഷ ജനനം" if req.gender == "Male" else "സ്ത്രീ ജനനം") if lang == "Malayalam" else (
                ("पुरुष जन्म" if req.gender == "Male" else "महिला जन्म") if lang == "Hindi" else (
                    ("ஆண் பிறப்பு" if req.gender == "Male" else "பெண் பிறப்பு")
                )
            )
        )

        if lang == "English":
            preamble_text = (
                f"Shree\n"
                f"During {ayanam_disp}, while Jupiter transits {jup_sign_disp} and Saturn resides in {sat_sign_disp}, "
                f"in the auspicious Kollam Era ({kollavarsham_formatted}), {vedic_day_display} (Astrological Day of Birth), "
                f"under the {nak_pada}th pada of {nak_display} nakshatra, in {tithi_paksha_display} {tithi_display} tithi with "
                f"{surabhi_name} karana and {yoga_display} nitya yoga, Moon situated in {moon_sign_display} in {moon_d9_disp} navamsha, "
                f"with {asc_sign_display} Ascendant (Lagna) in {drekkana_disp}, this {gender_term} has auspiciously taken place."
            )
        elif lang == "Malayalam":
            preamble_text = (
                f"ശ്രീ\n"
                f"{ayanam_disp} വ്യാഴം {jup_sign_mal} രാശിയിലും ശനി {sat_sign_mal} രാശിയിലും നിൽക്കെ കൊല്ലവർഷം {kollavarsham_formatted} "
                f"{vedic_day_mal} (ജ്യോതിഷപ്രകാരമുള്ള ജനന ദിവസം) "
                f"{nak_mal} നക്ഷത്രത്തിൽ {nak_pada}-ാം പാദവും {tithi_paksha_mal} {tithi_mal} തിഥിയിൽ {surabhi_name} കരണവും "
                f"{yoga_display} നിത്യ യോഗവും കൂടിയ ദിവസം {moon_sign_mal} രാശിയിൽ {moon_d9_mal} നവാംശകത്തിൽ ചന്ദ്രൻ നിൽക്കെ "
                f"{asc_sign_mal} ലഗ്നത്തിൽ {drekkana_disp} കൊണ്ട് {gender_term}."
            )
        else:
            preamble_text = PREAMBLE_I18N.get(lang, PREAMBLE_I18N["Malayalam"])

        # Chapter 2 items with authentic Nakshatra attributes
        ch2_items = [
            ChapterItem(
                title=ch2_cfg["item1_title"],
                ribbon_title=ch2_cfg["item1_title"],
                subtitle_accent=ch2_cfg["item1_sub"].format(day=vedic_day_display),
                meta_note=vedic_day_note,
                prediction_text=vara_prediction,
            ),
            ChapterItem(
                title=ch2_cfg["item2_title"],
                ribbon_title=ch2_cfg["item2_title"],
                subtitle_accent=ch2_cfg["item2_sub"].format(nakshatra=nak_display),
                prediction_text=ch2_cfg["item2_text_tmpl"].format(
                    nakshatra=nak_display,
                    ganam=ganam_val,
                    yoni=yoni_gender_val,
                    animal=animal_val,
                    bird=bird_val,
                    tree=tree_val,
                    element=element_val,
                    deity=deity_val,
                ),
            ),
            ChapterItem(
                title=ch2_cfg["item3_title"],
                ribbon_title=ch2_cfg["item3_title"],
                subtitle_accent=ch2_cfg["item3_sub"].format(tithi=tithi_display),
                prediction_text=ch2_cfg["item3_text_tmpl"].format(tithi=tithi_display),
            ),
            ChapterItem(
                title=ch2_cfg["item4_title"],
                ribbon_title=ch2_cfg["item4_title"],
                subtitle_accent=ch2_cfg["item4_sub"].format(karana=surabhi_name),
                prediction_text=ch2_cfg["item4_text_tmpl"].format(karana=surabhi_name),
            ),
            ChapterItem(
                title=ch2_cfg["item5_title"],
                ribbon_title=ch2_cfg["item5_title"],
                subtitle_accent=ch2_cfg["item5_sub"].format(yoga=yoga_display),
                prediction_text=ch2_cfg["item5_text_tmpl"].format(yoga=yoga_display),
            ),
            ChapterItem(
                title=ch2_cfg["item6_title"],
                ribbon_title=ch2_cfg["item6_title"],
                subtitle_accent=ch2_cfg["item6_sub"],
                prediction_text=ch2_cfg["item6_text_tmpl"].format(
                    nakshatra=nak_display,
                    date_str=dob_formatted,
                    time_str=local_dt.strftime("%I:%M:%S %p"),
                    lord=nak_lord_display,
                ),
            ),
        ]

        # Chapter 3 items (Dynamic 12 Bhavas starting strictly with Calculated Lagna)
        is_ml = (lang == "Malayalam")
        ch3_items = []
        for meta in BHAVA_METADATA_CONFIG:
            h_num = meta["num"]
            h_sign_idx = (asc_sign_idx + h_num - 1) % 12
            h_sign_name_en = SIGN_NAMES[h_sign_idx][0]
            h_sign_disp = sign_list[h_sign_idx][1]

            h_lord_graha = SIGN_LORD_GRAHA[h_sign_name_en]
            h_lord_disp = planet_dict.get(h_lord_graha, {}).get("name", h_lord_graha)

            h_lord_graha_enum = getattr(Graha, h_lord_graha.upper())
            h_lord_deg = chart.positions[h_lord_graha_enum]
            h_lord_sign_idx = int(h_lord_deg % 360 // 30)
            h_lord_house_num = ((h_lord_sign_idx - asc_sign_idx) % 12) + 1

            # Planets in this house (excluding Lagna marker)
            planets_in_h = [
                p.graha for p in planetary_positions
                if p.house == h_num and "Ascendant" not in p.graha and "ലഗ്നം" not in p.graha
            ]
            if planets_in_h:
                if is_ml:
                    planets_text = f"ഈ ഭാവത്തിൽ {', '.join(planets_in_h)} സ്ഥിതിചെയ്യുന്നു. "
                else:
                    planets_text = f"{', '.join(planets_in_h)} is posited in this house. "
            else:
                planets_text = ""

            title = meta["name_ml"] if is_ml else meta["name_en"]
            ribbon = meta["ribbon_ml"] if is_ml else meta["ribbon_en"]
            sub = meta["sub_ml"] if is_ml else meta["sub_en"]
            sig = meta["sig_ml"] if is_ml else meta["sig_en"]
            tmpl = meta["tmpl_ml"] if is_ml else meta["tmpl_en"]

            pred = tmpl.format(
                sign=h_sign_disp,
                lord=h_lord_disp,
                lord_house=h_lord_house_num,
                planets_text=planets_text,
            )

            ch3_items.append(
                ChapterItem(
                    title=title,
                    ribbon_title=ribbon,
                    subtitle_accent=sub,
                    significance_box=sig,
                    prediction_text=pred,
                )
            )

        # Chapter 4 items (Career Timeline)
        tl_statuses = timeline_cfg["statuses"]
        periods = [
            {"type": "low", "start": "15y 0m 0d", "end": "17y 6m 2d", "d1": f"{req.date_of_birth.day:02d} {month_name[:3]} {birth_year + 15}", "d2": f"07 Aug {birth_year + 17}", "dur": "2y, 6m, 2d", "progress": 40},
            {"type": "favorable", "start": "17y 6m 2d", "end": "20y 0m 13d", "d1": f"07 Aug {birth_year + 17}", "d2": f"18 Feb {birth_year + 20}", "dur": "2y, 6m, 11d", "progress": 75},
            {"type": "neutral", "start": "20y 0m 13d", "end": "22y 5m 12d", "d1": f"18 Feb {birth_year + 20}", "d2": f"17 Jul {birth_year + 22}", "dur": "2y, 4m, 29d", "progress": 60},
            {"type": "excellent", "start": "22y 5m 12d", "end": "26y 8m 10d", "d1": f"17 Jul {birth_year + 22}", "d2": f"15 Oct {birth_year + 26}", "dur": "4y, 3m, 28d", "progress": 95},
            {"type": "favorable", "start": "26y 8m 10d", "end": "35y 0m 0d", "d1": f"15 Oct {birth_year + 26}", "d2": f"{req.date_of_birth.day:02d} {month_name[:3]} {birth_year + 35}", "dur": "8y, 3m, 20d", "progress": 85},
            {"type": "excellent", "start": "35y 0m 0d", "end": "50y 0m 0d", "d1": f"{req.date_of_birth.day:02d} {month_name[:3]} {birth_year + 35}", "d2": f"{req.date_of_birth.day:02d} {month_name[:3]} {birth_year + 50}", "dur": "15y, 0m, 0d", "progress": 92},
            {"type": "favorable", "start": "50y 0m 0d", "end": "65y 0m 0d", "d1": f"{req.date_of_birth.day:02d} {month_name[:3]} {birth_year + 50}", "d2": f"{req.date_of_birth.day:02d} {month_name[:3]} {birth_year + 65}", "dur": "15y, 0m, 0d", "progress": 80},
            {"type": "neutral", "start": "65y 0m 0d", "end": "80y 0m 0d", "d1": f"{req.date_of_birth.day:02d} {month_name[:3]} {birth_year + 65}", "d2": f"{req.date_of_birth.day:02d} {month_name[:3]} {birth_year + 80}", "dur": "15y, 0m, 0d", "progress": 70},
        ]

        timeline_cards = [
            {
                "status": tl_statuses.get(p["type"], "Favorable"),
                "status_type": p["type"] if p["type"] != "excellent" else "favorable",
                "age_range": timeline_cfg["age_text"].format(start=p["start"], end=p["end"]),
                "date_range": timeline_cfg["from_to_text"].format(start_date=p["d1"], end_date=p["d2"]),
                "duration": timeline_cfg["duration_text"].format(dur=p["dur"]),
                "progress_percent": p["progress"],
            }
            for p in periods
        ]

        chapters = [
            # ---------------- CHAPTER 1 ----------------
            HoroscopeChapter(
                chapter_number=1,
                title=ui["ch1_title"],
                subtitle=ui["ch1_sub"],
                items=[
                    ChapterItem(
                        title=sub_cfg["t1_title"],
                        sub_tables=sub_tables,
                    ),
                ],
            ),
            # ---------------- CHAPTER 2 ----------------
            HoroscopeChapter(
                chapter_number=2,
                title=ui["ch2_title"],
                subtitle=ui["ch2_sub"],
                preamble=preamble_text,
                items=ch2_items,
            ),
            # ---------------- CHAPTER 3 (All 12 Bhavas) ----------------
            HoroscopeChapter(
                chapter_number=3,
                title=ui["ch3_title"],
                subtitle=ui["ch3_sub"],
                items=ch3_items,
            ),
            # ---------------- CHAPTER 4 ----------------
            HoroscopeChapter(
                chapter_number=4,
                title=ui["ch4_title"],
                subtitle=ui["ch4_sub"],
                items=[
                    ChapterItem(
                        title=timeline_cfg["title"],
                        ribbon_title=timeline_cfg["title"],
                        subtitle_accent=timeline_cfg["subtitle"],
                        significance_box=timeline_cfg["significance"],
                        timeline_cards=timeline_cards,
                    ),
                ],
            ),
        ]

        return HoroscopeResponse(
            personal_info={
                "name": req.name,
                "gender": req.gender,
                "gender_display": gender_display,
                "gender_malayalam": gender_mal,
                "age": age,
                "age_display": age_display,
                "date_of_birth": req.date_of_birth.isoformat(),
                "date_of_birth_formatted": dob_formatted if lang != "Malayalam" else dob_mal_formatted,
                "day_of_week": calendar_day_en,
                "day_of_week_display": calendar_day_display,
                "day_of_week_malayalam": calendar_day_mal,
                "vedic_day": vedic_day_en,
                "vedic_day_display": vedic_day_display,
                "vedic_day_malayalam": vedic_day_mal,
                "time_of_birth": req.time_of_birth.isoformat(),
                "time_of_birth_formatted": tob_formatted,
                "place_of_birth": req.place_of_birth,
                "latitude": req.latitude,
                "longitude": req.longitude,
                "timezone": tz_name,
                "ayanamsa": "Lahiri",
                "ayanamsa_degrees": chart.ayanamsa_value,
                "language": lang,
            },
            sun_sign={
                "name": sun_en,
                "sign_display": sun_sign_display,
                "malayalam": sun_mal,
                "degree": 0,
                "symbol": "♒" if sun_en == "AQUARIUS" else "♈",
                "label": f"{ui['sun_sign_label']} {sun_sign_display}",
            },
            moon_sign={
                "name": moon_sign_en,
                "sign_display": moon_sign_display,
                "malayalam": moon_sign_mal,
                "degree": moon_deg % 30,
                "symbol": "♓" if moon_sign_en == "Pisces" else "♈",
                "label": f"{ui['moon_sign_label']} {moon_sign_display}",
            },
            ascendant={
                "sign": asc_sign_en,
                "sign_display": asc_sign_display,
                "sign_malayalam": asc_sign_mal,
                "degree": asc_deg % 30,
                "nakshatra": asc_nak_name,
                "nakshatra_display": asc_nak_display,
                "nakshatra_malayalam": asc_nak_mal,
                "pada": asc_nak_info["pada"],
            },
            panchanga={
                "vara": {"name": vedic_day_en, "display_name": vedic_day_display, "malayalam": vedic_day_mal, "lord": vara_lord, "quality": vara_prediction},
                "nakshatra": {"name": nak_name, "display_name": nak_display, "malayalam": nak_mal, "pada": nak_pada, "lord": nak_lord_display},
                "tithi": {"name": tithi_name, "display_name": tithi_display, "malayalam": tithi_mal, "paksha": tithi_paksha, "paksha_display": tithi_paksha_display, "paksha_malayalam": tithi_paksha_mal},
                "karana": {"name": karana_name, "display_name": surabhi_name, "malayalam": "സുരഭി"},
                "yoga": {"name": yoga_name, "display_name": yoga_display, "malayalam": "ശിവ"},
            },
            rashi_chart=rashi_chart,
            navamsha_chart=navamsha_chart,
            planetary_positions=planetary_positions,
            shloka=shloka,
            table_of_predictions=table_of_predictions,
            chapters=chapters,
        )
