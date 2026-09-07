# Auth & Onboarding Module — Permissions / Security

RLS-first. Every table created with RLS **enabled**; policies are the only write path for anon/authenticated roles. Server-side ops (admin review, encryption) go through `supabaseAdmin` (service role) or scheduled scripts — never the browser.

## Roles
- `anon` — unauthenticated.
- `authenticated` — a signed-in user. Authorization is per-row ownership, NOT the role column (role is data, used only for business routing + guards).
- `service_role` — reserved for `supabaseAdmin`/Edge Functions/scripts; bypasses RLS.

## RLS matrix
| table | anon | authenticated | service_role |
|---|---|---|---|
| profiles | DENY all (public pages read nothing yet) | SELECT own; UPDATE own (subset); INSERT via trigger only (no anon write) | full |
| creator_profiles | DENY | SELECT own; UPDATE own (subset: category/discipline/blurb/upload refs/pricing/payout fields by owner) | full |
| identity_verifications | DENY | INSERT own (forces status pending via RPC); SELECT own (masked); UPDATE own ONLY if status='pending' (limited fields) | full (admin review) |
| auth.users (managed by Supabase) | — | via `auth.uid()` only | — |

App-level column restrictions (while row is owner-updateable):
- `role` — no policy permits updating it → immutable.
- `email` — never updateable from browser (Supabase handles email change natively; out of scope).
- `blocked_at/suspended_at/deleted_at` — owner cannot write; admin only.
- `email_verified_at` — only `complete_email_verification` (definer, `auth.uid()`-checked) can set.

## Storage policies
| bucket | read (anon) | write (authenticated) | notes |
|---|---|---|---|
| avatars | DENY | OWNER only | signed URL reads for owner; later public thumbnails via server |
| banners | DENY | OWNER only | |
| documents | DENY | OWNER only (KYC step) | never public; admin read service-side |
| media | DENY | reserved | future |

All object keys include the owner `{uid}/…` prefix; policy checks `owner = auth.uid()`.

## RPC security
- `resolve_login_email`: SECURITY DEFINER, `search_path = public, pg_temp`, returns only `email` (no phone/role); caller may be anon — no data leakage (same shape error). Optional rate-limit note.
- `submit_identity_verification`: DEFINER, owner-only (asserts auth.uid() = user_id), inserts with status='pending' regardless of client claim.
- `complete_email_verification(p_uid)`: asserts `auth.uid() = p_uid`.

## Guards → authorization map (UI is defense-in-depth, not security)
- GuestOnly → RequireRole = no-session; RequireRole passes only with matching `profiles.role`; mismatches redirect (never render).
- Unverified → redirected to `/verify` before any onboarding/dashboard route.
- `onboarded=false` → dashboard blocked; onboarding routes allowed.
- Deleted/suspended/blocked → served a locked-out notice; data still owner-readable but no writes.
- Logout route itself is role-guarded.

## Forbidden patterns
- No service-role key in client bundles (browser-guarded module enforces at import time).
- No direct `from('profiles').update({role: …})` path for role changes.
- No plaintext PII in tables (see data-model PII note).
- No public storage objects for user content.