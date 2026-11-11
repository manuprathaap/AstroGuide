import base64
import hashlib
import secrets

import jwt
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    Header,
    HTTPException,
    Response,
    UploadFile,
    status,
)
from jwt import PyJWTError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import JWT_ALGORITHM, JWT_SECRET_KEY
from app.core.dependencies import get_optional_current_user
from app.database.connection import get_db
from app.models.palm_anonymous_usage import PalmAnonymousUsage
from app.models.user import User
from app.schemas.palmistry import PalmAnalysisRequest, PalmAnalysisResponse
from app.services.palm_vision_service import PalmVisionService

router = APIRouter(
    prefix="/palmistry",
    tags=["Palmistry"],
)

palm_service = PalmVisionService()
GUEST_ANALYSIS_REQUIRED_MESSAGE = (
    "Your free palm analysis has been used. Sign in to analyze another palm."
)


def _new_guest_token() -> str:
    return jwt.encode(
        {
            "purpose": "palm_analysis_guest",
            "nonce": secrets.token_urlsafe(32),
        },
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def _reserve_guest_analysis(
    db: Session,
    current_user: User | None,
    guest_token: str | None,
) -> tuple[str | None, PalmAnonymousUsage | None]:
    if current_user is not None:
        return None, None

    token = guest_token
    if token:
        try:
            claims = jwt.decode(
                token,
                JWT_SECRET_KEY,
                algorithms=[JWT_ALGORITHM],
            )
            if claims.get("purpose") != "palm_analysis_guest":
                token = None
        except PyJWTError:
            token = None

    if not token:
        token = _new_guest_token()

    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    existing_usage = (
        db.query(PalmAnonymousUsage)
        .filter(PalmAnonymousUsage.token_hash == token_hash)
        .first()
    )
    if existing_usage:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=GUEST_ANALYSIS_REQUIRED_MESSAGE,
        )

    usage = PalmAnonymousUsage(token_hash=token_hash)
    db.add(usage)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=GUEST_ANALYSIS_REQUIRED_MESSAGE,
        ) from exc

    return token, usage


def _release_guest_analysis(db: Session, usage: PalmAnonymousUsage | None) -> None:
    if usage is not None:
        db.delete(usage)
        db.commit()


def _analyze_with_guest_quota(
    req: PalmAnalysisRequest,
    response: Response,
    db: Session,
    current_user: User | None,
    guest_token: str | None,
) -> PalmAnalysisResponse:
    token, usage = _reserve_guest_analysis(db, current_user, guest_token)

    try:
        result = palm_service.analyze_palm_images(req)
    except Exception:
        _release_guest_analysis(db, usage)
        raise

    if token:
        response.headers["X-Palm-Guest-Token"] = token

    return result


@router.post(
    "/analyze",
    response_model=PalmAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze palm images via Hastarekha Shastra and AI Vision",
)
def analyze_palm(
    req: PalmAnalysisRequest,
    response: Response,
    guest_token: str | None = Header(default=None, alias="X-Palm-Guest-Token"),
    current_user: User | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> PalmAnalysisResponse:
    """Allow one anonymous analysis per browser; signed-in users have continued access."""
    return _analyze_with_guest_quota(req, response, db, current_user, guest_token)


@router.post(
    "/upload-and-analyze",
    response_model=PalmAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload palm photos as multipart files and receive Hastarekha analysis",
)
async def upload_and_analyze_palm(
    response: Response,
    left_hand: UploadFile | None = File(default=None),
    right_hand: UploadFile | None = File(default=None),
    name: str = Form(default="Seeker"),
    gender: str = Form(default="Male"),
    dominant_hand: str = Form(default="Right"),
    language: str = Form(default="English"),
    guest_token: str | None = Header(default=None, alias="X-Palm-Guest-Token"),
    current_user: User | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> PalmAnalysisResponse:
    """Accept multipart palm images with one anonymous analysis per browser."""
    left_b64 = None
    right_b64 = None

    if left_hand:
        content = await left_hand.read()
        if content:
            left_b64 = f"data:{left_hand.content_type or 'image/jpeg'};base64,{base64.b64encode(content).decode('utf-8')}"

    if right_hand:
        content = await right_hand.read()
        if content:
            right_b64 = f"data:{right_hand.content_type or 'image/jpeg'};base64,{base64.b64encode(content).decode('utf-8')}"

    req = PalmAnalysisRequest(
        name=name,
        gender=gender,
        dominant_hand=dominant_hand,
        language=language,
        left_hand_image=left_b64,
        right_hand_image=right_b64,
    )
    return _analyze_with_guest_quota(req, response, db, current_user, guest_token)


@router.get(
    "/sample",
    response_model=PalmAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Get an authentic sample Palm Reading analysis",
)
def get_sample_palm_analysis(language: str = "English") -> PalmAnalysisResponse:
    """Returns a full sample reading for quick preview and onboarding."""
    req = PalmAnalysisRequest(
        name="Seeker",
        gender="Male",
        dominant_hand="Right",
        language=language,
    )
    return palm_service.analyze_palm_images(req)
