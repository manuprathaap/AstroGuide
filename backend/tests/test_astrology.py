from datetime import date, time

import pytest

from app.astrology.calculator import AstrologyCalculationError, AstrologyCalculator
from app.models.birth_detail import BirthDetail


def birth_detail(**changes) -> BirthDetail:
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


def test_valid_birth_details_produce_typed_calculation_result():
    result = AstrologyCalculator().calculate_birth_chart(birth_detail())

    assert result.birth_datetime.isoformat() == "1998-05-10T10:30:00+05:30"
    assert result.ayanamsa_system == "lahiri"
    assert 0 <= result.ascendant.longitude < 360
    assert len(result.planets) == 9
    assert len(result.houses) == 12
    assert all(0 <= planet.longitude < 360 for planet in result.planets)


@pytest.mark.parametrize(
    ("changes", "message"),
    [
        ({"latitude": None}, "latitude is required"),
        ({"longitude": None}, "longitude is required"),
        ({"latitude": 91}, "latitude must be between"),
        ({"longitude": 181}, "longitude must be between"),
        ({"timezone": None}, "timezone is required"),
    ],
)
def test_invalid_birth_details_raise_controlled_error(changes, message):
    with pytest.raises(AstrologyCalculationError, match=message):
        AstrologyCalculator().calculate_birth_chart(birth_detail(**changes))


def test_local_birth_datetime_is_preserved_before_jyotipy_conversion():
    result = AstrologyCalculator().calculate_birth_chart(birth_detail())

    assert result.birth_datetime.date() == date(1998, 5, 10)
    assert result.birth_datetime.hour == 10
    assert result.birth_datetime.minute == 30
    assert result.timezone == "Asia/Kolkata"


def test_planetary_results_are_calculated_and_not_hardcoded():
    calculator = AstrologyCalculator()
    first = calculator.calculate_birth_chart(birth_detail())
    second = calculator.calculate_birth_chart(
        birth_detail(date_of_birth=date(1998, 5, 11))
    )

    assert first.planets[0].longitude != second.planets[0].longitude


def test_calculation_does_not_import_pyswisseph():
    import sys

    assert "pyswisseph" not in sys.modules
