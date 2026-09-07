# Account Separation

Subscriber, creator, and admin are three **completely separate experiences**. Only
account-type selection during registration is shared.

## Rule set

1. **One account, one role.** Every user is exactly one of `subscriber`, `creator`, or
   `admin`, stored in `profiles.role` and fixed at registration. It cannot be self-changed.

2. **Separate route trees.** Each role owns its own prefix and shell:

   | Role | Prefix | Shell |
   |------|--------|-------|
   | Subscriber | `/subscriber/*` | `DashboardLayout(role=subscriber)` |
   | Creator | `/creator/*` | `DashboardLayout(role=creator)` |
   | Admin | `/admin/*` | `DashboardLayout(role=admin)` |

3. **No combined dashboard.** There is no "super dashboard", no role switcher, and no
   screen that renders subscriber + creator + admin tools at once.

4. **Route guard enforcement.** `RequireRole("creator")` etc. render `null`/redirect
   for any other role:
   - Not signed in → `/auth` (or `/admin/login` for admin routes).
   - Wrong role → redirect to that user's own `/` shell (their dashboard).

5. **Data-layer enforcement (RLS).** Postgres policies restrict by role even if a
   malicious client bypasses UI guards:
   - Subscribers read public + subscribed content only.
   - Creators read/write only their own content, media, earnings, payouts.
   - Admin reads/writes administrative tables only through an admin-only function/role.
   - Cross-role financial data never leaks: subscriber never sees a creator's earnings,
     creator never sees another creator's earnings.

6. **Separate onboarding.** Subscriber onboarding (username/avatar/profile/interests/
   preferences) is distinct from creator onboarding (avatar/profile/pricing/identity/
   payout). Neither is shown to the other role.

7. **Shared underlying data only, never shared UI.** A creator profile, a post, a
   conversation, a transaction are the *same* rows in the database and therefore stay
   synchronized across experiences — but each experience renders them through its own
   screens with its own permissions.

## What IS shared

- Supabase Auth identity (email, password, session).
- Underlying database rows (profiles, posts, subscriptions, messages, payments).
- The design system and shared UI primitives.

## What is NEVER shared

- Dashboards, navigation, settings hubs, onboarding flows.
- Admin tooling (verification/moderation/reporting/payout control) inside any user UI.
- Public registration of admin accounts.