# Data Models

Core entities and relationships. Implementation: Supabase Postgres with Row Level
Security; identities from `auth.users`. All tables live in the `public` schema unless
noted. Primary keys are UUIDs; timestamps are `timestamptz`; money is `numeric(12,2)`
in INR.

## Relationships overview

```
auth.users ─1:1─ profiles ─1:1─ creator_profiles ─┬─ subscriptions
        │                                         ├─ posts ─1:N─ interactions
        │                                         ├─ media_library
        │                                         └─ payouts
        └─ conversations ─1:N─ messages
```

## Tables

### profiles
Enriches `auth.users.id` with role and public identity.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | = `auth.users.id` |
| role | text | `subscriber` | `creator` | `admin` (fixed at registration) |
| username | text unique | public handle, lowercased |
| display_name | text | |
| bio | text | |
| avatar_url | text | storage path/URL |
| banner_url | text | |
| onboarded | bool | onboarding completion flag |
| status | text | `active` | `suspended` | `deleted` |
| interests | text[] | subscriber interest tags |
| preferences | jsonb | notification & content prefs |
| created_at / updated_at | timestamptz | |

### creator_profiles
Creator-only extension.

| Column | Type | Notes |
|---|---|---|
| creator_id | uuid PK | → profiles.id |
| category | text | primary niche |
| location | text | |
| website | text | |
| subscription_price | numeric | monthly INR |
| free_trial_days | int | |
| discount_percent | numeric | optional |
| verification_status | text | `pending` | `approved` | `rejected` |
| verified_at | timestamptz | |
| payout_method | text | bank/UPI |
| payout_account | jsonb | account details (encrypted at rest) |
| tax_pan | text | |
| earnings_balance | numeric | running balance |
| created_at / updated_at | timestamptz | |

### posts
Creative content.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| creator_id | uuid FK | → profiles.id |
| caption | text | |
| content_type | text | `text` | `image` | `video` |
| media | jsonb | array of storage URLs |
| visibility | text | `public` | `subscribers` |
| price | numeric null | pay-to-unlock |
| status | text | `draft` | `scheduled` | `published` | `archived` |
| scheduled_at | timestamptz null | |
| likes / comments | int | derived counters |
| created_at / updated_at | timestamptz | |

### media_library
Creator uploads.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| owner_id | uuid FK | → profiles.id |
| url | text | |
| type | text | `image` | `video` |
| name | text | |
| size | int | bytes |
| created_at | timestamptz | |

### subscriptions

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| subscriber_id | uuid FK | → profiles.id |
| creator_id | uuid FK | → profiles.id |
| plan_name | text | e.g. Monthly |
| price | numeric | locked at purchase |
| status | text | `active` | `trial` | `expired` | `cancelled` |
| auto_renew | bool | |
| started_at / renews_at / cancelled_at | timestamptz | |
| UNIQUE(subscriber_id, creator_id) | | one active subscription pair |

### transactions
Money movements.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | → profiles.id |
| type | text | `subscription` | `tip` | `payout` | `fee` | `refund` |
| amount | numeric | signed |
| currency | text | `INR` |
| status | text | `pending` | `paid` | `failed` | `refunded` |
| provider | text | payment provider ref |
| ref | text | provider/human ref |
| meta | jsonb | subscription/payout linkage |
| created_at | timestamptz | |

### payouts

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| creator_id | uuid FK | → profiles.id |
| amount | numeric | |
| status | text | `requested` | `approved` | `processing` | `paid` | `rejected` |
| method | text | |
| requested_at / processed_at | timestamptz | |

### conversations / messages
Direct messaging.

**conversations:** id PK, subscribed/interacted pair `(user_a, user_b)`, last_message_at.
**messages:** id PK, conversation_id FK, sender_id FK, body, attachment jsonb, read_at,
created_at.

### notifications
id PK, user_id FK, type, title, body, read bool, data jsonb (deep link), created_at.

### interactions
id PK, user_id FK, post_id FK, type (`like` | `bookmark`), UNIQUE(user, post, type).

### comments
id PK, post_id FK, author_id FK, body, parent_id null, created_at.

### reports
id PK, reporter_id FK, target_type (`user`|`post`|`comment`), target_id, reason, details,
status (`open`|`reviewing`|`resolved`), resolved_by UUID null, created_at.

### identity_verifications
id PK, creator_id FK, document_type, document_url, selfie_url, status
(`pending`|`approved`|`rejected`), reviewer_id null, submitted_at / reviewed_at.

### support_tickets / ticket_messages
**support_tickets:** id PK, user_id FK, subject, category, status
(`open`|`assigned`|`resolved`), assignee_id null, created_at.
**ticket_messages:** id PK, ticket_id FK, author_id FK, body, created_at.

### admin_audit_log
id PK, admin_id, action, target jsonb, ip, created_at.

### platform_settings (key/value) & feature_flags
Boolean/general configuration for `PlatformSettings`.

## Intentional derivations

- **Creator revenue** = sum of `transactions` linked to creator via subscription meta.
- **Feed** = `posts` of creators the subscriber has an active `subscription` for,
  ordered by `created_at`, respecting `visibility`.
- **Counters** (likes/comments/subscribers) are computed via aggregates, optionally
  cached on the row with a trigger refresh.