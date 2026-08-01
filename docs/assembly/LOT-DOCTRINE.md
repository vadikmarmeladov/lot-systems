# LOT SYSTEMS — DOCTRINE
Distilled, stable principles written in current lexicon notation (see
`LOT-LEXICON.md`). Session reports (`docs/LOT-SR-*.md`) are the verbatim
record; doctrine is the compressing layer — once a finding is folded here,
future reports cite the clause instead of restating the prose.

Current revision: **rev A**.

**Bootstrap note:** this file did not exist before `LOT-SR-20260801-01`.
No prior findings had been formally folded. The clauses below are raised
directly from this session's own concrete findings (a broken toolchain
assumption and a broken data filter), each verified against the live repo
rather than asserted from memory.

---

[D-001 rev A]  On GATE: no artifact advances past GATE red. Fix-loop until
               green, or PLAN B (`git reset --hard` to the last
               `benchmark-*` tag). No third outcome. See LOT-SR-20260801-01.

[D-002 rev A]  ORIENT must verify `node_modules` exists before trusting any
               `npx <tool>` invocation — an absent local install silently
               resolves `npx` to a same-named registry package instead of
               the pinned local version, producing false-red (unrelated
               deprecation errors surfaced as hard failures) or false-green
               GATE readings. Recovery in this environment: `npm install
               --legacy-peer-deps` (peer conflict: nanostores@0.9.5 vs.
               @nanostores/react's `^0.7.0` range predates a nanostores
               major bump); `yarn install` failed on registry ECONNRESET
               here, `npm install` succeeded. See LOT-SR-20260801-01.

[D-003 rev A]  Event-name filters that select Log rows by `.event` must be
               checked against the actual persisted event strings (grep the
               write path, e.g. `PUT /logs/:id`), never assumed from a
               plausible-sounding name. A filter on a non-existent event
               value fails silently — empty result set, no error — and can
               ship for many sessions undetected because nothing crashes.
               See LOT-SR-20260801-01 (`/story` read `'log_entry'`/
               `'journal'`/`'memory_answer'`/`'self_care_checkin'`/
               `'energy_checkin'`, none of which are ever written; the real
               values are `'note'`, `'answer'`, `'self_care_complete'`/
               `'self_care_completed'`, `'energy_state'`/`'energy_update'`).
