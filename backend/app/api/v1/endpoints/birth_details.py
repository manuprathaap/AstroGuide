from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.birth_detail import BirthDetail
from app.models.user import User
from app.schemas.birth_detail import (
    BirthDetailCreate,
    BirthDetailUpdate,
    BirthDetailResponse,
)



router = APIRouter(
    prefix="/birth-details",
    tags=["Birth Details"],
)


@router.post(
    "",
    response_model=BirthDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_birth_details(
    birth_detail: BirthDetailCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_birth_details = (
        db.query(BirthDetail)
        .filter(BirthDetail.user_id == current_user.id)
        .first()
    )

    if existing_birth_details:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Birth details already exist for this user.",
        )

    new_birth_details = BirthDetail(
        user_id=current_user.id,
        date_of_birth=birth_detail.date_of_birth,
        time_of_birth=birth_detail.time_of_birth,
        place_of_birth=birth_detail.place_of_birth,
        latitude=birth_detail.latitude,
        longitude=birth_detail.longitude,
        timezone=birth_detail.timezone,
    )

    db.add(new_birth_details)
    db.commit()
    db.refresh(new_birth_details)

    return new_birth_details

@router.get(
    "",
    response_model=BirthDetailResponse,
)
def get_birth_details(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    birth_details = (
        db.query(BirthDetail)
        .filter(BirthDetail.user_id == current_user.id)
        .first()
    )

    if birth_details is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Birth details not found.",
        )

    return birth_details

@router.put(
    "",
    response_model=BirthDetailResponse,
)
def update_birth_details(
    birth_detail: BirthDetailUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_birth_details = (
        db.query(BirthDetail)
        .filter(BirthDetail.user_id == current_user.id)
        .first()
    )

    if existing_birth_details is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Birth details not found.",
        )

    update_data = birth_detail.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(existing_birth_details, field, value)

    db.commit()
    db.refresh(existing_birth_details)

    return existing_birth_details


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_birth_details(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_birth_details = (
        db.query(BirthDetail)
        .filter(BirthDetail.user_id == current_user.id)
        .first()
    )

    if existing_birth_details is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Birth details not found.",
        )

    db.delete(existing_birth_details)
    db.commit()

    return None