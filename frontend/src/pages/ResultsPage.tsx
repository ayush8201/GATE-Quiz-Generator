import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { ResultsSummary } from '../components/ResultsSummary'
import { QuestionCard } from '../components/QuestionCard'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useQuizStore } from '../store/quizStore'
import { cn } from '@/lib/utils'

export function ResultsPage() {
  const navigate = useNavigate()
  const { result, questions, answers, reset } = useQuizStore()
  const [reviewMode, setReviewMode] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No results available</p>
          <Button onClick={() => navigate('/')}>
            Start a new quiz
          </Button>
        </Card>
      </div>
    )
  }

  const handleRetakeQuiz = () => {
    reset()
    navigate('/')
  }

  const handleReviewQuestions = () => {
    setReviewMode(true)
    setReviewIndex(0)
  }

  const handleBackToSummary = () => {
    setReviewMode(false)
  }

  if (reviewMode) {
    const currentQuestion = questions[reviewIndex]
    const currentResult = result.results.find(
      (r) => r.question_number === currentQuestion?.number
    )

    if (!currentQuestion || !currentResult) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Question not found</p>
          </Card>
        </div>
      )
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBackToSummary}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Summary
        </Button>

        {/* Question Navigator */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Jump to Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const qResult = result.results.find(
                  (r) => r.question_number === q.number
                )
                const isCorrect = qResult?.is_correct
                const isSkipped = qResult?.user_answer === null
                const isCurrent = idx === reviewIndex

                return (
                  <button
                    key={q.number}
                    onClick={() => setReviewIndex(idx)}
                    className={cn(
                      'w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200',
                      'glass-effect border border-transparent',
                      'hover:scale-105 hover:!bg-gray-900 hover:text-white hover:shadow-lg',
                      'hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]',
                      isCurrent && 'ring-2 ring-primary bg-primary/20 text-primary',
                      isCorrect && !isCurrent && 'border-success/50 bg-success/20 text-success',
                      isSkipped && !isCurrent && 'border-muted bg-muted/20 text-muted-foreground',
                      !isCorrect && !isSkipped && !isCurrent && 'border-destructive/50 bg-destructive/20 text-destructive'
                    )}
                  >
                    {q.number}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Question Card in Review Mode */}
        <QuestionCard
          question={currentQuestion}
          answer={answers[currentQuestion.number] ?? null}
          onAnswerChange={() => {}}
          questionIndex={reviewIndex}
          totalQuestions={questions.length}
          result={currentResult}
          reviewMode={true}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
            disabled={reviewIndex === 0}
            variant="secondary"
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <span className="text-muted-foreground">
            {reviewIndex + 1} / {questions.length}
          </span>

          <Button
            onClick={() =>
              setReviewIndex((i) => Math.min(questions.length - 1, i + 1))
            }
            disabled={reviewIndex === questions.length - 1}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 animate-slide-in">
      <ResultsSummary
        result={result}
        onReviewQuestions={handleReviewQuestions}
        onRetakeQuiz={handleRetakeQuiz}
      />
    </div>
  )
}
