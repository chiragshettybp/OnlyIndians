# Public Pages — Unresolved Items

Items that cannot be fully completed in this module, with status.

| # | Item | Blocker | Impact | Disposition |
|---|---|---|---|---|
| 1 | **Approved legal text** (Terms/Privacy) | No approved legal copy from product/legal | Pages ship with `<!-- legal-review -->` placeholders | Documented; must be replaced before public launch |
| 2 | **Live system-status monitoring** | No monitoring/incident backend exists | `/status` figures are Stitch design values, labeled "monitoring pending"; no incident history | Approval (D2) granted: Stitch UI + pending label. Future: wire a status API |
| 3 | **Contact spam/rate limiting** | No rate-limit infrastructure | Honeypot + server-side validation only | Deferred; documented |
| 4 | **Creator discovery (`/discover`)** | Out of this module's scope (list not included in brief) | Home "discover creators" link lands on a placeholder page | Recorded; build in discovery module |
| 5 | **Public creator profiles (`/@:username`)** | Out of scope | Placeholder until creator module | Recorded |
| 6 | **Auth page UI** | Auth module not built | Register/login CTAs lead to correctly-routed placeholder screens | Recorded; links are correct |
| 7 | **FAQ answers needing product confirmation** | Product owner not available | Answers follow the brief + auth rules; flagged in `public-pages-content.md` | Reviewed and kept within documented rules |
| 8 | **Status "monitoring pending" wording** | Needs product sign-off on disclosure | Wording chosen conservatively | Can be adjusted after review |
| 9 | **Vitest "Unknown variable dynamic import" stderr** | Registry lazy-imports not-yet-built auth/admin pages by template literal | Vitest prints resolve warnings when tests navigate onto those placeholders; assertions still pass (path-shape only) | Noise only; `vite build` resolves every chunk correctly |

## Could not be completed because
- Missing backend tables: none — contact backend was created.
- Missing credentials: none (anon key present).
- Missing design-system component: **Accordion** — created (was the only gap).

## Resolved during delivery (not unresolved anymore)
- **No ESLint configuration existed** in the repo → created `.eslintrc.cjs` (`eslint:recommended` + `react`/`react-hooks`) and fixed the 14 surfaced issues; `npm run lint` is clean.
- **jsdom gaps** (`window.scrollTo`, `Element.scrollIntoView`) → guarded in FAQ and stubbed in `src/test/setup.js`.
- **Contact a11y**: inputs had no `id`, so `<label htmlFor>` had no control → all fields wired with `id` (caught by the a11y-focused tests).
- **Auth-copy contradiction**: Home trust pillar "Strict +91 Phone Verification" and FAQ "Is phone verification required?" contradicted the no-SMS-OTP auth design → copy reworded; the "no phone-verification claim" audit now passes across all scanned pages.