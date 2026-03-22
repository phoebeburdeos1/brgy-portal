'use client'

import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function PublicNavbar() {
  function handleContactScroll(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center font-extrabold">B</span>
          Barangay Bonbon System
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle variant="light" />
          <Link
            href="/about"
            className="text-sm text-white/90 hover:text-white transition-colors"
          >
            About
          </Link>
          <a
            href="#contact"
            onClick={handleContactScroll}
            className="text-sm text-white/90 hover:text-white transition-colors"
          >
            Contact Us
          </a>
          <Link
            href="/admin/login"
            className="text-sm text-white/90 hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  )
}
