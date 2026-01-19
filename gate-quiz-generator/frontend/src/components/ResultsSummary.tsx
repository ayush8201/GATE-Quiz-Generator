import { QuizResult } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Trophy, CheckCircle, XCircle, MinusCircle, Eye, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResultsSummaryProps {
  result: QuizResult
  onReviewQuestions: () => void
  onRetakeQuiz: () => void
}

export function ResultsSummary({
  result,
  onReviewQuestions,
  onRetakeQuiz,
}: ResultsSummaryProps) {
  const scoreColor =
    result.score_percentage >= 70
      ? 'text-success'
      : result.score_percentage >= 40
      ? 'text-warning'
      : 'text-destructive'

  const scoreBgGradient =
    result.score_percentage >= 70
      ? 'from-emerald-400 to-emerald-600'
      : result.score_percentage >= 40
      ? 'from-amber-400 to-amber-600'
      : 'from-red-400 to-red-600'

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-in">
      {/* Score Circle */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-warning" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className={cn(
              'w-40 h-40 mx-auto rounded-full flex items-center justify-center',
              'bg-gradient-to-br shadow-xl',
              scoreBgGradient,
              'animate-pulse-glow'
            )}
          >
            <div className="glass-effect rounded-full w-32 h-32 flex items-center justify-center">
              <span className={cn('text-4xl font-bold', scoreColor)}>
                {result.score_percentage.toFixed(1)}%
              </span>
            </div>
          </div>

          <p className="text-muted-foreground">
            You scored{' '}
            <span className="font-semibold text-foreground">
              {result.correct} out of {result.total_questions}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-6 h-6 text-success" />
            <div className="text-3xl font-bold text-success">{result.correct}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
        </Card>
        <Card className="text-center p-4">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="w-6 h-6 text-destructive" />
            <div className="text-3xl font-bold text-destructive">{result.incorrect}</div>
            <div className="text-sm text-muted-foreground">Incorrect</div>
          </div>
        </Card>
        <Card className="text-center p-4">
          <div className="flex flex-col items-center gap-2">
            <MinusCircle className="w-6 h-6 text-muted-foreground" />
            <div className="text-3xl font-bold text-muted-foreground">
              {result.unattempted}
            </div>
            <div className="text-sm text-muted-foreground">Skipped</div>
          </div>
        </Card>
      </div>

      {/* Question-wise breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {result.results.map((qResult) => (
              <div
                key={qResult.question_number}
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  'text-sm font-medium transition-all duration-200',
                  'glass-effect',
                  qResult.is_correct
                    ? 'border-success/50 bg-success/20 text-success'
                    : qResult.user_answer === null
                    ? 'border-muted bg-muted/20 text-muted-foreground'
                    : 'border-destructive/50 bg-destructive/20 text-destructive'
                )}
                title={`Q${qResult.question_number}: ${
                  qResult.is_correct
                    ? 'Correct'
                    : qResult.user_answer === null
                    ? 'Skipped'
                    : 'Incorrect'
                }`}
              >
                {qResult.question_number}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onReviewQuestions}
          className="flex-1"
          size="lg"
        >
          <Eye className="w-5 h-5 mr-2" />
          Review Answers
        </Button>
        <Button
          onClick={onRetakeQuiz}
          variant="secondary"
          className="flex-1"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start Over
        </Button>
      </div>
    </div>
  )
}
