import base64
from typing import Annotated
from fastapi import APIRouter, File, Form, UploadFile, status

from app.schemas.palmistry import (
    PalmAnalysisRequest,
    PalmAnalysisResponse,
)
from app.services.palm_vision_service import PalmVisionService

router = APIRouter(
    prefix="/palmistry",
    tags=["Palmistry"],
)

palm_service = PalmVisionService()


@router.post(
    "/analyze",
    response_model=PalmAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze palm images via Hastarekha Shastra and AI Vision",
)
def analyze_palm(req: PalmAnalysisRequest) -> PalmAnalysisResponse:
    """Analyze Left and Right palm photos using authentic Vedic Hastarekha Shastra."""
    return palm_service.analyze_palm_images(req)


@router.post(
    "/upload-and-analyze",
    response_model=PalmAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload palm photos as multipart files and receive Hastarekha analysis",
)
async def upload_and_analyze_palm(
    left_hand: UploadFile | None = File(default=None),
    right_hand: UploadFile | None = File(default=None),
    name: str = Form(default="Seeker"),
    gender: str = Form(default="Male"),
    dominant_hand: str = Form(default="Right"),
    language: str = Form(default="English"),
) -> PalmAnalysisResponse:
    """Accepts multipart/form-data with image files for left and right palms."""
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
    return palm_service.analyze_palm_images(req)


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
