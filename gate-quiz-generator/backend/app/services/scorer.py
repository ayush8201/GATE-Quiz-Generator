from typing import Union

from app.models import (
    Question,
    QuestionType,
    AnswerSubmission,
    QuestionResult,
    QuizResult
)


# Default tolerance for NAT decimal answers
NAT_DECIMAL_TOLERANCE = 0.01


def score_answer(
    question: Question,
    user_answer: Union[str, list[str], float, None]
) -> bool:
    """
    Score a single answer against the correct answer.

    Args:
        question: The question with correct answer
        user_answer: The user's submitted answer

    Returns:
        True if correct, False otherwise
    """
    if user_answer is None:
        return False

    correct = question.correct_answer
    if correct is None:
        # No correct answer available - can't score
        return False

    q_type = question.question_type

    if q_type == QuestionType.MCQ_SINGLE:
        return _score_mcq_single(user_answer, correct)

    elif q_type == QuestionType.MCQ_MULTIPLE:
        return _score_mcq_multiple(user_answer, correct)

    elif q_type == QuestionType.NAT_INTEGER:
        return _score_nat_integer(user_answer, correct)

    elif q_type == QuestionType.NAT_DECIMAL:
        return _score_nat_decimal(user_answer, correct)

    return False


def _score_mcq_single(user_answer: Union[str, list[str], float, None], correct: Union[str, list[str], int, float, tuple]) -> bool:
    """Score single-choice MCQ: exact match required."""
    if isinstance(user_answer, list):
        # User submitted multiple answers for single-choice
        if len(user_answer) == 1:
            user_answer = user_answer[0]
        else:
            return False

    if isinstance(user_answer, str) and isinstance(correct, str):
        return user_answer.upper() == correct.upper()

    return False


def _score_mcq_multiple(user_answer: Union[str, list[str], float, None], correct: Union[str, list[str], int, float, tuple]) -> bool:
    """Score multiple-choice MCQ: all-or-nothing, must match exactly."""
    # Normalize user answer to sorted list
    if isinstance(user_answer, str):
        user_choices = sorted([user_answer.upper()])
    elif isinstance(user_answer, list):
        user_choices = sorted([a.upper() for a in user_answer])
    else:
        return False

    # Normalize correct answer to sorted list
    if isinstance(correct, str):
        correct_choices = sorted([correct.upper()])
    elif isinstance(correct, list):
        correct_choices = sorted([a.upper() for a in correct])
    else:
        return False

    return user_choices == correct_choices


def _score_nat_integer(user_answer: Union[str, list[str], float, None], correct: Union[str, list[str], int, float, tuple]) -> bool:
    """Score NAT integer: exact match required."""
    try:
        user_val = int(float(user_answer))
        correct_val = int(correct)
        return user_val == correct_val
    except (ValueError, TypeError):
        return False


def _score_nat_decimal(user_answer: Union[str, list[str], float, None], correct: Union[str, list[str], int, float, tuple]) -> bool:
    """Score NAT decimal: within tolerance or specified range."""
    try:
        user_val = float(user_answer)
    except (ValueError, TypeError):
        return False

    # Check if correct answer is a range
    if isinstance(correct, (list, tuple)) and len(correct) == 2:
        min_val, max_val = correct
        return min_val <= user_val <= max_val

    # Single value with tolerance
    try:
        correct_val = float(correct)
        return abs(user_val - correct_val) <= NAT_DECIMAL_TOLERANCE
    except (ValueError, TypeError):
        return False


def score_quiz(
    session_id: str,
    questions: list[Question],
    submissions: list[AnswerSubmission]
) -> QuizResult:
    """
    Score an entire quiz submission.

    Args:
        session_id: The quiz session ID
        questions: List of all questions
        submissions: List of user answer submissions

    Returns:
        QuizResult with detailed scoring
    """
    # Create lookup for submissions by question number
    answer_map: dict[int, Union[str, list[str], float, None]] = {}
    for sub in submissions:
        answer_map[sub.question_number] = sub.answer

    results = []
    correct_count = 0
    incorrect_count = 0
    unattempted_count = 0

    for question in questions:
        user_answer = answer_map.get(question.number)

        # Check if attempted
        is_attempted = user_answer is not None
        if isinstance(user_answer, str):
            is_attempted = bool(user_answer.strip())
        elif isinstance(user_answer, list):
            is_attempted = len(user_answer) > 0

        if not is_attempted:
            unattempted_count += 1
            is_correct = False
        else:
            is_correct = score_answer(question, user_answer)
            if is_correct:
                correct_count += 1
            else:
                incorrect_count += 1

        results.append(QuestionResult(
            question_number=question.number,
            user_answer=user_answer,
            correct_answer=question.correct_answer,
            is_correct=is_correct,
            question_type=question.question_type
        ))

    total = len(questions)
    attempted = correct_count + incorrect_count
    score_percentage = (correct_count / total * 100) if total > 0 else 0

    return QuizResult(
        session_id=session_id,
        total_questions=total,
        attempted=attempted,
        correct=correct_count,
        incorrect=incorrect_count,
        unattempted=unattempted_count,
        score_percentage=round(score_percentage, 2),
        results=results
    )
