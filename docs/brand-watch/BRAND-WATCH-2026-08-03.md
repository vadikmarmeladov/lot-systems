# LOT® Brand & Documentation Watch — 2026-08-03

**Scope:** Daily review of LOT® AI documentation and brand materials (lot-systems.com, brand.lot-systems.com, institute.lot-systems.com) against this repository.
**Status:** Partial — external sites unreachable from this session (see below).

---

## 1. Network access blocked

All three requested URLs failed with a hard `403 CONNECT` at the session's egress proxy — a policy denial, not a transient error:

| URL | Result |
|---|---|
| `https://lot-systems.com/about` | 403 — gateway rejected CONNECT (policy denial) |
| `https://brand.lot-systems.com` | 403 — gateway rejected CONNECT (policy denial) |
| `https://institute.lot-systems.com` | 403 — gateway rejected CONNECT (policy denial) |

Per the environment's proxy runbook, 403s of this kind mean the destination host is not on this session's egress allowlist, and the correct response is to report it rather than retry or route around it. **This will recur on every future daily run of this task until `lot-systems.com` and its subdomains (`brand.`, `institute.`) are added to the session's allowed egress hosts.** Flagging for the operator to fix at the environment/policy level.

Web search (a separate, non-proxied path) confirms the three properties are live and publicly indexed:
- `lot-systems.com` — LOT subscription service, "Memory Engine" AI self-care companion messaging
- `brand.lot-systems.com` — indexed under the title "Usership - LOT Systems"
- `institute.lot-systems.com` — indexed under the title "LOT Institute"

No page content beyond search-snippet level was retrievable — not enough to respond to items 2–4 of today's brief (Design System / COSMO® Style guidelines, feature changelog, Robot Persons™ capability updates, the Coffee → Widget → Subscription → Design System → Style → Community flow puzzle). Those remain open until direct fetch access works.

## 2. What this session could verify (from the repository)

Cross-checked against `docs/corporate/LOT-AI-PRODUCT-BRIEF.md` (v1.0, June 2026) and `docs/corporate/LOT_USA_IPO.md` — no drift found between those internal docs and what search snippets show publicly:
- Product framing ("The Curious Machine That Asks You First", Compression Loop: LOG → OBSERVE → COMPRESS → ASK → COMPRESS AGAIN) is internally consistent across the product brief and repo widget set.
- Paid tiers (R&D $15/mo, Usership $99/mo, Legacy $3,564/3yr, Admin $11,000/9yr) match between the product brief and the "Usership" page title surfaced by search for brand.lot-systems.com.
- 36 production widgets are catalogued in `docs/corporate/LOT_USA_IPO.md` §3.4; none of the widget names correspond literally to "Coffee" as a flow stage — "Coffee" only appears in this repo as a sample morning-beverage answer option in memory-engine white papers, not as a named flow step. Likely a site-only navigation label; unverifiable until the site is reachable.
- No occurrence of "Robot Persons" (trademark or otherwise) anywhere in this repository. The product brief references "LOT® Humanoid Robot" as a Story-API recipient, which may be the internal name behind the public "Robot Persons™" branding — unconfirmed without site access.

## 3. Items flagged for follow-up

1. **Egress policy** — add `lot-systems.com`, `brand.lot-systems.com`, `institute.lot-systems.com` to this session's allowed hosts so this daily task can actually read source content instead of relying on search snippets.
2. **Puzzle unsolved** — the Coffee → Widget → Subscription → Design System → Style → Community flow and current Robot Persons™ capabilities require the live site; nothing in-repo resolves them today.
3. No integration-breaking changes detected in what was reachable — nothing here currently affects active LOT-Computer projects.

---
*Compiled automatically by the scheduled LOT® brand/documentation watch task. Re-run tomorrow will retry direct site access.*
