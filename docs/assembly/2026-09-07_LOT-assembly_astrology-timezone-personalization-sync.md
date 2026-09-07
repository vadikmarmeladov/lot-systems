# LOT Self-Assembly Session Report
## 2026-09-07 | Astrology Widget — TimeZone Personalization + Deeper Sync | v2

**Branch:** `claude/practical-curie-cveie9`
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

This is the second dated session against this feature. The first
(`2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`) built the
QIE signal wiring, the Logs `context` sync, the 15-minute recompute cadence,
and surfaced `moonIllumination`. It left three explicit items in its
**PENDING / FUTURE WORK** section; no benchmark/assembly session touched this
feature between then and today (last ledger entry: 2026-08-05), so this
session picks up directly from that list.

---

## PHASE 0 — ORIENTATION / UNDERSTANDING

Re-verified the full map of the feature is unchanged in shape since the last
session (see prior report for the complete table):

| Piece | Location | Role |
|---|---|---|
| Math | `src/shared/utils/astrology.ts` | `getHourlyZodiac`, `getWesternZodiac`, `getRokuyo`, `getMoonPhase`, `getMoonEmoji`, `getJapaneseZodiac` (isomorphic, no external API, no birth data) |
| Compute site | `src/client/components/System.tsx` | `astrology` useMemo, 15-min recompute tick |
| Signal bus | `src/client/stores/intentionEngine.ts` (QIE) | `astrology` Tier 0 source, consumed by `system`, `cosmic` |
| Logs | `src/server/utils/logs.ts` `getLogContext(user)` | Snapshots `astroRokuyo/astroMoonPhase/astroMoonIllumination/astroHourlyZodiac/astroWesternZodiac` onto every `Log.context`, already timeZone-aware server-side |

What had **not** shipped yet, read directly off the prior session's pending
list:

1. The client-side dashboard `astrology` useMemo still read `new Date()`
   (device-local time) even though the server-side Logs snapshot had been
   timeZone-aware since the last session — a personalization gap between the
   two surfaces of the same feature.
2. `getMoonEmoji` (already written, exported) was still unused anywhere in
   the codebase — the dashboard and the journal both showed illumination as a
   bare percentage with no moon glyph.
3. `astrology` was a QIE Tier 0 source but was not yet wired as a dependency
   of any *decision-facing* widget (only `system`/`cosmic`, both
   display/theme aggregates) — there was no widget in the dependency graph
   positioned to eventually react to the `auspicious` (Taian) flag that
   `recordAstrologySignal` already emits.

Also confirmed: `/api/me` (`useProfileView()` on the server `User` model,
consumed by the client as `stores.me`) did not expose `timeZone` at all —
so even fixing the client useMemo required first widening the profile
payload. No natal-chart fields exist anywhere in the `User` model or
`UserProfile`/`User` shared types; the feature remains strictly
ambient/environmental by design, unchanged this session.

---

## PHASE 1 — BUILD

### 1. Closed the timeZone personalization gap (client ↔ server parity)

Pending item #1 from the last session, closed end to end:

- `src/server/models/user.ts` — added `'timeZone'` to the `fp.pick([...])`
  list in `useProfileView()`, so `/api/me` now returns it.
- `src/shared/types/index.ts` — added `timeZone?: string | null` to
  `UserProfile`.
- `src/client/utils/dayjs.ts` — added the `dayjs/plugin/timezone.js` plugin
  (alongside the existing `utc` plugin already loaded), mirroring what
  `#server/utils/dayjs` already has, so `.tz(...)` is now available
  client-side.
- `src/client/components/System.tsx` — the `astrology` useMemo now checks
  `me?.timeZone` (the `stores.me` atom, already read into this component at
  line 105) and, when present, builds the reading from the user's saved
  timeZone using the same wall-clock-passthrough trick as the server's
  `toWallClockDate()` in `getLogContext`:

  ```ts
  const local = dayjs().tz(me.timeZone as string)
  const now = new Date(local.year(), local.month(), local.date(), local.hour(), local.minute(), local.second())
  ```

  Falls back to `new Date()` (device-local) when no timeZone is saved yet —
  unchanged behavior for users who haven't set city/country. The useMemo's
  dependency array now includes `me?.timeZone` alongside the existing
  `astrologyTick`, so switching timeZone (a settings change) immediately
  re-derives the reading rather than waiting for the next 15-minute tick.

Net effect: the dashboard's live astrology reading and the astrology
snapshot stamped onto new Logs entries are now computed from the *same*
timeZone for a given user, closing the drift the prior session flagged but
deliberately deferred.

### 2. Surfaced the moon emoji (pending item #2)

`getMoonEmoji` was written and exported in the July session but never
called. Wired it into both surfaces that already display `moonPhase`:

- `System.tsx` — the `astrology` useMemo now also returns `moonEmoji:
  getMoonEmoji(moonPhase.phase)`; both render sites (the compact `Block
  label="Astrology:"` and the cycling "pro" block) now show `{moonEmoji}
  {moonPhase} ({moonIllumination}%)` instead of the bare text.
- `Logs.tsx` — the `SYS:` block's `ASTRO:` line now also renders the emoji
  next to `astroMoonPhase`, and additionally surfaces
  `astroMoonIllumination` (which was captured in every log's `context` since
  the last session but never rendered in the journal — same class of "computed
  but discarded" gap as the illumination bug fixed for the dashboard in July).

### 3. Deeper widget synchronization

Pending item #3 territory, taken one deliberate step rather than the full
pattern-mint the July session explicitly deferred (minting a new QIE
pattern/archetype still needs its own dedicated benchmark session — wiki +
doctrine + lexicon + Field Manual version bump — and is **not** done here,
same call as last time):

`src/client/stores/intentionEngine.ts` — added `'astrology'` as a dependency
of `planner` in `WIDGET_DEPENDENCY_MAP`:

```ts
planner: ['mood', 'intentions', 'astrology'], // (2026-09-07 audit) auspicious-day (Taian) awareness for future planning nudges
```

`planner` was chosen over `cosmic`/`system` (already wired) because it is a
decision-facing widget rather than a display aggregate — this is the natural
consumer for the `auspicious` flag `recordAstrologySignal` has been emitting
since July once a dedicated pattern reacts to it. Verified this doesn't
change `planner`'s dependency tier (`getWidgetTier`): `astrology` is Tier 1
(no deps of its own), and `intentions` was already Tier 2, so the max stays
the same — this is a pure dependency-graph/cascade-invalidation addition,
not a behavior change for any widget today.

### 4. Logs synchronization — extended, not just maintained

Beyond the emoji/illumination surfacing in item 2 above, verified the
existing sync is still intact: `getLogContext(user)` (unchanged this
session) remains the single call site (~17 log-creation paths in `api.ts`)
that snapshots the ambient astrology reading onto every new `Log.context`,
timeZone-aware via the user's saved `timeZone` — now provably the same
timeZone the dashboard itself reads, per item 1.

---

## PHASE 2 — TEST

`node_modules` was absent at session start (fresh container); restored with
the same workaround as the July session:

```
npm install --legacy-peer-deps   -> 702 packages installed
npm run server:build             -> PASS (tsc --project tsconfig.server.json)
npm run client:build             -> PASS (postcss + esbuild client bundle)
```

Also ran a full strict `tsc --noEmit` pass against `tsconfig.json` (not part
of the normal build pipeline — the client build is esbuild-transpile only,
no type-check gate) to double-check this session's edits specifically:
confirmed 104 pre-existing strict-mode errors across the codebase,
**none in any file or line touched this session** (`dayjs.ts`, `user.ts`,
`shared/types/index.ts` show zero errors; the errors reported in
`System.tsx`/`Logs.tsx` are all pre-existing, on lines unrelated to the
astrology edits — verified by line number).

Zero errors attributable to this session's changes.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % + emoji — all pure date-math, no
  external API, no personal birth data.
- **Personalization anchor:** both the client dashboard display and the
  server-side Logs snapshot now read the ambient reading from the user's
  saved `timeZone` (exposed via `/api/me` → `UserProfile.timeZone` →
  `stores.me`), falling back to device-local time only when no timeZone is
  saved. Previously only the Logs side was timeZone-aware; this was the
  single largest personalization gap left standing.
- **Freshness:** recomputes every 15 minutes while the tab is visible, or
  immediately on a timeZone change (settings update), instead of only once
  per mount/tick.
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`); now consumed (per the dependency graph) by `system`,
  `cosmic`, and `planner`; emits one `ambient_reading` signal per calendar
  day, including an `auspicious` (Taian-day) flag `planner` is now
  positioned to react to once a dedicated pattern is authored.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the ambient astrology reading at creation time (timeZone-aware,
  matching the dashboard); the journal's `SYS:` block now renders the moon
  emoji and illumination percentage alongside rokuyo and phase, matching the
  dashboard's display richness rather than a stripped-down subset of it.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental.
- **Not implemented (deliberately deferred, same call as July):** a
  dedicated QIE pattern/archetype reacting to `astrology` + `goals`/
  `intentions` together (e.g. a gentle nudge on Taian days) — the dependency
  graph is now one step closer (`planner` is wired) but minting the pattern
  itself needs a dedicated benchmark session (pattern number, wiki +
  doctrine + lexicon + Field Manual sync).

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-cveie9
Files changed: 6
  src/client/components/System.tsx        MODIFIED
  src/client/components/Logs.tsx          MODIFIED
  src/client/stores/intentionEngine.ts    MODIFIED
  src/client/utils/dayjs.ts               MODIFIED
  src/server/models/user.ts               MODIFIED
  src/shared/types/index.ts               MODIFIED
  docs/assembly/2026-09-07_LOT-assembly_astrology-timezone-personalization-sync.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author the dedicated QIE pattern that reacts to `astrology` (specifically
  the `auspicious` Taian-day flag) together with `goals`/`intentions` —
  still needs the full self-assembly treatment (pattern number, archetype/job
  wiring if warranted, wiki + doctrine + lexicon + Field Manual sync).
  `planner` is now wired as a dependent, which is the prerequisite for this.
- `getJapaneseZodiac` (year-based animal) remains unused; still a candidate
  for a future opt-in personalization pass (e.g. "your birth-year animal")
  but out of scope while the feature stays strictly ambient — would require
  adding an optional birth-year field to the `User` model, which does not
  exist today.
- Consider whether other Tier-1+ widgets beyond `planner` (e.g. `journal`,
  which already threads through `mood`/`planner`) should also declare
  `astrology` as a dependency once the auspicious-day pattern actually
  exists — premature to wire further consumers before there is a signal
  worth cascading.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
