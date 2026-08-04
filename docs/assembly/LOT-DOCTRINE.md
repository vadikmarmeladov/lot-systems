# LOT SYSTEMS — ASSEMBLY DOCTRINE
Distilled, stable principles, written in current lexicon notation where a
token exists. Doctrine compresses; session reports (docs/benchmark/) stay
verbatim. Revision letter bumps when principles are meaningfully
reorganized — not on every append.

REV: A
BOOTSTRAPPED: LOT-SR-20260804-01

--------------------------------------------------------------------------------

[D-001 rev A]  On GATE: no artifact advances past CHECK-B while red. Fix-and-
               recheck loop until GATE reads GREEN; if unrecoverable, PLAN B —
               reset to the last green benchmark tag and record the rollback
               as a legitimate, non-concealed outcome. Observed at every
               session in the corpus back through LOT-SR-20260601-01.

[D-002 rev A]  On unattended notification logic (e.g. calendar/reminder
               signals fired into Log without a human confirming each one):
               scope the fire window narrowly (exact trigger day only, not
               "any day at or past threshold") so first deployment never
               backfill-floods the Log with alerts for pre-existing state.
               Established LOT-SR-20260804-01 (calendar due/overdue alerts).
