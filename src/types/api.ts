export interface SessionSummary {
  id: string
  visitorId: string
  messageCount: number
  startedAt: string
  lastActivityAt: string
  pageUrl?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatSession {
  id: string
  visitorId: string
  messages: ChatMessage[]
  startedAt: string
  lastActivityAt: string
  pageUrl?: string
}

export interface BotSettings {
  botName: string
  greeting: string
  systemPrompt: string
  primaryColor: string
  backgroundColor: string
  websiteUrl: string
}

export interface KnowledgeBaseStatus {
  status: string
  pageCount: number
  scrapedAt: string
  errorMessage: string
  statusMessage?: string
  summary?: string
}

export interface TenantData {
  id: string
  name: string
  apiKey: string
}

export interface Lead {
  id: string
  tenantId: string
  visitorId?: string
  name: string
  email: string
  phone?: string
  pageUrl?: string
  notified: boolean
  capturedAt: string
}

export interface AnalyticsSummary {
  totalConversations: number
  totalLeads: number
  conversationsToday: number
  leadsToday: number
  conversationsThisWeek: number
  leadsThisWeek: number
  conversationsThisMonth: number
  leadsThisMonth: number
  avgMessagesPerConversation: number
  topPages: Array<{ url: string; conversations: number }>
}

export interface SubscriptionInfo {
  plan: 'free' | 'starter' | 'pro'
  status: 'active' | 'trial' | 'cancelled' | 'past_due'
  nextBillingDate?: string
  hideBranding: boolean
}

export interface PlanInfo {
  id: 'free' | 'starter' | 'pro'
  name: string
  priceZAR: number
  priceUSD: number
  features: string[]
  missingFeatures: string[]
}

export type WhatsAppProvider = 'meta_cloud_api' | 'baileys' | 'disabled'
export type WhatsAppStatus = 'connected' | 'disconnected' | 'qr_pending'

export interface WhatsAppConfigData {
  provider: WhatsAppProvider
  phoneNumberId?: string
  accessToken?: string
  wabaId?: string
  recipients: string[]
  messageTemplate: string
}

export interface WhatsAppConfigResponse {
  provider: WhatsAppProvider
  phoneNumberId?: string
  accessToken?: string
  wabaId?: string
  recipients: string[]
  messageTemplate: string
}

export interface WhatsAppStatusResponse {
  status: WhatsAppStatus
}

export interface QrCodeResponse {
  dataUrl: string
}

export interface SendResult {
  success: boolean
  error?: string
}
