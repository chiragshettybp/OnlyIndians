# Public Pages — Test Results

Status: **PASS — 33/33 Vitest tests green; backend verified live.**
Run with `npm run test` (Vitest + Testing Library, jsdom). Backend checks executed live against the linked Supabase project.

| ID | Route/Area | Preconditions | Expected | Actual | Pass | Fix applied | Retest |
|---|---|---|---|---|---|---|---|
| T1 | Routes | build OK | all 11 public routes render | all 11 render (`/home` submenu covered by `/`) | YES | `/about` needle was an HTML-entity string + curly apostrophe and only matched a substring — replaced with an exact `/india's creator economy/i` regex | PASS |
| T2 | Nav | at `/pricing` | Pricing link active | active (`text-[#004ac6]` + `font-semibold`); Home inactive | YES | Multiple `banner` roles (page hero headers) → added `aria-label="Main"` to MarketingLayout header and scoped queries; logo `aria-label="OnlyIndians home"` collided with nav Home → exact link names | PASS |
| T3 | Nav | home | register/login navigate | header Sign In → `/auth/subscriber/login`; Get Started → `/auth/subscriber/register` | YES | Hero "Get Started" + header "Get Started" were both buttons → scoped clicks `within(header)` | PASS |
| T4 | Contact | empty form | field errors for name/email/subject/message | all four errors render; API not called | YES | Inputs lacked `id`, so labels were not associated (real a11y bug found by the test) → wired `id` on every Field/Input | PASS |
| T5 | Contact | invalid email | email error, no submit | `Please enter a valid email address.` | YES | test regex `/phone \(india/` missing `/i` flag (label is "Phone (India, +91)") | PASS |
| T6 | Contact | valid form, RPC mocked success | success state + `+91`-prefixed payload + honeypot silent | success with ticket ref; payload `+919876543210`; honeypot accepted without API call | YES | — | PASS |
| T7 | Contact | RPC rejects | error banner, form kept for retry; `INVALID_PHONE` friendly mapping | friendy error + enabled retry button | YES | `submitContact` was module-mocked so the friendly mapping never ran → mapping now unit-tested against the real function via a queueable RPC stub (`rpcQueue` in `src/test/setup.js`) | PASS |
| T8 | FAQ | FAQ page | `aria-expanded` toggle + panel reveals | toggles + reveals | YES | jsdom lacks `scrollIntoView` → guarded call | PASS |
| T9 | FAQ | deep-link hash | item auto-expands | deep-linked item expands | YES | — | PASS |
| T10 | Help | search "payment" | matching categories only; empty-filter message | filter + empty state render | YES | — | PASS |
| T11 | Auth copy | public pages | no "phone verification" claim | none found on `/`, `/how-it-works`, `/pricing`, `/faq`, `/status` | YES | Copy contradicted auth design: Home trust pillar "Strict +91 Phone Verification" and FAQ "Is phone verification required?" → rewritten to "Verified India-only accounts" / "Do I need to verify my phone number?" (no SMS OTP claimed) | PASS |
| T12 | Routes | unknown path | NotFound | 404 shown | YES | — | PASS |
| T13 | Redirect | `/guidelines` | redirect to `/community-guidelines` | redirects | YES | — | PASS |
| T14 | Backend | linked DB | RPC returns ticket, row persisted | RPC `submit_contact_ticket` returns a ticket UUID; row persists | YES | verified live (anon client) | PASS |
| T15 | Backend | linked DB | anon direct reads blocked | `select *` from `support_tickets` → `42501` RLS error; invalid input → `INVALID_NAME`; QA row cleaned up | YES | verified live | PASS |
| T16 | A11y | FAQ keyboard | Enter/Space toggle; arrows move focus | Accordion native `<button>` + keydown handling | YES | — | PASS |

## Notes
- Suites: `public-routes` (21), `contact` (7), `faq` (3), `help` (2) = 33 tests, all passing in jsdom.
- Test harness added: `vite.config.js` test block, `src/test/setup.js` (mock `@supabase/supabase-js` + `scrollTo`/`scrollIntoView` stubs), pinned deps in `package.json` (`vitest@^2.1.9`, `jsdom@^25.0.1`, `@testing-library/*`), scripts `test` / `test:watch`.
- `npm run build` and `npm run lint` (new `.eslintrc.cjs`) are clean.
- Navigation tests land on `/auth/subscriber/*` placeholders — the auth module UI is out of scope (see unresolved items).