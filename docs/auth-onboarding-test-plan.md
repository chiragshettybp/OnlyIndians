# Auth & Onboarding Module — Test Plan

Harness: vitest + jsdom + @testing-library (existing). `src/test/setup.js` extended with **queued auth results** (mirrors `rpcQueue`) and a **storage stub** (`upload`, `createSignedUrl`, success/error queues). All existing 33 tests must remain green. `npm run lint` + `npm run build` are gates.

## Suites
### 1. Validation / utils (`src/lib/utils`, new auth-utils)
- T-01 phone normalize/validate (`+91 98765 43210` → `+919876543210` passes; `98765 43210`, `+9198…` 10-digit wrong prefix, 11-digit, letters rejected).
- T-02 email validation; password policy (min 8, letters+numbers; reject weak).
- T-03 display/internationalization of `+91 98765 43210` (visible copy, no country selector present).

### 2. Data layer (`src/lib/api.js` additions, mocked from/rpc)
- T-04 createProfile/updateProfile round-trip `{data,error}`.
- T-05 resolveLoginEmail call path via RPC (phone → email) + miss returns empty array.
- T-06 checkUsernameAvailable uniqueness.
- T-07 submitIdentityVerification forces `status='pending'`.

### 3. AuthContext (`src/context/AuthContext.jsx`)
- T-08 signUp passes metadata (role, mobile, username, display_name) + role-scoped `emailRedirectTo`.
- T-09 signIn phone path: phone input → resolveLoginEmail → signInWithPassword(email) — mocked.
- T-10 signIn email path directly; generic failure copy used for bad creds.
- T-11 auth state machine: getSession → ready; onAuthStateChange SIGNED_IN/SIGNED_OUT refreshProfile; error state set + cleared.
- T-12 resetPasswordForEmail / confirmResetPassword / verifyOtp wiring.

### 4. Guards (`RequireRole`, `RequireOnboarding`, `GuestOnly`)
- T-13 per state × route matrix: guest→loginRoute; wrong role→own home; unverified→/verify; incomplete onboarding→onboardingFirst; onboarded→children; blocked/suspended/deleted→locked-out notice.
- T-14 logout page (each role) signs out then redirects to its login.

### 5. Flow integration (render real `<App/>`, same style as publicRoutes)
- T-15 subscriber: register → check-email → verify (mock token) → verify/success → onboarding steps 1→5 → complete → `/subscriber` renders (onboarded).
- T-16 creator: register → verify → onboarding 1→5 (incl. avatar/banner upload → storage mock; KYC doc upload → `pending`; pricing tier) → complete → `/creator`.
- T-17 interrupted: mid-onboarding unverified user → /verify; deep link lands on correct step when verified.
- T-18 role-mismatch: creator session on subscriber route (and vice-versa) → redirected to own portal.
- T-19 legacy `/auth/*` URLs redirect to new paths.
- T-20 positive/negative states: every page renders load (Spinner), submit (disabled), save-error with retry, permission/eligible states.

### 6. Regression
- T-21 all 33 existing public/french tests green; build + lint pass.

## Matrix (default pass criteria: all green)
| area | tests | gates |
|---|---|---|
| util/validation | T-01..03 | npm test |
| data layer | T-04..07 | npm test |
| AuthContext | T-08..12 | npm test |
| guards | T-13..14 | npm test |
| flows | T-15..20 | npm test |
| regression | T-21 | npm test + lint + build |