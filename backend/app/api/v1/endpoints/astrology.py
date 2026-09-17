from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.astrology.calculator import AstrologyCalculationError
from app.models.birth_detail import BirthDetail
from app.models.user import User
from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.services.astrology_service import AstrologyService
from app.astrology.analysis.service import AstrologyAnalysisService
from app.services.llm_service import LLMService


router = APIRouter(
    prefix="/astrology",
    tags=["Astrology"],
)


@router.get(
    "/birth-chart",
)
def get_birth_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    birth_detail = (
        db.query(BirthDetail)
        .filter(BirthDetail.user_id == current_user.id)
        .first()
    )

    if birth_detail is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Birth details not found. Please add your birth details first.",
        )

    astrology_service = AstrologyService()

    try:
        result = astrology_service.calculate_birth_chart(birth_detail)

    except AstrologyCalculationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return result


@router.post(
    "/analyze-marriage",
)
def analyze_marriage(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ---------------------------------------
    # 1. Get user's birth details
    # ---------------------------------------
    birth_detail = (
        db.query(BirthDetail)
        .filter(BirthDetail.user_id == current_user.id)
        .first()
    )

    if birth_detail is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Birth details not found. Please add your birth details first.",
        )

    # ---------------------------------------
    # 2. Run existing astrology engine
    # ---------------------------------------
    astrology_service = AstrologyAnalysisService()

    try:
        result = astrology_service.analyze_marriage(
            birth_detail
        )

    except AstrologyCalculationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    # ---------------------------------------
    # 3. Convert astrology result to dict
    # ---------------------------------------
    astrology_analysis = result.model_dump()

    # ---------------------------------------
    # 4. Send ONLY the calculated result to LLM
    # ---------------------------------------
    try:
        llm_service = LLMService()

        llm_response = llm_service.generate_astrology_response(
            question="Ente kalyanam eppol nadakkum?",
            language="Malayalam",
            astrology_analysis=astrology_analysis,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Astrology analysis succeeded, but LLM response failed: {str(exc)}",
        ) from exc

    # ---------------------------------------
    # 5. Return both results
    # ---------------------------------------
    return {
        "analysis": astrology_analysis,
        "response": llm_response,
    }


# --------------------------------------------------
# TEMPORARY LLM TEST ENDPOINT
# --------------------------------------------------

@router.get("/test-llm")
def test_llm():
    llm_service = LLMService()

    response = llm_service.generate_response(
        "Explain what an API is in one simple sentence."
    )

    return {
        "response": response
    }


# --------------------------------------------------
# TEMPORARY MARRIAGE LLM TEST ENDPOINT
# --------------------------------------------------

@router.post("/test-marriage-llm")
def test_marriage_llm():

    llm_service = LLMService()

    astrology_analysis = {
        "question_type": "marriage_timing",
        "seventh_house": {
            "sign": "Taurus",
            "lord": "Venus"
        },
        "venus": {
            "sign": "Cancer",
            "house": 9
        },
        "jupiter": {
            "sign": "Gemini",
            "house": 8
        },
        "dasha": {
            "mahadasha": "Venus",
            "antardasha": "Jupiter"
        },
        "timing_windows": [
            "2027-2028",
            "2030-2031"
        ]
    }

    response = llm_service.generate_astrology_response(
        question="Ente kalyanam eppol nadakkum?",
        language="Malayalam",
        astrology_analysis=astrology_analysis,
    )

    return {
        "response": response
    }