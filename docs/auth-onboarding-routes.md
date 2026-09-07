# Auth & Onboarding Module — Routes

All routes render through the existing `Page name` → `registry.jsx` lazy loader. Old behavior retained where noted.

## Public (unchanged)
`/`, `/discover`, `/how-it-works`, `/pricing`, `/help`, `/faq`, `/about`, `/status`, `/contact`, `/terms`, `/privacy`, `/community-guidelines`, `/@:username`. Marketing header "Sign In" / "Get Started" buttons retarget via updated `ROLES` constants.

## Auth (new — replaces the `/auth/*` block)
All inside the shared `<AuthLayout />` shell (back, logo, help, legal footer).

| Path | Page | Guard | Notes |
|---|---|---|---|
| `/subscriber/login` | `SubscriberLogin` | GuestOnly(subscriber) | Phone-first (phone ↔ email resolver) |
| `/subscriber/register` | `SubscriberRegister` | GuestOnly(subscriber) | +91 + email + password |
| `/subscriber/forgot-password` | `ForgotPassword` | GuestOnly | role param in copy / redirect |
| `/subscriber/reset-password` | `ResetPassword` | none (token via URL) | PKCE `token_hash&type=recovery` |
| `/subscriber/check-email` | `CheckEmail` | none | resend with cooldown countdown |
| `/creator/login` | `CreatorLogin` | GuestOnly(creator) | Phone-first |
| `/creator/register` | `CreatorRegister` | GuestOnly(creator) | +91 + email + password |
| `/creator/forgot-password` | `ForgotPassword` | GuestOnly | |
| `/creator/reset-password` | `ResetPassword` | none | |
| `/creator/check-email` | `CheckEmail` | none | |

## Shared verify / logout
| Path | Page | Guard | Notes |
|---|---|---|---|
| `/verify` | `VerifyEmail` | none | Reads `token_hash&type=email`/recovery; auto-confirms via `verifyOtp`; on success → `/verify/success` |
| `/verify/success` | `VerificationSuccess` | none | Then auto-redirect into role onboarding |
| `/verify/failed` | `VerificationFailed` | none | invalid / expired / already-used token; resend CTA |
| `/subscriber/logout` | `Logout` | RequireRole(subscriber) | signs out → `/subscriber/login` |
| `/creator/logout` | `Logout` | RequireRole(creator) | signs out → `/creator/login` |

## Onboarding (paths unchanged; gating tightened)
| Path | Page | Role | Notes |
|---|---|---|---|
| `/subscriber/onboarding/profile` | `OnboardingProfile` | sub | email already verified (guard) |
| `/subscriber/onboarding/avatar` | `OnboardingAvatar` | sub | upload → private `avatars` |
| `/subscriber/onboarding/preferences` | `OnboardingPreferences` | sub | languages + notification prefs |
| `/subscriber/onboarding/interests` | `OnboardingInterests` | sub | multi-select interests |
| `/subscriber/onboarding/userflow` | `OnboardingUsername` | sub | claim @username (unique) |
| `/subscriber/onboarding/complete` | `OnboardingComplete` | sub | final upsert → `onboarded=true` → dashboard |
| `/creator/onboarding/profile` | `CreatorOnboardingProfile` | cr | category, discipline, blurb |
| `/creator/onboarding/avatar-banner` | `CreatorOnboardingVisual` | cr | uploads → private `avatars`/`banners` |
| `/creator/onboarding/identity` | `CreatorOnboardingIdentity` | cr | KYC docs → private `documents`, status `pending` |
| `/creator/onboarding/payouts` | `CreatorOnboardingPayouts` | cr | bank fields captured (encrypted), provider TBD |
| `/creator/onboarding/pricing` | `CreatorOnboardingPricing` | cr | selects tier ₹99–9,999 |
| `/creator/onboarding/complete` | `CreatorOnboardingComplete` | cr | → `onboarded=true` → Studio |

## Dashboards (existing routes, unchanged; still placeholder pages)
`/subscriber` … `/subscriber/settings/payments`; `/creator` … `/creator/settings`.

## Guard mapping
- **GuestOnly(role)**: logged-in users → redirect to their role home (`ROLES[role].homePath`).
- **RequireRole(role)** (extended): no user → `loginRoute`; wrong role → own role home; email unverified → `/verify`; onboarding incomplete → `onboardingFirst`.
- **RequireOnboarding(role)**: dashboard gate → `onboardingFirst`.
- Guards must run at the tree level (parent Route wrappers), never trusted in-page navigation.

## Legacy redirects (removed paths → new)
`/auth/subscriber/login`→`/subscriber/login`, `/auth/subscriber/register`→`/subscriber/register`, `/auth/creator/login`→`/creator/login`, `/auth/creator/register`→`/creator/register`, `/auth/forgot-password`→`/`, `/auth/:role/verify`→`/verify`, `/auth/verification-success`→`/verify/success`, `/auth/verification-failed`→`/verify/failed`, `/auth/logout`→`/`.