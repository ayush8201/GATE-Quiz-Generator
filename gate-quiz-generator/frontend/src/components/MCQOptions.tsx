import { CheckCircle, XCircle } from 'lucide-react'
import { QuestionType } from '../types'
import { cn } from '@/lib/utils'

interface MCQOptionsProps {
  options: Record<string, string>
  selectedAnswer: string | string[] | null
  questionType: QuestionType
  onChange: (answer: string | string[]) => void
  disabled?: boolean
  correctAnswer?: string | string[] | null
  showCorrect?: boolean
}

export function MCQOptions({
  options,
  selectedAnswer,
  questionType,
  onChange,
  disabled = false,
  correctAnswer,
  showCorrect = false,
}: MCQOptionsProps) {
  const isMultiple = questionType === QuestionType.MCQ_MULTIPLE

  const isSelected = (optionKey: string): boolean => {
    if (!selectedAnswer) return false
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(optionKey)
    }
    return selectedAnswer === optionKey
  }

  const isCorrect = (optionKey: string): boolean => {
    if (!correctAnswer) return false
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.includes(optionKey)
    }
    return correctAnswer === optionKey
  }

  const handleClick = (optionKey: string) => {
    if (disabled) return

    if (isMultiple) {
      const currentSelection = Array.isArray(selectedAnswer)
        ? selectedAnswer
        : selectedAnswer
        ? [selectedAnswer]
        : []

      if (currentSelection.includes(optionKey)) {
        onChange(currentSelection.filter((k) => k !== optionKey))
      } else {
        onChange([...currentSelection, optionKey].sort())
      }
    } else {
      onChange(optionKey)
    }
  }

  const sortedOptions = Object.entries(options).sort(([a], [b]) =>
    a.localeCompare(b)
  )

  return (
    <div className="space-y-3">
      {isMultiple && (
        <p className="text-sm text-muted-foreground italic">
          Select all that apply
        </p>
      )}
      {sortedOptions.map(([key, text]) => {
        const selected = isSelected(key)
        const correct = showCorrect && isCorrect(key)
        const incorrect = showCorrect && selected && !correct

        return (
          <button
            key={key}
            onClick={() => handleClick(key)}
            disabled={disabled}
            className={cn(
              'w-full text-left p-4 rounded-xl transition-all duration-200',
              'glass-effect',
              !disabled && 'cursor-pointer hover:scale-[1.01]',
              disabled && 'cursor-default',
              correct && 'border-success bg-success/20',
              incorrect && 'border-destructive bg-destructive/20',
              selected && !showCorrect && 'border-primary bg-primary/20',
              !selected && !showCorrect && !disabled && 'hover:border-primary/50 hover:bg-primary/5'
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                  'font-semibold text-sm transition-colors duration-200',
                  correct && 'bg-success text-success-foreground',
                  incorrect && 'bg-destructive text-destructive-foreground',
                  selected && !showCorrect && 'bg-primary text-primary-foreground',
                  !selected && !correct && !incorrect && 'bg-muted text-muted-foreground'
                )}
              >
                {key}
              </span>
              <span className="text-foreground flex-1 pt-1">{text}</span>
              {showCorrect && correct && (
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
              )}
              {showCorrect && incorrect && (
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
