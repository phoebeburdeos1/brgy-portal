'use client'

import { useEffect, useState } from 'react'
import type { Announcement } from '@/lib/supabase'

function formatTimestamp(value: string) {
  if (!value) return ''
  const iso = new Date(value).toISOString()
  return iso.replace('T', ' ').slice(0, 16)
}

export function AnnouncementsGrid({ announcements }: { announcements: Announcement[] }) {
  const [selected, setSelected] = useState<Announcement | null>(null)

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  useEffect(() => {
    if (selected) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [selected])

  if (announcements.length === 0) {
    return <p className="text-gray-500 dark:text-slate-400">No announcements yet.</p>
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            onClick={() => setSelected(ann)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelected(ann)
              }
            }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4
              cursor-pointer select-none
              hover:shadow-md hover:border-indigo-200 dark:hover:border-slate-500 hover:bg-gray-50/80 dark:hover:bg-slate-700/50
              transition-[box-shadow,border-color,background-color]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
          >
            <h5 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">{ann.title}</h5>
            <p className="text-gray-600 dark:text-slate-300 text-sm mb-2 whitespace-pre-line line-clamp-4">
              {ann.body}
            </p>
            <div className="flex items-center justify-between gap-2 mt-3">
              <small className="text-gray-400 dark:text-slate-500 text-xs">
                Posted {formatTimestamp(ann.created_at)}
              </small>
              <span className="text-indigo-600 dark:text-indigo-400 text-xs font-medium shrink-0">
                View details
              </span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="presentation"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            aria-hidden
            onClick={() => setSelected(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-dialog-title"
            className="relative z-10 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-xl
              bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 p-5 sm:p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900
                dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 transition-colors"
              aria-label="Close announcement"
            >
              <span aria-hidden className="text-xl leading-none">
                ×
              </span>
            </button>
            <h2
              id="announcement-dialog-title"
              className="font-semibold text-gray-900 dark:text-slate-100 text-lg pr-10 mb-3"
            >
              {selected.title}
            </h2>
            <p className="text-gray-600 dark:text-slate-300 text-sm whitespace-pre-line mb-4">{selected.body}</p>
            <small className="text-gray-400 dark:text-slate-500 text-xs">
              Posted {formatTimestamp(selected.created_at)}
            </small>
          </div>
        </div>
      )}
    </>
  )
}
