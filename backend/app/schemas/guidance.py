from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


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

    model_config = ConfigDict(from_attributes=True)