import { Question, QuestionType, QuestionResult } from '../types'
import { MCQOptions } from './MCQOptions'
import { NATInput } from './NATInput'
import { HintButton } from './HintButton'
import { Card, CardContent, CardHeader } from './ui/Card'
import { Badge } from './ui/Badge'
import { CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  question: Question
  answer: string | string[] | number | null
  onAnswerChange: (answer: string | string[] | number | null) => void
  questionIndex: number
  totalQuestions: number
  result?: QuestionResult
  reviewMode?: boolean
  sessionId?: string
}

export function QuestionCard({
  question,
  answer,
  onAnswerChange,
  questionIndex,
  totalQuestions,
  result,
  reviewMode = false,
  sessionId,
}: QuestionCardProps) {
  const isMCQ =
    question.question_type === QuestionType.MCQ_SINGLE ||
    question.question_type === QuestionType.MCQ_MULTIPLE

  const isNAT =
    question.question_type === QuestionType.NAT_INTEGER ||
    question.question_type === QuestionType.NAT_DECIMAL

  const getQuestionTypeLabel = () => {
    switch (question.question_type) {
      case QuestionType.MCQ_SINGLE:
        return 'MCQ (Single)'
      case QuestionType.MCQ_MULTIPLE:
        return 'MCQ (Multiple)'
      case QuestionType.NAT_INTEGER:
        return 'NAT (Integer)'
      case QuestionType.NAT_DECIMAL:
        return 'NAT (Decimal)'
    }
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
            <h2 className="text-xl font-semibold text-foreground">
              Q.{question.number}
            </h2>
          </div>
          <Badge variant={isMCQ ? 'mcq' : 'nat'}>
            {getQuestionTypeLabel()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {reviewMode && result && (
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-xl',
              'glass-effect animate-fade-in',
              result.is_correct
                ? 'border-success/50 bg-success/10 text-success'
                : 'border-destructive/50 bg-destructive/10 text-destructive'
            )}
          >
            {result.is_correct ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Incorrect</span>
              </>
            )}
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {question.text}
          </p>
        </div>

        {question.images && question.images.length > 0 && (
          <div className="space-y-4">
            {question.images.map((img, idx) => (
              <div key={idx} className="flex justify-center">
                <img
                  src={`http://localhost:8000${img}`}
                  alt={`Figure ${idx + 1}`}
                  className="max-w-full rounded-xl border border-border shadow-lg"
                />
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-border">
          {isMCQ && question.options && (
            <MCQOptions
              options={question.options}
              selectedAnswer={answer as string | string[] | null}
              questionType={question.question_type}
              onChange={onAnswerChange}
              disabled={reviewMode}
              correctAnswer={
                reviewMode ? (result?.correct_answer as string | string[]) : null
              }
              showCorrect={reviewMode}
            />
          )}

          {isNAT && (
            <NATInput
              value={answer as number | null}
              questionType={question.question_type}
              onChange={onAnswerChange}
              disabled={reviewMode}
              correctAnswer={
                reviewMode
                  ? (result?.correct_answer as number | [number, number])
                  : null
              }
              showCorrect={reviewMode}
            />
          )}

          {!reviewMode && sessionId && (
            <HintButton
              questionNumber={question.number}
              sessionId={sessionId}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
