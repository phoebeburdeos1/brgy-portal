'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function BookingCard({
  bookingDisabled,
  unavailableUntil,
}: {
  bookingDisabled: boolean
  unavailableUntil: string | null
}) {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const today = useMemo(() => new Date(), [])

  const minDate = useMemo(() => {
    if (!unavailableUntil) {
      return isoDate(today)
    }
    const until = new Date(unavailableUntil)
    if (Number.isNaN(until.getTime()) || until < today) {
      return isoDate(today)
    }
    const dayAfter = new Date(until)
    dayAfter.setDate(dayAfter.getDate() + 1)
    return isoDate(dayAfter)
  }, [today, unavailableUntil])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const requested = String(formData.get('appointment_date') ?? '')

    if (unavailableUntil && requested) {
      const todayStr = isoDate(today)
      const untilStr = isoDate(new Date(unavailableUntil))
      if (requested >= todayStr && requested <= untilStr) {
        setMessage('Selected date is unavailable while the captain is out of office. Please choose a later date.')
        return
      }
    }
    setIsSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          purpose: formData.get('purpose'),
          appointment_date: formData.get('appointment_date'),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Something went wrong.')
        return
      }
      setMessage('Your appointment request has been sent. A confirmation will be sent to your email and phone.')
      form.reset()
      setTimeout(() => {
        setMessage(null)
        router.refresh()
      }, 3500)
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const monthName = today.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl shadow-lg p-6 text-white">
      <h2 className="text-lg font-bold mb-4">Book an Appointment</h2>
      {message && (
        <div className="mb-4 rounded-lg bg-sky-400/20 text-white px-3 py-2 text-sm fade-away-message">
          {message}
        </div>
      )}
      <div className="mb-4 p-3 rounded-xl bg-black/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Schedule</span>
          <span className="text-xs text-white/70">{monthName}</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
            <div key={d} className="text-white/80 font-semibold">{d}</div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const isToday = d === today.getDate()
            return (
              <div
                key={d}
                className={`h-6 flex items-center justify-center rounded-full ${
                  isToday ? 'bg-amber-400 text-gray-900 font-bold' : 'text-white/90'
                }`}
              >
                {d}
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            disabled={bookingDisabled}
            placeholder="Full name"
            className="w-full rounded-lg border border-blue-400/50 bg-white/10 px-3 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            disabled={bookingDisabled}
            placeholder="your@email.com"
            className="w-full rounded-lg border border-blue-400/50 bg-white/10 px-3 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            required
            disabled={bookingDisabled}
            placeholder="09XX XXX XXXX"
            className="w-full rounded-lg border border-blue-400/50 bg-white/10 px-3 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-1">Purpose</label>
          <textarea
            name="purpose"
            required
            disabled={bookingDisabled}
            rows={3}
            placeholder="e.g. Document request, Certificate"
            className="w-full rounded-lg border border-blue-400/50 bg-white/10 px-3 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-1">Date</label>
          <input
            type="date"
            name="appointment_date"
            required
            disabled={bookingDisabled}
            min={minDate}
            className="w-full rounded-lg border border-blue-400/50 bg-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={bookingDisabled || isSubmitting}
          className="w-full rounded-full bg-amber-400 text-gray-900 font-semibold py-2.5 hover:bg-amber-300 disabled:opacity-50 transition"
        >
          {isSubmitting ? 'Sending…' : 'Schedule Now'}
        </button>
      </form>
    </div>
  )
}
