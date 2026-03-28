export default function AdminDashboardLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="h-6 w-56 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 max-w-md rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mt-8 h-32 rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="space-y-4">
          <div className="h-40 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50" />
          <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800/50" />
        </div>
      </div>
    </div>
  )
}
