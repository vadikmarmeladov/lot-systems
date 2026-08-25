# LOT Self-Assembly Session Report
## 2026-08-25 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-1omdn5`
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

This is the second dedicated session on this feature. The first
(`2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`) fixed
staleness, surfaced moon illumination, wired the block into the QIE signal
bus, and synced it into Logs. It closed with three explicit deferrals, which
this session picks up.

---

## PHASE 0 — ORIENTATION / UNDERSTANDING

Re-read the feature as it stands after the prior session, and re-verified the
three deferred items were still open (`git log --all --grep astrology` shows
only the one prior session; `stores.me`/`UserProfile` had no `timeZone`
field; `getJapaneseZodiac`/`getMoonEmoji` were still unused, confirmed by
grep). Confirmed the prior session's work is already merged into `master`
(commit `73edd95` and downstream) — this branch is current.

While reading `analyzeIntentions()` in `src/client/stores/intentionEngine.ts`
(the QIE pattern-detection function this session needed to extend for the
first deferral) a **pre-existing correctness bug** turned up, unrelated to
astrology but blocking work in the exact function this feature synchronizes
through: Pattern 147 (`quantum-presence-field`) reads a variable `dayMs` that
is never declared in that function's scope — only the sibling `weekMs` is
declared (line 3198). `dayMs` is genuinely undefined at that point, which
`tsc` confirms (`TS2304: Cannot find name 'dayMs'`) — but the client bundle
is built with esbuild, which does not type-check, so the bug shipped
silently. At runtime this throws `ReferenceError: dayMs is not defined`
inside `analyzeIntentions()`, which aborts the function before reaching
Patterns 148–151 (and would have aborted before any pattern this session
added) and before the `intentionEngine.set(...)` commit at the end of the
function — so every call to `analyzeIntentions()` (fired from `System.tsx`,
`SystemProgressWidget.tsx`, `Logs.tsx`, `MemoryWidget.tsx`) has been silently
failing partway through since Pattern 147 shipped, for every user, every
time. Two of the four call sites don't wrap the call in try/catch, so this
was also throwing an uncaught error into those call paths.

Fixed as a prerequisite (see Phase 1.0) — without it, the new pattern added
this session would never have been reached.

---

## PHASE 1 — BUILD

### 0. Fixed pre-existing `dayMs` ReferenceError (prerequisite)

`src/client/stores/intentionEngine.ts` — declared `const dayMs = 24 * 60 * 60
* 1000` immediately before its first use in the Pattern 147 block, matching
the existing convention for `weekMs` at line 3198. Confirmed via a
before/after `tsc --noEmit` diff: baseline had `TS2304: Cannot find name
'dayMs'` at this line; after the fix, that error is gone and no new errors
were introduced (see Phase 2).

### 1. Authored a QIE pattern reacting to astrology + goals/intentions

Deferred item from the prior session. Added **Pattern 152 —
`auspicious-day-alignment`**: fires when today's ambient astrology reading
carries the `auspicious` flag (Taian rokuyo, recorded once daily by the
existing `recordAstrologySignal`) *and* the user has set an intention or
acted on a goal the same day. Confidence 0.60–0.75, scaling gently with the
number of direction signals. `suggestedWidget: 'cosmic'` (already a
consumer of both `astrology` and `intentions` in `WIDGET_DEPENDENCY_MAP`, so
no dependency-graph change was needed). This is the first pattern to read
the Tier 0 `astrology` signal source — previously registered in the
dependency graph (prior session) but never consumed by pattern detection.

Kept deliberately narrow, matching the prior session's own framing: a
correlation surfaced passively, not a directive, and no new archetype/job
was minted — pattern-then-later-wiki-sync is this repo's established
two-step convention (e.g. `8ac3690` synced FM/About.tsx counters for
patterns added in earlier, separate engineering commits).

### 2. Client-side dashboard now reads the user's saved timeZone

Second deferred item. Previously only the server-side Logs snapshot was
timeZone-aware (`getLogContext`); the client dashboard always read
device-local time via `new Date()`, so a user viewing the dashboard from a
device set to a different zone than their profile got a reading that didn't
match their saved location.

- `src/shared/types/index.ts` — added `timeZone: string | null` to
  `UserProfile`.
- `src/server/models/user.ts` — added `'timeZone'` to the `fp.pick` list in
  `useProfileView()`, so `/api/me` (and therefore the existing `stores.me`
  nanostore, already populated app-wide) now carries it — no new endpoint
  needed.
- `src/client/utils/dayjs.ts` — added the `dayjs/plugin/timezone` plugin
  (client dayjs had `utc` but not `timezone`; server's already had both).
- `src/shared/utils/astrology.ts` — lifted the `toWallClockDate()` helper
  (previously private to `src/server/utils/logs.ts`) into the shared,
  isomorphic astrology module, since both server and client now need the
  identical wall-clock-passthrough trick. `src/server/utils/logs.ts` updated
  to import it instead of keeping a local copy.
- `src/client/components/System.tsx` — the `astrology` `useMemo` now
  computes its `now` from `me?.timeZone ? toWallClockDate(dayjs().tz(me.timeZone))
  : new Date()`, falling back to device-local time for logged-out or
  no-timeZone-set users. Added `me?.timeZone` to the memo's dependency array.

### 3. Wired the two unused astrology functions into ambient display + Logs

Third deferred item. `getJapaneseZodiac` (year-based animal, ambient — the
calendar year's animal, not a birth year) and `getMoonEmoji` were computed
by nobody. Both wired in as ambient-only display, no personal data:

- `System.tsx`: the astrology block now reads `{westernZodiac}
  ({japaneseZodiac}) • {hourlyZodiac} • {rokuyo} • {moonEmoji} {moonPhase}
  ({moonIllumination}%)` — Japanese zodiac derived from the current
  (wall-clock, timeZone-aware) year, moon emoji prefixing the phase name.
  Same change applied to both render sites (compact layout + cycling "pro"
  block), which share the one `astrology` object.
- `src/shared/types/index.ts` — added `astroJapaneseZodiac` to `LogContext`.
- `src/server/utils/logs.ts` — `getLogContext` now also computes
  `astroJapaneseZodiac` via `getJapaneseZodiac(localDate.getFullYear())`.
- `src/client/components/Logs.tsx` — the `SYS:` block's `ASTRO:` line now
  appends the Japanese zodiac when present: `ASTRO: {rokuyo} · {moonPhase} ·
  {japaneseZodiac}`.

`getMoonEmoji` was left as display-only (client-side), not persisted to
Logs — it's a pure, instant derivation from `moonPhase`, so storing it
redundantly in the JSONB context would add no information.

---

## PHASE 2 — TEST

`node_modules` was absent at session start (fresh container); restored with
`npm install --legacy-peer-deps` (same pre-existing `@nanostores/react`
peer-version conflict as the prior session, unrelated to this session's
code).

```
npm run server:build            -> PASS (tsc --project tsconfig.server.json)
npm run client:build            -> PASS (postcss + esbuild client bundle)
npm run build                   -> PASS (both, end to end)
npx tsc --noEmit -p tsconfig.json  -> 103 errors (baseline: 104)
```

The client isn't type-checked as part of any build script (esbuild
transpiles without checking), so a manual `tsc --noEmit` pass was run as an
extra verification given the `dayMs` finding above. Diffed error output
before vs. after this session's changes (stash / tsc / pop): the `dayMs`
`TS2304` error is gone (real fix, confirmed), no new errors were introduced,
and every other diff line is a pure line-number shift from this session's
insertions — same set of pre-existing, unrelated errors (mostly in
`AdminUser.tsx`, plus a handful of already-loose `IntentionSignal['source']`
typings in `intentionEngine.ts` that predate this session).

Zero errors attributable to this session's changes beyond the one fixed.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, Japanese (year) zodiac
  animal, rokuyo (six-day auspicious cycle), moon phase + illumination % +
  emoji — all pure date-math, no external API, no personal birth data.
- **Personalization anchor:** the ambient reading is now timeZone-aware end
  to end — both the server-side Logs snapshot (since the prior session) and
  the client-side dashboard display (new this session) read from the user's
  saved `timeZone` when set, via the shared `toWallClockDate()` helper;
  falls back to device-local time only when no timeZone is on the profile.
- **Freshness:** recomputes every 15 minutes while the tab is visible
  (unchanged from the prior session), now also re-deriving if the user's
  timeZone changes mid-session.
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`, prior session); now also **consumed** by pattern detection —
  Pattern 152 (`auspicious-day-alignment`) reacts to the astrology signal
  together with `goals`/`intentions` signals on the same day, surfacing via
  the `cosmic` widget. The `astrology` source itself remains dependency-free
  (Tier 0).
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  carries rokuyo, moon phase + illumination, hourly zodiac, Western zodiac,
  and (new this session) Japanese zodiac — all timeZone-aware — rendered in
  the journal's `SYS:` block.
- **Correctness:** fixed a pre-existing `ReferenceError` in the QIE pattern
  engine (`dayMs` undefined) that was silently truncating pattern detection
  from Pattern 147 onward on every single analysis cycle, for every user —
  discovered while extending the same function for Pattern 152.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental. The Japanese zodiac added
  this session is the *current calendar year's* animal (ambient), not a
  birth-year animal.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-1omdn5
Files changed: 8
  src/client/stores/intentionEngine.ts     MODIFIED  (dayMs fix + Pattern 152)
  src/client/components/System.tsx         MODIFIED  (timeZone-aware memo, japaneseZodiac + moonEmoji display)
  src/client/components/Logs.tsx           MODIFIED  (astroJapaneseZodiac in SYS: block)
  src/client/utils/dayjs.ts                MODIFIED  (timezone plugin)
  src/server/models/user.ts                MODIFIED  (timeZone in profile view)
  src/server/utils/logs.ts                 MODIFIED  (astroJapaneseZodiac; toWallClockDate moved to shared)
  src/shared/types/index.ts                MODIFIED  (UserProfile.timeZone, LogContext.astroJapaneseZodiac)
  src/shared/utils/astrology.ts            MODIFIED  (exported toWallClockDate)
  docs/assembly/2026-08-25_LOT-assembly_astrology-widget-personalization-sync-v2.md  ADDED
```

---

## PENDING / FUTURE WORK

- All three deferrals from the 2026-07-27 report are now closed. No new
  deferrals from this session's own additions, beyond the standard
  self-assembly convention: Pattern 152's counters (patterns/archetypes/jobs
  totals in `About.tsx`, `docs/wiki/`, Field Manual version) are left for the
  next dedicated wiki/QIE sync session, per this repo's established
  pattern-then-sync-later workflow.
- Consider, in a future session, whether an archetype should react
  specifically to `auspicious-day-alignment` once it has accumulated a few
  more sibling patterns to combine with (the prior session's own guidance:
  don't mint an archetype prematurely for a single new pattern).
- The `dayMs` bug class (a variable used across a very long single function
  body without being declared in every branch that needs it) is worth a
  dedicated lint pass across `intentionEngine.ts` — this session fixed the
  one instance it touched, but did not audit the rest of the ~6,500-line
  file for siblings.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
