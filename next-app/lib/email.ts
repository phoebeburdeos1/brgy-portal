import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.EMAIL_FROM ?? 'Barangay Bonbon <onboarding@resend.dev>'

export async function sendAppointmentConfirmation(
  email: string,
  name: string,
  date: string,
  purpose: string
) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from,
    to: email,
    subject: 'Barangay Appointment Confirmation',
    text: `Hi ${name},\n\nYour appointment request has been received.\nDate: ${date}\nPurpose: ${purpose}\n\nThank you,\nBarangay Bonbon`,
  })
}

export async function sendAppointmentApproval(
  email: string,
  name: string,
  date: string,
  purpose: string
) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from,
    to: email,
    subject: 'Barangay Appointment Approved',
    text: `Hi ${name},\n\nYour booking on ${date} (${purpose}) has been successfully approved.\nPlease be at the barangay office on that day.\n\nThank you,\nBarangay Bonbon`,
  })
}
