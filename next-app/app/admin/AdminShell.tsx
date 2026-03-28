'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
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
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    setNavOpen(false)
  }, [path])

  if (isLogin) {
    return (
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
        <div className="fixed top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950">
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          aria-expanded={navOpen}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setNavOpen((o) => !o)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            Barangay Bonbon
          </div>
          <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">Admin</div>
        </div>
        <ThemeToggle />
      </header>

      {navOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/50"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex w-[min(18rem,85vw)] flex-col border-r border-slate-200 bg-white backdrop-blur-xl transition-transform duration-200 ease-out dark:border-slate-800 dark:bg-slate-900',
          'lg:static lg:z-0 lg:w-72 lg:translate-x-0 lg:flex-shrink-0',
          navOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="border-b border-slate-200 px-5 pb-5 pt-[4.5rem] dark:border-slate-800 lg:pt-5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Barangay Bonbon System
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Admin Dashboard</div>
            </div>
            <span className="hidden lg:inline-block">
              <ThemeToggle />
            </span>
          </div>
        </div>
        <AdminNav isAdmin={isAdmin} onNavigate={() => setNavOpen(false)} />
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

      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 px-4 pb-6 pt-[4.5rem] text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:p-8 lg:pt-8">
        {children}
      </main>
    </div>
  )
}
