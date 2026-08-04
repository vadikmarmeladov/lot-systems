# LOT Self-Assembly Session Report
## 2026-08-04 | Astrology Widget — TimeZone Personalization + Alignment Signal | v2

**Branch:** `claude/practical-curie-t6y2td`
**Base commit:** `8f6205e`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Live site access:** not attempted — all work sourced from repo inspection
**Prior session:** `2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md` (v1, merged via PR #92)

---

## MISSION BRIEF

Standing recurring instruction: continue evolving the Astrology block (today's
zodiac hour, moon phase, rokuyo — ambient conditions, not a personal natal
chart) for user personalization and synchronization with other widgets, keep
it synchronized with Logs entries, and push a full understanding + features
breakdown document each session.

---

## PHASE 0 — ORIENTATION / UNDERSTANDING

Started by re-reading v1's session report and confirming its diff is fully
merged into `master` (commit `b75f65b feat(astrology): personalize, sync with
QIE + Logs, fix staleness`, PR #92). Verified all five v1 outcomes present in
the current tree before adding anything:

| v1 outcome | Verified at |
|---|---|
| 15-min recompute tick, off-tab safe | `System.tsx` — `astrologyTick` state + `setInterval` gated on `!document.hidden` |
| Moon illumination surfaced | Both render sites show `{moonPhase} ({moonIllumination}%)` |
| QIE signal bus wiring | `intentionEngine.ts` — `'astrology'` in `IntentionSignal['source']`, `WIDGET_DEPENDENCY_MAP.astrology = []`, `system`/`cosmic` depend on it, `recordAstrologySignal()` |
| Daily signal recording | `System.tsx` `useEffect` + `localStorage` date-stamp guard |
| Logs sync | `LogContext.astroRokuyo/astroMoonPhase/astroMoonIllumination/astroHourlyZodiac/astroWesternZodiac`, `getLogContext()` populates all five, `Logs.tsx` rendered only `astroRokuyo`/`astroMoonPhase` |

v1 left three explicit PENDING items, which framed this session's scope:

1. Author a dedicated QIE pattern correlating the `astrology` signal with
   `goals`/`intentions` (deferred as "needs the full self-assembly
   treatment").
2. Client-side dashboard display still used device-local time — no
   `user.timeZone`-aware reading, unlike the server-side Logs path.
3. `getJapaneseZodiac` and `getMoonEmoji` remain unused (out of scope while
   ambient-only).

Investigated item 2 first since it's the clearest personalization gap. Traced
`user.timeZone` end to end:

- `User` model (`src/server/models/user.ts`) has `timeZone: string | null`,
  **auto-derived** server-side whenever a user saves `city` + `country` in
  Settings (`src/server/routes/api.ts:584-599` geocodes via
  `weather.getCoordinates` → `weather.getTimeZone`, not user-entered).
- `getLogContext()` already reads `user.timeZone` for the server-side
  astrology snapshot (v1's Logs sync).
- But `User.useProfileView()` — the function that shapes what `/me` sends to
  the client (`UserProfile`) — never picked `timeZone` into the payload. The
  client-side `me` store (`src/client/stores/state.ts`) therefore had no way
  to know it, which is exactly why v1's dashboard fell back to
  `new Date()` (device-local) instead of matching the Logs behavior.

This made item 2 a small, well-scoped, high-value fix rather than a new
feature: the data already exists and is already computed correctly
server-side, it just wasn't threaded through to the one place that needed it.

Also confirmed item 1's scope boundary is real, not just caution: the
codebase's QIE pattern catalog (`P1`–`P139` at session start, tracked in
`SystemProgressWidget.tsx`'s `SESSION_REPORTS` changelog, `About.tsx`'s Field
Manual version/day/archetype/job counters, and `docs/wiki/LOT-WIKI-vNN.md`)
is a heavyweight, cross-file versioned ceremony — minting a numbered pattern
means bumping FM version, day counter, archetype/job counts, wiki lexicon,
and `LOT-LEDGER.md` in lockstep, or the catalog goes inconsistent. That
ceremony belongs to the `lot-benchmark` skill's explicit "Benchmark" trigger,
not to this recurring astrology-scoped routine. v1 deferred it for the same
reason and that boundary was respected again this session — see "Deliberately
not done" below for what was built instead.

---

## PHASE 1 — BUILD

### 1. TimeZone-aware dashboard reading (closes v1 pending item 2)

- **`src/shared/utils/astrology.ts`**: extracted the wall-clock-passthrough
  helper that v1 added inline in `server/utils/logs.ts` into a shared,
  duck-typed `toWallClockDate(moment)` (accepts anything with
  `year()/month()/date()/hour()/minute()/second()`, so it works against
  either the client or server's separately-configured `dayjs` instance
  without importing `dayjs` into the isomorphic `shared/` layer). This is a
  pure dedup — same logic, one definition, importable from both sides —
  and is a prerequisite for computing the client reading the same way the
  server already does for Logs.
- **`src/server/utils/logs.ts`**: now imports `toWallClockDate` from
  `#shared/utils/astrology` instead of defining its own copy. No behavior
  change.
- **`src/shared/types/index.ts`**: added `timeZone?: string | null` to
  `UserProfile` (the `/me` payload shape).
- **`src/server/models/user.ts`**: added `'timeZone'` to the `fp.pick([...])`
  list in `useProfileView()`, so `/me` now includes it. Everything else about
  the endpoint is unchanged — this is additive, no existing field moved or
  renamed.
- **`src/client/utils/dayjs.ts`**: added `dayjs/plugin/timezone.js`,
  extended the same way `src/server/utils/dayjs.ts` already does (mirrored,
  not reinvented), so `dayjs().tz(...)` is now available client-side.
- **`src/client/components/System.tsx`**: the `astrology` `useMemo` now
  builds its `now` from `me?.timeZone ? toWallClockDate(dayjs().tz(me.timeZone)) : new Date()`
  instead of always `new Date()`. Added `me?.timeZone` to the dependency
  array alongside the existing `astrologyTick`. Users with no saved
  city/country (hence no derived `timeZone`) keep the exact previous
  behavior — this is additive personalization, not a behavior change for
  users who haven't set a location.

Net effect: the dashboard's Astrology block and the Logs snapshot now read
from the **same timeZone source** for a given user, closing the asymmetry v1
flagged. A user viewing the dashboard from a different device timezone than
their saved profile now sees a reading consistent with what gets written into
their journal, rather than two different readings depending on which surface
they're looking at.

### 2. Auspicious-alignment signal (partial progress on v1 pending item 1, without the full pattern-catalog ceremony)

Rather than mint a numbered `PXXX` pattern (out of scope per Phase 0), added
one self-contained derived signal using the same lightweight idiom already
present in the codebase for `checkCentennialConvergence()` /
`recordQOSCoherence()` — functions that read the signal bus directly instead
of requiring counts threaded in from a specific widget's render tree.

**`src/client/stores/intentionEngine.ts`** — new `checkAuspiciousAlignment()`:
- Reads the trailing 24h of signals from the `intentionEngine` store.
- Finds today's most recent `astrology` / `ambient_reading` signal (written
  by v1's `recordAstrologySignal`) and checks its `auspicious` flag (true on
  Taian/大安 days — already computed in v1, just unused downstream until now).
- If auspicious, and the trailing 24h contains at least one `goals` or
  `intentions` source signal, records a new `intentions` / `auspicious_alignment`
  signal with `{ rokuyo, moonPhase, engagedSources, hour }` metadata.
- Guards against recording more than once per day (checks whether an
  `auspicious_alignment` signal already exists in the day's window).
- Returns `false` (no-op) on a non-auspicious day, on zero goals/intentions
  engagement, or if already recorded today.

**`src/client/components/System.tsx`**: wired `checkAuspiciousAlignment()`
into the same once-per-day `useEffect` that already calls
`recordAstrologySignal`, immediately after it (so the astrology signal it
depends on is guaranteed to already be in the store). This makes it a **live**
call site, not a documented-but-uncalled helper — several existing engine
functions (e.g. `recordGoalSignal`, `recordIntentionVelocity`) were found
during Phase 0 grepping to be defined but never called from any real
component, which this deliberately avoids repeating.

This is the first signal in the engine that correlates the `astrology`
source with a second module rather than only ever recording the raw ambient
reading — the actual prerequisite v1 was pointing at, delivered at a scope
that doesn't require a Field Manual version bump.

### 3. Fuller Logs synchronization

**`src/client/components/Logs.tsx`** — the `system_snapshot` (`SYS:`) block's
`ASTRO:` line previously rendered only `astroRokuyo` and `astroMoonPhase`,
even though `getLogContext()` has snapshotted all five astrology fields onto
every log since v1. Extended it to render all five:
`{westernZodiac} · {hourlyZodiac} · {rokuyo} · {moonPhase} ({illumination}%)`
— matching the same label convention (`·`-separated, parenthesized
percentage) used elsewhere in the same block for weather fields. No schema
or `LogContext` change needed — this was purely a case of stored data that
wasn't being displayed.

### Deliberately not done this session

- **No numbered QIE pattern (`P140`+), no Field Manual version bump, no wiki
  sync.** `checkAuspiciousAlignment()` is real and live but intentionally
  stays outside that catalog — see Phase 0 for why. If a future session wants
  `auspicious_alignment` promoted into a numbered pattern with a scheduled
  job and doctrine entry, that's a `lot-benchmark`-triggered session, not
  this routine.
- **`getJapaneseZodiac`/`getMoonEmoji` still unused** (v1 pending item 3) —
  still out of scope; the feature remains ambient-only, no birth-year opt-in
  was added.
- **No natal-chart data anywhere** — re-confirmed no birth date/time/place
  fields exist on `User`; this session's personalization is built entirely on
  the already-existing `timeZone` derived from city/country, consistent with
  the standing "ambient conditions, not a personal natal chart" framing.

---

## PHASE 2 — TEST

`node_modules` was absent at session start (fresh container); restored via
`npm install --legacy-peer-deps` (same pre-existing peer-version conflict
noted in v1, unrelated to this session's changes).

```
npm run server:build   -> PASS (tsc --project tsconfig.server.json)
npm run client:build   -> PASS (postcss + esbuild client bundle)
```

Client build emitted one pre-existing warning (`Duplicate key "quarter_drop"`
in `src/client/utils/badges.ts`, lines 3103 and 5390) — present before this
session's changes, not introduced by them, left untouched as out of scope.

Zero errors attributable to this session's changes.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % — all pure date-math, no external API,
  no personal birth data.
- **Personalization anchor:** ambient reading is now timeZone-aware on
  **both** surfaces — the server-side Logs snapshot (since v1) and the
  client-side dashboard display (new this session) — both reading from the
  same `user.timeZone`, itself auto-derived from the user's saved
  city/country. Users with no saved location keep device-local time on the
  dashboard, unchanged from v1.
- **Freshness:** recomputes every 15 minutes while the tab is visible
  (unchanged from v1), now also re-deriving if `me.timeZone` changes (e.g.
  right after a user updates their city/country in Settings).
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`, since v1), consumed by `system` and `cosmic`. New this
  session: `checkAuspiciousAlignment()` — the first signal correlating the
  ambient astrology reading with `goals`/`intentions` engagement, recorded at
  most once per day, live-wired from `System.tsx`.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the full ambient astrology reading at creation time (since v1);
  now the journal's `SYS:` block actually renders all five fields instead of
  two, closing the display gap between what's stored and what's shown.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental.
- **Not implemented (by scope boundary, see Phase 0):** a numbered QIE
  pattern / Field Manual entry for the new alignment signal.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-t6y2td
Files changed: 8
  src/shared/utils/astrology.ts             MODIFIED (+toWallClockDate, shared)
  src/server/utils/logs.ts                  MODIFIED (dedup, uses shared helper)
  src/shared/types/index.ts                 MODIFIED (+UserProfile.timeZone)
  src/server/models/user.ts                 MODIFIED (+timeZone in /me payload)
  src/client/utils/dayjs.ts                 MODIFIED (+timezone plugin)
  src/client/components/System.tsx          MODIFIED (timeZone-aware reading, checkAuspiciousAlignment wired)
  src/client/stores/intentionEngine.ts      MODIFIED (+checkAuspiciousAlignment)
  src/client/components/Logs.tsx            MODIFIED (ASTRO: line shows all 5 fields)
  docs/assembly/2026-08-04_LOT-assembly_astrology-widget-timezone-sync.md  ADDED
```

---

## PENDING / FUTURE WORK

- Promote `auspicious_alignment` into a full numbered QIE pattern (job +
  doctrine + wiki + Field Manual sync) in a dedicated `lot-benchmark`
  session, if the standing instruction's "widget synchronization" goal
  warrants it going further than a live-but-uncataloged signal.
- `getJapaneseZodiac` (year-based animal) and `getMoonEmoji` remain unused;
  still candidates for an opt-in birth-year-animal personalization pass, out
  of scope while ambient-only.
- Consider whether `checkAuspiciousAlignment()`'s "goals/intentions
  engagement in the trailing 24h" heuristic should widen its window (e.g. to
  match the "signal freshness" conventions used by `recordQOSCoherence`) once
  real usage data shows how often it actually fires.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
