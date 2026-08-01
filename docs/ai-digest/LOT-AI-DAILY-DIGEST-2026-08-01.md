<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® AI Daily Digest — 2026-08-01

Scheduled documentation/brand review. Scope: `lot-systems.com/about`, this repository, `brand.lot-systems.com`, `institute.lot-systems.com`.

---

## 1. Access status — external sites blocked

All three external URLs requested for this review returned **403** at the network layer before any page content was retrieved:

| Host | Result |
|------|--------|
| `lot-systems.com/about` | Blocked — egress policy denial (CONNECT rejected, 403) |
| `brand.lot-systems.com` | Blocked — egress policy denial (CONNECT rejected, 403) |
| `institute.lot-systems.com` | Blocked — egress policy denial (CONNECT rejected, 403) |

This is this environment's outbound-network allowlist rejecting the destination hosts, not a site-side error — the failure is logged proxy-side as `connect_rejected` with no page ever served. Per this environment's operating rules, policy denials are reported rather than retried or routed around.

**If daily review of these three domains is meant to include live site content, `lot-systems.com`, `brand.lot-systems.com`, and `institute.lot-systems.com` need to be added to this environment's network allowlist.** Until then, this digest is sourced entirely from the repository.

---

## 2. What was reviewed instead

In lieu of the live sites, this pass covers the repo's own brand/product corpus:

- `docs/corporate/LOT-AI-PRODUCT-BRIEF.md` (v1.0, June 2026)
- `docs/corporate/LOT_ROBOTICS_COSMO.md` (May 25, 2026)
- `docs/technical/LOT-STYLE-GUIDE.md` (v1.0, January 2026)
- `docs/corporate/LOT_FMCG_SUBSCRIPTION_PLAN_2027.md`
- `docs/corporate/LOT_DESIGN_LAB_SUMMER_2026.md`
- `docs/wiki/LOT-WIKI-v82.md` + `docs/SESSION_REPORT_2026_07_27_WIKI_v82.md` (latest wiki/session state on `master`)
- `docs/technical/LOT_SYSTEMS_BRIEF.md` (v3.2)

No commits landed on `master` since the last wiki sync (2026-07-27); the state below is current as of today.

---

## 3. LOT® AI ecosystem — key points on file

From the Product Brief: LOT® AI is positioned as the public face of the **Quantum Intent Engine (QIE)**, running on a five-step **Compression Loop**:

```
LOG → OBSERVE → COMPRESS → ASK → COMPRESS AGAIN
```

- **Weekly Story-Report**: a first-person narrative export (`GET /api/story/latest`, `POST /api/story/:week_id/export {target: robot|vehicle|dashboard}`).
- **Applied domains**: LOT® Self-Care (primary), LOT® Quantum IoT (hardware sensor fusion), LOT® Quantum Systems / Community Sync / LOT® Email.
- **Paid tiers**: R&D ($15/mo), Usership ($99/mo), Legacy ($3,564/3yr), Admin ($11,000/9yr).
- **Design principles**: no unprompted notifications, one question at a time, behavioral over declarative signal, private-by-default context.

Latest engineering state per wiki v82 (2026-07-27): Field Manual v107, **136 QIE patterns** (+3: P134 INTARC, P135 DREC, P136 QFIELD), **46 physiological archetypes** (+1: Arch46 Quantum Field Operator), **43 background jobs** (+1: J43), 175+ dependency-graph nodes, 719 badges, Day 1064+.

---

## 4. Design System / COSMO® Style — local snapshot

`docs/technical/LOT-STYLE-GUIDE.md` (v1.0, last updated January 2026 — **7 months old relative to today**) documents the current design language: system-default monospace typography, an opacity hierarchy (90/60/40), a fixed spacing scale (`mb-16`/`mb-12`/`gap-8`/`gap-y-24`), no decorative color, no emoji, and the "click-label-to-cycle-view" interaction pattern used across widgets.

**Could not verify this against `brand.lot-systems.com`** (blocked, see §1) — if the hosted Design System / COSMO® Style guide has moved past v1.0, this local copy is stale and worth a diff once site access is restored.

---

## 5. The Coffee → Widget → Subscription → Design System → Style → Community flow

This exact sequence does not appear verbatim anywhere in the repository (`docs/`, `src/`), and it wasn't reachable on the brand/institute sites today (§1) — so this can't be confirmed as a real, named flow versus a one-off phrasing. Closest local analogues, in case it's a paraphrase of the existing user journey:

- **Coffee** — no literal match; closest is the "go-to morning beverage" self-care/journal prompt style and the "essentials, delivered" positioning in `LOT_ONELINERS` (`src/client/entries/login.tsx`).
- **Widget** → **Subscription** — matches the real product funnel: free widget usage → Usership subscription ($99/mo) documented in `LOT-AI-PRODUCT-BRIEF.md` and the FMCG plan.
- **Design System** → **Style** — matches `LOT-STYLE-GUIDE.md` (§4).
- **Community** — matches the "Community Sync" domain in the Product Brief (§3) and `CohortConnectWidget.tsx` / community-pulse pattern in the QIE pattern registry.

Not resolving this further without site access rather than guessing at a "solved" answer — flagging as open pending `brand.lot-systems.com` / `institute.lot-systems.com` access.

---

## 6. LOT® Robot Persons™ / COSMO® capabilities

No file uses the exact term "Robot Persons™." The closest and most current material is `docs/corporate/LOT_ROBOTICS_COSMO.md`, which describes:

- **COSMO® Soul Sync Protocol** — compresses a user's QIE behavioral signature (52 patterns, 16 archetypes, 10-D user index) into a portable profile a COSMO® robot unit "carries."
- **Benchmark Arbitrage® gate** — a robot only activates against a user profile that has reached **Purple tier (60–79)** or higher on the Quantum Success Benchmark; White/Green tier users are not eligible.
- Ethical framework: no data resale, consent required, no gate-lowering, no weapons/surveillance use, no parent-replacement.
- Revenue roadmap ties COSMO® hardware to 2028–2029, gated behind the current software Benchmark/Usership phase.

This is the same COSMO® robotics vision as before — no version bump or capability change versus what's already in the repo.

---

## 7. Flags for current projects/integrations

- **Network allowlist**: this environment cannot reach `lot-systems.com`, `brand.lot-systems.com`, or `institute.lot-systems.com`. If future daily runs of this review are meant to pull live site content, those three hosts need to be added to the environment's egress allowlist — otherwise every run will silently degrade to a repo-only review like this one.
- **Sensitive content in version control**: `docs/corporate/LOT_Medical_Records.md` and `docs/corporate/LOT_PTSD_Protocol.md` appear to contain personal health/medical-record-style content committed in plaintext to this repository. Worth double-checking repo visibility and access controls (or moving this content out of version control entirely) before this repo is shared, made public, or connected to any external integration.
- No breaking changes to the AI engine, API contracts, or widget architecture were found in this pass — QIE/Field Manual state is incrementing normally (v106 → v107) and matches the last committed session report.

---

*Generated by an automated daily documentation/brand review task. Source: repository contents only — external site content could not be retrieved (see §1).*
