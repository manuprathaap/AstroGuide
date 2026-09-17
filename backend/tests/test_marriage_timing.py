from datetime import date, datetime, time

import pytest

from app.astrology.analysis.marriage import build_marriage_analysis
from app.astrology.analysis.marriage_timing import build_marriage_timing
from app.astrology.calculator import AstrologyCalculationError, AstrologyCalculator
from app.astrology.types import AstrologyChartResult
from app.models.birth_detail import BirthDetail


def kochi_birth(**changes) -> BirthDetail:
    values = {
        "user_id": 1,
        "date_of_birth": date(1998, 5, 10),
        "time_of_birth": time(10, 30),
        "place_of_birth": "Kochi",
        "latitude": 9.9312,
        "longitude": 76.2673,
        "timezone": "Asia/Kolkata",
    }
    values.update(changes)
    return BirthDetail(**values)


def calculated_chart() -> AstrologyChartResult:
    return AstrologyCalculator().calculate_birth_chart(kochi_birth())


def test_valid_birth_details_generate_timing_information():
    chart = calculated_chart()
    analysis = build_marriage_analysis(chart)

    timing = build_marriage_timing(
        chart,
        analysis,
        as_of=datetime(2026, 9, 16, 12, tzinfo=chart.dasha.current_mahadasha.start.tzinfo),
    )

    assert timing.current_period is not None
    assert timing.candidate_periods
    assert timing.supporting_factors
    assert timing.limitations


def test_current_mahadasha_and_antardasha_are_identified():
    chart = calculated_chart()
    analysis = build_marriage_analysis(chart)
    as_of = datetime(2026, 9, 16, 12, tzinfo=chart.dasha.current_mahadasha.start.tzinfo)

    current = build_marriage_timing(chart, analysis, as_of=as_of).current_period

    assert current is not None
    assert current.mahadasha_lord == "Jupiter"
    assert current.antardasha_lord == "Rahu"
    assert current.antardasha_start <= as_of < current.antardasha_end


def test_candidate_periods_are_chronological_and_valid():
    chart = calculated_chart()
    analysis = build_marriage_analysis(chart)
    timing = build_marriage_timing(
        chart,
        analysis,
        as_of=datetime(2026, 9, 16, 12, tzinfo=chart.dasha.current_mahadasha.start.tzinfo),
    )

    assert all(period.start < period.end for period in timing.candidate_periods)
    assert all(
        left.start <= right.start
        for left, right in zip(timing.candidate_periods, timing.candidate_periods[1:])
    )
    assert all(period.start.year >= 1998 for period in timing.candidate_periods)


def test_rules_use_calculated_chart_values():
    chart = calculated_chart()
    analysis = build_marriage_analysis(chart)
    timing = build_marriage_timing(chart, analysis)

    seventh_lord_factor = next(
        factor
        for factor in timing.supporting_factors
        if factor.rule == "seventh_house_lord_reference"
    )
    assert seventh_lord_factor.planet == analysis.seventh_house_lord
    assert seventh_lord_factor.value == analysis.seventh_lord_sign


@pytest.mark.parametrize(
    "changes",
    [{"latitude": None}, {"longitude": None}],
)
def test_missing_coordinates_keep_controlled_error(changes):
    with pytest.raises(AstrologyCalculationError):
        AstrologyCalculator().calculate_birth_chart(kochi_birth(**changes))


def test_missing_timezone_keeps_controlled_error():
    with pytest.raises(AstrologyCalculationError, match="timezone is required"):
        AstrologyCalculator().calculate_birth_chart(kochi_birth(timezone=None))


def test_timing_engine_does_not_import_pyswisseph():
    import sys

    assert "pyswisseph" not in sys.modules