from datetime import date, datetime, time

from pydantic import BaseModel, Field


class BirthDetailCreate(BaseModel):
    date_of_birth: date
    time_of_birth: time
    place_of_birth: str = Field(..., min_length=2, max_length=255)
    latitude: float | None = None
    longitude: float | None = None
    timezone: str | None = Field(default=None, max_length=100)


class BirthDetailUpdate(BaseModel):
    date_of_birth: date | None = None
    time_of_birth: time | None = None
    place_of_birth: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )
    latitude: float | None = None
    longitude: float | None = None
    timezone: str | None = Field(
        default=None,
        max_length=100,
    )


class BirthDetailResponse(BaseModel):
    id: int
    date_of_birth: date
    time_of_birth: time
    place_of_birth: str
    latitude: float | None
    longitude: float | None
    timezone: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }