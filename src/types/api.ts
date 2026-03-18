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

export interface ScraperConfig {
  rawCookies?: string
  additionalUrls?: string[]
}

export interface KnowledgeBaseStatus {
  status: string
  pageCount: number
  scrapedAt: string
  errorMessage: string
  statusMessage?: string
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
