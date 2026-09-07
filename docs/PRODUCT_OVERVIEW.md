# Product Overview

## What OnlyIndians is

OnlyIndians is a creator-subscription platform built for Indian creators and their
subscribers. It gives creators a direct, owned relationship with their audience and
gives subscribers a safe, curated way to follow and support the creators they love.

## Purpose

There is no single home for Indian creators to monetize and manage their presence while
keeping full control of their community, content, and earnings. OnlyIndians fills that
gap:

- **For creators:** publish content, sell subscriptions, communicate with fans, and
  manage a creator business — analytics, earnings, payouts — in one platform.
- **For subscribers:** discover creators, explore content, subscribe, manage payments,
  and message creators from a single account.
- **For the platform:** a trusted, moderated marketplace — verified creators, safe
  content, and reliable payments.

## Target users

1. **Subscribers** — people who want to follow creators, access exclusive content, and
   financially support them.
2. **Creators** — Indian creators across niches (fitness, fashion, cooking, comedy,
   art, education, lifestyle) who publish media and sell subscriptions.
3. **Admins** — internal platform operators responsible for users, verification,
   moderation, reports, payments, payouts, support, and system health.

## Core capabilities

### For Subscribers
- Personalized home feed of subscribed creators
- Explore, search, and discover creators by category/interests
- Public creator profiles with locked-content previews
- Paid subscriptions, checkout, payment history, and subscription management
- Direct messaging with creators
- Bookmarks ("Saved"), notifications, preferences, requests, and full account settings

### For Creators
- Onboarding: avatar & banner, profile, subscription pricing, identity verification, payout details
- Dashboard with overview stats and analytics (revenue, growth, activity)
- Content management: draft, schedule, publish, edit, delete; per-post analytics
- Media library and uploads
- Earnings and transaction history
- Payout requests and history
- Subscriber management (table, profiles, activity, notes)
- Messaging, notifications, requests, and creator settings

### For Admins
- Admin authentication and dashboard
- Platform-wide analytics
- User management (filters, profiles, activity, subscriptions, transactions, reports)
- Creator verification queue with document review
- Content moderation queue
- Reports and safety
- Payment and payout oversight, refunds
- Support tickets
- Platform settings, roles, permissions, audits, and system health

## Product boundaries

- OnlyIndians operates as a **subscription-creator platform**. It does not sell
  advertising, run auctions, or function as a general social network feed.
- Subscriber, creator, and admin experiences are strictly separated and never combined
  into one dashboard (see `ACCOUNT_SEPARATION.md`).
- The public website (home, pricing, how it works, discover, status, legal) exists to
  drive registration and conversion; it never exposes subscriber/creator/admin tooling.
- Payments and payouts are platform-managed; creators cannot see other creators'
  financial data, and subscribers cannot see creator earnings.
- Platform-generated revenue comes from a service fee on subscriptions and/or payouts
  (pricing defined in checkout rules).

## Account types

Every user is exactly one of:

| Role | Selected at | Entry point |
|------|-------------|-------------|
| Subscriber | Registration | `/auth/subscriber/register` |
| Creator | Registration | `/auth/creator/register` |
| Admin | Provisioned by platform | `/admin/login` (not publicly registerable) |

After registration each role enters its own onboarding pipeline and then its own
application shell.