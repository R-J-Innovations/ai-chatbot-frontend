import { useState } from 'react'

interface Props {
  botName: string
  greeting: string
  primaryColor: string
  backgroundColor: string
  hideBranding?: boolean
}

export default function WidgetPreview({ botName, greeting, primaryColor, backgroundColor, hideBranding = false }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [showLead, setShowLead] = useState(true)
  const initial = (botName || 'A')[0].toUpperCase()

  const bg = backgroundColor || '#f1f5f9'
  const isGradient = bg.startsWith('linear-gradient')
  const isDark = bg === '#1e293b'

  return (
    <div
      className="relative h-[540px] rounded-xl border border-slate-200 overflow-hidden select-none transition-all duration-300"
      style={isGradient ? { backgroundImage: bg } : { backgroundColor: bg }}
    >
      <p className={`absolute top-3 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wide uppercase z-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        Preview
      </p>

      {isOpen && (
        <div className="absolute top-10 bottom-20 right-4 w-72 flex flex-col rounded-3xl overflow-hidden shadow-2xl"
          style={isGradient ? { backgroundImage: bg } : bg === 'transparent' ? { background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' } : { backgroundColor: bg }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2.5 px-3 py-3 flex-shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight truncate">
                {botName || 'Assistant'}
              </p>
              <p className="text-white/80 text-xs flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                Online
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs cursor-pointer">
              ×
            </div>
          </div>

          {/* Lead form */}
          {showLead ? (
            <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col">
              <p className="text-slate-800 font-bold text-sm mb-0.5">Hi! Before we start... 👋</p>
              <p className="text-slate-500 text-xs mb-3">Tell us a little about yourself so we can help you better.</p>
              <label className="text-xs font-semibold text-slate-600 mb-1">
                Name <span className="text-red-400">*</span>
              </label>
              <div className="w-full mb-2.5 px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-400 bg-slate-50">
                Your name
              </div>
              <label className="text-xs font-semibold text-slate-600 mb-1">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="w-full mb-2.5 px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-400 bg-slate-50">
                you@example.com
              </div>
              <label className="text-xs font-semibold text-slate-600 mb-1">
                Phone <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="w-full mb-3 px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-400 bg-slate-50">
                +1 555 000 0000
              </div>
              <button
                onClick={() => setShowLead(false)}
                className="w-full py-2.5 rounded-xl text-white text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Start Chatting →
              </button>
              <p className="text-center text-slate-400 text-[10px] mt-2.5">🔒 We respect your privacy</p>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex flex-col gap-2 flex-1 overflow-y-auto px-2.5 py-3">
                <div className="flex items-end gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {initial}
                  </div>
                  <div className="bg-white text-slate-700 text-xs px-3 py-2 rounded-[18px] rounded-bl-[4px] shadow-md max-w-[80%] leading-relaxed">
                    {greeting || 'Hello! How can I help you today?'}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 bg-white px-3 py-2.5 shadow-[0_-1px_0_rgba(0,0,0,0.06)] flex-shrink-0">
                <span className="flex-1 text-xs text-slate-400">Type a message...</span>
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Branding bar */}
          {!hideBranding && (
            <div className="text-center text-[10px] text-slate-400 py-1.5 bg-white border-t border-slate-100 flex-shrink-0">
              Powered by{' '}
              <span className="text-indigo-500 font-medium">Botix</span>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => { setIsOpen((o) => !o); setShowLead(true) }}
        className="absolute bottom-6 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </button>
    </div>
  )
}
