# Public Pages — Checklist & Audit

Pre-implementation audit of the OnlyIndians codebase for the public website module.
Reference: `stitch-designs/031_Public Pages Audit & Architecture Checklist.md`.

## 1. Routing (audited in `src/App.jsx`)
| Route | Status | Notes |
|---|---|---|
| `/` Home | Route exists → page is `PlaceholderPage` | To build |
| `/about` | Route exists | To build |
| `/how-it-works` | Route exists | To build |
| `/pricing` | Route exists | To build |
| `/terms` | Route exists | To build |
| `/privacy` | Route exists | To build |
| `/community-guidelines` | **Missing** — currently `/guidelines` | Add canonical route + redirect |
| `/contact` | Route exists | To build |
| `/help` | Route exists | To build |
| `/faq` | Route exists | To build |
| `/status` | Route exists | To build |

## 2. Reusable assets
- `src/layouts/MarketingLayout.jsx` — frosted header, desktop nav, 6-tab mobile bottom bar, footer w/ legal links, active states. Reuse as-is.
- `src/components/Logo.jsx`, `CreatorCard.jsx` (unused by public module), `src/components/ui/*` (26 primitives).
- Type scale, palette, `.giant-card`, `.frosted`, `.hairline`, `.input-field` in `src/index.css` + `tailwind.config.js`.
- `src/lib/constants.js` — brand, nav, platform facts, trust pillars, pricing, status services (all Stitch-sourced copy).
- `src/hooks/*`, `src/context/*`, `src/lib/utils.js`.

## 3. Missing components
- **`Accordion`** (FAQ) — not present in `src/components/ui`. Create smallest reusable accordion (keyboard + ARIA).
- **`usePageTitle`** hook — no per-page `document.title` mechanism exists (bare `index.html` title).

## 4. Missing routes / backend
- `/community-guidelines` route (see above).
- Contact submissions backend — no `supabase/migrations` folder exists; `docs/API.md` pre-defines `support_tickets` + `ticket_messages`. Implemented in this module (migration + RPC).
- No status-monitoring backend, no pricing-in-DB, no FAQ-content DB, no analytics.

## 5. Environment variables
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (public, `.env`). `.env.service-role` (gitignored, server-only). No new variables required.

## 6. Assumptions
1. Legal copy (Terms/Privacy) is placeholder pending final legal review; marked `<!-- legal-review -->`.
2. Pricing is static/informational (product facts only, no DB table, no fake creator plans).
3. Contact submissions persist via the new `support_tickets`/`ticket_messages` RPC.
4. System-status figures are design-time values from the Stitch Status screen and are labeled "monitoring pending".
5. `auth/subscriber|creator/login|register` routes exist (auth UI is out of this module's scope; links point to them).
6. `/discover` and `/@:username` are existing routes outside this module (Home "discover creators" links there).

## 7. Unresolved questions
- Final legal text owner + approval.
- Live uptime monitoring source (no provider chosen).
- Spam/rate limiting SLA for `/contact` (honeypot shipped; server-side limiting deferred).

## 8. Risks
- Public contact RPC must stay least-privilege (no direct table access for anon).
- Placeholder auth pages mean register/login CTAs land on "screen in progress" until the auth module is built — link correctness is guaranteed, visual completion is out of scope.

## 9. Required tests
Defined in `public-pages-test-plan.md`; executed and recorded in `public-pages-test-results.md`.

## 10. Explicitly out of scope
- Subscriber/creator/admin dashboards & onboarding.
- Authentication pages & flows (behavior preserved, not built).
- Creator discovery (`/discover`) and public creator profiles (`/@:username`).