import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { AnnouncementsSection } from '../AnnouncementsSection'

export const dynamic = 'force-dynamic'

export default async function AdminAnnouncementsPage() {
  const admin = await isAdmin()
  if (!admin) {
    redirect('/admin/login?from=/admin/announcements')
  }

  const [{ data: active }, { data: archived }] = await Promise.all([
    supabaseAdmin
      .from('announcements')
      .select('*')
      .eq('archived', false)
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('announcements')
      .select('*')
      .eq('archived', true)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-6">
      <AnnouncementsSection active={active ?? []} archived={archived ?? []} />
    </div>
  )
}

