# Barangay Bonbon – Next.js + Supabase

This is the Next.js + Supabase version of the barangay portal (resident booking, captain status, announcements, admin dashboard).

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the schema: copy contents of `supabase/schema.sql` and execute.
3. In **Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret; server-only).

### 2. Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD` (password for `/admin` login)

### 3. Install and run

```bash
npm install
npm run dev
```

- **Public site:** [http://localhost:3000](http://localhost:3000)
- **Admin:** [http://localhost:3000/admin](http://localhost:3000/admin) (log in with `ADMIN_PASSWORD`)

## Features

- **Public:** Captain status banner, official announcements grid, book appointment (disabled when captain is On-Duty).
- **Admin:** Captain status toggle, pending/completed appointments (approve), post / archive / delete announcements.

## Email

The PHP version sent confirmation emails via Gmail. In this stack you can add email later with:

- [Resend](https://resend.com), [SendGrid](https://sendgrid.com), or Supabase Edge Functions.
- Call your email API from `app/api/appointments/route.ts` (after insert) and from the approve action in admin (e.g. in `app/api/admin/appointments/route.ts`).

No email is sent by default so the app works without extra config.
