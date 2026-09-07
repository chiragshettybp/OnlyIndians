# Auth & Onboarding Module — Data Model

Supabase Auth integration: **email+password identity** (`auth.users.email`). Phone (+91) is stored on `profiles.phone` as the **primary displayed identifier** and is *not* a Supabase identity. This satisfies the product rule "no phone OTP/verification" while keeping Supabase-native confirmations/recaptcha/rate-limit.

> db design follows migration style of `supabase/migrations/20260907000000_public_pages.sql`. Tables `profiles`/`creator_profiles` are referenced by existing `src/lib/api.js` — creating them here unblocks that layer. `posts`, `subscriptions`, DMs, payments remain **future** (out of scope).

## Tables

### profiles (one row per auth user)
| column | type | constraints |
|---|---|---|
| id | uuid | PK → `auth.users(id)` ON DELETE CASCADE |
| role | text | NOT NULL, CHECK IN ('subscriber','creator') — immutable |
| email | text | NOT NULL, UNIQUE |
| phone | text | NOT NULL, UNIQUE, CHECK `phone ~ '^\+91[6-9][0-9]{9}$'` (normalized) |
| email_verified_at | timestamptz | NULL until confirmation |
| username | text | UNIQUE (case-insensitive), CHECK lower(username)=username, slug format |
| display_name | text | |
| onboarded | boolean | default false |
| onboarded_at | timestamptz | |
| avatar_url | text | reference to private `avatars` object key |
| banner_url | text | reference to private `banners` object key |
| languages | text[] | default '{en}' (from LANGUAGES codes) |
| interests | text[] | (from INTERESTS ids) |
| notify_email | boolean | default true |
| notify_push | boolean | default true |
| content_language | text | |
| blocked_at / suspended_at / deleted_at | timestamptz | NULL = healthy |
| created_at / updated_at | timestamptz | default now(), updated_at trigger |

### creator_profiles (creator detail; none for subscribers)
| column | type | notes |
|---|---|---|
| id | uuid | PK → `profiles(id)` ON DELETE CASCADE |
| category | text | from CREATOR_CATEGORIES ids |
| primary_discipline | text | from CREATOR_PRIMARY_DISCIPLINES |
| blurb | text | |
| pricing_monthly | int | CHECK 99..9999 (tier) |
| kyc_status | text | CHECK ('not_submitted','pending','approved','rejected') default 'not_submitted' |
| payout_status | text | CHECK ('not_configured','configured','disabled') default 'not_configured' |
| bank_ifsc / bank_account_tail / bank_holder | text | encrypted blob / masked tail only — see PII note |
| created_at / updated_at | timestamptz | |

### identity_verifications (KYC submissions)
| column | type | notes |
|---|---|---|
| id | uuid | PK default gen_random_uuid() |
| user_id | uuid | FK → profiles(id) |
| id_type | text | PAN / AADHAAR / PASSPORT / DRIVING_LICENSE |
| id_last4 | text | masked (never full) |
| doc_paths | jsonb | object keys inside private `documents` bucket |
| status | text | archived CHECK('pending','approved','rejected') |
| rejection_reason | text | |
| submitted_at / reviewed_at / reviewed_by | timestamptz / uuid | reviewed_by admin (service-side later) |

## Triggers
- `handle_new_user` AFTER INSERT ON `auth.users`: inserts `profiles(id=NEW.id, role=metadata.role, email=NEW.email, phone=metadata.mobile normalized, username/display from metadata)`. Rejects unknown role (aborts → signup fails clean).
- `set_updated_at` BEFORE UPDATE ON `profiles` / `creator_profiles`.

## RPCs (security definer unless noted; search_path pinned)
- `resolve_login_email(p_phone text) RETURNS TABLE(email text)` — maps primitive `+91XXXXXXXXXX` to the account email for phone-first login. Returns zero rows on miss (never distinguishable).
- `check_username_available(p_username text) RETURNS boolean` — powers username step (matches/upgrades existing `api.js` call pattern).
- `complete_email_verification(p_uid uuid)` — sets `email_verified_at` when Supabase confirmation observed (also callable via trigger/pre-confirm hooks; guarded to the true owner).
- `submit_identity_verification(...)` — owner-only insert with full-document sanity; status forced to `pending`.

## Storage (all buckets PRIVATE — no public objects)
| bucket | object layout | uploader | reader |
|---|---|---|---|
| `avatars` | `{uid}/avatar.{ext}` | authenticated owner | owner via signed URL; public pages later |
| `banners` | `{uid}/banner.{ext}` | authenticated owner | owner |
| `documents` | `{uid}/kyc/{uuid}.{ext}` | owner (KYC step) | owner + admin (service-side) — never public |
| `media` | (reserved for content module) | — | — |

Policies: OWNER boundary (`storage.objects` bucket_id + `owner = auth.uid()`), upload size/type filters app-side (avatar ≤ 4 MB images; banner ≤ 6 MB; docs pdf/jpg/png ≤ 8 MB). Reads via `createSignedUrl` (owner) — signed URLs expire.

## PII / encryption note (open item — see unresolved-items)
- Bank account number + full ID numbers: **app-layer encrypted** before write (Vault key or AES-GCM under service-role-managed key) OR stored only as encrypted blob + masked tail. No plaintext PII in tables.
- `supabaseAdmin` stays browser-guarded and unused by pages.