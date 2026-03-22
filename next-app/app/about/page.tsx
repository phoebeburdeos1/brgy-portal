import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PublicNavbar } from '../components/PublicNavbar'
import { PublicFooter } from '../components/PublicFooter'

const OFFICIALS = [
  { name: 'Punong Barangay', position: 'Barangay Captain', initials: 'PB' },
  { name: 'Barangay Kagawad 1', position: 'Committee on Peace & Order', initials: 'K1' },
  { name: 'Barangay Kagawad 2', position: 'Committee on Health', initials: 'K2' },
  { name: 'Barangay Kagawad 3', position: 'Committee on Education', initials: 'K3' },
  { name: 'Barangay Kagawad 4', position: 'Committee on Finance', initials: 'K4' },
  { name: 'Barangay Kagawad 5', position: 'Committee on Infrastructure', initials: 'K5' },
  { name: 'Barangay Kagawad 6', position: 'Committee on Agriculture', initials: 'K6' },
  { name: 'Barangay Kagawad 7', position: 'Committee on Welfare', initials: 'K7' },
  { name: 'Barangay Secretary', position: 'Administrative Officer', initials: 'SK' },
  { name: 'Barangay Treasurer', position: 'Financial Officer', initials: 'TR' },
]

export default function AboutPage() {
  return (
    <>
      <PublicNavbar />

      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">About Barangay Bonbon</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-12">
            Learn more about our mission, vision, and the people who serve our community.
          </p>

          {/* Mission & Vision */}
          <section className="mb-16">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">Our Mission</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  To provide efficient, transparent, and accessible public services that improve the quality of life
                  for every resident of Barangay Bonbon. We are committed to fostering a united, safe, and
                  progressive community through responsive governance and genuine public service.
                </p>
              </div>
              <div className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">Our Vision</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  A barangay where every family thrives in a clean, peaceful, and sustainable environment.
                  We envision Barangay Bonbon as a model community—connected, resilient, and empowered—
                  where residents actively participate in local governance and enjoy equal access to opportunities.
                </p>
              </div>
            </div>
          </section>

          {/* Barangay Officials */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Barangay Officials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {OFFICIALS.map((official) => (
                <div
                  key={official.initials}
                  className="rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-200 dark:border-slate-700 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    {official.initials}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{official.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">{official.position}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </>
  )
}
