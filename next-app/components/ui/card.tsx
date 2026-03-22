import { cn } from './cn'

export function Card({
  className,
  children,
  id,
}: {
  className?: string
  children: React.ReactNode
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        'rounded-2xl border bg-white border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-indigo-500/5',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function CardHeader({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('border-b border-slate-200 dark:border-slate-800 px-6 py-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <h2 className={cn('text-sm font-semibold text-slate-900 dark:text-slate-100', className)}>
      {children}
    </h2>
  )
}

export function CardContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>
}

