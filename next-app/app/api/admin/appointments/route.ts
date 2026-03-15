import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin-auth'
import { sendAppointmentApproval } from '@/lib/email'

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { id, processed } = body
  if (!id || typeof processed !== 'boolean') {
    return NextResponse.json({ error: 'id and processed required' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('appointments')
    .update({ processed })
    .eq('id', id)
  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  if (processed) {
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
