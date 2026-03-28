import { Phone, Facebook, Instagram, Mail } from 'lucide-react'

const FACEBOOK_URL = 'https://www.facebook.com/SKBrgyBonbon'
const INSTAGRAM_URL = 'https://www.instagram.com/burdx.feb/'
const TELEPHONE = '0910 483 2273'
const EMAIL = 'phoebeaclaoburdeos@gmail.com'

export function PublicFooter() {
  return (
    <footer id="contact" className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Logo & info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white shadow-md">
                B
              </span>
              <h3 className="font-bold text-lg">Barangay Bonbon</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Serving our community with dedication and integrity. Barangay Bonbon is committed to providing
              accessible services, fostering unity, and improving the quality of life for all residents.
            </p>
          </div>

          {/* Column 2: Socials */}
          <div>
            <h3 className="font-bold text-lg mb-3">Connect With Us</h3>
            <div className="flex gap-4">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5] hover:scale-110 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] text-white hover:opacity-90 hover:scale-110 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-bold text-lg mb-3">Contact</h3>
            <div className="space-y-3">
              <a
                href={`tel:${TELEPHONE.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-700">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="font-medium">{TELEPHONE}</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-700">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="font-medium text-sm break-all">{EMAIL}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-700 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Barangay Bonbon. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
