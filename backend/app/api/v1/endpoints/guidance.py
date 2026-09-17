from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.astrology.calculator import AstrologyCalculationError
from app.models.user import User
from app.schemas.guidance import GuidanceCreate, GuidanceUpdate, GuidanceResponse
from app.services.guidance_service import (
    get_user_guidance,
    update_guidance,
    delete_guidance
)
from app.services.guidance_analysis_service import GuidanceAnalysisService
from app.services.guidance_analysis_service import GuidanceExplanationError


router = APIRouter(
    prefix="/guidance",
    tags=["Guidance"],
)


@router.post(
    "",
    response_model=GuidanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_guidance_endpoint(
    guidance_data: GuidanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        result = GuidanceAnalysisService().create_and_analyze(
            db=db,
            user_id=current_user.id,
            problem=guidance_data.problem,
            language=(
                current_user.language.name
                if getattr(current_user, "language", None) is not None
                else None
            ),
        )
    except LookupError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except AstrologyCalculationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except GuidanceExplanationError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Astrology analysis succeeded, but the explanation service failed.",
        ) from exc

    return {
        "id": result.guidance.id,
        "user_id": result.guidance.user_id,
        "problem": result.guidance.problem,
        "created_at": result.guidance.created_at,
        "updated_at": result.guidance.updated_at,
        "category": result.category,
        "supported": result.supported,
        "message": result.message,
        "analysis": result.analysis,
    }

@router.get(
    "",
    response_model=list[GuidanceResponse],
)
def get_guidance_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_guidance(
        db=db,
        user_id=current_user.id,
    )

@router.put(
    "/{guidance_id}",
    response_model=GuidanceResponse,
)
def update_guidance_endpoint(
    guidance_id: int,
    guidance_data: GuidanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    guidance = update_guidance(
        db=db,
        user_id=current_user.id,
        guidance_id=guidance_id,
        problem=guidance_data.problem,
    )

    if guidance is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guidance not found.",
        )

    return guidance

@router.delete(
    "/{guidance_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_guidance_endpoint(
    guidance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_guidance(
        db=db,
        user_id=current_user.id,
        guidance_id=guidance_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guidance not found.",
        )

    return None