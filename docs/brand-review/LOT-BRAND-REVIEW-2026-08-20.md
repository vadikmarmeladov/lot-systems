<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® AI Documentation & Brand Review — 2026-08-20

**Type:** Scheduled daily documentation/brand sync
**Scope:** lot-systems.com/about, brand.lot-systems.com, institute.lot-systems.com, and this repository

---

## 0. Access Status (read this first)

This run could **not** reach any of the three requested external hosts:

| URL | Result |
|---|---|
| `https://lot-systems.com/about` | `EGRESS_BLOCKED` — this environment's network egress proxy blocks `lot-systems.com` |
| `https://brand.lot-systems.com` | `EGRESS_BLOCKED` — same proxy policy blocks the `brand.` subdomain |
| `https://institute.lot-systems.com` | `EGRESS_BLOCKED` — same proxy policy blocks the `institute.` subdomain |

Web search (not direct fetch) surfaced only generic, unrelated results plus one indexed snippet for `brand.lot-systems.com` ("Usership — LOT Systems": a founding-supporter program with convertible-stock/equity contributions, Dashboard access, magazine + product subscriptions, community events, and "exclusive AI features for the team"). No content could be pulled from `institute.lot-systems.com` at all — the "first node" and its Coffee → Widget → Subscription → Design System → Style → Community puzzle could not be verified this run.

**Nothing below about the live sites is confirmed.** Sections 1–3 are drawn entirely from what's already committed in this repository (`docs/technical/LOT_SYSTEMS_BRIEF.md`, `docs/technical/LOT-STYLE-GUIDE.md`, `docs/wiki/LOT-WIKI-v87.md`, `README.md`). If this environment's egress policy is expected to allow `lot-systems.com`, that's worth checking — see §4.

---

## 1. Repo-internal product summary (LOT_SYSTEMS_BRIEF.md, v3.2, last updated June 11 2026)

- **LOT (Layers of Time)** is described internally as a personal behavioral operating system / self-care companion — not, per the repo's own docs, an "AI programming language." (See §4 — the scheduled task's phrasing doesn't match internal terminology and should be confirmed against the live site.)
- Core engine: **Quantum Intent Engine™ (QIE)** — pattern recognition over behavioral signals. Brief cites QIE v54 (65 patterns, 19 archetypes, 93-node graph) as of its June 2026 revision; the newer in-repo wiki (`LOT-WIKI-v87`, Aug 5 2026) shows the engine has since advanced well past that — 148 patterns, 50 archetypes — so the Brief document itself is stale relative to the wiki and due for a refresh.
- Monetization: Usership tier ($50/mo), R&D early-access tier, free tier.
- Stack: React 18 + TypeScript, Nanostores, TailwindCSS, Vite / Node.js + Fastify, PostgreSQL, Claude (Anthropic) for generation, SSE for realtime.
- README frames LOT as "a subscription service that distributes digital and physical necessities, basic wardrobes, organic self-care products, home and kids essentials," with the Memory Engine as the differentiator.

## 2. Repo-internal design system (LOT-STYLE-GUIDE.md, v1.0, January 2026)

Key standing conventions (unchanged as far as this repo shows): opacity hierarchy (90/60/40), `mb-16`/`gap-8` spacing scale, no emojis, periods over checkmarks/exclamation points, clickable-label view-cycling pattern, 3s-visible + 1.4s-fade widget dismissal, database-over-localStorage for any cross-device state, 2–3 buttons per group max, no gamification beyond the existing Aquatic Evolution badge tiers (droplet/wave/current). No version bump beyond 1.0 is recorded in-repo since January 2026 — could not confirm whether `brand.lot-systems.com`/COSMO® Style has since diverged from this document.

## 3. "Coffee → Widget → Subscription → Design System → Style → Community" flow, and Robot Persons™

Not documented anywhere in this repository under that name, and the live site couldn't be reached to check it directly. The closest matches in-repo:
- **Widget → Subscription**: the product is widget-based (Memory, Planner, Self-care, etc.) with a Usership subscription gate — matches the shape of the puzzle.
- **Coffee**: no reference found in-repo (searched constants, recipe widget, About page).
- **Design System → Style**: matches `docs/technical/LOT-STYLE-GUIDE.md` directly.
- **Community**: README/Brief mention "Community Bridge" as one of the 15 self-assembled cognitive modules, and "community features (cohort matching)" as a Q1 2026 roadmap item.
- **LOT® Robot Persons™**: no occurrence of this term anywhere in the repository (source, docs, or wiki). This appears to be new brand vocabulary from the external site that hasn't landed in the codebase yet — flag for follow-up once `institute.lot-systems.com` is reachable.

## 4. Flags for the user

1. **Network egress to lot-systems.com is blocked in this session's sandbox.** If daily brand/doc reviews are meant to actually read the live site, the environment's egress allowlist needs `lot-systems.com`, `brand.lot-systems.com`, and `institute.lot-systems.com` added — otherwise every run of this task will only be able to report on what's already in the repo, as this one did.
2. **Terminology check:** the task brief calls this "the LOT® AI programming language." Every internal doc (Brief, Style Guide, Wiki, README) describes LOT as an operating system / self-care platform, not a programming language. Worth confirming which framing is current before it propagates into more docs.
3. **LOT_SYSTEMS_BRIEF.md is stale** relative to `docs/wiki/LOT-WIKI-v87.md` (QIE v54 vs. the wiki's P148/Arch50 state, "Day 1008+" vs. "Day 1073+"). Not in scope to fix today, but noted since this review surfaced it.
4. **Robot Persons™** and the Coffee→Widget→Subscription→Design System→Style→Community flow are new-to-me terms with zero footprint in this repo — cannot confirm or deny any capability changes there this run.

---

**Next run:** retry the three external fetches; if still blocked, this report will keep scoping to repo-internal state and re-flag §4.1.
