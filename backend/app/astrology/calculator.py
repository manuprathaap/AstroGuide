from datetime import datetime
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from jyotipy import AyanamsaSystem, BirthChart, Graha
from jyotipy.nakshatra import nakshatra_info
from pydantic import ValidationError

from app.astrology.types import (
    AstrologyBirthInput,
    AstrologyChartResult,
    AstrologyHouseCusp,
    AstrologyNakshatra,
    AstrologyPlanetPosition,
    AstrologyPoint,
)
from app.astrology.dasha import calculate_dasha
from app.models.birth_detail import BirthDetail


class AstrologyCalculationError(ValueError):
    """A safe, user-facing failure during birth-chart calculation."""


class AstrologyCalculator:
    ayanamsa_system = AyanamsaSystem.LAHIRI
    house_system = "whole_sign"

    def calculate_birth_chart(self, birth_detail: BirthDetail) -> AstrologyChartResult:
        try:
            birth_input = AstrologyBirthInput.model_validate(
                birth_detail,
                from_attributes=True,
            )
        except ValidationError as exc:
            raise AstrologyCalculationError("Invalid birth date or time.") from exc
        latitude = self._require_coordinate(birth_input.latitude, "latitude")
        longitude = self._require_coordinate(birth_input.longitude, "longitude")
        timezone_name = self._require_timezone(birth_input.timezone)

        try:
            timezone = ZoneInfo(timezone_name)
            local_datetime = datetime.combine(
                birth_input.date_of_birth,
                birth_input.time_of_birth,
            )
            aware_datetime = local_datetime.replace(tzinfo=timezone)
            offset = aware_datetime.utcoffset()
            if offset is None:
                raise AstrologyCalculationError("Unable to determine birth timezone offset.")
            utc_offset_hours = offset.total_seconds() / 3600
        except (TypeError, ValueError) as exc:
            raise AstrologyCalculationError("Invalid birth date or time.") from exc
        except ZoneInfoNotFoundError as exc:
            raise AstrologyCalculationError(f"Invalid timezone: {timezone_name}.") from exc

        try:
            chart = BirthChart(
                dt=local_datetime,
                utc_offset_hours=utc_offset_hours,
                latitude=latitude,
                longitude=longitude,
                ayanamsa=self.ayanamsa_system,
            )
            ascendant = self._point(chart.ascendant)
            houses = [
                self._house_cusp(house_number, cusp)
                for house_number, cusp in enumerate(chart.houses(self.house_system), 1)
            ]
            planets = [
                self._planet_position(chart, graha)
                for graha in Graha
            ]
            dasha = calculate_dasha(
                chart=chart,
                timezone_name=timezone_name,
                moon_nakshatra=self._point(chart.positions[Graha.MOON]).nakshatra,
            )
        except AstrologyCalculationError:
            raise
        except Exception as exc:
            raise AstrologyCalculationError("JyotiPy could not calculate the birth chart.") from exc

        return AstrologyChartResult(
            birth_datetime=aware_datetime,
            place_of_birth=birth_input.place_of_birth,
            latitude=latitude,
            longitude=longitude,
            timezone=timezone_name,
            ayanamsa_system=self.ayanamsa_system.value,
            ayanamsa_degrees=chart.ayanamsa_value,
            ascendant=ascendant,
            planets=planets,
            houses=houses,
            dasha=dasha,
        )

    @staticmethod
    def _require_coordinate(value: float | None, name: str) -> float:
        if value is None:
            raise AstrologyCalculationError(f"Birth {name} is required for chart calculation.")
        if name == "latitude" and not -90 <= value <= 90:
            raise AstrologyCalculationError("Birth latitude must be between -90 and 90.")
        if name == "longitude" and not -180 <= value <= 180:
            raise AstrologyCalculationError("Birth longitude must be between -180 and 180.")
        return value

    @staticmethod
    def _require_timezone(value: str | None) -> str:
        if not value:
            raise AstrologyCalculationError("Birth timezone is required for chart calculation.")
        return value

    @staticmethod
    def _point(longitude: float) -> AstrologyPoint:
        info = nakshatra_info(longitude)
        return AstrologyPoint(
            longitude=longitude,
            sign=AstrologyCalculator._sign(longitude),
            degree_in_sign=longitude % 30,
            nakshatra=AstrologyNakshatra(**info),
        )

    @staticmethod
    def _planet_position(chart: BirthChart, graha: Graha) -> AstrologyPlanetPosition:
        point = AstrologyCalculator._point(chart.positions[graha])
        return AstrologyPlanetPosition(
            graha=graha.value,
            longitude=point.longitude,
            sign=point.sign,
            degree_in_sign=point.degree_in_sign,
            nakshatra=point.nakshatra,
            house=chart.house_of(graha, AstrologyCalculator.house_system),
        )

    @staticmethod
    def _house_cusp(house: int, longitude: float) -> AstrologyHouseCusp:
        return AstrologyHouseCusp(
            house=house,
            longitude=longitude,
            sign=AstrologyCalculator._sign(longitude),
            degree_in_sign=longitude % 30,
        )

    @staticmethod
    def _sign(longitude: float) -> str:
        signs = (
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
        )
        return signs[int(longitude % 360 // 30)]
