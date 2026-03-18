import { useEffect, useState } from 'react'
import api from '../api/client'
import type { SubscriptionInfo } from '../types/api'

interface Plan {
  id: 'free' | 'starter' | 'pro'
  name: string
  priceZAR: number
  priceUSD: number
  features: string[]
  missingFeatures: string[]
  highlight?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'FREE',
    priceZAR: 0,
    priceUSD: 0,
    features: ['1 chatbot', '100 msgs/mo', 'Lead capture', 'Basic analytics'],
    missingFeatures: ['Remove "Powered by Botix"', 'Email notifications', 'WhatsApp alerts'],
  },
  {
    id: 'starter',
    name: 'STARTER',
    priceZAR: 299,
    priceUSD: 15,
    features: ['1 chatbot', '2,000 msgs/mo', 'Lead capture', 'Full analytics', 'Remove branding', 'Email notifications'],
    missingFeatures: ['WhatsApp alerts'],
    highlight: true,
  },
  {
    id: 'pro',
    name: 'PRO',
    priceZAR: 799,
    priceUSD: 39,
    features: ['3 chatbots', 'Unlimited msgs', 'Lead capture', 'Full analytics', 'Remove branding', 'Email notifications', 'WhatsApp alerts', 'Priority support'],
    missingFeatures: [],
  },
]

export default function Billing() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [cancelConfirm, setCancelConfirm] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      // Payment succeeded — reload subscription after a short delay
      setTimeout(() => window.location.replace('/billing'), 1500)
    }

    api
      .get<{ data: SubscriptionInfo }>('/billing/subscription')
      .then((r) => setSubscription(r.data.data))
      .catch(() => {
        // If endpoint not available, show a default free plan
        setSubscription({ plan: 'free', status: 'active', hideBranding: false })
      })
      .finally(() => setLoading(false))
  }, [])

  const handlePayfast = async (plan: 'starter' | 'pro') => {
    setActionLoading(`payfast-${plan}`)
    setError('')
    try {
      const res = await api.post<{ data: { paymentUrl: string } }>('/billing/payfast/initiate', {
        plan,
        currency: 'ZAR',
      })
      window.location.href = res.data.data.paymentUrl
    } catch {
      setError('Failed to initiate PayFast payment. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleStripe = async (plan: 'starter' | 'pro') => {
    setActionLoading(`stripe-${plan}`)
    setError('')
    try {
      const res = await api.post<{ data: { checkoutUrl: string } }>('/billing/stripe/create-checkout', { plan })
      window.location.href = res.data.data.checkoutUrl
    } catch {
      setError('Failed to initiate Stripe checkout. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async () => {
    setActionLoading('cancel')
    setError('')
    try {
      await api.post('/billing/cancel')
      setSubscription((prev) => prev ? { ...prev, plan: 'free', status: 'cancelled' } : prev)
      setCancelConfirm(false)
    } catch {
      setError('Failed to cancel subscription. Please contact support.')
    } finally {
      setActionLoading(null)
    }
  }

  const currentPlan = subscription?.plan ?? 'free'

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
          Loading billing info...
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Billing & Plans</h1>
        <p className="text-slate-500 text-sm mt-1">Choose the plan that fits your business</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id
          const isPaid = plan.id !== 'free'
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-6 shadow-sm transition-all ${
                plan.highlight
                  ? 'border-indigo-500 shadow-lg shadow-indigo-100'
                  : isCurrent
                  ? 'border-green-400'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase">{plan.name}</h3>
                <div className="mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900">
                      R{plan.priceZAR}
                    </span>
                    <span className="text-slate-500 text-sm">/mo</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">${plan.priceUSD}/mo USD</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </div>
                ))}
                {plan.missingFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              {isCurrent ? (
                <div className="w-full py-2.5 text-center text-sm font-semibold text-green-700 bg-green-50 rounded-xl border border-green-200">
                  Current Plan
                </div>
              ) : isPaid ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handlePayfast(plan.id as 'starter' | 'pro')}
                    disabled={actionLoading !== null}
                    className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-xl transition-colors"
                  >
                    {actionLoading === `payfast-${plan.id}` ? 'Redirecting...' : `Upgrade - PayFast (ZAR)`}
                  </button>
                  <button
                    onClick={() => handleStripe(plan.id as 'starter' | 'pro')}
                    disabled={actionLoading !== null}
                    className="w-full py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-60 rounded-xl transition-colors border border-indigo-200"
                  >
                    {actionLoading === `stripe-${plan.id}` ? 'Redirecting...' : `Upgrade - Stripe (USD)`}
                  </button>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Current billing info */}
      {subscription && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Payment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Current Plan</p>
              <p className="text-slate-900 font-semibold capitalize">{subscription.plan}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : subscription.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {subscription.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Branding</p>
              <p className="text-slate-900 text-sm">
                {subscription.hideBranding ? 'Removed' : 'Powered by Botix shown'}
              </p>
            </div>
          </div>

          {/* Cancel subscription */}
          {currentPlan !== 'free' && subscription.status === 'active' && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              {cancelConfirm ? (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-700">Are you sure? You'll lose access to paid features.</p>
                  <button
                    onClick={handleCancel}
                    disabled={actionLoading === 'cancel'}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
                  >
                    {actionLoading === 'cancel' ? 'Cancelling...' : 'Yes, cancel'}
                  </button>
                  <button
                    onClick={() => setCancelConfirm(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                  >
                    Keep plan
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCancelConfirm(true)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  Cancel subscription
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
