# Creator Experience

Entry: `/auth/creator/register` → onboarding → `/creator`.

## Onboarding (per Stitch)

| Step | Route | Functionality |
|---|---|---|
| Avatar & banner | `/creator/onboarding/avatar-banner` | Upload both; live preview on profile mock |
| Profile setup | `/creator/onboarding/profile` | Display name, username, bio, category, location, link |
| Subscription pricing | `/creator/onboarding/pricing` | Monthly price, free-trial days, discount rules |
| Identity verification | `/creator/onboarding/identity` | Upload Government ID + selfie; submit to verification queue |
| Payout details | `/creator/onboarding/payouts` | Payout method (bank/UPI), account details |
| Complete | `/creator/onboarding/complete` | Roadmap → dashboard |

Publishing content publicly requires **approved** identity verification; pending
verification limits visibility.

## Dashboard `/creator`

- Overview stats: revenue, subscribers, content, engagement.
- Analytics: revenue chart, subscriber growth, activity feed, growth metrics.
- Quick actions: new post, new media, request payout.

## Content management `/creator/content*`

- Table of posts: status (`draft`, `scheduled`, `published`, `archived`), filters, sort.
- Composer (`/creator/content/new`) and editor (`/creator/content/:id/edit`):
  caption, media, visibility (`public`/`subscribers`), price-for-pay, scheduling.
- Per-post analytics and preview (`/creator/content/:id`).
- Editing updates the post everywhere it is rendered; deleting removes it from feeds.

## Media library `/creator/media`

- Upload files to storage, organize in grid, preview, view usage per post.

## Subscribers `/creator/subscribers`

- Table of active/cancelled subscribers: profile, plan, since, renew date, activity.
- Per-subscriber notes.

## Earnings & payouts

- `/creator/earnings` — revenue breakdown (subscriptions, tips), transaction history,
  earnings statements, tax summary.
- `/creator/payouts` — balance, request payout, payout history/details/status
  (`requested` → `approved` → `processing` → `paid`). Status syncs from admin actions.

## Communication

- `/creator/messages` + `/creator/messages/:id` — conversations with subscribers.
- `/creator/notifications` — new subscriber, expired sub, payout updates, etc.
- `/creator/requests` — pending support/verification requests.

## Settings `/creator/settings`

Profile editor, pricing editor (price/free trial/discounts), verification status,
payout method, tax settings, security (password, 2FA), notifications.

## Synchronization rules

- Creating/publishing a post updates content list, public feed, subscriber feeds, stats.
- Subscriber joins feed the creator's subscriber count and revenue analytics.
- Approved payout updates `payouts`, `earnings` balance, and notifications.
- Profile changes propagate to public and subscriber-facing views.