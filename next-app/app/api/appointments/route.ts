import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendAppointmentConfirmation } from '@/lib/email'

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
      .select('status')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    if (captain?.status === 'On-Duty') {
      return NextResponse.json(
        { error: 'Online appointment requests are disabled while the captain is On-Duty. Please visit the barangay office.' },
        { status: 400 }
      )
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

    await sendAppointmentConfirmation(email.trim(), name.trim(), appointment_date, purpose.trim())

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
