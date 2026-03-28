import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin-auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CaptainForm } from './CaptainForm'
import { AnnouncementsSection } from './AnnouncementsSection'
import { NotificationsBell } from './NotificationsBell'
import Link from 'next/link'

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
    supabaseAdmin.from('appointments').select('*').eq('hidden', false).order('created_at', { ascending: false }),
    supabaseAdmin.from('announcements').select('*').eq('archived', false).order('created_at', { ascending: false }),
    supabaseAdmin.from('announcements').select('*').eq('archived', true).order('created_at', { ascending: false }),
  ])

  const apptRows = appointments ?? []
  const deduped = apptRows.reduce<typeof apptRows>((acc, row) => {
    const key = `${(row.name ?? '').toLowerCase()}|${row.phone}|${(row.purpose ?? '').toLowerCase()}|${row.appointment_date}|${row.processed}`
    if (acc.some((r) => `${(r.name ?? '').toLowerCase()}|${r.phone}|${(r.purpose ?? '').toLowerCase()}|${r.appointment_date}|${r.processed}` === key)) return acc
    acc.push(row)
    return acc
  }, [])

  const pendingAppointments = (deduped ?? []).filter((a) => !a.processed)
  const completedAppointments = (deduped ?? []).filter((a) => a.processed)
  const completedCount = completedAppointments.length
  const captainStatus = captain?.status ?? 'Unknown'
  const captainVariant = captainStatus === 'On-Duty' ? 'green' : captainStatus === 'Out of Office' ? 'red' : 'slate'
  const pendingCount = pendingAppointments.length

  const statCard = (
    label: string,
    value: number | string,
    subtext: string,
    linkText: string,
  ) => (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none flex flex-col justify-between">
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
        <div className="mt-2 flex items-baseline gap-2">
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{value}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{subtext}</span>
        <Link
          href="/admin/appointments"
          className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-all duration-200"
        >
          {linkText}
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="dashboard">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Dashboard Overview
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Command center for captain status, appointments, and announcements.
                </p>
              </div>
              <NotificationsBell pending={pendingAppointments} />
            </div>
          </CardHeader>
          <CardContent>
            <AnnouncementsSection
              active={activeAnnouncements ?? []}
              archived={archivedAnnouncements ?? []}
            />
          </CardContent>
        </Card>

        <div className="xl:sticky xl:top-6 space-y-6">
          <Card id="captain">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${
                      captainStatus === 'On-Duty'
                        ? 'bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.85)] ring-2 ring-emerald-400/40'
                        : captainStatus === 'Out of Office'
                        ? 'bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                        : 'bg-slate-500'
                    }`}
                  />
                  Quick Action
                </CardTitle>
              <Badge variant={captainVariant}>{captainStatus === 'Out of Office' ? 'Out of Town' : captainStatus}</Badge>
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Update the captain’s current availability.</div>
          </CardHeader>
          <CardContent>
            <CaptainForm />
          </CardContent>
          </Card>

          <div className="space-y-3">
            {statCard('Total Appointments', (deduped ?? []).length, 'All time', 'See details')}
            {statCard('Pending appointments', pendingCount, 'Requires attention', 'See details')}
            {statCard('Confirmed', completedCount, 'Successfully processed', 'See details')}
          </div>
        </div>
      </div>
    </>
  )
}
