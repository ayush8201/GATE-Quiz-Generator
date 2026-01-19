from pydantic import BaseModel
from typing import Optional, Union
from enum import Enum


class QuestionType(str, Enum):
    MCQ_SINGLE = "mcq_single"
    MCQ_MULTIPLE = "mcq_multiple"
    NAT_INTEGER = "nat_integer"
    NAT_DECIMAL = "nat_decimal"


class Question(BaseModel):
    number: int
    text: str
    question_type: QuestionType
    options: Optional[dict[str, str]] = None
    correct_answer: Union[str, list[str], int, float, tuple[float, float], None] = None
    images: Optional[list[str]] = None
    # images → list of URLs like "/assets/figures/fig_xxx.png"


class QuestionResponse(BaseModel):
    """Question data sent to frontend (without correct answer)"""
    number: int
    text: str
    question_type: QuestionType
    options: Optional[dict[str, str]] = None
    images: Optional[list[str]] = None


class QuizSession(BaseModel):
    id: str
    questions: list[Question]
    total_questions: int


class QuizSessionResponse(BaseModel):
    """Quiz session data sent to frontend"""
    id: str
    questions: list[QuestionResponse]
    total_questions: int


class AnswerSubmission(BaseModel):
    question_number: int
    answer: Union[str, list[str], float, None]


class QuizSubmission(BaseModel):
    answers: list[AnswerSubmission]


class QuestionResult(BaseModel):
    question_number: int
    user_answer: Union[str, list[str], float, None]
    correct_answer: Union[str, list[str], int, float, tuple[float, float], None]
    is_correct: bool
    question_type: QuestionType


class QuizResult(BaseModel):
    session_id: str
    total_questions: int
    attempted: int
    correct: int
    incorrect: int
    unattempted: int
    score_percentage: float
    results: list[QuestionResult]


class UploadResponse(BaseModel):
    session_id: str
    total_questions: int
    message: str


class ParsedAnswerKey(BaseModel):
    """Represents a parsed answer from the answer key"""
    question_number: int
    answer_type: QuestionType
    answer: Union[str, list[str], int, float, tuple[float, float]]


class HintResponse(BaseModel):
    """Response containing a hint for a question"""
    question_number: int
    hint: str
    cached: bool
