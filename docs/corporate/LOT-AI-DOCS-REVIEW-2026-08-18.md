<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® AI Documentation & Brand Review — 2026-08-18

**Type:** Scheduled daily documentation/brand sync
**Prepared by:** Claude Code (automated scheduled task)
**Scope:** lot-systems.com/about · institute.lot-systems.com · brand.lot-systems.com · repository (`LOT-Computer`)

---

## 1. External sites — NOT reachable this run

All three requested external sources returned `EGRESS_BLOCKED` from this session's network egress proxy:

| Source | Result |
|---|---|
| `lot-systems.com/about` | Blocked — domain not permitted by egress policy |
| `institute.lot-systems.com` | Blocked — domain not permitted by egress policy |
| `brand.lot-systems.com` | Blocked — domain not permitted by egress policy |

No papers, resources, or brand-standard updates could be pulled from the live sites in this run. This is a session/network-policy limitation, not a content-side failure — if this task is meant to run daily against the live sites, the environment's egress allowlist needs `lot-systems.com`, `institute.lot-systems.com`, and `brand.lot-systems.com` added, or the source material needs to be mirrored into the repo instead.

Repo search confirms neither `institute.lot-systems.com` nor `brand.lot-systems.com` is referenced anywhere in-repo except as a footer credit (`Made in the USA | brand.lot-systems.com`) — there is no cached/mirrored copy of those sites to fall back on.

## 2. Fallback: in-repo documentation review

With external access unavailable, this run reviewed the repository's own corporate/brand/technical docs as the closest available proxy for "LOT® AI documentation and brand materials."

**Most recently touched corporate docs:**
- `docs/corporate/LOT-CUBIQ-QUANTUM-CUBE-v0.md` (2026-07-28) — v0 actuated haptic notification device spec
- `docs/corporate/LOT-AMBIENT-AI-VISION.md` (2026-06-30) — Ambient AI™ vision: UX therapy, QIoT™, LOT® Station + Brush hardware
- `docs/corporate/LOT-FEATURE-INVENTORY-2026.md` / `LOT-AI-PRODUCT-BRIEF.md` (2026-06-29) — no changes since last review

**Design System / Style guidance in-repo** (`docs/technical/LOT-STYLE-GUIDE.md`): version 1.0, dated January 2026, marked "Stable Reference" — unchanged since last check. Covers typography, opacity hierarchy, spacing scale, and interaction patterns (e.g. click-to-cycle widget labels). No version bump found, so nothing to reconcile against `brand.lot-systems.com` this run (which couldn't be reached anyway).

**COSMO® / Robot Persons** (`docs/corporate/LOT_ROBOTICS_COSMO.md`, dated 2026-05-25): describes COSMO® as LOT Systems' personal robotics line — a robot that inherits its owner's "behavioral signature" captured via the Quantum Intent Engine, gated on a verified LOT profile. No newer robotics doc found in this pass.

**Product state markers found in `src/client/components/About.tsx`** (last touched 2026-08-04): Field Manual v113, 151 QIE patterns, 51 archetypes, 48 background jobs, Day 1072+ since LOT® founding-anchor tracking began.

## 3. The Coffee → Widget → Subscription → Design System → Style → Community flow / LOT® Robot Persons™

Could not verify or update against `brand.lot-systems.com` (blocked, see §1). A repo-wide search found no document that spells out that exact flow name; the closest matches are the general widget ecosystem (`Widget Ecosystem` section in `About.tsx`) and the `SubscribeWidget` component. No literal "LOT® Robot Persons™" term exists in-repo — the closest concept is **COSMO®** (§2). Flagging as unresolved rather than guessing at intent.

## 4. Impact on current projects/integrations

No brand or API changes detected that would affect current LOT-Computer integrations, since no external update could be fetched this run. Nothing actionable to change in the codebase today.

## 5. Recommendation

- Grant this scheduled task's environment egress access to `lot-systems.com`, `institute.lot-systems.com`, and `brand.lot-systems.com`, or provide an alternate authenticated/internal path to that content, so future runs can actually diff against the live brand/docs sites rather than only the repo's own snapshot.
- If "Coffee → Widget → Subscription → Design System → Style → Community" and "LOT® Robot Persons™" are terms from the (currently unreachable) brand site, confirm intended meaning so future reviews can track them explicitly.
