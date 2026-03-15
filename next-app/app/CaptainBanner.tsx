import type { CaptainStatus } from '@/lib/supabase'

export function CaptainBanner({ captain }: { captain: CaptainStatus | null }) {
  if (!captain) return null
  const onDuty = captain.status === 'On-Duty'
  return (
    <div
      className={`rounded-xl p-5 text-white shadow-lg ${
        onDuty
          ? 'bg-gradient-to-br from-blue-600 to-blue-800'
          : 'bg-gradient-to-br from-red-500 to-red-700'
      }`}
    >
      <h5 className="font-bold text-lg">
        Captain Burdeos: {captain.status}
      </h5>
      {onDuty ? (
        <p className="mt-1 opacity-90">Available at the office.</p>
      ) : (
        <>
          <p className="mt-1">Reason: {captain.reason || '—'}</p>
          {captain.return_date && (
            <p className="mt-1 text-sm opacity-95">Expected back: {captain.return_date}</p>
          )}
        </>
      )}
    </div>
  )
}
