import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  if (password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_session', '1', { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 })
    return res
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
