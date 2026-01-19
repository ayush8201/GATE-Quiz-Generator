import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative p-2 rounded-lg transition-all duration-300',
        'glass-effect hover:scale-105',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        className
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        <Sun
          className={cn(
            'absolute inset-0 h-6 w-6 transition-all duration-300',
            theme === 'dark'
              ? 'rotate-0 scale-100 text-yellow-400'
              : 'rotate-90 scale-0 text-yellow-400'
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 h-6 w-6 transition-all duration-300',
            theme === 'dark'
              ? '-rotate-90 scale-0 text-blue-400'
              : 'rotate-0 scale-100 text-blue-400'
          )}
        />
      </div>
    </button>
  )
}
