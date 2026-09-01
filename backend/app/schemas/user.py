from pydantic import BaseModel, Field


class UpdateLanguageRequest(BaseModel):
    language_id: int = Field(gt=0)