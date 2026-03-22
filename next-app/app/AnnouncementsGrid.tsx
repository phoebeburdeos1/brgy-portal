import type { Announcement } from '@/lib/supabase'

function formatTimestamp(value: string) {
  if (!value) return ''
  const iso = new Date(value).toISOString()
  return iso.replace('T', ' ').slice(0, 16)
}

export function AnnouncementsGrid({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) {
    return <p className="text-gray-500 dark:text-slate-400">No announcements yet.</p>
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {announcements.map((ann) => (
        <div
          key={ann.id}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 hover:shadow-md transition-shadow"
        >
          <h5 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">{ann.title}</h5>
          <p className="text-gray-600 dark:text-slate-300 text-sm mb-2 whitespace-pre-line">{ann.body}</p>
          <small className="text-gray-400 dark:text-slate-500 text-xs">Posted {formatTimestamp(ann.created_at)}</small>
        </div>
      ))}
    </div>
  )
}
