import { supabase, hasSupabaseConfig } from '@/lib/supabase'
import { CaptainBanner } from './CaptainBanner'
import { AnnouncementsGrid } from './AnnouncementsGrid'
import { BookingCard } from './BookingCard'
import { EnvSetupMessage } from './EnvSetupMessage'
import { PublicNavbar } from './components/PublicNavbar'
import { PublicFooter } from './components/PublicFooter'

export const revalidate = 30

export default async function HomePage() {
  if (!hasSupabaseConfig) {
    return (
      <>
        <PublicNavbar />
        <EnvSetupMessage />
        <PublicFooter />
      </>
    )
  }

  const { data: captain } = await supabase
    .from('captain_status')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('archived', false)
    .order('created_at', { ascending: false })
    .limit(5)

  const bookingDisabled = false
  const unavailableUntil =
    captain?.status === 'Out of Office' && captain.return_date ? captain.return_date : null

  return (
    <>
      <PublicNavbar />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <CaptainBanner captain={captain} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Official Announcements</h2>
            <AnnouncementsGrid announcements={announcements ?? []} />
          </div>
          <div className="lg:col-span-5">
            <BookingCard bookingDisabled={!!bookingDisabled} unavailableUntil={unavailableUntil} />
          </div>
        </div>
      </div>

      <PublicFooter />
    </>
  )
}
