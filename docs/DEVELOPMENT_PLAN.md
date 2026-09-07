# Development Plan

Implementation is phased so each phase is shippable and demoable while building toward
the full product.

## Phase 0 — Foundations
- [x] Vite + React + Tailwind scaffold, Stitch design tokens, env setup.
- [x] Supabase project wired (URL/key, CLI linked, `.env.service-role` local).
- [ ] Directory/structure docs finalized (these files).
- Exit: `npm run dev` serves a functioning shell.

## Phase 1 — Data layer & auth
- [ ] SQL migration: all tables + RLS policies + triggers + storage buckets; push to
      remote; seed demo creator + posts.
- [ ] `src/lib/api.js` typed data functions.
- [ ] `AuthContext` (session, role profile, sign in/up/out, reset/verify), guards.
- [ ] UI primitives (`src/components/ui/*`) + layouts (Marketing/Auth/Dashboard).
- Exit: register → login → email verify → profile row created → guards route by role.

## Phase 2 — Public website + auth screens (Stitch)
- [ ] Home, How It Works, Pricing, Platform Status (existing Stitch screens).
- [ ] About, Discover, Search, public creator profile, Terms, Privacy, Guidelines,
      Contact, Help, FAQ.
- [ ] Auth screens: account type select, register/login/forgot/reset/verify email,
      verification success/failed, logout (existing Stitch screens).
- Exit: full public funnel usable and styled 1:1 to Stitch.

## Phase 3 — Subscriber pipeline
- [ ] Subscriber onboarding (6 Stitch steps).
- [ ] Feed, explore, search, creator profile, post detail, bookmarks.
- [ ] Subscriptions + checkout (+ server-side payment hook), messages, notifications,
      requests, settings.
- Exit: a subscriber can go from signup to a paid subscription with unlocked feed.

## Phase 4 — Creator pipeline
- [ ] Creator onboarding (6 Stitch steps incl. identity verification + payout details).
- [ ] Dashboard + analytics, content management (composer/editor/schedule/analytics).
- [ ] Media library, subscribers, earnings, payouts, messages, notifications, settings.
- Exit: creator publishes → content flows to subscribers; earnings track real activity.

## Phase 5 — Admin pipeline
- [ ] Admin auth + dashboard.
- [ ] User management, verification review, moderation, reports, payments, payouts,
      support tickets, settings (roles/flags/audit/health).
- Exit: end-to-end governance: verify creator → approve payout → moderate content →
      resolve reports/tickets.

## Phase 6 — Hardening & launch readiness
- [ ] Payments hardening (idempotency, webhooks, refunds).
- [ ] Comms: platform emails via Edge Functions; notification triggers.
- [ ] Accessibility, responsive QA, error/empty/loading states everywhere.
- [ ] Performance (indexes, pagination, storage CDN), audit log completeness.

## Ordering rationale
Auth and RLS first because every screen depends on identity/guards. Public + auth next
so the funnels are real. Then subscriber (revenue making) before creator (revenue
earning), with admin last because it governs already-existing entities. Hardening is
continuous; security-sensitive money ops are server-side from Phase 3 onward.