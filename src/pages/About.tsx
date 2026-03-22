import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Botix</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/25"
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-20 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          AI chatbots for South African businesses
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-5">
          Turn website visitors into{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            qualified leads
          </span>
          , automatically
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed mb-8">
          Botix puts an AI-powered chatbot on your website in minutes. It captures leads, answers
          questions 24/7, and sends you instant WhatsApp alerts — no coding required.
        </p>
        <Link
          to="/register"
          className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-xl shadow-indigo-500/30"
        >
          Create your free account →
        </Link>
        <p className="text-slate-500 text-sm mt-3">Free plan available · No credit card needed</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20 grid sm:grid-cols-3 gap-6">
        {[
          {
            icon: '💬',
            title: 'Chat on autopilot',
            body: 'Your bot answers common questions, qualifies visitors, and captures their details — even while you sleep.',
          },
          {
            icon: '📊',
            title: 'Analytics built in',
            body: 'See exactly how many conversations happened, how many leads were captured, and which pages are driving the most engagement.',
          },
          {
            icon: '📲',
            title: 'WhatsApp alerts',
            body: 'Get an instant WhatsApp notification every time a lead chats with your bot — available on the Pro plan.',
          },
        ].map(({ icon, title, body }) => (
          <div
            key={title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Up and running in 3 steps</h2>
        <div className="space-y-6">
          {[
            {
              step: '1',
              title: 'Create your free account',
              body: 'Sign up with your email — no credit card needed. Your bot is provisioned instantly.',
            },
            {
              step: '2',
              title: 'Paste one line of code',
              body: 'Copy your unique embed snippet from the dashboard and paste it before the closing </body> tag on your website. Done.',
            },
            {
              step: '3',
              title: 'Watch the leads come in',
              body: 'Botix starts capturing visitor details and chatting with your audience immediately. Check your Analytics and Leads pages to see it all live.',
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-5 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/30">
                {step}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing snapshot */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Simple, transparent pricing</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              name: 'Free',
              price: 'R0',
              features: ['1 chatbot', '100 messages / month', 'Lead capture', 'Basic analytics'],
              highlight: false,
            },
            {
              name: 'Starter',
              price: 'R299/mo',
              features: ['1 chatbot', '2 000 messages / month', 'Full analytics', 'Remove Botix branding', 'Email notifications'],
              highlight: false,
            },
            {
              name: 'Pro',
              price: 'R799/mo',
              features: ['3 chatbots', 'Unlimited messages', 'WhatsApp alerts', 'Remove branding', 'Priority support'],
              highlight: true,
            },
          ].map(({ name, price, features, highlight }) => (
            <div
              key={name}
              className={`rounded-2xl p-6 border ${
                highlight
                  ? 'bg-gradient-to-br from-indigo-600/30 to-violet-600/20 border-indigo-500/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {highlight && (
                <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full mb-3 inline-block">
                  Most popular
                </span>
              )}
              <div className="text-xl font-bold mb-0.5">{name}</div>
              <div className="text-2xl font-extrabold text-indigo-300 mb-4">{price}</div>
              <ul className="space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-indigo-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 pb-24">
        <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-slate-400 mb-6 text-sm">Join other businesses already using Botix to capture more leads.</p>
        <Link
          to="/register"
          className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-xl shadow-indigo-500/30"
        >
          Create your free account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-slate-500 text-xs px-6">
        © {new Date().getFullYear()} Botix · AI chatbots for your business ·{' '}
        <Link to="/login" className="hover:text-slate-300 transition-colors">Sign in</Link>
      </footer>
    </div>
  )
}
