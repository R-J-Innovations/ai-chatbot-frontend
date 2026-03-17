import { useState } from 'react'

interface Props {
  botName: string
  greeting: string
  primaryColor: string
}

export default function WidgetPreview({ botName, greeting, primaryColor }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const initial = (botName || 'A')[0].toUpperCase()

  return (
    <div className="relative h-[480px] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden select-none">
      <p className="absolute top-3 left-1/2 -translate-x-1/2 text-xs text-slate-400 font-medium tracking-wide uppercase">
        Preview
      </p>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-20 right-4 w-72 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight truncate">
                {botName || 'Assistant'}
              </p>
              <p className="text-white/70 text-xs">Online</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-3 min-h-[180px] max-h-[180px] overflow-y-auto bg-slate-50">
            <div className="flex gap-2 items-end">
              <div
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                {initial}
              </div>
              <div className="bg-white text-slate-700 text-xs px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm max-w-[85%] leading-relaxed">
                {greeting || 'Hello! How can I help you today?'}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2 bg-slate-50 rounded-full px-3 py-2 border border-slate-200">
              <input
                className="flex-1 text-xs bg-transparent outline-none text-slate-500 placeholder-slate-400"
                placeholder="Type a message..."
                disabled
              />
              <button
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
                style={{ backgroundColor: primaryColor }}
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
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
