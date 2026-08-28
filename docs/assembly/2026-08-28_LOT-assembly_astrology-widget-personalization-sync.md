# LOT Self-Assembly Session Report
## 2026-08-28 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-gbp7pc`
**Base commit:** `98971f2`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Live site access:** not attempted — all work sourced from repo inspection

---

## MISSION BRIEF

Standing recurring instruction: continue evolving the Astrology block (today's
zodiac hour, moon phase, rokuyo — ambient conditions, not a personal natal
chart) for user personalization and synchronization with other widgets, keep
it synchronized with Logs entries, and push a full understanding + features
breakdown document each session.

This is the second recorded session on this feature. The first
(`2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`) built
the periodic-recompute fix, wired `astrology` into the QIE signal bus, and
synchronized the reading into every `Log` row's `context`. All of that work
is confirmed merged and live on `master` as of this session's base commit
(`b75f65b feat(astrology): personalize, sync with QIE + Logs, fix staleness`,
merged via `73edd95`).

---

## PHASE 0 — ORIENTATION / RE-VERIFICATION

Re-audited the full feature map against the codebase rather than trusting
the prior doc's claims at face value:

| Piece | Location | Status confirmed |
|---|---|---|
| Math | `src/shared/utils/astrology.ts` | Unchanged: `getHourlyZodiac`, `getWesternZodiac`, `getRokuyo`, `getMoonPhase`, `getJapaneseZodiac`, `getMoonEmoji` |
| Compute site | `System.tsx` `astrology` useMemo | Confirmed ticking on `astrologyTick` (15-min interval, off-tab paused) — the staleness fix from session 1 is live |
| QIE signal | `intentionEngine.ts` `recordAstrologySignal` | Confirmed registered as Tier 0 source, `system`/`cosmic` depend on it, fires once/day via localStorage date-stamp guard |
| Logs sync | `src/server/utils/logs.ts` `getLogContext` | Confirmed `astroRokuyo`/`astroMoonPhase`/`astroMoonIllumination`/`astroHourlyZodiac`/`astroWesternZodiac` snapshot on every log, timeZone-aware, rendered in `Logs.tsx`'s `SYS:` block |

Two gaps found that session 1 did not touch:

1. **`getJapaneseZodiac` and `getMoonEmoji` were still dead code.** Session 1
   flagged both as "candidates for a future personalization pass" and left
   them unused. `getJapaneseZodiac(year)` does not need birth data to be
   useful — applied to the *current* calendar year it is exactly the same
   kind of ambient/calendar fact as rokuyo or moon phase (e.g. "2026 is the
   Year of the Horse"), not personalization requiring data the User model
   doesn't have.

2. **A second "astrology" surface in the app was disconnected from the real
   engine.** `QuantumSignWidget.tsx` (the "Quantum Sign" subscriber-retention
   widget) has a `patches` view whose own header explicitly says it
   "surfaces new Astrology and Psychology patches." Its astrology patch list
   was four hardcoded placeholders — `Lunar Reset`, `Solar Return`,
   `Mercury Direct`, `Venus Transit` — rotated only by day-of-year, with zero
   connection to `astrology.ts`, the QIE signal, or the dashboard's actual
   reading. Worse: `Solar Return` is described as "Birthday energy cycle —
   annual self-renewal," i.e. natal-chart-flavored personalization content
   presented as real, when no birth date field exists anywhere in the `User`
   model (re-confirmed this session — still zero hits for
   birthDate/birthYear/birthPlace/natal). This directly contradicts the
   standing instruction's own framing (ambient conditions only, never a
   personal natal chart) and meant two widgets in the same dashboard could
   show contradictory "astrology" content on the same day.
   `WIDGET_DEPENDENCY_MAP` also listed `quantumSign: ['intentions', 'memory']`
   — no `astrology` entry — so the dependency graph had no way of knowing
   these two widgets were (nominally) related.

---

## PHASE 1 — BUILD

### 1. Surfaced the year zodiac animal (retires dead code, adds a real ambient fact)

`System.tsx`: the `astrology` useMemo now also computes
`yearZodiac = getJapaneseZodiac(now.getFullYear())` and
`moonEmoji = getMoonEmoji(moonPhase.phase)`. Both render sites (compact
layout + cycling "pro" block) now read:

```
{westernZodiac} • {hourlyZodiac} • Year of the {yearZodiac} • {rokuyo} • {moonEmoji} {moonPhase} ({moonIllumination}%)
```

`getMoonEmoji` was already imported nowhere; `getJapaneseZodiac` had never
been called outside its own definition. Both are now load-bearing.

### 2. Threaded `yearZodiac` through the QIE signal and Logs (closing the loop, not just the dashboard)

- `intentionEngine.ts`: `recordAstrologySignal` takes an optional 6th
  `yearZodiac` argument, stored in the `ambient_reading` signal's metadata
  alongside the existing fields.
- `System.tsx`: the once-per-day recording effect passes `astrology.yearZodiac`
  through, and its dependency array now includes it (so a date-boundary
  crossing that only changes the year — new year's day — still triggers a
  fresh record instead of skipping via a stale closure).
- `src/server/utils/logs.ts`: `getLogContext` computes and stores
  `astroYearZodiac` on every log row (same `toWallClockDate`,
  user-timeZone-aware pattern as the other four `astro*` fields).
- `src/shared/types/index.ts`: `LogContext.astroYearZodiac?: string | null`.
- `src/client/components/Logs.tsx`: the `SYS:` block's `ASTRO:` line now
  appends `· Year of the {astroYearZodiac}` when present.

### 3. Fixed the QuantumSignWidget synchronization gap

`QuantumSignWidget.tsx`: replaced the fabricated day-of-year astrology
placeholder list with a computation that calls the *same* `getRokuyo` /
`getMoonPhase` / `getMoonEmoji` functions the dashboard and Logs use, for
`new Date()` at render time. The patch now shows today's real rokuyo name,
a short meaning (`ROKUYO_MEANING` map — six real entries, one per rokuyo
value, mirroring the comments already in `astrology.ts`), and the real moon
phase + illumination + emoji. `Solar Return`, `Mercury Direct`, and
`Venus Transit` — none of which had any backing computation, and one of
which implied birth-date personalization that does not exist in this
system — are gone. `Lunar Reset` as an arbitrary label is gone too; the
widget now states the actual astronomical/calendrical fact instead of a
themed label standing in for it.

`intentionEngine.ts`: `WIDGET_DEPENDENCY_MAP.quantumSign` now includes
`'astrology'` (dated `2026-08-28 audit`, matching the file's existing
audit-comment convention), so `getWidgetsDependingOn('astrology')` correctly
reports `quantumSign` alongside `system` and `cosmic` — the dependency graph
now matches what the widget actually renders.

Net effect of this item: there is now exactly one ambient astrology reading
computed from exactly one set of pure functions, consumed identically by
the System dashboard, the QIE signal bus, the Logs journal, and the
QuantumSignWidget patch view. No surface in the app can show a different
"today's astrology" than any other.

---

## PHASE 2 — TEST

```
npm install --legacy-peer-deps   -> OK (node_modules was absent in this
                                     session's container; same pre-existing
                                     @nanostores/react peer-conflict
                                     workaround as session 1, unrelated to
                                     this session's changes)
npm run server:build             -> PASS (tsc --project tsconfig.server.json)
npm run client:build             -> PASS (postcss + esbuild client bundle)
```

Two pre-existing esbuild warnings (`duplicate-object-key` on
`quarter_drop` / `elixir_found` in `src/client/utils/badges.ts`) are
unrelated to this session — confirmed by `git diff --stat`, which shows
only the six files this session touched. Zero errors or new warnings
attributable to this session's changes.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, current-year Japanese zodiac
  animal (new this session), rokuyo (six-day auspicious cycle), moon phase +
  illumination % + emoji — all pure date-math, no external API, no personal
  birth data.
- **Single source of truth:** `src/shared/utils/astrology.ts` is now
  genuinely the only place these values are computed. Every consumer
  (System dashboard, QIE signal, Logs snapshot, QuantumSignWidget patch)
  calls into it directly or reads a signal that was itself computed from it
  — no independent/fabricated astrology content remains anywhere in the
  codebase.
- **Personalization anchor:** ambient reading is timeZone-aware wherever a
  server-side user context exists (Logs); client-side dashboard and
  QuantumSignWidget still use device-local time (unchanged from session 1 —
  tracked below as pending).
- **Freshness:** System dashboard recomputes every 15 minutes while the tab
  is visible; QuantumSignWidget computes once per mount (matches its
  existing `quantumSign`/`patches` memo pattern, acceptable since this
  widget is not left open for extended unattended sessions the way the main
  dashboard is).
- **Widget synchronization:** `astrology` is a Tier 0 QIE signal source
  consumed (per the dependency graph) by `system`, `cosmic`, and now
  `quantumSign`; emits one `ambient_reading` signal per calendar day
  including `auspicious` (Taian-day) flag and (new) `yearZodiac`.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the ambient astrology reading at creation time — now five fields
  (`astroRokuyo`, `astroMoonPhase`, `astroMoonIllumination`,
  `astroHourlyZodiac`, `astroWesternZodiac`, plus new `astroYearZodiac`),
  rendered in the journal's `SYS:` block next to weather/location.
- **Cross-widget integrity (new this session):** the QuantumSignWidget's
  astrology patch view can no longer disagree with the dashboard's astrology
  block — both derive from the same function calls for the same date.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign, "Solar
  Return") — the feature remains strictly ambient/environmental. This
  session actively removed content that had drifted toward implying
  birth-data personalization without any backing data.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-gbp7pc
Files changed: 6
  src/client/components/System.tsx            MODIFIED
  src/client/components/QuantumSignWidget.tsx MODIFIED
  src/client/components/Logs.tsx              MODIFIED
  src/client/stores/intentionEngine.ts        MODIFIED
  src/server/utils/logs.ts                    MODIFIED
  src/shared/types/index.ts                   MODIFIED
  docs/assembly/2026-08-28_LOT-assembly_astrology-widget-personalization-sync.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author a dedicated QIE pattern that reacts to the `astrology` signal
  together with `goals`/`intentions` (e.g. a gentle nudge on auspicious/Taian
  days) — still deferred. This requires the full self-assembly treatment
  (new pattern number, wiki + doctrine + lexicon + Field Manual version
  bump, `About.tsx` pattern-count updates) which is out of scope for this
  lighter recurring routine; belongs to a dedicated benchmark session.
- Client-side dashboard and QuantumSignWidget still read device-local time
  rather than the user's saved `timeZone` (only the server-side Logs
  snapshot is timeZone-aware). Worth revisiting if/when a client-side
  profile query for `timeZone` becomes cheap to call from these components.
- Consider whether the psychology-patch rotation in `QuantumSignWidget`
  deserves the same "connect to a real source of truth" treatment this
  session gave the astrology patch — currently still a plain day-of-year
  rotation over four hardcoded labels with no backing computation. Out of
  scope for an astrology-focused session but the same class of issue.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
