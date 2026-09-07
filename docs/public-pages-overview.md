# Public Pages — Overview

## Application purpose
OnlyIndians is an India-only creator-subscription platform. Creators (Indian residents who pass identity verification) publish content; subscribers (anyone with an Indian `+91` number) pay recurring monthly fees to creators and get direct access.

## Purpose of the public pages
Inform, reassure, and convert visitors:
- Learn what the platform is and how subscriptions work.
- Understand the separate subscriber/creator journeys.
- Review transparent pricing principles.
- Read legal & safety policies.
- Contact support, browse help and FAQ.
- Check platform status.
All public pages are unauthenticated and served through the shared `MarketingLayout`.

## Target users
- Curious visitors (India).
- Prospective subscribers.
- Prospective creators.
- Existing users looking for help/support/policy pages.

## Public vs protected routes
| Area | Protection |
|---|---|
| `/`, `/about`, `/how-it-works`, `/pricing`, `/terms`, `/privacy`, `/community-guidelines`, `/contact`, `/help`, `/faq`, `/status` | Public — free to browse, `MarketingLayout` |
| `/subscriber/*`, `/creator/*`, `/admin/*` (including onboarding and all dashboards) | Protected — `RequireRole` + `RequireOnboarding`, RLS-backed |
| `/auth/*` (login/register/verify) | Public entry points (UI out of scope for this module) |

## Subscriber and creator entry points
Every page links to both portals:
- Subscriber: `/auth/subscriber/register`, `/auth/subscriber/login`.
- Creator: `/auth/creator/register`, `/auth/creator/login`.
Header CTAs: **Sign In** (subscriber login) and **Get Started** (subscriber register).

## India-only phone-number requirement
- Phone (`+91`) is the **primary account identifier**.
- India is the only country option; the `+91` prefix is fixed; no country selector.
- No international phone support.
- **No phone-number verification.** Verified via email only.

## Email verification requirement
- Email is **compulsory** at registration.
- Used exclusively for email verification and account-related communication.
- All public copy (FAQ/help/privacy) states: email verification, no phone OTP.