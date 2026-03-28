'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, CalendarDays } from 'lucide-react'
import type { Appointment } from '@/lib/supabase'
import {
  getNotificationLastOpenedAt,
  setNotificationLastOpenedAt,
} from '@/lib/admin-notification-storage'
import { cn } from '@/components/ui/cn'
import { AppointmentDetailModal } from '@/components/AppointmentDetailModal'

function isUnread(a: Appointment, lastOpenedAt: string | null): boolean {
  if (!lastOpenedAt) return true
  const created = new Date(a.created_at).getTime()
  const boundary = new Date(lastOpenedAt).getTime()
  return created > boundary
}

export function NotificationsBell({ pending }: { pending: Appointment[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [lastOpenedAt, setLastOpenedAt] = useState<string | null>(null)
  const [detail, setDetail] = useState<Appointment | null>(null)

  useEffect(() => {
    setMounted(true)
    setLastOpenedAt(getNotificationLastOpenedAt())
  }, [])

  const unreadCount = useMemo(() => {
    if (!mounted) return 0
    if (pending.length === 0) return 0
    return pending.filter((a) => isUnread(a, lastOpenedAt)).length
  }, [mounted, pending, lastOpenedAt])

  /** Only show badge when there are pending rows and at least one is newer than last acknowledged time */
  const hasUnread = pending.length > 0 && unreadCount > 0
  const recent = pending.slice(0, 5)

  function acknowledge() {
    const now = new Date().toISOString()
    setLastOpenedAt(now)
    setNotificationLastOpenedAt(now)
  }

  function handleBellClick() {
    const willOpen = !open
    setOpen(willOpen)
    if (willOpen) {
      acknowledge()
    }
  }

  async function approve(id: number) {
    await fetch('/api/admin/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, processed: true }),
    })
    setDetail(null)
    router.refresh()
  }

  return (
    <>
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
          {mounted && hasUnread && (
            <span
              className="absolute -right-1 -top-1 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white dark:ring-slate-900"
              suppressHydrationWarning
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-20 dark:border-slate-800 dark:bg-slate-900 dark:shadow-indigo-500/5">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</span>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-500">
                {pending.length} pending
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {recent.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-500 text-center">
                  No new appointment requests.
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recent.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setDetail(a)
                          setOpen(false)
                        }}
                        className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-900 truncate dark:text-slate-100">
                            {a.name || 'Unknown resident'}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-600 line-clamp-2 dark:text-slate-400">
                            {a.purpose || 'No purpose specified'}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">{a.appointment_date}</p>
                          <p className="mt-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                            Open details
                          </p>
                        </div>
                      </button>
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

      {detail ? (
        <AppointmentDetailModal
          appointment={detail}
          onClose={() => setDetail(null)}
          mode="pending"
          onApprove={approve}
        />
      ) : null}
    </>
  )
}
