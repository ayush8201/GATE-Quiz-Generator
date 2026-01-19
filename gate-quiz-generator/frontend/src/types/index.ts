export enum QuestionType {
  MCQ_SINGLE = 'mcq_single',
  MCQ_MULTIPLE = 'mcq_multiple',
  NAT_INTEGER = 'nat_integer',
  NAT_DECIMAL = 'nat_decimal',
}

export interface Question {
  number: number;
  text: string;
  question_type: QuestionType;
  options: Record<string, string> | null;
  images?: string[]; 
}

export interface QuizSession {
  id: string;
  questions: Question[];
  total_questions: number;
}

export interface UploadResponse {
  session_id: string;
  total_questions: number;
  message: string;
}

export interface AnswerSubmission {
  question_number: number;
  answer: string | string[] | number | null;
}

export interface QuizSubmission {
  answers: AnswerSubmission[];
}

export interface QuestionResult {
  question_number: number;
  user_answer: string | string[] | number | null;
  correct_answer: string | string[] | number | [number, number] | null;
  is_correct: boolean;
  question_type: QuestionType;
}

export interface QuizResult {
  session_id: string;
  total_questions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score_percentage: number;
  results: QuestionResult[];
}

export interface HintResponse {
  question_number: number;
  hint: string;
  cached: boolean;
}
