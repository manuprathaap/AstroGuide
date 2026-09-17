from app.astrology.analysis.marriage import build_marriage_analysis
from app.astrology.analysis.marriage_timing import build_marriage_timing
from app.astrology.calculator import AstrologyCalculator
from app.astrology.types import AstrologyMarriageAnalysis
from app.models.birth_detail import BirthDetail


class AstrologyAnalysisService:
    def __init__(
        self,
        calculator: AstrologyCalculator | None = None,
    ):
        self.calculator = calculator or AstrologyCalculator()

    def analyze_marriage(
        self,
        birth_detail: BirthDetail,
    ) -> AstrologyMarriageAnalysis:

        chart = self.calculator.calculate_birth_chart(
            birth_detail
        )

        marriage_analysis = build_marriage_analysis(chart)
        timing = build_marriage_timing(chart, marriage_analysis)
        return marriage_analysis.model_copy(
            update={
                "timing": timing,
                "timing_windows": timing.candidate_periods,
            }
        )