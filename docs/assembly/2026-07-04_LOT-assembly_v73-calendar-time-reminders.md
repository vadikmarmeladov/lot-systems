<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Self-Assembly Log — 2026-07-04
## v73 · Calendar Time-Tracking · Delete Path · CAL-ALERT: Military Reminders · Job 25

**Session:** Self-Assembly v73
**Date:** 2026-07-04
**Branch:** claude/dreamy-babbage-vkrun1
**Status:** DEPLOYED

---

### Sources Read

- Local files read: `CalendarWidget.tsx`, `Logs.tsx`, `queries.ts`, `scheduled-jobs.ts`,
  `routes/api.ts`, `models/log.ts`, `intentionEngine.ts`, `SystemProgressWidget.tsx`
- Prior doc: `docs/assembly/2026-04-29_LOT-assembly_v11-journal-depth-calendar-gap.md`
  (introduced `recordCalendarSignal` and Pattern 26 `calendar-gap`, left "surface
  calendar events" as next-session recommendation)
- Doctrine: `docs/benchmark/LOT-DOCTRINE.md` (COCKPIT-RULE), `docs/technical/LOT-STYLE-GUIDE.md`
  (text-only, no icons)

---

### Feedback Signal Extracted

Direct request from S-2: continue the Calendar widget, keep it minimalist, make it
reliable, add time tracking, and log military-grade due/overdue notifications.

Audit of the existing widget found three gaps:

1. Entries had a date but no time — nothing to be "due soon" about.
2. There was no way to remove an entry once created. Every mistake was permanent.
3. The Log stream recorded that an entry was created (`CAL:`) but nothing ever
   watched the clock afterward — a scheduled note two hours out and one two
   months overdue looked identical.

---

### Delta Analysis (Ranked Build List)

1. Time-of-day on calendar entries ← BUILT
2. Delete path for calendar entries (client + server) ← BUILT
3. Background job to detect due/overdue entries and log them ← BUILT
4. Log renderer for the new event, military format ← BUILT
5. Reliability: failed saves no longer discard the typed entry ← BUILT

---

### What Was Built

#### 1. Time-of-day — `CalendarWidget.tsx`

`CalendarEntry` gained `time: string | null`. A native `<input type="time">` sits
beside the existing text field. Sort order changed from date-only to
`date + (time || '00:00')` so same-day entries order correctly. The upcoming list
and the day-detail view both print the time when set.

#### 2. Delete path — `CalendarWidget.tsx` / `queries.ts` / `api.ts`

First delete action the widget has ever had. `useDeleteLog()` (`DELETE /api/logs/:id`)
added to `queries.ts`. Server route scoped narrowly: 404 unless the log belongs to
the requesting user AND `event === 'calendar_entry'` — deleting any other log type
through this route is refused. `CalendarEntry` now carries the source log `id` so
the day-view "Remove" action can target the exact log.

#### 3. Reliability — `CalendarWidget.tsx`

`handleAddEntry` used to clear the input and close the form immediately on submit,
before the server confirmed the write. On failure the typed note was gone with no
trace. Now the form only clears `onSuccess`; `onError` sets an inline message and
leaves the text and time in place so the operator can retry without retyping.

#### 4. Job 25 — `scheduled-jobs.ts`

`hourly-calendar-reminder-check`. Scans all `calendar_entry` logs (metadata is
JSONB — no repo precedent for querying inside it at the SQL layer, so the date
window is narrowed in application code, consistent with every other job in this
file). For entries within `[today-2d, today+2d]`, derives a stage:

```
has time:
  due_soon   0 < (dueAt - now) <= 60min
  due_now    -5min <= (dueAt - now) <= 0
  overdue    -24h <= (dueAt - now) < -30min
no time (all-day):
  due_today  date == today
  overdue    date == yesterday
```

Writes one `calendar_reminder` log per (sourceLogId, stage), guarded against
duplicates by checking `calendar_reminder` logs from the last 3 days. Wired into
`checkAndRunScheduledJobs()` as Job 25.

The hourly scheduler tick was gated to a fixed hour list (0,3,4,5,6,7,8,9,10,11,
12,13,14,15,16,18,20,22,23) — a job's own `shouldRun()` already checks day/hour
internally, so the outer gate was pure overhead that also silently excluded hours
1, 2, 17, 19, 21 for any job that might need them. Job 25 has no single target
hour — it needs every tick — so the outer gate was removed. No existing job
targets an excluded hour, so this is additive, not a behavior change for Jobs 1–24.

#### 5. CAL-ALERT: — `Logs.tsx`

New renderer for `calendar_reminder`: stage label (DUE SOON / DUE NOW / DUE TODAY /
OVERDUE) + entry text + entry type/date/time, in the same data-row format as every
other military log block. `CAL:` (the existing `calendar_entry` renderer) was
extended to print the time when present — the only change to an existing handler.

#### 6. `recordCalendarSignal()` — `intentionEngine.ts`

Now takes an optional `time` argument, carried into the `calendar_entry` QIE
signal metadata. Backward compatible — existing two-argument call sites are
unaffected.

#### 7. `displayableEvents` — `api.ts`

`calendar_reminder` added to the allow-list `GET /logs` filters against. Missing
this is the kind of gap that makes a feature silently invisible: the job would
have written the log, and nothing would ever have shown it. Found by reading the
route, not assumed.

---

### File Changes

| File | Change |
|------|--------|
| `src/client/components/CalendarWidget.tsx` | +time input · +delete action · +overdue/due-soon list markers · +error-preserving save |
| `src/client/queries.ts` | +`useDeleteLog()` |
| `src/server/routes/api.ts` | +`DELETE /logs/:id` (calendar_entry + ownership scoped) · +`calendar_reminder` in `displayableEvents` |
| `src/server/scheduled-jobs.ts` | +Job 25 `hourly-calendar-reminder-check` · scheduler tick no longer hour-gated |
| `src/client/components/Logs.tsx` | +`CAL-ALERT:` handler · `CAL:` handler shows time |
| `src/client/stores/intentionEngine.ts` | `recordCalendarSignal()` takes optional `time` |
| `src/client/components/SystemProgressWidget.tsx` | +v73 SESSION_REPORT · USERSHIP_TRANSMISSION updated |

---

### System State After Session

| Metric | Value |
|--------|-------|
| QIE patterns | 86 (unchanged) |
| Widget dependency nodes | 126+ (unchanged) |
| Self-assembly modules | 14 (unchanged) |
| Background jobs | 25 (+1 — Job 25) |
| Military log handlers | 86+ (+1 — CAL-ALERT:) |

---

### Test Results

**Functional:**
- `npm ci --legacy-peer-deps` — environment had no `node_modules`; installed clean (pre-existing peer conflict between `@nanostores/react@0.4.1` and `nanostores@0.9.5`, resolved with the same flag npm itself suggested — not a change to the dependency tree).
- `tsc --project tsconfig.server.json` — exit 0, zero errors, zero warnings (previously-noted `moduleResolution`/`baseUrl` deprecation warnings did not reproduce once `node_modules` was present).
- `client:css:build` / `client:js:build` — exit 0. Pre-existing cosmetic warnings only (browserslist data age, `badges.ts` duplicate `first_signal` key at lines 1827/3112) — unrelated to this session's files.
- Dedup logic: `(sourceLogId, stage)` pair checked against `calendar_reminder` logs from the last 3 days before every write — an entry cannot double-fire the same stage.
- Delete route: returns 404 for a log that doesn't belong to the caller or isn't a `calendar_entry` — verified by reading the added condition against `models/log.ts` field types (`userId`/`event` both plain columns, no enum to violate).

**Regression:**
- `CAL:` handler: additive only (time appended when present; absent time renders identically to before).
- Existing two-argument `recordCalendarSignal()` call site (`CalendarWidget.tsx`) updated in the same commit to pass the new third argument — no orphaned old-signature callers remain.
- Scheduler hour-gate removal: audited all 24 existing `shouldRunXJob()` functions — every one already re-checks its own hour or day-of-week internally, so calling `checkAndRunScheduledJobs()` on every tick changes nothing about when Jobs 1–24 actually execute.

**Style check:**
- No icons, no gradients, no new fonts. `Remove` and status tags are plain text at reduced opacity, matching the existing `text-acc/NN hover:text-acc` idiom already used inside this same file for month navigation.
- `CAL-ALERT:` block matches the label/value grid format of every other military log renderer — uppercase stage, data rows, no prose.

---

### Deploy Confirmation

Committed and pushed to `claude/dreamy-babbage-vkrun1`. See `docs/benchmark/LOT-SR-20260704-01.md` for the terminal-grid session record.

---

### What Was Deferred

- Server-side push notifications (browser `Notification` API) — no existing usage anywhere in the client to build on; would be a new capability, not an extension of one. Left for a session where it's the explicit ask.
- Recurring/repeating calendar entries — out of scope; today's ask was time-tracking + reliability + alerts on the existing single-instance entry model.
- Editing an existing entry's date/time/text in place (today only ships delete — creating a new corrected entry is the workaround).

**Why deferred:** Priority 1 items (time, reliability, military alerts) complete. No scope expansion this run.

---

### Next Session Recommendation

Editing an entry in place (not just delete-and-recreate) is the natural next reliability
step now that entries carry an id end-to-end. A `PUT /logs/:id` extension scoped to
`calendar_entry` metadata (mirroring the new `DELETE` route's ownership + event-type
guard) would close that gap.
