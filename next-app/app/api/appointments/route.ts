import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendAppointmentConfirmation } from '@/lib/email'

function isoDateStr(value: string | Date) {
  const d = value instanceof Date ? value : new Date(value)
  return d.toISOString().slice(0, 10)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, purpose, appointment_date } = body

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !purpose?.trim() || !appointment_date) {
      return NextResponse.json(
        { error: 'Name, email, phone, purpose, and date are required.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    }

    const { data: captain } = await supabase
      .from('captain_status')
      .select('status, return_date')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    if (captain?.status === 'Out of Office' && captain.return_date) {
      const todayStr = isoDateStr(new Date())
      const untilStr = isoDateStr(captain.return_date)
      const requestedStr = String(appointment_date)

      if (requestedStr >= todayStr && requestedStr <= untilStr) {
        return NextResponse.json(
          { error: 'Selected date is unavailable while the captain is out of office. Please choose a later date.' },
          { status: 400 },
        )
      }
    }

    const { error } = await supabase.from('appointments').insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      purpose: purpose.trim(),
      appointment_date,
      processed: false,
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Failed to save appointment.' }, { status: 500 })
    }

    try {
      await sendAppointmentConfirmation(email.trim(), name.trim(), appointment_date, purpose.trim())
    } catch (emailError) {
      console.error('Email send failed (non-fatal):', emailError)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
