# Public Pages Audit & Architecture Checklist: OnlyIndians

## 1. Application Overview
OnlyIndians is an India-exclusive creator subscription platform designed with Apple iOS design principles and HeroUI light tokens.
- **Authentication Core Rules**:
  - Only Indian phone numbers (+91) supported as primary account identifier.
  - India fixed by default; no international selectors.
  - No phone-number OTP verification; account verification is strictly via compulsory Email.
  - Distinct onboarding journeys for Subscribers vs. Creators.

## 2. Route Matrix
- `/` - Home / Landing (Platform intro, value prop, creator & subscriber entry points, trust & safety, iOS grouped cards)
- `/about` - About OnlyIndians (Mission, creator-economy focus in India, principles, team values)
- `/how-it-works` - Dual-journey visual flow (Subscriber journey vs Creator journey step-by-step)
- `/pricing` - Transparent, creator-controlled pricing principles & subscriber model
- `/terms` - Terms of Service with statutory placeholders pending final legal review
- `/privacy` - Privacy Policy (Phone primary ID, Email verification, no card retention)
- `/community-guidelines` - Content rules, safety, respect, harassment prohibitions
- `/contact` - Official support ticket form with realistic Supabase contact state handling
- `/help` - Help center categories & search/filter entry point
- `/faq` - Accessible grouped iOS accordion FAQ (General, Auth, Subscriber, Creator, Safety)
- `/status` - Live system status dashboard (Website, Auth, Database, Storage, Edge network)

## 3. Design System & Tokens
- **Theme**: Light Mode Only (`:root`, `.light`).
- **Accent**: `oklch(62.04% 0.1950 253.83)`
- **Background**: `oklch(97.02% 0.0015 253.83)`
- **Surface**: `oklch(100.00% 0.0008 253.83)`
- **Apple iOS Spacing**: Inset grouped cards (`rounded-2xl`, `p-4` / `p-5`), subtle dividers, SF/Inter typography hierarchy, iOS navigation bars with large title transitions.