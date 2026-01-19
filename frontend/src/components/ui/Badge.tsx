import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow',
        success:
          'border-transparent bg-success text-success-foreground shadow',
        warning:
          'border-transparent bg-warning text-warning-foreground shadow',
        outline:
          'text-foreground',
        mcq:
          'border-transparent bg-blue-500/20 text-blue-400 dark:bg-blue-500/30 dark:text-blue-300',
        nat:
          'border-transparent bg-purple-500/20 text-purple-400 dark:bg-purple-500/30 dark:text-purple-300',
        glass:
          'glass-effect text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
