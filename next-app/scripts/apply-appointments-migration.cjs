/**
 * Applies supabase/migrations/20260328120000_appointments_archive_hidden.sql
 * Requires DATABASE_URL or DIRECT_URL in .env.local (Supabase → Settings → Database → URI).
 */
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

async function main() {
  const url = process.env.DATABASE_URL || process.env.DIRECT_URL
  if (!url) {
    console.error('Missing DATABASE_URL or DIRECT_URL in .env.local')
    console.error(
      'Add the Postgres connection string from Supabase → Project Settings → Database → Connection string (URI).',
    )
    process.exit(1)
  }

  const migrationPath = path.join(
    __dirname,
    '../supabase/migrations/20260328120000_appointments_archive_hidden.sql',
  )
  const sql = fs.readFileSync(migrationPath, 'utf8')

  const client = new Client({
    connectionString: url,
    ssl: url.includes('localhost') ? false : { rejectUnauthorized: false },
  })
  await client.connect()
  try {
    await client.query(sql)
    console.log('Migration applied: appointments.archived and appointments.hidden are ready.')
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
