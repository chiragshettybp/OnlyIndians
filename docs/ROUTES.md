# Routes

Route architecture organized by phase and account type. Route guards ensure each
experience is only reachable by the matching role.

## Public website — `MarketingLayout`

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Marketing home + public creator highlights |
| `/about` | About | Company story |
| `/how-it-works` | How It Works | Subscriber + creator explainer |
| `/pricing` | Pricing | Subscription fee/pricing tiers (per Stitch) |
| `/discover` | Discover | Browse creators by category |
| `/search` | Search | Global creator/content search |
| `/c/:username` | Creator Public Profile | Public profile + locked previews; also `/creator/:username` |
| `/status` | Platform Status | System status page (per Stitch) |
| `/terms` | Terms of Service | Legal |
| `/privacy` | Privacy Policy | Legal |
| `/community-guidelines` | Community Guidelines | Platform rules (canonical; `/guidelines` redirects here) |
| `/guidelines` | → redirect | Legacy alias → `/community-guidelines` |
| `/contact` | Contact | Contact form |
| `/help` | Help | Help center hub |
| `/faq` | FAQ | Frequently asked questions |

## Authentication — `AuthLayout`

| Route | Page | Notes |
|---|---|---|
| `/auth` | Account type selection | Shared flow: choose Subscriber or Creator; Admin is platform-provisioned at `/admin/login` |
| `/auth/:role/login` | Login | `role` = `subscriber` or `creator` |
| `/auth/:role/register` | Registration | Creates Supabase user; writes `profiles` row with role + `onboarded=false` |
| `/auth/:role/forgot-password` | Forgot password | Sends Supabase reset email |
| `/auth/:role/reset-password` | Reset password | Handles recovery token |
| `/auth/:role/verify-email` | Email verification | Shows verification state / resend |
| `/auth/:role/verification-success` | Verification success | Per Stitch |
| `/auth/:role/verification-failed` | Verification failed | Per Stitch |
| `/logout` | Logout | Signs out the active session |

## Subscriber pipeline — `DashboardLayout(role=subscriber)`

### Onboarding
| Route | Step |
|---|---|
| `/subscriber/onboarding/userflow` | Home of onboarding: username / handle |
| `/subscriber/onboarding/avatar` | Avatar upload |
| `/subscriber/onboarding/profile` | Profile setup (name, bio, display) |
| `/subscriber/onboarding/interests` | Interest selection |
| `/subscriber/onboarding/preferences` | Notification/content preferences |
| `/subscriber/onboarding/complete` | Roadmap / complete → redirects to feed |

### App
| Route | Page |
|---|---|
| `/subscriber` | Home — personalized feed |
| `/subscriber/explore` | Explore creators |
| `/subscriber/search` | Search |
| `/subscriber/c/:username` | Creator profile (subscriber view) |
| `/subscriber/posts/:id` | Post detail / media viewer |
| `/subscriber/saved` | Bookmarks |
| `/subscriber/subscriptions` | My subscriptions + management |
| `/subscriber/checkout/:creatorId` | Checkout & payment |
| `/subscriber/messages` | Message list |
| `/subscriber/messages/:conversationId` | Conversation |
| `/subscriber/notifications` | Notifications |
| `/subscriber/requests` | Support/verification requests |
| `/subscriber/settings` | Settings hub (profile / account / security / privacy / billing) |

## Creator pipeline — `DashboardLayout(role=creator)`

### Onboarding
| Route | Step |
|---|---|
| `/creator/onboarding/avatar-banner` | Avatar & banner upload (per Stitch) |
| `/creator/onboarding/profile` | Profile setup (per Stitch) |
| `/creator/onboarding/pricing` | Subscription pricing (per Stitch) |
| `/creator/onboarding/identity` | Identity verification (per Stitch) |
| `/creator/onboarding/payouts` | Payout details (per Stitch) |
| `/creator/onboarding/complete` | Roadmap / complete |

### App
| Route | Page |
|---|---|
| `/creator` | Dashboard (overview stats + analytics) |
| `/creator/content` | Content management table |
| `/creator/content/new` | Post composer |
| `/creator/content/:id/edit` | Post editor |
| `/creator/content/:id` | Post preview/analytics |
| `/creator/media` | Media library |
| `/creator/subscribers` | Subscriber management |
| `/creator/earnings` | Earnings + transactions |
| `/creator/payouts` | Payouts (request/history) |
| `/creator/messages` | Message list |
| `/creator/messages/:conversationId` | Conversation |
| `/creator/notifications` | Notifications |
| `/creator/requests` | Requests |
| `/creator/settings` | Settings hub (profile/pricing/tax/payout method/security) |

## Admin pipeline — `DashboardLayout(role=admin)`

| Route | Page |
|---|---|
| `/admin/login` | Admin authentication |
| `/admin` | Dashboard (platform overview + analytics) |
| `/admin/users` | User management |
| `/admin/users/:id` | User profile detail |
| `/admin/verification` | Creator verification queue |
| `/admin/verification/:id` | Verification review + documents |
| `/admin/moderation` | Content moderation queue |
| `/admin/moderation/:id` | Review panel |
| `/admin/reports` | Reports & safety |
| `/admin/reports/:id` | Report details + evidence |
| `/admin/payments` | Payment oversight/refunds |
| `/admin/payouts` | Payout management |
| `/admin/support` | Support ticket queue |
| `/admin/support/:id` | Ticket conversation |
| `/admin/settings` | Platform settings, roles, flags, audit, system health |

## Route conventions

- Role-specific routes are guarded by `RequireRole` wrappers that redirect the wrong
  role to `/auth` (unauthenticated) or to their own `/` shell (wrong role).
- Public creator profiles normalize `/c/:username` and `/creator/:username` to one
  component so marketing and subscriber views share data.
- Unknown paths → `NotFound` page.