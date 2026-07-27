<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Systems / Lexicon

The compression substrate. A concept earns a token only after it has appeared
in 3+ prior session reports OR been folded into doctrine twice. Until then it
stays as plain words in reports. Tokens are never deleted; superseded tokens
are marked `DEPRECATED -> <new token>`.

TOKEN     MEANING                                              REV    SINCE
-----     -------                                              ---    -----
GREEN-GATE  CHECK-B all-clear decision point (build+typecheck  A      20260719-01
            pass, proceed to report/push)
RENDER-ISOLATION  store-mutating side effects (recordSignal,   A      20260719-01
            atom.set) must run in useEffect, never in the
            render body or a bare useMemo — render-body writes
            cascade re-renders into unrelated store subscribers
            mid-paint

CANDIDATES (first/second appearance — not yet earning a token; tracked here so
a 3rd recurrence is recognized):
- SIGNAL-GAP: an interactive widget element with no corresponding
  recordSignal() call, despite WIDGETS.md documenting one (seen: SR-20260727-01)
- UNION-DRIFT: a recordSignal() call site using a source string literal not
  present in IntentionSignal['source'], invisible to any check the repo
  currently runs because client code has no gating typecheck script
  (seen: SR-20260727-01)
