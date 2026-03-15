import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Barangay Bonbon System',
  description: 'Barangay Connect – BRGY Bonbon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
