<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Self-Assembly Log — 2026-08-24
## Calendar Widget — Time Tracking · Reliable Due-Firing · Military-Grade Event Notifications

**Session:** Scheduled autonomous session (Calendar widget continuation)
**Date:** 2026-08-24
**Branch:** `claude/dreamy-babbage-htn2u0`
**Base:** `98971f2` (master, post PR #96)
**Status:** DEPLOYED (pushed to branch, TypeScript clean, client build clean)

---

### Brief

> "Please continue the work on the Calendar widget independently. Keep the minimalist UI.
> The foundation for the widget is already there. Make a reliable Calendar widget that
> tracks time and logs into Log with stylish military-grade event notifications. Push a
> full .MD report after each session."

### Sources Read

- `src/client/components/CalendarWidget.tsx` — foundation: month grid, date selection,
  note/task/call entries persisted as `calendar_entry` log events.
- `docs/assembly/2026-04-29_LOT-assembly_v11-journal-depth-calendar-gap.md` — prior
  Calendar work: `recordCalendarSignal`, Pattern 26 (`calendar-gap`), deferred item
  "surface upcoming calendar entries in the System context panel."
- `src/client/components/Logs.tsx` — the "military log handler" convention: each log
  event gets a dedicated renderer, `Block label="XXX:"` format, uppercase/tabular-nums,
  no color, no icons.
- `src/client/components/EvolutionMilestoneToast.tsx` — the one precedent for an
  in-app toast: subtle, bottom-center, fades in/out, no sound, localStorage-driven.
- `src/client/components/About.tsx` — product doctrine, quoted directly: *"Context Over
  Notification — the system surfaces at the right moment. No push. No alert. No
  interruption."* This shaped how "notifications" were interpreted below.
- `src/client/stores/intentionEngine.ts` — `recordCalendarSignal`, QIE signal pipeline.
- `src/client/components/System.tsx` — `upcomingCalendar` Temporal Planner panel.

### Gap Found

The widget could only schedule entries by **date** — no time of day, so "track time"
had nothing to track. `calendar_entry` logs never distinguished morning from evening,
Pattern 26 and the Temporal Planner panel had no way to tell a scheduled call from an
all-day note, and nothing ever closed the loop on whether a scheduled task/call actually
came due while the user wasn't looking (no due-detection, no notification, no log).

### What Was Built

**1. Time-of-day scheduling — `CalendarWidget.tsx`**
`CalendarEntry` gained an optional `time` field (`HH:mm`). The add-entry form shows a
native `<input type="time">` next to the text field, but only for `task` / `call` types
— notes stay all-day, keeping the form minimal for the common case. Time is persisted
in `calendar_entry` metadata and folded into the existing `[SCHEDULE]` log text.

**2. Military T-minus / T-plus countdown**
A small pure function, `getTimeStatus(date, time, now)`, returns `T-02:15` (2h15m out),
`NOW` (within the due window), or `T+00:45` (45m overdue) for any timed entry within a
24h operational window — otherwise `null`, so entries further out stay uncluttered.
Rendered as a single monospace tag at `text-acc/30` (upcoming) or `text-acc/60`
(overdue), no color, no icon — same visual grammar as the rest of the widget.

**3. Reliable due-firing — one Log event per event, guaranteed**
A `useEffect` sweeps `entries` once a minute (plus on every logs refetch) for timed
`task`/`call` entries whose scheduled time has passed. A `calendar_due_fired_v1`
localStorage set guarantees each entry fires its `calendar_event_due` log exactly once,
including for events that came due while the tab was closed — the check is "has this
already fired," not "did we catch it live," so nothing gets silently dropped.
`recordCalendarDueSignal()` feeds the same event into the QIE signal pipeline.

**4. Stylish military-grade Log rendering — `Logs.tsx`**
New `CAL-DUE:` handler renders `calendar_event_due` in the existing military format —
`STATUS / TYPE / ETA` label-value rows, uppercase, tabular-nums — identical grammar to
`CAL-COHR:`, `ARCH-SHIFT:`, `INTENT-X:` and the other 50+ handlers already in the file.
`CAL:` (the existing `calendar_entry` handler) now also shows the time when set.

**5. Subtle toast — `CalendarEventToast.tsx`**
New component, modeled directly on `EvolutionMilestoneToast.tsx`: bottom-center,
bordered, fades in over 0.5s and out after 6s, no sound. Message format is bracket/
military style — `[CAL // DUE] CALL — Follow up with client`. It only fires for events
caught *live* within their first hour of being due (a task overdue by three days because
the tab was closed still logs reliably, per #3, but does not surface a stale toast) —
this was a deliberate reading of the "no push, no interruption" doctrine in About.tsx:
the Log is the reliable, exhaustive record; the toast is the quiet, in-the-moment nudge.
Mounted in `System.tsx` next to `EvolutionMilestoneToast`.

**6. Temporal Planner panel — time surfaced**
`System.tsx`'s `upcomingCalendar` memo (the "Next:" row in the System context panel,
originally deferred in the April 29 session) now sorts by date+time and shows the time
alongside the date when the entry has one.

**7. Reliability fixes to the add-entry flow**
- `Add` button now disables while the mutation is in flight (`isSaving` from
  `useCreateLog`) and reads "Saving…" — prevents duplicate submits on double-click.
- On failure (`onError`), the draft text/time/type are preserved and a quiet inline
  message appears ("Failed to save — try again.") instead of silently clearing the
  form and losing what the user typed — the previous behavior cleared the form
  unconditionally on submit, before the request resolved.
- Entry text is trimmed once and reused consistently between the log body and metadata.

---

### File Changes

| File | Change |
|------|--------|
| `src/client/components/CalendarWidget.tsx` | +`time` field on entries · time input (task/call) · `getTimeStatus` T-minus/T-plus · minute-tick clock · reliable due-firing effect · save-error handling · disabled-while-saving |
| `src/client/components/CalendarEventToast.tsx` | **new** — military-format toast for freshly-due calendar events |
| `src/client/components/Logs.tsx` | `CAL:` handler shows time · new `CAL-DUE:` handler for `calendar_event_due` |
| `src/client/components/System.tsx` | `upcomingCalendar` sorts by date+time, shows time in "Next:" row · mounts `CalendarEventToast` |
| `src/client/stores/intentionEngine.ts` | `recordCalendarSignal()` takes optional `time` · new `recordCalendarDueSignal()` |

---

### Test Results

**TypeScript:** `npx tsc --noEmit -p tsconfig.json` — **128 errors before, 128 after**
(byte-identical baseline via `git stash` comparison). Zero errors in any changed or new
file. All 128 are pre-existing, unrelated infra typing gaps (`AdminUser.tsx`,
`badges.ts`, `router.ts`, etc.).

**Client build:** `npx esr ./scripts/build/client.build.ts -prod` — completed clean.
Two pre-existing esbuild warnings (`quarter_drop`, `elixir_found` duplicate keys in
`badges.ts`) are unrelated to this session's changes.

**Manual reasoning checks:**
- Due-firing is idempotent: `fired` set is read fresh from localStorage each effect
  run and written back after marking, so a re-render or refetch cannot double-fire.
- Firing criterion (`scheduled <= now`) is decoupled from the toast criterion
  (`NOW` window only) — an entry overdue by days still logs once, just without a
  stale toast.
- `upcomingEntries` drops today's timed entries once >30min past, so the widget's own
  list doesn't accumulate stale "upcoming" clutter — matches "reliable" over "complete."
- No new colors, icons, or rounded/filled `Tag` components introduced — countdown tags
  use the existing `text-acc/NN` opacity scale and `tabular-nums`, consistent with the
  rest of the widget and the military log handlers in `Logs.tsx`.

**Not run:** no browser/UI smoke test in this session (headless container, no display).
Logic was verified by reading the rendered JSX and the effect dependency chains, and by
confirming the compiled bundle has no build errors.

---

### What Was Deferred

- No stopwatch-style start/stop timer was added — "track time" was read as *scheduling
  at a specific time + tracking whether it came due*, which is what closes the loop with
  Log. A literal elapsed-time stopwatch for calls is a plausible next step if that's
  the intended reading instead.
- Toast queue (`calendar_due_events`) is capped at 10 and never explicitly drained by
  the reader — same pattern as `evolution_milestones`, left as-is for consistency.
- Did not touch `LOT-LEDGER.md`, badge counts, or QIE pattern/archetype numbering —
  out of scope for a widget-focused session; left for a dedicated wiki/ledger pass.

### Next Session Recommendation

Confirm with the operator whether "track time" should also include an elapsed-time
stopwatch for `call` entries (start/stop, duration logged into `calendar_entry`
metadata) — the current session covers scheduled-time tracking and due-notification,
which is the more defensible reading of "reliable Calendar widget" against the existing
Log-driven architecture, but the two aren't mutually exclusive.
