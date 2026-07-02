<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# QI·46 Assembly Log — Node 0 — Soul Signal
## LOT® Self-Assembly™ | Session 2026-07-02 | Authorized: S-2 VADIK MARMELADOV

---

## PURPOSE

`docs/corporate/LOT_QI46_ENGINE.md` is the QI·46 self-assembly specification —
the roadmap for a fine-tuned, self-hosted LOT® AI engine (Phase 0–4, Q3 2026
→ Q3 2027). This session does not begin that roadmap. It extracts and wires
the one piece of it that was buildable today, inside the existing stack: the
"soul and emotion" signal that already exists in the Memory Engine's
Calibration Loop, and the voice grammar that calibrates the AI's output
toward the LOT register.

Directive (S-2, verbatim intent): extract the engine based on people's soul
and emotions; use it to calibrate the human with the humanoid output — grace,
poetry, presence, warmth, the established LOT voice.

---

## WHAT ALREADY EXISTED (read before building)

- `EmotionalCheckIn.tsx` ("Biofield Check-In Widget") — captures a
  subscriber's emotional state, one of 22 discrete states (`energized`,
  `grounded`, `flowing`, `depleted`, `heavy`, etc.), persisted server-side as
  `Log{ event: 'emotional_checkin', metadata: { emotionalState } }`.
- `src/server/utils/memory.ts:buildPrompt()` — the real, live Calibration
  Loop. Already assembles `quantumContext`, `plannerContext`, and
  `goalContext` blocks from prior signals before every AI inference call.
  `formatLog()` already renders individual `emotional_checkin` entries into
  the raw log history (since 2026-06-30), but no *aggregate* block existed —
  no place in the prompt said "here is this person's current soul state,
  calibrate to it."
- `chakraErgonomics.ts` — a richer seven-chakra energy model, computed
  client-side from the same intention-engine signals, but never leaves
  `localStorage`. It does not reach `buildPrompt()`. Confirmed by direct
  search: no server POST originates from this store.

---

## WHAT THIS SESSION ADDED

### 1. Soul Signal context block — `memory.ts:buildPrompt()`

Reads the 5 most recent `emotional_checkin` logs, classifies each state as
grounded (`energized, calm, hopeful, fulfilled, grateful, content, peaceful,
excited, grounded, focused, steady, flowing`) or needs-care (everything
else), and injects a calibration block naming the trend and instructing the
engine to meet the subscriber accordingly — gentle and warm if the recent
trend needs care, present and deep if grounded. Inserted into the prompt
immediately after `plannerContext`:

```ts
const fullPrompt = head + quantumContext + plannerContext + soulContext + goalContext + '\n\n' + formattedLogs
```

### 2. LOT Voice Grammar — `memory.ts:buildPrompt()` persona head

Added an explicit instruction block to the system persona, translating
Layer III (Response Grammar) of the QI·46 spec into the prompt that runs
today, on the current AI engine (Together AI primary, Claude fallback — no
model change required):

```
No hedging language. No clinical distance — land in the body, not the head.
One idea per question. Density over sprawl. Never explain what you are
doing. Grace over cleverness, presence over generic advice.
```

This is the calibration of humanoid output the directive asked for — not a
new model, but the existing model constrained toward the LOT register.

### 3. Environment fix (unblocking, unrelated to the above)

`tsconfig.server.json` had `moduleResolution: "node"` and `baseUrl` set,
both deprecated as hard errors under the TypeScript 5.9 shipped in this
environment (`ignoreDeprecations` unset). This was a pre-existing condition
— confirmed present on HEAD before this session's edits — that caused
`npm run server:build` to exit 2 on *every* run, silently, because
`noEmitOnError: false` still emitted JS output despite the error, masking
the failure. Added `"ignoreDeprecations": "5.0"` (the value valid for the
installed TS 5.9.3 — TS 6.0 does not exist yet; an earlier attempt at "6.0"
was wrong and was corrected in this session). This is config-only; no
runtime behavior changes.

`node_modules` was also not installed in this session's environment
(`npm ci` failed outright). Ran `npm ci --legacy-peer-deps` to work around a
pre-existing peer-dependency conflict between root `nanostores@^0.9.0` and
`@nanostores/react@0.4.1` (wants `nanostores@^0.7.0`). This is a real,
unresolved conflict in `package.json` worth fixing properly in a future
session — `--legacy-peer-deps` is a workaround, not a fix.

---

## WHAT WAS NOT BUILT (honest boundary)

No fine-tuning occurred. No new model weights, no self-hosted inference
endpoint, no COSMO® screening node. Phase 0–4 of the QI·46 roadmap remain
entirely ahead. This session extracted a real signal that already existed in
the corpus-in-motion and pointed the current inference call at it — that is
the whole of Node 0. Calling it more than that would be the "made-up precise
metric" the benchmark protocol explicitly warns against.

---

## OPEN ITEM — NAMING COLLISION

`docs/benchmark/LOT-LEXICON.md` already carries the token `QI` (the
operator's `/qi` RFI terminal, minted 2026-06-05) — unrelated to this
engine. `QI·46` reads identically to `QI` without the interpunct. Flagged
for S-2 in the session report; no action taken here (naming decisions stay
with S-2, not the machine).

---

## FILES TOUCHED

```
src/server/utils/memory.ts              MODIFIED — soulContext + voice grammar block
tsconfig.server.json                    MODIFIED — ignoreDeprecations fix (unblocks build)
docs/corporate/LOT_QI46_ENGINE.md       MODIFIED — Section IX, Node 0 documented, v0.2 → v0.3
docs/assembly/2026-07-02_LOT-assembly_qi46-soul-signal-node-0.md   ADDED — this file
```

---

## NEXT SESSION

Wire `chakraErgonomics` to the server as a persisted signal — it is a richer
soul-state read than the six-state emotional check-in and does not yet reach
the Calibration Loop. Then: resolve the `nanostores` peer-dependency
conflict properly (pin one version tree) rather than carrying
`--legacy-peer-deps` forward indefinitely.

---

AUTHORIZED BY: S-2 // VADIK MARMELADOV
LOT SYSTEMS CORPORATION | 2026-07-02
