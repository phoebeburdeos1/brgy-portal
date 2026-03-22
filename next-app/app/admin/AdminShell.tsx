'use client'

import { usePathname } from 'next/navigation'
import { AdminNav } from './AdminNav'
import { ThemeToggle } from '../components/ThemeToggle'

export function AdminShell({
  children,
  isAdmin,
}: {
  children: React.ReactNode
  isAdmin: boolean
}) {
  const path = usePathname()
  const isLogin = path === '/admin/login'

  if (isLogin) {
    return (
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
        <div className="fixed top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950">
      <aside className="w-72 flex-shrink-0 flex flex-col border-r backdrop-blur-xl bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Barangay Bonbon System
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Admin Dashboard</div>
            </div>
            <ThemeToggle />
          </div>
        </div>
        <AdminNav isAdmin={isAdmin} />
        <div className="mt-auto px-5 pb-5 pt-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="uppercase tracking-wide text-[10px] text-slate-400 dark:text-slate-500">
            Admin
          </div>
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              window.location.href = '/admin/login'
            }}
            className="mt-1 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 lg:p-8 bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </main>
    </div>
  )
}
