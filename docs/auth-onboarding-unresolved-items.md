# Auth & Onboarding Module — Unresolved Items

Logged now; each blocks a specific decision, not the whole module. Resolution path listed.

1. **Production auth redirect domain** — email confirm / password-recovery links go to `window.location.origin`. Local dev (`http://localhost:5173`) works; final domain unknown. → Resolve before first production push (hosting deploy). Non-blocking locally.

2. **PII encryption for bank + ID numbers** — plan: app-layer encryption before write (Vault key or AES-GCM w/ service-managed key) plus masked tail in tables. No Vault configuration exists yet in project. → Decide method in Phase A; if deferred, fields store masked tail + `encrypted` readiness flag and the KYC/payout steps mark `not_submitted`/`not_configured` until enabled.

3. **Identity doc storage & review** — private `documents` bucket + `pending → approved/rejected`; admin review UI is a later module, so approved state is only reachable service-side. → Schema + client submission in this module; reviewer tooling later. Confirmed acceptable by scope.

4. **Rate limiting for `resolve_login_email`** — relies on Supabase gateway defaults. Phone→email enumeration hardening (per-IP throttle) deferred. → Note in permissions; revisit with Edge Function if flagged.

5. **Email template / sender identity** — default Supabase confirmations used. Branded templates/SES domain later. → Non-blocking.

6. **`reset-password` token semantics** — Supabase PKCE recovery link carries `token_hash&type=recovery` in the URL; ResetPassword must handle hash/query parsing + expiry. Exact param names verified during implementation against live response. → smoke test at build time.

7. **Username uniqueness vs deleted accounts** — `deleted_at` users keep their username forever (unique index). Claiming release schedule for deleted accounts is a later admin decision. → Keep unique; document.

8. **Interests/languages source of truth** — table content lives in `src/lib/constants.js` (INTERESTS, LANGUAGES). Persisting as text arrays matches api.js; adding codified lookup tables deferred. → Keep constants-only.

9. **Existing `checkUsernameAvailable` signature** (api.js) vs new RPC — implementation will reconcile exact RPC name/args. → Single source in api.js.

10. **Auth test stub fidelity** — setup.js auth stub must model `token_hash` flows enough for VerifyEmail tests; Supabase `verifyOtp({ token_hash })` args confirmed at implementation. → extend stub.

Resolved during previous module deliveries (for context): eslint config, jsdom gaps, contact a11y, auth-copy contradiction (public pages), vitest dynamic-import noise.