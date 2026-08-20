# LOT Self-Assembly Session Report
## 2026-08-20 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-d9duyv`
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

This is the second dated session against this instruction. The first
(`docs/assembly/2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`)
fixed a staleness bug, surfaced moon illumination, registered `astrology` as
a Tier 0 signal source in the QIE dependency graph, and snapshotted the
ambient reading onto every Log entry. This session starts from re-verifying
that state, then closes the single biggest gap that session explicitly
deferred.

---

## PHASE 0 — RE-ORIENTATION / VERIFICATION

Re-audited the feature map against the current `master`-derived branch
(commit `98971f2`, ~13 QIE/wiki/badge versions ahead of the prior session's
base). All four 2026-07-27 deliverables confirmed still present and intact:

| Deliverable (2026-07-27) | Verified at | Status |
|---|---|---|
| 15-min recompute tick, off-tab safe | `System.tsx` `astrologyTick` state + effect | present |
| Moon illumination surfaced in both render sites | `System.tsx:466,674` `{moonPhase} ({moonIllumination}%)` | present |
| `astrology` registered as Tier 0 QIE signal + dependency of `system`/`cosmic` | `intentionEngine.ts:3800,3830,3834` | present |
| `recordAstrologySignal()`, called once/day via localStorage date-stamp | `intentionEngine.ts:4878`, `System.tsx:226-239` | present |
| `LogContext.astro*` fields + `getLogContext()` populating them per-user-timeZone | `types/index.ts:168-172`, `server/utils/logs.ts` | present |
| `Logs.tsx` `SYS:` block rendering `ASTRO: {rokuyo} · {moonPhase}` | `Logs.tsx:365-366` | present |

Confirmed the gap flagged as **PENDING** in that session's report was still
open: `astrology` was a registered Tier 0 signal **source** — recorded once
daily — but **zero pattern-detection code in `analyzeIntentions()` actually
read it**. Grepped for `s.source === 'astrology'` across the ~6,500-line QIE
pattern file: no matches before this session. The signal flowed into the bus
and sat there, consumed by nothing. That is the one concrete, scoped piece of
work this session does.

Also re-confirmed, unchanged since last session (still correctly out of
scope): no natal-chart data exists on the `User` model (no birthDate/
birthTime/birthPlace/lat-long); `getJapaneseZodiac` and `getMoonEmoji` in
`shared/utils/astrology.ts` remain unused (no birth-year data to key a
"birth animal" off); client dashboard display still reads device-local time,
not `user.timeZone` (only the server-side Logs snapshot is timeZone-aware).
None of these are touched this session — see PENDING below for why.

---

## PHASE 1 — BUILD

### Pattern 152: Auspicious Goal Alignment — first consumer of the `astrology` signal

`src/client/stores/intentionEngine.ts`, inside `analyzeIntentions()`,
immediately after Pattern 151 (`recovery-intelligence-arc`):

- Filters today's signals (local midnight to now) for an `astrology` signal
  with `metadata.auspicious === true` — i.e. today's Rokuyo reading is
  **Taian** (大安), the most auspicious day in the six-day cycle — and for
  any `goals` signal (`goal_set` or `goal_complete`) recorded the same day.
- When both are present, pushes an `auspicious-goal-alignment` pattern.
  Confidence starts at `0.6`, with up to `+0.15` bonus scaled by the number
  of goals *completed* (not just set) that day, capped at `0.82` — following
  the same confidence-shaping convention used by neighboring patterns
  (P150/P151) rather than a flat score.
- `suggestedWidget: 'cosmic'`, `suggestedTiming: 'soon'` — ties the ambient
  astrology reading to the widget the dependency map already declared it
  feeds (`cosmic: ['mood', 'energy', 'intentions', 'astrology']`), giving
  that declared edge an actual pattern behind it for the first time.
- `reason` follows the file's `TAG: sentence` convention (`AUSGOAL: ...`),
  matching every other pattern's reason-string format so it renders
  correctly wherever `IntentionPattern.reason` is surfaced.

This is deliberately the smallest change that makes the `astrology` → QIE
wiring real rather than declarative: one pattern, reading the exact signal
shape `recordAstrologySignal()` already emits (`source: 'astrology'`,
`metadata.auspicious`), combined with the existing `goals` signal source
(`recordGoalSignal()`), no new signal-recording call sites, no schema
changes, no touch to Logs/System.tsx/render code — all of which were already
correct from the prior session and re-verified in Phase 0.

Not done this session (see PENDING): a second astrology-consuming pattern
(e.g. keying off `hourlyZodiac`/`westernZodiac` rather than only the
Taian/auspicious flag), or wiring `CosmicUpdateWidget`'s pixel-art aesthetic
selection (currently `Math.random()` between Japanese/car-audio prompt
sets) to the day's ambient reading — both are plausible next steps but
change *rendering/generation behavior* rather than *data flow*, a larger and
more subjective surface than this session's scope.

---

## PHASE 2 — TEST

```
npm install --legacy-peer-deps   -> OK (node_modules was absent this session; pre-existing
                                     @nanostores/react peer-version conflict, unrelated,
                                     worked around the same way as the prior session)
npm run build                    -> PASS (client:css:build + client:js:build + server tsc)
```

Build output shows two pre-existing `esbuild` duplicate-object-key warnings
in `src/client/utils/badges.ts` (`quarter_drop`, `elixir_found`) — present
before this session's change, unrelated to the Astrology/QIE files touched,
left untouched (out of scope for this routine).

Zero errors or new warnings attributable to this session's change.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % — pure date-math, no external API, no
  personal birth data. Source of truth: `src/shared/utils/astrology.ts`
  (isomorphic — same functions run client-side for display and server-side
  for Log snapshotting).
- **Freshness:** recomputes every 15 minutes while the dashboard tab is
  visible; paused while backgrounded.
- **Display:** `System.tsx` compact layout (static `Block label="Astrology:"`)
  and "pro" layout (cycling block: Astrology → Psychology → Journey →
  Quantum), both showing `{westernZodiac} • {hourlyZodiac} • {rokuyo} •
  {moonPhase} ({moonIllumination}%)`.
- **Widget synchronization (QIE):** `astrology` is a Tier 0 signal source
  (`WIDGET_DEPENDENCY_MAP`), recorded once per calendar day
  (`recordAstrologySignal`), consumed by the dependency graph for `system`
  and `cosmic`. **New this session:** the first pattern that actually reads
  the signal — `auspicious-goal-alignment` (Pattern 152) — fires when a
  Taian (auspicious) day coincides with goal-setting or goal-completion
  activity, feeding `getOptimalWidget()`'s scoring with a `cosmic`-widget
  suggestion and an `AUSGOAL:` reason string.
- **Logs synchronization:** every new log entry's `context` JSONB snapshot
  includes the ambient astrology reading at creation time (user-timeZone
  aware, via `getLogContext()`), rendered in the journal's `SYS:` block as
  `ASTRO: {rokuyo} · {moonPhase}`.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign) — the
  feature remains strictly ambient/environmental. `getJapaneseZodiac`
  (year-based animal) and `getMoonEmoji` remain unused pending a birth-data
  field that does not currently exist on the `User` model.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-d9duyv
Files changed: 1
  src/client/stores/intentionEngine.ts   MODIFIED  (+23 lines, Pattern 152)
  docs/assembly/2026-08-20_LOT-assembly_astrology-widget-personalization-sync.md  ADDED
```

---

## PENDING / FUTURE WORK

- A second astrology-consuming pattern keyed off `hourlyZodiac`/
  `westernZodiac` rather than only the `auspicious` (Taian) flag — the raw
  signal already carries both, only the Rokuyo dimension has a consumer so
  far.
- Wire `CosmicUpdateWidget`'s aesthetic-prompt selection (currently uniform
  random between Japanese woodblock and car-audio styles) to the day's
  ambient reading — e.g. moon phase biasing toward the Japanese set on
  Taian/Full Moon days. Deliberately not attempted this session: it changes
  generation/rendering behavior (a more subjective, higher-blast-radius
  surface) rather than data flow, and deserves its own session with
  explicit before/after visual review.
- Consider whether the client-side dashboard display should read from
  `user.timeZone` (client dayjs instance has no `timezone` plugin loaded,
  unlike the server instance in `server/utils/dayjs.ts`) instead of
  device-local time — carried over unchanged from the 2026-07-27 report;
  still real, still deferred as a larger blast-radius change (the client
  dayjs singleton is shared across many components).
- `getJapaneseZodiac`/`getMoonEmoji` remain unused; a "birth year animal"
  opt-in would need a new `User.birthYear`-class field first, which is a
  product decision (does adding *any* birth data conflict with the "not a
  natal chart" framing?) not a code change — flagging for a human call
  rather than silently deciding either way.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
