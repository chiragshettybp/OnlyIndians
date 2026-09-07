# Public Pages — Test Plan

Harness: **Vitest** + **@testing-library/react** (jsdom). Component-level tests render routes/pages inside `MemoryRouter`. Live backend verification is performed separately against the linked Supabase project.

## Test cases
| ID | Area | Test | Precondition | Steps | Expected |
|---|---|---|---|---|---|
| T1 | Routes | All 11 public routes render | build OK | visit each path in MemoryRouter | page heading present; no crash |
| T2 | Nav | Marketing nav active state | at `/pricing` | assert link classes | `pricing` tab active |
| T3 | Nav | Login/Register links | home | assert hrefs | `/auth/subscriber/login`, `/auth/subscriber/register` |
| T4 | Contact | Required-field validation | empty form | submit | focuses/errors on name, email, subject, message |
| T5 | Contact | Email validation | invalid email | submit | email error shown |
| T6 | Contact | Successful submit | valid form | submit (RPC mocked) | success state shown; form cleared |
| T7 | Contact | Failure state | RPC rejects | submit | error state with retry |
| T8 | FAQ | Accordion toggle + ARIA | FAQ page | click item | `aria-expanded` toggles; panel content shown |
| T9 | FAQ | Deep-link hash | `/#/faq#payments` | render | matching item auto-expanded |
| T10 | Help | Category filter | Help page | type "payment" | only matching categories shown; empty-filter message when none |
| T11 | Auth copy | No phone-verification claims | all public pages | scan copy | no "phone verification" phrase |
| T12 | Routes | Invalid path | unknown path | render | `NotFound` |
| T13 | Redirect | `/guidelines` | visit | render | redirected to `/community-guidelines` |
| T14 | Backend | RPC `submit_contact_ticket` | linked DB | call via anon client | returns ticket id; row persisted |
| T15 | Backend | RLS blocks anon reads | linked DB | anon `select *` on `support_tickets` | error (no rows) |
| T16 | A11y | FAQ keyboard | FAQ page | focus item, press Enter/Space/ArrowUp | toggles / moves focus correctly |

## Execution record
Results recorded in `public-pages-test-results.md`. T14/T15 executed live via the Supabase CLI/anon client.