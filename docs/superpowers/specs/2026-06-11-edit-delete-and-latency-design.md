# Edit/Delete Coverage + Latency Fix — Design

Date: 2026-06-11 · Status: approved by user (chat) · Branch: learn

## Problem

1. Habits and OKR objectives cannot be edited or deleted after creation (no API routes, no UI).
2. Audit of the other sections found further gaps: projects cannot be deleted and have no
   edit UI; todos, ideas, and content have delete but no way to edit fields after creation.
3. Production API latency is high because Vercel functions run in `iad1` (US East) while
   Supabase (database + auth) is in `eu-west-1` (Ireland). Realtime is not used and not relevant.
4. The Life Compass placeholder text is in Chinese; the rest of the product is English.

## Decisions (user-confirmed)

- Habit delete = **hard delete** with a confirmation prompt; logs cascade via existing
  `onDelete: Cascade`.
- OKR editing covers **objective fields and key results** (add/edit/remove).

## API changes

All new routes follow the existing `todos/[id]` pattern: Supabase `getUser()`, ownership
check via `userId`, 400 on invalid input, JSON errors, 404 for missing/foreign rows.

- `PATCH /api/habits/[id]` — title, description, icon, color, frequencyType, frequencyDays,
  timesPerPeriod, reminderTime, tags.
- `DELETE /api/habits/[id]` — hard delete (logs cascade).
- `PATCH /api/okr/[id]` — objective fields (title, description, deadline, tags, status);
  optional `keyResults` array reconciled in a single transaction: entries with `id` update,
  entries without `id` create, existing KRs absent from the array are deleted (check-ins cascade).
- `DELETE /api/okr/[id]` — hard delete (KRs, check-ins, tasks cascade).
- `PATCH /api/projects/[id]` — extended beyond `notes` to title, description, color, status,
  targetDate, tags.
- `DELETE /api/projects/[id]` — hard delete (milestones, tasks, logs cascade).

Todos, ideas, content already have complete PATCH/DELETE routes — unchanged.

## UI changes

- Each of the six create dialogs (habit, okr, todo, idea, content, project) becomes a
  combined create/edit dialog: optional `initial` prop prefills the form and switches
  submit to PATCH. Avoids six near-duplicate edit forms.
- Cards/rows in habits, OKR, todos, ideas, content, and projects get edit (pencil) and —
  where missing — delete (trash) affordances; delete asks for confirmation first.
- Demo-mode dispatcher gains matching PATCH/DELETE handlers (habits, okr, projects).
- `api-client.ts` gains a generic `requestJson(method, url, body)`; `postJson` delegates to it.

## Latency

- `vercel.json` with `"regions": ["dub1"]` colocates serverless functions with Supabase
  eu-west-1. Expected saving: ~100–200 ms per API request (multiple transatlantic round
  trips removed). Middleware auth skip for `/api/*` was already shipped previously.

## Other

- Life Compass placeholder rewritten in English (same content, translated).

## Testing

- Script-based API tests with a temporary Supabase user against local dev: PATCH/DELETE for
  habit, okr (incl. KR reconcile), project; 404 on foreign IDs; 400 on bad input.
- `tsc --noEmit` + production build.
- After deploy: same API tests against the live site, then cleanup.
