# StudyTracker — Onboarding Guide

## Project Overview

**Name:** StudyTracker  
**Languages:** TypeScript  
**Frameworks:** Next.js · React · Tailwind CSS · Prisma · Supabase · Zustand · Framer Motion · Recharts

A full-stack study and productivity tracker. Features modules for habits, todos, OKRs, projects, content management, ideas, stats, and an interactive learn section with 8 guided chapters covering web app fundamentals. Users can also try everything without signing in via a full-featured demo mode.

---

## Architecture Layers

### 1. Config Layer (4 files)
Next.js and Tailwind configuration, the root HTML shell layout, and edge middleware that enforces authentication.

| File | Role |
|------|------|
| `next.config.ts` | Externalizes Prisma from server bundles |
| `src/middleware.ts` | Edge auth guard — redirects unauthenticated users |
| `src/app/layout.tsx` | Root HTML shell, Manrope font, global metadata |
| `tailwind.config.ts` | Maps CSS HSL variables to semantic design tokens |

### 2. API Layer (23 files)
Next.js App Router serverless route handlers. All routes live at `src/app/api/` and cover every REST endpoint (todos, habits, projects, OKRs, content, ideas, stats, tags, auth callback).

Pattern: authenticate with Supabase server client → query Prisma → return JSON.

| File | Role |
|------|------|
| `src/app/api/habits/route.ts` | GET/POST habits |
| `src/app/api/todos/route.ts` | GET/POST todos with date filtering |
| `src/app/api/okr/route.ts` | GET/POST objectives with nested key results |
| `src/app/api/projects/route.ts` | GET/POST projects |
| `src/app/api/stats/route.ts` | **Complex** — aggregates cross-domain analytics (376 lines) |
| `src/app/auth/callback/route.ts` | Supabase OAuth callback handler |

### 3. UI Layer (17 files)
File-system routed page components for the authenticated app, auth flows, and the learn module.

| File | Role |
|------|------|
| `src/app/(app)/page.tsx` | Main dashboard — aggregates habits, todos, OKRs |
| `src/app/(app)/habits/page.tsx` | Habits with heatmap visualization |
| `src/app/(app)/todos/page.tsx` | Todo list with overdue detection |
| `src/app/(app)/okr/page.tsx` | OKRs with nested key results + check-in dialogs |
| `src/app/(app)/projects/page.tsx` | Projects grouped by status |
| `src/app/(app)/projects/[id]/page.tsx` | Project detail: notebook + milestones |
| `src/app/(app)/content/page.tsx` | Content library with status tabs |
| `src/app/(app)/ideas/page.tsx` | Ideas board with archive/restore |
| `src/app/(app)/stats/page.tsx` | Analytics with configurable date range |
| `src/app/(app)/compass/page.tsx` | Freeform life direction notes with debounced auto-save |
| `src/app/(app)/layout.tsx` | Authenticated shell — stacks AuthProvider, DemoProvider, AppShell |
| `src/app/(auth)/login/page.tsx` | Email/password login |
| `src/app/(learn)/learn/page.tsx` | Learn module chapter grid |

### 4. Components Layer (63 files)
Reusable React components organized by feature domain.

| Area | Key Files |
|------|-----------|
| Layout | `src/components/layout/app-shell.tsx`, `sidebar.tsx` |
| Auth | `src/components/shared/auth-gate.tsx` |
| Habits | `create-habit-dialog.tsx`, `habit-heatmap.tsx` |
| OKRs | `create-okr-dialog.tsx` |
| Content/Ideas | `create-content-dialog.tsx`, `create-idea-dialog.tsx` |
| Stats | `src/components/stats/` |
| Learn interactive | `quiz.tsx`, `api-explorer.tsx`, `architecture-diagram.tsx`, `auth-flow-diagram.tsx`, `data-flow-animation.tsx`, `er-diagram.tsx`, `decision-tree.tsx`, `deployment-simulator.tsx` |
| UI primitives | `src/components/ui/button.tsx` (fan-in: 25) |

### 5. Service Layer (18 files)
Shared server and client utilities.

| File | Role |
|------|------|
| `src/lib/prisma.ts` | Singleton Prisma client (fan-in: 22) |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Cookie-aware server Supabase client |
| `src/lib/auth-context.tsx` | `useAuth()` hook — session + user state |
| `src/lib/demo-context.tsx` | **740-line** fetch-interceptor demo mode |
| `src/lib/mock-data.ts` | Realistic seed data for demo mode |
| `src/lib/utils.ts` | `cn()` helper, date utils, OKR progress calc (fan-in: 38) |
| `src/lib/stats.ts` | `StatsResponse` type bridging API ↔ frontend |
| `src/lib/learn/chapters.ts` | Chapter registry with slug lookup helpers |
| `src/lib/learn/progress-store.ts` | Zustand store persisted to localStorage |
| `src/lib/learn/i18n.ts` | `Locale` type + `getContent()` for EN/ZH |
| `src/lib/learn/quiz-data.ts` | Bilingual quiz questions keyed by chapter slug |

---

## Key Concepts

- **App Router + Route Groups**: `(app)` groups authenticated routes, `(auth)` groups login/register, `(learn)` gives the learn module its own chrome. None of these parenthesized segments appear in the URL.
- **Full-stack TypeScript**: API routes and pages share types (e.g. `StatsResponse`), giving end-to-end type safety without a separate API layer.
- **Optimistic UI**: Page components maintain local React state and update immediately, then reconcile with the server response.
- **Demo Mode**: `demo-context.tsx` monkey-patches `window.fetch` to intercept all `/api/*` calls — no login or database needed to explore the app.
- **Tag filtering**: A shared `TagFilter` component threads through habits, todos, content, ideas, and OKRs uniformly.
- **Two foundational helpers**: `src/lib/utils.ts` (`cn()`) and `src/components/ui/button.tsx` underpin the entire UI — learn these first.

---

## Guided Tour (Recommended Reading Order)

| # | What to Read | Why |
|---|-------------|-----|
| 1 | `src/app/layout.tsx` | Root App Router layout — the entry point |
| 2 | `src/middleware.ts` | Edge auth guard — first line of defense |
| 3 | `src/app/(app)/layout.tsx` + `app-shell.tsx` + `auth-gate.tsx` | How auth context and app chrome compose |
| 4 | `src/lib/supabase/client.ts` + `server.ts` + `auth-context.tsx` + login page | Full auth flow |
| 5 | `src/lib/prisma.ts` | Database singleton — most-depended-on backend file |
| 6 | `src/app/api/habits/route.ts` + `stats/route.ts` | API route pattern + most complex endpoint |
| 7 | `src/lib/demo-context.tsx` + `mock-data.ts` | Offline demo mode — sophisticated fetch interception |
| 8 | `src/components/layout/app-shell.tsx` + `sidebar.tsx` | Navigation chrome, mobile responsiveness |
| 9 | `src/app/(app)/page.tsx` | Dashboard — where all modules converge |
| 10 | `habits/page.tsx` + `todos/page.tsx` + `okr/page.tsx` | Core feature module pattern |
| 11 | `src/app/(app)/stats/page.tsx` + `src/lib/stats.ts` | Typed client-server contract in action |
| 12 | `(learn)/layout.tsx` + `learn/page.tsx` + `chapters.ts` | Learn module structure |
| 13 | `progress-store.ts` + `i18n.ts` + `quiz-data.ts` | Learn module: state + bilingual content |
| 14 | `src/components/learn/interactive/quiz.tsx` | Core interactive learn primitive (fan-in: 9) |
| 15 | `src/lib/utils.ts` + `src/components/ui/button.tsx` | Foundational glue — read last for full context |

---

## Complexity Hotspots

These files have the highest complexity and should be approached carefully:

| File | Notes |
|------|-------|
| `src/lib/demo-context.tsx` | 740 lines — monkey-patches `window.fetch`; complex in-memory CRUD store |
| `src/app/api/stats/route.ts` | 376 lines — cross-domain aggregation across all resource types |
| `src/app/(app)/okr/page.tsx` | Nested key results, check-in dialogs, inline task creation |
| `src/app/(app)/page.tsx` | Fan-out of 11 — imports from most feature modules |
| `src/app/(app)/projects/[id]/page.tsx` | Tabbed notebook + milestones + progress log |
| `src/components/learn/interactive/*` | 8 complex interactive widgets (diagrams, simulators, playgrounds) |
| `src/components/habits/create-habit-dialog.tsx` | Custom frequency scheduler (daily/weekly/custom) |
| `src/components/okr/create-okr-dialog.tsx` | Multi-field OKR creation with nested key results |
| `src/lib/mock-data.ts` | Generates realistic seed data with relative-date helpers |
