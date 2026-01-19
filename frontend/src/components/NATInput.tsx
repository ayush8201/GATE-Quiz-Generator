import { ChangeEvent } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { QuestionType } from '../types'
import { Input } from './ui/Input'
import { cn } from '@/lib/utils'

interface NATInputProps {
  value: number | string | null
  questionType: QuestionType
  onChange: (value: number | null) => void
  disabled?: boolean
  correctAnswer?: number | [number, number] | null
  showCorrect?: boolean
}

export function NATInput({
  value,
  questionType,
  onChange,
  disabled = false,
  correctAnswer,
  showCorrect = false,
}: NATInputProps) {
  const isInteger = questionType === QuestionType.NAT_INTEGER

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (inputValue === '' || inputValue === '-') {
      onChange(null)
      return
    }

    const numValue = isInteger
      ? parseInt(inputValue, 10)
      : parseFloat(inputValue)

    if (!isNaN(numValue)) {
      onChange(numValue)
    }
  }

  const formatCorrectAnswer = (): string => {
    if (correctAnswer === null || correctAnswer === undefined) return ''

    if (Array.isArray(correctAnswer)) {
      return `${correctAnswer[0]} to ${correctAnswer[1]}`
    }

    return String(correctAnswer)
  }

  const isCorrect = (): boolean => {
    if (!showCorrect || correctAnswer === null || value === null) return false

    const numValue = typeof value === 'string' ? parseFloat(value) : value

    if (Array.isArray(correctAnswer)) {
      return numValue >= correctAnswer[0] && numValue <= correctAnswer[1]
    }

    if (isInteger) {
      return Math.floor(numValue) === correctAnswer
    }

    return Math.abs(numValue - (correctAnswer as number)) <= 0.01
  }

  const correct = showCorrect && isCorrect()
  const incorrect = showCorrect && value !== null && !correct

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground italic">
        {isInteger
          ? 'Enter an integer value'
          : 'Enter a decimal value (up to 2 decimal places)'}
      </p>

      <div className="relative">
        <Input
          type="number"
          step={isInteger ? '1' : '0.01'}
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled}
          placeholder={isInteger ? 'Enter integer...' : 'Enter decimal...'}
          className={cn(
            'text-lg pr-12',
            correct && 'border-success bg-success/10',
            incorrect && 'border-destructive bg-destructive/10'
          )}
        />

        {showCorrect && (correct || incorrect) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {correct ? (
              <CheckCircle className="w-6 h-6 text-success" />
            ) : (
              <XCircle className="w-6 h-6 text-destructive" />
            )}
          </div>
        )}
      </div>

      {showCorrect && incorrect && (
        <p className="text-sm text-muted-foreground">
          Correct answer:{' '}
          <span className="font-semibold text-success">
            {formatCorrectAnswer()}
          </span>
        </p>
      )}
    </div>
  )
}
