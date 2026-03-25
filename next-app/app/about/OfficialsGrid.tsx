'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'

export type Official = {
  name: string
  position: string
  initials: string
  /**
   * Optional photo path, e.g. "/officials/pb.jpg".
   * If not provided, we fall back to the initials circle.
   */
  photoSrc?: string
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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((official) => (
          <button
            key={official.initials}
            type="button"
            onClick={() => setActive(official)}
            className="rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-200 dark:border-slate-700 text-center hover:shadow-md transition-shadow"
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
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">{official.position}</p>
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 p-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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

              <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                Click-to-view details. You can add a longer bio/description field anytime if you want.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

