import { cn } from './cn'

const variants = {
  slate:
    'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:ring-slate-700',
  amber:
    'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:ring-amber-500/20',
  green:
    'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  red: 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20',
  indigo:
    'bg-indigo-50 text-indigo-800 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20',
} as const

export function Badge({
  children,
  variant = 'slate',
  leadingDot = false,
  className,
}: {
  children: React.ReactNode
  variant?: keyof typeof variants
  leadingDot?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        variants[variant],
        className,
      )}
    >
      {leadingDot && (
        <span className="mr-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
      )}
      {children}
    </span>
  )
}

