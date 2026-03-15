import Link from 'next/link'
import { supabase, hasSupabaseConfig } from '@/lib/supabase'
import { CaptainBanner } from './CaptainBanner'
import { AnnouncementsGrid } from './AnnouncementsGrid'
import { BookingCard } from './BookingCard'
import { EnvSetupMessage } from './EnvSetupMessage'

export const revalidate = 30

export default async function HomePage() {
  if (!hasSupabaseConfig) {
    return (
      <>
        <nav className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-3">
            <Link href="/" className="font-bold text-lg flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-extrabold">B</span>
              Barangay Bonbon System
            </Link>
          </div>
        </nav>
        <EnvSetupMessage />
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

  const bookingDisabled = captain?.status === 'On-Duty'

  return (
    <>
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-extrabold">B</span>
            Barangay Bonbon System
          </Link>
          <Link href="/admin" className="text-sm text-white/90 hover:text-white">Admin</Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <CaptainBanner captain={captain} />
            <h2 className="text-lg font-bold text-gray-900">Official Announcements</h2>
            <AnnouncementsGrid announcements={announcements ?? []} />
          </div>
          <div className="lg:col-span-5">
            <BookingCard bookingDisabled={!!bookingDisabled} />
          </div>
        </div>
      </div>

      <footer className="bg-blue-600 text-white text-center py-4 mt-8">
        <div className="container mx-auto">&copy; {new Date().getFullYear()} Barangay Connect</div>
      </footer>
    </>
  )
}
