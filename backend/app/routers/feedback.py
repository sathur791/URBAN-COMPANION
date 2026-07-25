from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User
from app.models.schemas import FeedbackCreate
from app.services.feedback import log_feedback

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.post("/", status_code=201)
async def submit_feedback(
    fb: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await log_feedback(db, current_user.id, fb)
