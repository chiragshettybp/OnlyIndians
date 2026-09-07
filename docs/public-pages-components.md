# Public Pages — Components

## Reused (existing, unchanged)
| Component | Used by | Responsibility |
|---|---|---|
| `MarketingLayout` | all pages | Header, nav, mobile bottom bar, footer, `<Outlet/>` |
| `Logo` | Home, About, layouts | Brand medallion + wordmark |
| `Button` (`primary/secondary/ghost/link`, sizes) | Home, Pricing, HowItWorks, Contact, FAQ CTA | CTA + form submit + loading spinner |
| `Badge` (tones) | Home (trust), Pricing, HowItWorks, Status | Tags, status pills |
| `Card` / `.giant-card` | all pages | Content blocks |
| `Field` + `Input`/`Textarea`/`Select` | Contact | Form fields, labels, hints, errors |
| `SearchBar` | Help | Category filter |
| `Icon` (material symbols) | everywhere | Glyphs |
| `Spinner`, `Skeleton`, `EmptyState`, `ErrorState` | Contact, Help | Loading/empty/error states |
| `StatCard` | Home (platform facts), Status | Metric tiles |
| `Tabs`/`SegmentedControl` | (not needed) | — |
| `lib/constants`, `lib/utils` | all pages | Copy + formatters (INR etc.) |

## New (this module)
| Component | Location | Responsibility |
|---|---|---|
| `Accordion` | `src/components/ui/Accordion.jsx` | FAQ — single/multi open, chevron rotate, `aria-expanded`/`aria-controls`, keyboard toggling, smooth max-height |
| `usePageTitle` | `src/hooks/usePageTitle.js` | Sets `document.title` = "Title · OnlyIndians" on mount |
| Page files | `src/pages/{Home,About,HowItWorks,Pricing,Terms,Privacy,Guidelines,Contact,Help,FAQ,Status}.jsx` | One component per route (registry already references these keys) |

## Component behavior notes
- `Accordion`: `single` mode default; `defaultOpen`; supports `value` deep-link via `location.hash`.
- Contact form: controlled state; validate on submit (+ inline errors on blur); honeypot honeypot field ignored; success → success card + clear form; failure → `ErrorState` with retry.
- Help: `SearchBar` filters categories and their topics live (client-side); clear → full list.