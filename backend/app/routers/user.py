from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User, UserPreference, Trip
from app.models.schemas import UserResponse, PreferenceUpdate, PreferenceResponse, TripResponse
from typing import List

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/preferences", response_model=List[PreferenceResponse])
async def get_preferences(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserPreference).where(UserPreference.user_id == current_user.id)
    )
    return result.scalars().all()


@router.put("/preferences", response_model=PreferenceResponse)
async def update_preference(
    pref: PreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserPreference).where(
            UserPreference.user_id == current_user.id,
            UserPreference.preference_key == pref.preference_key,
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        existing.preference_value = pref.preference_value
        await db.commit()
        await db.refresh(existing)
        return existing

    new_pref = UserPreference(
        user_id=current_user.id,
        preference_key=pref.preference_key,
        preference_value=pref.preference_value,
    )
    db.add(new_pref)
    await db.commit()
    await db.refresh(new_pref)
    return new_pref


@router.get("/trips", response_model=List[TripResponse])
async def get_trips(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Trip).where(Trip.user_id == current_user.id).order_by(Trip.created_at.desc()).limit(50)
    )
    return result.scalars().all()
