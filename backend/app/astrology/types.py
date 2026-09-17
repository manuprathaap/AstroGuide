from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict, Field


class AstrologyBirthInput(BaseModel):
    date_of_birth: date
    time_of_birth: time
    place_of_birth: str = Field(..., min_length=2, max_length=255)
    latitude: float | None = None
    longitude: float | None = None
    timezone: str | None = Field(default=None, max_length=100)


class AstrologyNakshatra(BaseModel):
    name: str
    index: int
    lord: str
    pada: int
    degrees_into_nakshatra: float


class AstrologyPoint(BaseModel):
    longitude: float
    sign: str
    degree_in_sign: float
    nakshatra: AstrologyNakshatra


class AstrologyPlanetPosition(AstrologyPoint):
    graha: str
    house: int


class AstrologyHouseCusp(BaseModel):
    house: int
    longitude: float
    sign: str
    degree_in_sign: float


class AstrologyMahadasha(BaseModel):
    lord: str
    start: datetime
    end: datetime
    duration_years: float


class AstrologyAntardasha(BaseModel):
    mahadasha_lord: str
    lord: str
    start: datetime
    end: datetime
    duration_years: float


class AstrologyDashaResult(BaseModel):
    moon_nakshatra: AstrologyNakshatra
    mahadashas: list[AstrologyMahadasha]
    antardashas: list[AstrologyAntardasha]
    current_mahadasha: AstrologyMahadasha | None
    current_antardasha: AstrologyAntardasha | None


class AstrologyChartResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    birth_datetime: datetime
    place_of_birth: str
    latitude: float
    longitude: float
    timezone: str
    ayanamsa_system: str
    ayanamsa_degrees: float
    ascendant: AstrologyPoint
    planets: list[AstrologyPlanetPosition]
    houses: list[AstrologyHouseCusp]
    dasha: AstrologyDashaResult

class AstrologyMarriageFactor(BaseModel):
    factor: str
    value: str | int | float | None
    description: str


class AstrologyMarriageTimingWindow(BaseModel):
    mahadasha_lord: str
    antardasha_lord: str
    start: datetime
    end: datetime
    reasons: list[str]
    factors: list["AstrologyMarriageTimingFactor"] = Field(default_factory=list)


class AstrologyMarriageTimingFactor(BaseModel):
    rule: str
    planet: str | None = None
    house: int | None = None
    value: str | int | float | None = None
    reason: str
    weight: int | None = None


class AstrologyMarriageCurrentPeriod(BaseModel):
    mahadasha_lord: str
    antardasha_lord: str
    mahadasha_start: datetime
    mahadasha_end: datetime
    antardasha_start: datetime
    antardasha_end: datetime


class AstrologyMarriageTimingResult(BaseModel):
    current_period: AstrologyMarriageCurrentPeriod | None
    candidate_periods: list[AstrologyMarriageTimingWindow]
    supporting_factors: list[AstrologyMarriageTimingFactor]
    caution_factors: list[AstrologyMarriageTimingFactor]
    limitations: list[str]


class AstrologyMarriageAnalysis(BaseModel):
    seventh_house_sign: str
    seventh_house_lord: str

    seventh_lord_sign: str | None
    seventh_lord_house: int | None

    venus_sign: str | None
    venus_house: int | None

    jupiter_sign: str | None
    jupiter_house: int | None

    current_mahadasha: str | None
    current_antardasha: str | None

    factors: list[AstrologyMarriageFactor]
    timing_windows: list[AstrologyMarriageTimingWindow]
    timing: AstrologyMarriageTimingResult | None = None