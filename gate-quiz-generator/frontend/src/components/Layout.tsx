import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GraduationCap, Home } from 'lucide-react'
import { ThemeToggle } from './ui/ThemeToggle'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen relative">
      {/* Animated gradient background */}
      <div className="animated-gradient-bg" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4">
          <nav className={cn(
            'flex items-center justify-between h-16 mt-4 px-6 rounded-2xl',
            'glass-effect'
          )}>
            {/* Logo / Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <GraduationCap className="w-6 h-6" />
              <span className="font-semibold text-lg hidden sm:inline">GATE Quiz</span>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {!isHomePage && (
                <Link
                  to="/"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                    'text-muted-foreground hover:text-foreground',
                    'transition-colors'
                  )}
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              )}
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            GATE Quiz Generator - Practice smarter, score higher
          </p>
        </div>
      </footer>
    </div>
  )
}
