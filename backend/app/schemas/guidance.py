from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.astrology.question_classifier import QuestionType
from app.astrology.types import AstrologyMarriageAnalysis


class GuidanceCreate(BaseModel):
    problem: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )


class GuidanceUpdate(BaseModel):
    problem: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )


class GuidanceResponse(BaseModel):
    id: int
    user_id: int
    problem: str
    created_at: datetime
    updated_at: datetime
    category: QuestionType | None = None
    supported: bool | None = None
    message: str | None = None
    analysis: AstrologyMarriageAnalysis | None = None

    model_config = ConfigDict(from_attributes=True)