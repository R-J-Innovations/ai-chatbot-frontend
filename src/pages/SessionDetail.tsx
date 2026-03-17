import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatSession {
  id: string
  visitorId: string
  messages: ChatMessage[]
  startedAt: string
  lastActivityAt: string
}

export default function SessionDetail() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [session, setSession] = useState<ChatSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<{ data: ChatSession }>(`/chat/sessions/${sessionId}`)
      .then((r) => setSession(r.data.data))
      .catch(() => setError('Session not found'))
      .finally(() => setLoading(false))
  }, [sessionId])

  return (
    <div className="p-8 max-w-3xl">
      <Link
        to="/sessions"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to sessions
      </Link>

      {loading && <div className="text-slate-400 text-sm">Loading…</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {session && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Session</h1>
            <p className="text-slate-500 text-sm mt-1 font-mono">{session.visitorId}</p>
            <div className="flex gap-4 mt-2 text-xs text-slate-400">
              <span>Started: {new Date(session.startedAt).toLocaleString()}</span>
              <span>Last activity: {new Date(session.lastActivityAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            {session.messages.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">No messages</p>
            )}
            {session.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.role === 'assistant'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {msg.role === 'assistant' ? 'AI' : 'U'}
                </div>

                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
