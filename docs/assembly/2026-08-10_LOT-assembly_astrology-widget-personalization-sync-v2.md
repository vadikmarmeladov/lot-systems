# LOT Self-Assembly Session Report
## 2026-08-10 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-rzlzbf`
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

This is the second session against this standing instruction. The first
(2026-07-27, `docs/assembly/2026-07-27_LOT-assembly_astrology-widget-
personalization-sync.md`, merged to master via PR #92) built the foundation:
staleness fix, moon illumination surfaced, `astrology` registered as a Tier 0
QIE signal source, `recordAstrologySignal` wired daily, and Logs synced via
`getLogContext`. This session picks up its "PENDING / FUTURE WORK" list.

---

## PHASE 0 — ORIENTATION / DISCOVERY

Verified the 2026-07-27 build is live on master and unchanged: `System.tsx`
still has the `astrologyTick` 15-min recompute, moon illumination render, and
the daily `recordAstrologySignal` effect; `intentionEngine.ts` still carries
`astrology: []` in `WIDGET_DEPENDENCY_MAP` as a Tier 0 source consumed by
`system`/`cosmic`; `Logs.tsx` still prints `ASTRO: {rokuyo} · {moonPhase}` in
the `SYS:` block. Nothing regressed between sessions.

Its Pending Work section named three open items:

1. Author a QIE pattern reacting to `astrology` together with `goals`/
   `intentions` (e.g. a nudge on Taian/auspicious days).
2. Make the client-side dashboard astrology reading timeZone-aware — only
   the server-side Logs snapshot was timeZone-aware; the live dashboard read
   device-local time.
3. `getJapaneseZodiac`/`getMoonEmoji` remain unused; candidates for a future
   opt-in personalization pass.

Two unplanned findings surfaced while reading the code this item 1/2 work
touches directly:

**Finding A — a real runtime bug in the exact function item 1 extends.**
`src/client/stores/intentionEngine.ts`, `analyzeIntentions()`, the Pattern
147 (`quantum-presence-field`) block referenced a `dayMs` constant that is
never declared in that function's scope (it exists only as a *local* const
inside two unrelated functions, `computeUserIndex` and one further down).
Running `npx tsc --noEmit -p tsconfig.json` confirms it as a hard error:
`TS2304: Cannot find name 'dayMs'` at the old line 3332. Every call to
`analyzeIntentions()` — which runs on essentially every meaningful signal —
threw a `ReferenceError` at that line, aborting the rest of the function:
Patterns 148–151, the `computeUserIndex()` call, and the `intentionEngine`
state commit that follows never ran. This means the QIE has likely not been
recomputing `userIndex` or persisting `recognizedPatterns` correctly for
some span of time in production, on every client. It went undetected because
of Finding B.

**Finding B — the build pipeline never type-checks `src/client`.**
`package.json` defines `client:build` (esbuild — transpiles, does not type-
check) and `server:build` (`tsc --project tsconfig.server.json`, whose
`include` is `["src/server", "src/shared"]` only). No script anywhere runs
`tsc --noEmit` over the full tree. Every session report that has recorded
"GREEN" against `npm run build` was verifying esbuild could strip the types,
not that they were valid. Running the full-tree check
(`npx tsc --noEmit -p tsconfig.json`, the project's own top-level
`tsconfig.json`) surfaces **104 pre-existing errors** across 24 client files
— none newly introduced this session, all latent. This is now recorded as
doctrine (`Client Type-Check Blind Spot`) with the baseline count, so future
sessions touching `src/client` have a number to diff against instead of
rediscovering the gap from zero each time.

Also confirmed while tracing the self-assembly bookkeeping: `docs/benchmark/
LOT-LEDGER.md` and `LOT-DOCTRINE.md` stop at `SR-20260719-01`/`SR-20260630-01`
respectively, even though `docs/LOT-SR-*.md` session reports continued
through `LOT-SR-20260805-01`. The ledger/doctrine/lexicon distillation step
was skipped in several intervening ENGINEERING sessions (badge codex work,
wiki sessions). Out of scope to backfill retroactively in this session — noted
here so a dedicated bookkeeping pass can reconcile it; this session's own
entries are appended honestly at the current tail, not backdated.

---

## PHASE 1 — BUILD

### 1. Fixed the `dayMs` ReferenceError (Finding A)

`intentionEngine.ts`: added `const dayMs = 24 * 60 * 60 * 1000` immediately
before its first use in the Pattern 147 block, matching the file's existing
convention of a locally-scoped time constant declared once and reused by
later pattern blocks in the same function (`weekMs` follows the identical
pattern, declared once at Pattern 141 and reused through Pattern 145).
Confirmed via `tsc --noEmit` diff: the `TS2304` error is gone; the remaining
103 errors are the same pre-existing set, byte-identical apart from shifted
line numbers.

### 2. Client-side astrology reading is now timeZone-aware (Pending item 2)

Added `getWallClockDate(timeZone, at?)` to `src/shared/utils/astrology.ts` —
the client-side equivalent of the server's `toWallClockDate()` trick in
`getLogContext()` (`src/server/utils/logs.ts`). The server builds its
wall-clock `Date` from `dayjs().tz(timeZone)`'s year/month/date/hour/minute/
second; dayjs's timezone plugin isn't loaded on the client
(`src/client/utils/dayjs.ts` only extends `utc`/`relativeTime`/`weekOfYear`/
`isoWeek`/`advancedFormat`/`dayOfYear`), so the client version reads the same
six fields via `Intl.DateTimeFormat(locale, { timeZone, ... }).formatToParts
()` instead — a browser/Node built-in, no new dependency. Both funnel through
the plain `Date` constructor, so `getHourlyZodiac`/`getRokuyo`/etc. work
identically regardless of which side computed the instant.

Getting the operator's `timeZone` to the client required closing a gap: the
`/api/me` endpoint (`fastify.get('/me', ...)` in `api.ts`) calls
`req.user.useProfileView()`, which explicitly `fp.pick()`s a fixed field
list that **omitted** `timeZone` — the server `User` model has had a
`timeZone` column all along, but the client-facing profile view never
exposed it. Added `'timeZone'` to that pick list (`src/server/models/
user.ts`) and added the matching `timeZone: string | null` field to the
shared `UserProfile` type (`src/shared/types/index.ts`). No new endpoint, no
new network call: `/api/me` is already fetched once at app bootstrap into
the `stores.me` nanostore (`src/client/entries/app.tsx`), so the value rides
along for free.

`System.tsx`: the `astrology` `useMemo` now computes `getWallClockDate(me
?.timeZone)` instead of `new Date()`, with `me?.timeZone` added to the
dependency array (alongside the existing `astrologyTick`) so the reading
recomputes once the profile finishes loading, not just on the 15-minute
tick. Before the profile loads, `getWallClockDate` falls back to its `at`
default (device-local `new Date()`), so there is no loading-state flash.

### 3. First pattern to consume the `astrology` signal (Pending item 1)

`intentionEngine.ts`, `analyzeIntentions()`: added **Pattern 152 —
`auspicious-day-alignment`**, directly after Pattern 151
(`recovery-intelligence-arc`), before the function's closing
`computeUserIndex()` call. Fires when the day's `astrology` signal carries
`metadata.auspicious === true` (rokuyo reads Taian, 大安, the most auspicious
day in the six-day cycle — this flag has been recorded by
`recordAstrologySignal` since the 2026-07-27 session but never read by
anything) **and** at least one direction-setting signal — a `goals` signal,
an `intentions` signal, or `hasCurrentIntention()` — has also fired in the
same 24h window.

Confidence is deliberately capped low (0.62–0.80, the lowest ceiling of any
pattern in the file) and framed as an invitation rather than a claim: the
`reason` string reads "Ambient reading and declared direction align. A
gentle day to act on intention." — astrology is ambient decoration per the
standing instruction, not a determinant of anything, so the pattern should
never read as the system asserting the day *is* auspicious, only noting that
the operator's own declared direction and the day's ambient reading happen
to coincide.

Registered `'auspicious-day-alignment': 'AUSDAY'` in the `PATTERN_DISPLAY`
map (`src/client/components/QuantumEngineWidgets.tsx`) so it renders with a
label instead of a raw pattern-name fallback wherever recognized patterns
are surfaced.

Deliberately **not** done this session: a background job / `AUSDAY:` Logs
handler for this pattern (the existing per-pattern Logs-handler convention,
e.g. `MOM:`, `TALIGN:`), and an `About.tsx` QIE version-line bump (the
`v82`/`v95`/... convention used when a session lands a full 3-pattern batch
plus archetype/job wiring). This session lands exactly one pattern reacting
to a Tier 0 signal that was sitting unconsumed since 2026-07-27; a full QIE
version bump with new archetype/job wiring is a larger unit of work than
"continue evolving the astrology widget" calls for on its own and is better
suited to a dedicated QIE self-assembly session, consistent with how the
prior astrology session deferred the same decision.

### 4. Item 3 (birth-year animal opt-in) — still deliberately deferred

`getJapaneseZodiac(year)` and `getMoonEmoji(phaseName)` remain unused. Adding
an opt-in birth-year-animal display would require a new `User` field (a
birth year, even without month/day/time, is still personal biographical
data the schema currently has zero trace of) and an explicit opt-in UI
surface — a product/privacy decision, not a code-shape decision, so it stays
out of scope for an unattended scheduled session exactly as the standing
instruction frames this feature ("ambient conditions, not personal natal
chart"). Noted again for a session where S-2 can make that call directly.

---

## PHASE 2 — TEST

```
npm install --legacy-peer-deps         -> OK (node_modules was absent; pre-existing
                                           @nanostores/react peer-version conflict,
                                           unrelated, worked around same as prior session)
npm run client:build                   -> PASS (esbuild + postcss)
npm run server:build                   -> PASS (tsc --project tsconfig.server.json)
npx tsc --noEmit -p tsconfig.json      -> 103 errors, all pre-existing (104 baseline
                                           minus the dayMs fix), zero new errors
                                           introduced by this session's changes
```

The full-tree `tsc --noEmit` run is new to this session's TEST phase — see
Finding B above. Diffed line-for-line against the pre-change baseline: every
remaining error is byte-identical in message and file, only shifted by the
line numbers my edits inserted. No regression.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % — all pure date-math, no external API,
  no personal birth data.
- **Personalization anchor:** the ambient reading is now timeZone-aware
  everywhere a user context exists — both the server-side Logs snapshot
  (since 2026-07-27) and, as of this session, the live client dashboard
  (`System.tsx`), both reading the same saved `user.timeZone` via the shared
  `getWallClockDate`/`toWallClockDate` wall-clock-passthrough technique.
  Falls back to device-local time before the profile loads or when no
  timeZone is saved — never blocks render, never throws.
- **Freshness:** recomputes every 15 minutes while the tab is visible, and
  immediately when the operator's timeZone finishes loading from `/api/me`.
- **Widget synchronization:** registered as a Tier 0 QIE signal source
  (`astrology`), consumed per the dependency graph by `system` and `cosmic`,
  emitting one `ambient_reading` signal per calendar day with an `auspicious`
  (Taian-day) flag in its metadata. That flag is now consumed: **Pattern 152
  (`auspicious-day-alignment`, handler `AUSDAY:`)** fires when a Taian day
  coincides with a `goals`/`intentions` signal in the same 24h window — the
  first pattern in the QIE's 152-pattern registry to react to the astrology
  signal source at all.
- **Logs synchronization:** unchanged from the prior session — every new log
  entry's `context` JSONB snapshot includes the ambient astrology reading at
  creation time (`astroRokuyo`/`astroMoonPhase`/`astroMoonIllumination`/
  `astroHourlyZodiac`/`astroWesternZodiac`), timeZone-aware per user,
  rendered in the journal's `SYS:` block next to weather/location.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental.
- **Adjacent fix, same function:** `analyzeIntentions()` no longer throws a
  `ReferenceError` partway through pattern detection on every invocation —
  Patterns 148–151 and the `userIndex` recompute that follows them now
  actually run, which they were silently failing to do before this session
  (see Finding A). This is a correctness fix to the QIE substrate the
  astrology pattern was added to, not an astrology-specific change, but it
  directly gates whether Pattern 152 (or 148–151) can ever fire.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-rzlzbf
Files changed: 8
  src/shared/utils/astrology.ts                 MODIFIED  (+getWallClockDate)
  src/shared/types/index.ts                     MODIFIED  (+UserProfile.timeZone)
  src/server/models/user.ts                     MODIFIED  (+timeZone to useProfileView pick list)
  src/client/components/System.tsx              MODIFIED  (getWallClockDate wiring)
  src/client/stores/intentionEngine.ts          MODIFIED  (dayMs fix + Pattern 152)
  src/client/components/QuantumEngineWidgets.tsx MODIFIED (PATTERN_DISPLAY +1)
  docs/benchmark/LOT-DOCTRINE.md                MODIFIED  (+2 clauses)
  docs/benchmark/LOT-LEXICON.md                 MODIFIED  (+3 tokens)
  docs/benchmark/LOT-LEDGER.md                  MODIFIED  (+1 line, appended)
  docs/LOT-SR-20260810-01.md                    ADDED     (terminal-grid session report)
  docs/assembly/2026-08-10_LOT-assembly_astrology-widget-personalization-sync-v2.md  ADDED  (this file)
```

---

## PENDING / FUTURE WORK

- `AUSDAY:` has no Logs-handler render block yet (the `MOM:`/`TALIGN:`-style
  convention) and no background job writes it to the durable log; it exists
  only in the client-side, 7-day-rolling `recognizedPatterns` list today.
  Wiring a Logs handler + job would make Taian-day alignment durable and
  queryable the way the other named QIE arcs are.
- A dedicated QIE self-assembly session (archetype/job wiring, `About.tsx`
  version-line bump, Field Manual sync) could formally register a
  "Auspicious Alignment" style archetype if Pattern 152 proves to recur
  meaningfully once real signal data accumulates — intentionally deferred,
  same reasoning the 2026-07-27 session used for the same decision.
- `docs/benchmark/LOT-LEDGER.md`/`LOT-DOCTRINE.md` are behind
  `docs/LOT-SR-*.md` by roughly two weeks of sessions (last real entries
  `SR-20260719-01`/`SR-20260630-01` vs. reports through `SR-20260805-01`).
  A dedicated bookkeeping session should reconcile this rather than each
  session silently working around the gap.
- `getJapaneseZodiac`/`getMoonEmoji` still unused — opt-in birth-year-animal
  personalization remains a live candidate, gated on a product/privacy
  decision about collecting a birth year.
- The 103 pre-existing `tsc --noEmit` errors across 24 client files (see
  Finding B / `Client Type-Check Blind Spot` doctrine) are tracked as a
  baseline, not fixed wholesale this session — out of scope for an astrology
  session, but now visible for whichever session picks them up.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
