import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import type { SessionSummary } from '../types/api'

function StatCard({
  label,
  value,
  sub,
  color = 'indigo',
}: {
  label: string
  value: string | number
  sub?: string
  color?: 'indigo' | 'green' | 'blue' | 'violet'
}) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 border-indigo-100',
    green: 'bg-green-50 border-green-100',
    blue: 'bg-blue-50 border-blue-100',
    violet: 'bg-violet-50 border-violet-100',
  }
  return (
    <div className={`rounded-xl border p-6 ${colorMap[color]}`}>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [leadCount, setLeadCount] = useState<number>(0)

  useEffect(() => {
    api
      .get<{ data: SessionSummary[] }>('/chat/sessions')
      .then((r) => setSessions(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))

    api
      .get<{ data: { count: number } }>('/leads/count')
      .then((r) => setLeadCount(r.data.data.count))
      .catch(() => setLeadCount(0))
  }, [])

  const totalMessages = sessions.reduce((sum, s) => sum + s.messageCount, 0)
  const today = new Date().toDateString()
  const activeTodaySessions = sessions.filter(
    (s) => new Date(s.lastActivityAt).toDateString() === today
  ).length

  const hasActivity = sessions.length > 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your Botix chatbot activity</p>
      </div>

      {/* Quick Start card — shown if no sessions yet */}
      {!loading && !hasActivity && (
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Quick Start</h3>
              <p className="text-indigo-100 text-sm mb-4">
                You're all set! Embed the Botix widget on your website to start capturing leads and conversations.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/api-keys"
                  className="bg-white text-indigo-700 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Get embed code
                </Link>
                <Link
                  to="/settings"
                  className="bg-white/20 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Customize bot
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Sessions" value={sessions.length} sub="All time" color="indigo" />
        <StatCard label="Total Messages" value={totalMessages} sub="Across all sessions" color="blue" />
        <StatCard label="Active Today" value={activeTodaySessions} sub="Sessions with activity" color="violet" />
        <StatCard label="Total Leads" value={leadCount} sub="Captured via widget" color="green" />
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
          <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
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
