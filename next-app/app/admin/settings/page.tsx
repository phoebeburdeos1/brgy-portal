import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChangePasswordForm } from '../ChangePasswordForm'
import { LogoutButton } from '../LogoutButton'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const admin = await isAdmin()
  if (!admin) {
    redirect('/admin/login?from=/admin/settings')
  }

  const adminEmail = 'admin@urios.edu.ph'

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Manage your admin account, security, and system preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Sections
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-indigo-50 text-indigo-900 px-3 py-2 text-sm font-medium text-left dark:bg-slate-800 dark:text-slate-100"
          >
            Account
          </button>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 text-left dark:text-slate-400 dark:hover:bg-slate-800/50"
          >
            Security
          </button>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 text-left dark:text-slate-400 dark:hover:bg-slate-800/50"
          >
            System preferences
          </button>
        </aside>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Admin email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  readOnly
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200"
                />
                <p className="mt-1 text-xs text-slate-500">
                  This email is used for administrator communication.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Update your admin password regularly to keep the dashboard secure.
              </p>
              <ChangePasswordForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Developer info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The admin login uses a shared environment variable for authentication.
              </p>
              <pre className="rounded-xl bg-slate-950/95 px-4 py-3 text-xs text-slate-50 overflow-x-auto">
                <code>
                  {'# .env.local\n'}
                  {'ADMIN_PASSWORD="your-strong-password-here"'}
                </code>
              </pre>
              <p className="text-xs text-slate-500">
                Restart the dev server after changing this value so the new password is applied.
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10">
            <CardHeader>
              <CardTitle className="text-rose-800 dark:text-rose-400">Danger zone</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-rose-800 dark:text-rose-300">
                Log out of the admin dashboard from this device.
              </p>
              <LogoutButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

