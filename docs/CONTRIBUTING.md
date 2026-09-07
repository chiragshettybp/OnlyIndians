# Contributing

## Development conventions

- **Stack:** React 18 (JSX, function components, hooks), Vite, Tailwind CSS, React Router v6.
- **Source of truth:** Stitch screens in `stitch-designs/` for UI; docs/ for product,
  route, and module architecture.
- **Account separation is sacred** — never build a combined dashboard, role switcher, or
  cross-role route without review (see `ACCOUNT_SEPARATION.md`).

## File & folder rules

```
src/
├── lib/          # supabase.js (anon), supabaseAdmin.js (server-only), api.js (typed data fns)
├── context/      # AuthContext, ToastContext, AppContext
├── hooks/        # useAsync, usePagination, etc.
├── components/ui/# design primitives only (Button, Input, Card, ...)
├── components/   # domain components (PostCard, CreatorCard, ...)
├── layouts/      # MarketingLayout, AuthLayout, DashboardLayout, OnboardingLayout
└── pages/        # one folder per module path segment (public, auth, subscriber, creator, admin)
```

## Component reuse rules

1. Check `src/components/ui/` and existing domain components before creating anything.
2. Adapt before you write; write a new component only when genuinely necessary.
3. New components must match the Stitch design tokens (`UI_UX_GUIDELINES.md`) and be
   reusable, accessible, and connected where relevant.
4. No new runtime dependencies without justification (charts are dependency-free SVG).

## Data rules

- All data flows through `src/lib/api.js`; never embed fake datasets in screens.
- Editing/creating in one screen must reflect everywhere (single source of truth).
- Do not bypass `api.js` with ad-hoc supabase calls inside pages.

## Security rules

- Only `VITE_SUPABASE_ANON_KEY` belongs in the client. Service-role key and DB password
  stay in gitignored `.env.service-role` — never `VITE_`-prefixed, never in code.
- Never log tokens, passwords, payment data, or personal information.
- Feature work touching financial operations must use server-side paths.

## Pull requests

- One logical change per PR; attach the relevant Stitch screen when UI changes.
- Run `npm run build` before opening a PR; keep lint warnings at zero.
- Update the relevant `docs/` file when routes, data models, or modules change.
- Update `docs/STITCH_IMPLEMENTATION.md` implementation status for every screen touched.

## Documentation expectations

- README and docs/ describe the product; keep them accurate when code changes behavior.
- Prefer documenting the *why* and structure here; keep inline comments for genuinely
  non-obvious code only.

## Testing

- Manual verification against Stitch screens for every touched screen.
- Functional checks per `USER_FLOWS.md` for connected flows before merge.