# LOT SYSTEMS — Calendar Widget v2
**Session Date:** 2026-06-29  
**Branch:** `claude/dreamy-babbage-kqzpd8`  
**Author:** Claude Sonnet 4.6 (S-2 autonomous session)

---

## OBJECTIVE

Harden the Calendar widget into a reliable time-tracking tool that emits stylish military-grade event notifications into the Log. Foundation from v1 was functional but had gaps: the Log renderer barely showed entry data, there was no time support, no live relative-time labels, and no automatic alerts when events were due.

---

## CHANGES DELIVERED

### 1. `src/client/components/CalendarWidget.tsx` — Full rewrite

**Live clock**
- `now` state initialized to `dayjs()`, updated every 60 seconds via `setInterval`
- All relative-time calculations derive from `now`, keeping labels accurate without page reload

**Time field for entries**
- New `entryTime` state (`HH:MM` format, optional)
- Displayed in the creation form as a second input row below the text field
- Stored in log metadata as `time` when provided
- Displayed alongside entries in the selected-date view and upcoming list

**Relative labels** (`getRelativeLabel`)
- `TODAY` / `TMR` / `IN Xd` / `IN 1W–3W` / `IN XM`
- Applied to each upcoming entry in the future list
- Today's entries get their own dedicated "Today" section header, always visible

**`calendar_alert` auto-fire**
- On mount, after entries load, checks if today or tomorrow has scheduled events
- Fires `calendar_alert` log event with `period`, `eventCount`, `events[]` metadata
- Throttled to once per calendar day via `localStorage` key `lot_cal_alert_YYYY-MM-DD`
- `alertFiredRef` prevents duplicate fires within the same React lifecycle

**Entry type display**
- `TYPE_CODE` map: `note → NOTE`, `task → TASK`, `call → CALL`
- Replaced raw lowercase type names with military codes throughout the UI

**Upcoming list**
- Separated into `todayUpcoming` (shown with "Today" header, full opacity) and `futureUpcoming` (relative labels, reduced opacity)
- Entries sorted by date then time when both are present

---

### 2. `src/client/components/Logs.tsx` — Two renderer upgrades

**`calendar_entry` (replaced)**

Before (minimal, missing entry text):
```
CAL:
  TASK
  2026-07-04
```

After (full military-grade block):
```
CAL [TASK]:
  TEAM MEETING WEDNESDAY
  DATE     04 Jul 2026
  TIME     14:00
  STATUS   IN 5D
```
- Label now includes type code: `CAL [NOTE]:`, `CAL [TASK]:`, `CAL [COMM]:`
- Entry text shown prominently (`uppercase tracking-widest`)
- DATE / TIME / STATUS displayed as key:value rows
- STATUS codes: `TODAY`, `TMR`, `T+Xd` (future), `T-Xd` (past)

**`calendar_alert` (new)**
```
CAL [ALERT]:
  EVENTS TODAY
  COUNT    2
  NOTE     Morning standup
  TASK     14:00  Submit report
```
- Fires once per day when today or tomorrow has calendar events
- Lists each event with type code and optional time

---

### 3. `src/server/routes/api.ts` — Displayable events

Added `'calendar_alert'` to the `displayableEvents` array so the alert log entries surface in the Log feed.

---

## ARCHITECTURE NOTES

- `calendar_alert` is client-generated (fires from CalendarWidget on mount), not a server job
- localStorage key `lot_cal_alert_YYYY-MM-DD` ensures idempotency across sessions
- The `alertFiredRef` protects against the effect re-running when entries update (e.g. user adds a new entry)
- No new server routes or migrations required — the existing `/api/logs` POST handles `calendar_alert` events identically to all other event types

---

## DOCTRINE UPDATES

**MINIMALISM PRESERVED:** No new UI surfaces, no modals, no sidebars. All new information flows through existing Log and widget infrastructure.

**RELIABILITY PATTERN:** Client-side time tracking via `setInterval(60s)` + `dayjs` is sufficient for day-level accuracy. Sub-minute precision not required for calendar use cases.

**ALERT DESIGN:** One alert per day, scoped to today or tomorrow. Not a spam vector. User sees it in the Log as a military event notification, same visual weight as badge unlocks or QOS events.

---

## FILES MODIFIED

| File | Change |
|------|--------|
| `src/client/components/CalendarWidget.tsx` | Full rewrite — live clock, time support, relative labels, alert firing, today section |
| `src/client/components/Logs.tsx` | `calendar_entry` renderer upgraded; `calendar_alert` renderer added |
| `src/server/routes/api.ts` | `calendar_alert` added to displayable events list |
| `docs/assembly/2026-06-29_LOT-calendar-widget-v2.md` | This report |

---

*LOT® Systems Corporation — Made in the USA*
