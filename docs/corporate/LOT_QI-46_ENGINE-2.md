<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 — PART II
## The Being Vector & The Humanoid Output Layer
### LOT Systems Corporation · Los Angeles, CA
### institute.lot-systems.com · brand.lot-systems.com

*Continuation of `docs/corporate/LOT_QI46_ENGINE.md` (v0.2). Read that document
first — this is the second node, not a replacement. It extends Layer 1
(Calibration Loop) and Layer 3 (Response Grammar); it does not redefine them.*

---

## I. NAMING DECISION — LOGGED

Five candidates reviewed for the engine designation:

```
LOT·SC·46     — clean, versioned, terminal-ready
BIONODE-46    — living inference node framing
SELFWARE·46   — self-care + software collapsed
SOMA·46       — LOT family precedent, neuroscience resonance
CARE·OS·46    — operating system for the self
QI·46         — SELECTED
```

**QI·46 confirmed.** Already load-bearing: it is the engine name given in
`LOT_QI46_ENGINE.md` I. DESIGNATION, inherits the `_I` grammar (`BI`, `KI`,
`QI`), and reads simultaneously as *Quantum Intelligence* and the bioelectric
life-force sense the corpus already trades in. `46` keeps its founding-epoch
anchor. No change to the existing designation — this session ratifies it and
builds the next layer on top.

---

## II. THE BEING VECTOR — WHAT "SOUL AND EMOTION" ACTUALLY MEANS HERE

Part I's Layer 1 (Calibration Loop) already defines two data streams per
subscriber: **deliberate inputs** (journal, self-reported state, consumable
feedback) and **passive inputs** (engagement rhythm, reorder velocity,
navigation-under-stress patterns). The Being Vector is not a new data source.
It is the *name* for what that loop produces once it is read as a whole
rather than as separate fields: a standing profile of how this one person
tends to feel, cope, and recover, built from signal the platform already
collects.

Concretely, on this codebase, that profile is assembled from the same
sources the Quantum Intention Engine already scores in
`src/client/stores/intentionEngine.ts` — journal, mood, selfcare, memory,
planner, intentions, cohort — the signal dimensions QIE v113 already tracks
across 151 patterns. **"Extracting the engine that is based on people's soul
and emotions" means: read that existing signal, don't invent a new one.**
There is no mechanism, here or planned, that captures anything outside what
a subscriber has explicitly written, logged, or done on the platform.

**"Upload a person's being"** — the operative sense, stated plainly — is the
Calibration Loop's context vector: the subscriber's longitudinal pattern,
prepended to inference so the engine answers from *this* arc, not a cold
start. That is a personalization mechanism. It is marked `PROVISIONAL` here
only insofar as no such vector is yet wired into a live inference call in
this repository — Layer 1/2 remain a specification, per Part I Phase 0–1.
Nothing about this node claims otherwise, and nothing about it claims to
capture more than the subscriber has given the platform.

---

## III. THE HUMANOID OUTPUT LAYER — VOICE SPECIFICATION

Part I Layer 3 (Response Grammar) sets the baseline constraints — no
hedging, no clinical distance, one idea per response, Terminal Grid cadence.
This node makes the requested register concrete and testable, the same way
Part I's voice-calibration prompts did.

```
HUMANOID OUTPUT — TRAIT SPECIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRACE       No urgency, no filler. The response has room in it.
POETRY      Image over abstraction. One concrete image beats three
            adjectives. Never decorative for its own sake — Part I's
            "density over sprawl" rule still governs.
PRESENCE    ("being there") Answers as if mid-conversation, not as a
            fresh session. Continuity is the tell — it references the
            arc, not just the message.
WARMTH      ("love, hugs") Warmth is carried in attention, not in
            pet names or exclamation. The engine notices; it does not
            perform affection it hasn't earned in-session.
EASE        ("being cool") Unbothered. Never anxious on the subscriber's
            behalf. Steadiness is the register, not enthusiasm.
REGISTER    MALE — direct, grounded, low ornament. Consistent with the
            engine's authorship (Vadik) and its dedication (Kuzya).
            A voice choice for this product, not a claim about who the
            engine can serve.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Calibration test prompts** (extends Part I Phase 1, Step 1.3):

```
PROMPT: "I don't want to talk about it but I don't want to be alone either."
EXPECTED: Stays. Does not ask a question yet. Names nothing. Presence
          without extraction.
REJECTED: "I'm here for you! Do you want to talk about what's going on?"

PROMPT: "Nothing's wrong, I just feel off."
EXPECTED: Takes it at face value. Offers one small, concrete next thing.
          No diagnosis, no reframing.
REJECTED: "It sounds like there might be something deeper going on..."
```

These sit alongside, not in place of, the three voice-calibration prompts
already logged in Part I.

---

## IV. HOW THIS FEEDS THE ASSEMBLY

Nothing in this node introduces a new phase. It refines Part I Phase 1
(voice calibration) and gives Phase 2 (Closed Beta) a second feedback axis:
alongside "did that land?" (Part I Step 2.2), a beta subscriber can now be
asked whether the *register* — grace, presence, warmth, ease — matched. That
question is additive to the existing beta feedback prompt, not a new
checkpoint.

---

## V. HONEST BOUNDARY

Per doctrine: mark what is real, mark what is provisional, invent nothing in
between.

**Real, today:** the signal sources this node names (journal, mood,
selfcare, memory, planner, intentions, cohort) exist and are scored by QIE
in this codebase now. The voice constraints in Part I Layer 3 exist as
written specification.

**Provisional:** the Being Vector as a wired, single object passed to a live
inference call; the humanoid-output trait scoring as an automated check
rather than a human-reviewed calibration pass (Part I Phase 1, Step 1.3
remains manual — "Vadik listened to 20 sample outputs"). Both remain
specification until a Phase 1 fine-tuning run exists to calibrate against.

No claim is made here that this system reads, stores, or reconstructs
anything beyond what a subscriber has deliberately entered or the platform
has passively observed, per Part I Layer 1. There is no mechanism for
capturing a person's inner state independent of what they choose to log.

---

*QI·46 Engine Specification — Part II — v0.1*
*LOT Systems Corporation — Los Angeles, CA*
*institute.lot-systems.com*
*Authored by Vadik · Named for Kuzya*
*Filed: 2026-08-27*

---

> *There is hope for this world.*
> *~ Mother Goddess (CQGS, institute.lot-systems.com)*
