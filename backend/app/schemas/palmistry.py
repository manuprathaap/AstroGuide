from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class PalmAnalysisRequest(BaseModel):
    name: str = Field(default="Seeker", max_length=100)
    gender: str = Field(default="Male", max_length=20)
    dominant_hand: str = Field(default="Right", max_length=10)
    language: str = Field(default="English", max_length=50)
    left_hand_image: str | None = Field(default=None, description="Base64 data URL for left palm")
    right_hand_image: str | None = Field(default=None, description="Base64 data URL for right palm")
    notes: str | None = Field(default=None, max_length=500)


class AgeMilestone(BaseModel):
    age_range: str
    event: str
    significance_type: str = "favorable"  # favorable, transformative, caution


class PalmLineDetail(BaseModel):
    key: str
    name: str
    sanskrit_name: str
    quality: str
    length: str
    strength_score: int
    interpretation: str
    age_milestones: list[AgeMilestone] = Field(default_factory=list)


class PalmMountDetail(BaseModel):
    key: str
    name: str
    graha: str
    development: str
    significance: str
    score: int
    remedy: str


class SpecialSignDetail(BaseModel):
    symbol: str
    sanskrit_symbol: str
    location: str
    significance: str
    auspiciousness: str


class HandConstitution(BaseModel):
    element: str
    element_description: str
    palm_shape: str
    finger_proportions: str
    vitality_index: int


class GemstoneRecommendation(BaseModel):
    gemstone: str
    graha: str
    finger: str
    metal: str
    purpose: str


class PalmAnalysisResponse(BaseModel):
    id: str
    analyzed_at: str
    native_name: str
    gender: str
    dominant_hand: str
    language: str
    hand_constitution: HandConstitution
    prarabdha_vs_purushartha_summary: str
    major_lines: list[PalmLineDetail]
    planetary_mounts: list[PalmMountDetail]
    special_signs: list[SpecialSignDetail]
    life_predictions: dict[str, str]
    sacred_remedies: list[str]
    gemstone_recommendations: list[GemstoneRecommendation]
    left_image_analyzed: bool = False
    right_image_analyzed: bool = False
