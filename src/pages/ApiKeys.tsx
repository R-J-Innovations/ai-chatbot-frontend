import { useEffect, useState } from 'react'
import api from '../api/client'

interface TenantData {
  id: string
  name: string
  apiKey: string
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre className="bg-slate-900 text-slate-100 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2.5 py-1 rounded transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

export default function ApiKeys() {
  const [tenant, setTenant] = useState<TenantData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showKey, setShowKey] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [confirmRegen, setConfirmRegen] = useState(false)
  const [keyCopied, setKeyCopied] = useState(false)

  useEffect(() => {
    api
      .get<{ data: TenantData }>('/tenant/me')
      .then((r) => setTenant(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRegenerate = async () => {
    setRegenerating(true)
    try {
      const res = await api.post<{ data: string }>('/tenant/me/regenerate-api-key')
      setTenant((t) => (t ? { ...t, apiKey: res.data.data } : t))
      setConfirmRegen(false)
      setShowKey(true)
    } catch (err) {
      console.error(err)
    } finally {
      setRegenerating(false)
    }
  }

  const copyKey = () => {
    if (tenant) {
      navigator.clipboard.writeText(tenant.apiKey)
      setKeyCopied(true)
      setTimeout(() => setKeyCopied(false), 2000)
    }
  }

  const maskedKey = tenant
    ? tenant.apiKey.slice(0, 8) + '•'.repeat(tenant.apiKey.length - 12) + tenant.apiKey.slice(-4)
    : ''

  const embedCode = tenant
    ? `<!-- Add before </body> on every page -->
<script>
  window.AIChatbotConfig = {
    apiKey: "${tenant.apiKey}"
  };
</script>
<script async src="https://ai-chatbot-backend-production-d810.up.railway.app/chatbot.js"></script>`
    : ''

  const curlExample = tenant
    ? `curl -X POST https://ai-chatbot-backend-production-d810.up.railway.app/api/widget/chat \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${tenant.apiKey}" \\
  -d '{"message": "Hello!", "visitorId": "visitor-123"}'`
    : ''

  if (loading) return <div className="p-8 text-slate-400 text-sm">Loading…</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">API & Embed</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your API key and get the embed code</p>
      </div>

      {/* API Key card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">API Key</h2>
        <p className="text-sm text-slate-500 mb-4">
          Use this key to authenticate widget requests. Keep it secret — treat it like a password.
        </p>

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
          <code className="flex-1 text-sm font-mono text-slate-800 truncate">
            {showKey ? tenant?.apiKey : maskedKey}
          </code>
          <button
            onClick={() => setShowKey((s) => !s)}
            className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
            title={showKey ? 'Hide' : 'Show'}
          >
            {showKey ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={copyKey}
            className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 text-xs font-medium"
          >
            {keyCopied ? '✓' : 'Copy'}
          </button>
        </div>

        <div className="mt-4">
          {confirmRegen ? (
            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 flex-1">
                This will invalidate your current key. Any active widgets will stop working until updated.
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setConfirmRegen(false)}
                  className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="text-sm bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg"
                >
                  {regenerating ? 'Regenerating…' : 'Confirm'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmRegen(true)}
              className="text-sm text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate API key
            </button>
          )}
        </div>
      </div>

      {/* Embed code */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-2">Website Embed</h2>
        <p className="text-sm text-slate-500 mb-4">
          Add this snippet to every page where you want the chat widget to appear.
        </p>
        <CodeBlock code={embedCode} />
      </div>

      {/* API reference */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-2">Direct API</h2>
        <p className="text-sm text-slate-500 mb-4">
          You can also call the chat API directly from your own frontend or mobile app.
        </p>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Endpoint
            </p>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">
                POST
              </span>
              <code className="text-sm text-slate-800">/api/widget/chat</code>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Example
            </p>
            <CodeBlock code={curlExample} />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Response
            </p>
            <CodeBlock
              code={`{
  "success": true,
  "message": "Success",
  "data": {
    "reply": "Hello! How can I help you today?",
    "sessionId": "abc123",
    "visitorId": "visitor-123"
  }
}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
