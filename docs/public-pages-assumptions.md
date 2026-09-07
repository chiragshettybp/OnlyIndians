# Public Pages — Assumptions

Recorded to keep future work consistent.

1. **Legal copy is not yet approved.** Terms/Privacy use clearly marked placeholder body text (`<!-- legal-review -->`). Final legal review required before public launch.
2. **Pricing is static and informational.** No pricing table exists in Supabase. The page explains pricing principles (creator-controlled, ₹99–₹9,999, recurring) using product facts; it does **not** display fake creator plans, prices, or discounts. If creator profile pricing becomes available, the page should read from `creator_profiles.subscription_price`.
3. **Contact support workflow now exists (this module).** Contact submissions go to real Supabase tables (`support_tickets`, `ticket_messages`) via the `submit_contact_ticket` RPC. No anonymous table access.
4. **Status monitoring does not yet exist.** The status page renders the Stitch-designed structure; operational figures are design-time values and are explicitly labeled "monitoring pending". No uptime claims are asserted.
5. **Public creator discovery is not implemented.** `/discover` and `/@:username` are routed but outside this module. Home links to `/discover` as required by the module brief.
6. **Auth pages are placeholders.** `/auth/*` routes exist; their UI is a separate module. All CTAs/links point to correct routes.
7. **Registration role choice.** Subscriber vs Creator is selected during signup and fixed thereafter (no switching).
8. **Email-only verification.** No phone OTP anywhere in public copy.
9. **Honeypot is the shipped spam guard** (plus server-side validation in the RPC). Server-side rate limiting is deferred.
10. **Mobile-first.** Visual target is iOS-native Stitch; desktop is a widened version of the same layout (max-width containers).