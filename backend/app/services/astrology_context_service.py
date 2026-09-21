from typing import Any

from app.astrology.analysis.service import AstrologyAnalysisService
from app.astrology.calculator import AstrologyCalculator
from app.astrology.question_classifier import QuestionType
from app.models.birth_detail import BirthDetail


class AstrologyContextService:
    """Build the smallest calculated chart context needed for a question."""

    def __init__(
        self,
        calculator: AstrologyCalculator | None = None,
        analysis_service: AstrologyAnalysisService | None = None,
    ):
        self.calculator = calculator or AstrologyCalculator()
        self.analysis_service = analysis_service or AstrologyAnalysisService(
            calculator=self.calculator,
        )

    def build_context(
        self,
        birth_detail: BirthDetail,
        category: QuestionType,
    ) -> dict[str, Any]:
        if category in {QuestionType.MARRIAGE, QuestionType.MARRIAGE_TIMING}:
            analysis = self.analysis_service.analyze_marriage(birth_detail)
            serialized = (
                analysis.model_dump(mode="json")
                if hasattr(analysis, "model_dump")
                else analysis
            )
            return {
                "question_type": category.value,
                "specialized_analysis": serialized,
            }

        chart = self.calculator.calculate_birth_chart(birth_detail)
        planet_names = {
            QuestionType.CAREER: {"Sun", "Saturn", "Jupiter"},
            QuestionType.CAREER_TIMING: {"Sun", "Saturn", "Jupiter"},
            QuestionType.FINANCE: {"Jupiter", "Venus", "Mercury"},
            QuestionType.RELATIONSHIP: {"Venus", "Moon", "Jupiter"},
            QuestionType.FAMILY: {"Moon", "Jupiter", "Saturn"},
            QuestionType.FOREIGN_SETTLEMENT: {"Moon", "Rahu", "Saturn"},
            QuestionType.TRAVEL: {"Moon", "Rahu", "Saturn"},
            QuestionType.HEALTH: {"Sun", "Moon", "Saturn"},
            QuestionType.EDUCATION: {"Mercury", "Jupiter", "Moon"},
            QuestionType.BUSINESS: {"Mercury", "Mars", "Jupiter"},
        }.get(category)

        selected_planets = [
            planet.model_dump(mode="json")
            for planet in chart.planets
            if planet_names is None or planet.graha in planet_names
        ]
        current_period = {
            "mahadasha": chart.dasha.current_mahadasha.model_dump(mode="json")
            if chart.dasha.current_mahadasha
            else None,
            "antardasha": chart.dasha.current_antardasha.model_dump(mode="json")
            if chart.dasha.current_antardasha
            else None,
        }
        return {
            "question_type": category.value,
            "chart": {
                "ascendant": chart.ascendant.model_dump(mode="json"),
                "planets": selected_planets,
                "houses": [house.model_dump(mode="json") for house in chart.houses],
                "current_period": current_period,
                "moon_nakshatra": chart.dasha.moon_nakshatra.model_dump(mode="json"),
            },
            "limitations": [
                "Only calculated chart placements and dasha data are supplied.",
                "Specialized timing analysis is not available for this category yet.",
            ],
        }