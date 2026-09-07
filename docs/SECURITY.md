# Security

## Authentication

- **Supabase Auth** owns identity: passwords (hashed by our backend), sessions
  (JWTs), email verification, password reset flows.
- Sign-up metadata carries the `role`; role is persisted in `profiles.role`.
- Refresh tokens auto-rotate; session persistence in the browser only.
- **No admin registration**: admin accounts are provisioned by the platform.

## Authorization (defense in depth)

1. **Route guards** (`RequireRole`) — wrong/absent role is redirected before a page
   renders; suspended accounts are blocked.
2. **RLS policies** — every table/row access is re-checked by Postgres against
   `auth.uid()` and role, so clients cannot bypass the UI.
3. **Role scoping of JWT claims** — the `anon`/`authenticated` roles carry only what
   their experience may do.
4. **Admin access** — admin actions go through checked admin functions; audit-logged.

## Account separation

- `profiles.role` is immutable by the user (no self-upgrade).
- Cross-role data paths do not exist in the API surface: subscriber views never query
  creator financials; creator views never query other creators' data; admin-only
  tables (`platform_settings`, `admin_audit_log`) are admin-gated.
- Different role shells cannot render one another (see `ACCOUNT_SEPARATION.md`).

## Verification & trust

- Creator onboarding requires **identity verification** (government ID + selfie) into
  `identity_verifications`; content publishing requires `approved`.
- Documents are stored in a private storage bucket readable only by owner and admin.
- Admin review writes an immutable audit trail (`reviewer_id`, `reviewed_at`).

## Payments & payouts

- Payments are processed server-side (never by the anon client).
- Idempotent transaction creation (`transactions.ref` unique) prevents double-charge.
- Payouts require admin approval and are processed server-side.
- Amounts are `numeric` in INR; balance math uses DB aggregates, never client floats.

## Content safety

- Report flow with evidence: `reports` + moderation queue.
- Moderation actions (warn/hide/remove/restrict/ban) are immediately reflected via RLS
  on `posts.status` / `profiles.status`.
- Enforcement of Community Guidelines; emergency takedown capability on admin role.

## Privacy

- Storage buckets have explicit policies: avatars/banners/media intended-public;
  documents/identity private.
- Messages encrypted-in-transit (TLS), stored at rest by provider; no plain-text
  financial details stored — payout account details are encrypted.
- User deletion: hard-delete or GDPR-style anonymize via admin flow.

## Key management

- `VITE_SUPABASE_ANON_KEY` is the only key shipped to the browser.
- The **service-role key and DB password live in gitignored `.env.service-role`** and
  are used only by server-side tooling/CLI/Edge Functions; never `VITE_`-prefixed.
- No secrets in code, logs, or commits. `.env*` excluded from git.

## Operational

- Audit log for admin actions (`admin_audit_log`).
- Suspension status honored by route guards and RLS; sessions of suspended users are
  force-refreshed.
- Rate limits (Supabase auth/provider) protect login, signup, and password reset.