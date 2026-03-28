'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Appointment } from '@/lib/supabase'
import { ArchiveRestore, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export function ArchivedAppointmentsSection({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter()
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  async function patch(id: number, body: Record<string, boolean>) {
    await fetch('/api/admin/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...body }),
    })
    router.refresh()
  }

  async function restore(id: number) {
    await patch(id, { archived: false })
  }

  async function confirmSoftDelete() {
    if (deleteTargetId == null) return
    await patch(deleteTargetId, { hidden: true })
    setDeleteTargetId(null)
  }

  const th =
    'text-left px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-200 dark:text-slate-400 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50'
  const td =
    'px-4 py-4 border-b border-slate-100 text-[13px] text-slate-700 align-top dark:border-slate-800/50 dark:text-slate-300 transition-colors duration-200'

  return (
    <>
      <ConfirmDialog
        open={deleteTargetId !== null}
        title="Remove from list?"
        message="Are you sure you want to delete? The record stays in the database but will be hidden from the archive."
        confirmLabel="Yes"
        cancelLabel="No"
        variant="danger"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={confirmSoftDelete}
      />
    <Card>
      <CardHeader>
        <CardTitle>Archived appointments</CardTitle>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Completed requests you moved here from the main appointments list. Restore to show them again under
          Completed, or remove from view (soft delete — data remains in the database).
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className={th}>Resident</th>
                <th className={th}>Email</th>
                <th className={th}>Phone</th>
                <th className={th}>Purpose</th>
                <th className={th}>Date</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No archived appointments.
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-all duration-200">
                    <td className={td}>{a.name}</td>
                    <td className={td}>{a.email}</td>
                    <td className={td}>{a.phone}</td>
                    <td className={td} title={a.purpose ?? ''}>
                      <span className="block max-w-[20rem] truncate">{a.purpose}</span>
                    </td>
                    <td className={td}>{a.appointment_date}</td>
                    <td className={td}>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => restore(a.id)}
                          title="Restore to completed list"
                          aria-label="Restore"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-400 transition-colors"
                        >
                          <ArchiveRestore className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(a.id)}
                          title="Remove from view"
                          aria-label="Remove from view"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
    </>
  )
}
