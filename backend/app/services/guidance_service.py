from sqlalchemy.orm import Session

from app.models.guidance import Guidance


def create_guidance(
    db: Session,
    user_id: int,
    problem: str,
) -> Guidance:
    guidance = Guidance(
        user_id=user_id,
        problem=problem,
    )

    db.add(guidance)
    db.commit()
    db.refresh(guidance)

    return guidance

def get_user_guidance(
    db: Session,
    user_id: int,
) -> list[Guidance]:
    return (
        db.query(Guidance)
        .filter(Guidance.user_id == user_id)
        .order_by(Guidance.created_at.desc())
        .all()
    )

def update_guidance(
    db: Session,
    user_id: int,
    guidance_id: int,
    problem: str,
) -> Guidance | None:
    guidance = (
        db.query(Guidance)
        .filter(
            Guidance.id == guidance_id,
            Guidance.user_id == user_id,
        )
        .first()
    )

    if guidance is None:
        return None

    guidance.problem = problem

    db.commit()
    db.refresh(guidance)

    return guidance