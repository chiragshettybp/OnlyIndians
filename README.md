# OnlyIndians

**Creator-subscription platform built for Indian creators and their subscribers.**

OnlyIndians lets creators build a direct relationship with their audience—publish content, offer paid subscriptions, communicate with subscribers, and manage their creator business from one platform. Subscribers discover creators, explore content, subscribe, and manage their accounts. Admins keep the platform safe, verified, and well-run.

## Project organization

```
OnlyIndiansStitch/
├── README.md              # This file
├── docs/                  # Product & architecture documentation
│   ├── PRODUCT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── ROUTES.md
│   ├── USER_FLOWS.md
│   ├── ACCOUNT_SEPARATION.md
│   ├── COMPONENTS.md
│   ├── UI_UX_GUIDELINES.md
│   ├── SUBSCRIBER.md
│   ├── CREATOR.md
│   ├── ADMIN.md
│   ├── DATA_MODELS.md
│   ├── API.md
│   ├── SECURITY.md
│   ├── DEVELOPMENT_PLAN.md
│   ├── CONTRIBUTING.md
│   └── STITCH_IMPLEMENTATION.md
├── stitch-designs/        # Stitch-generated UI design references (source of truth for UI)
└── src/                   # React application source
    ├── lib/               # Supabase client & data layer
    ├── context/           # React contexts (auth, toasts, app data)
    ├── components/        # Reusable UI components
    ├── layouts/           # App shells (marketing, auth, dashboard)
    ├── pages/             # Route-level screens grouped by module
    ├── App.jsx            # Router
    └── main.jsx           # Entry point
```

## The three experiences

| | Subscriber | Creator | Admin |
|---|---|---|---|
| **Purpose** | Discover, subscribe, engage | Publish, monetize, manage | Operate & moderate the platform |
| **Entries** | `/subscriber/*` | `/creator/*` | `/admin/*` |
| **Never combined** | — | — | — |

Each pipeline is a completely separate experience. They are only ever bridged by the shared account-type selection during registration (see [docs/ACCOUNT_SEPARATION.md](docs/ACCOUNT_SEPARATION.md)).

## Design source of truth

UI is designed in **Stitch** (Cupertino Clarity design system, iOS-native, Inter, light mode, primary `#004ac6`). Stitch screens live in [`stitch-designs/`](stitch-designs/) and are the visual reference for every implemented screen. See [docs/STITCH_IMPLEMENTATION.md](docs/STITCH_IMPLEMENTATION.md).

## Tech stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router
- **Backend / Data:** Supabase (Auth, Postgres, RLS, Storage)
- **Design:** Stitch-generated UI, implemented 1:1

## Quick start

```bash
npm install
cp .env.example .env        # add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm run dev                 # http://localhost:5173
```

## Documentation

Start with [docs/PRODUCT_OVERVIEW.md](docs/PRODUCT_OVERVIEW.md) for the product, [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the system, and [docs/ROUTES.md](docs/ROUTES.md) for the full route map.