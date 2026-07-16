================================================================================
LOT SYSTEMS / DOCTRINE
DOCUMENT: LOT-DOCTRINE
CLASS:    RESTRICTED // S-2 EYES
S-2:      VADIK MARMELADOV
REV:      A
================================================================================

Distilled, stable principles written in current lexicon notation. Doctrine is
the compressing brain; session reports are the verbatim record. A finding
graduates here once it has proven stable across sessions — cite the clause
instead of restating the prose.

Bootstrapped 2026-07-16 (LOT-SR-20260716-01), rev A, no clauses yet — this is
the first session to find LOT-LEDGER.md / LOT-LEXICON.md / LOT-DOCTRINE.md
missing from docs/assembly/, despite 77 prior benchmark reports. See the note
in LOT-LEDGER.md. No clause is folded on a single session; the first candidate
below is logged as PROVISIONAL and needs to recur before it graduates.

--------------------------------------------------------------------------------
CLAUSES
--------------------------------------------------------------------------------
[D-001 rev A, PROVISIONAL] On a mutation endpoint shared across event types
               (e.g. PUT /logs/:id gated to event === 'note'): before reusing
               it for a new event type, read the guard clause — a silent
               early-return reads as success to the caller. LOT-SR-20260716-01
               found PUT /logs/:id a no-op for event: 'calendar_entry' and
               routed around it (client-side clear state) rather than widen
               the shared endpoint unreviewed. Needs a second occurrence
               before this graduates from PROVISIONAL.
