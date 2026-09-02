<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® Brand & Documentation Digest — 2026-09-02

**Scope:** Scheduled daily review of LOT® AI documentation, brand materials, and
ecosystem changes, per the recurring task "Review LOT® AI documentation and
brand materials to stay current with the product."

## Status: Blocked — external sources unreachable

This session's network egress policy blocks all three requested domains.
Every fetch attempt returned `EGRESS_BLOCKED` from the environment's outbound
proxy (confirmed via the proxy's own status endpoint — this is a network
policy for the current remote execution environment, not a transient error
or a site outage):

| Source | Requested | Result |
|---|---|---|
| `lot-systems.com/about` | Latest papers/resources | Blocked |
| `brand.lot-systems.com` | LOT® Design System, COSMO® Style guidelines, brand standards | Blocked |
| `institute.lot-systems.com` | First node — Institute papers/resources | Blocked |

A `WebSearch` pass located `brand.lot-systems.com` in the public index (page
title: "LOT has launched a version of the crowdfunding campaign") but the
egress block prevents fetching its actual content, so nothing about the
Design System, COSMO® Style guidelines, "LOT® Robot Persons™" capabilities,
or the Coffee → Widget → Subscription → Design System → Style → Community
flow could be verified from the live sites today.

**To unblock this recurring task:** either allow outbound access to
`lot-systems.com` and its subdomains in this environment's network policy, or
run this routine from an environment/session with broader web access.

## What was checked locally instead

- Searched the repository for "Coffee → Widget → Subscription" and "LOT®
  Robot Persons™" — no file in the codebase currently defines this flow or
  term as a named concept. Matches on "Coffee"/"Widget"/"Subscription" in
  `src/client/components/About.tsx`, `System.tsx`, and `docs/corporate/`
  are unrelated (badge vocabulary, widget-mount comments, a `SubscribeWidget`
  component row) rather than the named flow itself.
- No existing doc in `docs/` mentions "Robot Person(s)" — if this is a live
  concept on the brand/institute sites, it has not yet landed in this
  repository's docs or product code.
- Reviewed `README.md` and `docs/README.md` for current product framing:
  LOT is positioned as a self-care subscription service built around the
  **Memory Engine** (AI companion with persistent "Memory Story"), the
  **Quantum Operating System (QOS)** client-side state kernel, and a
  5-provider AI vendor-independence layer (Together AI, Google Gemini,
  Mistral AI, Anthropic Claude, OpenAI GPT-4). No changes to these systems
  found today — this digest is a placeholder pending network access.

## Action items

- [ ] Grant this environment egress to `lot-systems.com`, `brand.lot-systems.com`,
      and `institute.lot-systems.com` so this daily task can actually read the
      live sites.
- [ ] Once unblocked, re-run this review to fill in: latest papers/resources,
      LOT® Design System + COSMO® Style updates, and what "LOT® Robot
      Persons™" and the Coffee → Widget → Subscription → Design System →
      Style → Community flow refer to.

No changes to current projects or integrations are flagged today — none of
the local documentation or code changed as part of this run.
