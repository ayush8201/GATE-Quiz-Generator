import axios from 'axios';
import { QuizSession, UploadResponse, QuizSubmission, QuizResult, HintResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function uploadPDFs(
  questionsPdf: File,
  answerKeyPdf: File
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('questions_pdf', questionsPdf);
  formData.append('answer_key_pdf', answerKeyPdf);

  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function getQuiz(sessionId: string): Promise<QuizSession> {
  const response = await api.get<QuizSession>(`/quiz/${sessionId}`);
  return response.data;
}

export async function submitQuiz(
  sessionId: string,
  submission: QuizSubmission
): Promise<QuizResult> {
  const response = await api.post<QuizResult>(
    `/quiz/${sessionId}/submit`,
    submission
  );
  return response.data;
}

export async function getHint(
  sessionId: string,
  questionNumber: number
): Promise<HintResponse> {
  const response = await api.get<HintResponse>(
    `/quiz/${sessionId}/hint/${questionNumber}`
  );
  return response.data;
}

export { api };
