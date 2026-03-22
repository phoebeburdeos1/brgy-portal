'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function AdminLogoutLink() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>Admin log out</span>
    </button>
  )
}

