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

| Color | Hex | Usage |
|---|---|---|
| Background | `#fbf9f1` | Page background |
| On-background | `#1b1c17` | Text on background |
| Primary | `#5e6300` | Primary brand |
| Primary container | `#f3ff00` | Primary surfaces, FAB, CTAs |
| Secondary | `#006e27` | Secondary brand |
| Secondary container | `#00fe66` | Success states, active filters |
| Tertiary | `#0054d6` | Info, tertiary brand |
| Error | `#ba1a1a` | Error/danger |
| Error container | `#ffdad6` | Error surfaces |
| Surface | `#fbf9f1` | Default surface |
| Surface variant | `#e4e3db` | Subtle surface variant |
| On-surface variant | `#474832` | Muted text |

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

- Page padding: 24px
- Small: 8px
- Medium: 16px
- Large: 32px

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
| `StatusChip` | Task status chip (Todo/InProgress/Done) |
| `StatCard` | Dashboard stat card (label + value + icon + trend) |
| `SectionHeader` | Reusable section header with optional subtitle, badge, action |
| `NeoModal` | Success/confirm modal with neobrutalism styling |
| `NeoConfirmButton` | Modal confirmation button |

Board components (located in `src/components/board/`):

| Component | Description |
|---|---|
| `Board` | Kanban board with 3 columns, drag-and-drop via `@dnd-kit`, drag overlay |
| `Column` | Droppable column with title, task count, sortable task list, "Add Task" button |
| `BoardCard` | Draggable task card with title, description, edit/delete actions |

## Layout

- **Desktop:** Fixed sidebar (256px) + sticky top navbar (80px) + scrollable content area
- **Mobile:** Bottom navigation bar (80px) replaces sidebar; top navbar collapses

### Sidebar (`Sidebar.tsx`)
- Project name "TASK MANAGER"
- "NEW TASK" link (navigates to `/tasks/new`)
- Nav items: Dashboard (`/`), Tasks (`/tasks`)
- Active route highlighted with green background and shadow

### TopNavbar (`TopNavbar.tsx`)
- User email badge (with person icon, `Space Mono` uppercase, bordered)
- Red logout button with `LogoutIcon`

### MobileNav (`MobileNav.tsx`)
- Dash, Tasks, Logout tabs
- Fixed at bottom, visible below `md` breakpoint
- Active route highlighted in green

## Page Templates

### Login (`/login`)
- Centered card on grid background
- Floating decorative shapes
- Email + password fields with client-side validation (required, email format)
- Register link below
- On success: stores JWT via Zustand, redirects to `/`

### Register (`/register`)
- Same layout pattern as login
- Email, password, confirm password fields
- Password complexity: min 6 chars, at least one uppercase, lowercase, digit, and special character
- Password match validation
- "New Operative Enrollment" badge
- On success: auto-logs in and redirects to `/`

### Dashboard (`/`)
- "System Overview" section header
- 3 stat cards: Total, In Progress, Done (counts from fetched tasks)
- Recent Tasks list (last 5 tasks with icons, truncated descriptions)
- FAB button (bottom-right) for quick task creation

### Task List (`/tasks`)
- Kanban board with 3 columns: Todo, InProgress, Done
- Drag-and-drop via `@dnd-kit` to change task status
- Each column shows title + task count + "Add Task" button
- Task cards show title, description, edit button, delete button
- Delete confirmation via `NeoModal`
- Success/error feedback via `Snackbar`
- Empty state per column: "No tasks yet"

### Create Task (`/tasks/new`)
- Form: title (required, max 200), due date (required, min today), status (dropdown), description (multiline)
- Pre-selectable status via `?statusId` query param (used by column "Add Task" buttons)
- "CREATE TASK" submit button
- Success modal on completion, then navigates to `/tasks`

### Edit Task (`/tasks/:id/edit`)
- Same layout as create but pre-filled
- Status dropdown added
- "UPDATE TASK" submit button

## Interaction Patterns

- **Hover:** Elements shift 2px right and down; shadow reduces from 6px→4px
- **Active/Press:** Elements shift 4px+ right and down; shadow disappears
- **Focus (inputs):** Background becomes `#f3ff00`, shadow increases, element shifts up/left
- **FAB hover:** Shadow reduces, shifts up

## File Structure

```
src/
  styles/
    global.scss         — Global resets, scrollbar, selection
  theme/
    theme.ts            — MUI createTheme with full component overrides
  components/
    ui/                 — Shared neobrutalism components (NeoButton, NeoCard, etc.)
    board/              — Kanban board (Board, Column, BoardCard)
    Layout.tsx          — App shell: Sidebar + TopNavbar + Outlet + MobileNav
    Sidebar.tsx         — Left navigation
    TopNavbar.tsx       — Top header bar
    MobileNav.tsx       — Bottom mobile navigation
    ProtectedRoute.tsx  — Auth guard
  pages/
    LoginPage.tsx       — Login
    RegisterPage.tsx    — Registration
    DashboardPage.tsx   — Dashboard with stats and recent tasks
    TaskListPage.tsx    — Kanban board with drag-and-drop
    TaskCreatePage.tsx  — Task creation
    TaskEditPage.tsx    — Task editing
    NotFoundPage.tsx    — 404 page
```
