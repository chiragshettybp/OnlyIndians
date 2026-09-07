# Auth & Onboarding Module — Flows

Account lifecycle states:

```
guest
  │  register (subscriber|creator)
  ▼
registered_unverified ──(click email link)──▶ email_verified
  │                                              │  (guard: onboarding)
  ▼                                              ▼
/logverify (we resend)                    onboarding_in_progress (resumable per step)
                                              │
                                              ▼ (final step sets onboarded=true)
                                          active (portal / studio)
```

Permanent terminal-ish states (schema supports; UI honored by guards): `blocked_at`, `suspended_at`, `deleted_at` set → guard redirects to a blocked/suspended notice (page exists in `PlaceholderPage` scope; schema + guard check included here).

## 1. Register (per role)
1. Guest on `/subscriber/register` or `/creator/register` (separate pipelines; CTAs always role-scoped).
2. Fields: `+91` phone (prefix fixed, `+91 98765 43210` example), email, password (min 8, both cases + number), optional username/display prefill.
3. Validate: phone format `^\+91[6-9][0-9]{9}$`; email format; password strength; username slug availability (if provided).
4. `supabase.auth.signUp({ email, password, options: { data: { role, mobile, username, display_name }, emailRedirectTo: origin + /verify?next=/subscriber/onboarding/profile | /creator/onboarding/profile } })`.
5. Create → trigger `handle_new_user` writes `profiles` row (role, phone, email, attestation) + optional creator_profiles. On success → `/…/check-email`.
6. Errors surfaced inline: phone already registered (unique), email already registered (`user_already_exists`), rate limits.

## 2. Email verification (shared)
1. Supabase sends confirmation link pointing at `/verify?token_hash=…&type=email`.
2. `VerifyEmail` resolves the token via `verifyOtp`; on success Supabase flips `email_confirmed_at`; client mirrors `email_verified_at` on `profiles` and routes to the role's onboarding first step (or `/verify/success` for the success state).
3. Expired / invalid / already-used token → `/verify/failed` with "Resend" CTA (resend → check-email).
4. Guard: unverified users are blocked from onboarding/dashboards and pushed to `/verify`.

## 3. Login (phone-first; no OTP anywhere)
1. `/subscriber/login` or `/creator/login`.
2. User enters **phone or email**. If phone → `rpc('resolve_login_email', { p_phone })` maps to the account email (no record leak for wrong phone; generic error).
3. `signInWithPassword(email, password)` → success: role-match → portal; wrong-role account → redirected to their own login.
4. Unverified email → still logs in but redirected to `/verify`.
5. Error copy is generic ("Email/phone or password is incorrect") to avoid enumeration; rate limiting per Supabase defaults.

## 4. Forgot / reset password
1. Forgot → email → `resetPasswordForEmail(email, { redirectTo: origin + /subscriber/reset-password or /creator/reset-password })` → `/…/check-email`.
2. Reset page receives PKCE `token_hash&type=recovery` → `verifyOtp` → set a new password via `updateUser({ password })` (minimum rules re-checked).
3. Invalid/expired token → `verify` failure state with "request a new link".

## 5. Logout
`/subscriber/logout`, `/creator/logout` → `signOut()`, await locally, force redirect to the role's `/login`. Guarded so logout is only reachable by that role.

## 6. Subscriber onboarding (5 steps)
Profile → Avatar (upload, square, private `avatars`) → Preferences (languages, notify toggles) → Interests (multi-select) → Username (claim, unique, lowercase slug). Every step upserts immediately (resumable — deep links land mid-flow). Final "complete" step writes `onboarded=true, onboarded_at=now()` then `/subscriber`.

## 7. Creator onboarding (5 steps)
Profile (category, primary discipline, blurb) → Visuals (avatar + banner uploads, private buckets) → Identity (KYC: name-on-ID, ID type, last-4, document photos → private `documents`; status `pending`, immutable pending review) → Payouts (IFSC + account number + holder; encrypted capture; status `not_configured` until payments module) → Pricing (tier ₹99–₹9,999). Final step → `onboarded=true` → `/creator`.

## Cross-cutting rules
- **Never cross pipelines**: subscriber flow never touches creator_profiles; guards enforce.
- Deep-link resume: every onboarding step is an independently loadable route.
- Interrupted flows: if unverified while mid-onboarding → guard pushes to `/verify` with `state.from` preserved.
- All async transitions show Spinner + inline error with retry; submissions disabled while saving.