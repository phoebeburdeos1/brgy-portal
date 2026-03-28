'use client'

import { X } from 'lucide-react'
import type { Appointment } from '@/lib/supabase'

type Props = {
  appointment: Appointment | null
  onClose: () => void
  /** Pending: “Keep pending” + “Approve”. Completed: single “Close”. */
  mode: 'pending' | 'completed'
  onApprove?: (id: number) => void | Promise<void>
}

export function AppointmentDetailModal({ appointment, onClose, mode, onApprove }: Props) {
  if (!appointment) return null

  const id = appointment.id

  async function handleApprove() {
    await onApprove?.(id)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appt-detail-title"
        className="relative z-10 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6">
          <div className="min-w-0">
            <h2 id="appt-detail-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Appointment request
            </h2>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">{appointment.name}</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-4 text-sm">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Email
            </span>
            <p className="mt-1 text-slate-800 dark:text-slate-200 break-all">{appointment.email}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Phone
            </span>
            <p className="mt-1 text-slate-800 dark:text-slate-200">{appointment.phone}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Requested date
            </span>
            <p className="mt-1 text-slate-800 dark:text-slate-200">{appointment.appointment_date}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Purpose
            </span>
            <p className="mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{appointment.purpose}</p>
          </div>
        </div>
        <div className="p-4 sm:p-6 pt-0 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end border-t border-slate-100 dark:border-slate-800">
          {mode === 'pending' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Keep pending
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Approve
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 sm:ml-auto"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
