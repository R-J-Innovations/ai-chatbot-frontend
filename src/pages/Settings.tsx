import { useEffect, useState, FormEvent } from 'react'
import api from '../api/client'
import WidgetPreview from '../components/WidgetPreview'

interface BotSettings {
  botName: string
  greeting: string
  systemPrompt: string
  primaryColor: string
  backgroundColor: string
  websiteUrl: string
}

interface KnowledgeBaseStatus {
  status: string
  pageCount: number
  scrapedAt: string
  errorMessage: string
}

const PRESET_COLORS = [
  '#4F46E5', '#7C3AED', '#DB2777', '#DC2626',
  '#D97706', '#16A34A', '#0284C7', '#0F172A',
]

const BG_OPTIONS = [
  { label: 'Transparent', value: 'transparent', preview: 'bg-white border border-dashed border-slate-300' },
  { label: 'Light', value: '#f1f5f9', preview: 'bg-slate-100' },
  { label: 'White', value: '#ffffff', preview: 'bg-white border border-slate-200' },
  { label: 'Dark', value: '#1e293b', preview: 'bg-slate-800' },
  { label: 'Gradient', value: 'linear-gradient(135deg, #e0e7ff, #f5f3ff, #fce7f3)', preview: 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100' },
]

export default function Settings() {
  const [form, setForm] = useState<BotSettings>({
    botName: '',
    greeting: '',
    systemPrompt: '',
    primaryColor: '#4F46E5',
    backgroundColor: 'transparent',
    websiteUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [kb, setKb] = useState<KnowledgeBaseStatus | null>(null)
  const [scraping, setScraping] = useState(false)

  useEffect(() => {
    api
      .get<{ data: { botSettings: BotSettings; websiteUrl?: string } }>('/tenant/me')
      .then((r) => {
        const d = r.data.data
        if (d.botSettings) setForm({ ...d.botSettings, websiteUrl: d.websiteUrl || '' })
      })
      .catch(console.error)
      .finally(() => setLoading(false))

    api
      .get<{ data: KnowledgeBaseStatus }>('/tenant/me/knowledge-base')
      .then((r) => setKb(r.data.data))
      .catch(console.error)
  }, [])

  // Poll status while scraping
  useEffect(() => {
    if (!scraping) return
    const interval = setInterval(() => {
      api
        .get<{ data: KnowledgeBaseStatus }>('/tenant/me/knowledge-base')
        .then((r) => {
          setKb(r.data.data)
          if (r.data.data.status !== 'scraping') setScraping(false)
        })
        .catch(() => setScraping(false))
    }, 2000)
    return () => clearInterval(interval)
  }, [scraping])

  const triggerScrape = async () => {
    setScraping(true)
    setKb((k) => k ? { ...k, status: 'scraping' } : { status: 'scraping', pageCount: 0, scrapedAt: '', errorMessage: '' })
    try {
      await api.post('/tenant/me/scrape')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Scrape failed'
      setKb((k) => k ? { ...k, status: 'error', errorMessage: msg } : null)
      setScraping(false)
    }
  }

  const set = (field: keyof BotSettings) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await api.put('/tenant/me/bot-settings', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      // Auto-scrape whenever settings are saved with a website URL
      if (form.websiteUrl?.trim()) {
        triggerScrape()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-slate-400 text-sm">Loading…</div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bot Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Customize how your chatbot looks and behaves</p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-lg space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-900 text-sm">Appearance</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bot name</label>
              <input
                type="text"
                value={form.botName}
                onChange={set('botName')}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Assistant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Primary color
              </label>
              <div className="flex items-center gap-3">
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, primaryColor: c }))}
                      className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                        form.primaryColor === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={set('primaryColor')}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  title="Custom color"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Chat background
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {BG_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, backgroundColor: opt.value }))}
                    title={opt.label}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${opt.preview} ${
                      form.backgroundColor === opt.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-semibold text-slate-900 text-sm">Behavior</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Greeting message
              </label>
              <input
                type="text"
                value={form.greeting}
                onChange={set('greeting')}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Hello! How can I help you today?"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                First message shown when the widget opens
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                System prompt
              </label>
              <textarea
                value={form.systemPrompt}
                onChange={set('systemPrompt')}
                rows={5}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="You are a helpful assistant for Acme Corp. Answer questions about our products and services."
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Instructions that guide how the AI responds
              </p>
            </div>
          </div>

          {/* Website scraper */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-slate-900 text-sm">Website Knowledge Base</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Scrape your website so the AI can answer questions about your content
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Website URL</label>
              <input
                type="url"
                value={form.websiteUrl}
                onChange={set('websiteUrl')}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs">
                {kb?.status === 'ready' && (
                  <span className="text-green-600 font-medium">
                    ✓ {kb.pageCount} pages indexed
                    {kb.scrapedAt && <span className="text-slate-400 font-normal"> · {new Date(kb.scrapedAt).toLocaleDateString()}</span>}
                  </span>
                )}
                {kb?.status === 'scraping' && (
                  <span className="text-indigo-500 font-medium animate-pulse">Indexing website…</span>
                )}
                {kb?.status === 'error' && (
                  <span className="text-red-500">{kb.errorMessage || 'Scrape failed'}</span>
                )}
                {(!kb || kb.status === 'pending') && (
                  <span className="text-slate-400">Will index automatically when you save</span>
                )}
              </div>

              {kb?.status === 'ready' && (
                <button
                  type="button"
                  onClick={triggerScrape}
                  disabled={scraping}
                  title="Re-index"
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-40 transition-colors"
                >
                  <svg className={`w-4 h-4 ${scraping ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              'Saving…'
            ) : saved ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : (
              'Save changes'
            )}
          </button>
        </form>

        {/* Live preview */}
        <div className="w-80 flex-shrink-0 sticky top-8">
          <p className="text-sm font-medium text-slate-700 mb-3">Live preview</p>
          <WidgetPreview
            botName={form.botName}
            greeting={form.greeting}
            primaryColor={form.primaryColor}
            backgroundColor={form.backgroundColor}
          />
        </div>
      </div>
    </div>
  )
}
