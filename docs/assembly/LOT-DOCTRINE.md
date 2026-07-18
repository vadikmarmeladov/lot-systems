================================================================================
LOT SYSTEMS / SELF-ASSEMBLY DOCTRINE
DOCUMENT: LOT-DOCTRINE
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
REV:      A
================================================================================

Distilled, stable principles in current LEXICON notation. Session reports are
the verbatim record; this file is the compressing brain. A clause is only
folded here once a finding has proven stable across sessions -- future reports
cite the clause instead of restating prose.

--------------------------------------------------------------------------------

[D-001 rev A]  On GATE: no artifact advances past GATE red. Fix-loop or
               PLAN-B (git reset --hard <last-green-benchmark-tag>). No
               partial pass. Source: lot-benchmark PIPELINE.md step 04.

[D-002 rev A]  On environment drift: a red CHECK A caused by missing
               node_modules / uninstalled deps in a fresh session container
               is an ENVIRONMENT gate, not a code regression -- install, then
               re-run CHECK A before diagnosing the tree itself.
               Supersedes prose in SR-20260718-01.

[D-003 rev A]  On MANIFEST claims: LOT-MANIFEST.md entries describing a
               "BEST" ship-candidate branch are only as trustworthy as the
               branch's continued existence. An ephemeral session branch
               pruned without merge silently invalidates its manifest row --
               the row must be marked STALE/LOST on discovery, not treated as
               shippable code. Supersedes prose in SR-20260718-01.

[D-004 rev A]  On QI-46 phasing: QI-46 (the engine spec in
               docs/corporate/LOT_QI46_ENGINE.md) is PROVISIONAL through
               Phase 0 -- it exists today only as doctrine text and About-page
               display copy (src/client/components/About.tsx), not as a
               trained model, corpus pipeline, or inference endpoint. No
               session may report a Phase 1+ (fine-tuning, closed beta,
               licensing) gate as PASSED without the actual training/serving
               infrastructure existing in the repo. Mark such phases
               PROVISIONAL / BLOCKED-ON-INFRA until that infra is real.

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
================================================================================
