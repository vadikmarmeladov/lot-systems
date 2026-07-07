# LOT WIKI — v73
**Updated:** 2026-07-07 · Session LOT-SR-20260707-01 · QIE v85
**Previous:** LOT-WIKI-v72.md
**S-2:** VADIK MARMELADOV

---

## LOT® SYSTEM OVERVIEW

LOT Computer is a Quantum Operating System (QOS) — a personal intelligence platform that reads biological, cognitive, and behavioral signals, recognizes patterns, and surfaces adaptive feedback through a military-style interface.

**Core Architecture:**
- **QIE (Quantum Intent Engine)** — 109 patterns, real-time signal recognition
- **Physiological Archetype Classifier** — 37 archetypes, cohort-based self-knowledge
- **WIDGET_DEPENDENCY_MAP** — 148+ nodes, directed acyclic signal graph
- **LOG_DEPENDENCY_SOURCES** — 16 direct-entry pipelines feeding QIE
- **Scheduled Jobs** — 34 background jobs, 24h coverage
- **Military Log Interface** — 109+ handlers, terse block format

---

## QIE PATTERN REGISTRY — v85

### P107 — physiological-renewal-cycle *(new v85)*
Full same-day biological renewal arc. Depleted/low energy → 3+ selfcare acts → moderate/high energy + positive mood within one calendar day. Complete biological cycle confirmed. Conf 0.78–0.92. Widget: selfcare.

### P108 — operator-anchor *(new v85)*
7+ consecutive calendar days each with at least 1 signal. Commitment confirmed across the full week. Longevity metric — complements P80 signal-depth. Conf 0.72–0.88. Widget: systemProgress.

### P109 — integrated-recovery-map *(new v85)*
Selfcare + energy + mood all tracked on 5+ of last 7 calendar days. Full-resolution physiological map active — all three biological channels present across the week. Breadth metric. Conf 0.75–0.90. Widget: systemProgress.

**Total: 109 patterns (P1–P109)**

---

## PHYSIOLOGICAL ARCHETYPE REGISTRY — v85

### Arch37 — Recovery Architect *(new v85)*
- **energyBands:** depleted, low, moderate
- **dominantSources:** selfcare, energy, mood
- **patternConditions:** physiological-renewal-cycle, biological-restoration-peak, recovery-initiation, care-momentum
- **directive:** Full renewal arc confirmed. Depleted → restored within one day — this is the recovery architecture in action. Protect and repeat this cycle.

**Total: 37 archetypes (Arch1–Arch37)**

---

## SCHEDULED JOBS — v85

### J34 — daily-physiological-renewal-check *(new v85)*
- **Schedule:** 21:00 UTC daily
- **Logic:** Per-user today-window scan. Finds depleted/low energy onset → counts selfcare after depletion → confirms moderate/high energy recovery → confirms positive mood after recovery. All four gates → writes `physiological_renewal_cycle` event (fromBand · toBand · selfcareCount).
- **Output:** `physiological_renewal_cycle` log event

**Total: 34 background jobs (J1–J34)**

---

## WIDGET_DEPENDENCY_MAP — v85 (148+ nodes)

New nodes added 2026-07-07:
- `physiologicalRenewalNode` → selfcare, energy, mood, log
- `operatorAnchorNode` → log, intentions, mood, energy, selfcare, journal, memory, planner
- `integratedRecoveryNode` → selfcare, energy, mood

**Total: 148+ dep nodes**

---

## LOG HANDLERS — v85 (109+)

New handlers added 2026-07-07:
- **PHYS-RENEW:** (`physiological_renewal_cycle`) — FROM/TO energy band · CARE-OPS count · CYCLE: COMPLETE
- **OPR-ANCH:** (`operator_anchor`) — DAYS consecutive · STATUS: ANCHORED
- **INT-RECOV:** (`integrated_recovery_map`) — FULL-DAYS · CHANNELS: CARE+NRG+MOOD · MAP: ACTIVE

**Total: 109+ handlers**

---

## PATTERN_DISPLAY MAP — v85

QuantumEngineWidgets.tsx PATTERN_DISPLAY entries (25 total):

| Pattern                     | Display        |
|-----------------------------|----------------|
| physiological-renewal-cycle | PHYS RENEW     |
| operator-anchor             | OPR ANCHOR     |
| integrated-recovery-map     | INT RECOV      |
| vitality-cascade            | VIT CASCADE    |
| social-presence-arc         | SOC PRES       |
| clarity-momentum-peak       | CLAR PEAK      |
| resilience-cascade          | RES CASCADE    |
| planner-intention-sync      | PLAN-INTENT    |
| quantum-presence-arc        | QPRES ARC      |
| *(+ 16 prior entries)*      |                |

---

## SYSTEM COUNTERS — v85

| Metric               | Count |
|----------------------|-------|
| QIE Patterns         | 109   |
| Archetypes           | 37    |
| Background Jobs      | 34    |
| Log Handlers         | 109+  |
| Dep Map Nodes        | 148+  |
| Log Sources          | 16    |

---

## COCKPIT-RULE

Every new pattern gets a corresponding log handler. Enforced since v82. Current compliance: 109 patterns / 109+ handlers — full coverage.

---

## BRANCH STATUS — 2026-07-07

- **Development branch:** `claude/upbeat-curie-5vgdzo`
- **Parallel track:** `claude/quantum-engine-widgets-RgFfC` (v87, P107–P112 with different pattern names)
- **Note:** Pattern number renaming may be needed on merge; S-2 to resolve.

---

*End LOT-WIKI-v73 · AUTHORIZED BY S-2 // VADIK MARMELADOV*
