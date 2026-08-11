# LOT Self-Assembly Session Report
## 2026-08-11 | Astrology Widget — TimeZone Personalization | v2

**Branch:** `claude/practical-curie-lfokl3`
**Base commit:** `98971f2`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Live site access:** not attempted — all work sourced from repo inspection
**Prior session:** `docs/assembly/2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`

---

## MISSION BRIEF

Standing recurring instruction (unchanged since 2026-07-27): continue evolving
the Astrology block (today's zodiac hour, moon phase, rokuyo — ambient
conditions, not a personal natal chart) for user personalization and
synchronization with other widgets, keep it synchronized with Logs entries,
and push a full understanding + features breakdown document each session.

---

## PHASE 0 — ORIENTATION / STATE CHECK

Re-read the feature as it stands after the 2026-07-27 session, confirmed still
live and unmodified by any intervening commit:

- Recompute cadence fix (15-min tick, off-tab paused) — present, `System.tsx`.
- Moon illumination surfaced in both render sites — present.
- QIE wiring — `astrology` Tier 0 source, `WIDGET_DEPENDENCY_MAP` entries for
  `system`/`cosmic`, `recordAstrologySignal()` firing once/day — all present,
  unchanged in `src/client/stores/intentionEngine.ts`.
- Logs sync — `getLogContext()` snapshots `astroRokuyo` /
  `astroMoonPhase` / `astroMoonIllumination` / `astroHourlyZodiac` /
  `astroWesternZodiac` onto every new `Log` row, rendered in the `SYS:` block
  of `Logs.tsx` — present, unchanged in `src/server/utils/logs.ts`.

Re-read the prior report's **PENDING / FUTURE WORK** section (the backlog this
session picks up from) — three items:

1. Author a QIE pattern reacting to `astrology` + `goals`/`intentions`
   (auspicious-day nudge).
2. Make the *client-side dashboard* timeZone-aware (it read device-local time;
   only the server-side Logs snapshot was timeZone-aware).
3. Wire up `getJapaneseZodiac` / `getMoonEmoji`, both computed but unused.

**Scoping decision on item 1:** inspected the three most recent pattern mints
(P149–P151, commit `d7f076e`) to size the actual cost of "author a QIE
pattern" in this codebase — it is an 11-file, ~940-line ritual (archetype,
job, military log handlers in `Logs.tsx`, scheduled-jobs entry, wiki/Field
Manual version bump, badge documentation). The prior session explicitly
deferred it for exactly this reason: it "needs the full self-assembly
treatment," which is the `Benchmark`/quantum-engine session's job, not this
lighter recurring sync routine's. Re-deferred again this session for the same
reason — folding an 11-file pattern mint into an unattended routine risks a
half-integrated pattern (wiki says N, code says N-1) with no S-2 present to
judge the archetype/job naming. Left as pending work below, unchanged.

Items 2 and 3 (partially) were in scope and built this session.

---

## PHASE 1 — BUILD

### 1. TimeZone-aware client dashboard (pending item #2)

Root cause: `System.tsx`'s astrology `useMemo` called `new Date()` directly —
device-local time. Meanwhile `getLogContext()` on the server already computed
the *user's saved* `timeZone` via a wall-clock-passthrough trick. The two
surfaces (dashboard display vs. Logs snapshot) could show different rokuyo/
zodiac-hour values for the same user near a day or zodiac-hour boundary if
their device clock's timeZone differed from their saved profile timeZone.

The blocker: `UserProfile` (the client-facing shape returned by `GET /me` and
held in `stores.me`) did not carry `timeZone` — only the server-side `User`
model type did. Fixed the plumbing gap rather than adding a second network
round-trip:

- `src/shared/types/index.ts` — added `timeZone: string | null` to
  `UserProfile`.
- `src/server/models/user.ts` — added `'timeZone'` to the `fp.pick([...])`
  field list in `useProfileView()`, the single function backing `GET /me`.
- `src/client/utils/dayjs.ts` — extended the client dayjs instance with
  `dayjs/plugin/timezone.js` (already a transitive dependency via `dayjs`,
  already used server-side; client only had `utc` before). No new package.
- `src/client/components/System.tsx` — the astrology `useMemo` now builds
  `localMoment` from `me?.timeZone ? dayjs().tz(me.timeZone) : dayjs()`,
  falling back to device-local time for logged-out/no-timeZone-set users
  (unchanged behavior for that case), then converts to a plain `Date` via the
  same three-line wall-clock constructor already used in
  `getLogContext`/`toWallClockDate`. `me?.timeZone` was added to the memo's
  dependency array so a timeZone change in Settings recomputes immediately
  rather than waiting for the 15-minute tick.

Net effect: the dashboard Astrology block and every new Logs entry's `SYS:`
ASTRO line now derive from the *same* timeZone-aware wall clock — the split
surfaces from the last session are unified.

### 2. Surfaced the moon emoji (pending item #3, partial)

`getMoonEmoji(phaseName)` was computed-and-discarded since it was written —
no birth data is required to use it (it's a pure function of the already-
computed moon phase name), so this was in scope without touching the
birth-data question. Wired into the `astrology` useMemo result
(`moonEmoji`) and both render sites (compact layout + cycling "pro" block),
e.g. `🌕 Full Moon (98%)` instead of plain text.

Deliberately **not** touched: the `Logs.tsx` `SYS:` block's `ASTRO:` line.
Checked the convention there first — `TMP:`/`HUM:`/`SND:`/`THM:` are all
plain ASCII, no emoji, matching the deliberately terse military-log
aesthetic of that whole panel. Adding an emoji there would be the one
inconsistent line; left as-is.

`getJapaneseZodiac` (birth-year animal) remains unused — still genuinely
blocked on the same fact as last session: the `User` model has no
birthDate/birthYear field, and adding one crosses from "ambient conditions"
into collecting personal data, which needs an explicit product decision
(consent copy, opt-in UI), not something to add unattended. Left pending.

---

## PHASE 2 — TEST

`node_modules` was absent at session start (fresh container); restored with
`npm install --legacy-peer-deps` (same pre-existing `@nanostores/react`/
`nanostores` peer conflict noted in the prior session, unrelated to this
session's code).

```
npm run server:build   -> PASS (tsc --project tsconfig.server.json)
npm run client:build   -> PASS (postcss + esbuild client bundle)
```

Two pre-existing esbuild warnings observed (`duplicate-object-key` on
`quarter_drop` / `elixir_found` in `src/client/utils/badges.ts`) — confirmed
present on `master` before this session's changes, unrelated, not touched.

Zero errors attributable to this session's changes.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % + emoji — all pure date-math, no
  external API, no personal birth data.
- **Personalization anchor:** ambient reading is now timeZone-aware
  end-to-end — both the server-side Logs snapshot (since 2026-07-27) and the
  client-side dashboard display (this session) read the user's saved
  `timeZone` when set, falling back to local device time only when a user has
  no saved timeZone.
- **Freshness:** recomputes every 15 minutes while the tab is visible, and
  immediately on a `timeZone` change (e.g. right after a Settings save).
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`), consumed by `system` and `cosmic` per the dependency graph;
  emits one `ambient_reading` signal per calendar day, `auspicious`
  (Taian-day) flag included — unchanged this session, verified still live.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the ambient astrology reading at creation time — unchanged this
  session, verified still live; now provably consistent with what the
  dashboard shows the same user at the same moment.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental.
- **Not implemented (by scope discipline, deferred to a dedicated Benchmark
  session):** a QIE pattern reacting to `astrology` + `goals`/`intentions`
  (e.g. an auspicious-day nudge) — sized this session at ~11 files / ~940
  lines based on the three most recent pattern mints; needs S-2 present for
  archetype/job naming judgment, not an unattended routine.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-lfokl3
Files changed: 4
  src/client/components/System.tsx        MODIFIED
  src/client/utils/dayjs.ts                MODIFIED
  src/server/models/user.ts                MODIFIED
  src/shared/types/index.ts                MODIFIED
  docs/assembly/2026-08-11_LOT-assembly_astrology-widget-timezone-personalization.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author a dedicated QIE pattern reacting to the `astrology` signal together
  with `goals`/`intentions` (e.g. a gentle nudge on auspicious/Taian days) —
  carried forward from the 2026-07-27 report, re-sized this session at ~11
  files / ~940 lines by precedent (P149–P151); route through a `Benchmark`
  session with S-2 present, not this recurring routine.
- `getJapaneseZodiac` (birth-year animal) remains unused — still blocked on
  a product decision to collect birth-year data with explicit opt-in consent
  copy; out of scope while the feature stays ambient-only.
- Consider whether the **compact** (non-"pro") render site should also gain
  the psychology/journey/quantum cycling behavior the "pro" layout has, so
  the moon-emoji and future astrology-adjacent surfaces are consistent across
  both dashboard layouts — noticed but not investigated this session, flagged
  for a future pass.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
