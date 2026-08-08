# LOT SYSTEMS — ASSEMBLY DOCTRINE
rev A

Distilled, stable principles for LOT-BENCHMARK sessions on this repo, written
in current lexicon notation where a token exists, in prose otherwise. Bumped
to a new revision letter when principles are meaningfully reorganized, not
on every session. Session reports remain the verbatim record; doctrine is
what's actually carried forward.

Bootstrapped 2026-08-08 (first LOT-BENCHMARK-skill run on this repo).

---

[D-001 rev A]  A route that reads back data written by a different route
               (event names, metadata keys, model fields) must verify the
               field against the actual write path before filtering on it —
               not assume it from the field's own name or from what an
               adjacent, differently-named event uses. Origin: /api/story
               filtered log entries by event === 'log_entry' || 'journal';
               POST /logs actually writes free-text journal entries as
               event: 'note'. The filter compiled, ran, returned data (moods
               and self-care notes still matched), and so the defect was
               silent — /story simply never included the operator's actual
               journal text in its own narrative, for as long as the
               feature existed. No error, no crash, just quietly wrong
               output. Recorded in LOT-SR-20260808-01 (D1).
               PROVISIONAL: seen once, not yet confirmed as a repo-wide
               pattern. If a second unrelated instance of the same shape of
               bug turns up in a future session, promote to non-provisional
               and consider it for lexicon minting once it recurs a third
               time.

---

Honest boundary, restated from SELF-ASSEMBLY.md: this file records real,
verified findings and marks speculative ones PROVISIONAL. It does not
manufacture philosophy or claim emergent language ahead of what has
actually recurred.
