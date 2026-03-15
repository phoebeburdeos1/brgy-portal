import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { title, body } = body
  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Title and body required' }, { status: 400 })
  }
  const { error } = await supabaseAdmin.from('announcements').insert({
    title: title.trim(),
    body: body.trim(),
    archived: false,
  })
  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
