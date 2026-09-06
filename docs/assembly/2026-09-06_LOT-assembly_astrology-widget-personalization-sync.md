# LOT Self-Assembly Session Report
## 2026-09-06 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-vb7072`
**Base commit:** `98971f2`
**Prior session:** `docs/assembly/2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Live site access:** not attempted — all work sourced from repo inspection

---

## MISSION BRIEF

Standing recurring instruction (unchanged since 2026-07-27): continue
evolving the Astrology block (today's zodiac hour, moon phase, rokuyo —
ambient conditions, not a personal natal chart) for user personalization
and synchronization with other widgets, keep it synchronized with Logs
entries, and push a full understanding + features breakdown document each
session.

---

## PHASE 0 — ORIENTATION / UNDERSTANDING

Re-verified the state the 2026-07-27 session left behind (all of it is
merged into `master` and present at this session's base commit — nothing
regressed):

| Piece | Location | Status confirmed |
|---|---|---|
| Math | `src/shared/utils/astrology.ts` | `getHourlyZodiac`, `getWesternZodiac`, `getRokuyo`, `getMoonPhase` — unchanged, pure/isomorphic |
| Freshness | `System.tsx` `astrologyTick` (15-min interval, `!document.hidden` gated) | present, working |
| Signal bus | `intentionEngine.ts` — `'astrology'` Tier 0 source, `recordAstrologySignal()`, called once/day from `System.tsx` | present, working |
| Dependency graph | `WIDGET_DEPENDENCY_MAP`: `astrology: []`, consumed by `system` and `cosmic` | present |
| Logs sync | `getLogContext()` snapshots `astroRokuyo`/`astroMoonPhase`/`astroMoonIllumination`/`astroHourlyZodiac`/`astroWesternZodiac` per entry, rendered in `Logs.tsx` `SYS:` block | present, working |

Read the prior report's **PENDING / FUTURE WORK** list as this session's
starting brief, and re-audited the codebase rather than trusting the list
blindly:

1. *"Author a dedicated QIE pattern reacting to the astrology signal"* —
   confirmed still not done (`grep -n "auspicious\|Taian" intentionEngine.ts`
   only hits the `recordAstrologySignal` metadata line itself, no pattern
   block reads it). Still requires the full self-assembly ceremony (pattern
   number + wiki/doctrine/lexicon/Field-Manual sync is a governed process
   with its own ~150-entry Field Manual version-history blob in
   `About.tsx`) — **deferred again**, same reasoning as last session: that
   ceremony belongs to a dedicated benchmark pass triggered explicitly, not
   folded into this recurring routine.
2. *"Client dashboard should read `user.timeZone` instead of device-local
   time"* — confirmed still device-local (`new Date()` in the `astrology`
   `useMemo`). **Picked up this session** (Phase 1.1 below) — this is
   squarely "user personalization" per the standing instruction.
3. *"`getJapaneseZodiac`/`getMoonEmoji` unused, candidate for birth-year
   opt-in"* — still unused, still correctly out of scope: the standing
   instruction is explicit that this stays ambient/environmental, not a
   natal chart, and there is still no birth-date field anywhere on `User`.
   **Left alone.**

While re-reading the render path and grepping for every other place the
codebase touches `zodiac`/`rokuyo`/`moonPhase`
(`grep -rln "zodiac\|rokuyo\|moonPhase" src/client/components src/server`),
found a fourth hit beyond `System.tsx`/`Logs.tsx`/`logs.ts`:
**`QuantumSignWidget.tsx`**. This widget (a "quantum sign" nudge for quiet
subscribers) has its own "Astrology & Psychology patches" feature with a
hardcoded list —

```ts
const astrologyPatches = [
  { id: 'lunar-reset', name: 'Lunar Reset', desc: '...' },
  { id: 'solar-return', name: 'Solar Return', desc: '...' },
  { id: 'mercury-direct', name: 'Mercury Direct', desc: '...' },
  { id: 'venus-transit', name: 'Venus Transit', desc: '...' },
]
const astroIdx = dayOfYear % astrologyPatches.length
```

— rotated purely by `dayOfYear % 4`, with **zero relationship** to the real
moon phase / rokuyo computed by `src/shared/utils/astrology.ts`. Two
widgets both presenting themselves as "Astrology" to the same user, backed
by two independent and uncoordinated data sources — exactly the class of
gap the standing instruction's "synchronization with other widgets" clause
exists to close. This became this session's second work item.

Also confirmed `quantumSign` was **not** listed as a consumer of
`astrology` in `WIDGET_DEPENDENCY_MAP` (`quantumSign: ['intentions',
'memory']`) — accurate before this session (it genuinely didn't read
astrology data), now stale after Phase 1.2.

---

## PHASE 1 — BUILD

### 1. TimeZone-aware personalization (client dashboard)

`me` (the client's own profile atom, `stores.me`, typed `UserProfile`) did
not carry `timeZone` at all — traced this back to
`src/server/models/user.ts` `useProfileView()`, which whitelists exactly
which `User` fields reach the client via `fp.pick([...])`, and `timeZone`
was not in that list (`country`/`city`/`address`/`phone` were). So even
though the server has stored the field for a long time (used server-side
for Logs and weather), the client had no way to read it at all — the prior
session's "client-side still uses device-local time" note was actually a
harder gap than "convert a date" — the data plumbing didn't exist yet.

Fixed in three places:
- `src/shared/types/index.ts` — added `timeZone: string | null` to the
  `UserProfile` type (mirroring the field already on `User`).
- `src/server/models/user.ts` — added `'timeZone'` to the `useProfileView()`
  field whitelist. Not sensitive data (already exposed for `country`/`city`/
  `address`/`phone`), no migration, no new column.
- `src/shared/utils/astrology.ts` — extracted the wall-clock-passthrough
  trick that already existed *only* in `src/server/utils/logs.ts` (as a
  private `toWallClockDate` function) into a shared, exported
  `wallClockDateFromMoment(moment)`, typed against a minimal
  dayjs-compatible structural interface so both the server's and client's
  separately-configured `dayjs` instances can use it without coupling to
  either import path. `logs.ts` now imports and calls the shared version
  instead of keeping its own private copy — one implementation instead of
  two identical ones.
- `src/client/utils/dayjs.ts` — added the `dayjs/plugin/timezone.js` plugin
  (mirroring the server's `dayjs` setup exactly), enabling `dayjs().tz(tz)`
  client-side.
- `src/client/components/System.tsx` — the `astrology` `useMemo` now computes
  `me?.timeZone ? wallClockDateFromMoment(dayjs().tz(me.timeZone)) : new
  Date()` instead of always `new Date()`, and depends on `[astrologyTick,
  me?.timeZone]`. Logged-out visitors / users with no saved timeZone keep
  the exact previous behavior (device-local time) — this is additive
  personalization, not a behavior change for the common case where a
  viewer is looking at their own dashboard from their own timeZone anyway.

Net effect: a user who saved a timeZone different from the device they're
viewing from (traveling, a shared/kiosk device, a different browser
timeZone setting) now sees the *same* ambient reading (zodiac hour
especially — the only one of the four values actually hour-sensitive) as
their Logs entries already recorded server-side, instead of two disagreeing
sources depending on which surface they look at.

### 2. Widget synchronization — `QuantumSignWidget` astrology patches

Replaced the hardcoded 4-item `dayOfYear % 4` astrology-patch list with a
real derivation from the same `getMoonPhase()`/`getRokuyo()` functions the
dashboard Astrology block uses:

`src/shared/utils/astrology.ts` — added `getAstrologyPatch(moonPhase,
rokuyo)`, an exported `MOON_PHASE_PATCHES` table keyed by the same 8 phase
names `getMoonPhase()` already returns (`New Moon` → `Waxing Crescent` →
... → `Waning Crescent`), each with a short name/description in the same
voice as the widget's existing copy. When `rokuyo === 'Taian'` (the
auspicious day, same flag `recordAstrologySignal` already uses), the patch
description gets a one-line auspicious-day addendum.

`src/client/components/QuantumSignWidget.tsx` — the `patches` `useMemo` now
calls `getAstrologyPatch(getMoonPhase(today).phase, getRokuyo(today))`
instead of indexing into the old fabricated list. The psychology patch
rotation (unrelated to astrology, no real "psychology signal" source to
sync against) is left exactly as it was — this session's scope is the
astrology half specifically, per the standing instruction.

`src/client/stores/intentionEngine.ts` — `WIDGET_DEPENDENCY_MAP.quantumSign`
updated from `['intentions', 'memory']` to `['intentions', 'memory',
'astrology']`, with a `(2026-09-06 audit)` comment, so the cascade-
invalidation graph now correctly reflects that this widget reads the
astrology signal.

Net effect: "Astrology" now means one thing across the product. A user
cycling the System dashboard to its Astrology view and a quiet subscriber
seeing the Quantum Sign widget's "New Patches" view on the same day see
readings derived from the same moon phase and the same rokuyo day, instead
of two independently-invented "astrology" systems that could (and
previously would) tell contradictory stories on the same calendar day.

### 3. Logs synchronization

Verified — not modified this session. `getLogContext()` already snapshots
the full ambient reading per entry (`astroRokuyo`, `astroMoonPhase`,
`astroMoonIllumination`, `astroHourlyZodiac`, `astroWesternZodiac`),
`Logs.tsx` already renders `ASTRO: {rokuyo} · {moonPhase}` in the `SYS:`
block. The one change in this area was mechanical: `getLogContext()`'s
local date now comes from the same shared `wallClockDateFromMoment` helper
`System.tsx` also now uses (Phase 1.1), rather than a private copy —
server and client astrology-personalization now share one wall-clock
conversion implementation instead of two.

### Deliberately not done this session

- **New QIE pattern reacting to the `astrology` signal** (e.g. an
  "auspicious-day-alignment" pattern combining the `auspicious` flag with
  `goals`/`intentions`). Still correctly scoped out of this routine — it
  requires minting a pattern number, and per this codebase's convention
  (see `About.tsx` Field Manual history) a new pattern is normally
  accompanied by wiki/doctrine/lexicon/Field-Manual synchronization as one
  governed unit. Bolting a pattern on without that synchronization would
  leave the Field Manual's pattern count (`151 patterns active`) silently
  wrong. This stays queued for a dedicated benchmark session.
- **Birth-year / natal personalization** (`getJapaneseZodiac`,
  `getMoonEmoji`) — still unused, still correctly out of scope; the
  standing instruction is explicit that this feature stays ambient, not a
  natal chart, and no birth-date field exists on `User`.

---

## PHASE 2 — TEST

`node_modules` was absent at session start (as in the prior session);
restored with `npm install --legacy-peer-deps` (same pre-existing
`@nanostores/react`/`nanostores` peer-version conflict, not a code issue).

```
npx tsc --noEmit -p tsconfig.json   -> no new errors introduced by this
                                        session's changes (verified by
                                        diffing against a git-stash of a
                                        clean tree — the one remaining
                                        error, weather.humidity possibly
                                        null in System.tsx, is pre-existing
                                        and untouched by this session)
npm run server:build                -> PASS (tsc --project tsconfig.server.json)
npm run client:build                -> PASS (postcss + esbuild client bundle;
                                        two pre-existing duplicate-object-key
                                        warnings in badges.ts, unrelated)
npm run build                       -> PASS (both, end to end)
```

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % — all pure date-math, no external
  API, no personal birth data.
- **Personalization anchor:** the dashboard's ambient reading is now
  timeZone-aware end to end — client dashboard display *and* server-side
  Logs snapshot both read the user's saved profile `timeZone` (newly
  exposed to the client this session) via the same shared wall-clock
  conversion, falling back to device-local time only when no timeZone is
  saved.
- **Freshness:** recomputes every 15 minutes while the tab is visible
  (unchanged from prior session), now also recomputes if the user's saved
  timeZone changes mid-session.
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`), consumed per the dependency graph by `system`, `cosmic`,
  and now `quantumSign`. `quantumSign`'s astrology patch display is no
  longer an independently-invented fake rotation — it derives from the
  exact same `getMoonPhase()`/`getRokuyo()` reading as the dashboard block,
  via a new shared `getAstrologyPatch()` helper. One `ambient_reading`
  signal per calendar day, carrying an `auspicious` (Taian-day) flag other
  patterns can key off of in a future session.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the ambient astrology reading at creation time (unchanged),
  rendered in the journal's `SYS:` block — now computed via the same shared
  `wallClockDateFromMoment` helper the client dashboard uses, rather than a
  server-only private copy of the same logic.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental. No new QIE pattern minted
  this session (see Phase 1, "Deliberately not done").

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-vb7072
Files changed: 8
  src/client/components/System.tsx            MODIFIED — timeZone-aware astrology useMemo
  src/client/components/QuantumSignWidget.tsx  MODIFIED — real astrology patch derivation
  src/client/stores/intentionEngine.ts         MODIFIED — quantumSign dependency map entry
  src/client/utils/dayjs.ts                    MODIFIED — timezone plugin added
  src/server/models/user.ts                    MODIFIED — timeZone added to client profile view
  src/server/utils/logs.ts                     MODIFIED — uses shared wallClockDateFromMoment
  src/shared/types/index.ts                    MODIFIED — UserProfile.timeZone
  src/shared/utils/astrology.ts                MODIFIED — getAstrologyPatch + wallClockDateFromMoment
  docs/assembly/2026-09-06_LOT-assembly_astrology-widget-personalization-sync.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author a dedicated QIE pattern reacting to the `astrology` signal
  together with `goals`/`intentions` (e.g. a gentle nudge on
  auspicious/Taian days) — needs the full self-assembly treatment (pattern
  number, archetype/job wiring if warranted, wiki + doctrine + lexicon +
  Field Manual sync). Third session in a row this is queued; consider
  pairing it with a dedicated benchmark run rather than deferring
  indefinitely.
- `docs/technical/WIDGETS.md` still describes astrology only as a
  sub-feature of dashboard stack 4 ("Time & Environment") and doesn't
  mention `QuantumSignWidget`'s astrology patch at all — a documentation
  pass (not core to this routine's scope) could fold both into one
  first-class description now that they share a data source.
- `getJapaneseZodiac` (year-based animal) and `getMoonEmoji` remain unused;
  still candidates for a future opt-in personalization pass, still out of
  scope while the feature stays ambient-only and no birth-date field
  exists on `User`.
- Now that `UserProfile.timeZone` is exposed to the client for the first
  time, worth checking whether any other client feature that silently
  assumed device-local time (outside astrology) would benefit from the
  same personalization — not audited this session, scope was astrology-only.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
