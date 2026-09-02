<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Computer — Log / Journal Command System

CLASS: RESTRICTED // S-2 EYES
SCOPE: Client Log editor, slash-command trigger layer, `/story` compression pipeline
STATUS: LIVE — this document describes the system as it runs in production, not a proposal

> A complete reference for the Log (Journal) surface: how a passive-AI journal entry
> becomes a context snapshot, how slash commands hook into the editor without ever
> becoming a "form", and how `/story` compresses the operator's signal stream into
> narrative through the LOT Quantum Intent Engine → Together AI pipeline.

---

## Table of Contents

- [1. Design Premise](#1-design-premise)
- [2. Context Snapshot on Every Click](#2-context-snapshot-on-every-click)
- [3. The Log Is Passive — No Prompts, No Questions](#3-the-log-is-passive--no-prompts-no-questions)
- [4. Slash-Command Architecture](#4-slash-command-architecture)
- [5. Command Reference](#5-command-reference)
- [6. `/system` — Self-Documenting Help](#6-system--self-documenting-help)
- [7. `/story` — Compression Pipeline](#7-story--compression-pipeline)
- [8. End-to-End Data Flow](#8-end-to-end-data-flow)
- [9. Arcade Evolution — Gamification in a Self-Care Company](#9-arcade-evolution--gamification-in-a-self-care-company)
- [10. Known Duplication / Honest Notes](#10-known-duplication--honest-notes)
- [11. File Map](#11-file-map)

---

## 1. Design Premise

LOT Computer is not a form. Every widget on the site exists to accumulate **context**
about a moment — weather, time of day, humidity, sky condition, location, astrological
placement — and every click against that context is a **record of the moment itself**,
with no photo and no audio required. The Log (Journal) is where the operator's own
words join that context stream: click by click, sentence by sentence, the machine
builds a personal narrative it did not have to interrupt the operator to ask for.

The two halves of the system:

1. **Environment capture** — ambient, always-on. Weather, time, humidity, sky, location
   and astrology widgets attach their current reading to any interaction the operator
   makes. See `docs/technical/WIDGETS.md` for the full widget catalog.
2. **Log capture** — operator-authored. A free-text entry, saved with the same context
   metadata attached, indistinguishable in storage from any other signal the system
   already tracks (mood, planner, self-care, memory).

Both halves feed the same table (`Log`, see §11) so the Quantum Intent Engine reads
one unified stream rather than reconciling two data sources.

## 2. Context Snapshot on Every Click

Any interaction that writes a `Log` row calls `getLogContext(user)` server-side
(`src/server/routes/api.ts`) to attach the environmental snapshot at the moment of
the click — not the moment of a later batch job. This is why a Log entry, a mood
check-in and a `/story` invocation each carry their own independent weather/time/
astrology reading even if they happen minutes apart: the context is a **timestamped
fact about the click**, never a shared or interpolated value.

## 3. The Log Is Passive — No Prompts, No Questions

The `NoteEditor` component (`src/client/components/Logs.tsx`) is a single textarea.
It does not ask "How was your day?" and it does not gate saving behind a question.
The operator types whatever they type; autosave debounces at 7 seconds
(`Logs.tsx` ~3767–3834) and persists via `useCreateLog` / `useUpdateLog`
(`src/client/queries.ts`).

The machine's role is **follow-up, not interrogation**: the Quantum Intent Engine
(QIE) watches the accumulated Log + signal stream for spikes or pattern changes
(a stated intention that never resolves, a mood drop after a silent stretch, a
cluster of self-care signals) and only then surfaces a question — through a morning
check-in, a System-tab widget, or (on a personal LOT® Computer device) a spoken
prompt. The Log itself stays a place to write, not a place to be interviewed.

## 4. Slash-Command Architecture

Slash commands are the one place the passive Log accepts a direct instruction. They
are deliberately **not** a chat command palette bolted on top of the editor — they
are keywords/emojis detected inline, in the same textarea, so invoking one is just
another kind of writing.

**Detection** lives in `src/client/utils/logTriggers.ts`, a pure module (no stores,
no DOM) so the trigger vocabulary can be tested or reused outside the Log surface:

- `RULES: TriggerRule[]` is the single source of truth: each rule names its
  `LogTrigger` id, the emoji(s) and keyword(s) that fire it, and — for
  operator-visible commands — a `command` signature and one-line `describe` string.
  A rule with no `describe` (e.g. the `❗` cohort-support signal) is a hidden/
  easter-egg trigger and is intentionally absent from `/system`'s output.
- `detectTriggers(text)` matches keywords as a whole `/word` token
  (`(^|\s)\/word(\s|$|[^a-z0-9_])`, case-insensitive) so `/scandalous` cannot
  misfire `/scan`, and matches emojis as literal substrings.
- `detectNewTriggers(text, previousText)` is the actual entry point used by the
  editor: it diffs current vs. prior trigger sets so editing around an existing
  `/synth` does not re-toggle it. The Log never re-fires a command just because
  autosave re-ran.

**Wiring** happens in `NoteEditor`'s effect (`Logs.tsx` ~3935–4169): a `useEffect`
keyed on `value` calls `detectNewTriggers`, then an `if/else if` chain dispatches
each fresh trigger to local component state or a mutation. Nothing server-side
parses slash syntax — the server only ever sees clean payloads (`/story`, `/prayer`,
etc. are stripped from `logText` before it is persisted or sent to the LLM).

## 5. Command Reference

Generated from `RULES` in `logTriggers.ts` — this table cannot drift from what
`/system` renders in the app, because both read the same array.

| Command | Trigger id | Effect |
|---|---|---|
| `/prayer` | `prayer-mode` | Generates contextual scripture via the LLM; appends to the log |
| `/story [day\|week\|month\|year]` | `story-mode` | Compresses recent data into a personal story (§7) |
| `/scan` | `ai-scan` | Prints a local system-status readout (assembly, badges, QIE patterns) |
| `/qi [query]` | `qi-rfi` | Sends a Request-for-Information to the Quantum Intelligence engine |
| `/assembly` | `assembly-check` | Self-assembly module status (dormant/active modules, phase) |
| `/phys` | `phys-report` | Physiological cohort report (archetype, energy, clarity, alignment) |
| `/qos` | `qos-report` | Triggers `analyzeIntentions()` — Quantum OS state analysis |
| `/fast` | `force-fast` | Orthodox fasting calendar state for today |
| `/breathe` | `breathe` | Toggles a 4-2-6 breathing exercise overlay |
| `/freeze` | `freeze-widgets` | "Pause and reflect" protocol readout |
| `/silent` | `silent-mode` | Signal-silence check (hours since last recorded signal) |
| `/synth` or 🎹 | `toggle-synth` | Toggles mechanical-keyboard sound feedback |
| `/radio` or 🎧 | `radio-toggle` | Toggles the ambient radio widget |
| `/night` or 🌙 | `night-mode` | Forces dark theme (unless a custom theme is active) |
| `/how` | `how-checkin` | Navigates to the System tab (LOT AI check-in) |
| `/system` | `system-help` | This command list (§6) |

Hidden triggers (no `command`/`describe`, absent from `/system` by design):
`❗`/`‼️` (`cohort-support`), `/sil` (`sil-check`).

## 6. `/system` — Self-Documenting Help

Before this pass, the `/system` help text was a hand-maintained string array in
`Logs.tsx`, separate from the `RULES` array that actually drives detection — a
command could be added to one and forgotten in the other with no error, since a
missing help line is silent, not a build failure.

`logTriggers.ts` now exports `getSystemHelpLines()`, which derives the help output
directly from `RULES` (`command` + `describe` fields, padded to align). `Logs.tsx`'s
`system-help` handler calls it instead of maintaining a parallel list. Adding a new
operator-visible command is now one edit in one file: append a `RULES` entry with a
`command`/`describe` pair and it appears in `/system` automatically.

## 7. `/story` — Compression Pipeline

This is the load-bearing feature of this pass: `/story` previously only ever
summarized "recent data" with no explicit period boundary. It now accepts an
explicit compression window, matching the product's stated shape — *"a compressed
story of your day/week/month/year."*

**Syntax:** `/story`, `/story day`, `/story week`, `/story month`, `/story year`.
Bare `/story` (or the 📖 emoji alone) defaults to `day`. Parsing is a pure function,
`parseStoryPeriod(text)` in `logTriggers.ts`, matching `/story\s+(day|week|month|year)\b`.

**Pipeline** (`LOT User data → LOT Quantum Intent Engine → AI vendor processor
(Together AI) → LOT personalized data`):

1. **Client** (`Logs.tsx` `story-mode` handler) parses the period, strips
   `/story [period]` and 📖 from the text that will be saved, and calls
   `submitStory({ logText, period, quantumState, userIndex })`
   (`useStoryGeneration`, `src/client/queries.ts`) — `quantumState` and `userIndex`
   are the operator's current QIE-derived state, i.e. "LOT User data" already
   passed through the Quantum Intent Engine client-side before the request leaves
   the browser.
2. **Server** (`POST /story`, `src/server/routes/api.ts`) is gated to Usership-tag
   accounts. It resolves the period to a window (`day` = 24h / `week` = 7d /
   `month` = 30d / `year` = 365d) and a proportionally larger sample size and word
   target — a year of signal compresses harder (250-350 words) than a day (100-200),
   consistent with the "further compress the loop" framing: longer windows are
   asked to note the *arc* (what changed, what repeated), not just list events.
3. The server pulls up to `sampleLimit` `Log` rows inside the window
   (`Op.gte` on `createdAt`), buckets them into journal entries, moods, and
   self-care answers, and assembles a system prompt + data block.
4. **AI vendor processor**: `aiEngineManager.getEngine('together')` — Together AI is
   requested directly as the story engine (not the general fallback chain used
   elsewhere in Memory Engine prompts; see `docs/benchmark/LOT-DOCTRINE.md` for the
   `AI_ENGINE_PREFERENCE` fallback order used by other surfaces).
5. **LOT personalized data**: the generated story is persisted back as a `Log` row
   (`event: 'generated_story'`) with `period` and `signalCount` in its metadata —
   so a `/story month` isn't just displayed once and lost, it re-enters the same
   signal stream the next compression will read.

On failure (LLM error, rate limit), the route returns a stable, on-brand fallback
string rather than an error the operator has to parse — "The system holds your data
quietly. When the engine returns, your story will be here."

## 8. End-to-End Data Flow

```
NoteEditor (Logs.tsx)
  │  debounced onChange (7s)
  ▼
useCreateLog / useUpdateLog  (src/client/queries.ts)
  │  POST /api/logs · PUT /api/logs/:id
  ▼
fastify.post('/logs') / fastify.put('/logs/:id')  (src/server/routes/api.ts)
  │  attaches getLogContext(user) snapshot
  ▼
Log model (src/server/models/log.ts) — Sequelize, table `logs`
  │
  ▼
Quantum Intent Engine reads the accumulated stream
(src/client/stores/intentionEngine.ts client-side;
 src/server/utils/memory.ts / memory/story-generator.ts server-side)
  │
  ▼
Together AI (or fallback chain) — narrative / follow-up generation
  │
  ▼
Personalized output surfaces back into the Log (generated_story rows,
morning check-ins, System-tab widgets)
```

Slash commands short-circuit the first hop only: `/story`, `/prayer`, `/qi` and
`/assembly` each POST to their own dedicated route (`/api/story`, `/api/prayer`,
`/api/qi`, `/api/assembly`) rather than going through the generic `/api/logs`
write, because each needs an LLM round-trip the plain Log save does not.

## 9. Arcade Evolution — Gamification in a Self-Care Company

LOT is a self-care company; the badge system (`src/client/utils/badges.ts`, ~7,500
lines) is its arcade layer, and it is worth stating plainly why that combination is
intentional rather than in tension. A self-care practice that only ever feels like
duty extinguishes itself; LOT's badge catalog — milestone streaks, time-of-day
easter eggs (`night_owl`, `pi_hour`, `lot_hour` at 04:07, the LOT founding hour),
calendar easter eggs (solstice, equinox, `lot_birthday`), and word-turn badges that
unlock on specific language appearing in a Log entry (`ritual_keeper`,
`gratitude_node`, `meta_signal` for "LOT" itself) — exists so that *noticing your
own patterns* carries a small, real reward, the same instinct an arcade cabinet
uses to keep a player one more round in.

The Log's slash commands sit adjacent to this system rather than inside it today:
discovering `/system` or `/scan` is itself a small "secret command" moment in the
same spirit as a word-turn badge, but no `LogTrigger` currently calls `awardBadge()`
directly (§10 records this as a deliberately scoped-out extension, not an oversight
patched over). The natural next increment — a badge for a first `/story year`, say
— is a one-line `awardBadge('...')` call in the `story-mode` branch plus one new
`BadgeType` entry, and is left for a future pass so this one stays focused on the
command system itself rather than expanding the badge catalog's already-large
surface area under time pressure.

## 10. Known Duplication / Honest Notes

Per the "honest engineering" standard this corpus holds itself to: two independent
`composeLocalStory()` implementations exist —
`src/server/utils/memory.ts:957` (used by the internal `generateMemoryStory`,
`memory.ts:873`) and `src/server/utils/memory/story-generator.ts:176` (used by
`generateMemoryStory` re-exported for `src/server/routes/public-api.ts`). Both are
live code, not dead duplication — the split currently isolates the public API's
story generation from the internal one — but they are near-identical fallback
composers and a future pass should confirm whether the split is load-bearing or
should collapse to one shared implementation. Recorded here rather than silently
fixed, since collapsing them touches a public-facing route and deserves its own
green-gated benchmark pass.

`badges.ts` currently has two pre-existing duplicate-key warnings at build time
(`quarter_drop`, `elixir_found` each defined twice) — unrelated to this pass,
not introduced here, flagged for whoever next touches that file.

## 11. File Map

| Concern | Path |
|---|---|
| Trigger detection (pure) | `src/client/utils/logTriggers.ts` |
| Log editor / trigger wiring | `src/client/components/Logs.tsx` |
| Client mutations (`useCreateLog`, `useStoryGeneration`, ...) | `src/client/queries.ts` |
| `/story` route | `src/server/routes/api.ts` (`POST /story`) |
| `/logs` CRUD routes | `src/server/routes/api.ts` (`POST /logs`, `PUT /logs/:id`) |
| Log persistence model | `src/server/models/log.ts` |
| Internal story compression | `src/server/utils/memory.ts` |
| Public-API story compression | `src/server/utils/memory/story-generator.ts` |
| Badge / arcade catalog | `src/client/utils/badges.ts` |
| Widget context catalog | `docs/technical/WIDGETS.md` |

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
