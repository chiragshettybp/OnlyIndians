# API

OnlyIndians is API-first via **Supabase** (PostgREST). The frontend uses the typed data
layer in `src/lib/api.js` rather than calling PostgREST directly. Bearer auth is the
Supabase session JWT; authorization is enforced by Postgres Row Level Security (RLS).

## Convention

`api.js` exposes async functions that return `{ data, error }` shaped results and throw
no raw errors. Every function is small, named after the domain noun, and maps 1:1 to a
screen need, e.g.:

```js
getProfile(id)            // profiles + creator_profiles when creator
updateProfile(id, patch)  // guarded by RLS "own row" policy
getFeed(uid, page)        // posts of active subscriptions, paginated
getCreator(username)      // public creator profile (never financials)
subscribe(creatorId)      // create subscription + transaction, unlock content
getSubscriptions(uid)
getConversations(uid) / getMessages(conversationId)
sendMessage(conversationId, body)
listNotifications(uid) / markNotificationsRead(uid)
createPost(creatorId, payload) / updatePost(id, patch) / deletePost(id)
getMediaLibrary(ownerId) / uploadMedia(ownerId, file, bucket)
listEarnings(creatorId) / requestPayout(creatorId, amount)
adminListUsers(filter) / adminReviewVerification(id, verdict) / adminResolvePayout(id)
```

## Auth endpoints (Supabase Auth)

| Operation | Function |
|---|---|
| Register (email+password, metadata `role`) | `AuthContext.signUp(role, email, password)` |
| Sign in | `AuthContext.signIn(email, password)` |
| Sign out | `AuthContext.signOut()` |
| Forgot password | `supabase.auth.resetPasswordForEmail(email, redirectTo)` |
| Reset password | `supabase.auth.updateUser({ password })` |
| Email verification | `supabase.auth.verifyOtp` / handle URL token via `onAuthStateChange` |
| 2FA onboarding/verify | `supabase.auth.enroll/verifyMfa` (phase 2) |

## RLS responsibilities

- `profiles` — everyone can read `active` public profiles; write only own row.
- `creator_profiles` — public (safe subset) readable; financials only via owned/admin function.
- `posts` — `published` public/subscribed depending on `visibility`; write by owner.
- `subscriptions` — read own; admin read all.
- `transactions` — read own (subscriber sees their charges; creator their earnings via filter); admin all.
- `payouts`, `media_library`, `messages`, `notifications`, `interactions`, `comments`,
  `reports`, `identity_verifications` — owner-scoped reads/writes with admin override.
- Admin tables (`admin_audit_log`, `platform_settings`) — admin role only.

## Server-side operations (planned)

Must never run client-side (service-role / Edge Functions):

| Operation | Why server-side |
|---|---|
| Create/process payouts | Money movement authority after admin approval |
| Charge a subscription | Payment provider + idempotency |
| Send platform emails | Secret delivery keys |
| Refund | Financial integrity |
| Webhook intake | Provider signature verification |

These run in **Supabase Edge Functions** or **Database Functions** triggered by DB
events, invoked with `supabaseAdmin` (see `ARCHITECTURE.md`).

## Storage

Buckets: `avatars`, `banners`, `media`, `documents`. Upload endpoints use signed
uploads for client media; documents (identity) are owner/admin readable only.