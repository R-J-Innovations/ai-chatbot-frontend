import { useEffect, useState } from 'react'
import api from '../api/client'
import type { Lead } from '../types/api'

function exportToCsv(leads: Lead[]) {
  const headers = ['Name', 'Email', 'Phone', 'Page', 'Captured At']
  const rows = leads.map((l) => [
    `"${l.name}"`,
    `"${l.email}"`,
    `"${l.phone ?? ''}"`,
    `"${l.pageUrl ?? ''}"`,
    `"${new Date(l.capturedAt).toLocaleString()}"`,
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `botix-leads-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<{ data: Lead[] }>('/leads')
      .then((r) => setLeads(r.data.data))
      .catch(() => setError('Failed to load leads'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
            {!loading && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {leads.length} total
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-1">Visitors who filled out the lead capture form</p>
        </div>
        {leads.length > 0 && (
          <button
            onClick={() => exportToCsv(leads)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading leads...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 text-sm">{error}</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-slate-900 font-semibold mb-1">No leads yet</h3>
            <p className="text-slate-400 text-sm">
              Leads will appear here once visitors fill out the chat widget form.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Page</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Captured At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map((lead) => {
                  let displayPage = lead.pageUrl ?? ''
                  try {
                    if (lead.pageUrl) displayPage = new URL(lead.pageUrl).pathname || lead.pageUrl
                  } catch {
                    // keep original
                  }
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{lead.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`} className="hover:underline">
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={lead.pageUrl}>
                        {displayPage || <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(lead.capturedAt).toLocaleString()}
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
