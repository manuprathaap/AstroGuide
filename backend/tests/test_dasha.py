from datetime import date, datetime, time
from zoneinfo import ZoneInfo

from app.astrology.calculator import AstrologyCalculationError, AstrologyCalculator
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


def test_valid_birth_details_generate_dasha_information():
    result = AstrologyCalculator().calculate_birth_chart(kochi_birth())

    moon = next(
        planet
        for planet in result.planets
        if planet.graha == "Moon"
    )

    assert result.dasha.moon_nakshatra == moon.nakshatra
    assert len(result.dasha.mahadashas) > 1
    assert len(result.dasha.antardashas) == len(result.dasha.mahadashas) * 9


def test_moon_nakshatra_is_available_before_dasha_calculation():
    result = AstrologyCalculator().calculate_birth_chart(kochi_birth())

    moon = next(
        planet
        for planet in result.planets
        if planet.graha == "Moon"
    )

    assert moon.nakshatra.name == "Swati"
    assert result.dasha.moon_nakshatra.name == moon.nakshatra.name


def test_mahadasha_periods_are_ordered_chronologically():
    periods = (
        AstrologyCalculator()
        .calculate_birth_chart(kochi_birth())
        .dasha
        .mahadashas
    )

    assert all(left.start < left.end for left in periods)

    assert all(
        left.end <= right.start
        for left, right in zip(periods, periods[1:])
    )


def test_antardasha_periods_are_ordered_chronologically():
    periods = (
        AstrologyCalculator()
        .calculate_birth_chart(kochi_birth())
        .dasha
        .antardashas
    )

    assert all(left.start < left.end for left in periods)

    assert all(
        left.end <= right.start
        for left, right in zip(periods, periods[1:])
    )


def test_current_mahadasha_and_antardasha_are_identified():
    dasha = (
        AstrologyCalculator()
        .calculate_birth_chart(kochi_birth())
        .dasha
    )

    now = datetime.now(ZoneInfo("Asia/Kolkata"))

    assert dasha.current_mahadasha is not None
    assert dasha.current_mahadasha.start <= now < dasha.current_mahadasha.end

    assert dasha.current_antardasha is not None
    assert dasha.current_antardasha.start <= now < dasha.current_antardasha.end

    assert (
        dasha.current_antardasha.mahadasha_lord
        == dasha.current_mahadasha.lord
    )


def test_missing_timezone_keeps_existing_controlled_error():
    try:
        AstrologyCalculator().calculate_birth_chart(
            kochi_birth(timezone=None)
        )
    except AstrologyCalculationError as exc:
        assert str(exc) == (
            "Birth timezone is required for chart calculation."
        )
    else:
        raise AssertionError(
            "Missing timezone should fail chart calculation"
        )


def test_dasha_calculation_does_not_import_pyswisseph():
    import sys

    assert "pyswisseph" not in sys.modules