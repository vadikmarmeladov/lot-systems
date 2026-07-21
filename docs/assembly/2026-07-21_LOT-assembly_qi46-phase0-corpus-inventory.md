# LOT Self-Assembly Session Report
**Date:** 2026-07-21
**Session ID:** LOT-SR-20260721-01
**Assembly Phase:** QI·46 — Phase 0 (Corpus Assembly), Step 0.1
**Branch:** claude/cool-tesla-4nfbcf

---

## Summary

First self-assembly session against `docs/corporate/LOT_QI46_ENGINE.md`. This
run executes Step 0.1 (Source Inventory) honestly: it counts what actually
exists in the repo today, rather than restating the spec's aspirational
`/corpus/*` layout as if it were already built. No fine-tuning infrastructure
exists yet — no GPU host, no `/qi.lot-systems.com` endpoint, no training
pipeline. This session records ground truth so Phase 0 has a real baseline to
work from, and adds a voice-register addendum to Layer 3 of the spec.

**Gate result: HOLD on the full Phase 0 checklist** — the checklist in the spec
requires `> 10,000 training pairs` and a working JSONL export, neither of
which exist. What follows is the honest partial: a real document inventory,
correctly mapped to the spec's tagging categories, with the gap stated
plainly rather than papered over.

---

## Real Source Inventory (as of this session, repo root)

```
docs/corporate/     24 .md   — maps to spec's /corpus/institute + /corpus/brand
docs/technical/      29 .md   — engineering specs, partial overlap w/ /corpus/bioelectric
docs/assembly/       84 .md   — self-assembly session logs (QIE arc, badge engine, wiki)
docs/benchmark/      78 .md   — session reports + LEDGER/LEXICON/DOCTRINE
docs/wiki/           24 .md   — LOT-WIKI field manual iterations
docs/deployment/     21 .md
docs/badges/         26 .md
docs/releases/       10 .md
docs/setup/           7 .md
docs/diagnostics/     8 .md
docs/security/        3 .md
docs/backup/          4 .md
─────────────────────────────
docs/ total:        323 .md
repo total:         328 .md   (5 outside docs/)

src/client/components/About.tsx — 48,168 words (single file). This is the
  living Field Manual — canonical brand voice source, continuously updated by
  wiki sessions. Highest-value single document in the corpus for Layer 3
  (Response Grammar) voice calibration.
```

There is no `/corpus/platform` (subscriber journal entries) in this
inventory. Subscriber journal/session data lives in the live PostgreSQL
database (`logs`, `answers`, and related tables per `src/server/routes/api.ts`),
not as exportable documents. Turning that into a tagged JSONL corpus per
Step 0.3 is real future work — a database export + anonymization pass — not
something this session fabricates or simulates with invented records.

---

## Tagging Schema Applied (Step 0.2, dry run against the 323 docs/ files)

Mapping the spec's tag schema to what is actually discoverable by folder
convention, without opening and hand-tagging all 323 files this session:

```json
{
  "source":        "platform | institute | brand | bioelectric | consumable | cosmo",
  "type":          "instruction | example | philosophy | technical | voice",
  "arc_position":  "n/a — arc_position is a subscriber-session concept; it
                    does not apply to corpus documents, only to logged
                    interactions once Phase 2 (Closed Beta) begins",
  "cosmo_cleared": "not yet run — no COSMO® pre-screen has executed against
                    this document set; every doc in this inventory is
                    UNSCREENED, not CLEARED"
}
```

Folder → `source` mapping used for this dry run:
```
docs/corporate/   -> institute | brand   (mixed; needs per-file split)
docs/technical/   -> bioelectric | technical
docs/assembly/    -> technical (self-assembly logs are meta-corpus, not
                     subscriber-facing voice)
docs/benchmark/   -> technical
docs/wiki/        -> brand (About.tsx lineage)
docs/badges/      -> brand
(remaining folders -> technical, default fallback)
```

---

## Voice Register Addendum (Layer 3)

Added a "Voice register" subsection to `docs/corporate/LOT_QI46_ENGINE.md`
Layer 3, operationalizing this session's brief (grace, poetry, warmth,
presence, composure, register) as six testable register words rather than
adjectives asserted in prose. These extend the existing Layer 3 constraint
list; they do not replace anything already there. See the spec file for the
full text.

---

## Gate Result

```
[ ] All sources inventoried and catalogued           -> DONE (real counts above)
[ ] All documents tagged per schema                   -> NOT DONE (folder-level
                                                          mapping only; per-file
                                                          tagging is Phase 0
                                                          remaining work)
[ ] COSMO cleared: true on all training examples      -> NOT DONE (no COSMO
                                                          screen has run against
                                                          this document set)
[ ] Corpus size > 10,000 training pairs                -> NOT MET (0 JSONL
                                                          pairs exist; corpus is
                                                          323 raw documents, not
                                                          training pairs)
[ ] JSONL format validated                             -> NOT DONE (no export
                                                          pipeline exists yet)
[ ] Vadik review: 100 random examples approved         -> NOT DONE

GATE: HOLD — Phase 0 is real-baselined but not complete. Recorded honestly
per SELF-ASSEMBLY.md: no fabricated corpus, no simulated subscriber data, no
claimed completion the checklist does not support.
```

## Next session

Build the `/corpus/platform` export path (DB -> anonymized JSONL) as its own
ENGINEERING session before attempting per-file tagging of the 323 existing
docs — the platform export is the harder, higher-value unknown.
