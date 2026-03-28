'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'

export type Official = {
  name: string
  position: string
  initials: string
  photoSrc?: string
  /** Optional longer text shown in the detail dialog */
  summary?: string
}

export function OfficialsGrid({ officials }: { officials: Official[] }) {
  const [active, setActive] = useState<Official | null>(null)

  const sorted = useMemo(() => officials, [officials])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [active])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((official) => (
          <button
            key={official.name}
            type="button"
            onClick={() => setActive(official)}
            className="interactive rounded-xl bg-white dark:bg-slate-800/80 p-5 shadow-sm border border-slate-200 dark:border-slate-700 text-center
              cursor-pointer select-none
              hover:shadow-md hover:border-blue-200/80 dark:hover:border-slate-600
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
          >
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold mx-auto mb-3 overflow-hidden">
              {official.photoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={official.photoSrc}
                  alt={official.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                official.initials
              )}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{official.name}</h3>
            <p className="text-sm text-blue-800/80 dark:text-blue-300/70 italic font-medium">{official.position}</p>
            <p className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400">View details</p>
          </button>
        ))}
      </div>

      {active ? (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] cursor-default border-0"
            aria-label="Close dialog"
            onClick={() => setActive(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="official-dialog-title"
            className="relative z-10 w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 p-4">
              <div className="min-w-0">
                <div
                  id="official-dialog-title"
                  className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  {active.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 italic">
                  {active.position}
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setActive(null)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold overflow-hidden mb-4">
                {active.photoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={active.photoSrc}
                    alt={active.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  active.initials
                )}
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed text-left sm:text-center">
                {active.summary ??
                  `Serves as ${active.position} for Barangay Bonbon. For concerns related to this office, please visit the barangay hall or use the appointment form on the home page.`}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
