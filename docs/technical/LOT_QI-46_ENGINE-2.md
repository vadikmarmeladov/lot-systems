<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 Engine — Founding Node (v1 Design Spec)

**Status:** HOLD — design spec only. No runtime/prompt code shipped this session.
**Class:** ENGINEERING (technical spec)
**Node:** 0 (first node of the QI·46 lineage)

---

## 01 // Naming Decision

Five candidates were reviewed for the LOT proprietary AI persona-calibration
engine:

| Candidate    | Note |
|--------------|------|
| LOT·SC·46    | clean, versioned, terminal-ready |
| BIONODE-46   | living inference node framing |
| SELFWARE·46  | self-care + software collapsed |
| SOMA·46      | already in the LOT family, neuroscience resonance |
| CARE·OS·46   | operating system for the self |
| **QI·46**    | **CHOSEN** |

**Chosen: QI·46.** Rationale:

- Slots directly into the existing LOT `_I` interface grammar — `QI` (Quantum
  Intelligence, operator RFI terminal, `/qi`) is already a minted LOT-LEXICON
  token (`rev A`, since 20260605), alongside the established `RFI`/`INTSUM`
  pair. `QI·46` extends that lineage rather than inventing a new one.
- `46` anchors the node to the founding-cohort era (Day 1072+ at time of
  writing) without hardcoding a date that will drift.
- Short, registrable, consistent with `BENCHMARK`/`SHIP MODE` terminal-style
  naming already used throughout `docs/benchmark/`.

Per LOT-LEXICON minting rule (a token is earned after appearing in 3+ prior
reports or being folded into doctrine twice), `QI·46` is **not** minted as a
lexicon token in this report — it is a new coinage with a single occurrence.
It becomes eligible for LOT-LEXICON once it recurs.

---

## 02 // Purpose

QI·46 is a **persona-calibration layer**, not a new data-collection system.
It consumes signal the Memory Engine and Quantum Intent Engine already
collect and hold (per `docs/technical/MEMORY-AND-QUANTUM-INTENT-ENGINES.md`)
and uses it to shape the *tone and voice* of AI-generated output — the words
LOT says back to the operator — rather than what LOT asks or tracks.

Concretely, it is a downstream consumer of two existing functions in
`src/server/utils/memory.ts`:

- `extractUserTraits()` (line 1115) — Level 1 behavioral, Level 2
  psychological, Level 3 core-value ("soul-level") traits already extracted
  from logs.
- `composeLocalStory()` (line 957) — the existing local (non-AI) narrative
  fallback that turns those traits into prose.

QI·46 does not extract anything new from a person. It is a rendering layer
on top of data the operator already owns, per the Memory Engine's existing
privacy model (README.md §"Your Story, Your Data" — story lives in LOT's
database, exportable/deletable anytime, AI providers only execute, never
retain).

**Framing correction from intake:** the request that seeded this node used
the phrase "extract the engine that is based on people's soul and emotions"
and "upload a person's being." QI·46 is scoped strictly as **persona/tone
calibration of AI output**, built on the Memory Engine's existing trait
extraction — not literal consciousness extraction or upload. No such
capability exists or is proposed. This scope boundary is load-bearing for
every future node in the QI·46 lineage.

---

## 03 // Calibration Model (v1 draft)

Five candidate output traits were named at intake: grace, poetry, warmth
("being there"), coolness, and voice register ("male"). Mapped to a
first-pass calibration surface:

| Trait     | Signal source (existing)                          | Rendering effect |
|-----------|----------------------------------------------------|-------------------|
| Grace     | `extractUserTraits()` Level 2 (`peaceSeeking`, `grounded`) | sentence cadence, restraint |
| Poetry    | `composeLocalStory()` prose style; journal sentiment (`MEMORY-AND-QUANTUM-INTENT-ENGINES.md` §Journal Sentiment) | imagery density in local-story fallback |
| Presence ("being there") | QOS mode (`maintenance/recovery/growth/peak`, README §QOS) | response pacing — recovery mode gets slower, gentler pacing per existing QOS doctrine ("a person in recovery mode does not need more tasks") |
| Coolness  | Level 1 behavioral traits (`mindful`, `adventurous`) | word choice register |
| Voice     | operator-configurable, default unset | grammatical gender/register of AI companion voice, opt-in only |

**Voice register is explicitly opt-in, not a system default.** LOT's
existing Public Profile privacy model (README §"Public Profile System") sets
precedent: every personalization surface is a toggle the operator controls.
QI·46 voice register (including a "male" option) follows that pattern — it
is never assumed on behalf of an operator who hasn't chosen it.

---

## 04 // What Shipped This Session vs. What Is Held

**Shipped (this report):** naming decision, this spec doc, LOT-LEDGER entry.

**Held for S-2 review before implementation:**

1. Opt-in mechanism — where in Settings the voice-register toggle lives.
2. Whether QI·46 output composes *before* or *after* the existing
   `plannerContext`/`goalContext`/`formattedLogs` prompt-assembly order
   documented in `LOT-DOCTRINE.md` §"Widget→Memory Compression Loop" — that
   ordering is doctrine-locked and any new layer must justify its position
   rather than silently insert itself.
2. Whether QI·46 is a prompt-instruction layer (steers the existing AI
   engine chain) or a post-processing rewrite layer (rewrites
   `composeLocalStory()` output only, no extra AI call/cost).
3. Node numbering going forward — this document is Node 0; subsequent nodes
   (QI·46 v2, v3, …) follow the QIE versioning convention already in use
   (P-pattern / Arch / Job increments) once a concrete pattern is proposed.

No `src/` files were modified in this session. This is intentionally a
HOLD per the self-assembly protocol's judgment boundary: persona voice
(including a gendered default) is a broad, ambiguous product decision and
is surfaced to S-2 rather than guessed and shipped.

---

## 05 // Requested By

Vadik & Kuzya (S-2), 2026-09-06.
