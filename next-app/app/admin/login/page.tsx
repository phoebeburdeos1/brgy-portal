'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      const next = searchParams.get('from') || '/admin'
      router.push(next)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      {/* Left brand / gradient panel */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_55%)]" />
        <div className="relative px-10">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xl font-extrabold">
            B
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Barangay Bonbon Portal
          </h1>
          <p className="mt-2 text-sm text-indigo-100 max-w-sm">
            Secure administrative access for managing captain status, appointments, and official
            announcements.
          </p>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:px-8 bg-slate-50 text-slate-900">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center md:text-left">
            <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
              Administrative access only
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              Barangay Bonbon Portal
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-md overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" />
            <div className="px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Admin password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500"
                      placeholder="Enter admin password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-r-lg"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-rose-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:scale-[1.02] hover:shadow-md hover:shadow-indigo-500/30 active:scale-[0.99] transition-transform transition-shadow disabled:opacity-50"
                >
                  {loading ? 'Logging in…' : 'Log in'}
                </button>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <p className="mt-4 text-[11px] text-slate-400 text-center">
                  Official admin contact:{' '}
                  <span className="font-medium text-slate-500">brgybonbon@gmail.com</span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
