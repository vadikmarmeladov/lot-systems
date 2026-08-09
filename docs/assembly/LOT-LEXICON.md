================================================================================
LOT SYSTEMS — LEXICON
DOCUMENT: LOT-LEXICON
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
================================================================================

Evolving controlled vocabulary. A token is minted only after a concept has
recurred in 3+ prior session reports, or has been folded into doctrine twice
(minting rule: lot-benchmark skill, references/SELF-ASSEMBLY.md).
Tokens are never deleted; superseded tokens are marked DEPRECATED -> <new>.

This file did not exist before LOT-SR-20260809-01. The corpus already used
several of these tokens informally, densely, and consistently for weeks
before any formal LEXICON existed. This first pass retroactively registers
only the ones independently verified by direct corpus grep (not assumption)
to clear the 3+ recurrence bar. SINCE is "pre-existing" for these — they were
not minted this session, only formally recorded this session.

--------------------------------------------------------------------------------
TOKEN     MEANING                                             REV   SINCE
-----     -------                                             ---   -----
QIE       Quantum Intention Engine (intentionEngine.ts —       A    pre-existing
          nanostores signal bus + WIDGET_DEPENDENCY_MAP).           (formalized
          Verified: 97 prior docs/ files reference it.              LOT-SR-20260809-01)

GATE      CHECK-B green-gate decision point (pipeline step     A    pre-existing
          04): green -> proceed; red -> fix-and-recheck loop;       (formalized
          unrecoverable -> PLAN B rollback. Verified: 22             LOT-SR-20260809-01)
          prior docs/ files reference it.

ArchNN    Archetype number NN in the QIE archetype catalog      A    pre-existing
          (e.g. Arch51 = Quantum Presence Crystallizer, per          (formalized
          LOT-SR-20260804-02). Verified: 47 prior docs/ files.       LOT-SR-20260809-01)

PNNN      Pattern number NNN in the QIE recognized-pattern      A    pre-existing
          catalog. Always cited alongside an ArchNN and a JNN        (formalized
          in session summaries (e.g. P149-P151).                     LOT-SR-20260809-01)

JNN       Job/journey number NN in the QIE catalog, cited       A    pre-existing
          alongside PNNN and ArchNN in session summaries             (formalized
          (e.g. J48).                                                LOT-SR-20260809-01)

================================================================================
AUTHORIZED BY: S-2 // VADIK MARMELADOV
================================================================================
