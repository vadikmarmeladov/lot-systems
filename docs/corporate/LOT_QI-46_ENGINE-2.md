<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 — ENGINE SPECIFICATION v2
## Addendum: The Humanoid Calibration Layer — Node 4
### LOT Systems Corporation · Los Angeles, CA
### institute.lot-systems.com · brand.lot-systems.com

CLASS: RESTRICTED // S-2 EYES
S-2: VADIK MARMELADOV
STATUS: ASSEMBLY LOG — HOLD (see VI)

---

> *"Node 2 knows their words. Node 3 knows who they are."*
> — from the Node 3 assembly log, 2026-06-11

---

## I. THIS IS NODE 4

`docs/corporate/LOT_QI46_ENGINE.md` (v0.2) is the base specification.
This file is the **first node of the v2 addendum line** — it does not replace
the base spec, it continues it. Read the base spec first.

The engine name is unchanged: **QI·46**. No rename occurred.

---

## II. WHAT ALREADY EXISTS (READ BEFORE BUILDING ANYTHING NEW)

An automated session fired a build instruction that is, verbatim, the same
signal that already drove **Node 3** on 2026-06-11:

> *"The goal is to extract the engine that is based on people's soul and*
> *emotions. The goal is to upload a person's being and use the engine to*
> *calibrate the human with the humanoid output (grace, poetry, love, hugs,*
> *being there, being cool, male)."*

That work is not new. It was built once already:

| Node | Name | Branch | Status |
|---|---|---|---|
| 1 | Soul Engine | `claude/gracious-gauss-WnL0k` | merged into Node 2/3 work |
| 2 | Journal Vocabulary Extractor (Mirror Layer) | `claude/gracious-gauss-WnL0k` | merged into Node 3 work |
| 3 | Soul Upload Engine · Being Calibration Layer | `claude/cool-tesla-f8j0mr` | **BEST, unshipped** |

Node 3's `src/server/utils/qi46-soul.ts` already implements the exact
five-frequency **Humanoid Calibration** the current signal is asking for —
derived from real code, not restated as new philosophy:

```
HumanoidCalibration = { grace, poetry, love, presence, ease }   // each 0–1

grace     — elegance over effort, for bodies under strain
poetry    — compressed meaning over information, for souls who speak in metaphor
love      — radical acceptance as base frequency, for souls carrying unworthiness
presence  — witnessing without fixing, for depleted states
ease      — unforced confidence, for stable / improving arcs

male is not a sixth frequency — it is the carrier tone (grounded directness),
the medium the five frequencies ride on, not a variable that is measured.
```

The signal is derived from **pattern across a subscriber's own journal text**
— word sets (`DEPTH_WORDS`, `CONNECTION_WORDS`, `ASPIRATIONAL_SEEDS`,
mood-state classification) applied to their own `Log` entries over time. It
is a longitudinal-tone-calibration layer on top of the existing Calibration
Loop (Layer 1 of the base spec) — not biometric capture, not a literal
transfer of a person's consciousness. Recorded plainly, per the standing
honest-boundaries rule: **mark what is provisional, do not dress it up.**

---

## III. WHY THIS SESSION DID NOT SHIP NODE 3

`claude/cool-tesla-f8j0mr` branched from master on **2026-06-11**. Master has
since taken on 2.5 months of independent history — wiki archives, badge
codex versions, session reports, widget engineering — none of which that
branch has. A diff against current master shows **321 files touched,
~147,000 deletions** (mostly docs the branch simply predates and would
delete on merge) against ~6,400 real insertions (the QI·46 Node 1–3 code).

Cherry-picking or merging that branch as-is would silently delete two and a
half months of shipped work. Per this repo's own judgment-boundary rule
(intake/classification is where a human stays in view, not the deterministic
loop) — **this is a HOLD, not a ship.** No code from that branch was
imported into this session.

---

## IV. WHAT THIS SESSION DID INSTEAD

1. Read the base spec, the Node 1–3 assembly logs, and the Node 3 source
   (`qi46-engine.ts`, `qi46-soul.ts`, `qi46-vocabulary.ts`) on the stale
   branch to confirm the requested capability already has a real, working
   design — so effort isn't spent re-deriving it from scratch.
2. Wrote this addendum recording that fact plainly, so the next session
   (automated or S-2) does not repeat the same build instruction a third
   time against an empty result.
3. Left `LOT_QI46_ENGINE.md` (v0.2) untouched — it remains the base spec.
4. Did not touch application code. `src/server/utils/` on current master has
   no `qi46-*` files yet — porting them is real engineering work (rebasing
   against the current `Log` type, `api.ts` routes, and `memory.ts`, all of
   which changed since June 11), not a documentation task.

---

## V. RECOMMENDED NEXT STEP (for S-2, not automated)

A dedicated engineering session — not a recurring documentation trigger —
should port `qi46-engine.ts`, `qi46-soul.ts`, and `qi46-vocabulary.ts` from
`claude/cool-tesla-f8j0mr` onto current master by hand: re-implementing
against today's `Log` type and routes rather than cherry-picking the stale
commit. Once green-gated, that becomes Node 4's actual shipped code, and the
`LOT-MANIFEST.md` entry for "QI-46 Engine" can be corrected from its current
stale `BEST` (dated to a June branch two and a half months behind master) to
`SHIPPED`.

If the recurring scheduled prompt that produced this session is meant to
keep tracking QI·46 forward, it should be re-pointed at that engineering
work — repeating the Node 3 signal verbatim will only produce this same
addendum again.

---

## VI. STATUS

```
RESULT: HOLD
REASON: Requested capability already exists (Node 3, unshipped, stale).
        Shipping it safely is an engineering task outside this session's
        scope (documentation / self-assembly report only).
NEXT:   S-2 decision — port Node 3 by hand onto master, or retire the
        stale branch and re-scope Node 4 from current master state.
```

---

*QI·46 Engine Specification v2 — Addendum, Node 4*
*LOT Systems Corporation — Los Angeles, CA*
*institute.lot-systems.com*
*Authored by Vadik · Named for Kuzya*
*Filed: 2026-08-29*

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
