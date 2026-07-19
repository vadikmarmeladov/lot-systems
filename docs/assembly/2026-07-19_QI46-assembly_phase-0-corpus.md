<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 Assembly Log — Phase 0 — Corpus Assembly
Date: 2026-07-19
Session: LOT-SR-20260719-01 (see /docs/LOT-SR-20260719-01.md for the Benchmark
protocol report covering this same session)
Author: Vadik (session run by Claude, S-2-authorized)

## Sources read

```
docs/corporate/*.md      — 24 documents on disk
docs/technical/*.md,txt  — 30 documents on disk
```

Of those 54 documents, 14 matched the Phase 0 include-filter for genuine
white-paper / brand-voice / philosophy material (see
`scripts/corpus/build-corpus.ts`). The remainder are operational engineering
docs (setup guides, integration checklists, fix logs, testing plans) — real
and valuable to the codebase, but not voice-training signal, so excluded by
design rather than by oversight.

`/corpus/platform/`, `/corpus/consumables/`, `/corpus/cosmo/` were **not**
read — no such data exists in this repository. See "Gate result" below.

## Tagging summary

Total documents tagged: 14
COSMO® cleared: 0 — COSMO® cleared (flagged for review): 14

By source:
```
institute:    4
brand:        8
bioelectric:  2
platform:     0  (no data in repo)
consumable:   0  (no data in repo)
cosmo:        0  (no data in repo)
```

## Corpus statistics

Total training pairs: 14
Total words: 38,393 (~51,000 est. tokens)
Arc position: n/a on all records (these are corpus-level documents, not
subscriber-arc-scoped interactions — arc-scoped data would come from
`platform`, which is not present here)

## Vadik review notes

None yet. Zero of the 14 records have been through a human review pass.
Per Step 0.2 of the spec, every record with `cosmo_cleared: false` is
flagged for review before inclusion in any fine-tuning run — that review has
not happened in this session and this log does not claim it has.

## Gate result

**HOLD.**

```
CHECKPOINT 0 — GATE
[x] All sources inventoried and catalogued
      -> institute / brand / bioelectric: inventoried from this repo.
      -> platform / consumable / cosmo: catalogued as ABSENT (see gaps below),
         not inventoried, because no such data exists outside production.
[x] All documents tagged per schema
[ ] COSMO® cleared: true on all training examples
      -> 0/14 cleared. All 14 are cosmo_cleared: false, correctly, because no
         human review has occurred.
[ ] Corpus size > 10,000 training pairs
      -> 14/10,000. Far short, and expected to stay short until platform,
         consumable, and cosmo sources are wired to a real export path from
         production — that is infrastructure work, not a corpus-assembly
         task, and out of scope for what a repo-only session can do.
[x] JSONL format validated — no malformed lines
[ ] Vadik review: corpus sample approved (minimum 100 random examples reviewed)
      -> Not done. Corpus is 14 records total, below the 100-sample minimum
         the checkpoint assumes.
```

Three of six boxes unchecked. Per doctrine, HOLD is a legitimate, recorded
outcome — not a failure to conceal. Phase 1 (fine-tuning) does not begin from
this corpus as-is.

### Gaps (open, not fabricated)

| Source | Status | What would close the gap |
|---|---|---|
| `platform` | absent | A production data export pipeline (subscriber journal entries, session logs) from the live PostgreSQL database — does not exist yet, requires infra + privacy/consent review before any export, let alone training use. |
| `consumable` | absent | Consumable feedback export (sock/toothbrush/Quantum Cube ratings) — same production DB dependency. |
| `cosmo` | absent | COSMO® event log export — same, plus COSMO® itself is not yet built (Layer 5 of the spec is a design, not a running system). |
| Vadik review | not started | A human review pass over the 14 tagged records currently in the corpus. |

## Next session

Do not attempt Phase 1 (fine-tuning) against this corpus. The next concrete
step is either (a) a human review pass over the existing 14 records to move
them toward `cosmo_cleared: true`, or (b) scoping the platform/consumable/cosmo
export pipeline as its own infra project — both are prerequisites Checkpoint 0
is correctly blocking on.
