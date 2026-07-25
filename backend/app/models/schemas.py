from datetime import datetime
from typing import Optional, Any, List
from pydantic import BaseModel, EmailStr


# Auth
class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# User
class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Preferences
class PreferenceUpdate(BaseModel):
    preference_key: str
    preference_value: Any


class PreferenceResponse(BaseModel):
    id: int
    preference_key: str
    preference_value: Any
    updated_at: datetime

    class Config:
        from_attributes = True


# Query
class QueryRequest(BaseModel):
    text: Optional[str] = None
    voice_data: Optional[str] = None
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    image_data: Optional[str] = None
    dest_lat: Optional[float] = None
    dest_lng: Optional[float] = None
    origin_name: Optional[str] = None
    dest_name: Optional[str] = None


class NLUResult(BaseModel):
    intent: str
    entities: dict
    confidence: float


class Recommendation(BaseModel):
    option_id: int
    label: str
    description: str
    score: float
    travel_time_minutes: int
    distance_km: Optional[float] = None
    mode: str


class SHAPContribution(BaseModel):
    feature: str
    contribution: float
    direction: str
    value: Any


class QueryResponse(BaseModel):
    recommendation: str
    ranked_options: List[Recommendation]
    shap_explanations: List[SHAPContribution]
    live_conditions: dict
    rag_context: Optional[str] = None
    query_id: Optional[int] = None
    origin_coords: Optional[dict] = None
    dest_coords: Optional[dict] = None
    origin_address: Optional[str] = None
    dest_address: Optional[str] = None
    routes_geometry: Optional[dict] = None
    departure_windows: Optional[List[dict]] = None
    eco_impact: Optional[dict] = None
    turn_by_turn_steps: Optional[List[dict]] = None


# Feedback
class FeedbackCreate(BaseModel):
    trip_id: Optional[int] = None
    query_text: Optional[str] = None
    recommendation_json: Optional[dict] = None
    reaction: str
    followed: Optional[bool] = None
    outcome_rating: Optional[int] = None
    explanation_rating: Optional[int] = None
    comments: Optional[str] = None


# Trip
class TripResponse(BaseModel):
    id: int
    origin_lat: float
    origin_lng: float
    dest_lat: float
    dest_lng: float
    origin_name: Optional[str] = None
    dest_name: Optional[str] = None
    mode: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

