# UI / UX Guidelines

The visual identity is defined by the **Stitch "Cupertino Clarity"** design system and
the screens in `stitch-designs/`. Implement screens **exactly as designed** in Stitch:
do not redesign, restyle, or simplify them.

## Design tokens

### Color palette (light mode only)

| Token | Value | Use |
|---|---|---|
| `primary` | `#004ac6` | Primary actions, links, active controls |
| `primary-container` | `#2563eb` | Container fills |
| `on-primary` | `#ffffff` | Text on primary |
| `background` / `surface` | `#f9f9fe` | Canvas |
| `surface-container` | `#ededf3` | Grouped surfaces |
| `surface-container-lowest` | `#ffffff` | Elevated cards |
| `surface-container-highest` | `#e2e2e7` | Pressed / fill layers |
| `on-surface` | `#1a1c20` | Primary text |
| `on-surface-variant` | `#434655` | Secondary text |
| `outline` | `#737686` | Icons, borders |
| `outline-variant` | `#c3c6d7` | Hairlines |
| `secondary` | `#0058be` | Secondary accents |
| `tertiary` | `#00569c` | Tertiary accents |
| `error` | `#ba1a1a` | Errors / destructive |
| `error-container` | `#ffdad6` | Error surfaces |
| `on-error` | `#ffffff` | Text on error |

The full palette (including fixed roles) is defined in `tailwind.config.js`.

### Typography (Inter)

Apple/Inter dynamic scale, defined in Stitch:

| Style | Size | Weight | Line | Tracking |
|---|---|---|---|---|
| large-title | 34px | 700 | 41px | -0.022em |
| large-title-mobile / title-1 | 28px | 700 | 34px | -0.02em |
| title-2 | 22px | 600 | 28px | -0.015em |
| title-3 | 20px | 600 | 25px | -0.01em |
| headline | 17px | 600 | 22px | -0.01em |
| body | 17px | 400 | 22px | -0.01em |
| callout | 16px | 400 | 21px | -0.005em |
| subheadline | 15px | 400 | 20px | 0 |
| footnote | 13px | 400 | 18px | 0 |
| caption-1 | 12px | 500 | 16px | +0.02em |
| caption-2 | 11px | 600 | 13px | +0.03em |

### Shape & radius

- Cards / grouped insets: `rounded-xl` (16px) to `rounded-2xl` (20px).
- Controls/buttons/inputs: 10–12px radius.
- Badges / chips / pills: fully rounded (`9999px`).

### Elevation

| Level | When |
|---|---|
| 0 | Canvas `#f9f9fe` |
| 1 | Cards: white surface, `1px` hairline or `0 1px 3px rgba(0,0,0,.04)` |
| 2 | Segmented thumb, FAB: `0 2px 8px rgba(0,0,0,.08)` |
| 3 | Modals/sheets: `0 12px 32px rgba(0,0,0,.08)` + `rgba(0,0,0,.2)` backdrop |

### Frosted chrome

Transparent sticky headers/tab bars use `backdrop-filter: blur(20px) saturate(180%)`
with `rgba(255,255,255,.85)` fill and a `1px` hairline bottom border.

## Layout

- Content is centered in a container capped at **`72rem` (1152px)**.
- Grouped lists sit on `#f9f9fe` as white `Card`s with `1px solid #e5e7eb` borders and
  rows ≥ 48px; dividers inset `1rem` from the leading edge, flush at the trailing edge.
- Vertical rhythm is 8pt-based; section gaps `2rem`; inter-row padding 12–16px.
- Mobile uses `1rem` gutters; desktop uses a 12-column grid with `1.5rem` gutters.

## Components — standards (from Stitch)

- **Primary button:** solid `primary` fill, white text, min height 44px, radius 10px,
  `scale(0.98)` on press.
- **Secondary button:** `rgba(37,99,235,.08)` fill, primary text, no border.
- **Tertiary/ghost:** transparent, primary or `#1a1c20` label, `#f4f5f7` hover.
- **Segmented control:** continuous `#e5e7eb` track radius 8px, 2px padding; selected
  segment is a white pill with elevation level 2.
- **Inputs:** `#f4f5f7` background; on focus white + `1px #2563eb` + `0 0 0 3px
  rgba(37,99,235,.15)` ring; trailing clear button.
- **Badges:** `rounded-full`, ~24px height, 8px padding, 10%-opacity tinted fill with
  bold full-strength text.
- **List rows:** chevron accessories in `#9ca3af`.

## Responsive behavior

- Mobile-first; all screens support 390px up to desktop.
- Feed/dashboard grids collapse to single column on mobile; sidebar becomes a rail on
  tablet and bottom tab bar on mobile.
- Large titles collapse to a 17px bold centered label on scroll past threshold.

## Rules

1. Never introduce a second theme, different fonts, or non-Stitch colors.
2. Never simplify a designed screen into a generic dashboard.
3. Preserve Stitch hierarchy, spacing, borders, radius, and shadows.
4. Interactions must work; hover/press states should match the above tokens.