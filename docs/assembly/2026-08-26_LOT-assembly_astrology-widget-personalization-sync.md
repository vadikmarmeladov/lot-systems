# LOT Self-Assembly Session Report
## 2026-08-26 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-eojwe3`
**Base commit:** `98971f2`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Live site access:** not attempted — all work sourced from repo inspection

---

## MISSION BRIEF

Standing recurring instruction (unchanged since 2026-07-27): continue evolving
the Astrology block (today's zodiac hour, moon phase, rokuyo — ambient
conditions, not a personal natal chart) for user personalization and
synchronization with other widgets, keep it synchronized with Logs entries,
and push a full understanding + features breakdown document each session.

---

## PHASE 0 — ORIENTATION / WHAT CHANGED SINCE THE LAST SESSION

The prior session (`2026-07-27`, report of the same name, v1) landed on
`master` via `b75f65b feat(astrology): personalize, sync with QIE + Logs, fix
staleness` and merge `7c1d1cf` (PR #92). This session's branch started even
with `master` (`git diff master...HEAD` empty at session start) — no drift,
no conflicting work landed on the feature in the intervening month. Verified
all four v1 deliverables are live and unchanged on `master`:

| v1 deliverable | Status found this session |
|---|---|
| 15-min re-tick, off-tab paused (`astrologyTick`) | ✅ present, `System.tsx:197-203` |
| Moon illumination surfaced in both dashboard render sites | ✅ present |
| `astrology` wired into QIE `WIDGET_DEPENDENCY_MAP` as Tier 0, consumed by `system`/`cosmic` | ✅ present, `intentionEngine.ts:3800,3830,3834` |
| `recordAstrologySignal` — once/day, `auspicious: rokuyo === 'Taian'` flag | ✅ present, `intentionEngine.ts:4878-4893` |
| Logs `context` snapshot — 5 `astro*` fields, timeZone-aware via `toWallClockDate` | ✅ present, `logs.ts:21-44`, `shared/types/index.ts:168-172` |

Re-read v1's own "PENDING / FUTURE WORK" section (the actual backlog this
routine is meant to work down) and checked each item against current code
before deciding this session's scope:

1. **QIE pattern reacting to `astrology` + `goals`/`intentions`** (e.g. a
   Taian-day nudge) — confirmed still not authored. `intentionEngine.ts` is
   now at v113 / P149–P151 / Arch51 / J48 (grepped pattern numbers, dependency
   map). Minting a new numbered pattern means a full self-assembly pass:
   wiki + doctrine + lexicon + Field Manual version bump, per this
   repository's own convention (see `LOT-WIKI-v87`, `2026-08-05` commit). That
   is the `lot-benchmark` skill's job, triggered explicitly by "Benchmark" /
   "ship it" — not this routine's scheduled prompt. **Deliberately deferred
   again**, same as v1, to avoid a half-authored pattern with no wiki/doctrine
   entry.
2. **Client dashboard should read `user.timeZone` instead of device-local
   time** — checked: `System.tsx` has no path to the server `User.timeZone`
   field at all today. `useProfile()` (`queries.ts:290`) returns a
   psychology/behavioral profile, not account settings; there is no
   `useSettings`/`useAccount`-style hook exposing `timeZone` client-side
   anywhere in `src/client`. Doing this properly needs a new query + API
   surface (or extending an existing one), which is a real feature addition,
   not a fix — **left as noted backlog**, not attempted this session, rather
   than bolting a timezone fetch onto an unrelated existing query.
3. **`getJapaneseZodiac` / `getMoonEmoji` unused, candidate for
   personalization (e.g. birth-year animal opt-in)** — `getMoonEmoji` is
   addressed this session (below). `getJapaneseZodiac` requires a birth year,
   which is personal natal-chart data the standing instruction explicitly
   excludes ("ambient conditions... not a personal natal chart"). **Still
   out of scope by design** — noted again so a future session doesn't
   rediscover this from scratch.

Also found, while re-reading the render paths end to end this session: the
Logs journal's `SYS:` block only ever printed 2 of the 5 `astro*` fields it
has stored on every log row since v1 (`astroRokuyo`, `astroMoonPhase`) —
`astroHourlyZodiac`, `astroWesternZodiac`, `astroMoonIllumination` were
computed and persisted to every log's `context` JSONB column but silently
dropped at render time. Same shape of bug as the "moon illumination computed
but never rendered" finding from v1, just moved from the live dashboard to
the historical journal view.

---

## PHASE 1 — BUILD

### 1. Surfaced the full ambient reading in Logs (synchronize with Logs entries)

`src/client/components/Logs.tsx` — the `system_snapshot` (`SYS:`) block's
`ASTRO:` line now prints all five fields already sitting in `log.context`
instead of two:

```
ASTRO: {westernZodiac} · {hourlyZodiac} · {rokuyo} · {moonPhase} ({illumination}%)
```

matching the density/format already used on the live dashboard block, so a
journal entry from any past day now shows the same ambient-reading detail the
dashboard shows today. Each field is still individually guarded (`&&`) since
older log rows predating v1 won't have the newer fields populated.

### 2. Wired up `getMoonEmoji` (closed out the "unused function" finding from v1)

`src/client/components/System.tsx`:
- Imported `getMoonEmoji` alongside the other astrology utilities.
- Added `moonEmoji: getMoonEmoji(moonPhase.phase)` to the `astrology`
  `useMemo` result (recomputed on the same 15-min tick as the rest of the
  block — no new staleness surface).
- Both render sites (compact/basic layout and the cycling "pro" block) now
  show the phase emoji: `🌕 Full Moon (100%)` instead of plain text. One
  `replace_all` edit since both sites shared the exact same JSX line.

This was flagged in v1 as a "candidate for a future personalization pass"
that didn't require birth data — closing it out keeps the backlog from
silently growing every session.

---

## PHASE 2 — TEST

`node_modules` was absent again this session (fresh container) — restored
with `npm install --legacy-peer-deps` (same pre-existing
`@nanostores/react`/`nanostores` peer conflict as v1, not a code change).

```
npm run build   -> PASS (client:css:build + client:js:build + server:build, end to end)
```

Pre-existing warnings unrelated to this session's diff (duplicate object keys
`quarter_drop`/`elixir_found` in `badges.ts`, stale Browserslist/Baseline
data) — present before this session's changes, left untouched.

`git diff --stat` for this session: 2 files, 10 insertions, 4 deletions —
`Logs.tsx` and `System.tsx` only.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % + phase emoji — all pure date-math, no
  external API, no personal birth data.
- **Personalization anchor:** ambient reading is timeZone-aware wherever a
  server-side user context exists (Logs, via `getLogContext` →
  `toWallClockDate`); client-side dashboard display still uses device-local
  time — no client-side path to the account's saved `timeZone` exists yet
  (see backlog item 2).
- **Freshness:** recomputes every 15 minutes while the tab is visible, paused
  while the tab is hidden (`document.hidden` gate).
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`) in `WIDGET_DEPENDENCY_MAP`, consumed by `system` and
  `cosmic`; emits one `ambient_reading` signal per calendar day carrying an
  `auspicious` (Taian-day) flag. No pattern yet reacts to that flag — the
  signal is flowing and graph-registered, but nothing downstream consumes it
  (see backlog item 1).
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  carries all five ambient astrology fields at creation time; the journal's
  `SYS:` block now renders all five (previously only 2 of 5), matching the
  live dashboard's format and density.
- **Display:** moon phase now paired with its emoji on both dashboard render
  sites (compact layout and the cycling "pro" block).
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign,
  `getJapaneseZodiac`'s birth-year animal) — the feature remains strictly
  ambient/environmental.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-eojwe3
Files changed: 3
  src/client/components/System.tsx        MODIFIED
  src/client/components/Logs.tsx          MODIFIED
  docs/assembly/2026-08-26_LOT-assembly_astrology-widget-personalization-sync.md  ADDED
```

---

## PENDING / FUTURE WORK (carried forward + updated)

- **QIE pattern on the `auspicious` (Taian) flag** — the raw signal
  (`recordAstrologySignal`, Tier 0, dependency-graph-registered) has now sat
  unconsumed for two sessions. Still belongs to a dedicated `lot-benchmark`
  pass (new pattern number after P151, archetype/job wiring if warranted,
  wiki + doctrine + lexicon + Field Manual version bump) rather than this
  routine's scheduled scope — flagging again so it isn't lost, not attempting
  a partial version without the doctrine sync.
- **Client-side timeZone-aware dashboard display** — needs a real query/API
  surface exposing the account's saved `timeZone` to `System.tsx` (none
  exists today; `useProfile()` is a behavioral/psychology profile, not
  account settings). Until then the dashboard's ambient reading reflects
  device-local time (itself a form of implicit personalization, per v1's
  framing) while only the server-side Logs snapshot is truly timeZone-aware.
- `getJapaneseZodiac` (birth-year animal) remains unused and out of scope
  while the feature stays ambient-only, per the standing instruction's
  explicit "not a personal natal chart" framing. Not revisiting this unless
  the standing instruction itself changes to permit opt-in birth data.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
