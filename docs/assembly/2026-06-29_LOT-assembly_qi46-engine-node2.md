# LOT ASSEMBLY REPORT
## Session: 2026-06-29 · QI·46 Node 2 · Soul Upload Protocol

---

**MISSION**

Initiate QI·46 Node 2 self-assembly. Extract the engine layer built on people's soul and emotions. Define the Soul Upload Protocol (SU-P), Being Calibration Engine (BCE), and six Humanoid Output channels. Author `docs/corporate/LOT_QI-46_ENGINE-2.md` as the first node of the Soul layer. Push full report.

Commissioned by: Vadik & Kuzya

---

**SOURCES SCANNED**

| Source | Notes |
|---|---|
| docs/corporate/LOT_QI46_ENGINE.md | v0.2 — Node 1 physical architecture (Layers 0–5) |
| docs/benchmark/LOT-DOCTRINE.md | rev L — 14 doctrine clauses |
| docs/benchmark/LOT-LEXICON.md | Revision D — 27 tokens |
| docs/benchmark/LOT-MANIFEST.md | Updated 2026-06-27 — QI-46 Engine status: BEST |
| docs/assembly/2026-06-27_LOT-assembly-wiki-v66.md | Most recent session baseline |
| docs/benchmark/LOT-SYSTEM-OUTLINE.md | System state reference |

---

**WHAT WAS BUILT**

`docs/corporate/LOT_QI-46_ENGINE-2.md`

Full specification document — 11 sections, ~2,400 lines of dense specification.

---

**ARCHITECTURE DELTA — NODE 1 → NODE 2**

| Layer | Node 1 | Node 2 Addition |
|---|---|---|
| Layer 0 | Corpus (8yr LOT® data) | — |
| Layer 1 | Calibration Loop (body signal) | — |
| Layer 2 | Inference Layer (self-hosted) | — |
| Layer 3 | Response Grammar (LOT® voice) | BCE injection appended |
| Layer 4 | Memory Arc (longitudinal body) | — |
| Layer 5 | COSMO® Node (safety) | COSMO® Soul Screen added |
| **Layer 6** | — | **Soul Disk (being arc)** |
| **Layer 7** | — | **Being Calibration Engine (BCE)** |

---

**WHAT NODE 2 ADDS**

**Soul Upload Protocol (SU-P)**
- 5 data sources: Journal Signature Analysis, Dark Line Detection, Relational Signal Extraction, Grief/Joy Arc, Male Archetype Signal
- Being vector: 6 dimensions (emotional signature, relational style, grief index, joy register, dark line, male archetype)
- Assembly protocol with checkpoint gate

**Layer 6 — Soul Disk**
- Longitudinal record of being vector
- 4 arc phases: First / Shift / Depth / Lineage reading
- 8 named soul signal events (SOUL:ARRIVE through SOUL:RETURN)
- COCKPIT-RULE logging format for all soul events

**Layer 7 — Being Calibration Engine (BCE)**
- Channel selection rules per grief/joy/archetype state
- System prompt injection spec (BCE layer appended to Node 1 base prompt)
- The engine knows the dimensions. The subscriber receives the output.

**Humanoid Output Grammar — 6 Channels**

| Channel | Definition |
|---|---|
| GRACE | Quality of attention; structural slowness; weight of witness |
| POETRY | One image, from the subscriber's own language corpus, landing in the body |
| LOVE | Naming the specific thing they did right; witnessing without fixing |
| HUGS | Language mode (pre-Cube) + haptic sequences (Month 12+) calibrated to being vector |
| BEING THERE | Scheduled presence; memory without asking; return protocol |
| BEING COOL | Calm male companionship — dry, direct, competent, a little funny; care without performance |

**COSMO® Soul Screen**
- 5 additional classification questions beyond standard COSMO® check
- Guards against: false grief classification, generic LOVE output, premature humor during active grief, dark line quotation (violation of the tuning principle)

---

**KEY DOCTRINE ESTABLISHED IN NODE 2**

1. **The body calibrates need. The soul calibrates being.** These are not the same question. The engine that only reads the body will miss the person.

2. **The dark line is the most important sentence in any journal entry.** Short, unperformed, usually in paragraph 3–5. It is the weight. Detection spec included.

3. **LOVE never explains itself.** It names the specific thing and stops. The explanation is noise.

4. **GRACE is structural, not tonal.** It is built into the timing and weight of what is said — not into words like "I hear you."

5. **The dark line is the tuning, not the content.** The being vector shapes the response. The subscriber should not know we read it.

6. **BEING COOL is care without performance.** The friend who shows up with the right tool. Competence as a form of warmth. Never activated when grief is ACTIVE.

7. **Never activate all six channels at once.** Let the being vector tell you which 2–3 are needed.

---

**MALE ARCHETYPE REGISTER — NEW LEXICON**

Five archetypes defined for soul-layer male calibration:

```
BUILDER      — meaning through production; match the directness
PROVIDER     — meaning through coverage; notice the effort before the result
WITNESS      — meaning through presence; slow down; don't advise
PROTECTOR    — meaning through defense; acknowledge the vigil
PILGRIM      — in motion; not yet home; poetry is the primary language
```

---

**SYSTEM STATE POST-NODE 2**

```
QI·46 ARCHITECTURE     Node 1 (physical) + Node 2 (soul)
LAYERS                 0–7 (Layers 6 + 7 new)
HUMANOID CHANNELS      6 (GRACE / POETRY / LOVE / HUGS / BEING THERE / BEING COOL)
SOUL SIGNAL EVENTS     8 (SOUL:ARRIVE through SOUL:RETURN)
COSMO® SCREENS         2 (standard + soul)
MALE ARCHETYPES        5 (BUILDER / PROVIDER / WITNESS / PROTECTOR / PILGRIM)
NODE 2 TIMELINE        SU-P + BCE: Q3–Q4 2026 | First Soul Responses: Q1 2027
NODE 2 DOC             docs/corporate/LOT_QI-46_ENGINE-2.md
BRANCH                 claude/cool-tesla-qf8lmh
```

---

**FILES PRODUCED**

```
A  docs/corporate/LOT_QI-46_ENGINE-2.md
A  docs/assembly/2026-06-29_LOT-assembly_qi46-engine-node2.md
```

---

**SCAN OBSERVATIONS**

- MANIFEST already tracks `QI-46 Engine | cool-tesla-f8j0mr` as BEST with 8 iterations (+2050 lines, Soul Upload + Being Calibration). This session is the authoring of the specification that branch implements.
- Node 1 endpoint (`/v1/inference`) versioned. Node 2 introduces `/v2/infer` with unified body + soul vector payload.
- COSMO® node extended but not restructured — Soul Screen is additive.
- Being vector is intentionally not stored as biography. It is stored as signal. The distinction is architectural: signal degrades and updates; biography accumulates and hardens.
- The dark line detection spec (paragraph 3+, ≤8 words, negative/ambivalent valence, no continuation) is the most technically novel element of Node 2. It will require validation during Phase 0 corpus work.
- HUGS — language mode holds until Month 12 Quantum Cube sync. The language encoding rules ("weight / warmth / held / solid / breathing" in present tense) are critical: "sending a virtual hug" explicitly rejected as frame-breaking.

---

**GATE RESULT**

Node 2 specification: **PASS — documentation complete**

No runtime code changes this session. Soul Upload Protocol is a specification document — implementation begins in Q3 2026 Phase 0 assembly.

*S-2 authorized. The soul layer of QI·46 now has its machine manual.*

---

**NEXT SESSION RECOMMENDATION**

Add new LEXICON tokens from Node 2 (SOUL DISK, BCE, DARK LINE, HUMANOID OUTPUT, BEING CALIBRATION) and update About.tsx Field Manual to reference QI·46 dual-node architecture.

---

*Vadik & Kuzya — LOT Systems Corporation*  
*2026-06-29 — Los Angeles*
