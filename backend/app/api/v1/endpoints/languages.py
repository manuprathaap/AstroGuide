from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.language import LanguageResponse
from app.services.language_service import get_active_languages


router = APIRouter(
    prefix="/languages",
    tags=["Languages"],
)


@router.get(
    "",
    response_model=list[LanguageResponse],
)
def get_languages(
    db: Session = Depends(get_db),
):
    return get_active_languages(db)