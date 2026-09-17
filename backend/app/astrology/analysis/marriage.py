from app.astrology.types import AstrologyChartResult
from app.astrology.types import AstrologyMarriageAnalysis
from app.astrology.analysis.rules import evaluate_marriage_factors
from app.astrology.analysis.houses import (
    SIGN_LORDS,
    get_house_lord,
    get_house_sign,
    get_planet,
)


SIGNS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
]


def get_sign_lord(sign: str) -> str:
    try:
        return SIGN_LORDS[sign]
    except KeyError as exc:
        raise ValueError(f"Unknown zodiac sign: {sign}") from exc


def get_seventh_house_sign(ascendant_sign: str) -> str:
    if ascendant_sign not in SIGNS:
        raise ValueError(f"Unknown ascendant sign: {ascendant_sign}")

    ascendant_index = SIGNS.index(ascendant_sign)

    # 7th house is opposite the ascendant.
    seventh_index = (ascendant_index + 6) % 12

    return SIGNS[seventh_index]


def analyze_marriage_chart(
    chart: AstrologyChartResult,
) -> dict:
    ascendant_sign = chart.ascendant.sign

    seventh_house_sign = get_house_sign(chart, 7)
    seventh_lord = get_house_lord(chart, 7)
    venus = get_planet(chart, "Venus")
    jupiter = get_planet(chart, "Jupiter")
    moon = get_planet(chart, "Moon")
    seventh_lord_position = get_planet(chart, seventh_lord)

    return {
        "ascendant": {
            "sign": ascendant_sign,
            "longitude": chart.ascendant.longitude,
        },
        "seventh_house": {
            "sign": seventh_house_sign,
            "lord": seventh_lord,
            "longitude": next(house for house in chart.houses if house.house == 7).longitude,
        },
        "seventh_lord_position": seventh_lord_position,
        "venus": venus,
        "jupiter": jupiter,
        "moon": moon,
        "dasha": chart.dasha,
    }

def get_marriage_timing_factors(chart: AstrologyChartResult) -> dict:
    analysis = analyze_marriage_chart(chart)

    seventh_house = analysis["seventh_house"]
    seventh_lord = analysis["seventh_lord_position"]
    venus = analysis["venus"]
    jupiter = analysis["jupiter"]

    current_mahadasha = chart.dasha.current_mahadasha
    current_antardasha = chart.dasha.current_antardasha

    return {
        "seventh_house": {
            "sign": seventh_house["sign"],
            "lord": seventh_house["lord"],
        },
        "seventh_lord": {
            "graha": seventh_lord.graha if seventh_lord else None,
            "sign": seventh_lord.sign if seventh_lord else None,
            "house": seventh_lord.house if seventh_lord else None,
            "degree": (
                seventh_lord.degree_in_sign
                if seventh_lord
                else None
            ),
            "nakshatra": (
                seventh_lord.nakshatra.name
                if seventh_lord
                else None
            ),
        },
        "venus": {
            "sign": venus.sign if venus else None,
            "house": venus.house if venus else None,
            "degree": venus.degree_in_sign if venus else None,
            "nakshatra": (
                venus.nakshatra.name
                if venus
                else None
            ),
        },
        "jupiter": {
            "sign": jupiter.sign if jupiter else None,
            "house": jupiter.house if jupiter else None,
            "degree": jupiter.degree_in_sign if jupiter else None,
            "nakshatra": (
                jupiter.nakshatra.name
                if jupiter
                else None
            ),
        },
        "current_dasha": {
            "mahadasha": (
                current_mahadasha.lord
                if current_mahadasha
                else None
            ),
            "antardasha": (
                current_antardasha.lord
                if current_antardasha
                else None
            ),
        },
    } 


def build_marriage_analysis(
    chart: AstrologyChartResult,
) -> AstrologyMarriageAnalysis:

    factors = evaluate_marriage_factors(chart)

    seventh_house = next(house for house in chart.houses if house.house == 7)
    seventh_lord_name = get_house_lord(chart, 7)
    seventh_lord = get_planet(chart, seventh_lord_name)
    venus = get_planet(chart, "Venus")
    jupiter = get_planet(chart, "Jupiter")

    current_mahadasha = chart.dasha.current_mahadasha
    current_antardasha = chart.dasha.current_antardasha

    return AstrologyMarriageAnalysis(
        seventh_house_sign=seventh_house.sign,
        seventh_house_lord=seventh_lord_name,

        seventh_lord_sign=(
            seventh_lord.sign
            if seventh_lord
            else None
        ),

        seventh_lord_house=(
            seventh_lord.house
            if seventh_lord
            else None
        ),

        venus_sign=venus.sign if venus else None,
        venus_house=venus.house if venus else None,

        jupiter_sign=jupiter.sign if jupiter else None,
        jupiter_house=jupiter.house if jupiter else None,

        current_mahadasha=(
            current_mahadasha.lord
            if current_mahadasha
            else None
        ),

        current_antardasha=(
            current_antardasha.lord
            if current_antardasha
            else None
        ),

        factors=factors,

        # Timing windows will be implemented next.
        timing_windows=[],
    )