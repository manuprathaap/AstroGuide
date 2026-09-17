from app.astrology.types import (
    AstrologyChartResult,
    AstrologyMarriageFactor,
)
from app.astrology.analysis.houses import get_house_lord, get_planet


def evaluate_marriage_factors(
    chart: AstrologyChartResult,
) -> list[AstrologyMarriageFactor]:

    factors: list[AstrologyMarriageFactor] = []

    seventh_house = next((house for house in chart.houses if house.house == 7), None)
    if seventh_house is None:
        raise ValueError("7th house information is missing.")

    seventh_lord = get_planet(chart, get_house_lord(chart, 7))
    venus = get_planet(chart, "Venus")
    jupiter = get_planet(chart, "Jupiter")

    factors.append(
        AstrologyMarriageFactor(
            factor="seventh_house",
            value=seventh_house.sign,
            description=(
                f"7th house is {seventh_house.sign}."
            ),
        )
    )

    if seventh_lord:
        factors.append(
            AstrologyMarriageFactor(
                factor="seventh_lord",
                value=seventh_lord.graha,
                description=(
                    f"7th lord {seventh_lord.graha} "
                    f"is placed in {seventh_lord.sign}, "
                    f"house {seventh_lord.house}."
                ),
            )
        )

    for planet_name, planet in (("venus", venus), ("jupiter", jupiter)):
        if planet:
            factors.append(
                AstrologyMarriageFactor(
                    factor=planet_name,
                    value=planet.sign,
                    description=(
                        f"{planet.graha} is placed in {planet.sign}, "
                        f"house {planet.house}."
                    ),
                )
            )

    if chart.dasha.current_mahadasha:
        factors.append(
            AstrologyMarriageFactor(
                factor="current_mahadasha",
                value=chart.dasha.current_mahadasha.lord,
                description=(
                    f"Current Mahadasha is "
                    f"{chart.dasha.current_mahadasha.lord}."
                ),
            )
        )

    if chart.dasha.current_antardasha:
        factors.append(
            AstrologyMarriageFactor(
                factor="current_antardasha",
                value=chart.dasha.current_antardasha.lord,
                description=(
                    f"Current Antardasha is "
                    f"{chart.dasha.current_antardasha.lord}."
                ),
            )
        )

    return factors