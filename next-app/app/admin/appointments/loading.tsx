export default function AdminAppointmentsLoading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading appointments">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="mt-6 flex gap-2">
          <div className="h-7 w-24 rounded-full bg-amber-100 dark:bg-amber-900/30" />
          <div className="h-7 w-28 rounded-full bg-emerald-100 dark:bg-emerald-900/30" />
        </div>
        <div className="mt-6 h-12 w-full rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="mt-3 h-40 w-full rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30" />
        <div className="mt-8 h-5 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 h-40 w-full rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30" />
      </div>
    </div>
  )
}
