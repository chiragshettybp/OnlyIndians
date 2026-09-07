# Architecture

## Overview

OnlyIndians is a **React single-page application** on Vite, backed by **Supabase**
(auth, Postgres with Row Level Security, and storage). The UI is built strictly from the
**Stitch** design system (Cupertino Clarity) captured in `stitch-designs/`.

```
┌─────────────────────────────────────────────────────────────┐
│                    React SPA (Vite)                          │
│                                                              │
│  Public Website   Auth   Subscriber   Creator   Admin        │
│  ──────────────────────────── shell separation ────────────   │
│                                                              │
│  Shared UI components + layouts + hooks + contexts           │
│  ─────────────────────── data layer ───────────────────────   │
│  src/lib                                  src/lib            │
│  supabase.js (anon/RLS)                 supabaseAdmin.js     │
│  api.js (typed data functions)          (server-only)        │
└──────────────────────────┬────────────────────────────────────┘
                           │ HTTPS
              ┌────────────┴───────────────┐
              │        Supabase            │
              │  ┌─────┐ ┌─────┐ ┌──────┐ │
              │  │Auth │ │Postgres│ │Storage│ │
              │  └─────┘ │ RLS  │ └──────┘ │
              │          └─────┘            │
              └─────────────────────────────┘
```

## Module separation

The application is organized into independently routed module groups:

### 1. Public website (`/`)
Marketing, discovery, creator profiles, pricing, legal, help and status pages. Served
by the `MarketingLayout` shell. No authentication required.

### 2. Authentication (`/auth/*`, `/admin/login`)
Account-type selection, registration, login, password reset, email verification, 2FA
and logout. Served by the `AuthLayout` shell. Uses Supabase Auth.

### 3. Subscriber pipeline (`/subscriber/*`)
Onboarding + the subscriber app: feed, explore, search, creator profiles, posts,
bookmarks, subscriptions, checkout, messages, notifications, settings.

### 4. Creator pipeline (`/creator/*`)
Onboarding + the creator app: dashboard, analytics, content management, media library,
subscribers, earnings, payouts, messages, notifications, settings.

### 5. Admin pipeline (`/admin/*`)
Admin login + admin app: dashboard, users, verification, moderation, reports, payments,
payouts, support, settings.

## Key architectural decisions

1. **Database as the single source of truth.** All screens read and write through the
   data layer (`src/lib/api.js`) against Postgres. No screen owns its own fake dataset.
2. **Role-based shells.** One `DashboardLayout` is parameterized by role; navigation,
   allowed routes and actions are derived from the authenticated profile's `role`.
3. **Account separation is enforced twice.** Route guards reject the wrong role, and
   Postgres RLS policies restrict what each role may read/write (see
   `ACCOUNT_SEPARATION.md` and `SECURITY.md`).
4. **Supabase Auth owns identity.** Users, emails, passwords, password reset and email
   verification come from Supabase Auth; `profiles` enriches identity with role and
   profile fields.
5. **Client uses anon key + RLS.** The service-role client
   (`src/lib/supabaseAdmin.js`) is **server-only** and never imported by browser code.
6. **Design tokens centralize Stitch styling.** Colors, typography, radii, spacing and
   elevation from the Stitch design system are encoded once in `tailwind.config.js`
   and `src/index.css`.

## Data flow

```
Users interact with screens
        │
        ▼
 pages/* (presentation)  ──►  components/* (reusable UI)
        │                             │
        ▼                             ▼
 contexts/* (auth, toast, app state)  hooks/* (async/query helpers)
        │                             │
        ▼                             ▼
 src/lib/api.js ──► src/lib/supabase.js ──► Supabase (PostgREST + RLS)
```

State that must be synchronized across screens (e.g. "post edited everywhere",
"subscription created updates subscriber + creator stats") flows through shared
contexts backed by the database, so every screen re-reads from the source of truth.

## Server-side services (planned)

Where operations must not run in the browser (e.g. creating a payout after admin
approval, sending platform emails, webhook ingestion), the architecture uses **Supabase
Edge Functions or Database Functions** triggered by DB triggers, invoked by the
service-role client. See `API.md` and `DEVELOPMENT_PLAN.md`.