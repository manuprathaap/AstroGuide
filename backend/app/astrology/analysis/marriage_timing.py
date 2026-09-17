from datetime import datetime
from zoneinfo import ZoneInfo

from app.astrology.analysis.houses import get_planet
from app.astrology.types import (
    AstrologyChartResult,
    AstrologyMarriageAnalysis,
    AstrologyMarriageCurrentPeriod,
    AstrologyMarriageTimingFactor,
    AstrologyMarriageTimingResult,
    AstrologyMarriageTimingWindow,
)


def build_marriage_timing(
    chart: AstrologyChartResult,
    marriage_analysis: AstrologyMarriageAnalysis,
    as_of: datetime | None = None,
) -> AstrologyMarriageTimingResult:
    """Build transparent candidate periods from calculated dasha periods.

    This is a timing candidate engine, not a certainty or a date prediction.
    It only considers relationships represented in the current chart result.
    """
    effective_as_of = as_of or datetime.now(ZoneInfo(chart.timezone))
    current = _current_period(chart, effective_as_of)
    relevant_planets = {
        marriage_analysis.seventh_house_lord,
        "Venus",
        "Jupiter",
    }
    supporting_factors = _supporting_factors(chart, marriage_analysis)
    caution_factors = _caution_factors(chart, marriage_analysis)

    candidate_periods = []
    for mahadasha in chart.dasha.mahadashas:
        for antardasha in chart.dasha.antardashas:
            if antardasha.mahadasha_lord != mahadasha.lord:
                continue
            if not _is_future_or_current(antardasha.end, effective_as_of):
                continue

            factors = _period_factors(
                mahadasha.lord,
                antardasha.lord,
                relevant_planets,
                marriage_analysis,
            )
            if not factors:
                continue

            candidate_periods.append(
                AstrologyMarriageTimingWindow(
                    mahadasha_lord=mahadasha.lord,
                    antardasha_lord=antardasha.lord,
                    start=antardasha.start,
                    end=antardasha.end,
                    reasons=[factor.reason for factor in factors],
                    factors=factors,
                )
            )

    candidate_periods.sort(key=lambda period: period.start)
    return AstrologyMarriageTimingResult(
        current_period=current,
        candidate_periods=candidate_periods,
        supporting_factors=supporting_factors,
        caution_factors=caution_factors,
        limitations=[
            "Candidate periods use Vimshottari Dasha only; transits and D9 are not yet included.",
            "A candidate period is supporting evidence, not a guaranteed marriage date.",
        ],
    )


def _current_period(
    chart: AstrologyChartResult,
    as_of: datetime | None,
) -> AstrologyMarriageCurrentPeriod | None:
    mahadasha = chart.dasha.current_mahadasha
    antardasha = chart.dasha.current_antardasha
    if as_of is not None:
        mahadasha = next(
            (period for period in chart.dasha.mahadashas if period.start <= as_of < period.end),
            None,
        )
        antardasha = next(
            (
                period
                for period in chart.dasha.antardashas
                if period.start <= as_of < period.end
            ),
            None,
        )
    if mahadasha is None or antardasha is None:
        return None
    return AstrologyMarriageCurrentPeriod(
        mahadasha_lord=mahadasha.lord,
        antardasha_lord=antardasha.lord,
        mahadasha_start=mahadasha.start,
        mahadasha_end=mahadasha.end,
        antardasha_start=antardasha.start,
        antardasha_end=antardasha.end,
    )


def _is_future_or_current(end: datetime, as_of: datetime | None) -> bool:
    return as_of is None or end > as_of


def _supporting_factors(
    chart: AstrologyChartResult,
    analysis: AstrologyMarriageAnalysis,
) -> list[AstrologyMarriageTimingFactor]:
    factors = [
        AstrologyMarriageTimingFactor(
            rule="seventh_house_lord_reference",
            planet=analysis.seventh_house_lord,
            house=analysis.seventh_lord_house,
            value=analysis.seventh_lord_sign,
            reason=(
                f"The calculated 7th-house lord is {analysis.seventh_house_lord}, "
                f"placed in house {analysis.seventh_lord_house}."
            ),
            weight=3,
        ),
    ]
    for planet_name, sign, house, weight in (
        ("Venus", analysis.venus_sign, analysis.venus_house, 2),
        ("Jupiter", analysis.jupiter_sign, analysis.jupiter_house, 2),
    ):
        if sign is not None and house is not None:
            factors.append(
                AstrologyMarriageTimingFactor(
                    rule="marriage_significator_reference",
                    planet=planet_name,
                    house=house,
                    value=sign,
                    reason=f"Calculated {planet_name} placement is {sign}, house {house}.",
                    weight=weight,
                )
            )
    factors.append(
        AstrologyMarriageTimingFactor(
            rule="moon_nakshatra_reference",
            planet="Moon",
            value=chart.dasha.moon_nakshatra.name,
            reason=f"Dasha starts from the calculated Moon Nakshatra {chart.dasha.moon_nakshatra.name}.",
            weight=1,
        )
    )
    return factors


def _caution_factors(
    chart: AstrologyChartResult,
    analysis: AstrologyMarriageAnalysis,
) -> list[AstrologyMarriageTimingFactor]:
    return [
        AstrologyMarriageTimingFactor(
            rule="unavailable_transit_support",
            reason="Transit-to-natal relationships are not present in the current calculation result.",
        ),
        AstrologyMarriageTimingFactor(
            rule="unavailable_navamsa_support",
            reason="D9/Navamsa data is not present in the current calculation result.",
        ),
    ]


def _period_factors(
    mahadasha_lord: str,
    antardasha_lord: str,
    relevant_planets: set[str],
    analysis: AstrologyMarriageAnalysis,
) -> list[AstrologyMarriageTimingFactor]:
    factors = []
    if mahadasha_lord in relevant_planets:
        factors.append(
            AstrologyMarriageTimingFactor(
                rule="relevant_mahadasha_lord",
                planet=mahadasha_lord,
                value=mahadasha_lord,
                reason=f"Mahadasha lord {mahadasha_lord} is a calculated marriage-relevant planet.",
                weight=3,
            )
        )
    if antardasha_lord in relevant_planets:
        factors.append(
            AstrologyMarriageTimingFactor(
                rule="relevant_antardasha_lord",
                planet=antardasha_lord,
                value=antardasha_lord,
                reason=f"Antardasha lord {antardasha_lord} is a calculated marriage-relevant planet.",
                weight=2,
            )
        )
    return factors