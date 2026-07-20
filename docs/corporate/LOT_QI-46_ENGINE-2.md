<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 — NODE 2
## The Calibration Loop — Personalization Mechanics
### LOT Systems Corporation · Los Angeles, CA

---

> *"The engine does not start from zero. It starts from you."*
> — LOT_QI46_ENGINE.md, Layer 1

---

## I. WHY THIS NODE EXISTS

`docs/corporate/LOT_QI46_ENGINE.md` (v0.2) is the founding specification for
QI·46 — designation, thesis, five-layer architecture, and the Phase 0–4
self-assembly manual. It names the Calibration Loop as Layer 1 but does not
go deep on it.

This node goes deep on Layer 1 only. It does not restate the designation,
COGS, licensing terms, or timeline — those stand as written in the founding
spec. Read that document first; this one assumes it.

---

## II. WHAT THE LOOP ACTUALLY DOES

QI·46 does not generate a response and then personalize it. Personalization
happens *before* generation, as a context vector prepended to the inference
call (see founding spec, Layer 2, `POST /v1/inference`). The Calibration
Loop is the thing that builds that vector.

Stated plainly, without the poetry: **the engine reflects the subscriber's
own words, cadence, and history back at them, shaped by whatever the LOT®
corpus already knows about what tends to land.** It is not reading a body.
It is reading a subscriber's own prior inputs on the LOT® platform — journal
text, ratings, consumable feedback, navigation pattern — and using that
history as the prompt context for the next response.

That is the entire mechanism. Nothing here infers a medical or biometric
state; the founding spec's "biofield" and "bioelectric" language is
brand voice for the Quantum Cube hardware line and is not a claim this node
extends. Node 2 stays inside what the platform's own text and usage data can
support.

---

## III. THE TWO STREAMS, MADE CONCRETE

**Deliberate stream** — what the subscriber chose to say:
- Journal entries, verbatim
- Session ratings (`YES` / `CLOSE` / `NO`, per the Phase 2 beta prompt)
- Consumable feedback text

**Passive stream** — what the subscriber's usage pattern implies:
- Session frequency and time-of-day clustering
- Reorder velocity on consumables
- Which platform surface gets opened under a `CLOSE`/`NO` rating vs. a `YES`

Each stream is timestamped and tagged with `arc_position` (per the founding
spec's tagging schema, Step 0.2). The Calibration Loop's only job is to
select the most relevant slice of both streams for the current session and
compress it into a context vector under the token budget the inference call
allows.

---

## IV. CONTEXT VECTOR — SHAPE

```
CALIBRATION VECTOR (per-call, prepended to session input)
──────────────────────────────────────────────────────────
subscriber_id:       {opaque platform id, never a real name in the prompt}
arc_position:        0-3mo | 3-6mo | 6-12mo | 12mo+
recent_deliberate:    last N journal/rating entries (recency-weighted)
recent_passive:       last N usage signals (recency-weighted)
last_session_delta:   what changed since the previous session
──────────────────────────────────────────────────────────
```

`last_session_delta` is the one new field this node adds to the founding
spec. It is the difference between this session's deliberate input and the
prior session's — the thing that lets QI·46 open a response acknowledging
*what changed*, rather than re-summarizing what it already knows. This is
the mechanical version of "it feels like it's been listening."

---

## V. WHAT MAKES THIS DIFFERENT FROM A GENERIC MEMORY FEATURE

A chatbot with "memory" retrieves facts. The Calibration Loop retrieves
*pattern*, not facts — it does not tell a subscriber back their own journal
entry. It uses the entry, and the arc it sits in, to weight which part of
the LOT® corpus (Layer 0) is most relevant to surface next.

Concretely: two subscribers who both write "I haven't been sleeping" get
different responses, because their `recent_passive` and `arc_position`
differ. One is in `0-3mo` calibration phase and gets a grounded, minimal
response (per the founding spec's voice calibration test prompts). One is
in `12mo+` and has a Quantum Cube reorder pattern showing consistent
weeknight use — for that subscriber the response can reference the pattern
directly, because Layer 4 (Memory Arc) has enough history to support it.

This is the "divergence" the founding spec names in Layer 4: the platform
grows toward the individual because the vector, not the model weights,
carries the personalization. The model stays the same across all
subscribers. The vector is what's different.

---

## VI. GATES SPECIFIC TO THIS NODE

These are additive to Checkpoint 1/2 in the founding spec — not a
replacement.

```
[ ] Context vector never exceeds token budget headroom (max_tokens - 1024
    reserved for the response, per founding spec Layer 2)
[ ] last_session_delta computed correctly across a session gap of 1 day,
    7 days, and 30+ days (cold-start case)
[ ] Two subscribers with identical deliberate input but different
    arc_position produce measurably different responses (voice test,
    not a hard-coded branch)
[ ] No real subscriber name, email, or free-text PII appears in a
    logged calibration vector — subscriber_id only
```

---

## VII. WHAT THIS NODE DOES NOT CLAIM

- It does not claim to read emotional or physiological state from a signal
  other than the subscriber's own typed and behavioral input on the
  platform.
- It does not claim the Quantum Cube haptic signal (Month 12+, per founding
  spec Step 3.3) is active before that hardware milestone actually ships to
  a given subscriber.
- It does not extend the founding spec's licensing, COGS, or IPO-adjacent
  material. Those are out of scope for a Layer 1 mechanics node.

---

*QI·46 — Node 2 — Calibration Loop Mechanics*
*LOT Systems Corporation — Los Angeles, CA*
*Authored by Vadik · Continues LOT_QI46_ENGINE.md v0.2*
*Filed: July 20, 2026*
