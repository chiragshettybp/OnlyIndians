# Stitch Implementation

How OnlyIndians UI is generated in Stitch and mapped into the application.

## Stitch MCP workflow

1. **Inspect** the existing project and `/ui` page.
2. **Connect** to the Stitch MCP server.
3. **Fetch** the available OnlyIndians Stitch projects (`stitch_list_projects`).
4. **Select** the relevant project and read its screens (`stitch_get_project`,
   `stitch_list_screens`, `stitch_get_screen`).
5. **Download** design assets + generated HTML into `./stitch-designs`.
6. **Preserve** downloaded designs as the reference for implementation.
7. **Inspect** each screen's structure and extract the design system
   (`designTheme`): colors, typography, radius, spacing, elevation.
8. **Map** screens to modules/routes (see "Screen-to-route mapping" below).
9. **Implement** screens in the React app.
10. **Verify** the implementation matches the Stitch designs.

## Source-and-truth rule

- **Stitch is the UI source of truth** — reproduce layout, component arrangement,
  visual hierarchy, typography, spacing, colors, borders, radius, shadows as-is.
- **`docs/` and the product spec are the route/module source of truth**.
- Implemented UI = Stitch visuals + full functionality + separation.

## Project(s) fetched

| Project | Title | Kind | Relevance |
|---|---|---|---|
| `projects/9754911040729077009` | OnlyIndians Public Web Portal | TEXT_TO_UI_PRO, MOBILE, LIGHT | **Main source**; 56 screen instances |
| (23 projects listed in account) | Various | — | Not OnlyIndians (unrelated experiments) |

## Design system extracted

- **Name:** Cupertino Clarity (from project `designTheme.designMd`).
- **Colors:** full Material3-style light palette, primary `#004ac6`, canvas `#f9f9fe`.
- **Fonts:** Inter (headline/body/label), Apple-dynamic scale (34 → 11px).
- **Shape:** roundness ROUND_EIGHT; cards 16–20px; controls 10–12px; pills full.
- **Elevation:** 4-level system (canvas → cards → floating → modals) + frosted
  `blur(20px)` headers.
- Implemented in `tailwind.config.js` + `src/index.css`; style rules in
  `UI_UX_GUIDELINES.md`.

## Downloads in `./stitch-designs`

The following Stitch screens are preserved as reference HTML files (filenames match
their Stitch titles):

```
001_OnlyIndians - Home (iOS Native).html
002_OnlyIndians - Pricing (iOS Native).html
003_Creator Logout (iOS Native).html
004_Subscriber Onboarding - Username (iOS Native).html
005_Creator Onboarding - Avatar & Banner (iOS Native).html
006_Subscriber Forgot Password.html
007_Creator Onboarding - Subscription Pricing (iOS Native).html
008_Subscriber Onboarding - Profile Setup (iOS Native).html
009_Creator Reset Password (iOS Native).html
010_Subscriber Email Verification.html
011_Subscriber Onboarding - Complete (iOS Native).html
012_Subscriber Onboarding - Avatar (iOS Native).html
013_Subscriber Verification Success.html
014_Creator Onboarding - Identity Verification.html
015_Creator Forgot Password (iOS Native).html
016_OnlyIndians - Platform Status (iOS Native).html
017_Subscriber Login.html
018_Creator Studio Login (iOS Native).html
019_Subscriber Onboarding - Preferences (iOS Native).html
020_Subscriber Onboarding - Interests (iOS Native).html
021_Subscriber Logout (iOS Native).html
022_Subscriber Onboarding - Skip (iOS Native).html
023_Subscriber Verification Failed (iOS Native).html
024_OnlyIndians - How It Works (iOS Native).html
025_Subscriber Registration (iOS Native).html
026_Subscriber Forgot Password (iOS Native).html
027_Creator Onboarding - Profile Setup.html
029_Creator Verification Failed (iOS Native).html
030_Subscriber Reset Password.html
033_Creator Onboarding - Payout Details.html
034_Subscriber Forgot Password (iOS Native).html
035_Creator Email Verification (iOS Native).html
036_Creator Verification Success (iOS Native).html
037_Creator Studio Registration (iOS Native).html
```

## Screen-to-route mapping

| Stitch screen | Module | Route(s) |
|---|---|---|
| OnlyIndians - Home | Public | `/` |
| OnlyIndians - Pricing | Public | `/pricing` |
| OnlyIndians - How It Works | Public | `/how-it-works` |
| OnlyIndians - Platform Status | Public | `/status` |
| Subscriber Registration | Auth | `/auth/subscriber/register` |
| Subscriber Login | Auth | `/auth/subscriber/login` |
| Subscriber Forgot Password | Auth | `/auth/subscriber/forgot-password` |
| Subscriber Reset Password | Auth | `/auth/subscriber/reset-password` |
| Subscriber Email Verification | Auth | `/auth/subscriber/verify-email` |
| Subscriber Verification Success/Failed | Auth | `/auth/subscriber/verification-success|failed` |
| Subscriber Logout | Auth | `/logout` |
| Creator Studio Registration | Auth | `/auth/creator/register` |
| Creator Studio Login | Auth | `/auth/creator/login` |
| Creator Forgot/Reset Password | Auth | `/auth/creator/forgot|reset-password` |
| Creator Email Verification | Auth | `/auth/creator/verify-email` |
| Creator Verification Success/Failed | Auth | `/auth/creator/verification-success|failed` |
| Creator Logout | Auth | `/logout` |
| Subscriber Onboarding: Username | Subscriber | `/subscriber/onboarding/userflow` |
| Subscriber Onboarding: Avatar | Subscriber | `/subscriber/onboarding/avatar` |
| Subscriber Onboarding: Profile Setup | Subscriber | `/subscriber/onboarding/profile` |
| Subscriber Onboarding: Interests | Subscriber | `/subscriber/onboarding/interests` |
| Subscriber Onboarding: Preferences | Subscriber | `/subscriber/onboarding/preferences` |
| Subscriber Onboarding: Complete (+ Skip) | Subscriber | `/subscriber/onboarding/complete` |
| Creator Onboarding: Avatar & Banner | Creator | `/creator/onboarding/avatar-banner` |
| Creator Onboarding: Profile Setup | Creator | `/creator/onboarding/profile` |
| Creator Onboarding: Subscription Pricing | Creator | `/creator/onboarding/pricing` |
| Creator Onboarding: Identity Verification | Creator | `/creator/onboarding/identity` |
| Creator Onboarding: Payout Details | Creator | `/creator/onboarding/payouts` |

## Component mapping

| Stitch pattern | Shared component |
|---|---|
| Inset-grouped lists / cards | `Card`, `FormSection` |
| Segmented control | `SegmentedControl` |
| iOS switch | `Toggle` |
| Pill badges | `Badge` |
| Input with clear + focus ring | `Input` |
| Buttons (primary/secondary/ghost) | `Button` |
| Frosted top bar + collapsing large title | `Header`, `PageHeader` |
| Creator cards / profiles | `CreatorCard`, `CreatorProfileHeader` |
| Locked content preview | `LockedPreview`, `PostCard` |

## Implementation status

| Area | Status |
|---|---|
| Docs (16 files) | ✅ Created |
| Stitch designs fetched & preserved | ✅ In `./stitch-designs` |
| Design tokens in Tailwind/index.css | ✅ |
| Public + auth + pipelines | 🚧 Pending app implementation |

Deviations are recorded here as they occur; goal is zero visual deviations from Stitch.

## Reusing Stitch outputs

Generated HTML files are reference mockups only. Tailwind classes, static images, and
inline data are **not** copied into the app; the React components re-implement the
*design* and connect it to real data. Where a component in Stitch needs behavior
(forms, modals, tabs), the shared UI kit implements it once and all screens reuse it.