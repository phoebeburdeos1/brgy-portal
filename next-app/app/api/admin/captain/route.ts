import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { status, reason, return_date } = body
  if (!status || !['On-Duty', 'Out of Office'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  const { error } = await supabaseAdmin.from('captain_status').insert({
    status,
    reason: reason?.trim() || null,
    return_date: return_date || null,
  })
  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
