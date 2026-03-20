import { useEffect, useState } from 'react'
import {
  getWhatsAppConfig,
  saveWhatsAppConfig,
  sendWhatsAppTest,
} from '../../api/client'
import type { WhatsAppProvider, WhatsAppStatus } from '../../types/api'
import { getApiError } from '../../utils/apiError'
import MetaCloudAPIFields from './MetaCloudAPIFields'
import BaileysQRSection from './BaileysQRSection'
import RecipientManager from './RecipientManager'
import MessageTemplateEditor from './MessageTemplateEditor'

interface WhatsAppSettingsProps {
  botId: string
  botName?: string
}

export default function WhatsAppSettings({ botId, botName }: WhatsAppSettingsProps) {
  const [provider, setProvider] = useState<WhatsAppProvider>('disabled')
  const [phoneNumberId, setPhoneNumberId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [wabaId, setWabaId] = useState('')
  const [recipients, setRecipients] = useState<string[]>([])
  const [messageTemplate, setMessageTemplate] = useState(
    'New {{event}} captured by {{bot_name}} at {{timestamp}}'
  )
  const [baileysStatus, setBaileysStatus] = useState<WhatsAppStatus>('disconnected')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    if (!botId) return
    setLoading(true)
    getWhatsAppConfig(botId)
      .then((config) => {
        setProvider(config.provider)
        setPhoneNumberId(config.phoneNumberId ?? '')
        setAccessToken(config.accessToken ?? '')
        setWabaId(config.wabaId ?? '')
        setRecipients(config.recipients ?? [])
        setMessageTemplate(
          config.messageTemplate || 'New {{event}} captured by {{bot_name}} at {{timestamp}}'
        )
      })
      .catch(() => {
        // No existing config — use defaults
      })
      .finally(() => setLoading(false))
  }, [botId])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      await saveWhatsAppConfig(botId, {
        provider,
        phoneNumberId: phoneNumberId || undefined,
        accessToken: accessToken || undefined,
        wabaId: wabaId || undefined,
        recipients,
        messageTemplate,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      setError(getApiError(err, 'Failed to save WhatsApp settings'))
    } finally {
      setSaving(false)
    }
  }

  const handleSendTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const result = await sendWhatsAppTest(botId)
      setTestResult({
        success: result.success,
        message: result.success ? 'Test message sent successfully!' : result.error ?? 'Failed to send test message',
      })
    } catch (err: unknown) {
      setTestResult({ success: false, message: getApiError(err, 'Failed to send test message') })
    } finally {
      setTesting(false)
      setTimeout(() => setTestResult(null), 5000)
    }
  }

  if (loading) {
    return <div className="p-4 text-slate-400 text-sm">Loading WhatsApp settings…</div>
  }

  return (
    <div className="space-y-6">
      {/* Provider selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">WhatsApp Provider</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose how to send WhatsApp notifications when a lead is captured.
          </p>
        </div>

        <div className="space-y-2">
          {([
            { value: 'disabled', label: 'Disabled', desc: 'No WhatsApp notifications' },
            { value: 'meta_cloud_api', label: 'Meta Cloud API', desc: 'Use Meta Business Cloud API (requires approved WhatsApp Business account)' },
            { value: 'baileys', label: 'Baileys (WhatsApp Web)', desc: 'Connect via QR code scan — free, no approval needed' },
          ] as const).map(({ value, label, desc }) => (
            <label
              key={value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                provider === value
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="whatsapp-provider"
                value={value}
                checked={provider === value}
                onChange={() => setProvider(value)}
                className="mt-0.5 accent-indigo-600"
              />
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Provider-specific credentials */}
      {provider === 'meta_cloud_api' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 text-sm">Meta Cloud API Credentials</h2>
          <MetaCloudAPIFields
            phoneNumberId={phoneNumberId}
            accessToken={accessToken}
            wabaId={wabaId}
            onPhoneNumberIdChange={setPhoneNumberId}
            onAccessTokenChange={setAccessToken}
            onWabaIdChange={setWabaId}
          />
        </div>
      )}

      {provider === 'baileys' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 text-sm">WhatsApp Web Session</h2>
          <BaileysQRSection
            botId={botId}
            initialStatus={baileysStatus}
            onStatusChange={setBaileysStatus}
          />
        </div>
      )}

      {/* Recipients & template (shown when not disabled) */}
      {provider !== 'disabled' && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <RecipientManager recipients={recipients} onChange={setRecipients} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <MessageTemplateEditor
              template={messageTemplate}
              onChange={setMessageTemplate}
              botName={botName}
            />
          </div>
        </>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Test result */}
      {testResult && (
        <div
          className={`flex items-center gap-2 text-sm rounded-lg px-4 py-3 ${
            testResult.success
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}
        >
          {testResult.success ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {testResult.message}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
        >
          {saving ? 'Saving…' : saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </>
          ) : 'Save WhatsApp Settings'}
        </button>

        {provider !== 'disabled' && (
          <button
            type="button"
            onClick={handleSendTest}
            disabled={testing}
            className="px-4 py-2.5 border border-slate-300 hover:border-slate-400 disabled:opacity-60 text-slate-700 font-medium rounded-lg text-sm transition-colors"
          >
            {testing ? 'Sending…' : 'Send Test Message'}
          </button>
        )}
      </div>
    </div>
  )
}
