import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as SupabaseClient)

export type CaptainStatus = {
  id: number
  status: string
  reason: string | null
  return_date: string | null
  updated_at: string
}

export type Announcement = {
  id: number
  title: string
  body: string
  archived: boolean
  created_at: string
}

export type Appointment = {
  id: number
  name: string
  email: string
  phone: string
  purpose: string
  appointment_date: string
  processed: boolean
  created_at: string
}
