import { useState } from 'react'

interface Props {
  botName: string
  greeting: string
  primaryColor: string
  backgroundColor: string
}

export default function WidgetPreview({ botName, greeting, primaryColor, backgroundColor }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const initial = (botName || 'A')[0].toUpperCase()

  const isGradient = backgroundColor.startsWith('linear-gradient')
  const isDark = backgroundColor === '#1e293b'

  return (
    <div
      className="relative h-[500px] rounded-xl border border-slate-200 overflow-hidden select-none transition-all duration-300"
      style={isGradient ? { backgroundImage: backgroundColor } : { backgroundColor: backgroundColor || '#f1f5f9' }}
    >
      <p className={`absolute top-3 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wide uppercase z-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        Preview
      </p>

      {/* Chat window — transparent container, floating elements like the real widget */}
      {isOpen && (
        <div className="absolute bottom-20 right-4 w-72 flex flex-col gap-2">
          {/* Header pill */}
          <div
            className="flex items-center gap-2.5 px-3 py-3 rounded-2xl shadow-lg"
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

          {/* Messages — transparent, just floating bubbles */}
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto px-1">
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

          {/* Input floating pill */}
          <div className="flex items-center gap-2 bg-white rounded-full px-3.5 py-2 shadow-lg border border-white/60">
            <input
              className="flex-1 text-xs bg-transparent outline-none text-slate-500 placeholder-slate-400"
              placeholder="Type a message…"
              disabled
            />
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen((o) => !o)}
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
