from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.language import Language


LANGUAGES = [
    {
        "code": "en",
        "name": "English",
        "native_name": "English",
    },
    {
        "code": "ml",
        "name": "Malayalam",
        "native_name": "മലയാളം",
    },
    {
        "code": "hi",
        "name": "Hindi",
        "native_name": "हिन्दी",
    },
    {
        "code": "ta",
        "name": "Tamil",
        "native_name": "தமிழ்",
    },
    {
        "code": "te",
        "name": "Telugu",
        "native_name": "తెలుగు",
    },
    {
        "code": "kn",
        "name": "Kannada",
        "native_name": "ಕನ್ನಡ",
    },
]


def seed_languages():
    db: Session = SessionLocal()

    try:
        for language_data in LANGUAGES:
            existing_language = (
                db.query(Language)
                .filter(Language.code == language_data["code"])
                .first()
            )

            if not existing_language:
                db.add(Language(**language_data))

        db.commit()

        print("Languages seeded successfully!")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_languages()