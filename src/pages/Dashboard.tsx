import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

interface SessionSummary {
  id: string
  visitorId: string
  messageCount: number
  startedAt: string
  lastActivityAt: string
  pageUrl?: string
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<{ data: SessionSummary[] }>('/chat/sessions')
      .then((r) => setSessions(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalMessages = sessions.reduce((sum, s) => sum + s.messageCount, 0)
  const today = new Date().toDateString()
  const activeTodaySessions = sessions.filter(
    (s) => new Date(s.lastActivityAt).toDateString() === today
  ).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your chatbot activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Sessions" value={sessions.length} sub="All time" />
        <StatCard label="Total Messages" value={totalMessages} sub="Across all sessions" />
        <StatCard label="Active Today" value={activeTodaySessions} sub="Sessions with activity" />
      </div>

      {/* Recent sessions */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Sessions</h2>
          <Link to="/sessions" className="text-sm text-indigo-600 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No sessions yet. Embed the widget on your site to get started.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.slice(0, 5).map((s) => (
              <Link
                key={s.id}
                to={`/sessions/${s.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 font-mono truncate">{s.visitorId}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {s.pageUrl
                      ? (() => { try { return new URL(s.pageUrl).pathname || '/' } catch { return s.pageUrl } })()
                      : new Date(s.startedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {s.messageCount} messages
                  </span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
