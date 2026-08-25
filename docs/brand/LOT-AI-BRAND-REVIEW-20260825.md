<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT® AI Documentation & Brand Review — 2026-08-25

**Status: BLOCKED — primary sources unreachable from this environment**

## What this task was

Scheduled daily review of LOT® AI documentation and brand materials:
1. `lot-systems.com/about` — latest papers/resources
2. `brand.lot-systems.com` — LOT® Design System, COSMO® Style guidelines, brand standards
3. `institute.lot-systems.com` — first node, LOT® AI programming language / ecosystem updates
4. Coffee → Widget → Subscription → Design System → Style → Community flow and LOT® Robot Persons™ capabilities
5. Flag anything affecting current projects/integrations in this repo

## Blocker

All three domains were unreachable via direct fetch from this session:

```
lot-systems.com          → EGRESS_BLOCKED (network egress proxy)
brand.lot-systems.com    → EGRESS_BLOCKED (network egress proxy)
institute.lot-systems.com → EGRESS_BLOCKED (network egress proxy)
```

This is a network-policy block on this remote execution environment, not a transient failure — the proxy status showed no relay failures, meaning the domains are simply not on this environment's egress allowlist.

**Fix needed:** whoever configured this scheduled session's environment should add `lot-systems.com`, `brand.lot-systems.com`, and `institute.lot-systems.com` (and any other LOT-owned subdomains) to the environment's network policy allowlist so future daily runs can actually read the pages. Until then, this task can only run best-effort via web search snippets, which is not sufficient to review design-system detail, papers, or version-level changes.

## Best-effort findings (via web search only, not page fetch)

- `brand.lot-systems.com` is indexed publicly as "Usership - LOT Systems" — page exists and is live, but content could not be read (search snippets only).
- `institute.lot-systems.com` is indexed as "LOT Institute" — page exists, last indexed update noted August 2025, no further content available without direct fetch.
- No public results for "LOT® Robot Persons™," the "programming language" framing of LOT® AI, or the Coffee → Widget → Subscription → Design System → Style → Community flow. These may be newer/unindexed content only visible on the live pages themselves — cannot confirm or deny without direct access.
- No mention of "programming language," "Robot Person," or this flow exists anywhere in this repository (`LOT-Systems/LOT-Computer`) either — searched all tracked Markdown. So there is nothing yet in-repo that this would need to reconcile against.

## Impact on current repo/projects

None identified — there was nothing to compare against, since the primary sources couldn't be read. No action taken on the codebase.

## Next steps

- Allow the LOT-owned domains above in this environment's network egress policy, or run this task from a session/environment where they're reachable.
- Re-run this review once access is restored to get an actual content diff instead of a search-snippet placeholder.
