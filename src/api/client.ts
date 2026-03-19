import axios from 'axios'
import type {
  WhatsAppConfigData,
  WhatsAppConfigResponse,
  WhatsAppStatusResponse,
  QrCodeResponse,
  SendResult,
} from '../types/api'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) ?? '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('tenantId')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export async function getWhatsAppConfig(botId: string): Promise<WhatsAppConfigResponse> {
  const r = await api.get<{ data: WhatsAppConfigResponse }>(`/bots/${botId}/whatsapp/config`)
  return r.data.data
}

export async function saveWhatsAppConfig(botId: string, data: WhatsAppConfigData): Promise<WhatsAppConfigResponse> {
  const r = await api.put<{ data: WhatsAppConfigResponse }>(`/bots/${botId}/whatsapp/config`, data)
  return r.data.data
}

export async function getWhatsAppQr(botId: string): Promise<QrCodeResponse> {
  const r = await api.get<{ data: QrCodeResponse }>(`/bots/${botId}/whatsapp/qr`)
  return r.data.data
}

export async function getWhatsAppStatus(botId: string): Promise<WhatsAppStatusResponse> {
  const r = await api.get<{ data: WhatsAppStatusResponse }>(`/bots/${botId}/whatsapp/status`)
  return r.data.data
}

export async function sendWhatsAppTest(botId: string): Promise<SendResult> {
  const r = await api.post<{ data: SendResult }>(`/bots/${botId}/whatsapp/test`)
  return r.data.data
}

export async function disconnectWhatsAppSession(botId: string): Promise<void> {
  await api.delete(`/bots/${botId}/whatsapp/session`)
}

export default api
