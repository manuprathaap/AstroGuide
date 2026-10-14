from datetime import date, time
from typing import Any
from pydantic import BaseModel, Field


class HoroscopeGenerateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    gender: str = Field(default="Male", max_length=20)
    date_of_birth: date
    time_of_birth: time
    place_of_birth: str = Field(..., min_length=2, max_length=255)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    timezone: str = Field(default="Asia/Kolkata", max_length=100)
    chart_style: str = Field(default="Kerala", max_length=50)
    language: str = Field(default="Malayalam", max_length=50)
    email: str | None = Field(default=None, max_length=255)
    phone_number: str | None = Field(default=None, max_length=50)


class ChartPlanet(BaseModel):
    name: str
    malayalam: str
    abbreviation: str
    degree: float
    display_name: str | None = None
    is_retrograde: bool = False
    house: int | None = None


class ChartBox(BaseModel):
    box_index: int  # 0..11 in Kerala layout
    sign_number: int  # 1..12 (1=Aries, 12=Pisces)
    sign_name: str
    sign_malayalam: str
    sign_display: str | None = None
    planets: list[ChartPlanet] = Field(default_factory=list)



class ChartData(BaseModel):
    center_title: str
    center_subtitle: str | None = None
    boxes: list[ChartBox]


class PlanetaryPositionItem(BaseModel):
    graha: str
    malayalam: str
    abbreviation: str
    sign: str
    sign_malayalam: str
    degree: float
    formatted_degree: str
    house: int
    nakshatra: str
    nakshatra_malayalam: str
    pada: int
    is_retrograde: bool = False


class SubTableRow(BaseModel):
    label: str
    value: str


class SubTable(BaseModel):
    title: str
    rows: list[SubTableRow] = Field(default_factory=list)


class ChapterItem(BaseModel):
    title: str
    subtitle: str | None = None
    value: str | None = None
    description: str | None = None
    ribbon_title: str | None = None
    subtitle_accent: str | None = None
    significance_box: str | None = None
    prediction_text: str | None = None
    meta_note: str | None = None
    timeline_cards: list[dict[str, Any]] | None = None
    sub_tables: list[SubTable] | None = None


class HoroscopeChapter(BaseModel):
    chapter_number: int
    title: str
    subtitle: str | None = None
    preamble: str | None = None
    items: list[ChapterItem] = Field(default_factory=list)


class PredictionSummaryCard(BaseModel):
    category: str
    category_malayalam: str
    count: int
    description: str
    highlight: str | None = None


class TableOfPredictions(BaseModel):
    header: str
    summary_text: str
    cards: list[PredictionSummaryCard] = Field(default_factory=list)


class HoroscopeResponse(BaseModel):
    personal_info: dict[str, Any]
    sun_sign: dict[str, Any]
    moon_sign: dict[str, Any]
    ascendant: dict[str, Any]
    panchanga: dict[str, Any]
    rashi_chart: ChartData
    navamsha_chart: ChartData
    planetary_positions: list[PlanetaryPositionItem]
    shloka: dict[str, str]
    table_of_predictions: TableOfPredictions | None = None
    chapters: list[HoroscopeChapter]
