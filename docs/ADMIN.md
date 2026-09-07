# Admin Experience

Entry: `/admin/login` (platform-provisioned credentials; no public registration) →
`/admin`.

## Dashboard `/admin`

- Platform overview: totals (users, creators, revenue, payouts), charts, health,
  recent activity, pending queues (verification / moderation / reports / tickets).

## User management `/admin/users*`

- Table with filters (role, status, date) and pagination.
- Detail: profile, activity, subscriptions, transactions, reports, ban/suspend actions.
- Changing a user's status is reflected across the product (role guards block
  suspended accounts).

## Creator verification `/admin/verification*`

- Queue of pending identity verifications.
- Review panel with document viewer, history.
- Approve/reject → updates `identity_verifications.status` and creator verification
  status; creator sees the result.

## Content moderation `/admin/moderation*`

- Queue of flagged/auto-flagged content with preview.
- Actions: warn, hide, remove, restrict, ban → affects post visibility everywhere.

## Reports & safety `/admin/reports*`

- Reports queue (`reports`: target type/user/content, reason, evidence).
- Detail with evidence viewer, resolution workflow.

## Payments & payouts

- `/admin/payments` — transaction table, refunds, disputed payment handling.
- `/admin/payouts` — payout requests: approve/process; status syncs to creator history.

## Support `/admin/support*`

- Ticket queue, assignment, ticket conversation (with user), resolution.
- Rooted in `support_tickets` + `ticket_messages`.

## Platform settings `/admin/settings`

- Roles & permissions, feature flags, audit logs, system health, background jobs,
  webhook and storage monitoring.

## Synchronization rules

- Verification approve/reject → creator visible status changes.
- Payout approve → creator earnings/payouts update.
- Moderation action → post visibility changes for all viewers.
- Ban/suspend → user sessions blocked by guards.
- All admin actions write to the same tables the user experiences read from.