'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Announcement } from '@/lib/supabase'
import { Archive, RotateCcw, Send, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconButton } from '@/components/ui/icon-button'

export function AnnouncementsSection({
  active,
  archived,
}: {
  active: Announcement[]
  archived: Announcement[]
}) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [openIds, setOpenIds] = useState<Record<number, boolean>>({})

  async function postAnnouncement(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) {
      setMessage('Title and body are required.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Failed to post')
        return
      }
      setMessage('Announcement posted.')
      setTitle('')
      setBody('')
      router.refresh()
    } catch {
      setMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function archive(id: number) {
    await fetch(`/api/admin/announcements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived: true }),
    })
    router.refresh()
  }

  async function unarchive(id: number) {
    await fetch(`/api/admin/announcements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived: false }),
    })
    router.refresh()
  }

  async function deleteAnnouncement(id: number) {
    if (!confirm('Delete this announcement?')) return
    await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  function getRelativeTime(value: string) {
    if (!value) return ''
    const target = new Date(value)
    const now = new Date()
    const diffMs = now.getTime() - target.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)

    if (diffSec < 60) return 'Just now'
    if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? '' : 's'} ago`
    if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`
    if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`
    const diffWeek = Math.floor(diffDay / 7)
    return `${diffWeek} week${diffWeek === 1 ? '' : 's'} ago`
  }

  const activeWithTime = useMemo(
    () => active.map((a) => ({ ...a, _relative: getRelativeTime(a.created_at) })),
    [active],
  )

  const archivedWithTime = useMemo(
    () => archived.map((a) => ({ ...a, _relative: getRelativeTime(a.created_at) })),
    [archived],
  )

  function toggleOpen(id: number) {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Card id="announcements">
      <CardHeader className="flex items-center justify-between gap-3">
        <div>
          <CardTitle>Announcements</CardTitle>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            Post updates and manage archived items.
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {message && (
          <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            {message}
          </div>
        )}

        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Active</h3>
        {activeWithTime.length === 0 ? (
          <p className="text-sm text-slate-500 mb-6">No announcements yet.</p>
        ) : (
          <div className="space-y-3 mb-8">
            {activeWithTime.map((ann) => (
              <div
                key={ann.id}
                className="flex flex-wrap justify-between items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{ann.title}</div>
                    <span className="text-[11px] text-slate-500">
                      {ann._relative}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleOpen(ann.id)}
                    className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {openIds[ann.id] ? 'Hide message' : 'View message'}
                  </button>
                  <div
                    className={`mt-2 overflow-hidden text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap transition-all duration-200 ${
                      openIds[ann.id] ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {ann.body}
                  </div>
                </div>
                <div className="flex gap-2">
                  <IconButton
                    label="Archive announcement"
                    variant="ghost"
                    onClick={() => archive(ann.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label="Delete announcement"
                    variant="danger"
                    onClick={() => deleteAnnouncement(ann.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Archived</h3>
        {archivedWithTime.length === 0 ? (
          <p className="text-sm text-slate-500 mb-6">No archived announcements.</p>
        ) : (
          <div className="space-y-3 mb-8">
            {archivedWithTime.map((ann) => (
              <div
                key={ann.id}
                className="flex flex-wrap justify-between items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{ann.title}</div>
                    <span className="text-[11px] text-slate-500">
                      {ann._relative}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleOpen(ann.id)}
                    className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {openIds[ann.id] ? 'Hide message' : 'View message'}
                  </button>
                  <div
                    className={`mt-2 overflow-hidden text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap transition-all duration-200 ${
                      openIds[ann.id] ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {ann.body}
                  </div>
                </div>
                <div className="flex gap-2">
                  <IconButton
                    label="Restore announcement"
                    variant="ghost"
                    onClick={() => unarchive(ann.id)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label="Delete announcement"
                    variant="danger"
                    onClick={() => deleteAnnouncement(ann.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Post new</h3>
        </div>

        <form onSubmit={postAnnouncement} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Free Anti-Rabies Vaccine Saturday!"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Announcement details..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {loading ? 'Posting…' : 'Post announcement'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
