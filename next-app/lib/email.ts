import nodemailer from 'nodemailer'

const smtpHost = process.env.SMTP_HOST
const smtpPort = Number(process.env.SMTP_PORT ?? 587)
const smtpUser = process.env.SMTP_USER
const smtpPassword = process.env.SMTP_PASSWORD
const from = process.env.EMAIL_FROM ?? 'Barangay Bonbon <no-reply@barangaybonbon.local>'

const transporter =
  smtpHost && smtpPort && smtpUser && smtpPassword
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      })
    : null

export async function sendAppointmentConfirmation(
  email: string,
  name: string,
  date: string,
  purpose: string
) {
  if (!transporter) return
  await transporter.sendMail({
    from,
    to: [email],
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
  if (!transporter) return
  await transporter.sendMail({
    from,
    to: [email],
    subject: 'Barangay Appointment Approved',
    text: `Hi ${name},\n\nYour booking on ${date} (${purpose}) has been successfully approved.\nPlease be at the barangay office on that day.\n\nThank you,\nBarangay Bonbon`,
  })
}
