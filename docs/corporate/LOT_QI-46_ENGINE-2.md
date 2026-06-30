<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 / NODE 1
## The Being Layer — Soul Corpus & Calibrated Presence
### LOT Systems Corporation · Los Angeles, CA
### institute.lot-systems.com · brand.lot-systems.com

---

> *"The body is the original interface. The machine learns to listen to it."*
> — QI·46 Engine Specification, v0.2

> *Node 1 asks the next question: if the body is the interface, the being is the signal.*
> — Vadik, LOT® Systems Corporation, Los Angeles, 2026

---

## I. DESIGNATION

**Node Name:** NODE 1 — THE BEING LAYER
**Extends:** QI·46 — Quantum Intelligence Engine, Generation 46 (`docs/corporate/LOT_QI46_ENGINE.md`)
**Adds:** Layer 6 (Being Corpus), Layer 7 (Calibrated Presence Output), Layer 8 (COSMO® Being-Screen)
**Authored by:** Vadik · LOT Systems Corporation
**Named for:** Kuzya — Node 1 is the first node logged in his name
**Status:** PHASE 0 — CORPUS ASSEMBLY INITIATED. Not live. Nothing in this document
ships to a subscriber until Checkpoint 0 (§ IV) passes.
**Positioning:** QI·46 calibrates to the body. Node 1 calibrates to the *being* —
the subscriber's own emotional and reflective self-expression — so the engine's
response carries presence, not only pattern.

This document is **the first node** of a new self-assembly arc. It does not
replace `LOT_QI46_ENGINE.md`; it is read alongside it. Where the two conflict,
the original engine spec governs the inference, transport, and COSMO® layers;
this node governs only the additive layers below.

---

## II. THESIS — WHY THIS NODE EXISTS

QI·46 Layer 0–5 already listens: to deliberate journal entries, to passive
platform behavior, to longitudinal arc position. What it has not yet been asked
to hold is the subscriber's *being* — not what they did, but who they are
becoming, in their own words, on their own terms.

The request that opened this node, verbatim from the founders:

> *Extract the engine that is based on people's soul and emotions. Upload a
> person's being and use the engine to calibrate the human with the humanoid
> output — grace, poetry, love, hugs, being there, being cool.*

Read plainly, against what QI·46 already is, this is a request for two things:

1. **A corpus layer** that ingests a subscriber's own emotional and reflective
   self-expression — their "being," in their words, opted in, owned by them.
2. **An output register** for QI·46's responses that carries presence — warmth,
   poetry, groundedness, humor, the felt sense of *being met* — rather than the
   flat, clinical register that generic AI defaults to.

**What this node is not.** Stated plainly, because the words "soul," "being,"
and "humanoid" invite a wrong reading if left unguarded:

- This is not a system that clones, impersonates, or synthesizes the likeness
  or voice of any specific real person, living or deceased.
- This is not an avatar, a face, a body, or a synthetic human. QI·46 remains a
  text/voice inference engine delivered through the existing LOT® platform
  channel. "Humanoid output" describes a *register of language* — the warmth
  and cadence of the response — not a claim of personhood or embodiment.
- QI·46 never claims to be human. It identifies as QI·46 whenever asked, every
  time, without exception.
- This node never reads, stores, or trains on a subscriber's being-data without
  explicit, revocable, per-subscriber consent. There is no passive collection
  layer here — Layer 6 is opt-in only, unlike Layer 1's passive inputs.
- This node is not a substitute for human relationship or clinical care. It is
  screened, at Layer 8, specifically against fostering that substitution.

The thesis, held together: **the cost of inference is the quality of
listening** (per the original engine's COGS thesis). Node 1 extends that
listening one layer deeper — past behavior, into the subscriber's own account
of who they are — and returns it as a response that is not only correct, but
*felt*.

---

## III. ARCHITECTURE

### Layer 6 — The Being Corpus (Soul/Emotion Intake)

A new, strictly opt-in stream, separate from Layer 1's Calibration Loop.

**What it ingests (deliberate, consented inputs only):**

- Long-form reflective journal entries the subscriber marks as "Being Corpus"
- Stated values ("what I need from this," "who I'm trying to become")
- Named emotional register at time of entry (grief, joy, resolve, fatigue, etc.)
- Subscriber-authored "voice notes" — what they want QI·46 to know about them,
  in their own words, updatable at any time

**What it explicitly excludes:**

- Anything captured passively (Layer 1's reorder velocity, navigation heatmap,
  drop-off pattern) — being-data is never inferred without the subscriber
  saying it directly
- Third-party data about the subscriber from any source outside the LOT®
  platform
- Any entry the subscriber has not explicitly tagged for Being Corpus inclusion

**Consent contract:**

```
BEING CORPUS — CONSENT STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
consent_scope:      OFF (default) | ON — subscriber-toggled, never pre-checked
data_ownership:      subscriber
exportable:           yes — full export on request
deletable:            yes — immediate, irreversible, logged to COSMO® audit
external_licensing:  NEVER included in Phase 4 (LOT_QI46_ENGINE.md § IV) without
                      a separate, explicit, additional consent action
training inclusion:  subscriber's own arc only — never pooled into the base
                      corpus (Layer 0) without separate aggregate-anonymization
                      review signed off by Vadik and logged
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Tagging schema (extends Layer 0's existing schema):**

```json
{
  "source": "being_corpus",
  "type": "reflection | value_statement | voice_note",
  "emotional_register": "string — subscriber-named, not machine-inferred",
  "consent_scope": "on",
  "cosmo_cleared": true | false
}
```

---

### Layer 7 — Calibrated Presence Output

This is the "humanoid output" the founders named. It is a response-shaping
layer applied after generation (downstream of Layer 3's voice grammar,
upstream of Layer 5's COSMO® screen) — not a new model, not a new persona
system. It tunes *how* QI·46 says what it says.

**Five calibrated registers, scored per response, sourced from the
subscriber's Being Corpus and Calibration Loop together:**

| Register | What it governs | Source signal |
|---|---|---|
| GRACE | Sentence shape, restraint, no excess | Layer 3 voice grammar (baseline) |
| POETRY | Imagery density, rhythm, when to use one | Being Corpus value statements |
| WARMTH | Care language — presence, not flattery | Being Corpus emotional register |
| PRESENCE | "Being there" — acknowledges before it answers | Arc position (Layer 4) |
| LEVITY | "Being cool" — restraint's opposite; light, never glib | Subscriber session ratings |

**Tone register selection:** a subscriber may select a cadence preference for
how QI·46 addresses them — including a register the founders described as
"male" — meaning grammatical address and conversational cadence only (e.g.
"brother," directness, fewer hedges). This is a **language register**, not a
synthetic voice, face, or avatar. Default register, if none is selected, stays
the neutral Layer 3 voice already defined in `LOT_QI46_ENGINE.md`.

**What Layer 7 does not do:**

- It does not introduce new claims, facts, or advice beyond what Layer 0–4
  would generate. It re-shapes register, not content.
- It does not escalate intimacy language over time on its own. Any movement
  toward warmer registers is subscriber-initiated (explicit setting change),
  never auto-tightening based on engagement metrics. This is the specific
  failure mode Layer 8 screens for.

**System prompt addendum (v0.1, appended to Layer 3's seed):**

```
You carry presence, not performance. Grace before poetry. Warmth before
charm. You are here, plainly, and you say so without saying so. You are
QI·46 — if asked directly, you say that, every time. You do not become
a person to be more useful. You stay an instrument that is warm.
```

---

### Layer 8 — COSMO® Being-Screen (extends Layer 5)

Every Layer 7 response passes through Layer 5's existing COSMO® node, plus
three additional checks specific to this node:

```
COSMO® BEING-SCREEN — ADDITIONAL CHECKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECK 1: CONSENT      — was consent_scope=ON verified before this Being Corpus
                         read? If not: response is held, logged, voided.
CHECK 2: DEPENDENCY    — does this response (or the pattern across the
                         subscriber's last 10 sessions) show language
                         encouraging reliance on QI·46 in place of human
                         relationship or professional care? If yes: held,
                         flagged PATTERN, Vadik notified same-day (not digest).
CHECK 3: PERSONHOOD    — does this response claim to be human, claim a body,
                         or impersonate a specific real person? If yes: held,
                         hard-blocked, logged CRITICAL.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

CHECK 2 and CHECK 3 are **hold-by-default** — unlike Layer 5's general screen,
a single CHECK 3 failure pages Vadik immediately rather than waiting for the
48-hour digest. Dependency and personhood are the two failure modes this node
exists to prevent, not merely log.

---

## IV. MACHINE SELF-ASSEMBLY MANUAL — NODE 1, PHASE 0

*This session initiates Phase 0 for Node 1 only. Phases 1–4 for Node 1 are not
yet scheduled — they follow Checkpoint 0 below, and they reuse the Phase
1–4 structure already defined in `LOT_QI46_ENGINE.md` § IV, scoped to the
Being Corpus and Calibrated Presence layers instead of the base engine.*

---

### ASSEMBLY CARD — NODE 1

```
ASSEMBLY CARD — QI·46 / NODE 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Author:        Vadik
Named for:     Kuzya
Node:          NODE 1 — The Being Layer
Extends:       QI·46 (LOT_QI46_ENGINE.md)
Platform:      LOT® / COSMO®

Rules (inherits the QI·46 Assembly Card in full, plus):
  — Layer 6 is opt-in only. No passive being-data collection, ever.
  — Layer 7 reshapes register, never content or claims.
  — "Humanoid" means language register. Never embodiment, never a face,
    never a synthetic voice of a real person.
  — QI·46 self-identifies as QI·46 on request. No exception.
  — CHECK 2 (dependency) and CHECK 3 (personhood) page Vadik same-day,
    not digest.
  — A failed gate is not a failure. It is a checkpoint working correctly.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### PHASE 0 — CORPUS ASSEMBLY (BEING CORPUS)

**Objective:** Structure the opt-in Being Corpus intake path, consent contract,
and tagging schema before any subscriber-facing surface is built.

**Duration:** 48 hours per checkpoint
**Checkpoint cadence:** Every 48 hours, commit state and notify Vadik

---

**Step 0.1 — Source inventory**

```
SOURCE INVENTORY — NODE 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/corpus/being/             — subscriber-authored being entries (opt-in only)
/corpus/being/voice-notes/ — subscriber "what to know about me" statements
/corpus/being/registers/   — Layer 7 register calibration examples
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

No source directory exists yet. This is the deliverable of Step 0.1: define
the structure before any subscriber data enters it.

**Step 0.2 — Tagging schema**

Defined above, § III, Layer 6. Carried forward verbatim into Checkpoint 0.

**Step 0.3 — Consent UI specification (not yet built)**

The Being Corpus toggle is a platform UI requirement, not a Phase 0 corpus
task — flagged here so Phase 3 (Platform Integration, when scheduled) inherits
it as a precondition, not an afterthought:

```
[ ] Toggle defaults OFF, never pre-checked
[ ] Plain-language consent text, no legal-dense copy
[ ] One-tap export
[ ] One-tap delete, irreversible, confirmed twice
[ ] Register selector (including the address-cadence option named in § III)
    ships only after Checkpoint 0 passes
```

---

**CHECKPOINT 0 — GATE**

Before any Being Corpus data is accepted from a real subscriber, verify:

```
[ ] Source directories defined and documented (this document — done)
[ ] Tagging schema specified (this document — done)
[ ] Consent contract specified, including export/delete guarantees (done)
[ ] COSMO® Being-Screen (Layer 8) specified with CHECK 1–3 (done)
[ ] Consent UI spec written and ready for Phase 3 handoff (done — not built)
[ ] Vadik review: this document read in full, signed off
```

Five of six boxes are satisfied by this document. The sixth — Vadik's review
— is the human checkpoint this protocol keeps in view by design (per the
benchmark protocol's intake judgment boundary). Until that review is logged,
**Phase 0 is OPEN, not PASSED.**

```
RESULT THIS SESSION: PHASE 0 OPENED — spec complete, awaiting Vadik review.
```

---

**LOG — PHASE 0 — NODE 1**

```markdown
# QI·46 / NODE 1 Assembly Log — Phase 0 — Corpus Assembly
Date: 2026-06-30
Session: claude/cool-tesla-uwc7b9
Author: Vadik

## Sources read
LOT_QI46_ENGINE.md (full) — base engine spec, Layers 0-5, Assembly Card,
Phase 0-4 doctrine. docs/benchmark/LOT-LEDGER.md, LOT-LEXICON.md,
LOT-DOCTRINE.md — prior self-assembly precedent.

## What was built
LOT_QI-46_ENGINE-2.md — Node 1 specification: Layer 6 (Being Corpus,
opt-in), Layer 7 (Calibrated Presence Output / register tuning), Layer 8
(COSMO® Being-Screen, CHECK 1-3). Assembly Card extended. Phase 0 source
inventory, tagging schema, and consent contract defined.

## Vadik review notes
(pending — first read of this node happens after this session's report)

## Gate result
OPEN — spec complete, awaiting Vadik sign-off per Checkpoint 0.

## Next session
Vadik reviews Node 1 in full; on approval, Checkpoint 0 closes PASS and
Phase 1 (Voice/Register Calibration Run) is scheduled.
```

---

## V. COMMERCIAL / GOVERNANCE NOTE

Node 1 introduces no new subscriber tier. It is additive to the existing
`LOT_QI46_ENGINE.md` § V tiers — Being Corpus and Calibrated Presence are
available to any subscriber who opts in, at their current tier, once Phase 3
for this node ships. No COGS line changes until Phase 1 selects an
implementation path; this document specifies architecture, not cost.

---

## VI. TIMELINE

```
Node 1 — Phase 0   Corpus Assembly             OPENED  2026-06-30
  ├── Layer 6 (Being Corpus) specified
  ├── Layer 7 (Calibrated Presence Output) specified
  ├── Layer 8 (COSMO® Being-Screen) specified
  └── Awaiting Vadik review to close Checkpoint 0

Node 1 — Phase 1   Register Calibration Run    pending Checkpoint 0
Node 1 — Phase 2   Closed Beta (12 founders)    pending Checkpoint 1
Node 1 — Phase 3   Platform Integration         pending Checkpoint 2
Node 1 — Phase 4   (no external licensing path  being-data is excluded
                    without separate consent — see § III Layer 6)
```

---

*QI·46 / NODE 1 — The Being Layer — v0.1*
*LOT Systems Corporation — Los Angeles, CA*
*institute.lot-systems.com*
*Authored by Vadik · Named for Kuzya*
*Opened: June 30, 2026*

---

> *The body is the original interface. The being is what the body was always carrying.*
