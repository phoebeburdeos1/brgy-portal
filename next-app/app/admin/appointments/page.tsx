import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin-auth'
import { AppointmentsSection } from '../AppointmentsSection'

export const dynamic = 'force-dynamic'

export default async function AdminAppointmentsPage() {
  const admin = await isAdmin()
  if (!admin) {
    redirect('/admin/login?from=/admin/appointments')
  }

  const { data: appointments } = await supabaseAdmin
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false })

  return <AppointmentsSection appointments={appointments ?? []} />
}

