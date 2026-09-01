from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.language import Language
from app.models.user import User


def get_active_languages(db: Session) -> list[Language]:
    return (
        db.query(Language)
        .filter(Language.is_active.is_(True))
        .order_by(Language.id)
        .all()
    )

def update_user_language(
    db: Session,
    user: User,
    language_id: int,
) -> User:

    language = (
        db.query(Language)
        .filter(
            Language.id == language_id,
            Language.is_active.is_(True),
        )
        .first()
    )

    if not language:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Language not found",
        )

    user.language_id = language.id

    db.commit()
    db.refresh(user)

    return user