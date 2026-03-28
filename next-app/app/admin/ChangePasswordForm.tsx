'use client'

import { useState } from 'react'

export function ChangePasswordForm() {
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    // This is UI-only for now; hook up to an API route when ready.
    setTimeout(() => {
      setSubmitting(false)
      setMessage('Password updated (demo only – wire this to your API).')
    }, 800)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Current password
          </label>
          <input
            type="password"
            required
            className="admin-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            New password
          </label>
          <input
            type="password"
            required
            className="admin-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Confirm new password
          </label>
          <input
            type="password"
            required
            className="admin-field"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        {message && (
          <p className="text-xs text-slate-500">{message}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="interactive inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:opacity-50"
        >
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </div>
    </form>
  )
}

