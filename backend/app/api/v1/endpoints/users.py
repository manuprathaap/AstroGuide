from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UpdateLanguageRequest
from app.services.language_service import update_user_language


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.patch("/me/language")
def update_language(
    language_data: UpdateLanguageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_user_language(
        db,
        current_user,
        language_data.language_id,
    )