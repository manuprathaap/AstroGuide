from datetime import date, datetime, time
from types import SimpleNamespace
from unittest.mock import Mock

import pytest

from app.api.v1.endpoints.guidance import (
    create_guidance_endpoint,
    delete_guidance_endpoint,
    get_guidance_history,
    update_guidance_endpoint,
)
from app.astrology.calculator import AstrologyCalculationError
from app.astrology.question_classifier import QuestionType
from app.models.birth_detail import BirthDetail
from app.services.guidance_analysis_service import GuidanceAnalysisService
from app.services.guidance_analysis_service import GuidanceExplanationError
from app.schemas.guidance import GuidanceCreate, GuidanceUpdate


class FakeQuery:
    def __init__(self, result):
        self.result = result

    def filter(self, *args):
        return self

    def first(self):
        return self.result


class FakeDb:
    def __init__(self, birth_detail=None):
        self.birth_detail = birth_detail

    def query(self, model):
        return FakeQuery(self.birth_detail)


def kochi_birth():
    return BirthDetail(
        user_id=7,
        date_of_birth=date(1998, 5, 10),
        time_of_birth=time(10, 30),
        place_of_birth="Kochi",
        latitude=9.9312,
        longitude=76.2673,
        timezone="Asia/Kolkata",
    )


def saved_guidance(problem="Ente kalyanam eppol nadakkum?"):
    return SimpleNamespace(
        id=1,
        user_id=7,
        problem=problem,
        created_at=datetime(2026, 9, 16),
        updated_at=datetime(2026, 9, 16),
    )


def test_marriage_timing_guidance_is_saved_and_analyzed(monkeypatch):
    astrology_service = Mock()
    astrology_service.analyze_marriage.return_value = {"timing": {"candidate_periods": []}}
    saved = saved_guidance()
    monkeypatch.setattr(
        "app.services.guidance_analysis_service.create_guidance",
        Mock(return_value=saved),
    )

    result = GuidanceAnalysisService(astrology_service).create_and_analyze(
        db=FakeDb(kochi_birth()),
        user_id=7,
        problem=saved.problem,
    )

    assert result.category is QuestionType.MARRIAGE_TIMING
    assert result.supported is True
    assert result.guidance is saved
    assert result.analysis == {"timing": {"candidate_periods": []}}
    astrology_service.analyze_marriage.assert_called_once()


def test_marriage_timing_guidance_sends_real_question_language_and_analysis(
    monkeypatch,
):
    astrology_service = Mock()
    analysis = {"timing_windows": ["2027-2028"]}
    astrology_service.analyze_marriage.return_value = analysis
    llm_service = Mock()
    llm_service.generate_astrology_response.return_value = "മലയാളം മറുപടി"
    saved = saved_guidance()
    monkeypatch.setattr(
        "app.services.guidance_analysis_service.create_guidance",
        Mock(return_value=saved),
    )

    result = GuidanceAnalysisService(
        astrology_service=astrology_service,
        llm_service=llm_service,
    ).create_and_analyze(
        db=FakeDb(kochi_birth()),
        user_id=7,
        problem=saved.problem,
        language="Malayalam",
    )

    assert result.message == "മലയാളം മറുപടി"
    llm_service.generate_astrology_response.assert_called_once_with(
        question="Ente kalyanam eppol nadakkum?",
        language="Malayalam",
        astrology_analysis=analysis,
    )


def test_explanation_failure_is_mapped_to_502(monkeypatch):
    service = Mock()
    service.create_and_analyze.side_effect = GuidanceExplanationError
    monkeypatch.setattr(
        "app.api.v1.endpoints.guidance.GuidanceAnalysisService",
        Mock(return_value=service),
    )

    with pytest.raises(Exception) as error:
        create_guidance_endpoint(
            GuidanceCreate(problem="Ente kalyanam eppol nadakkum?"),
            db=FakeDb(),
            current_user=SimpleNamespace(id=7),
        )

    assert error.value.status_code == 502
    assert error.value.detail == (
        "Astrology analysis succeeded, but the explanation service failed."
    )


def test_unsupported_career_question_is_saved_without_marriage_analysis(monkeypatch):
    astrology_service = Mock()
    saved = saved_guidance("How will my career be?")
    monkeypatch.setattr(
        "app.services.guidance_analysis_service.create_guidance",
        Mock(return_value=saved),
    )

    result = GuidanceAnalysisService(astrology_service).create_and_analyze(
        db=FakeDb(),
        user_id=7,
        problem=saved.problem,
    )

    assert result.category is QuestionType.CAREER
    assert result.supported is False
    assert result.analysis is None
    astrology_service.analyze_marriage.assert_not_called()


def test_general_question_is_saved_without_marriage_analysis(monkeypatch):
    astrology_service = Mock()
    saved = saved_guidance("Tell me about my travel plans")
    monkeypatch.setattr(
        "app.services.guidance_analysis_service.create_guidance",
        Mock(return_value=saved),
    )

    result = GuidanceAnalysisService(astrology_service).create_and_analyze(
        db=FakeDb(),
        user_id=7,
        problem=saved.problem,
    )

    assert result.category is QuestionType.GENERAL
    assert result.supported is False
    astrology_service.analyze_marriage.assert_not_called()


def test_missing_birth_detail_is_reported(monkeypatch):
    monkeypatch.setattr(
        "app.services.guidance_analysis_service.create_guidance",
        Mock(return_value=saved_guidance()),
    )

    with pytest.raises(LookupError, match="Birth details not found"):
        GuidanceAnalysisService().create_and_analyze(
            db=FakeDb(),
            user_id=7,
            problem="When will I get married?",
        )


def test_endpoint_returns_structured_marriage_analysis(monkeypatch):
    analysis = SimpleNamespace(timing={"candidate_periods": []})
    result = SimpleNamespace(
        guidance=saved_guidance(),
        category=QuestionType.MARRIAGE_TIMING,
        supported=True,
        message=None,
        analysis=analysis,
    )
    service = Mock()
    service.create_and_analyze.return_value = result
    monkeypatch.setattr(
        "app.api.v1.endpoints.guidance.GuidanceAnalysisService",
        Mock(return_value=service),
    )

    response = create_guidance_endpoint(
        GuidanceCreate(problem="Ente kalyanam eppol nadakkum?"),
        db=FakeDb(),
        current_user=SimpleNamespace(
            id=7,
            language=SimpleNamespace(name="Malayalam"),
        ),
    )

    assert response["category"] is QuestionType.MARRIAGE_TIMING
    assert response["analysis"] is analysis
    service.create_and_analyze.assert_called_once()
    assert service.create_and_analyze.call_args.kwargs["language"] == "Malayalam"


def test_endpoint_maps_missing_birth_detail_to_404(monkeypatch):
    service = Mock()
    service.create_and_analyze.side_effect = LookupError(
        "Birth details not found. Please add your birth details first."
    )
    monkeypatch.setattr(
        "app.api.v1.endpoints.guidance.GuidanceAnalysisService",
        Mock(return_value=service),
    )

    with pytest.raises(Exception) as error:
        create_guidance_endpoint(
            GuidanceCreate(problem="When will I get married?"),
            db=FakeDb(),
            current_user=SimpleNamespace(id=7),
        )

    assert error.value.status_code == 404


def test_endpoint_maps_calculation_error_to_400(monkeypatch):
    service = Mock()
    service.create_and_analyze.side_effect = AstrologyCalculationError("Invalid latitude")
    monkeypatch.setattr(
        "app.api.v1.endpoints.guidance.GuidanceAnalysisService",
        Mock(return_value=service),
    )

    with pytest.raises(Exception) as error:
        create_guidance_endpoint(
            GuidanceCreate(problem="When will I get married?"),
            db=FakeDb(),
            current_user=SimpleNamespace(id=7),
        )

    assert error.value.status_code == 400
    assert error.value.detail == "Invalid latitude"


def test_existing_guidance_get_still_returns_history(monkeypatch):
    guidance = saved_guidance("Existing question")
    monkeypatch.setattr(
        "app.api.v1.endpoints.guidance.get_user_guidance",
        Mock(return_value=[guidance]),
    )

    response = get_guidance_history(
        db=FakeDb(),
        current_user=SimpleNamespace(id=7),
    )

    assert response == [guidance]


def test_existing_guidance_put_still_updates_problem(monkeypatch):
    guidance = saved_guidance("Updated question")
    updater = Mock(return_value=guidance)
    monkeypatch.setattr("app.api.v1.endpoints.guidance.update_guidance", updater)

    response = update_guidance_endpoint(
        guidance_id=1,
        guidance_data=GuidanceUpdate(problem="Updated question"),
        db=FakeDb(),
        current_user=SimpleNamespace(id=7),
    )

    assert response is guidance
    updater.assert_called_once()


def test_existing_guidance_delete_still_deletes(monkeypatch):
    deleter = Mock(return_value=True)
    monkeypatch.setattr("app.api.v1.endpoints.guidance.delete_guidance", deleter)

    response = delete_guidance_endpoint(
        guidance_id=1,
        db=FakeDb(),
        current_user=SimpleNamespace(id=7),
    )

    assert response is None
    deleter.assert_called_once()
