from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.astrology.horoscope import HoroscopeCalculator
from app.core.dependencies import get_optional_current_user
from app.database.connection import get_db
from app.models.birth_detail import BirthDetail
from app.models.user import User
from app.schemas.horoscope import HoroscopeGenerateRequest, HoroscopeResponse

router = APIRouter(
    prefix="/horoscope",
    tags=["Horoscope"],
)


@router.post(
    "/generate",
    response_model=HoroscopeResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate comprehensive horoscope, Rashi chart, Navamsha chart, and Panchanga",
)
def generate_horoscope(
    req: HoroscopeGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    try:
        calculator = HoroscopeCalculator()
        response = calculator.generate(req)

        # If user is logged in and does not have birth details saved, save them
        if current_user and hasattr(current_user, "id"):
            existing = (
                db.query(BirthDetail)
                .filter(BirthDetail.user_id == current_user.id)
                .first()
            )
            if not existing:
                new_detail = BirthDetail(
                    user_id=current_user.id,
                    date_of_birth=req.date_of_birth,
                    time_of_birth=req.time_of_birth,
                    place_of_birth=req.place_of_birth,
                    latitude=req.latitude,
                    longitude=req.longitude,
                    timezone=req.timezone,
                )
                db.add(new_detail)
                try:
                    db.commit()
                except Exception:
                    db.rollback()

        return response

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Horoscope calculation failed: {str(exc)}",
        ) from exc
