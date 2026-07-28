# LOT SYSTEMS — DOCTRINE
Distilled, stable principles written in current lexicon notation. Doctrine is
the compressing brain of the Benchmark protocol; session reports are the
verbatim record. Doctrine has a revision letter that bumps when principles
are meaningfully reorganized. See docs/assembly/LOT-LEXICON.md for token
meanings and the Benchmark skill's SELF-ASSEMBLY.md for the distillation
process.

This file was bootstrapped in LOT-SR-20260728-01 (rev A, genesis — first
clause written this session).

--------------------------------------------------------------------------------
rev A
--------------------------------------------------------------------------------

[D-001 rev A]  Render Isolation: no nanostore `.set()` call (directly, or via
               a signal-recording helper such as `recordSignal`) may execute
               inside a component's render body — including when guarded by
               a "fire once per mount" ref. It must run inside `useEffect`
               (post-paint) or an event handler. A guard ref prevents
               *repeat* writes but does not prevent the *first* write from
               happening synchronously during render, which can block first
               paint and cascade re-renders across every other subscriber of
               the same store. Applies to any widget subscribed to QIE state
               or writing QIE signals.
               Supersedes prose in SR-20260719-01 (R2: System.tsx
               quantumState useMemo->useEffect) and SR-20260728-01 (block 04:
               5-widget recordSignal-in-render recurrence).

PROVISIONAL (env facts observed this session, not yet doctrine — recorded
honestly per the skill's "earn, don't decree" rule; promote only on 2nd
independent recurrence):
  - No React.lazy()/code-splitting exists anywhere in src/client; System.tsx
    statically imports the full widget fleet into one eager JS chunk.
  - No automated test framework is wired into this repo (package.json has
    zero unit-test script).
  - badges.ts contains a real duplicate-object-key defect (two distinct
    badges both id'd "quarter_drop") — needs a user-data-safe rename, not a
    blind fix.
