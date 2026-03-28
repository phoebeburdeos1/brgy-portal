'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CaptainForm() {
  const router = useRouter()
  const [status, setStatus] = useState('On-Duty')
  const [reason, setReason] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/captain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reason: reason.trim() || null,
          return_date: returnDate || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Failed to save')
        return
      }
      setMessage('Captain status updated.')
      router.refresh()
    } catch {
      setMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {message && (
        <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="admin-field [&_option]:bg-slate-100 dark:[&_option]:bg-slate-800 [&_option]:text-slate-900 dark:[&_option]:text-slate-100"
            required
          >
            <option value="On-Duty">On Duty (Green)</option>
            <option value="Out of Office">Out of Town (Red)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Reason (if out)</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Cebu City for Barangay League"
            className="admin-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Return Date</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="admin-field"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="interactive inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </>
  )
}
