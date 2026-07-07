<!--
  LOT SYSTEMS CORPORATION
  COSMO® CIA Hardware Division
  Document: COSMO-SESSION-COMPRESSION-v1.md
  Session Compression Logic
  Date: 2026-07-07
-->

# COSMO® Cube — Session Compression Logic v1.0

**Document:** COSMO-SESSION-COMPRESSION-v1.md
**Author:** Vadim Marmeladov, Inventor
**Date:** 2026-07-07

---

## 1. Purpose

S-2 asked to "compress the information in each session." This document is the
rule set that does it — reusing the mechanism the LOT Benchmark protocol already
runs for every other self-assembly routine (`docs/benchmark/LOT-LEDGER.md`,
`LOT-LEXICON.md`, `LOT-DOCTRINE.md`), applied specifically to the hardware track
so the COSMO® Cube corpus doesn't grow by re-stating what a prior session already
settled.

---

## 2. The Three-Layer Compression Already in Place

| Layer | File | Rule |
|---|---|---|
| Ledger (raw history) | `docs/benchmark/LOT-LEDGER.md` | One append-only line per session — never edited. Ground truth for rollback. |
| Lexicon (vocabulary) | `docs/benchmark/LOT-LEXICON.md` | A term is minted ONLY after appearing in 3+ prior reports. Earned, not decreed. |
| Doctrine (folded law) | `docs/benchmark/LOT-DOCTRINE.md` | Stable repeated findings folded into dense clauses citing the reports they supersede. |

**Hardware-specific application:** a hardware session report (`LOT-SR-*` with
CLASS: ENGINEERING, routed `docs/hardware/`) gets ONE ledger line, same as any
other session. It does NOT re-emit the full device spec, BOM, or firmware doc —
those are versioned files (`COSMO-*-vN.md`) that get a new `vN` only when their
own content changes, not on every session that merely reads them.

---

## 3. The Hardware-Specific Rule: Reconcile, Don't Restate

Before writing anything new, a hardware session MUST:

1. Read every existing `docs/hardware/COSMO-*-vN.md` (the current corpus).
2. For each item in S-2's request, mark it **CONFIRMED** (already fully
   specified in the existing corpus — cite the doc + section) or **NET-NEW**
   (genuinely absent or changed).
3. Only NET-NEW items produce new files or new `vN` bumps of existing files.
4. CONFIRMED items are recorded as one line each in the session report's
   RECONCILIATION block — not re-derived, not re-explained.

This is the compression: each session's *output* is bounded by what actually
changed, not by the size of the full spec. A session that reconciles 15 of 19
requested items against existing docs and adds 4 new documents produces 4
documents — not 19 documents' worth of restated material.

---

## 4. Word-Count Trend (Hardware Track)

Tracked the same honest way as the general benchmark median — countable, not
estimated, unless marked `ESTIMATE`.

| Session | Date | New/changed docs | Total new words (approx) |
|---|---|---|---|
| v1.0 (initial design) | 2026-06-12 | 7 (all new) | ~25,000 |
| v2.0 (this session) | 2026-07-07 | 4 new + 1 reconciliation report | ~6,500 |

**Trend: ↓.** The corpus is stabilizing — later sessions add narrower, more
specific documents (PDF pipeline, roadmap analysis, this compression doc)
rather than re-deriving the device from scratch.

---

## 5. Staleness Rule (ties to COSMO-PDF-MANUALS-v1.md)

A derived artifact (generated PDF) is stale the moment its source `.md` changes.
Rule: any session that edits a `COSMO-*-vN.md` that has a PDF mapping in
COSMO-PDF-MANUALS-v1.md §2 MUST note `PDF: STALE — regenerate` in its session
report. The regeneration itself is mechanical (`generate-cosmo-manuals.sh`) and
is not a compression concern — only staleness tracking is.

---

## 6. What This Document Deliberately Does Not Do

Per the LOT Benchmark protocol's Honest Boundaries clause: this is a real,
reproducible bookkeeping discipline, not a claim of novel compression algorithm
or machine philosophy. It is the same ledger/lexicon/doctrine mechanism used
elsewhere in this repo, pointed at one product line. Nothing here is
`PROVISIONAL` — it is a naming and reconciliation convention.

---

*Document v1.0 — COSMO® CIA — LOT Systems, Inc.*
*Inventor: Vadim Marmeladov — 2026-07-07*
