# LOT SYSTEMS — DOCTRINE

Distilled, stable principles written in current lexicon notation (see
`LOT-LEXICON.md`). Session reports (`docs/LOT-SR-*.md` and the dated
`docs/assembly/*.md` files) are the verbatim record; this file is the
compressing brain — when a finding has proven stable across sessions, it is
folded here as a dense clause and future reports cite the clause instead of
restating the prose.

Bootstrapped 2026-08-10, revision A. No prior clauses existed under this
filename; the project's ~95 prior assembly sessions carried their findings
in prose within each dated file and in the ledger's summary column instead.
Clauses below are drawn from patterns that are unambiguous across that
history and the current live codebase, read directly rather than assumed.

```
[D-001 rev A]  On GATE: no artifact advances past GATE red. Fix-loop or
               PLAN-B (git reset --hard to last benchmark-* tag). Never a
               red push. Ground rule of every session in the ledger.

[D-002 rev A]  On ARCH/J/P: the QIE's archetype, job, and pattern ladders
               only grow — each is additive across sessions (Arch45 -> 46
               -> ... -> 51, same for J and P). A session that adds ladder
               entries must record the new ceiling in its report and ledger
               line so the next session's ORIENT step can read it forward.

[D-003 rev A]  On the Log/Story loop: LOT User data -> QIE (client-side
               inference) -> AI vendor processor (Together AI via
               #server/utils/ai-engines.ts) -> LOT personalized data stored
               (Log model, event: generated_story). /story compresses a
               PERIOD (day|week|month|year) of the operator's own record
               back into second-person narrative; it must surface both
               highs and lows, not flatten toward positivity. Established
               2026-08-10 (LOT-SR-20260810-01) when period support was
               added; previously /story only compressed a fixed ~10-entry
               recent window with no explicit period.

[D-004 rev A]  On slash commands: /system is the terse authoritative index
               of every Log-input trigger (see
               `src/client/utils/logTriggers.ts`); every new trigger added
               to that file's RULES table must get a corresponding line in
               the /system help text in the same change, or the two drift.

[D-005 rev A]  On the Arcade layer (PROVISIONAL): the badge system
               (`src/client/utils/badges.ts`, 800+ entries as of v32 Hero's
               Journey Codex) is this self-care product's gamified
               evolution track — literary/mythic "codex" arcs (Sci-Fi Word
               Turn Engine, Cyberspace Codex, Hero's Journey Codex) that
               unlock as the operator's real self-care and journaling
               behavior accrues, not as a separate game layer bolted on top.
               It sits alongside, and must not compete with, the passive
               Log/Journal UI's core promise (item 2 of the S-2 know-how:
               no prompts, no questions, the machine watches and follows up
               only on spikes/pattern changes). Marked PROVISIONAL per the
               skill's honesty rule — this is an architectural observation
               from reading the code, not a claim the two systems have been
               formally unified.
```
