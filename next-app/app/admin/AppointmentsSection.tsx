'use client'

import { useRouter } from 'next/navigation'
import type { Appointment } from '@/lib/supabase'
import { Archive, Check, CheckCircle2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AppointmentsSection({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter()
  const pending = appointments.filter((a) => !a.processed && !(a.archived ?? false))
  const completed = appointments.filter((a) => a.processed && !(a.archived ?? false))

  async function patch(id: number, body: Record<string, boolean>) {
    await fetch('/api/admin/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...body }),
    })
    router.refresh()
  }

  async function approve(id: number) {
    await patch(id, { processed: true })
  }

  async function archiveCompleted(id: number) {
    await patch(id, { archived: true })
  }

  async function softDelete(id: number) {
    if (!confirm('Remove this from the list? The record stays in the database but is hidden from the dashboard.')) return
    await patch(id, { hidden: true })
  }

  const th =
    'text-left px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-200 dark:text-slate-400 dark:border-slate-800'
  const td =
    'px-4 py-4 border-b border-slate-100 text-[13px] text-slate-700 align-top dark:border-slate-800/50 dark:text-slate-300'

  function truncatePurpose(purpose?: string | null) {
    const value = (purpose ?? '').trim()
    if (value.length <= 40) return value
    return `${value.slice(0, 40)}…`
  }

  return (
    <Card id="appointments">
      <CardHeader className="flex items-center justify-between gap-3">
        <div>
          <CardTitle>Appointment Summary</CardTitle>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Review and approve pending requests. Archive or remove completed rows from view (soft delete).
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-500">
            Pending: {pending.length}
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
            Completed: {completed.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pending</h3>
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={th}>Resident Name</th>
                <th className={th}>Email</th>
                <th className={th}>Phone</th>
                <th className={th}>Purpose</th>
                <th className={th}>Date</th>
                <th className={th}>Status</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No pending appointments.
                  </td>
                </tr>
              ) : (
                pending.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className={td}>{a.name}</td>
                    <td className={td}>{a.email}</td>
                    <td className={td}>{a.phone}</td>
                    <td className={td} title={a.purpose ?? ''}>
                      <span className="block max-w-[28rem] truncate">{truncatePurpose(a.purpose)}</span>
                    </td>
                    <td className={td}>{a.appointment_date}</td>
                    <td className={td}>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-500">
                        Pending
                      </span>
                    </td>
                    <td className={td}>
                      <button
                        type="button"
                        onClick={() => approve(a.id)}
                        aria-label="Approve appointment"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-emerald-100 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-400 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Completed</h3>
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={th}>Resident Name</th>
                <th className={th}>Email</th>
                <th className={th}>Phone</th>
                <th className={th}>Purpose</th>
                <th className={th}>Date</th>
                <th className={th}>Status</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {completed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No completed appointments yet.
                  </td>
                </tr>
              ) : (
                completed.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className={td}>{a.name}</td>
                    <td className={td}>{a.email}</td>
                    <td className={td}>{a.phone}</td>
                    <td className={td} title={a.purpose ?? ''}>
                      <span className="block max-w-[28rem] truncate">{truncatePurpose(a.purpose)}</span>
                    </td>
                    <td className={td}>{a.appointment_date}</td>
                    <td className={td}>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                        Confirmed
                      </span>
                    </td>
                    <td className={td}>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => archiveCompleted(a.id)}
                          aria-label="Archive appointment"
                          title="Archive"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-indigo-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => softDelete(a.id)}
                          aria-label="Remove from list"
                          title="Remove from list (kept in database)"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-rose-100 hover:text-rose-700 dark:text-slate-400 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <span className="inline-flex items-center gap-1 text-slate-500 ml-1">
                          <CheckCircle2 className="h-4 w-4" /> Done
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
