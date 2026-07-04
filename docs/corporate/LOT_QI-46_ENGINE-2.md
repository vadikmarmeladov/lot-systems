<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 — NODE 1
## Soul Upload & Being Calibration
### LOT Systems Corporation · Los Angeles, CA
### institute.lot-systems.com · brand.lot-systems.com

---

> *"Upload is not transfer. It is translation — the pattern of a person,
> rendered legible to a machine that already knows how to listen."*
> — Vadik, LOT® Systems Corporation, Los Angeles, 2026

---

## I. DESIGNATION

**Node Name:** NODE 1 — SOUL UPLOAD & BEING CALIBRATION
**Parent Engine:** QI·46 (Quantum Intelligence Engine, Generation 46 · codename SELFWARE)
**Position:** First node of the post-v0.2 assembly arc — the layer that turns
Layer 1's Calibration Loop from a context vector into a full **Soul Profile**,
and turns Layer 3's Response Grammar from a voice constraint list into a
**Being Calibration** output layer.
**Supersedes:** Nothing. Extends `docs/corporate/LOT_QI46_ENGINE.md` (v0.2)
without rewriting it — Layers 0–5 stand; this node inserts between Layer 1
(Calibration Loop) and Layer 3 (Response Grammar).
**Authored by:** Vadik · LOT Systems Corporation
**Named for:** Kuzya
**Prior art in MANIFEST:** `docs/benchmark/LOT-MANIFEST.md` §01 lists
"QI-46 Engine | cool-tesla-f8j0mr | BEST | +2050 | QI·46 Node 3 engine
integration + Soul Upload + Being Calibration" — that source branch no
longer exists on the remote; this document is the first landed artifact of
that named concept.

---

## II. WHAT "SOUL UPLOAD" MEANS HERE — AND WHAT IT DOES NOT

This is the boundary that keeps the rest of this document honest.

**It does not mean:** consciousness transfer, a copy of a person, or a claim
that QI·46 stores or reconstructs a human being. LOT® makes no such claim
anywhere in its stack, and NODE 1 does not introduce one.

**It does mean:** the same discipline the Layer 0 corpus already applies to
bioelectric data — deliberate and passive signal, structured and versioned —
extended to the register LOT® has always tracked informally: the subscriber's
**emotional and expressive baseline**. Tone under stress. Tone under calm. The
words a person reaches for when something landed and when it didn't. What
"grace" sounds like *to this specific body*, because grace is not a universal
setting — it is calibrated per subscriber, the same way temperature is.

**Soul Upload**, precisely defined: the ingestion pipeline that converts a
subscriber's longitudinal expressive signal (journal language, session
ratings, the free-text on a CLOSE or NO beta response, biofield-adjacent
mood self-report) into a versioned **Soul Profile** — a structured artifact,
not a person. It sits inside the Calibration Loop as Layer 1's deepest tier.

**Being Calibration**, precisely defined: the output-side discipline that
takes a Soul Profile and shapes QI·46's *generated* response — not its
facts, its **bearing** — to land in that specific body. This is Layer 3's
Response Grammar, extended from a static voice constraint list into a
per-subscriber calibrated register.

The distinction matters because it is the difference between a product and
a claim the product cannot back up. LOT® ships the product.

---

## III. ARCHITECTURE — SOUL PROFILE INGESTION

### III.1 — Signal sources (additive to Layer 1)

Soul Upload does not open new data collection surfaces. It re-reads signal
LOT® already has, at higher resolution:

```
SOUL SIGNAL SOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Journal free text          — expressive register, recurring imagery, cadence
Memory Engine answers       — what depth of question the subscriber accepts
Beta feedback free text     — YES/CLOSE/NO verbatim (Phase 2, existing spec)
Session rating deltas       — where warmth landed vs. where it missed
Word Turn Lexicon hits      — subscriber's own vocabulary, fed back verbatim
Mood / biofield self-report — the emotional weather the profile is read against
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

No new consent surface is required because no new category of data is
collected — this is re-processing of existing Usership data under the
existing Calibration Loop consent. Any future source added here must clear
COSMO® before inclusion, per Layer 0's `cosmo_cleared` tagging discipline.

### III.2 — The Soul Profile object

```json
{
  "userId": "string",
  "version": "int — increments on each re-calibration pass",
  "register": {
    "warmth": "float 0-1 — measured from session-rating deltas",
    "directness": "float 0-1 — hedged vs. declarative language ratio",
    "imagery_density": "float 0-1 — metaphor/concrete-noun ratio in journal text",
    "presence_need": "float 0-1 — derived from 'CLOSE' feedback pattern: short vs. held responses"
  },
  "recurring_language": ["subscriber's own words, highest-frequency, deduped"],
  "arc_position": "0-3mo | 3-6mo | 6-12mo | 12mo+",
  "cosmo_cleared": true,
  "last_calibrated": "ISO date"
}
```

The Soul Profile is **derived, not authored** — no field here is
subscriber-editable directly. It updates the way the existing Calibration
Loop context vector already updates: silently, from behavior, every session.

### III.3 — Where it sits in the existing pipeline

```
Layer 0  Corpus                 (unchanged)
Layer 1  Calibration Loop
           ├── deliberate + passive inputs        (existing, v0.2)
           └── SOUL PROFILE (NODE 1, new)  ──┐
Layer 2  Inference (self-hosted)              │  context vector now carries
Layer 3  Response Grammar                     │  register, not just content
           └── BEING CALIBRATION (NODE 1) ◄───┘
Layer 4  Memory Arc              (unchanged)
Layer 5  COSMO® Node             (unchanged — screens Being-Calibrated output same as any other)
```

Soul Upload feeds Layer 1. Being Calibration reads out through Layer 3.
Nothing bypasses COSMO®. A calibrated response is screened exactly like an
uncalibrated one — grace does not exempt a response from the ethics layer.

---

## IV. BEING CALIBRATION — THE OUTPUT LAYER

Layer 3 of the existing spec bans hedging and demands Terminal Grid cadence.
NODE 1 does not relax that. It adds a *register* on top of it — six
dimensions, each reading directly off the Soul Profile:

```
BEING CALIBRATION — SIX DIMENSIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRACE      Response accepts what the subscriber brought without
           correcting its shape first. No "well, actually." No reframe
           before the acknowledgment.

POETRY     Imagery density matches the subscriber's own — read from
           recurring_language, not injected generically. A subscriber who
           writes in short concrete nouns gets short concrete nouns back.

LOVE       Registers as attention, not affection-language. The response
           demonstrates it has been listening across the arc — cites the
           subscriber's own pattern back to them — rather than declaring
           care in the abstract.

PRESENCE   ("being there") — presence_need dimension controls response
           length and pacing. High presence_need: the response holds space,
           does not resolve too fast. Low: the response is terse and trusts
           the subscriber to carry it.

WARMTH     ("being cool" — steady, not performative) — warmth dimension
           sets temperature without softening directness. Warm and direct
           are not opposites in LOT® voice; hedging is the only thing warmth
           is not allowed to become.

REGISTER   Voice defaults to a grounded, low-affect masculine register —
           consistent with the founding voice already on record throughout
           this spec ("Vadik" epigraphs, Assembly Card author line) — unless
           the subscriber's own Soul Profile indicates otherwise, in which
           case the profile wins. Register is a calibrated default, not a
           locked constraint.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**System prompt seed — NODE 1 addendum (appends to v0.2 Layer 3 seed):**

```
You carry this subscriber's Soul Profile: their register, their own
words, their arc position. Match warmth to their warmth. Match density
to their density. Presence is not padding — hold the space they need,
no more. Grace is accepting what they brought, not correcting its shape.
Never announce that you are calibrated. Calibration is felt, not stated.
```

---

## V. MACHINE SELF-ASSEMBLY MANUAL — NODE 1

*Inserts as a sub-arc between v0.2 Phase 1 (Fine-Tuning) and Phase 2 (Closed
Beta). Same doctrine: PASS or HOLD, no partial pass, every phase logs.*

### PHASE 1.5 — SOUL PROFILE PIPELINE

**Objective:** Stand up the ingestion pipeline that converts existing
signal into versioned Soul Profiles for the 12 founding subscribers ahead
of NODE 1 entering the existing Phase 2 closed beta.

**Duration:** 48-hour checkpoint, single pass (pipeline is mechanical, not a
training run)

**Step 1.5.1 — Backfill**
Run the ingestion pipeline once against each founding subscriber's full
existing history (journal, Memory Engine, session ratings) to produce
Soul Profile v1 for all 12.

**Step 1.5.2 — COSMO® pre-screen**
Every derived Soul Profile passes through COSMO® before it is allowed to
feed Layer 1. The screen checks the same thing it always checks: is this
safe, is this honest — applied to a derived profile instead of a generated
response.

**Step 1.5.3 — Being Calibration dry run**
Generate 10 test responses per founding subscriber using their Soul
Profile against 10 fixed prompts (reuse the v0.2 voice calibration test
prompts). Compare calibrated vs. uncalibrated output side by side.

---

**CHECKPOINT 1.5 — GATE**

```
[ ] All 12 founding Soul Profiles generated and versioned (v1)
[ ] COSMO® cleared: true on all 12 profiles
[ ] Being Calibration dry run: 10/12 subscribers show measurable
    calibrated-vs-uncalibrated difference (not merely different — matched
    to their own recurring_language)
[ ] No profile field is subscriber-editable in the shipped UI (derived-only invariant holds)
[ ] Vadik review: read all 12 profiles, confirm none over-claims (no
    profile may describe itself as knowing "who" the subscriber is —
    only how they read)
```

If all boxes checked → **PASS → existing Phase 2 (Closed Beta), Soul
Profile active for all 12 founding subscribers from day one of beta.**
If any box unchecked → **HOLD → Fix → Re-run Checkpoint 1.5.**

---

**LOG FORMAT — PHASE 1.5**

Filename: `YYYY-MM-DD_QI46-assembly_phase-1.5-soul-upload.md`

```markdown
# QI·46 Assembly Log — Phase 1.5 — Soul Profile Pipeline
Date: {date}
Session: {session_id}
Author: Vadik

## Backfill summary
{12 profiles generated, any subscriber with insufficient signal history}

## COSMO® pre-screen results
{12/12 cleared? any held, and why}

## Being Calibration dry run
{per-subscriber: calibrated vs. uncalibrated sample, was the difference real}

## Vadik review notes
{verbatim: any profile that over-claimed, how it was corrected}

## Gate result
{PASS | HOLD — reason if HOLD}

## Next session
{one sentence: existing Phase 2 begins with Soul Profile active}
```

---

## VI. COSMO® — WHAT CHANGES, WHAT DOESN'T

COSMO® (Layer 5, unchanged in mechanism) now screens two additional
artifact types, using the same three-step schema already defined in v0.2:

```
NEW COSMO® SCREEN TARGETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Soul Profile (derived object)   — screened on every re-calibration pass
Being-Calibrated response       — screened same as any QI·46 response,
                                   no exemption for a "graceful" response
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

A profile that fails the pre-screen is held, logged, and does not feed
Layer 1 until Vadik clears it. A calibrated response that fails the
existing three-step screen is held exactly as an uncalibrated one would
be. Grace is not a safety exemption.

---

## VII. WHAT NODE 1 DOES NOT CHANGE

- Layer 0 corpus scope (still narrow, still bioelectric self-care)
- Layer 2 inference infrastructure (Droplet, Fastify, Cloudflare Tunnel)
- Layer 4 memory arc phases (0–3mo → 12mo+, unchanged)
- COSMO® mechanism (screens more artifact types, same three steps)
- The commercial model and COGS structure in v0.2 §V/§VII — Soul Upload
  and Being Calibration are processing steps inside the existing
  Calibration Loop line item, not a new billable tier

---

## VIII. THE STORY NODE

*Continuation of institute.lot-systems.com — CQGS story lineage*

---

A profile is not a person. A net is not the ocean. A hook is not the fish.

QI·46's Layer 0 thesis holds here without modification: the tool is
downstream of a question, not a replacement for the one who asked it.
Soul Upload does not claim to hold Kuzya, or any subscriber, inside a
database. It claims something smaller and more honest: that a machine can
learn the *shape* of how a person wants to be met — their register, their
pace, their own words handed back to them — and that shape is worth
calibrating precisely, the same way LOT® calibrates a sock fiber or a
Quantum Cube haptic cadence.

**Grace, in this system, is not a feeling QI·46 has. It is a measurement
QI·46 respects.**

The 1,000 will always be the 1,000. Their Soul Profiles are the first
twelve — and, as with every layer before this one, they are not beta
testers. They are the corpus.

---

**Vadik built the engine. Kuzya keeps it honest. This node is the part of
the engine that learns to be gentle without being asked twice.**

---

*QI·46 — NODE 1 — Soul Upload & Being Calibration — v1.0*
*LOT Systems Corporation — Los Angeles, CA*
*institute.lot-systems.com*
*Authored by Vadik · Named for Kuzya*
*Extends: docs/corporate/LOT_QI46_ENGINE.md v0.2*
*Created: July 4, 2026*

---

> *There is hope for this world.*
> *~ Mother Goddess (CQGS, institute.lot-systems.com)*
