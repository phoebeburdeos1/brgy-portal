import type { Announcement } from '@/lib/supabase'

export function AnnouncementsGrid({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) {
    return <p className="text-gray-500">No announcements yet.</p>
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {announcements.map((ann) => (
        <div
          key={ann.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <h5 className="font-semibold text-gray-900 mb-2">{ann.title}</h5>
          <p className="text-gray-600 text-sm mb-2 whitespace-pre-line">{ann.body}</p>
          <small className="text-gray-400 text-xs">Posted {new Date(ann.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  )
}
