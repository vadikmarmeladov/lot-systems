# LOT Self-Assembly Session Report
## 2026-07-28 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-tfods8`
**Base commit:** `7c1d1cf` (includes prior session `claude/practical-curie-txifrq` / PR #92, already merged into this branch's history)
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

---

## PHASE 0 — ORIENTATION / UNDERSTANDING

This is the second self-assembly pass on this feature. The prior session
(2026-07-27, `docs/assembly/2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`,
merged via PR #89→#92) already:
- fixed staleness (15-min re-tick, off-tab-safe)
- surfaced moon illumination %
- registered `astrology` as a Tier 0 QIE signal source with `recordAstrologySignal()`
- synchronized the reading into every Log entry's `context` snapshot, timeZone-aware,
  via `getLogContext()` → rendered in the `SYS:` journal block

Its **PENDING / FUTURE WORK** section named three concrete next steps. This
session picked up the first two (the third stays out of scope by design):

1. Author a dedicated QIE pattern reacting to the astrology signal together
   with goals/intentions — deferred from the prior session pending "the full
   self-assembly treatment."
2. Make the **client-side dashboard display** timeZone-aware (it was reading
   device-local time even though the Logs snapshot already read the user's
   saved `timeZone`).
3. *(left out of scope, as before)* `getJapaneseZodiac`/`getMoonEmoji`
   opt-in personalization — would require new birth-data fields on the User
   model; the standing instruction is explicit that this stays ambient-only.

---

## PHASE 1 — BUILD

### 1. Pattern 140: Auspicious Day Alignment (widget synchronization)

`src/client/stores/intentionEngine.ts` — added Pattern 140, the QIE's first
pattern that reacts to the `astrology` signal in combination with another
source, closing the gap the prior session deliberately left open:

- Trigger: the most recent `astrology` `ambient_reading` signal in the last
  24h has `metadata.auspicious === true` (Taian rokuyo) **and** a `goals` or
  `intentions` signal fired in the same 24h window.
- Confidence: 0.66–0.78, bumped when both goals *and* intentions fired
  (vs. just one).
- `suggestedWidget: 'goals'`, `suggestedTiming: 'passive'` — a nudge, not a
  prescription, matching the ambient-only framing of the block.
- Reason code `AUSDAY:`, following the existing terse log-code convention
  (`QCOHERE:`, `SIGMAT:`, `TBIOF:`, …).
- Registered display label `'auspicious-day-alignment': 'AUSDAY'` in
  `QuantumEngineWidgets.tsx`'s `PATTERN_DISPLAY` map, alongside the other
  v106–v108 pattern codes.
- Extended the `goals` entry in `WIDGET_DEPENDENCY_MAP` to include
  `'astrology'` (dated `2026-07-28 audit`, matching the file's existing
  audit-comment convention), so the dependency graph now reflects that P140
  actually reads both sources.

Not minted this session: a new archetype or background job — P134–P136 got
Arch46, P137–P139 got Arch47, but a single new pattern doesn't require one
on its own (same precedent as several single-pattern additions earlier in
the file, e.g. P53, P62). A dedicated Arch48/job pass, plus the wiki/doctrine/
lexicon/Field Manual version bump, stays deferred to a full benchmark
session, per the same reasoning the prior session gave for not doing it —
this is a recurring light-touch routine, not a `docs/benchmark/` cycle.

### 2. Client dashboard now reads the user's saved timeZone (personalization)

Previously: the Logs snapshot (server-side) was timeZone-aware via
`user.timeZone`, but the live dashboard block (`System.tsx`) always read
`new Date()` — device-local time — so a user viewing the dashboard from a
device set to a different zone than their saved profile timeZone got a
reading inconsistent with what their own Log entries recorded. This was the
prior session's second pending item.

- `src/shared/utils/astrology.ts` — extracted the wall-clock-passthrough
  trick (previously private to `server/utils/logs.ts`) into a shared,
  duck-typed `toWallClockDate(moment: WallClockMoment): Date` export, so
  both server and client can build a `Date` whose `getHours()`/`getMonth()`/
  `getDate()` reflect a target timeZone's wall-clock fields regardless of
  the runtime's own zone.
- `src/server/utils/logs.ts` — now imports `toWallClockDate` from the shared
  module instead of keeping a private copy (deduplication, not a behavior
  change).
- `src/client/utils/dayjs.ts` — added the `dayjs/plugin/timezone.js`
  extension (client dayjs had `utc` but not `timezone`; server's already
  had both). Additive only — no existing call site changes behavior.
- `src/shared/types/index.ts` (`UserProfile`) + `src/server/models/user.ts`
  (`useProfileView()`) — added `timeZone` to the fields the `/me` endpoint
  returns, so `stores.me` on the client now carries the same `timeZone` the
  server already uses for Logs. Checked all call sites of
  `useProfileView()` — it's only ever called on `req.user` (self), so this
  doesn't leak another user's timeZone to anyone else.
- `src/client/components/System.tsx` — the `astrology` `useMemo` now
  computes `me?.timeZone ? toWallClockDate(dayjs().tz(me.timeZone)) : new
  Date()`, falling back to device-local time for logged-out visitors or
  users with no saved timeZone (most users, since `timeZone` is only
  populated once a city+country round-trip through the weather API
  succeeds in `/settings`). Added `me?.timeZone` to the memo's dependency
  array alongside the existing `astrologyTick`.

Net effect: a user with a saved profile timeZone now sees the same ambient
reading on the dashboard that their Log entries are being tagged with,
regardless of what zone their current device happens to be set to.

---

## PHASE 2 — TEST

Dependencies were not pre-installed in this session's container
(`node_modules` absent); ran `npm install --legacy-peer-deps` to restore
them (same pre-existing `@nanostores/react`/`nanostores` peer-version
conflict noted by the prior session, unrelated to this session's code).

```
npm run server:build   -> PASS (tsc --project tsconfig.server.json)
npm run client:build   -> PASS (postcss + esbuild client bundle)
```

The client build pipeline transpiles via esbuild without type-checking, so
also ran `npx tsc --noEmit -p tsconfig.json` before and after this
session's changes and diffed the two error lists: **123 pre-existing
type errors in both runs, identical set** (only line numbers shifted from
this session's insertions) — zero new type errors introduced by this
session's changes.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % — all pure date-math, no external API,
  no personal birth data.
- **Personalization anchor:** ambient reading is now timeZone-aware
  end-to-end wherever the user has a saved profile `timeZone` — both the
  server-side Logs snapshot (since the prior session) **and** the live
  client dashboard block (new this session). Falls back to device-local
  time only for logged-out visitors or users without a resolved timeZone.
- **Freshness:** recomputes every 15 minutes while the tab is visible.
- **Widget synchronization:**
  - Registered as a Tier 0 QIE signal source (`astrology`), consumed (per
    the dependency graph) by `system`, `cosmic`, and now `goals`.
  - Emits one `ambient_reading` signal per calendar day, including an
    `auspicious` (Taian-day) flag.
  - **New:** Pattern 140 `auspicious-day-alignment` (`AUSDAY:`) — the first
    QIE pattern to actually react to the astrology signal jointly with
    another source (goals/intentions), surfacing a passive nudge on the
    Goals module when an auspicious day and active intention-setting
    coincide.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the ambient astrology reading at creation time, rendered in the
  journal's `SYS:` block next to weather/location (unchanged this session,
  verified still wired correctly).
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-tfods8
Files changed: 8
  src/client/stores/intentionEngine.ts      MODIFIED (Pattern 140 + goals dep-map entry)
  src/client/components/QuantumEngineWidgets.tsx  MODIFIED (AUSDAY display label)
  src/shared/utils/astrology.ts             MODIFIED (shared toWallClockDate export)
  src/server/utils/logs.ts                  MODIFIED (dedup: import shared toWallClockDate)
  src/client/utils/dayjs.ts                 MODIFIED (timezone plugin)
  src/shared/types/index.ts                 MODIFIED (UserProfile.timeZone)
  src/server/models/user.ts                 MODIFIED (useProfileView exposes timeZone)
  src/client/components/System.tsx          MODIFIED (astrology memo reads me.timeZone)
  docs/assembly/2026-07-28_LOT-assembly_astrology-widget-personalization-sync.md  ADDED
```

---

## PENDING / FUTURE WORK

- Author Arch48 + a background job wired specifically around P140 (and any
  sibling ambient-conditions patterns), plus the full wiki/doctrine/lexicon/
  Field Manual version-bump treatment — belongs to a dedicated `docs/
  benchmark/` self-assembly session, not this recurring light-touch routine.
- `getJapaneseZodiac` (year-based animal) and `getMoonEmoji` remain unused;
  still a candidate for a future *opt-in* personalization pass (a user
  explicitly entering their birth year, not inferred), out of scope while
  the feature stays ambient-only per the standing instruction.
- Consider whether `PatternRecognitionWidget.tsx`'s separate
  `getPatternName()` display-name map (currently stops at P130) should be
  brought current through P140 — pre-existing gap (P131–P139 were also
  missing there before this session), falls back gracefully to
  `pattern.replace(/-/g, ' ')` so not a functional bug, just a cosmetic
  backlog item spanning several prior sessions' patterns, not only this
  one's.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
