import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  const { archived } = body
  if (archived !== undefined && typeof archived === 'boolean') {
    const { error } = await supabaseAdmin
      .from('announcements')
      .update({ archived })
      .eq('id', id)
    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'archived required' }, { status: 400 })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const { error } = await supabaseAdmin.from('announcements').delete().eq('id', id)
  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
