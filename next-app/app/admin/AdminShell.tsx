'use client'

import { usePathname } from 'next/navigation'
import { AdminNav } from './AdminNav'

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
    return <div className="min-h-screen flex bg-gray-200">{children}</div>
  }

  return (
    <div className="min-h-screen flex bg-gray-200">
      <aside className="w-64 bg-slate-800 text-white flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-white/10 font-bold">Barangay Bonbon System</div>
        <AdminNav isAdmin={isAdmin} />
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
