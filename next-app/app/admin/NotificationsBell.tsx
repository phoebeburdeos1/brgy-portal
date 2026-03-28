'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, CalendarDays, X } from 'lucide-react'
import type { Appointment } from '@/lib/supabase'
import { cn } from '@/components/ui/cn'

const STORAGE_KEY = 'admin_notifications_last_opened_at'

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
    setLastOpenedAt(window.localStorage.getItem(STORAGE_KEY))
  }, [])

  const unreadCount = useMemo(() => {
    if (!mounted) return 0
    return pending.filter((a) => isUnread(a, lastOpenedAt)).length
  }, [mounted, pending, lastOpenedAt])

  const hasUnread = unreadCount > 0
  const recent = pending.slice(0, 5)

  function acknowledge() {
    const now = new Date().toISOString()
    setLastOpenedAt(now)
    window.localStorage.setItem(STORAGE_KEY, now)
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
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"
            aria-label="Close"
            onClick={() => setDetail(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notif-appt-title"
            className="relative z-10 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 p-4">
              <div className="min-w-0">
                <h2 id="notif-appt-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Appointment request
                </h2>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">{detail.name}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setDetail(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</span>
                <p className="text-slate-800 dark:text-slate-200 break-all">{detail.email}</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Phone</span>
                <p className="text-slate-800 dark:text-slate-200">{detail.phone}</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Requested date</span>
                <p className="text-slate-800 dark:text-slate-200">{detail.appointment_date}</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Purpose</span>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{detail.purpose}</p>
              </div>
            </div>
            <div className="p-4 pt-0 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Keep pending
              </button>
              <button
                type="button"
                onClick={() => approve(detail.id)}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
