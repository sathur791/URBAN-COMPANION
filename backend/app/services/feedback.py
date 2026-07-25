from sqlalchemy.ext.asyncio import AsyncSession
from app.models.db_models import Feedback
from app.models.schemas import FeedbackCreate


async def log_feedback(db: AsyncSession, user_id: int, fb: FeedbackCreate) -> dict:
    feedback = Feedback(
        user_id=user_id,
        trip_id=fb.trip_id,
        query_text=fb.query_text,
        recommendation_json=fb.recommendation_json,
        reaction=fb.reaction,
        followed=1 if fb.followed else 0 if fb.followed is not None else None,
        outcome_rating=fb.outcome_rating,
        explanation_rating=fb.explanation_rating,
        comments=fb.comments,
    )
    db.add(feedback)
    await db.commit()
    await db.refresh(feedback)
    return {
        "id": feedback.id,
        "status": "recorded",
        "reaction": feedback.reaction,
    }
