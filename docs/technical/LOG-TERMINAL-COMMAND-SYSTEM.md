<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Log Terminal — Command System Reference

**Classification:** RESTRICTED // S-2 EYES
**S-2:** Vadik Marmeladov
**Date:** 3 September 2026
**Status:** OPERATIONAL
**Scope:** The Log (Journal) slash-command terminal, its dispatch architecture,
its data contracts, and its integration points with the QIE, the Badge/Arcade
system, and the story-compression subsystem.

---

## 1. Doctrine

The Log is not a form. It is a single ghost-typed textarea with no submit
button, no prompts, and no required structure — the passive AI UI described
in the LOT Systems brief. The user types. The system autosaves. Underneath
that plain text field, a second channel runs in parallel: a **command
terminal** triggered by `/word` tokens or emoji, detected inline, dispatched
without leaving the textarea, and rendered as military-instrument blocks
beneath it (COCKPIT-RULE: label names the event, body is data — no prose).

This keeps two promises simultaneous: the Log stays a journal (free
associative writing, zero friction) and the Log becomes a terminal (deep
system queries, one keystroke away) without the two ever competing for the
same UI surface.

---

## 2. Architecture

```
┌──────────────────┐     ┌───────────────────┐     ┌──────────────────────┐
│  NoteEditor       │     │  logTriggers.ts    │     │  Dispatch effect      │
│  (Logs.tsx)       │────▶│  detectNewTriggers │────▶│  (Logs.tsx, per-      │
│  ghost textarea,  │     │  pure, no stores,  │     │  trigger if/else      │
│  value state      │     │  diff vs. last scan│     │  chain)               │
└──────────────────┘     └───────────────────┘     └──────────┬───────────┘
                                                                │
                          ┌─────────────────────────────────────┼───────────┐
                          ▼                                     ▼           ▼
                 client-only reads                    server mutation   badge award
                 (intentionEngine,                     (POST /api/qi,   (awardBadge,
                 getAssemblyState,                      /prayer,        Arcade hook)
                 getUserState)                          /story,
                                                         /assembly)
```

**Files:**
- `src/client/utils/logTriggers.ts` — pure detector module. `LogTrigger` union
  type, `RULES` table (trigger → emoji(s) + keyword(s)), `detectTriggers()`,
  `detectNewTriggers()`. No stores, no DOM, testable in isolation.
- `src/client/components/Logs.tsx` — `NoteEditor` component (the actual
  editor). A `React.useEffect` on `[value]` calls `detectNewTriggers`, then
  dispatches each fresh trigger through an `if (trigger === 'x') {...} else
  if (trigger === 'y') {...}` chain. Each branch either computes a result
  client-side (reading `intentionEngine`, `getAssemblyState`, `getUserState`)
  or calls a mutation hook that POSTs to a server route. Results render as
  `Block` components beneath the textarea.
- `src/server/routes/api.ts` — server routes for the AI-backed commands
  (`/qi`, `/story`, `/prayer`, `/assembly`).
- `src/server/models/log.ts` — the `Log` table every command's output is
  ultimately persisted to (see §4).

**Design rule (from `logTriggers.ts` header comment):** detectors are
case-insensitive for keywords, exact for emoji; each detector is idempotent —
editing around an existing trigger does not re-fire it, because
`detectNewTriggers` diffs the current trigger set against the previous scan,
not against a per-keystroke re-evaluation.

---

## 3. Command Reference

| Command | Keywords/Emoji | Server call | Result block |
|---|---|---|---|
| `/system`, `/help` | `system`, `commands`, `help` | — (client) | `SYSTEM:` |
| `/story` | `story`, 📖 | `POST /api/story` | story panel |
| `/qi <query>` | `qi` | `POST /api/qi` | `QI [INTSUM]:` |
| `/prayer`, `/candle` | `prayer`, `candle`, 🕯️ | `POST /api/prayer` | 🕯️ panel |
| `/assembly`, `/assemble` | `assembly`, `assemble` | `POST /api/assembly` | `TRANSMISSION:` |
| `/scan`, `/ai` | `scan`, `ai` | — (client) | `SCAN:` |
| `/phys`, `/cohort-report` | `phys`, `cohort-report` | — (client) | `PHYS:` |
| `/qos`, `/os-report` | `qos`, `os-report` | — (client) | analyzeIntentions() |
| `/silent`, `/quiet` | `silent`, `quiet` | — (client) | `SIL [PROTOCOL]:` |
| `/sil`, `/silence-check` | `sil`, `silence-check` | — (client) | `SIL-CHECK:` |
| ❗ / ‼️ (heavy exclamation) | emoji only | — (client) | `SUPPORT:` |
| `/fast` | `fast` | — (client) | `FAST:` |
| `/breathe`, `/breath` | `breathe`, `breath` | — (client, `useBreathe`) | breathing panel |
| `/freeze`, `/pause` | `freeze`, `pause`, 🧊 | — (client) | `FREEZE:` |
| `/synth`, `/keyboard` | `synth`, `keyboard`, 🎹 | — (client, toggle) | chime, no panel |
| `/radio` | `radio`, 🎧 | — (client, toggle) | — |
| `/night` | `night`, 🌙 | — (client, toggle) | — |
| `/how` | `how` | — (client, navigation) | navigates to System tab |

`/system` (or `/help`) prints this same table in-terminal, generated from a
static list kept in sync by hand in the `system-help` dispatch branch —
**when a command is added, add its line to that list too**, or `/system`
silently drifts out of sync with what actually fires (see §7, Known Gaps).

### 3.1 `/sil` and ❗ — newly wired (this session)

Both existed as detected-but-dead triggers before this session: `logTriggers.ts`
defined the `sil-check` and `cohort-support` rules, but no branch in the
`Logs.tsx` dispatch chain handled them, so typing `/sil` or a heavy
exclamation mark did nothing observable. Two distinct, real signals were
sitting unused:

- **`signal-silence`** — a named QIE pattern (`intentionEngine.ts`, ~line
  1297) already computed into `recognizedPatterns`. `/sil` now reads it
  directly and reports confidence, suggested timing, and reason, distinct
  from the generic "time since last signal" that `/silent` already showed.
- **`needsSupport`** — a field on `UserState` (`critical` / `moderate` /
  `low` / `none`), derived from anxious-signal density and depleted energy
  (`intentionEngine.ts`, ~line 3520). ❗/‼️ now surfaces it with a
  non-clinical, self-care-toned response line — consistent with the
  Trauma-Informed Protocol doctrine already governing the Memory Engine
  (observational framing, no diagnosis, "field medic" tone).

Both are pure client-side reads (no new server route), matching the pattern
of `/silent`, `/freeze`, and `/phys`.

---

## 4. Data Contracts

### 4.1 `Log` table (`src/server/models/log.ts`)

```
id         UUID  PK
userId     UUID  FK -> users.id (CASCADE)
text       TEXT  nullable
event      STRING NOT NULL   — the event-type discriminator
metadata   JSONB  default {}
context    JSONB  default {} — see 4.2
createdAt / updatedAt
```

Every journal entry is `event: 'note'` (the default set server-side in
`POST /logs` when no `event` is supplied). This is the single most important
fact for anyone building a feature that reads "journal entries" — see §5 for
what happens when a route assumes a different event name.

### 4.2 `LogContext` — context captured at write time

`getLogContext(user)` (`src/server/utils/logs.ts`) is called immediately
before nearly every `Log.create(...)` across the server (15+ call sites).
It assembles:

- **Time:** wall-clock `Date` via the user's `timeZone`.
- **Location:** `country` / `city` from the `User` row.
- **Weather:** cached `WeatherResponse` row for that city (no live API call
  per log — refreshed on a separate cycle, stale-checked against
  `WEATHER_STALE_TIME_MINUTES`).
- **Astrology:** `getRokuyo`, `getMoonPhase`, `getHourlyZodiac`,
  `getWesternZodiac` (`src/shared/utils/astrology.ts`).

This is what the LOT brief calls the "click creates a record without a
photo or sound" behavior — every log write carries a full environmental
snapshot (weather, time, location, astrology) as structured `context` JSON,
independent of whatever the user typed.

### 4.3 `displayableEvents` allowlist (`GET /api/logs`, `api.ts` ~line 1084)

A new event type is invisible in the Log feed until its name is added to
this allowlist — this is the **Backend Whitelist Hygiene** doctrine clause
already on record in `LOT-DOCTRINE.md` (SR-20260604-01). Every command that
writes a new `Log` row with a new `event` value must register it here.

---

## 5. Story Compression — Two Systems, One Name

"Compressed story" in the LOT product vocabulary refers to two independent
implementations. Confusing them was the source of a real bug fixed this
session.

### 5.1 `/story` — on-demand AI story (`POST /api/story`, `api.ts` ~line 5486)

Gated to `usership` tag members. Pulls the user's last 200 `Log` rows,
filters for journal text, recent moods, and self-care answers, and asks
Together AI for a 100-200 word second-person narrative. Persists the result
as `Log.create({ event: 'generated_story', ... })`.

**Bug found and fixed this session:** the filter for journal entries read
`l.event === 'log_entry' || l.event === 'journal'` — neither event name is
ever written anywhere in this codebase. Real journal entries are written as
`event: 'note'` (§4.1). The filter for self-care/memory answers had the same
class of bug: `'memory_answer' | 'self_care_checkin' | 'energy_checkin'`
instead of the real event names `'answer'` and `'self_care_complete'` /
`'self_care_completed'`. Net effect: **every `/story` generation, since the
route was written, ran with an empty `RECENT LOG ENTRIES` block and an empty
`SELF-CARE DATA` block** — the AI was writing from mood data alone, silently
missing the two richest inputs. Both filters now match the real event names
(`src/server/routes/api.ts`).

This is the same failure shape as the doctrine's existing "Backend Whitelist
Hygiene" clause (write→read event-type mismatch, no error, silent data
loss) — worth checking any future route that filters `Log` rows by `event`
string literal against the actual values `note` / `answer` /
`self_care_complete` / `emotional_checkin` / `plan_set` / `intention_set`
before trusting it.

### 5.2 Job 24 — Weekly LOT® AI Story (`src/server/scheduled-jobs.ts` ~line 834)

A standing background job, not a Log command. Runs Sunday 18:00 UTC:
aggregates each user's last 7 days of `Log` rows, requires 3+ logs to bother,
derives `dominantMood` from `emotional_checkin` events and a `weekTone`
(`growth` / `recovery` / `steady`) from positive-vs-hard mood ratio, and
composes a **template-based** narrative — no AI call, by design ("dense,
honest, earned compression"). Writes `Log.create({ event: 'lot_ai_story',
... })` and mirrors the result into `user.metadata.weeklyStory` for direct
read without re-querying logs.

There are currently **no daily, monthly, or yearly compression tiers** — only
this weekly one. A daily/monthly/yearly extension would follow the same
shape: aggregate `Log` rows for the period, derive tone/mood, write a new
`event` value, register it in `displayableEvents`, and (for AI-backed tiers)
decide whether it should use the `/story` AI path or Job 24's template
path — the tradeoff being real cost/latency (AI) versus static but honest
compression (template).

---

## 6. Arcade Integration — Terminal Operator Badges

Per product direction, the Log terminal is also a surface for the gamified
Arcade layer, not just a diagnostic one. The badge system
(`src/client/utils/badges.ts`, `src/client/utils/easter-eggs.ts`) already
awards badges from journal *text* (word-turn badges, via
`runJournalEasterEggs()` called from the autosave effect). This session adds
the first badges tied to **command usage** rather than word content:

| Badge | Rarity | Fires on |
|---|---|---|
| `terminal_initiate` | common | first slash-command of any kind detected |
| `qi_analyst` | uncommon | a `/qi <query>` request is sent |
| `story_weaver` | uncommon | a `/story` request is sent |

Hook points, all in the `Logs.tsx` dispatch effect: `awardBadge('terminal_initiate')`
fires once per loop iteration before the if/else chain (so it fires on the
first trigger of any kind, deduped by `awardBadge`'s own `getEarnedBadges()`
check); `awardBadge('qi_analyst')` / `awardBadge('story_weaver')` fire inside
their respective branches, after the mutation is dispatched.

**Persistence caveat (pre-existing, documented for future badge work):** the
server's `POST /api/sync-badges` (`api.ts` ~line 684) only merges badge IDs
present in a hardcoded `validBadges` array into `user.metadata.badges` — of
~560 client-defined badges, only 3 (`milestone_7/30/100`) were previously
whitelisted there; everything else lives in `localStorage` only and does not
survive a device change. The three new Terminal Operator badges were added
to `validBadges` as part of this session specifically so they persist and
sync cross-device — this does not fix the gap for the other ~560 badges,
which remains a known, pre-existing scope limitation.

---

## 7. Known Gaps (honest boundary, per Benchmark doctrine)

- **`/system` help text is hand-maintained.** It is a static string array,
  not derived from `RULES` in `logTriggers.ts`. Adding a trigger without
  adding its help line makes it real-but-undiscoverable; the inverse
  (documenting a trigger that has no dispatch branch) is exactly the bug
  fixed in §3.1. There is no automated check tying the two together.
- **Client TypeScript is not type-checked in the enforced build gate.**
  `npm run client:build` runs esbuild (transpile-only, no type errors
  surfaced beyond duplicate-object-key warnings); only `npm run server:build`
  runs `tsc` and only over `src/server` + `src/shared`. A full
  `tsc --noEmit -p tsconfig.json` run during this session surfaced ~40
  pre-existing type errors under `src/client` (mostly `badges.ts` `category`
  fields using string literals — `'behavioral'`, `'calendar'`, `'mastery'`,
  `'achievement'` — that were never added to the `Badge.category` union, plus
  two genuine duplicate object keys: `quarter_drop`, `elixir_found`). None of
  these are in code this session touched; none are new. Recorded here as a
  DISTILL finding for a future session, marked `PROVISIONAL` in scope (not
  verified whether any are load-bearing beyond the type system).
- **No daily/monthly/yearly story compression tiers** — see §5.2.

---

**LOT Systems Corporation**
**Vadim Marmeladov — CEO, Founder, Inventor**
