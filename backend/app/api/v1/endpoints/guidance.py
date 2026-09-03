from fastapi import APIRouter, Depends,HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.guidance import GuidanceCreate,GuidanceUpdate, GuidanceResponse
from app.services.guidance_service import (
    create_guidance,
    get_user_guidance,
    update_guidance,
)


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
    return create_guidance(
        db=db,
        user_id=current_user.id,
        problem=guidance_data.problem,
    )

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