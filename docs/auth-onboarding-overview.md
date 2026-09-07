# Auth & Onboarding Module — Overview

Status: **PLANNED (pending approval)** — no implementation yet.

## Purpose
Build the complete, role-separated authentication and onboarding pipelines for OnlyIndians:

- **Subscriber pipeline** (`/subscriber/*`): register, verify email, onboard (5 steps), enter portal.
- **Creator pipeline** (`/creator/*`): register, verify email, onboard (5 steps incl. KYC + visuals), enter Studio.
- **Shared plumbing**: email verification, phone-first login, password management, logout, route guards, RLS, private storage.

Product rules (non-negotiable, enforced app-wide):
- **India-only**, `+91` prefix fixed site-wide, **no country selector**.
- **No SMS / phone OTP / phone verification. Ever.** Phone is the *primary displayed identifier*; Supabase Auth uses an **email-based internal identity** (documented in `auth-onboarding-data-model.md`).
- Email is **compulsory** at registration and **must be verified** before onboarding begins.

## Scope
### In scope
- Schema + RLS + storage migrations (profiles, creator_profiles, identity_verifications, triggers, RPCs, private buckets).
- Table changes? → **yes**: this creates the previously deferred `profiles` / `creator_profiles` schema that `src/lib/api.js` already references.
- Role-scoped auth routes, login (phone-first), register, forgot/reset password, verify (success/failed), check-email, logout.
- Route guards (GuestOnly, RequireRole update, RequireOnboarding) incl. unverified / incomplete-onboarding gating and role-mismatch redirects.
- Subscriber onboarding (profile, avatar, preferences/interests, username) — 5 steps, resumable.
- Creator onboarding (profile, avatar+banner, identity KYC, payouts, pricing) — 5 steps, resumable, private doc uploads.
- AuthContext / api.js refactor to match; constants (`ROLES`, steps) retargeted to new paths; marketing header CTAs follow automatically.
- Full test suite + lint + build gate; this doc set.

### Out of scope (later modules)
- Dashboards / Studio content (SubHome, CrStudio, explore, messages, etc. remain `PlaceholderPage` targets).
- Subscriptions/UPI/payouts execution (Razorpay), creator monetization internals.
- Admin console (KYC review UI, user management) — schema supports it; UI later.
- Public creator profile pages (`/@:username`, `/discover`).
- Custom email templates, Edge Functions.

## Existing state (inspection findings)
- `src/App.jsx` already scaffolds `/auth/*` routes + `subscriber/onboarding/*` / `creator/onboarding/*` + dashboards, all via `Page name` → `src/router/registry.jsx` lazy dynamic import (flat files in `src/pages/`).
- `src/context/AuthContext.jsx` exists: `signUp` (email+password, metadata role/mobile/username/display), `signIn` (EMAIL+password only today), `resetPasswordForEmail`, `confirmResetPassword`, `verifyOtp`, `profile` loaded via `getProfile(uid)`.
- `src/components/guards/RequireRole.jsx` (guest→login, role-mismatch→own login) and `RequireOnboarding.jsx` (`onboarded` gate) exist but handle neither **unverified** nor **incomplete-onboarding** redirects for auth area, and login paths are stale `/auth/*`.
- `src/layouts/AuthLayout.jsx` (centered card, back/logo/help, legal footer) and `OnboardingLayout.jsx` (step-progress header) exist and are reusable as-is.
- `src/lib/api.js` already has `getProfile`, `getCreatorById`, `getProfileByUsername`, `createProfile`, `updateProfile`, `checkUsernameAvailable`, etc. — but `profiles`/`creator_profiles` **do not exist yet** in the database (calls currently error).
- `src/test/setup.js` stubs `@supabase/supabase-js` (auth methods + `rpcQueue` + storage/channel stubs) — auth tests will extend these stubs.
- Env: `VITE_SUPABASE_URL` in `.env`; project `gogeivscsnanlloeptpj`; migration style per `supabase/migrations/20260907000000_public_pages.sql`.

## Architecture principles
- **Flat pages + registry**: every new page is `src/pages/<Name>.jsx` and added to `src/router/registry.jsx` (never inline route components).
- **Server-side secrets stay server-side**: `src/lib/supabaseAdmin.js` is browser-guarded (`throw` in window) and **must not be imported by pages**. All office/admin operations go through RLS or service-role scripts only.
- **RLS-first**: anon can do ~nothing; authenticated users read/update only the rows they own; role is immutable at the schema level.
- **Never throw**: data-layer functions return `{ data, error }` (`F` wrapper in api.js); pages render load/save/empty/error/retry/permission states.
- **Copies**: India-only wording; no phrase "phone verification" anywhere; byline "Protected by end-to-end encrypted session keys" preserved.
- **UI kit**: `src/components/ui/*` (Field, Input, Select, Button, Badge, ProgressBar, SegmentedControl, Toggle, etc.) + Stitch "Cupertino Clarity" tokens (primary `#004ac6`, canvas `#f9f9fe`, surface `#fff`, Inter, radius 8/16/20).

## Key decisions (proposed, pending approval)
1. **Login is phone-first**: the form accepts `+91` phone **or** email. A phone submitted is resolved to the account email via the `resolve_login_email` RPC, then `signInWithPassword` runs. No SMS/OTP.
2. **Email+password are the only credentials**. Phone is stored normalized (`+91XXXXXXXXXX`, unique) but never used as a Supabase identity.
3. **Role fixed at signup** via `handle_new_user` trigger + immutable `profiles.role`.
4. **Email must be verified before onboarding** (guard redirects unverified users to `/verify`).
5. Old `/auth/*` URLs are cleaned up via `<Navigate>` redirects to the new role-scoped paths.