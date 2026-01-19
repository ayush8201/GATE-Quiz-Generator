import os
from typing import Optional

from google import genai
from app.models import Question, QuestionType

# =========================
# GEMINI API KEY FROM ENV
# =========================
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

# Create Gemini client
client = genai.Client(api_key=API_KEY)

# In-memory cache: {session_id: {question_number: hint_text}}
_hint_cache: dict[str, dict[int, str]] = {}


# =========================
# STRICT SHORT-HINT PROMPT
# =========================
HINT_PROMPT = """You are an expert GATE exam mentor.

TASK:
Give a VERY SHORT hint that nudges the student in the right direction.

STRICT RULES (must follow):
- Maximum 2 sentences
- Maximum 35 words total
- NO step-by-step explanation
- NO theory dump
- NO derivation
- NO examples
- DO NOT reveal the answer
- DO NOT eliminate options
- DO NOT mention option letters
- Use only high-level guidance

STYLE:
- Crisp
- Clear
- Exam-oriented
- Like a coaching nudge, not a solution

Question Type: {question_type}
Question:
{question_text}
{options_text}

Output ONLY the hint text. Nothing else.
"""


def get_cached_hint(session_id: str, question_number: int) -> Optional[str]:
    return _hint_cache.get(session_id, {}).get(question_number)


def cache_hint(session_id: str, question_number: int, hint: str) -> None:
    _hint_cache.setdefault(session_id, {})[question_number] = hint


def format_question_type(q_type: QuestionType) -> str:
    return {
        QuestionType.MCQ_SINGLE: "MCQ (Single Correct)",
        QuestionType.MCQ_MULTIPLE: "MCQ (Multiple Correct)",
        QuestionType.NAT_INTEGER: "Numerical Answer Type (Integer)",
        QuestionType.NAT_DECIMAL: "Numerical Answer Type (Decimal)",
    }.get(q_type, "Unknown")


def format_options(options: Optional[dict[str, str]]) -> str:
    if not options:
        return ""
    lines = ["Options:"]
    for k, v in sorted(options.items()):
        lines.append(f"{k}. {v}")
    return "\n".join(lines)


async def generate_hint(
    question: Question,
    session_id: str,
) -> tuple[str, bool]:
    """
    Generate a short, high-quality hint using Gemini 3 Flash Preview.

    Returns:
        (hint_text, is_cached)
    """

    # Cache check
    cached = get_cached_hint(session_id, question.number)
    if cached:
        return cached, True

    # Build prompt
    prompt = HINT_PROMPT.format(
        question_type=format_question_type(question.question_type),
        question_text=question.text,
        options_text=format_options(question.options),
    )

    # Gemini call (sync SDK, safe inside FastAPI async route)
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
    )

    hint_text = response.text.strip()

    # =========================
    # HARD SAFETY WORD CAP
    # =========================
    words = hint_text.split()
    if len(words) > 35:
        hint_text = " ".join(words[:35])

    # Cache and return
    cache_hint(session_id, question.number, hint_text)
    return hint_text, False


def clear_session_cache(session_id: str) -> None:
    if session_id in _hint_cache:
        del _hint_cache[session_id]
