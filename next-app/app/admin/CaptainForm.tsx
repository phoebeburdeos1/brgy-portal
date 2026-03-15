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
        <div className="mb-4 p-2 rounded bg-blue-50 text-blue-800 text-sm">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
        <div className="min-w-[140px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          >
            <option value="On-Duty">On Duty (Green)</option>
            <option value="Out of Office">Out of Town (Red)</option>
          </select>
        </div>
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason (if out)</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Cebu City for Barangay League"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="min-w-[140px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>
    </>
  )
}
