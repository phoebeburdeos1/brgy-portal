import { SettingsSubnav } from './SettingsSubnav'

export default function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Manage your admin account, archived appointments, and preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <SettingsSubnav />
        <div className="space-y-6 min-w-0">{children}</div>
      </div>
    </div>
  )
}
