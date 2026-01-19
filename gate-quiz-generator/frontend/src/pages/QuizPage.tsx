import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Send, Loader2, Grid3X3 } from 'lucide-react'
import { QuestionCard } from '../components/QuestionCard'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import {
  useQuizStore,
  useCurrentQuestion,
  useQuizProgress,
} from '../store/quizStore'
import { getQuiz, submitQuiz } from '../services/api'
import { cn } from '@/lib/utils'

export function QuizPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const {
    questions,
    answers,
    currentQuestionIndex,
    setSession,
    setAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    setResult,
    setLoading,
    setError,
    isLoading,
    error,
    getAnswersForSubmission,
  } = useQuizStore()

  const currentQuestion = useCurrentQuestion()
  const progress = useQuizProgress()
  const [showNavPanel, setShowNavPanel] = useState(false)

  useEffect(() => {
    const loadQuiz = async () => {
      if (!sessionId) return
      if (questions.length > 0) return

      setLoading(true)
      try {
        const quizData = await getQuiz(sessionId)
        setSession(quizData.id, quizData.questions)
      } catch (err: unknown) {
        const error = err as { response?: { data?: { detail?: string } }; message?: string }
        setError(
          error.response?.data?.detail ||
            error.message ||
            'Failed to load quiz'
        )
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [sessionId, questions.length, setSession, setLoading, setError])

  const handleSubmit = async () => {
    if (!sessionId) return

    const confirmed = window.confirm(
      `You have answered ${progress.answered} out of ${progress.total} questions. Are you sure you want to submit?`
    )

    if (!confirmed) return

    setLoading(true)
    try {
      const submission = { answers: getAnswersForSubmission() }
      const result = await submitQuiz(sessionId, submission)
      setResult(result)
      navigate(`/results/${sessionId}`)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string }
      setError(
        error.response?.data?.detail ||
          error.message ||
          'Failed to submit quiz'
      )
    } finally {
      setLoading(false)
    }
  }

  if (isLoading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 max-w-md text-center border-destructive/50">
          <h3 className="font-semibold text-destructive mb-2">Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Go back to upload
          </Button>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No questions available</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Progress Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            Progress: {progress.answered}/{progress.total} answered
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNavPanel(!showNavPanel)}
            className="gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            {showNavPanel ? 'Hide' : 'Show'} all
          </Button>
        </div>
        <Progress
          value={(progress.answered / progress.total) * 100}
          className="h-3"
        />
      </Card>

      {/* Question Navigation Panel */}
      {showNavPanel && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Jump to Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.number] !== undefined
                const isCurrent = idx === currentQuestionIndex

                return (
                  <button
                    key={q.number}
                    onClick={() => goToQuestion(idx)}
                    className={cn(
                      'w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200',
                      'glass-effect border border-transparent',
                      'hover:scale-105 hover:!bg-gray-900 hover:text-white hover:shadow-lg',
                      'hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]',
                      isCurrent && 'ring-2 ring-primary bg-primary/20 text-primary',
                      isAnswered && !isCurrent && 'border-success/50 bg-success/20 text-success',
                      !isAnswered && !isCurrent && ''
                    )}
                  >
                    {q.number}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Card */}
      <QuestionCard
        question={currentQuestion}
        answer={answers[currentQuestion.number] ?? null}
        onAnswerChange={(answer) =>
          setAnswer(currentQuestion.number, answer)
        }
        questionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        sessionId={sessionId}
      />

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          variant="secondary"
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-3">
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={nextQuestion} className="gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              variant="success"
              className="gap-2"
              loading={isLoading}
            >
              {!isLoading && <Send className="w-4 h-4" />}
              Submit Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Quick Submit */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSubmit}
          disabled={isLoading}
          className="text-muted-foreground"
        >
          Submit quiz now
        </Button>
      </div>
    </div>
  )
}
