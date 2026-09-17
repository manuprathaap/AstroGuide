from datetime import date, time

from app.astrology.analysis.marriage import (
    analyze_marriage_chart,
    build_marriage_analysis,
    get_marriage_timing_factors,
    get_seventh_house_sign,
    get_sign_lord,
)

from app.astrology.types import (
    AstrologyMarriageAnalysis,
    AstrologyMarriageFactor,
    AstrologyMarriageTimingWindow,
)
from app.astrology.analysis.rules import evaluate_marriage_factors
from app.astrology.analysis.houses import (
    get_house_lord,
    get_house_sign,
    get_planet_house,
    get_planets_in_house,
)
from app.astrology.calculator import AstrologyCalculator
from app.models.birth_detail import BirthDetail


def kochi_birth() -> BirthDetail:
    return BirthDetail(
        user_id=1,
        date_of_birth=date(1998, 5, 10),
        time_of_birth=time(10, 30),
        place_of_birth="Kochi",
        latitude=9.9312,
        longitude=76.2673,
        timezone="Asia/Kolkata",
    )


def test_seventh_house_sign():
    assert get_seventh_house_sign("Aries") == "Libra"
    assert get_seventh_house_sign("Taurus") == "Scorpio"
    assert get_seventh_house_sign("Libra") == "Aries"


def test_sign_lords():
    assert get_sign_lord("Aries") == "Mars"
    assert get_sign_lord("Libra") == "Venus"
    assert get_sign_lord("Sagittarius") == "Jupiter"


def test_house_analysis_utilities():
    chart = AstrologyCalculator().calculate_birth_chart(kochi_birth())

    assert get_house_sign(chart, 7) == "Gemini"
    assert get_house_lord(chart, 7) == "Mercury"
    assert get_planet_house(chart, "Moon") == 11
    assert [planet.graha for planet in get_planets_in_house(chart, 5)] == [
        "Sun",
        "Mars",
        "Saturn",
    ]


def test_marriage_analysis_extracts_required_factors():
    chart = AstrologyCalculator().calculate_birth_chart(
        kochi_birth()
    )

    result = analyze_marriage_chart(chart)

    assert result["ascendant"]["sign"]
    assert result["seventh_house"]["sign"]
    assert result["seventh_house"]["lord"]

    assert result["venus"] is not None
    assert result["jupiter"] is not None
    assert result["moon"] is not None

    assert result["dasha"] is not None

def test_marriage_timing_factors():
    chart = AstrologyCalculator().calculate_birth_chart(
        kochi_birth()
    )

    result = get_marriage_timing_factors(chart)

    assert result["seventh_house"]["sign"]
    assert result["seventh_house"]["lord"]

    assert result["seventh_lord"]["graha"]
    assert result["seventh_lord"]["sign"]
    assert result["seventh_lord"]["house"] >= 1

    assert result["venus"]["sign"]
    assert result["venus"]["house"] >= 1

    assert result["jupiter"]["sign"]
    assert result["jupiter"]["house"] >= 1

    assert result["current_dasha"]["mahadasha"]
    assert result["current_dasha"]["antardasha"]

def test_marriage_analysis_schema():
    factor = AstrologyMarriageFactor(
        factor="seventh_lord",
        value="Venus",
        description="7th lord is Venus.",
    )

    analysis = AstrologyMarriageAnalysis(
        seventh_house_sign="Libra",
        seventh_house_lord="Venus",
        seventh_lord_sign="Taurus",
        seventh_lord_house=8,
        venus_sign="Taurus",
        venus_house=8,
        jupiter_sign="Gemini",
        jupiter_house=9,
        current_mahadasha="Venus",
        current_antardasha="Jupiter",
        factors=[factor],
        timing_windows=[],
    )

    assert analysis.seventh_house_lord == "Venus"
    assert analysis.current_mahadasha == "Venus"
    assert len(analysis.factors) == 1

def test_marriage_rules_generate_factors():
    chart = AstrologyCalculator().calculate_birth_chart(
        kochi_birth()
    )

    factors = evaluate_marriage_factors(chart)

    assert len(factors) >= 4

    factor_names = {
        factor.factor
        for factor in factors
    }

    assert "seventh_house" in factor_names
    assert "seventh_lord" in factor_names
    assert "venus" in factor_names
    assert "jupiter" in factor_names

def test_build_marriage_analysis():
    chart = AstrologyCalculator().calculate_birth_chart(
        kochi_birth()
    )

    result = build_marriage_analysis(chart)

    assert result.seventh_house_sign
    assert result.seventh_house_lord

    assert result.seventh_lord_sign
    assert result.seventh_lord_house is not None

    assert result.venus_sign
    assert result.venus_house is not None

    assert result.jupiter_sign
    assert result.jupiter_house is not None

    assert result.current_mahadasha
    assert result.current_antardasha

    assert len(result.factors) >= 4
    assert result.timing_windows == []