# Components

Reusable UI inventory for OnlyIndians. Components are organized by responsibility and
live under `src/components/`. New components should be created only when necessary and
must match the Stitch design system (see `UI_UX_GUIDELINES.md`).

## Design primitives (`src/components/ui/`)

| Component | Responsibility |
|---|---|
| `Button` | Primary / secondary / tertiary / danger variants, loading state, sizes |
| `IconButton` | Compact icon-only action |
| `Input` | Text input with label, error, clear button (iOS-style focus ring) |
| `Textarea` | Multi-line input |
| `Select` | Native-styled select with label/error |
| `Toggle` | iOS switch |
| `SegmentedControl` | Stitch segmented control (white thumb pill) |
| `Badge` | Status pill (rounded-full, tinted fill) |
| `Avatar` | User avatar (initials fallback) |
| `Card` | Grouped card container (Stitch elevation level 1) |
| `Spinner` | Loading indicator |
| `EmptyState` | Icon + title + body + optional action |
| `ErrorState` | Failed-load retry view |
| `Modal` | Level 3 modal with backdrop + focus handling |
| `Drawer` | Slide-in panel |
| `ConfirmDialog` | Destructive/important action confirmation |
| `Toast` | Toasts via `ToastContext` (success / error / info) |
| `Tabs` / `TabBar` | Tab switching (content tabs + mobile bottom bar) |
| `Dropdown` / `Menu` | Overflow menus |
| `Tooltip` | Hover help |
| `Pagination` | Paged results |
| `StatCard` | Metric card (value + delta + sparkline slot) |
| `PageHeader` | Title + actions row, large title collapse behavior |
| `SearchBar` | Global search input with history |
| `FilterBar` | Filters + sort row |
| `DataTable` | Sortable columnar data table |
| `ProgressBar` / `ProgressRing` | Progress indicators |
| `Skeleton` | Loading placeholders |
| `Field` | Label + control + hint + error wrapper |
| `FormSection` | Inset-grouped form block with `1px` dividers |

## Content / media

| Component | Responsibility |
|---|---|
| `PostCard` | Feed/post grid card (locked state, cover, like/bookmark) |
| `PostComposer` | Create/edit post (text + media + visibility + schedule) |
| `MediaUploader` | Drag/click upload with progress, used by avatar/banner/posts/library |
| `MediaGrid` | Media library grid |
| `MediaViewer` | Full-screen media viewer (image + video) |
| `LockedPreview` | Blurred/obscured locked content with subscribe CTA |
| `CommentSection` | Comments |
| `LikeButton` / `BookmarkButton` / `ShareButton` / `ReportButton` | Interaction controls |

## People & community

| Component | Responsibility |
|---|---|
| `CreatorCard` | Discovery/profile-preview card (cover, avatar, price, sub CTA) |
| `CreatorProfileHeader` | Banner + avatar + stats + actions; used in public and subscriber views |
| `SubscriberRow` / `SubscribersTable` | Creator-side subscriber management |
| `UserTable` | Admin user management |
| `MessageList` / `ConversationView` / `MessageComposer` | Direct messaging |
| `NotificationList` / `NotificationPreferences` | Notifications |
| `RequestList` / `RequestCard` | Requests |

## Commerce

| Component | Responsibility |
|---|---|
| `SubscriptionCard` / `PlanCard` | Pricing plan (Stitch pricing screen) |
| `SubscriptionBadge` | Subscribed / free trial / expired state |
| `CheckoutSummary` | Order summary |
| `PaymentMethodSelector` | Saved/card selection |
| `TransactionRow` / `TransactionTable` | Payment & earning history |
| `EarningsChart` / `RevenueChart` | Analytics charts |
| `PayoutOverview` / `PayoutRequestForm` / `PayoutHistoryTable` | Payouts |
| `UsageCharts` (`BarChart`, `LineChart`) | Lightweight SVG charts with no extra deps |

## Admin

| Component | Responsibility |
|---|---|
| `StatGrid` | Platform KPI cards |
| `VerificationQueue` / `VerificationDetail` | Identity review with document viewer |
| `ModerationQueue` / `ReviewPanel` | Content review with actions |
| `ReportsQueue` / `ReportDetail` | Reports + evidence |
| `TicketQueue` / `TicketDetail` | Support tickets |
| `AuditLogTable` | Audit events |
| `SystemHealthCard` | Health checks |
| `RolePermissionEditor` | Roles/permissions |
| `FeatureFlagEditor` | Feature flags |

## Layout & shell

| Component | Responsibility |
|---|---|
| `MarketingLayout` | Public site header (frosted blur) + footer |
| `AuthLayout` | Centered auth screen (emblem + card + legal) |
| `DashboardLayout` | Role-parameterized app shell: sidebar/rail + topbar + mobile tab bar |
| `OnboardingLayout` | Stepper progress + content slot, per-role steps |
| `BottomTabBar` | Mobile subscriber/creator tab bar (Home/Explore/Messages/Notifications/Me) |
| `Header` | Sticky translucent header with collapsing large title |
| `Sidebar` / `RailNav` | Desktop role navigation |
| `UserMenu` | Avatar menu (settings/logout per role) |

## Guidelines for new components

1. Inspect `src/components/ui/` and Stitch references first.
2. Adapt an existing component before creating a new one.
3. Match Stitch: shape, color, typography, spacing, elevation.
4. Reusable, focused, responsive, accessible, connected to data where relevant.
5. No new dependencies unless needed (charts are dependency-free SVG).
6. Prefer composition (`Card` + `PageHeader` + `DataTable`) over bespoke layouts.