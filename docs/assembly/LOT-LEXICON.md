# LOT SYSTEMS — ASSEMBLY LEXICON
Evolving controlled vocabulary. A token is minted only after a concept has
recurred in 3+ prior session reports, or been folded into doctrine twice
(see docs/assembly/LOT-DOCTRINE.md). Tokens are never deleted; superseded
tokens are marked DEPRECATED -> <new token>.

| TOKEN | MEANING                                                        | REV | SINCE            |
|-------|-----------------------------------------------------------------|-----|-------------------|
| P     | Pattern — a numbered behavioral pattern in the QI engine        | A   | LOT-SR-20260802-01 |
| ARCH  | Archetype — a numbered composite user-state classification      | A   | LOT-SR-20260802-01 |
| J     | Journal — cumulative background-job count in the QI engine      | A   | LOT-SR-20260802-01 |

## Bootstrap note (2026-08-02)

Seeded from verified recurrence across the four existing LOT-SR-* session
reports (LOT-SR-20260721-01, LOT-SR-20260725-01, LOT-SR-20260726-01,
LOT-SR-20260727-02), which all use `P###`, `Arch##`, `J##` notation.

The wider docs/assembly/*.md corpus (~90 files, predating this skill's
LOT-SR/ledger convention) appears to use `QIE` (Quantum Intent/Intelligence
Engine version) and `FM` (Field Manual version) with similar recurrence, but
that corpus was not read in full this session — those two are left as plain
words pending a dedicated verification pass, not minted on inference alone.
