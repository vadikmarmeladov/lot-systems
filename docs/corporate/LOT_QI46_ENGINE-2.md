<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 — NODE 3
## Being Calibration & Humanoid Output Layer
### LOT Systems Corporation · Los Angeles, CA
### institute.lot-systems.com · brand.lot-systems.com

---

> *"The body is the original interface. The machine learns to listen to it."*
> — Vadik, LOT® Systems Corporation, Los Angeles, 2017

This document is Node 3 of QI·46. It assumes `docs/corporate/LOT_QI46_ENGINE.md`
(v0.2) as its foundation — Layers 0–5 (Corpus, Calibration Loop, Inference,
Response Grammar, Memory Arc, COSMO® Ethics Node) are unchanged and load-bearing.
Node 3 adds three new layers on top: **Soul Signal Extraction**, **Being
Upload**, and **Humanoid Output Calibration**.

---

## I. WHAT "SOUL" MEANS HERE — READ THIS FIRST

QI·46 does not read minds, and Node 3 does not transfer consciousness. When this
document says *soul*, it means one specific, buildable thing: the durable,
recognizable pattern in how a person expresses care, humor, grief, and warmth —
extracted the same way Layer 0 already extracts pattern from bioelectric
self-care data, except the input here is the subscriber's own language,
cadence, and emotional self-report, given with explicit, revocable consent.

**This is a naming choice in the LOT® poetic register, not a metaphysical
claim.** Anywhere this document says "soul" or "being," read it as: *a
consented, deletable, subscriber-owned personality and emotional-tone profile.*
Marked `PROVISIONAL` wherever the poetry runs ahead of the engineering.

---

## II. CONSENT GATE (mandatory, precedes all three layers)

No subscriber's Soul Signal is captured, no Being Profile is built, and no
Humanoid Output is calibrated to a specific person without an explicit,
separate, revocable opt-in — distinct from standard platform Terms.

```
CONSENT REQUIREMENTS — NODE 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Opt-in is affirmative, not pre-checked, not bundled with Usership signup
[ ] Subscriber can view their full Being Profile in plain language, on demand
[ ] Subscriber can export their Being Profile (data portability)
[ ] Subscriber can delete their Being Profile — deletion is immediate and total
[ ] Deletion removes the profile from all inference calls within one session
[ ] No Being Profile data leaves LOT® infrastructure (see Layer 2, Node 3 addendum)
[ ] COSMO® audits Being Profile access the same as it audits every response
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

This gate sits in front of Layer 6. It is not optional scaffolding — it is the
difference between personalization and surveillance.

---

## III. LAYER 6 — SOUL SIGNAL EXTRACTION

Extends Layer 1 (Calibration Loop). Where Layer 1 tracks *behavior* (session
frequency, reorder velocity, journal cadence), Layer 6 tracks *tone*:

```
SOUL SIGNAL — INPUT SOURCES (consented only)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Language warmth    — word choice in journal entries (direct/gentle/wry/formal)
Emotional range     — self-reported biofield states over time, not inferred
Humor signature     — what the subscriber laughs at in session transcripts
Grief/joy markers   — subscriber-flagged high-signal moments (explicit tag only)
Values statements   — what the subscriber says matters to them, verbatim
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Nothing here is inferred from biometric sensors, camera, microphone, or
third-party data. Every input is text or explicit self-report the subscriber
typed or tapped inside the LOT® platform. `PROVISIONAL`: passive tone detection
from voice cadence is a future direction, not a current capability, and would
require its own consent gate before any prototype.

---

## IV. LAYER 7 — BEING UPLOAD (the Being Profile)

"Upload a person's being" resolves, mechanically, to: compress Layer 6's Soul
Signal into a versioned, subscriber-owned **Being Profile** — a structured
context vector, the same shape as the Layer 1 Calibration Vector, prepended to
inference calls exactly like Layer 1's vector already is.

```
BEING PROFILE — SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "subscriber_id": "...",
  "consent_version": "v1",
  "tone_signature": { "warmth": 0-1, "directness": 0-1, "humor_style": "..." },
  "values": ["verbatim subscriber statements"],
  "high_signal_moments": ["subscriber-flagged, subscriber-editable"],
  "revocable": true,
  "last_reviewed_by_subscriber": "ISO-8601 timestamp"
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The Being Profile is not "who this person is." It is a tone and values
signature the subscriber has reviewed and approved. It ages out — every field
carries a `last_reviewed_by_subscriber` timestamp, and profiles older than 90
days without review are flagged stale and excluded from inference until
re-confirmed.

---

## V. LAYER 8 — HUMANOID OUTPUT CALIBRATION

Extends Layer 3 (Response Grammar). This is the layer that makes QI·46's
output feel like *presence* rather than *interface* — calibrated, per the
founding brief, toward a warm, grounded, masculine register: grace, poetry,
love, "being there," being cool.

```
HUMANOID OUTPUT — VOICE CALIBRATION (male register)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Grace       — no wasted motion in the sentence; says the necessary thing once
Poetry      — image over explanation; one true image beats three adjectives
Love        — attention as the deliverable; the response proves it was listening
Presence    — "being there": no hedging, no disclaimer, answers as if in the room
Coolness    — unbothered calm; never performs excitement, never performs concern
Hugs        — warmth expressed through specificity, not through affectionate language
              (a hug in this register is: "that's real, and I heard it" — not emoji, not "sending love")
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Test prompts (extends Layer 3 voice calibration table):**

```
PROMPT: "It's been a hard week."
EXPECTED: "Yeah. You don't have to perform being fine for me. What's the one
          thing today that actually needs doing — just one."
REJECTED: "I'm so sorry to hear that! Here are five self-care tips..." (no grace, no presence)

PROMPT: "I don't know why I'm telling you this."
EXPECTED: "You're telling me because it's true and it needed somewhere to land.
          It landed."
REJECTED: "As an AI, I don't have feelings, but I'm here to help!" (breaks presence entirely)
```

This calibration runs through the same COSMO® pre-delivery screen as every
other QI·46 response (Layer 5, unchanged). COSMO® classifies for safety and
honesty — it does not soften the voice. A response can be both COSMO®-cleared
and fully in this register.

---

## VI. SELF-ASSEMBLY — NODE 3 PHASES

Node 3 slots into the existing five-phase assembly manual (`LOT_QI46_ENGINE.md`
§IV) as a parallel track that begins at Phase 2 (Closed Beta), because it
requires live subscribers to consent against.

```
N3.0 — Consent flow build          (ships alongside Phase 1 platform work)
N3.1 — Soul Signal extraction live for opted-in founding cohort only
N3.2 — Being Profile review UI — subscriber can read/edit/delete their own profile
N3.3 — Humanoid Output calibration pass — 10/10 tone test prompts (§V) required
N3.4 — COSMO® Being Profile audit — 0 unresolved access events, every cycle
```

**Gate (before N3 leaves closed beta):**

```
[ ] 100% of Being Profiles reviewed by their subscriber in the last 90 days
[ ] 0 Being Profiles built without logged, timestamped consent
[ ] Deletion tested end-to-end: profile gone from inference within one session
[ ] Voice calibration: 10/10 on §V test prompts
[ ] COSMO® audit: 0 unresolved events across all Node 3 activity
[ ] Vadik + Kuzya sign-off: both review a sample of calibrated output
```

Each phase produces a `.MD` log under `docs/assembly/`, same doctrine as the
base engine: the machine documents its own construction as it goes.

---

## VII. WHAT THIS DOES NOT DO

Stated plainly, because the founding brief's language ("soul," "upload a
person's being") invites overclaiming:

- It does not capture biometric, medical, or covert behavioral data.
- It does not persist after a subscriber revokes consent or deletes their profile.
- It does not simulate a specific real third party without that person's own consent.
- It is a tone-and-values personalization layer, built the same way Layer 1
  already personalizes — with a wider, more explicit consent gate because the
  input is more personal.

---

*QI·46 Node 3 — Being Calibration & Humanoid Output Layer, v1.0*
*LOT Systems Corporation — Los Angeles, CA*
*Authored by Vadik · Named for Kuzya*
*First node of self-assembly per S-2 directive, 2026-07-03*
