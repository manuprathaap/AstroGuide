from app.astrology.types import AstrologyChartResult, AstrologyHouseCusp, AstrologyPlanetPosition


SIGN_LORDS: dict[str, str] = {
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


def get_house_sign(chart: AstrologyChartResult, house_number: int) -> str:
    return _get_house(chart, house_number).sign


def get_house_lord(chart: AstrologyChartResult, house_number: int) -> str:
    return SIGN_LORDS[get_house_sign(chart, house_number)]


def get_planets_in_house(
    chart: AstrologyChartResult,
    house_number: int,
) -> list[AstrologyPlanetPosition]:
    _validate_house_number(house_number)
    return [planet for planet in chart.planets if planet.house == house_number]


def get_planet_house(
    chart: AstrologyChartResult,
    graha: str,
) -> int | None:
    planet = next((planet for planet in chart.planets if planet.graha == graha), None)
    return planet.house if planet else None


def get_planet(chart: AstrologyChartResult, graha: str) -> AstrologyPlanetPosition | None:
    return next((planet for planet in chart.planets if planet.graha == graha), None)


def _get_house(chart: AstrologyChartResult, house_number: int) -> AstrologyHouseCusp:
    _validate_house_number(house_number)
    house = next((house for house in chart.houses if house.house == house_number), None)
    if house is None:
        raise ValueError(f"House {house_number} information is missing.")
    return house


def _validate_house_number(house_number: int) -> None:
    if not 1 <= house_number <= 12:
        raise ValueError("House number must be between 1 and 12.")