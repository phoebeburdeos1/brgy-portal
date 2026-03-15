'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Announcement } from '@/lib/supabase'

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

  return (
    <div className="bg-white rounded-xl shadow mb-6" id="announcements">
      <div className="border-b border-gray-200 px-5 py-3 font-semibold text-gray-900">
        Recent Announcements / Post New
      </div>
      <div className="p-5">
        {message && (
          <div className="mb-4 p-2 rounded bg-blue-50 text-blue-800 text-sm">{message}</div>
        )}

        <h6 className="text-gray-500 mb-2">Past Announcements</h6>
        {active.length === 0 ? (
          <p className="text-gray-500 mb-4">No announcements yet.</p>
        ) : (
          <div className="space-y-2 mb-6">
            {active.map((ann) => (
              <div
                key={ann.id}
                className="flex flex-wrap justify-between items-start gap-2 p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-900">{ann.title}</div>
                  <div className="text-sm text-gray-500">Posted {new Date(ann.created_at).toLocaleString()}</div>
                  <details className="mt-2">
                    <summary className="text-sm text-gray-500 cursor-pointer">View message</summary>
                    <div className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{ann.body}</div>
                  </details>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => archive(ann.id)}
                    className="text-sm rounded border border-blue-600 text-blue-600 px-2 py-1 hover:bg-blue-50"
                  >
                    Archive
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="text-sm rounded border border-red-600 text-red-600 px-2 py-1 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h6 className="text-gray-500 mb-2">Archived</h6>
        {archived.length === 0 ? (
          <p className="text-gray-500 mb-4">No archived announcements.</p>
        ) : (
          <div className="space-y-2 mb-6">
            {archived.map((ann) => (
              <div
                key={ann.id}
                className="flex flex-wrap justify-between items-start gap-2 p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-900">{ann.title}</div>
                  <div className="text-sm text-gray-500">Posted {new Date(ann.created_at).toLocaleString()}</div>
                  <details className="mt-2">
                    <summary className="text-sm text-gray-500 cursor-pointer">View message</summary>
                    <div className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{ann.body}</div>
                  </details>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => unarchive(ann.id)}
                    className="text-sm rounded border border-gray-500 text-gray-600 px-2 py-1 hover:bg-gray-50"
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="text-sm rounded border border-red-600 text-red-600 px-2 py-1 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={postAnnouncement} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Free Anti-Rabies Vaccine Saturday!"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Announcement details..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting…' : 'Post Announcement'}
          </button>
        </form>
      </div>
    </div>
  )
}
