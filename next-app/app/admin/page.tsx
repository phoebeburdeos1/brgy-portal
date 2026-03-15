import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin-auth'
import { CaptainForm } from './CaptainForm'
import { AppointmentsSection } from './AppointmentsSection'
import { AnnouncementsSection } from './AnnouncementsSection'
import { LogoutButton } from './LogoutButton'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const admin = await isAdmin()
  if (!admin) {
    redirect('/admin/login?from=/admin')
  }

  const [
    { data: captain },
    { data: appointments },
    { data: activeAnnouncements },
    { data: archivedAnnouncements },
  ] = await Promise.all([
    supabaseAdmin.from('captain_status').select('*').order('id', { ascending: false }).limit(1).single(),
    supabaseAdmin.from('appointments').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('announcements').select('*').eq('archived', false).order('created_at', { ascending: false }),
    supabaseAdmin.from('announcements').select('*').eq('archived', true).order('created_at', { ascending: false }),
  ])

  const deduped = (appointments ?? []).reduce((acc: typeof appointments, row) => {
    const key = `${(row!.name ?? '').toLowerCase()}|${row!.phone}|${(row!.purpose ?? '').toLowerCase()}|${row!.appointment_date}|${row!.processed}`
    if (acc.some((r) => `${(r!.name ?? '').toLowerCase()}|${r!.phone}|${(r!.purpose ?? '').toLowerCase()}|${r!.appointment_date}|${r!.processed}` === key)) return acc
    acc.push(row)
    return acc
  }, [])

  return (
    <>
      <div className="bg-white rounded-xl shadow p-4 mb-6" id="dashboard">
        <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="bg-white rounded-xl shadow mb-6" id="captain">
        <div className="border-b border-gray-200 px-5 py-3 flex justify-between items-center">
          <span className="font-semibold text-gray-900">Captain&apos;s Current Status</span>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Legend:</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white">On Duty</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white">Out of Town</span>
          </div>
        </div>
        <div className="p-5">
          <CaptainForm />
        </div>
      </div>

      <AppointmentsSection appointments={deduped ?? []} />

      <AnnouncementsSection
        active={activeAnnouncements ?? []}
        archived={archivedAnnouncements ?? []}
      />

      <div className="bg-white rounded-xl shadow p-5 mt-6" id="profile">
        <h2 className="font-semibold text-gray-900 mb-2">Profile &amp; Settings</h2>
        <p className="text-sm text-gray-600">
          Admin account. Set <code className="bg-gray-100 px-1 rounded">ADMIN_PASSWORD</code> in environment for login.
        </p>
        <div className="mt-3">
          <LogoutButton />
        </div>
      </div>
    </>
  )
}
