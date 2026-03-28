import type { CaptainStatus } from '@/lib/supabase'

export function CaptainBanner({ captain }: { captain: CaptainStatus | null }) {
  if (!captain) return null
  const onDuty = captain.status === 'On-Duty'
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-5 text-white shadow-lg transition-all duration-200 ${
        onDuty
          ? 'bg-gradient-to-br from-blue-600 to-blue-800'
          : 'bg-gradient-to-br from-red-500 to-red-700'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-slate-900/70 via-slate-900/25 to-transparent"
        aria-hidden
      />
      <div className="relative z-10">
        <h5 className="font-bold text-lg drop-shadow-sm">
          Captain Burdeos: {captain.status}
        </h5>
        {onDuty ? (
          <p className="mt-1 text-white/95 drop-shadow-sm">Available at the office.</p>
        ) : (
          <>
            <p className="mt-1 drop-shadow-sm">Reason: {captain.reason || '—'}</p>
            {captain.return_date && (
              <p className="mt-1 text-sm text-white/95 drop-shadow-sm">Expected back: {captain.return_date}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
