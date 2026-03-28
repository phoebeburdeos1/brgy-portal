import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin-auth'
import { sendAppointmentApproval } from '@/lib/email'

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { id: rawId, processed, archived, hidden } = body as {
    id?: number | string
    processed?: boolean
    archived?: boolean
    hidden?: boolean
  }
  const id = typeof rawId === 'number' ? rawId : Number(rawId)
  if (rawId == null || !Number.isFinite(id)) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const updates: Record<string, boolean> = {}
  if (typeof processed === 'boolean') updates.processed = processed
  if (typeof archived === 'boolean') updates.archived = archived
  if (typeof hidden === 'boolean') updates.hidden = hidden

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Provide processed, archived, and/or hidden' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('appointments').update(updates).eq('id', id)
  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  if (updates.processed === true) {
    const { data: appt } = await supabaseAdmin
      .from('appointments')
      .select('name, email, appointment_date, purpose')
      .eq('id', id)
      .single()
    if (appt?.email) {
      await sendAppointmentApproval(
        appt.email,
        appt.name,
        appt.appointment_date,
        appt.purpose
      )
    }
  }

  return NextResponse.json({ ok: true })
}
