'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  CalendarCheck,
  ExternalLink,
  LayoutDashboard,
  Megaphone,
  Shield,
  UserCog,
} from 'lucide-react'

export function AdminNav({
  isAdmin,
  onNavigate,
}: {
  isAdmin: boolean
  onNavigate?: () => void
}) {
  void isAdmin
  const path = usePathname()
  const [hash, setHash] = useState('')

  useEffect(() => {
    const update = () => setHash(window.location.hash || '')
    update()
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  const current = useMemo(() => {
    if (path !== '/admin') return path
    return hash ? `/admin${hash}` : '/admin'
  }, [hash, path])

  const nav = useMemo(
    () => [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin#captain', label: "Captain's Status", icon: Shield },
      { href: '/admin/appointments', label: 'Appointments', icon: CalendarCheck },
      { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      { href: '/admin/settings', label: 'Profile & Settings', icon: UserCog },
    ],
    [],
  )

  return (
    <nav className="p-3 flex flex-col gap-1">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = current === href
        return (
        <Link
          key={href}
          href={href}
          onClick={() => onNavigate?.()}
          className={[
            'relative flex items-center gap-3 rounded-r-lg px-3 py-2.5 text-sm transition-all duration-200',
            active
              ? 'bg-indigo-50 text-indigo-900 border-l-4 border-l-indigo-600 -ml-px pl-[11px] dark:bg-slate-800 dark:text-slate-100 dark:border-l-indigo-500'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200',
          ].join(' ')}
        >
          <Icon className="h-4 w-4" />
          <span className="truncate">{label}</span>
        </Link>
      )})}
      <Link
        href="/"
        onClick={() => onNavigate?.()}
        className="mt-3 flex items-center gap-3 rounded-r-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 transition-all duration-200"
      >
        <ExternalLink className="h-4 w-4" />
        Back to Public Site
      </Link>
    </nav>
  )
}
