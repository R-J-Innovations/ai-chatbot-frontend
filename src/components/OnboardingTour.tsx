import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TOUR_COMPLETE_KEY = 'botix_tour_complete'

const TOTAL_STEPS = 4

export default function OnboardingTour() {
  const navigate = useNavigate()
  const [isDone, setIsDone] = useState(
    () => localStorage.getItem(TOUR_COMPLETE_KEY) === 'true'
  )
  const [step, setStep] = useState(0)

  if (isDone) return null

  const finish = () => {
    localStorage.setItem(TOUR_COMPLETE_KEY, 'true')
    setIsDone(true)
  }

  const goToEmbed = () => {
    navigate('/api-keys')
    finish()
  }

  const isLast = step === TOTAL_STEPS - 1

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">

        {/* Step content */}
        {step === 0 && <StepWelcome />}
        {step === 1 && <StepWhatsApp />}
        {step === 2 && <StepAnalytics />}
        {step === 3 && <StepEmbed />}

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === step ? 'bg-indigo-600' : 'bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={finish}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                Back
              </button>
            )}
            {isLast ? (
              <button
                onClick={goToEmbed}
                className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-5 py-2 rounded-lg transition-all shadow-sm"
              >
                Go to API &amp; Embed
              </button>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-5 py-2 rounded-lg transition-all shadow-sm"
              >
                Next &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Individual step components ---------- */

function StepWelcome() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-4xl leading-none">🤖</span>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-3">Welcome to Botix 👋</h2>
      <p className="text-slate-500 text-sm leading-relaxed">
        Let&rsquo;s take a 60-second tour so you know exactly where everything is. Your AI chatbot
        is ready &mdash; let&rsquo;s get it working for you.
      </p>
    </div>
  )
}

function StepWhatsApp() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-[#25D366]/10 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-1.5 bg-[#25D366]/10 text-[#25D366] text-xs font-semibold px-3 py-1 rounded-full border border-[#25D366]/20">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
          Pro Feature
        </span>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-3">Get WhatsApp Alerts</h2>
      <p className="text-slate-500 text-sm leading-relaxed">
        Every time a lead chats with your bot, you can get an instant WhatsApp notification. Head
        to <span className="font-semibold text-slate-700">Settings &rarr; WhatsApp</span> to
        connect. This feature requires the{' '}
        <span className="font-semibold text-slate-700">Pro plan</span> &mdash; upgrade anytime from
        the Billing page.
      </p>
      <p className="mt-3 text-xs text-slate-400 font-medium">Settings &rarr; WhatsApp tab</p>
    </div>
  )
}

function StepAnalytics() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-indigo-50 rounded-2xl flex items-center justify-center">
        <svg
          className="w-10 h-10 text-indigo-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-3">Track Every Conversation</h2>
      <p className="text-slate-500 text-sm leading-relaxed">
        The <span className="font-semibold text-slate-700">Analytics</span> page shows you total
        conversations, leads captured, active sessions today, and which pages on your site are
        driving the most chats. No setup needed &mdash; it tracks automatically.
      </p>
      <p className="mt-3 text-xs text-slate-400 font-medium">
        Find it in the sidebar &rarr; Analytics
      </p>
    </div>
  )
}

function StepEmbed() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-violet-50 rounded-2xl flex items-center justify-center">
        <svg
          className="w-10 h-10 text-violet-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-3">Add Botix to Your Website</h2>
      <p className="text-slate-500 text-sm leading-relaxed mb-4">
        Copy your unique embed snippet from{' '}
        <span className="font-semibold text-slate-700">API &amp; Embed</span> in the sidebar and
        paste it before the closing{' '}
        <code className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
          &lt;/body&gt;
        </code>{' '}
        tag on every page. That&rsquo;s it &mdash; your bot goes live instantly.
      </p>
      <div className="bg-slate-900 rounded-lg px-4 py-3 text-left">
        <code className="text-xs text-green-400 font-mono">
          &lt;script src=&quot;...chatbot.js&quot;&gt;&lt;/script&gt;
        </code>
      </div>
    </div>
  )
}
