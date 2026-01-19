import { create } from 'zustand';
import { Question, QuizResult } from '../types';

type UserAnswer = string | string[] | number | null;

interface QuizState {
  sessionId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, UserAnswer>;
  result: QuizResult | null;
  isLoading: boolean;
  error: string | null;
  hints: Record<number, string>;
  hintLoading: Record<number, boolean>;

  // Actions
  setSession: (sessionId: string, questions: Question[]) => void;
  setAnswer: (questionNumber: number, answer: UserAnswer) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setResult: (result: QuizResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  getAnswersForSubmission: () => { question_number: number; answer: UserAnswer }[];
  setHint: (questionNumber: number, hint: string) => void;
  setHintLoading: (questionNumber: number, loading: boolean) => void;
}

const initialState = {
  sessionId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  result: null,
  isLoading: false,
  error: null,
  hints: {},
  hintLoading: {},
};

export const useQuizStore = create<QuizState>((set, get) => ({
  ...initialState,

  setSession: (sessionId, questions) => {
    set({
      sessionId,
      questions,
      currentQuestionIndex: 0,
      answers: {},
      result: null,
      error: null,
    });
  },

  setAnswer: (questionNumber, answer) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionNumber]: answer,
      },
    }));
  },

  goToQuestion: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  setResult: (result) => {
    set({ result });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  reset: () => {
    set(initialState);
  },

  getAnswersForSubmission: () => {
    const { questions, answers } = get();
    return questions.map((q) => ({
      question_number: q.number,
      answer: answers[q.number] ?? null,
    }));
  },

  setHint: (questionNumber, hint) => {
    set((state) => ({
      hints: {
        ...state.hints,
        [questionNumber]: hint,
      },
    }));
  },

  setHintLoading: (questionNumber, loading) => {
    set((state) => ({
      hintLoading: {
        ...state.hintLoading,
        [questionNumber]: loading,
      },
    }));
  },
}));

// Selector for current question
export const useCurrentQuestion = () => {
  const questions = useQuizStore((state) => state.questions);
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestionIndex);

  if (questions.length === 0) return null;
  return questions[currentQuestionIndex];
};

// Helper to count answered questions
const countAnswered = (answers: Record<number, UserAnswer>): number => {
  return Object.keys(answers).filter((key) => {
    const answer = answers[parseInt(key)];
    if (answer === null || answer === undefined) return false;
    if (typeof answer === 'string') return answer.trim() !== '';
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  }).length;
};

// Selector for progress stats - returns individual values to avoid object comparison issues
export const useQuizProgress = () => {
  const total = useQuizStore((state) => state.questions.length);
  const current = useQuizStore((state) => state.currentQuestionIndex + 1);
  const answered = useQuizStore((state) => countAnswered(state.answers));

  return { total, answered, current };
};
