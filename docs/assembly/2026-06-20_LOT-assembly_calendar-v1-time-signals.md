# LOT ASSEMBLY SESSION REPORT
## Calendar Widget — Time Tracking + Military-Grade Signal Notifications
### 2026-06-20 | Branch: `claude/dreamy-babbage-o0hccu`

---

## MISSION

Extend the existing CalendarWidget foundation into a reliable time-aware scheduling system with military-grade notification logging. Preserve minimalist UI. No new dependencies.

---

## PREFLIGHT — SYSTEM STATE READ

**Files surveyed:**
- `src/client/components/CalendarWidget.tsx` — 282 lines, entry types note/task/call, no time field, no active status labels, no notification logging
- `src/client/queries.ts` — `useLogs()` returns `Log[]` with `createdAt: Date`; `useCreateLog()` accepts `{ text, event, metadata }`
- `src/shared/types/index.ts` — `Log.createdAt: Date` confirmed
- `src/client/components/ui/Block.tsx` — minimalist label+content layout, blockView prop
- `src/client/stores/intentionEngine.ts` — signal architecture, QIE patterns 1–26
- `docs/assembly/2026-04-29_LOT-assembly_v11-journal-depth-calendar-gap.md` — Pattern 26: `calendar-gap` — no entries in 7 days → planner intervention

**Baseline widget capabilities:**
- Month grid navigation with ISO week alignment
- Click date → toggle selection → show entry form
- Entry types: note / task / call
- Persists via `createLog({ event: 'calendar_entry', metadata: { date, text, entryType } })`
- Shows upcoming entries (date ≥ today, next 10) below grid
- No time field. No status labels. No notification signals.

**Pre-existing TS environment issues (not introduced by this session):**
- Missing type definitions: argparse, bluebird, debug, ejs, estree, ms, node, prop-types, react-dom, seedrandom, sequelize
- Deprecated tsconfig options: baseUrl, moduleResolution=node10
- Zero CalendarWidget-specific TS errors before or after changes

---

## DELTA — CHANGES APPLIED

**File modified:** `src/client/components/CalendarWidget.tsx`  
**Lines:** 282 → 344 (net +62, gross: 228 insertions / 59 deletions)

### 1. Time Field on Entries

```typescript
type CalendarEntry = {
  date: string
  time?: string   // ← new: HH:MM, optional
  text: string
  type: EntryType
}
```

Stored in `metadata.time`. Entry form gains a `<input type="time">` field alongside the text input. Entries sort by date then time — chronological precision within a day.

### 2. `getEntryStatus()` — Live Status Engine

```typescript
function getEntryStatus(entry, now): { status: EntryStatus; label: string }
```

Status resolution logic:

| Condition | `status` | `label` |
|---|---|---|
| `entry.date < today` | `overdue` | `OVERDUE` |
| `entry.date === today`, time set, event passed | `elapsed` | `ELAPSED` |
| `entry.date === today`, time set, < 60min away | `today` | `in Xm` |
| `entry.date === today`, time set, ≥ 60min away | `today` | `in Xh` |
| `entry.date === today`, no time | `today` | `TODAY` |
| 1 day out | `tomorrow` | `TOMORROW` |
| N days out | `upcoming` | `in Nd` |

### 3. Live Clock

```typescript
const [now, setNow] = React.useState(() => dayjs())

React.useEffect(() => {
  const id = setInterval(() => setNow(dayjs()), 60_000)
  return () => clearInterval(id)
}, [])
```

Status labels update every 60 seconds without page reload. `today` string is derived from `now` so the widget date-rolls correctly at midnight.

### 4. Military-Grade Notification Logging

**Auto-fires on mount** for all calendar entries with `date ≤ today` that have not yet been logged as `calendar_notification` today.

**Deduplication mechanism:**
- `notifiedTodayIds` — derived from `useLogs()`: all `calendar_notification` events created today, keyed as `${date}|${entryType}|${originalEntryText}`
- `notifyingRef` — in-flight Set prevents duplicate fire between React render and query refetch
- Pure server-side source of truth, no localStorage dependency

**Log format emitted:**
```
[SIGNAL] CALENDAR — {TYPE}: {text} — STATUS: {label} (YYYY-MM-DD HH:MM)
event: calendar_notification
metadata: {
  date, time, entryType,
  status,                    // the label string: "OVERDUE", "TODAY", "in 3h", etc.
  originalEntryText
}
```

Examples:
```
[SIGNAL] CALENDAR — TASK: Submit quarterly report — STATUS: OVERDUE (2026-06-18)
[SIGNAL] CALENDAR — CALL: Dr. Petrov — STATUS: TODAY (2026-06-20 09:00)
[SIGNAL] CALENDAR — NOTE: Team sync — STATUS: in 2h (2026-06-20 14:30)
```

### 5. Active Briefing Panel

Always-visible section above calendar when there are today/overdue entries:

```
OVERDUE  [TASK]  Submit report
TODAY    [CALL]  Dr. Petrov          09:00
in 2h    [NOTE]  Team sync           14:30
```

Overdue/elapsed entries: `line-through` + `text-acc/40`. Active entries: full `text-acc`.

### 6. Upcoming Entries — Enhanced Row Format

Before: `Tuesday, June 25, 2026  ·  entry text`

After: `Tue, Jun 25  ·  14:30  ·  in 5d  ·  [TASK]  ·  entry text`

All inline, minimal, scannable. Abbreviated date format reduces width pressure.

### 7. Calendar Grid — Past Date Dimming

Past dates in current month now render at `text-acc/20` (previously same `text-acc/40` as future dates). Visual separation: past → dim / today → full / future → mid.

### 8. Type Codes

```typescript
const TYPE_CODE: Record<EntryType, string> = {
  note: 'NOTE',
  task: 'TASK',
  call: 'CALL',
}
```

Used consistently across: notification logs, briefing panel, upcoming list, selected-date entries. Entry creation log text updated: `[SCHEDULE] TASK: text (date)` instead of lowercase `task`.

---

## SIGNAL INTEGRATION

| New Log Event | Trigger | Frequency |
|---|---|---|
| `calendar_notification` | Widget mount when `date ≤ today` entries exist | Once per entry per day |

This extends the QIE signal surface — `calendar_notification` events are now queryable for Pattern analysis (e.g., extend Pattern 26 to also detect entries that fired OVERDUE multiple days in a row → intervention: "You have recurring overdue tasks. Consider scheduling a review.").

---

## SYSTEM CHECKS

- TypeScript: 0 CalendarWidget-specific errors
- Pre-existing environment errors: unchanged (not introduced by this session)
- No new dependencies added
- No breaking changes to existing `calendar_entry` log format (new `time` field is optional)
- Backward-compatible: old entries without `time` in metadata render correctly

---

## COMMIT

```
c68ff98  feat(calendar): time tracking + military-grade notification logging
Branch: claude/dreamy-babbage-o0hccu
```

---

## DEFERRED / NEXT

- **Pattern 27 candidate:** detect repeated OVERDUE on same entry → surface intervention in planner widget
- **`calendar_update` event:** implement edit/delete for existing entries (currently append-only)
- **Recurrence:** weekly/monthly recurring entries (stored as recurrence rule in metadata)
- **Cross-widget:** feed upcoming tasks into intentions widget "scheduled today" section
- **QOS coherence:** calendar entries within 24h window count toward `intentional` dimension of UserIndex

---

*LOT Systems Corporation · Vadim Marmeladov, CEO · Built in the USA*
