# Botix Frontend

## What This Is
React 18 / TypeScript 5 / Vite 5 SPA dashboard for the Botix multi-tenant AI chatbot platform.
- Tenant dashboard: sessions, leads, analytics, billing, settings, API key management
- Live widget preview embedded in the Settings page
- Communicates exclusively with the `ai-chatbot-backend` REST API

Full project context (API contracts, architecture decisions, environment variables): see `/c/Users/rynobotes/IdeaProjects/ai-chatbot/context.md`.

## Build Commands
```bash
npm install           # install dependencies
npm run dev           # start Vite dev server (proxies /api to production backend)
npm run build         # tsc type-check + Vite production build → dist/
npm run preview       # preview the production build locally
```

The dev server proxies `/api/*` to `https://ai-chatbot-backend-production-d810.up.railway.app` (configured in `vite.config.ts`). To point at a local backend, update `VITE_API_URL` or the proxy target.

## Deployment
Deployed to Vercel. `vercel.json` rewrites all routes to `/index.html` for SPA client-side routing.

## Key Directories
```
src/
  types/api.ts          ← SOURCE OF TRUTH for all shared API types. Always update here first.
  api/client.ts         ← axios instance; JWT interceptor; 401 → /login redirect; WhatsApp API calls
  contexts/
    AuthContext.tsx     ← login / register / logout; JWT stored in localStorage
  pages/
    Dashboard.tsx       ← session stats + lead count + quick-start card
    Analytics.tsx       ← analytics summary, stat cards, top pages table
    Leads.tsx           ← leads table + CSV export
    Billing.tsx         ← plan cards (FREE/STARTER/PRO) + PayFast + Stripe payment buttons
    Sessions.tsx        ← full session list table
    SessionDetail.tsx   ← chat transcript view for a single session
    Settings.tsx        ← bot settings form + live WidgetPreview + scraper trigger
    ApiKeys.tsx         ← API key display, regenerate button, embed code snippet
    Login.tsx           ← Botix branded dark gradient auth page
    Register.tsx        ← Botix branded dark gradient auth page
  components/
    Layout.tsx          ← Botix branding, sidebar nav (all routes), Outlet
    ProtectedRoute.tsx  ← redirects to /login if no JWT token in localStorage
    WidgetPreview.tsx   ← live iframe-style preview of the embedded widget
    whatsapp/           ← WhatsApp settings sub-components (Settings, QR, MetaFields, Recipients, TemplateEditor)
```

## Frontend Routes
```
/login              ← public
/register           ← public
/dashboard          ← protected
/analytics          ← protected
/leads              ← protected
/settings           ← protected
/api-keys           ← protected
/sessions           ← protected
/sessions/:sessionId ← protected
/billing            ← protected
```
All protected routes are wrapped by `ProtectedRoute` via the `Layout` parent route in `App.tsx`.

## API Communication
All API calls go through the axios instance exported from `src/api/client.ts`.
- Base URL: `VITE_API_URL` env var, falls back to `/api` (proxied by Vite dev server).
- Auth header: `Authorization: Bearer <token>` added automatically by request interceptor.
- Response shape: `{ success, message, data }` — access payload as `res.data.data`.
- 401 response: interceptor clears localStorage and redirects to `/login`.

## Shared Types
`src/types/api.ts` is the single source of truth for all TypeScript interfaces that mirror backend DTOs:
- `SessionSummary`, `ChatMessage`, `ChatSession`
- `BotSettings`, `KnowledgeBaseStatus`, `ScraperConfig`
- `TenantData`, `Lead`, `AnalyticsSummary`
- `SubscriptionInfo`, `PlanInfo`
- `WhatsAppProvider`, `WhatsAppStatus`, `WhatsAppConfigData`, `WhatsAppConfigResponse`, `WhatsAppStatusResponse`, `QrCodeResponse`, `SendResult`

When the backend adds a new field to any response, add it to the corresponding interface here first.

## Auth Flow
- JWT stored in `localStorage` under key `"token"`. TenantId stored under `"tenantId"`.
- `AuthContext` exposes `user`, `login()`, `register()`, `logout()`.
- `ProtectedRoute` checks for the presence of `"token"` in localStorage.

## Notable Quirks
- `websiteUrl` is a top-level field on the backend `Tenant` document but is merged into the `BotSettings` form object on the frontend. This is intentional — do not "fix" it.
- `SessionSummary.pageUrl` and `ChatSession.pageUrl` are `string | undefined` because the backend field is nullable.
- `_cb_lead_captured` key in `localStorage` prevents the lead capture form from showing again after first submission.
- WhatsApp API client in `api/client.ts` currently calls `/bots/{botId}/whatsapp/*`. The backend controller is at `/api/tenant/me/whatsapp/*`. This URL mismatch is a known issue that must be resolved.

## Styling
Tailwind CSS 3 with PostCSS. No component library — all UI is hand-rolled Tailwind. Dark gradient theme for auth pages; dark sidebar + light content area for dashboard.

## CRITICAL SYNC RULE
This frontend is one half of a tightly coupled pair. Any new page or API call added here MUST have a corresponding backend endpoint in `ai-chatbot-backend/`. Check `/c/Users/rynobotes/IdeaProjects/ai-chatbot/context.md` for the full API contract before adding or changing API interactions.
