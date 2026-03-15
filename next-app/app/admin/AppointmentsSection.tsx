'use client'

import { useRouter } from 'next/navigation'
import type { Appointment } from '@/lib/supabase'

export function AppointmentsSection({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter()
  const pending = appointments.filter((a) => !a.processed)
  const completed = appointments.filter((a) => a.processed)

  async function approve(id: number) {
    await fetch('/api/admin/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, processed: true }),
    })
    router.refresh()
  }

  const th = 'text-left py-2 px-3 text-xs font-semibold uppercase text-gray-500 border-b border-gray-200'
  const td = 'py-2 px-3 border-b border-gray-100 text-sm'

  return (
    <div className="bg-white rounded-xl shadow mb-6" id="appointments">
      <div className="border-b border-gray-200 px-5 py-3 font-semibold text-gray-900">
        Appointment Summary
      </div>
      <div className="p-5">
        <h6 className="font-medium text-gray-700 mb-2">Pending Appointments</h6>
        <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
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
              {pending.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    No pending appointments.
                  </td>
                </tr>
              ) : (
                pending.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className={td}>{a.name}</td>
                    <td className={td}>{a.email}</td>
                    <td className={td}>{a.phone}</td>
                    <td className={td}>{a.purpose}</td>
                    <td className={td}>{a.appointment_date}</td>
                    <td className={td}>
                      <span className="inline-flex rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-medium">
                        Pending
                      </span>
                    </td>
                    <td className={td}>
                      <button
                        type="button"
                        onClick={() => approve(a.id)}
                        className="rounded bg-green-600 text-white px-2 py-1 text-xs font-medium hover:bg-green-700"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h6 className="font-medium text-gray-700 mb-2">Completed Appointments</h6>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    No completed appointments yet.
                  </td>
                </tr>
              ) : (
                completed.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className={td}>{a.name}</td>
                    <td className={td}>{a.email}</td>
                    <td className={td}>{a.phone}</td>
                    <td className={td}>{a.purpose}</td>
                    <td className={td}>{a.appointment_date}</td>
                    <td className={td}>
                      <span className="inline-flex rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-medium">
                        Confirmed
                      </span>
                    </td>
                    <td className={td}>
                      <span className="text-gray-400">Done</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
