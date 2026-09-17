from app.astrology.calculator import AstrologyCalculator
from app.astrology.types import AstrologyChartResult
from app.models.birth_detail import BirthDetail


class AstrologyService:
    def __init__(self, calculator: AstrologyCalculator | None = None):
        self.calculator = calculator or AstrologyCalculator()

    def calculate_birth_chart(self, birth_detail: BirthDetail) -> AstrologyChartResult:
        return self.calculator.calculate_birth_chart(birth_detail)
