# QI·46 Assembly Log — Phase 0 — Corpus Assembly
Date: 2026-08-17
Session: scheduled self-assembly (autonomous, no live S-2 present)
Author: Vadik (via scheduled LOT® self-assembly trigger)

## Naming decision (upstream of this session)

S-2 confirmed engine name **QI·46** — Quantum Intelligence Engine, Generation
46, codename SELFWARE — over BIONODE-46, SELFWARE·46, SOMA·46, CARE·OS·46. This
was already the name in place in `docs/corporate/LOT_QI46_ENGINE.md` (v0.2,
2026-05-27) and in the About.tsx self-assembly log (v43, "QI·46 architecture
documented"). No rename was needed; this session confirms the existing name
and begins the first unstarted phase of its own spec.

Note: the trigger referenced a file `LOT_QI-46_ENGINE-2.md`, which does not
exist in the repo. The existing `docs/corporate/LOT_QI46_ENGINE.md` is treated
as the canonical first node — no duplicate file was created.

## Sources read

- `docs/corporate/LOT_QI46_ENGINE.md` — full v0.2 spec (self-assembly manual,
  Phases 0–4, COSMO® gate, corpus source list, tagging schema)
- `docs/benchmark/LOT-MANIFEST.md` — confirms a "QI-46 Engine" feature line
  (cool-tesla lineage, BEST/incorporated) and a Sunday self-assembly protocol
- `src/client/components/About.tsx` — QI·46 already documented in the public
  Field Manual (Row "QI·46", "Calibration Loop", "Soul Disk"; v43 log entry)
- `src/` (grep for QI·46 / calibration loop / cosmoScreen / arc memory) — no
  implementation exists. QI·46 is, to date, a documented specification and a
  public-facing narrative, not running inference code. This session does not
  claim otherwise.

## What was actually built this session

Phase 0 of the spec (§IV) has not been started in the repo — no `/corpus`
tree existed. This session scaffolds it:

- `corpus/README.md` — source tree overview, Checkpoint 0 gate status
- `corpus/TAGGING_SCHEMA.json` — the Step 0.2 tagging schema, as a reusable
  schema file (not applied to any document — there are no documents yet)
- `corpus/{platform,institute,brand,bioelectric,consumables,cosmo}/README.md`
  — one placeholder per spec §IV Step 0.1 source directory, each describing
  what belongs there

Nothing under `src/` was touched. `About.tsx` was deliberately left alone —
per `docs/benchmark/LOT-DOCTRINE.md` WIKI-GUARD, it is master-authoritative
and updated by wiki-scan sessions, not by a single-feature self-assembly pass.

## Explicit scope boundary

The trigger prompt described the QI·46 goal in metaphorical terms ("extract
the engine based on people's soul and emotions," "upload a person's being").
This session treats that language exactly as `LOT_QI46_ENGINE.md` itself
already frames it: the Calibration Loop personalizing on a subscriber's
self-reported and behavioral self-care data (journal entries, session
ratings, consumable feedback, reorder cadence). No literal biometric/soul
extraction or human-calibration capability exists or was built. This is
consistent with the spec's own "Honest Boundaries" doctrine in the LOT
benchmark protocol.

## Tagging summary

0 documents tagged. Schema defined, unpopulated.

## Corpus statistics

0 training pairs. Population (exporting real platform journal/session data,
Institute white papers, brand copy, bioelectric docs, consumable feedback,
COSMO® event logs) is a separate data-engineering task requiring S-2 to
scope what subscriber data may be included — not something to do
unattended.

## Vadik review notes

None yet — this is an unattended scheduled run. Flagging for S-2 review:
whether `corpus/` population should begin, and confirmation that the
Checkpoint 0 HOLD below is the correct posture before any real data is
exported into this tree.

## Gate result

**HOLD** — Checkpoint 0 (spec §IV) requires: all sources catalogued (now
true, structurally), all documents tagged (N/A, none exist), COSMO® cleared
on all examples (N/A), corpus size > 10,000 training pairs (0), JSONL
validated (N/A), Vadik review of ≥100 sample examples (not requested). Per
the Assembly Card: "A failed gate is not a failure. It is a checkpoint
working correctly."

## Next session

S-2 decides whether/what real corpus data to begin exporting into
`corpus/platform/` and `corpus/institute/` first — the two sources with the
most existing material (subscriber journals, CQGS/Quantum Cube white papers)
— before Checkpoint 0 can move toward PASS.
