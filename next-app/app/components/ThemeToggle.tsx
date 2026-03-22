'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle({ variant = 'auto' }: { variant?: 'auto' | 'light' | 'dark' }) {
  const { theme, toggleTheme } = useTheme()

  const base = 'flex items-center justify-center w-9 h-9 rounded-full transition-all'
  const variants = {
    auto:
      'bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-300/80 dark:hover:bg-slate-600/80',
    light: 'text-white/90 hover:text-white hover:bg-white/10',
    dark: 'bg-slate-200/80 text-slate-700 hover:bg-slate-300/80',
  }
  const className = `${base} ${variants[variant]}`

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={className}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  )
}
