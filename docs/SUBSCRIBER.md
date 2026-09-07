# Subscriber Experience

Entry: `/auth/subscriber/register` → onboarding → `/subscriber`.

## Onboarding (per Stitch)

| Step | Route | Functionality |
|---|---|---|
| Username | `/subscriber/onboarding/userflow` | Unique handle picker with availability check |
| Avatar | `/subscriber/onboarding/avatar` | Upload avatar to storage; preview |
| Profile | `/subscriber/onboarding/profile` | Display name, bio, visibility |
| Interests | `/subscriber/onboarding/interests` | Multi-select interest tags → powers feed/explore recommendations |
| Preferences | `/subscriber/onboarding/preferences` | Notification & content preferences |
| Complete | `/subscriber/onboarding/complete` | Confetti/summary → enter feed |

Onboarding sets `profiles.onboarded=true`; until then the app redirects to onboarding.

## Home & feed

- `/subscriber` — personalized feed of creators the user subscribes to, newest first,
  with locked content previews for non-subscribed creators.
- Infinite scroll pagination.
- Post interactions: like, bookmark (Saved), share, report.

## Explore & discover

- `/subscriber/explore` — category rails + "trending creators" + recommendations based
  on the user's interests.
- `/subscriber/search` — search creators and posts; filters by category, price, sort.

## Creator profiles (subscriber view)

- `/subscriber/c/:username` — banner/avatar/stats, subscription plan, locked content
  previews, subscribe CTA, message button when subscribed.

## Posts & media

- `/subscriber/posts/:id` — post detail, media viewer (image/video), comments, actions.
- Locked/unlocked states driven by an active subscription.

## Subs & monetization

- `/subscriber/subscriptions` — list of active subscriptions, renew dates, manage
  (cancel / re-subscribe, billing history).
- `/subscriber/checkout/:creatorId` — plan summary, payment method, pay; creates a
  `transaction` + `subscription`, unlocks content, updates creator revenue.
- Payment states: `pending`, `paid`, `failed`, `refunded`.

## Communication

- `/subscriber/messages` — conversation list.
- `/subscriber/messages/:id` — chat with a creator (only with creators the user has an
  active subscription to, or who initiated).
- `/subscriber/notifications` — notifications grouped by type; supports read/unread and
  preferences.

## Account

- `/subscriber/settings` — hubs for Profile, Account, Security (password, 2FA), Privacy,
  Billing (payment methods, transaction history), Preferences.
- `/logout` — full sign out; clear local session.

## Synchronization rules

- Subscribing updates: `subscriptions`, `transactions`, feed unlocks, creator revenue.
- Editing profile updates every place the profile renders.
- Bookmarking updates `/subscriber/saved` immediately.
- Notifications reflect real events (new post from subscription, reply, message).