import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks

from app.models import UploadResponse, QuizSession
from app.services.answer_key_parser import extract_answer_key_from_table
from app.services.question_extractor import extract_questions_from_pdf
from app.services.figure_extractor import extract_figures

router = APIRouter()

quiz_sessions: dict[str, QuizSession] = {}

UPLOADS_DIR = Path(__file__).parent.parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)


@router.post("/upload", response_model=UploadResponse)
async def upload_pdfs(
    questions_pdf: UploadFile = File(...),
    answer_key_pdf: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
):
    for pdf_file in [questions_pdf, answer_key_pdf]:
        if not pdf_file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    session_id = str(uuid.uuid4())
    questions_path = UPLOADS_DIR / f"{session_id}_questions.pdf"
    answer_key_path = UPLOADS_DIR / f"{session_id}_answers.pdf"

    questions_path.write_bytes(await questions_pdf.read())
    answer_key_path.write_bytes(await answer_key_pdf.read())

    answer_key = extract_answer_key_from_table(answer_key_path)
    if not answer_key:
        raise HTTPException(status_code=422, detail="Answer key parsing failed")

    questions = extract_questions_from_pdf(questions_path, answer_key)
    if not questions:
        raise HTTPException(status_code=422, detail="Question parsing failed")

    session = QuizSession(
        id=session_id,
        questions=questions,
        total_questions=len(questions),
    )
    quiz_sessions[session_id] = session

    # 🔥 Run figure extraction in background
    background_tasks.add_task(extract_figures, questions_path)

    return UploadResponse(
        session_id=session_id,
        total_questions=len(questions),
        message="Quiz ready. Figures are loading in background."
    )


def get_session(session_id: str) -> QuizSession:
    if session_id not in quiz_sessions:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    return quiz_sessions[session_id]


