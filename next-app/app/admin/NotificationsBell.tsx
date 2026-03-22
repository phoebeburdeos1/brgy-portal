'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bell, CalendarDays } from 'lucide-react'
import type { Appointment } from '@/lib/supabase'
import { cn } from '@/components/ui/cn'

export function NotificationsBell({ pending }: { pending: Appointment[] }) {
  const [open, setOpen] = useState(false)
  const [lastSeenPendingCount, setLastSeenPendingCount] = useState(0)
  const storageKey = 'admin_last_seen_pending_count'

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey)
    const parsed = raw ? Number(raw) : 0
    if (!Number.isNaN(parsed)) {
      setLastSeenPendingCount(parsed)
    }
  }, [])

  const unreadCount = useMemo(
    () => Math.max(0, pending.length - lastSeenPendingCount),
    [lastSeenPendingCount, pending.length],
  )
  const hasPending = unreadCount > 0
  const recent = pending.slice(0, 3)

  function handleBellClick() {
    const nextOpen = !open
    setOpen(nextOpen)
    if (!open) {
      const latest = pending.length
      setLastSeenPendingCount(latest)
      window.localStorage.setItem(storageKey, String(latest))
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={handleBellClick}
        className={cn(
          'relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm',
          'hover:text-slate-900 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          'dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:border-slate-600 dark:focus-visible:ring-offset-slate-950',
        )}
      >
        <Bell className="h-4 w-4" />
        {hasPending && (
          <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-20 dark:border-slate-800 dark:bg-slate-900 dark:shadow-indigo-500/5">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between dark:border-slate-800">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</span>
            {hasPending && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-500">
                {pending.length} pending
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {recent.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-500 text-center">
                No new appointment requests.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {recent.map((a) => (
                  <li key={a.id} className="px-4 py-3 flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 truncate dark:text-slate-100">
                        {a.name || 'Unknown resident'}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600 truncate dark:text-slate-400">
                        {a.purpose || 'No purpose specified'}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {a.appointment_date}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-2 flex justify-end dark:border-slate-800">
            <Link
              href="/admin/appointments"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              View all appointments
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

