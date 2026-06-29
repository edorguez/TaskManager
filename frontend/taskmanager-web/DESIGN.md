# Task Manager — Design System

## Overview

Task Manager is a neobrutalist task management application. The design language emphasizes bold, raw aesthetics with heavy black borders, hard drop-shadows (no blur), high-contrast colors, and expressive typography.

## Design Principles

- **Borders over backgrounds:** Every component has a 4px (or 6px) solid black border.
- **Hard shadows:** Shadows use `box-shadow: {x}y 0px 0px rgba(0,0,0,1)` — no blur, pure offset.
- **Bold typography:** Montserrat for display/headlines (900/800 weight), Space Grotesk for body text, Space Mono for labels/meta.
- **High contrast:** Off-white background (`#fbf9f1`), black text (`#1b1c17`), vibrant accent colors.
- **Micro-interactions:** Shadow shifts and transforms on hover/click provide tactile feedback.

## Color Palette

All colors are defined as CSS custom properties in `src/styles/tokens.css`.

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#fbf9f1` | Page background |
| `--on-background` | `#1b1c17` | Text on background |
| `--primary` | `#5e6300` | Primary brand |
| `--primary-container` | `#f3ff00` | Primary surfaces, FAB, CTAs |
| `--secondary` | `#006e27` | Secondary brand |
| `--secondary-container` | `#00fe66` | Success states, active filters |
| `--tertiary` | `#0054d6` | Info, tertiary brand |
| `--error` | `#ba1a1a` | Error/danger |
| `--error-container` | `#ffdad6` | Error surfaces |
| `--surface` | `#fbf9f1` | Default surface |
| `--surface-variant` | `#e4e3db` | Subtle surface variant |
| `--on-surface-variant` | `#474832` | Muted text |

## Typography

| Style | Font | Weight | Size | Usage |
|---|---|---|---|---|
| Display LG | Montserrat | 900 | 64px | Hero numbers, page titles |
| Headline LG | Montserrat | 800 | 32px | Section headers |
| Headline MD | Montserrat | 800 | 24px | Card titles, subheaders |
| Body LG | Space Grotesk | 500 | 18px | Descriptive text |
| Body MD | Space Grotesk | 400 | 16px | Body content |
| Label Mono | Space Mono | 700 | 14px | Labels, badges, buttons |

## Spacing

- `--gutter`: 24px (page padding)
- `--stack-sm`: 8px
- `--stack-md`: 16px
- `--stack-lg`: 32px

## Shadows

All shadows use hard offset with zero blur radius:

- **Small:** `6px 6px 0px 0px rgba(0,0,0,1)` — cards, buttons, stat cards
- **Medium:** `8px 8px 0px 0px rgba(0,0,0,1)` — FAB, submit buttons
- **Large:** `12px 12px 0px 0px rgba(0,0,0,1)` — modals, login card

## Component Library

Located in `src/components/ui/`:

| Component | Description |
|---|---|
| `NeoButton` | Styled MUI Button with 4px black border, hard shadow, hover translate effect |
| `NeoPrimaryButton` | Yellow (`#f3ff00`) variant |
| `NeoSecondaryButton` | Green (`#00fe66`) variant |
| `NeoErrorButton` | Red (`#ba1a1a`) variant |
| `NeoCard` | Styled MUI Card with border + shadow + hover lift |
| `NeoInput` | Styled MUI TextField — focus turns background to primary-container |
| `NeoBadge` | Priority badge (HIGH/MID/LOW with color coding) |
| `StatusChip` | Task status chip (Todo/InProgress/Done) |
| `StatCard` | Dashboard stat card (label + value + icon + trend) |
| `SectionHeader` | Reusable section header with optional subtitle, badge, action |
| `SearchBar` | Inline search input with search icon |
| `NeoModal` | Success/confirm modal with neobrutalism styling |
| `NeoConfirmButton` | Modal confirmation button |

## Layout

- **Desktop:** Fixed sidebar (256px) + sticky top navbar (80px) + scrollable content area
- **Mobile:** Bottom navigation bar (80px) replaces sidebar; top navbar collapses

### Sidebar (`Sidebar.tsx`)
- Project name + workspace label
- "NEW TASK" button
- Nav items: Dashboard (/), Tasks (/tasks), Analytics, Calendar
- Footer items: Help, Archive

### TopNavbar (`TopNavbar.tsx`)
- Brand name (TASK MANAGER)
- Search bar (hidden on tablet/mobile)
- Notifications icon, Settings icon, User avatar, Logout button

### MobileNav (`MobileNav.tsx`)
- Dash, Tasks, New (FAB), Logout tabs
- Fixed at bottom, visible below `md` breakpoint

## Page Templates

### Login (`/login`)
- Centered card on grid background
- Floating decorative shapes
- Email + password with icon prefixes
- Register link below

### Register (`/register`)
- Same layout pattern as login
- Full name, email, password, confirm password
- "New Operative Enrollment" badge

### Dashboard (`/`)
- "System Overview" section header + Sprint badge
- 3 stat cards (Total, In Progress, Completed)
- Recent Tasks list + Velocity chart + Team status card
- FAB button for quick task creation

### Task List (`/tasks`)
- "Task List" hero section
- Filter tabs (All, Todo, In Progress, Done)
- Task cards grid with priority, title, description, due date, status
- Empty state: "Add New Segment" dashed card

### Create Task (`/tasks/new`)
- "New Task"
- Form: title, deadline, priority (Low/Med/High), description, category tags
- "CREATE TASK" bold submit button with bolt icon
- Success modal on completion

### Edit Task (`/tasks/:id/edit`)
- Same layout as create but pre-filled
- Status dropdown added
- "UPDATE TASK" submit button

## Interaction Patterns

- **Hover:** Elements shift 2px right and down; shadow reduces from 6px→4px
- **Active/Press:** Elements shift 4px+ right and down; shadow disappears
- **Focus (inputs):** Background becomes `#f3ff00`, shadow increases, element shifts up/left
- **FAB hover:** Shadow reduces, shifts up; tooltip appears
- **Counters:** Numbers animate from 0 to final value on page load

## File Structure

```
src/
  styles/
    tokens.css          — CSS custom properties (colors, spacing, fonts)
    global.scss         — Global resets, scrollbar, selection
  theme/
    theme.ts            — MUI createTheme with full component overrides
  components/
    ui/                 — Shared neobrutalism components
    Layout.tsx          — App shell: Sidebar + TopNavbar + Outlet + MobileNav
    Sidebar.tsx         — Left navigation
    TopNavbar.tsx       — Top header bar
    MobileNav.tsx       — Bottom mobile navigation
    ProtectedRoute.tsx  — Auth guard
  pages/
    LoginPage.tsx       — Login
    RegisterPage.tsx    — Registration
    DashboardPage.tsx   — Dashboard with stats and recent tasks
    TaskListPage.tsx    — Task list with filters
    TaskCreatePage.tsx  — Task creation
    TaskEditPage.tsx    — Task editing
    NotFoundPage.tsx    — 404 page
```
