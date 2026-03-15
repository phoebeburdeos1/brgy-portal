-- Barangay Connect – Supabase (PostgreSQL) schema
-- Run in Supabase: Dashboard → SQL Editor → New query → paste and run

-- Captain status (latest availability)
CREATE TABLE IF NOT EXISTS captain_status (
    id BIGSERIAL PRIMARY KEY,
    status TEXT NOT NULL CHECK (status IN ('On-Duty', 'Out of Office')),
    reason TEXT,
    return_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    purpose TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: public can read captain status and active announcements, insert appointments, read appointments.
-- Admin writes (update/delete) use the service_role key in Next.js API routes (bypasses RLS).
ALTER TABLE captain_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "captain_select" ON captain_status FOR SELECT USING (true);
CREATE POLICY "announcements_select" ON announcements FOR SELECT USING (archived = false);
CREATE POLICY "appointments_insert" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "appointments_select" ON appointments FOR SELECT USING (true);
