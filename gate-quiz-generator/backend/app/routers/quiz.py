from fastapi import APIRouter, HTTPException

from app.models import (
    QuizSessionResponse,
    QuestionResponse,
    QuizSubmission,
    QuizResult
)
from app.routers.upload import get_session
from app.services.scorer import score_quiz

router = APIRouter()


@router.get("/quiz/{session_id}", response_model=QuizSessionResponse)
async def get_quiz(session_id: str):
    """
    Get quiz questions for a session.
    Returns questions without correct answers.
    """
    session = get_session(session_id)

    question_responses = [
        QuestionResponse(
            number=q.number,
            text=q.text,
            question_type=q.question_type,
            options=q.options,
            images=q.images,  # ✅ COMMA FIX IS HERE
        )
        for q in session.questions
    ]

    return QuizSessionResponse(
        id=session.id,
        questions=question_responses,
        total_questions=session.total_questions
    )


@router.post("/quiz/{session_id}/submit", response_model=QuizResult)
async def submit_quiz(session_id: str, submission: QuizSubmission):
    """
    Submit quiz answers and get scored results.
    """
    session = get_session(session_id)

    result = score_quiz(
        session_id=session_id,
        questions=session.questions,
        submissions=submission.answers
    )

    return result


@router.get("/quiz/{session_id}/results/{question_number}")
async def get_question_result(session_id: str, question_number: int):
    """
    Get details for a specific question including correct answer.
    Useful for review mode.
    """
    session = get_session(session_id)

    for q in session.questions:
        if q.number == question_number:
            return {
                "number": q.number,
                "text": q.text,
                "question_type": q.question_type,
                "options": q.options,
                "images": q.images,
                "correct_answer": q.correct_answer
            }

    raise HTTPException(status_code=404, detail="Question not found")
