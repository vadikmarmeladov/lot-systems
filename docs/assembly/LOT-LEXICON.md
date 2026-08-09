# LOT SYSTEMS — LEXICON

Evolving controlled vocabulary for the Benchmark protocol's session reports.
A token is minted only after its concept has recurred across 3+ prior session
reports, or has been folded into doctrine twice (see
docs/assembly/LOT-DOCTRINE.md and the lot-benchmark skill's SELF-ASSEMBLY
reference). Tokens are never deleted — a superseded token is marked
`DEPRECATED -> <new token>` so old reports stay legible verbatim.

Bootstrapped 2026-08-09 (LOT-SR-20260809-01) — first run of this file. Seeded
only with tokens that already recurred well past the minting threshold across
the existing docs/ corpus (counts taken via grep across docs/ at bootstrap
time); no vocabulary was invented to fill the file.

| TOKEN    | MEANING                                                              | REV | SINCE          |
|----------|-----------------------------------------------------------------------|-----|----------------|
| QIE      | Quantum Intent Engine — the context/signal engine feeding widget state, badges, and per-log context assembly (getLogContext) | A | 20260809-01 |
| GATE     | The CHECK-B green-gate decision point (pipeline step 04) — no artifact advances past it red | A | 20260809-01 |
| USERSHIP | The paid-member flag (`req.user.tags` contains `usership`) gating premium AI features — /story, /prayer, etc. | A | 20260809-01 |
| SELF-ASM | The append-only ledger + evolving lexicon/doctrine layer distilled at the close of every Benchmark session | A | 20260809-01 |
