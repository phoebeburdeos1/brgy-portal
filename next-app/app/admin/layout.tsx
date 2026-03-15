import { isAdmin } from '@/lib/admin-auth'
import { AdminShell } from './AdminShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await isAdmin()
  return <AdminShell isAdmin={admin}>{children}</AdminShell>
}
