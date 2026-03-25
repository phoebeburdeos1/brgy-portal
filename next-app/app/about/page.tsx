import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PublicNavbar } from '../components/PublicNavbar'
import { PublicFooter } from '../components/PublicFooter'
import { OfficialsGrid } from './OfficialsGrid'

const OFFICIALS = [
  { name: 'Pebi Burdeos', position: 'Barangay Captain', initials: 'PB', photoSrc: '/officials/PB.jpg' },
  { name: 'Julianne Burdeos', position: 'Committee on Peace & Order', initials: 'K1', photoSrc: '/officials/K1.jpg' },
  { name: 'Sheryn Cubao', position: 'Committee on Health', initials: 'K2', photoSrc: '/officials/K2.jpg' },
  { name: 'Jenzel Masarap', position: 'Committee on Education', initials: 'K3', photoSrc: '/officials/K3.jpg' },
  { name: 'Sabrina Carpenter', position: 'Committee on Finance', initials: 'K4', photoSrc: '/officials/K4.jpg' },
  { name: 'Marmar Lami', position: 'Committee on Infrastructure', initials: 'K5', photoSrc: '/officials/K5.jpg' },
  { name: 'Krista Yobmot', position: 'Committee on Agriculture', initials: 'K6', photoSrc: '/officials/K6.jpg' },
  { name: 'January Febr', position: 'Committee on Welfare', initials: 'K7', photoSrc: '/officials/K7.jpg' },
  { name: 'Shainna Maldita', position: 'Administrative Officer', initials: 'SK', photoSrc: '/officials/SK.jpg' },
  { name: 'An Lumingon Kanaman', position: 'Financial Officer', initials: 'TR', photoSrc: '/officials/TR.jpg' },
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
            <OfficialsGrid officials={OFFICIALS} />
          </section>
        </div>
      </main>

      <PublicFooter />
    </>
  )
}
