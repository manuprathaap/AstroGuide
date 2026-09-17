from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.astrology.analysis.service import AstrologyAnalysisService
from app.astrology.calculator import AstrologyCalculationError
from app.astrology.question_classifier import QuestionType, classify_question
from app.models.birth_detail import BirthDetail
from app.models.guidance import Guidance
from app.services.guidance_service import create_guidance
from app.services.llm_service import LLMService


class GuidanceExplanationError(RuntimeError):
    """Raised when the astrology explanation cannot be generated."""


@dataclass(frozen=True)
class GuidanceAnalysisResult:
    guidance: Guidance
    category: QuestionType
    supported: bool
    message: str | None = None
    analysis: object | None = None


class GuidanceAnalysisService:
    def __init__(
        self,
        astrology_service: AstrologyAnalysisService | None = None,
        llm_service: LLMService | None = None,
    ):
        self.astrology_service = astrology_service or AstrologyAnalysisService()
        self.llm_service = llm_service

    def create_and_analyze(
        self,
        db: Session,
        user_id: int,
        problem: str,
        language: str | None = None,
    ) -> GuidanceAnalysisResult:
        guidance = create_guidance(db=db, user_id=user_id, problem=problem)
        category = classify_question(problem)

        if category is not QuestionType.MARRIAGE_TIMING:
            return GuidanceAnalysisResult(
                guidance=guidance,
                category=category,
                supported=False,
                message=f"Astrology analysis for {category.value} is not supported yet.",
            )

        birth_detail = (
            db.query(BirthDetail)
            .filter(BirthDetail.user_id == user_id)
            .first()
        )
        if birth_detail is None:
            raise LookupError(
                "Birth details not found. Please add your birth details first."
            )

        analysis = self.astrology_service.analyze_marriage(birth_detail)

        message = None
        if language:
            analysis_data = (
                analysis.model_dump()
                if hasattr(analysis, "model_dump")
                else analysis
            )

            try:
                llm_service = self.llm_service or LLMService()
                message = llm_service.generate_astrology_response(
                    question=problem,
                    language=language,
                    astrology_analysis=analysis_data,
                )
            except Exception as exc:
                raise GuidanceExplanationError from exc

        return GuidanceAnalysisResult(
            guidance=guidance,
            category=category,
            supported=True,
            message=message,
            analysis=analysis,
        )