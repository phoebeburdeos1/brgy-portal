import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin-auth'
import { ArchivedAppointmentsSection } from './ArchivedAppointmentsSection'

export const dynamic = 'force-dynamic'

export default async function SettingsArchivePage() {
  const admin = await isAdmin()
  if (!admin) {
    redirect('/admin/login?from=/admin/settings/archive')
  }

  const { data: appointments } = await supabaseAdmin
    .from('appointments')
    .select('*')
    .eq('hidden', false)
    .eq('archived', true)
    .eq('processed', true)
    .order('created_at', { ascending: false })

  return <ArchivedAppointmentsSection appointments={appointments ?? []} />
}
