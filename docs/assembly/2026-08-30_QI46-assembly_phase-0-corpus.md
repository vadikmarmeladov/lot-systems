# QI·46 Assembly Log — Phase 0 — Corpus Assembly
Date: 2026-08-30
Session: scheduled-routine (autonomous)
Author: Vadik (S-2) — session run unattended per scheduled task

## Naming review (precondition to Phase 0)
Five candidate designations were reviewed: `LOT·SC·46`, `BIONODE-46`,
`SELFWARE·46`, `CARE·OS·46`, `QI·46`. **QI·46 confirmed** — already the
standing name throughout `docs/corporate/LOT_QI46_ENGINE.md` (spec v0.2) and
already load-bearing in the API surface described there
(`lot-qi-46-v{version}`, `/qi46/infer`). No rename executed. Addendum recorded
in the spec (see FILES CHANGED, session report).

## Sources read
Real inventory of the existing repo document corpus — the only corpus this
session had access to or authorization to touch. This maps to the spec's
`/corpus/*` taxonomy as follows:

```
SOURCE INVENTORY (actual, this session)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
docs/corporate/   → institute/brand corpus            25 files
docs/technical/   → bioelectric + engine technical     29 files
docs/wiki/        → brand language / Terminal Grid     33 files
docs/assembly/    → self-assembly doctrine corpus      98 files
docs/badges/      → Usership voice / gamification      32 files
docs/benchmark/   → COSMO-adjacent audit trail          79 files
─────────────────────────────────────────────────────
docs/ total                                            374 .md files
docs/ total word count (token-count proxy)              674,170 words
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Not read, not accessed:** `/corpus/platform/` (subscriber journal entries,
session logs), `/corpus/consumables/` (consumable feedback records),
`/corpus/cosmo/` (COSMO® event logs). These map to real subscriber-generated
data in the production Postgres database, not to files in this repository.
This session made no database connection and pulled no subscriber records —
that is a distinct, higher-stakes step (real personal data entering a
training corpus) that needs its own authorized pass with explicit data-
handling and consent review, not a documentation-only self-assembly run.

## Tagging summary
Tagging schema (per spec §IV Step 0.2) is drafted and ready to apply to the
five document-corpus sources above. Not yet run — no JSONL emission this
session. `cosmo_cleared` cannot be honestly set on any record without the
COSMO® node existing as running code; it does not yet exist (Phase 1+ work).

## Corpus statistics
Document-corpus only: 374 files / ~674K words (~900K tokens, ESTIMATE).
Subscriber-corpus: 0 — not sourced this session (see above).
Training-pair count: 0 — no JSONL conversion has been run.

## Vadik review notes
Not applicable — autonomous scheduled session, no live review this pass.
Flagging for S-2: the naming decision and the corpus-taxonomy inventory are
ready for review; the subscriber-data sourcing step needs explicit sign-off
before any future session attempts it.

## Gate result
**HOLD** — Checkpoint 0 requires corpus size > 10,000 training pairs and
`cosmo_cleared: true` on all training examples; neither is met (0 training
pairs emitted, COSMO® node not built). This is not a failure — it is Phase 0
correctly refusing to advance past a real, unmet gate. Document-corpus
inventory and naming confirmation are genuinely complete; subscriber-corpus
sourcing and JSONL conversion remain open.

## Next session
Decide, with S-2, whether the next Phase 0 pass (a) converts the document
corpus alone into a first JSONL sample to prove the pipeline, or (b) opens
the subscriber-data sourcing question as its own reviewed step before any
conversion touches personal data.
