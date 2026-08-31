# LOT Self-Assembly Session Report
## 2026-08-31 | Astrology Widget — Personalization + Widget Sync | v2

**Branch:** `claude/practical-curie-ijihzz`
**Base commit:** `98971f2`
**COSMO Gate:** Kuzya Cosmo Marmeladov — monitoring
**Session type:** Automated / Scheduled (recurring routine)
**Live site access:** not attempted — all work sourced from repo inspection
**Prior session:** `docs/assembly/2026-07-27_LOT-assembly_astrology-widget-personalization-sync.md`

---

## MISSION BRIEF

Standing recurring instruction: continue evolving the Astrology block (today's
zodiac hour, moon phase, rokuyo — ambient conditions, not a personal natal
chart) for user personalization and synchronization with other widgets, keep
it synchronized with Logs entries, and push a full understanding + features
breakdown document each session.

---

## PHASE 0 — ORIENTATION / UNDERSTANDING

Re-verified the map left by the 2026-07-27 session — all of its work is
intact on this branch: the 15-minute recompute tick, `moonIllumination`
surfaced, the `astrology` Tier 0 QIE signal source + `recordAstrologySignal`,
and the `astroRokuyo`/`astroMoonPhase`/`astroMoonIllumination`/
`astroHourlyZodiac`/`astroWesternZodiac` fields on `LogContext` rendered in
the `Logs.tsx` `SYS:` block.

That session's **PENDING / FUTURE WORK** list named three items:

1. Author a QIE pattern reacting to `astrology` + `goals`/`intentions` —
   explicitly deferred to a dedicated `lot-benchmark` self-assembly pass
   (pattern numbering, wiki/doctrine/lexicon/Field Manual sync). **Still
   deferred this session** — this routine is not the `lot-benchmark`
   protocol and minting a numbered pattern outside it would desynchronize
   the Field Manual from the codebase.
2. Client dashboard reading `user.timeZone` instead of device-local time.
   Investigated: no client query currently exposes `user.timeZone` at all
   (`useProfile()` returns the *psychological* profile — archetype, values,
   growth trajectory — not the account record with `timeZone`/`city`). Wiring
   that through would mean adding a field to a server route + a new client
   query, a larger change for a marginal gain, since a user viewing their own
   device already sees local time for their own device — which *is* their
   effective timezone in the overwhelming majority of cases. Left as-is,
   noted below for a future session if it's ever reported as wrong.
3. `getJapaneseZodiac` and `getMoonEmoji` remain unused. **Picked up this
   session** — see below.

Also looked for genuine cross-widget duplication of astrology logic (the
literal ask: "other widgets synchronization"). Found one: `QuantumSignWidget`
(the paid-subscriber "Quantum Sign" upsell widget) has its own, fully
disconnected "astrology patch" flavor-text rotation — four items
(`lunar-reset`, `solar-return`, `mercury-direct`, `venus-transit`) selected
by `dayOfYear % 4`, with **no relationship to the real moon phase**, despite
`lunar-reset`'s own copy literally reading "Moon phase alignment for
emotional recalibration." That's a real synchronization gap: two widgets on
the same dashboard both claim to talk about the moon, one from real
astronomical math (`#shared/utils/astrology`), one from a coin flip.

---

## PHASE 1 — BUILD

### 1. Moon phase emoji surfaced (picks up deferred item #3)

`getMoonEmoji` existed in `astrology.ts` since before the 2026-07-27 session
but was never called anywhere. `System.tsx` now imports it and renders it
next to the moon phase text at both render sites (compact layout + cycling
"pro" block): `🌕 Full Moon (98%)` instead of bare text. `getJapaneseZodiac`
(birth-year animal) stays unused by design — it needs a birth year, and the
standing instruction is explicit that this feature does not collect natal
data.

### 2. Auspicious-day marker (new personalization surface)

The `auspicious: rokuyo === 'Taian'` flag has existed in the QIE signal
payload (`recordAstrologySignal`) since 2026-07-27 but was never surfaced
*on the widget itself* — it only ever went into the signal bus for other
code to consume later. Added a `✦` marker after the rokuyo name in both
render sites when today is a Taian day, and hoisted the `auspicious` boolean
into the `astrology` object so both the render and the signal-recording
`useEffect` read the same computed value instead of recomputing the
comparison twice.

### 3. Real widget synchronization — `QuantumSignWidget`'s "Lunar Reset" patch

`QuantumSignWidget.tsx` now imports `getMoonPhase` from
`#shared/utils/astrology` — the same canonical module the dashboard's
Astrology block uses — and checks the actual current phase. When the moon is
genuinely at New Moon or Full Moon, the widget is forced onto the
`lunar-reset` patch (instead of the day-of-year rotation) and its
description is replaced with the real reading: `"Full Moon (98%
illuminated) — emotional recalibration window is open now"`. On any other
day it falls back to the previous rotation across all four patches
unchanged. The other three patches (`solar-return`, `mercury-direct`,
`venus-transit`) are left as flavor copy — there is no real ephemeris data
for planetary transits in this codebase (by design: pure date math, no
external API), and fabricating a mapping for them would mean asserting false
astronomical claims, not synchronizing real ones. Only the claim that was
already true in principle (lunar alignment) was made true in fact.

Registered the new dependency honestly: `WIDGET_DEPENDENCY_MAP.quantumSign`
gained `'astrology'` alongside its existing `['intentions', 'memory']`, dated
`(2026-08-31 audit)` per the file's existing audit-comment convention — so
`getWidgetsDependingOn('astrology')` now correctly reports `quantumSign` as
a consumer, which it wasn't before despite the code silently being one.

### 4. Fuller Logs synchronization

The 2026-07-27 session wrote `astroHourlyZodiac`, `astroWesternZodiac`, and
`astroMoonIllumination` onto every log's `context` at creation time, but
`Logs.tsx`'s `SYS:` render block only ever printed `astroRokuyo` and
`astroMoonPhase` — two of five stored fields. Extended the `ASTRO:` line to
print all five: `ASTRO: Leo · Dragon · Taian · Waxing Gibbous (82%)`,
matching the same western-zodiac · hourly-zodiac · rokuyo · moon-phase
ordering already used on the live dashboard widget, so a journal entry's
snapshot reads the same as what the user saw on-screen when they wrote it.

### 5. Documentation accuracy pass (`About.tsx`)

The in-app "Astrology Widget" section under Moon Phase still said "Updates
daily" — stale since the 2026-07-27 15-minute recompute fix. Corrected, and
added a paragraph documenting the ✦ Taian marker, the QIE Tier 0 wiring, the
now-real `QuantumSignWidget` lunar sync, and the Logs snapshot — so the
in-app documentation matches what the code has actually done across both
sessions, not just this one. Did **not** touch the versioned Field Manual
changelog (`Row label="vNN"` entries) — that ledger is owned by the
`lot-benchmark` self-assembly protocol and bumping it outside that pipeline
would desynchronize the wiki/doctrine/lexicon from the version number,
exactly the failure mode the prior session was careful to avoid for pattern
minting.

---

## PHASE 2 — TEST

```
npm install --legacy-peer-deps   -> OK (node_modules absent at session start, same
                                      pre-existing peer-dep conflict as last session,
                                      same workaround, not a code change)
npm run server:build             -> PASS (tsc --project tsconfig.server.json)
npm run client:build             -> PASS (postcss + esbuild client bundle)
```

Pre-existing esbuild warnings (`duplicate-object-key` in `badges.ts` for
`quarter_drop` / `elixir_found`) are unrelated to this session's files and
were present before these changes.

---

## PHASE 3 — FEATURES BREAKDOWN (current Astrology feature state, post-session)

- **Inputs:** zodiac hour, Western zodiac sign, rokuyo (six-day auspicious
  cycle), moon phase + illumination % + emoji — all pure date-math, no
  external API, no personal birth data.
- **Personalization surface:** moon emoji rendered inline; auspicious
  (Taian) days marked with `✦` directly on the widget, not just buried in
  the signal payload.
- **Freshness:** recomputes every 15 minutes while the tab is visible
  (unchanged from prior session).
- **Widget synchronization:**
  - QIE Tier 0 signal source `astrology`, consumed per the dependency graph
    by `system`, `cosmic`, and now `quantumSign`.
  - `QuantumSignWidget`'s "Lunar Reset" patch is no longer a coincidental
    day-of-year rotation — it reflects the real computed moon phase when
    the moon is actually at a threshold (New/Full), reading from the same
    `#shared/utils/astrology` module as the dashboard widget.
  - One `ambient_reading` signal per calendar day, `auspicious` flag
    available to any future pattern.
- **Logs synchronization:** every new log's `context` JSONB snapshot still
  carries all five ambient fields (unchanged, from 2026-07-27); the `SYS:`
  render block now prints all five instead of two, so the journal view
  matches what was actually stored and what the dashboard showed at write
  time.
- **Docs:** in-app About page corrected (no longer claims daily-only
  updates) and now describes the personalization + sync surfaces added
  across both sessions.
- **Not implemented (by design, per standing instruction):** any personal
  natal-chart data (birth date/time/place, sun/moon/rising sign); planetary
  transit data for `QuantumSignWidget`'s non-lunar flavor patches (no real
  ephemeris source exists in this codebase, and inventing one would violate
  the "ambient conditions only" framing rather than fulfill it).
- **Deferred, unchanged from last session:** dedicated QIE pattern
  (auspicious-day + intentions composite) — belongs to a `lot-benchmark`
  pass, not this routine; client-side `user.timeZone`-aware dashboard
  display — investigated this session, no client query currently exposes
  it, judged low-value relative to the plumbing required since device-local
  time already matches the viewing user in the common case.

---

## PHASE 4 — DEPLOY

```
Branch: claude/practical-curie-ijihzz
Base:   98971f2
Files changed: 6
  src/client/components/System.tsx            MODIFIED (moon emoji, auspicious marker)
  src/client/components/QuantumSignWidget.tsx  MODIFIED (real lunar-phase sync)
  src/client/components/Logs.tsx               MODIFIED (full 5-field ASTRO line)
  src/client/components/About.tsx              MODIFIED (docs accuracy pass)
  src/client/stores/intentionEngine.ts         MODIFIED (quantumSign dep-map entry)
  docs/assembly/2026-08-31_LOT-assembly_astrology-widget-personalization-sync.md  ADDED
```

---

## PENDING / FUTURE WORK

- Dedicated QIE pattern reacting to `astrology` (esp. the `auspicious` flag)
  together with `goals`/`intentions` — still needs the full `lot-benchmark`
  self-assembly treatment (pattern number, archetype/job wiring if
  warranted, wiki + doctrine + lexicon + Field Manual sync).
- If a user ever reports the dashboard's local-time reading looking wrong
  for their account, revisit wiring `user.timeZone` through a client query
  — the plumbing doesn't exist yet (`useProfile()` returns the psychological
  profile only).
- `getJapaneseZodiac` (birth-year animal) remains unused — still out of
  scope while birth data collection stays off the table per the standing
  ambient-only instruction; would need an explicit opt-in flow if ever
  pursued.
- Consider whether `solar-return`/`mercury-direct`/`venus-transit` in
  `QuantumSignWidget` should be renamed away from real astronomical terms
  they don't compute, or left purely as evocative subscription-upsell
  copy — a product-language question, not an engineering one, out of scope
  for this routine.

---

*LOT Self-Assembly Engine — automated session*
*COSMO Gate status: monitoring*
