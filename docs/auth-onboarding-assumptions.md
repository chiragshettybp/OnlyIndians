# Auth & Onboarding Module — Assumptions (pre-implementation)

Documented during inspection; fixes pinned where relevant. This module ships subject to these assumptions. Anything risky is mirrored in `auth-onboarding-unresolved-items.md`.

## Product / copy
1. India-only, `+91` fixed prefix, no country selector; no phone OTP/verification anywhere. "Phone verification" never appears.
2. Phone is the primary *displayed* identifier; **email is the auth credential** (Supabase-native confirmations/recaptcha). Login form accepts phone **or** email; phone resolves to email via RPC.
3. Email is compulsory and must be verified before onboarding starts.
4. Role is fixed at signup (`subscriber` | `creator`), immutable thereafter. Admin accounts are out of scope (service-role only).

## Existing codebase
5. Route `Page` pattern + flat `src/pages/*` + `registry.jsx` lazy imports are the only route mechanism (kept).
6. `src/context/AuthContext.jsx` will be **extended** (phone-first signIn, verify completion, role-aware logout RTAs) rather than replaced; `signUp` metadata shape preserved so trigger contract matches `raw_user_meta_data`.
7. `src/lib/api.js` data-layer functions are the single read/write layer (never throw); new functions follow the `F` wrapper.
8. `RequireRole`/`RequireOnboarding` are refactored/extended in place (new `GuestOnly` added); login/register/onboarding paths come from `ROLES` constants in `src/lib/constants.js` (updated), so marketing header CTAs retarget automatically.
9. `AuthLayout` and `OnboardingLayout` shells are reused; step constants (`SUBSCRIBER_STEPS`, `CREATOR_STEPS`) kept, routs remain `/subscriber/onboarding/*` and `/creator/onboarding/*`.
10. Profiles / creator_profiles tables **do not yet exist** — this module's migration creates them (api.js already references them).
11. `supabaseAdmin.js` is browser-guarded server-only; not imported by any page.
12. Test harness: `src/test/setup.js` supabase mock extended (queued auth results, storage stub) — mirrors existing `rpcQueue` convention. Public-page suites must stay green (33 tests).

## Deployment / third-party
13. Supabase hosted project `gogeivscsnanlloeptpj`, ap-south-1, CLI-linked; new migration committed under `supabase/migrations/` and pushed via `supabase db push` on approval.
14. Email confirmation magic links default (Supabase hosted); email templates unmodified (custom = later).
15. Localhost dev origin works for emailRedirectTo (Vite on 5173); production domain unknown → stored where? see unresolved items.
16. Password rules: min 8, letters + numbers (client + server policy).
17. Creator bank/ID PII: captured encrypted/masked per data-model note; actual payouts/Razorpay unchanged (out of scope).
18. Realtime not used for auth rows (no need); dashboard realtime future.

## Behavior
19. Resumable onboarding: each step persists on save; deep links land mid-flow.
20. Users who finish onboarding see dashboards (still placeholder screens) — this module guarantees the gates, not the widgets.