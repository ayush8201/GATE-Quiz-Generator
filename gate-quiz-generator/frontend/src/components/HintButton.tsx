import { useState } from 'react'
import { Lightbulb, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { useQuizStore } from '../store/quizStore'
import { getHint } from '../services/api'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'

interface HintButtonProps {
  questionNumber: number
  sessionId: string
}

export function HintButton({ questionNumber, sessionId }: HintButtonProps) {
  const [showHint, setShowHint] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hints = useQuizStore((state) => state.hints)
  const hintLoading = useQuizStore((state) => state.hintLoading)
  const setHint = useQuizStore((state) => state.setHint)
  const setHintLoading = useQuizStore((state) => state.setHintLoading)

  const hint = hints[questionNumber]
  const isLoading = hintLoading[questionNumber] || false

  const handleGetHint = async () => {
    if (hint) {
      setShowHint(!showHint)
      return
    }

    await fetchHint()
  }

  const fetchHint = async () => {
    setHintLoading(questionNumber, true)
    setError(null)

    try {
      const response = await getHint(sessionId, questionNumber)
      setHint(questionNumber, response.hint)
      setShowHint(true)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      const errorMessage = error.response?.data?.detail || 'Failed to get hint'
      setError(errorMessage)
    } finally {
      setHintLoading(questionNumber, false)
    }
  }

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-4 p-3 rounded-xl glass-effect border-destructive/50 bg-destructive/10 text-destructive text-sm animate-fade-in">
          {error}
        </div>
      )}

      <Button
        onClick={handleGetHint}
        disabled={isLoading}
        variant="warning"
        className="gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating hint...
          </>
        ) : (
          <>
            <Lightbulb className="h-4 w-4" />
            {hint ? (showHint ? 'Hide Hint' : 'Show Hint') : 'Get Hint'}
            {hint && (showHint ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
          </>
        )}
      </Button>

      {hint && showHint && (
        <div className={cn(
          'mt-4 p-4 rounded-xl glass-effect',
          'border-warning/30 bg-warning/10',
          'animate-fade-in'
        )}>
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-foreground text-sm leading-relaxed">{hint}</p>
          </div>
        </div>
      )}
    </div>
  )
}
