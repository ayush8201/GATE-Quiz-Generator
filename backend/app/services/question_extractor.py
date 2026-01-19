import re
from pathlib import Path
import pdfplumber

from app.models import Question, QuestionType, ParsedAnswerKey
from app.services.figure_extractor import extract_figures


def extract_questions_from_pdf(
    pdf_path: Path,
    answer_key: dict[int, ParsedAnswerKey]
) -> list[Question]:

    page_figures = extract_figures(pdf_path)
    questions = {}

    with pdfplumber.open(pdf_path) as pdf:
        for page_no, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            parts = re.split(r"\nQ\.\s*(\d+)", text)

            i = 1
            while i < len(parts) - 1:
                qno = int(parts[i])
                body = parts[i + 1]

                options = dict(re.findall(r"\(([A-D])\)\s*([^\n]+)", body))
                qtext = re.split(r"\([A-D]\)", body)[0].strip()

                questions[qno] = {
                    "text": qtext,
                    "options": options if options else None,
                    "images": page_figures.get(page_no, [])
                }
                i += 2

    result = []

    for qno in sorted(questions):
        qd = questions[qno]
        ak = answer_key.get(qno)

        if ak:
            qtype = ak.answer_type
            correct = ak.answer
        else:
            qtype = QuestionType.MCQ_SINGLE if qd["options"] else QuestionType.NAT_INTEGER
            correct = None

        result.append(Question(
            number=qno,
            text=qd["text"],
            question_type=qtype,
            options=qd["options"] if qtype in (
                QuestionType.MCQ_SINGLE,
                QuestionType.MCQ_MULTIPLE
            ) else None,
            correct_answer=correct,
            images=qd["images"]
        ))

    return result
