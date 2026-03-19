import { useEffect, useState } from 'react'
import { getWhatsAppQr, getWhatsAppStatus, disconnectWhatsAppSession } from '../../api/client'
import type { WhatsAppStatus } from '../../types/api'

interface BaileysQRSectionProps {
  botId: string
  initialStatus: WhatsAppStatus
  onStatusChange: (status: WhatsAppStatus) => void
}

export default function BaileysQRSection({ botId, initialStatus, onStatusChange }: BaileysQRSectionProps) {
  const [status, setStatus] = useState<WhatsAppStatus>(initialStatus)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  useEffect(() => {
    if (status === 'connected') {
      setQrDataUrl(null)
      return
    }

    const poll = async () => {
      try {
        const qrRes = await getWhatsAppQr(botId)
        if (qrRes.dataUrl) {
          setQrDataUrl(qrRes.dataUrl)
        }
        const statusRes = await getWhatsAppStatus(botId)
        setStatus(statusRes.status)
        onStatusChange(statusRes.status)
      } catch {
        // ignore polling errors
      }
    }

    poll()
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [botId, status, onStatusChange])

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      await disconnectWhatsAppSession(botId)
      setStatus('disconnected')
      onStatusChange('disconnected')
      setQrDataUrl(null)
    } catch {
      // ignore
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Status:</span>
        {status === 'connected' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Connected
          </span>
        )}
        {status === 'qr_pending' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Waiting for scan
          </span>
        )}
        {status === 'disconnected' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Disconnected
          </span>
        )}
      </div>

      {status === 'connected' ? (
        <div className="flex items-center gap-3">
          <p className="text-sm text-green-600 font-medium">Connected ✓ — WhatsApp Web session is active.</p>
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {disconnecting ? 'Disconnecting…' : 'Disconnect'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Scan the QR code below with WhatsApp on your phone to connect a session.
          </p>
          {qrDataUrl ? (
            <div className="inline-block border border-slate-200 rounded-lg p-3 bg-white">
              <img src={qrDataUrl} alt="Scan QR code with WhatsApp" className="w-48 h-48" />
            </div>
          ) : (
            <div className="w-48 h-48 border border-slate-200 rounded-lg flex items-center justify-center bg-slate-50">
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-xs">Loading QR…</span>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-400">QR refreshes automatically. Keep this page open while scanning.</p>
        </div>
      )}
    </div>
  )
}
