import { useEffect, useState } from 'react'
import api from '../api/client'
import type { AnalyticsSummary } from '../types/api'

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string
  label: string
  value: number | string
  color: string
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}

export default function Analytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<{ data: AnalyticsSummary }>('/analytics/summary')
      .then((r) => setSummary(r.data.data))
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
          Loading analytics...
        </div>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
          {error || 'No data available'}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Performance overview for your Botix chatbot</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="💬"
          label="Total Conversations"
          value={summary.totalConversations}
          color="text-blue-600"
        />
        <StatCard
          icon="🎯"
          label="Total Leads"
          value={summary.totalLeads}
          color="text-green-600"
        />
        <StatCard
          icon="📈"
          label="Conversations Today"
          value={summary.conversationsToday}
          color="text-indigo-600"
        />
        <StatCard
          icon="✨"
          label="Leads Today"
          value={summary.leadsToday}
          color="text-violet-600"
        />
      </div>

      {/* This Week section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">This Week (7 days)</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Conversations</span>
              <span className="text-lg font-bold text-blue-600">{summary.conversationsThisWeek}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: summary.totalConversations > 0
                    ? `${Math.min(100, (summary.conversationsThisWeek / summary.totalConversations) * 100)}%`
                    : '0%',
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Leads</span>
              <span className="text-lg font-bold text-green-600">{summary.leadsThisWeek}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: summary.totalLeads > 0
                    ? `${Math.min(100, (summary.leadsThisWeek / summary.totalLeads) * 100)}%`
                    : '0%',
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">This Month (30 days)</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Conversations</span>
              <span className="text-lg font-bold text-indigo-600">{summary.conversationsThisMonth}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{
                  width: summary.totalConversations > 0
                    ? `${Math.min(100, (summary.conversationsThisMonth / summary.totalConversations) * 100)}%`
                    : '0%',
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Leads</span>
              <span className="text-lg font-bold text-violet-600">{summary.leadsThisMonth}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-violet-500 h-2 rounded-full"
                style={{
                  width: summary.totalLeads > 0
                    ? `${Math.min(100, (summary.leadsThisMonth / summary.totalLeads) * 100)}%`
                    : '0%',
                }}
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-sm text-slate-600">Avg messages / conversation</span>
              <span className="text-sm font-semibold text-slate-700">{summary.avgMessagesPerConversation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Pages table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Top Pages by Conversations</h2>
        </div>
        {summary.topPages.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No page data yet. Conversations will appear here once visitors use the widget.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Page URL
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Conversations
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider w-48">
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {summary.topPages.map((page, i) => {
                  const maxConversations = summary.topPages[0]?.conversations ?? 1
                  const pct = Math.round((page.conversations / maxConversations) * 100)
                  let displayUrl = page.url
                  try {
                    displayUrl = new URL(page.url).pathname || page.url
                  } catch {
                    // keep original
                  }
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-700 truncate max-w-xs" title={page.url}>
                        {displayUrl}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">
                        {page.conversations}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
