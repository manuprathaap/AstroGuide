from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from jyotipy import BirthChart, Graha

from app.astrology.types import (
    AstrologyAntardasha,
    AstrologyDashaResult,
    AstrologyMahadasha,
    AstrologyNakshatra,
)


def calculate_dasha(
    chart: BirthChart,
    timezone_name: str,
    moon_nakshatra: AstrologyNakshatra,
    now: datetime | None = None,
) -> AstrologyDashaResult:
    """Convert JyotiPy Vimshottari periods into timezone-aware app models."""
    local_timezone = ZoneInfo(timezone_name)
    raw_mahadashas = chart.mahadashas(cycles=1)
    mahadashas = [
        _mahadasha(period, local_timezone)
        for period in raw_mahadashas
    ]

    antardashas = []
    for raw_mahadasha, mahadasha in zip(raw_mahadashas, mahadashas):
        antardashas.extend(
            _antardasha(
                period,
                mahadasha.lord,
                mahadasha.start,
                mahadasha.end,
                local_timezone,
            )
            for period in chart.antardashas(raw_mahadasha)
        )

    current_at = now or datetime.now(local_timezone)
    if current_at.tzinfo is None:
        current_at = current_at.replace(tzinfo=local_timezone)
    else:
        current_at = current_at.astimezone(local_timezone)

    current_mahadasha = _find_active(mahadashas, current_at)
    current_antardasha = None
    if current_mahadasha is not None:
        current_antardasha = next(
            (
                period
                for period in antardashas
                if period.mahadasha_lord == current_mahadasha.lord
                and period.start <= current_at < period.end
            ),
            None,
        )

    return AstrologyDashaResult(
        moon_nakshatra=moon_nakshatra,
        mahadashas=mahadashas,
        antardashas=antardashas,
        current_mahadasha=current_mahadasha,
        current_antardasha=current_antardasha,
    )


def _mahadasha(period: dict, local_timezone: ZoneInfo) -> AstrologyMahadasha:
    return AstrologyMahadasha(
        lord=period["lord"].value,
        start=_localize_jyotipy_datetime(period["start"], local_timezone),
        end=_localize_jyotipy_datetime(period["end"], local_timezone),
        duration_years=period["years"],
    )


def _antardasha(
    period: dict,
    mahadasha_lord: str,
    mahadasha_start: datetime,
    mahadasha_end: datetime,
    local_timezone: ZoneInfo,
) -> AstrologyAntardasha:
    start = max(
        _localize_jyotipy_datetime(period["start"], local_timezone),
        mahadasha_start,
    )
    end = min(
        _localize_jyotipy_datetime(period["end"], local_timezone),
        mahadasha_end,
    )
    return AstrologyAntardasha(
        mahadasha_lord=mahadasha_lord,
        lord=period["lord"].value,
        start=start,
        end=end,
        duration_years=period["years"],
    )


def _localize_jyotipy_datetime(value: datetime, local_timezone: ZoneInfo) -> datetime:
    return value.replace(tzinfo=timezone.utc).astimezone(local_timezone)


def _find_active(periods, at: datetime):
    return next(
        (period for period in periods if period.start <= at < period.end),
        None,
    )