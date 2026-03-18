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
}

export interface TenantData {
  id: string
  name: string
  apiKey: string
}
