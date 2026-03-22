import { cn } from './cn'

export function IconButton({
  label,
  variant = 'primary',
  size = 'sm',
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  variant?: 'primary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none'

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
  } as const

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500',
    danger:
      'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/30',
    ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
  } as const

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}

