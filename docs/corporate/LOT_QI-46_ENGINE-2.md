<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 — NODE STATUS
## The First Node: What Is Actually Running

### LOT Systems Corporation · Los Angeles, CA

---

> `LOT_QI46_ENGINE.md` is the specification. This document is the status
> report. It exists because a spec and a running system are not the same
> thing, and QI·46 has, as of this session, become the second kind.

---

## I. WHAT "FIRST NODE" MEANS HERE

`LOT_QI46_ENGINE.md` (v0.2, updated 27 May 2026) lays out a five-phase
self-assembly timeline — Corpus Assembly through External Licensing —
scheduled Q3 2026 through Q3 2027. None of those phases have run. There is
no fine-tuned model, no `/qi46/infer` endpoint, no closed beta.

What exists instead, and predates the spec's own phase schedule, is three
small pieces of code, written 11 June 2026 on a session branch and never
carried into the main line of development:

- **Node 1 — Vocabulary** (`src/server/utils/qi46-vocabulary.ts`, 290 lines)
  extracts a subscriber's own recurring words and phrasing from their
  logged check-ins.
- **Node 2 — Soul Signature** (`src/server/utils/qi46-soul.ts`, 353 lines)
  turns that history into a `SoulSignature`: shadow and light themes,
  aspirational language, a depth reading (surface / wading / deep), a
  presence mode (contemplative / kinetic / oscillating), and a
  `HumanoidCalibration` — five 0–1 values (grace, poetry, love, presence,
  ease) describing the tone a response should carry.
- **Node 3 — Engine Integration** (`src/server/utils/qi46-engine.ts`,
  478 lines) builds the calibration vector, folds the soul signature and
  humanoid calibration into the inference system prompt, and returns the
  response plus its calibration metadata.

This is not a trained model. It is a deterministic, rule-based layer that
reads a subscriber's own logged history and steers the tone of an
existing LLM call (Claude, via the AI engine abstraction already
documented in `AI-ENGINE-GUIDE.md`) toward language that fits the pattern
that history shows. "Soul" and "being" here name what the spec has always
meant by them: the LOT® Memory Story — a person's own recorded self-care
signal — not biometric or neural data of any kind. Nothing about a
subscriber leaves their own logged entries; nothing is collected that the
Memory Engine wasn't already collecting.

**This is the first node**, in the plain sense: the first piece of QI·46
to run against real request traffic rather than exist only as
specification.

---

## II. WHERE IT LIVES TODAY

Written 11 June 2026 on branch `claude/cool-tesla-f8j0mr` (two commits,
`f7ab28ca` and `36ef4dde`), it sat unshipped for three months while the
main line moved on — 321 files, two months of unrelated feature work.
This session (3 September 2026) cherry-picked both commits forward onto
the current line (`claude/cool-tesla-85gzbm`), clean, no conflicts. Full
provenance — assembly logs, gate checklists — is preserved verbatim at:

```
docs/benchmark/2026-05-27_QI46-assembly_node-1-soul-engine.md
docs/benchmark/2026-05-27_QI46-assembly_node-2-vocabulary.md
docs/benchmark/2026-06-11_QI46-assembly_node-3-soul-upload.md
```

(The first two were misfiled at the repo root by the original commit;
this session relocated them into `docs/benchmark/` to match the third.)

**Wiring** — `src/server/routes/api.ts`, the `/emotional-checkins` POST
handler: subscribers tagged `Usership` get a live QI·46 response
(`generateQI46Response`, calibration vector built from their last 200
logs); everyone else gets the existing static compassionate-response
fallback. This gating was already in the original commit — it is not new
policy, it is what shipped forward unchanged.

**Build status** — `npm run server:build` and `npm run client:build`
both green on the current line with this code integrated. See the
session report for the full gate record:
`docs/benchmark/LOT-SR-20260903-01.md`.

---

## III. WHAT THIS DOCUMENT DOES NOT CLAIM

No fine-tuning has happened. There is no `lot-qi-46-v0.1` model. Phases
0–4 of `LOT_QI46_ENGINE.md` remain exactly as scheduled — this node sits
outside that timeline, not ahead of it. The COSMO® screening layer
described in the spec (Layer 5) does not exist yet; nothing in Node 1–3
runs a safety classification pass before delivery. That gap is the most
important open item below.

---

## IV. NEXT

- **COSMO® screen before delivery** — the spec treats this as
  non-negotiable ("Every response that QI·46 generates passes through
  the COSMO® node before delivery"). Nodes 1–3 do not yet do this. Should
  be closed before this path sees meaningfully more traffic.
- **Master merge** — this integration lives on a session branch, not
  master. Per standing branch-safety practice, that merge is left for
  Vadik to decide and trigger, not for an unattended run to make.
- **Naming decision (this session's other input)** — five engine-name
  candidates were on the table: `LOT·SC·46`, `BIONODE-46`, `SELFWARE·46`,
  `SOMA·46`, `CARE·OS·46`, `QI·46`. Moot for this document, because the
  code that exists already calls itself `QI·46` throughout — the
  `[QI·46]` console log line, the doc headers, the commit messages. The
  name was decided in June; this session's naming exercise converges on
  what the codebase already committed to. `SELFWARE` remains the
  registered *codename* per `LOT_QI46_ENGINE.md` §I — `QI·46` is the
  designation actually in use.

---

*QI·46 Node Status — first entry*
*LOT Systems Corporation — Los Angeles, CA*
*Authored by Vadik · Named for Kuzya*
*2026-09-03*
