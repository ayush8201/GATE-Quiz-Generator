from fastapi import APIRouter, HTTPException

from app.models import HintResponse
from app.routers.upload import get_session
from app.services.hint_generator import generate_hint

router = APIRouter()


@router.get("/quiz/{session_id}/hint/{question_number}", response_model=HintResponse)
async def get_hint(
    session_id: str,
    question_number: int,
):
    """
    Get a hint for a specific question using Google Gemini API.

    Hints are cached per session to avoid repeated API calls.
    """
    session = get_session(session_id)

    # Find the question
    question = None
    for q in session.questions:
        if q.number == question_number:
            question = q
            break

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    try:
        hint_text, is_cached = await generate_hint(
            question=question,
            session_id=session_id,
        )

        return HintResponse(
            question_number=question_number,
            hint=hint_text,
            cached=is_cached
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate hint: {str(e)}"
        )
