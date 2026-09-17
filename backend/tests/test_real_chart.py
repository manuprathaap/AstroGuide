from datetime import date, time

from app.astrology.calculator import AstrologyCalculator
from app.models.birth_detail import BirthDetail


def test_real_birth_chart():
    birth_detail = BirthDetail(
        user_id=1,
        date_of_birth=date(1998, 5, 10),
        time_of_birth=time(10, 30),
        place_of_birth="Kochi",
        latitude=9.9312,
        longitude=76.2673,
        timezone="Asia/Kolkata",
    )

    calculator = AstrologyCalculator()

    result = calculator.calculate_birth_chart(birth_detail)

    print("\n========== ASTROGUIDE CHART ==========")

    print("Birth:", result.birth_datetime)
    print("Place:", result.place_of_birth)
    print("Latitude:", result.latitude)
    print("Longitude:", result.longitude)
    print("Timezone:", result.timezone)

    print("\n---------- AYANAMSA ----------")
    print("System:", result.ayanamsa_system)
    print("Degrees:", result.ayanamsa_degrees)

    print("\n---------- ASCENDANT ----------")
    print("Longitude:", result.ascendant.longitude)
    print("Sign:", result.ascendant.sign)
    print("Degree:", result.ascendant.degree_in_sign)
    print("Nakshatra:", result.ascendant.nakshatra.name)
    print("Pada:", result.ascendant.nakshatra.pada)
    print("Lord:", result.ascendant.nakshatra.lord)

    print("\n---------- PLANETS ----------")

    for planet in result.planets:
        print(
            f"{planet.graha:10} | "
            f"{planet.sign:12} | "
            f"Degree: {planet.degree_in_sign:8.4f} | "
            f"House: {planet.house:2} | "
            f"Nakshatra: {planet.nakshatra.name}"
        )

    print("\n---------- HOUSES ----------")

    for house in result.houses:
        print(
            f"House {house.house:2} | "
            f"{house.sign:12} | "
            f"Degree: {house.degree_in_sign:8.4f}"
        )

    print("\n---------- MOON NAKSHATRA ----------")
    print("Name:", result.dasha.moon_nakshatra.name)
    print("Pada:", result.dasha.moon_nakshatra.pada)
    print("Lord:", result.dasha.moon_nakshatra.lord)

    print("\n---------- MAHADASHA ----------")
    for period in result.dasha.mahadashas:
        print(
            f"{period.lord:8} | {period.start} -> {period.end} | "
            f"Years: {period.duration_years}"
        )

    print("\n---------- ANTARDASHA ----------")
    for period in result.dasha.antardashas:
        print(
            f"{period.mahadasha_lord:8}/{period.lord:8} | "
            f"{period.start} -> {period.end} | "
            f"Years: {period.duration_years}"
        )

    print("\n---------- CURRENT DASHA ----------")
    print("Mahadasha:", result.dasha.current_mahadasha)
    print("Antardasha:", result.dasha.current_antardasha)

    print("======================================")

    assert result.ascendant is not None
    assert len(result.planets) > 0
    assert len(result.houses) == 12