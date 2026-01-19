import re
from pathlib import Path
from typing import Union
import pdfplumber

from app.models import QuestionType, ParsedAnswerKey


def parse_answer_value(answer_str: str, qtype: str):
    answer_str = answer_str.strip()
    qtype = qtype.upper().strip()

    if qtype == "MCQ":
        return QuestionType.MCQ_SINGLE, answer_str.upper()

    if qtype == "MSQ":
        parts = re.split(r"[;,]", answer_str.upper())
        parts = [p.strip() for p in parts if p.strip()]
        return QuestionType.MCQ_MULTIPLE, sorted(parts)

    if qtype == "NAT":
        m = re.match(r"([-+]?\d*\.?\d+)\s*to\s*([-+]?\d*\.?\d+)", answer_str, re.I)
        if m:
            a, b = float(m.group(1)), float(m.group(2))
            if a == b and a.is_integer():
                return QuestionType.NAT_INTEGER, int(a)
            return QuestionType.NAT_DECIMAL, (a, b)

        if re.fullmatch(r"-?\d+", answer_str):
            return QuestionType.NAT_INTEGER, int(answer_str)

        return QuestionType.NAT_DECIMAL, float(answer_str)

    raise ValueError("Unknown question type")


def extract_answer_key_from_table(pdf_path: Path) -> dict[int, ParsedAnswerKey]:
    answers = {}
    col_map = None  # persists across pages

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            for table in page.extract_tables() or []:
                if not table or len(table) < 2:
                    continue

                # Try detecting header
                header = [c.lower().strip() if c else "" for c in table[0]]

                if "q. no." in header and "q. type" in header:
                    col_map = {
                        "q": header.index("q. no."),
                        "type": header.index("q. type"),
                        "key": header.index("key/range"),
                    }
                    data_rows = table[1:]
                elif col_map:
                    # No header → reuse previous mapping
                    data_rows = table
                else:
                    continue

                for row in data_rows:
                    try:
                        qno = int(row[col_map["q"]])
                        qtype = row[col_map["type"]]
                        key = row[col_map["key"]]

                        qt, val = parse_answer_value(key, qtype)

                        answers[qno] = ParsedAnswerKey(
                            question_number=qno,
                            answer_type=qt,
                            answer=val
                        )
                    except Exception:
                        continue

    return answers
