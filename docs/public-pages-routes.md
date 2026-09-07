# Public Pages — Routes

All routes live in the public `MarketingLayout` shell (`src/App.jsx`), rendered through `src/pages/Page.jsx` + `src/router/registry.jsx`.

| Route | Page purpose | Public | Navigation entry | Related | Required data | Actions | Loading | Empty | Error |
|---|---|---|---|---|---|---|---|---|---|
| `/` Home | Landing, intro, entry points, trust | ✅ | Logo, bottom Home | pricing, about, discover, auth | static constants | links to discover/auth/pricing | n/a (static) | n/a | n/a |
| `/about` | Mission, principles, who it's for | ✅ | footer | guidelines, contact | static constants | links | n/a | n/a | n/a |
| `/how-it-works` | Dual subscriber/creator journeys | ✅ | Header nav | pricing, auth | static | links to register/login | n/a | n/a | n/a |
| `/pricing` | Transparent pricing principles | ✅ | Header nav | faq, help, auth | static product facts | links | n/a | n/a | n/a |
| `/terms` | Terms of Service | ✅ | footer | privacy, contact | static (legal placeholder) | none | n/a | n/a | n/a |
| `/privacy` | Privacy Policy | ✅ | footer | terms, contact | static (legal placeholder) | none | n/a | n/a | n/a |
| `/community-guidelines` | Content/safety rules | ✅ | footer, about | contact | static | links to contact | n/a | n/a | n/a |
| `/contact` | Submit support ticket | ✅ | header (help) footer | help, faq | **Supabase RPC** | form submit → `submit_contact_ticket` | submit button spinner | n/a | failure banner + retry |
| `/help` | Help-center categories | ✅ | Header + bottom "Help" | faq, contact | static categories | category filter, links | n/a | filtered-empty state | n/a |
| `/faq` | Grouped Q&A | ✅ | help, pricing | help, contact | static Q&A | accordion toggle, deep-link anchors | n/a | n/a | n/a |
| `/status` | Platform status | ✅ | footer (Status) | faq | static Stitch structure + "monitoring pending" | none | n/a | n/a | n/a |

## Redirects
- `/guidelines` → `/community-guidelines` (legacy path, keep working).
- Unknown paths → `NotFound`.

## Out of scope (already routed, not built here)
- `/discover` (creator discovery), `/@:username` (public profile) — see `public-pages-unresolved-items.md`.