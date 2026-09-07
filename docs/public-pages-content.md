# Public Pages — Content

All page copy derives from `src/lib/constants.js` (which mirrors the Stitch screens) plus literal sections below. Static content lives inline in each page component. No content DB table is used in this module.

## Page copy summary
- **Home**: hero `"India's Verified Creator Network"` + `"Empowering Indian Creators & Fans"`; platform facts (4,800+ verified creators, ₹0 listing fee, 88% net payout, T+1 daily INR settlements); What-is + how subscriptions work; subscriber/creator entry cards; trust pillars (Zero Ads, Direct Q&A, 1-Click Cancel; India-First trust: strict +91 verification, zero SMS OTP, RBI-tokenized UPI, Indian IT Rules 2021); concierge banner; CTAs → pricing/about/auth.
- **About**: mission (creator economy for Bharat), problem (middlemen/foreign platforms), who it's for, subscriber vs creator experience, principles, trust & safety commitment.
- **HowItWorks**: Subscriber pathway (Register → Choose Subscriber → Onboarding → Discover → Subscribe → Access exclusive content → Manage subscription) and Creator pathway (Register → Choose Creator → Onboarding → Verification → Set pricing → Publish content → Manage subscribers → Receive earnings). Callout: journeys are separate; onboarding is covered in a later module.
- **Pricing**: creator-controlled pricing (₹99–₹9,999/month), recurring subscription model, creator-specific plans, "final price shown before payment and after login", 88% net payout / 12% platform fee + auto GST/TDS, guarantees (₹0 platform fee for subscribers, 1-click cancel, UPI AutoPay & RuPay, 48h renewal alerts). No fake creator plans or discounts.
- **Status**: overall banner + 6 services (Auth +91 & Supabase; UPI AutoPay & Gateway; Creator CDN; Payout T+1; Database & Real-time; Email Verification) with SLA footer. **All figures labeled "design reference — live monitoring pending".**
- **FAQ / Help / Terms / Privacy / Guidelines**: see below.

## FAQ questions & answers (static, grouped)
- **General**: What is OnlyIndians? Who can use it? India-only? How does it work?
- **Account & Authentication**: register with phone? is email required? **is phone verification required? → No — verification is via email.** how is email verification handled (magic link / confirmation email)? choose subscriber/creator at registration? (yes — role chosen during signup, fixed thereafter)
- **Subscribers**: subscribing, how recurring subs work, cancellation (1-click, immediate at the end of the billing period), viewing transactions (in Subscriber portal), contacting a creator (direct Q&A / messaging).
- **Creators**: becoming a creator, why verification (RBI/IT Rules 2021 compliance, +91 + PAN), setting pricing, uploading content, payouts (T+1 daily INR, 88% net, GST/TDS auto).
- **Safety & Support**: reporting, blocking, what happens after a report, contacting support.

## Legal-content placeholders
Terms & Privacy sections are structurally complete but the legal body is placeholder text. Each placeholder is wrapped in `<!-- legal-review -->` markers and flagged in `public-pages-unresolved-items.md`. Required legal review.

## Content requiring approval
- Final Terms/Privacy legal text (approval: legal).
- Status "monitoring pending" disclosure wording (approval: product).

## Status-page data requirements
Source: `STATUS_SERVICES` / `STATUS_META` in `src/lib/constants.js` (from Stitch screen 016). No live feeds; `lastUpdated` uses the real render timestamp and the page displays a pending-monitoring notice.

## Contact-form requirements
Phone (+91, India only), Name, Email (required), Subject (required), Message (required). Validates, submits via `submit_contact_ticket` RPC, shows success/error, honeypot spam guard.