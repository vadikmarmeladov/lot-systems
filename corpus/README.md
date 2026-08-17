<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 Corpus — Source Tree

Phase 0 (Corpus Assembly) scaffold, per `docs/corporate/LOT_QI46_ENGINE.md` §III
Layer 0 and §IV Phase 0 Step 0.1 (Source inventory).

This tree holds LOT®'s proprietary self-care dataset before it is tagged and
converted to the JSONL training format described in Step 0.3 of the spec. It
is the *input* side of the pipeline — nothing here is model-ready yet.

## Status: SCAFFOLD ONLY

As of 2026-08-17 these six directories are structural placeholders. No
subscriber data, white papers, or brand copy have been extracted into them.
Population is a separate, larger data-engineering task — exporting real
platform records is not something a single documentation/self-assembly
session should do without S-2 review of what is being included (see
`cosmo_cleared` gate below).

| Directory       | Source (per spec §IV Step 0.1)                                   |
|-----------------|---------------------------------------------------------------------|
| `platform/`     | Subscriber journal entries, session logs                            |
| `institute/`     | LOT® Institute white papers (CQGS, Quantum Cube, bioelectric docs)  |
| `brand/`         | Terminal Grid copy, Usership language, social posts                 |
| `bioelectric/`   | Piezoelectric theory, nano-ceramic specs, biofield docs              |
| `consumables/`   | Sock, toothbrush, Quantum Cube feedback records                      |
| `cosmo/`         | COSMO® event logs (detection → FAX → record)                        |

## Tagging schema

Every document added here must eventually carry the tags defined in
`TAGGING_SCHEMA.json` (mirrors spec §IV Step 0.2) before it is eligible for
JSONL conversion. Documents where `cosmo_cleared: false` are held for Vadik
review — they do not enter the corpus silently.

## Checkpoint 0 gate (spec §IV Phase 0)

Not met. Per the spec's own gate:

```
[ ] All sources inventoried and catalogued        <- directories exist, empty
[ ] All documents tagged per schema                <- N/A, no documents yet
[ ] COSMO® cleared: true on all training examples  <- N/A
[ ] Corpus size > 10,000 training pairs             <- 0
[ ] JSONL format validated — no malformed lines     <- N/A
[ ] Vadik review: corpus sample approved            <- not yet requested
```

Result: **HOLD.** Per the Assembly Card: "A failed gate is not a failure. It
is a checkpoint working correctly." This scaffold session does not claim
Phase 0 is complete — see `docs/assembly/2026-08-17_QI46-assembly_phase-0-corpus.md`
for the full session log.
