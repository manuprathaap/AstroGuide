from dataclasses import dataclass
from typing import Any

from sqlalchemy.orm import Session

from app.astrology.analysis.service import AstrologyAnalysisService
from app.astrology.calculator import AstrologyCalculationError
from app.astrology.question_classifier import QuestionType, classify_question
from app.models.birth_detail import BirthDetail
from app.models.guidance import Guidance
from app.services.guidance_service import create_guidance
from app.services.llm_service import GuidanceExplanationError, LLMService
from app.services.astrology_context_service import AstrologyContextService


# GuidanceExplanationError is imported from app.services.llm_service
__all__ = ['GuidanceAnalysisService', 'GuidanceAnalysisResult', 'GuidanceExplanationError']

_MARRIAGE_EXPLANATION_FIELDS = (
    "seventh_house_sign",
    "seventh_house_lord",
    "seventh_lord_sign",
    "seventh_lord_house",
    "venus_sign",
    "venus_house",
    "jupiter_sign",
    "jupiter_house",
    "current_mahadasha",
    "current_antardasha",
    "factors",
)
_MAX_MARRIAGE_TIMING_WINDOWS_FOR_EXPLANATION = 5


def _context_for_explanation(context: dict[str, Any]) -> dict[str, Any]:
    if context.get("question_type") != QuestionType.MARRIAGE_TIMING.value:
        return context

    specialized = context.get("specialized_analysis")
    if not isinstance(specialized, dict):
        return context

    compact_analysis = {
        key: specialized[key]
        for key in _MARRIAGE_EXPLANATION_FIELDS
        if key in specialized
    }

    timing = specialized.get("timing")
    if isinstance(timing, dict):
        compact_timing = {
            key: timing[key]
            for key in ("current_period", "supporting_factors", "caution_factors", "limitations")
            if key in timing
        }
        candidate_periods = timing.get("candidate_periods")
        if not isinstance(candidate_periods, list) or not candidate_periods:
            candidate_periods = specialized.get("timing_windows")
        if isinstance(candidate_periods, list):
            compact_timing["candidate_periods"] = candidate_periods[
                :_MAX_MARRIAGE_TIMING_WINDOWS_FOR_EXPLANATION
            ]
        compact_analysis["timing"] = compact_timing
    elif isinstance(specialized.get("timing_windows"), list):
        compact_analysis["timing"] = {
            "candidate_periods": specialized["timing_windows"][
                :_MAX_MARRIAGE_TIMING_WINDOWS_FOR_EXPLANATION
            ]
        }

    return {
        key: value
        for key, value in context.items()
        if key != "specialized_analysis"
    } | {"specialized_analysis": compact_analysis}


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
        context_service: AstrologyContextService | None = None,
    ):
        self.astrology_service = astrology_service or AstrologyAnalysisService()
        self.llm_service = llm_service
        self.context_service = context_service or AstrologyContextService(
            analysis_service=self.astrology_service,
        )

    def create_and_analyze(
        self,
        db: Session,
        user_id: int,
        problem: str,
        language: str | None = None,
    ) -> GuidanceAnalysisResult:
        birth_detail = (
            db.query(BirthDetail)
            .filter(BirthDetail.user_id == user_id)
            .first()
        )
        if birth_detail is None:
            raise LookupError(
                "Birth details not found. Please add your birth details first."
            )

        history_query = db.query(Guidance).filter(Guidance.user_id == user_id)
        if hasattr(history_query, "order_by"):
            history_query = history_query.order_by(Guidance.created_at.desc())
        if hasattr(history_query, "limit"):
            history_query = history_query.limit(8)
        previous = history_query.all() if hasattr(history_query, "all") else []
        history = [
            {
                "question": item.problem,
                "response": getattr(item, "message", None),
                "category": getattr(item, "category", None),
            }
            for item in reversed(previous)
            if getattr(item, "message", None)
        ]
        category = classify_question(problem, history)
        context_category = category
        if category is QuestionType.FOLLOW_UP and history:
            previous_category = history[-1].get("category")
            try:
                context_category = QuestionType(previous_category)
            except (TypeError, ValueError):
                context_category = QuestionType.LIFE_OVERVIEW
        guidance = create_guidance(
            db=db,
            user_id=user_id,
            problem=problem,
            category=category.value,
            language=language,
        )
        context = self.context_service.build_context(birth_detail, context_category)
        analysis = context.get("specialized_analysis")

        message = None
        if language:
            try:
                llm_service = self.llm_service or LLMService()
                message = llm_service.generate_conversational_response(
                    question=problem,
                    language=language,
                    astrology_context=_context_for_explanation(context),
                    conversation_history=history,
                )
            except GuidanceExplanationError:
                raise
            except Exception as exc:
                raise GuidanceExplanationError(
                    "Gemini explanation service failed."
                ) from exc

        guidance.category = category.value
        guidance.language = language or "English"
        guidance.message = message
        guidance.analysis = analysis or context
        if hasattr(db, "commit"):
            db.commit()
        if hasattr(db, "refresh"):
            db.refresh(guidance)

        return GuidanceAnalysisResult(
            guidance=guidance,
            category=category,
            supported=bool(context),
            message=message,
            analysis=analysis or context,
        )