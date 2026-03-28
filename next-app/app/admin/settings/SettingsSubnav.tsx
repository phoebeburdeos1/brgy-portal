'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/components/ui/cn'

const items = [
  { href: '/admin/settings', label: 'Account' },
  { href: '/admin/settings/archive', label: 'Archive' },
] as const

export function SettingsSubnav() {
  const path = usePathname()

  return (
    <aside className="space-y-1">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 mb-2">
        Sections
      </div>
      {items.map(({ href, label }) => {
        const active = path === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'block w-full rounded-lg px-3 py-2 text-sm font-medium text-left transition-all duration-200',
              active
                ? 'bg-indigo-50 text-indigo-900 dark:bg-slate-800 dark:text-slate-100'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50',
            )}
          >
            {label}
          </Link>
        )
      })}
    </aside>
  )
}
