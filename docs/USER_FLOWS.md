# User Flows

## 1. Public website → authentication → account type selection

```
/  Home
│   ▼ CTA (Join / Sign in)
├── /auth                     Account type selection
│     Discover pipeline shrink-wrap:
│     ─ Subscriber ─▶ /auth/subscriber/register
│     └ Creator    ─▶ /auth/creator/register
│     (Admin not publicly selectable — /admin/login)
```

The only shared product-level flow is account type selection. After selecting a type,
the user enters that pipeline and never leaves it.

## 2. Subscriber journey

```
/auth/subscriber/register ─▶ email verification ─▶ /subscriber/onboarding/*
  ├── username  ─▶ avatar  ─▶ profile ─▶ interests  ─▶ preferences  ─▶ complete
  ▼
/subscriber  (home feed)
   │   explore/search ─▶ /c/:username ─▶ locked preview ─▶ subscribe
   │                                                        ▼
   │                                          /subscriber/checkout/:creatorId
   │                                                        ▼
   │                                          active subscription
   ▼
feed unlocks creator posts; messages; bookmarks; notifications; settings
```

Exit points: `/logout`. Settings hubs cover profile, account, security (password, 2FA),
privacy, preferences and billing (payment methods, transactions).

## 3. Creator journey

```
/auth/creator/register ─▶ email verification ─▶ /creator/onboarding/*
  ├── avatar & banner ─▶ profile ─▶ subscription pricing ─▶ identity verification ─▶ payout details ─▶ complete
  ▼
/creator  (dashboard: revenue, subscriptions, activity, growth)
   │   content (draft/schedule/publish/edit/delete)
   │   media library
   │   subscribers ─▶ view/note
   │   earnings / transactions
   │   payouts ─▶ request payout ─▶ admin approves ─▶ paid history
   ▼
messages, notifications, requests, settings (profile, pricing, tax, payout method, security)
```

Verification gating: a creator whose identity verification is not **approved** may
continue building their profile but publishing to public may be limited until approved.

## 4. Admin journey

```
/admin/login (provisioned credentials)
   ▼
/admin (platform overview)
   ├── users            ─▶ detail: activity, subscriptions, transactions, reports
   ├── verification     ─▶ review documents ─▶ approve/reject ─▶ status syncs to creator
   ├── moderation       ─▶ review content ─▶ action (warn/remove/restrict/ban)
   ├── reports          ─▶ review evidence ─▶ resolve
   ├── payments/refunds ─▶ adjust/refund transactions
   ├── payouts          ─▶ approve/process ─▶ status syncs to creator payout history
   ├── support          ─▶ assign ─▶ converse ─▶ resolve
   └── settings         ─▶ roles/permissions/flags/audit/system health
```

## 5. Cross-cutting flows (end to end)

| Flow | Steps | Synchronized state |
|---|---|---|
| Subscribe | Explore ▶ profile ▶ checkout ▶ pay | `subscriptions`, `transactions`, creator revenue, feed unlocks |
| Create post | Draft ▶ (schedule) ▶ publish | Content list, feed, post analytics |
| Edit post | Edit ▶ save | Everywhere the post renders |
| Request payout | Creator request ▶ admin approval ▶ process | `payouts`, `earnings`, transaction history |
| Message creator | Composer ▶ send | `conversations`, `messages`, unread badges |
| Report content | Report ▶ review ▶ resolve | `reports`, moderation queue, user reports |
| Verify creator | Submit docs ▶ admin review | `identity_verifications`, creator verification status |

## 6. Error / safety flows

- **Email verification failed** → `/auth/:role/verification-failed` → retry/resend.
- **Reset password** → Supabase recovery email → `/auth/:role/reset-password` → login.
- **Payment failed** → subscription stays `pending`, user can retry checkout.
- **Suspended account** → role guards show account-disabled state and block the app.