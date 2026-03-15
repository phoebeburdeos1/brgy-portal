'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const path = usePathname()
  const nav = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin#announcements', label: 'Past Announcements' },
    { href: '/admin#appointments', label: 'Appointment Manager' },
    { href: '/admin#captain', label: "Captain's Status" },
    { href: '/admin#profile', label: 'Profile & Settings' },
  ]
  return (
    <nav className="p-2 flex flex-col gap-1">
      {nav.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-2 rounded-lg text-sm ${
            path === href || (href !== '/admin' && path.startsWith(href))
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-white/10'
          }`}
        >
          {label}
        </Link>
      ))}
      <Link
        href="/"
        className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 mt-2"
      >
        Back to Public Site
      </Link>
    </nav>
  )
}
