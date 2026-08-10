<!--
  LOT SYSTEMS CORPORATION
  Vadim Marmeladov — CEO, Owner LOT®
  Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
  LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
  Made in the USA | brand.lot-systems.com
-->

# LOT Email — v1

The simplest possible email system in LOT style: an addressed message, typed
as a command inside a Log entry, that appears in Sync.

## Composing

Inside any Log entry, write:

```
/email to Hitomi
```

Anything else in the same entry (before or after the command) becomes the
message body. If nothing else is written, the body defaults to `· PING ·`.
The command is evaluated against the entry's debounced (post-pause) text —
the same 7s window Logs already use for autosave — so the whole command is
captured before it sends, and editing the recipient name later re-sends to
the new name. It will not re-fire for a command that was already saved in a
prior session (same idiom `logTriggers.ts` uses for its other triggers).

## Where it appears

LOT Email does not add a parallel inbox, delivery queue, or transport. It
rides the existing Lot Chat pipe end to end:

- Same table: `chat_messages` (now with `kind: 'chat' | 'email'` and a
  nullable `recipientUserId`).
- Same real-time channel: the `chat_message` SSE event over `/sync`.
- Same UI surface: the Sync tab. An email renders with a `✉ TO <NAME>:`
  prefix so it reads as addressed mail rather than a broadcast, but — like
  everything else in Sync today — it is visible to the whole Sync room, not
  a private inbox. LOT Email is a postcard, not a sealed envelope.
- Same audit trail: a `logs` row (`event: 'email_sent'`) is written
  alongside, exactly as posting to chat already writes a `chat_message` log
  row. It renders in the Log history as a `MAIL:` block.

## Recipient resolution — "LOT Community"

There is no standalone Community directory or Cohort Dating feature in the
codebase yet (checked: no model, route, or doc references either by name).
Rather than invent one, LOT Email v1 defines "LOT Community" as the existing
membership that can already access Lot Chat — the `Usership`, `Onyx`,
`Legacy`, `RND`, and `Admin` tags (`canAccessChat` in `api.ts`). `/email to
<name>` resolves against a case-insensitive first-name match within that
membership, excluding suspended accounts and the sender.

- No match → `404` with the searched name.
- More than one match → `409`, asking the sender to be more specific (no
  silent pick of "closest" match).

This is the natural, minimal seam for future Cohort Dating work: swapping
the candidate query in `POST /api/email-messages` (`src/server/routes/
api.ts`) from "all of LOT Community" to "this user's `/cohorts` matches"
would restrict addressing to a matched cohort without touching anything
else in the pipeline. Out of scope for v1 — recorded here so the extension
point is explicit rather than rediscovered later.

## Files touched

| Concern | File |
|---|---|
| Schema | `migrations/20260810120000_add-chat-message-recipient.cjs` |
| Model | `src/server/models/chat-message.ts` |
| Shared types | `src/shared/types/index.ts` (`ChatMessage`, `PublicChatMessage`) |
| API | `src/server/routes/api.ts` (`GET /chat-messages`, `POST /email-messages`) |
| Command parsing | `src/client/components/Logs.tsx` (debounced-value effect) |
| Command registry note | `src/client/utils/logTriggers.ts` |
| Query hook | `src/client/queries.ts` (`useSendEmailMessage`) |
| Sync rendering | `src/client/components/Sync.tsx` |
| Log rendering | `src/client/components/Logs.tsx` (`event === 'email_sent'`) |

## Known limits (honest, not hidden)

- Broadcast visibility, not a private inbox — see above.
- Access gated identically to Lot Chat (Usership/Onyx/Legacy/RND/Admin) on
  both sides of the send — a member outside that tag set cannot send or
  receive LOT Email yet.
- First-name resolution only; a repo with two Community members sharing a
  first name gets a `409`, not a disambiguation UI.
- Not verified against a live Postgres instance in the session that built
  this — no database was available in that environment. Verified: the
  repo's actual build gate (`npm run build`, TypeScript + esbuild) end to
  end, and the migration follows the exact `addColumn` shape already used
  by every other migration in `migrations/`.
