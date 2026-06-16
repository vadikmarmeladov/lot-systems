# LOT® MAIL — Session Report
**Session:** 2026-06-16 · Branch: `claude/determined-turing-2gh8em`  
**Build Status:** GREEN — Server TypeScript clean, client types clean  
**Feature:** LOT® Email System v1.0

---

## SUMMARY

Designed, developed, and deployed the simplest LOT® Email system in LOT® style.

**Compose:** `/email to Hitomi message text` in Log  
**Receive:** New messages appear in Sync  
**Read:** Full inbox at `/mail` route  
**Community:** Email button added to Cohort Dating (CohortConnectWidget)

---

## ARCHITECTURE

### Stack
- **Model:** Sequelize + PostgreSQL — `lot_emails` table (auto-sync)
- **Transport:** Server-Sent Events (SSE) — existing `/api/sync` endpoint
- **Client State:** React Query + local component state
- **Routing:** Nanostores router, new `/mail` route

### Data Flow
```
Log Editor (/log)
  → User types: /email to Hitomi hello there
  → logTriggers.ts detects 'email-send' trigger
  → NoteEditor parses recipient + body
  → POST /api/lot-emails
      → Server looks up user by first name
      → Creates lot_emails record
      → sync.emit('lot_email', payload)
          → SSE broadcast to recipient only
              → Sync.tsx shows Mail block in feed
              → Mail.tsx inbox updates in real-time
  → Log entry 'lot_email_sent' recorded in journal
```

---

## FILES CHANGED

### New Files
| File | Purpose |
|------|---------|
| `src/server/models/lot-email.ts` | Sequelize model for `lot_emails` table |
| `src/client/components/Mail.tsx` | Mail inbox/thread view component |
| `docs/benchmark/LOT-MAIL-v1.md` | This report |

### Modified Files
| File | Change |
|------|--------|
| `src/shared/types/index.ts` | Added `LotEmail`, `LotEmailEvent` types; added `lot_email` to `SyncEvents` |
| `src/shared/constants/index.ts` | Added `MAX_EMAIL_LENGTH = 2000` |
| `src/server/models/index.ts` | Registered `LotEmail` model |
| `src/server/routes/api.ts` | Added 3 endpoints + SSE routing for `lot_email` + `direct_message` |
| `src/client/stores/router.ts` | Added `mail: void` → `/mail` route |
| `src/client/queries.ts` | Added `useLotEmails`, `useSendLotEmail`, `useMarkEmailRead` |
| `src/client/utils/logTriggers.ts` | Added `email-send` trigger for `/email` and `✉️`/`📧` emojis |
| `src/client/components/Logs.tsx` | Email compose handler + result display + `lot_email_sent` log entry render |
| `src/client/components/Sync.tsx` | Mail block showing unread count + new email previews |
| `src/client/components/ui/Layout.tsx` | Added `Mail` nav button |
| `src/client/entries/app.tsx` | Added `<TabPanel route="mail"><Mail /></TabPanel>` |
| `src/client/components/CohortConnectWidget.tsx` | Added `Email` button in expanded member actions |

---

## API ENDPOINTS

### `GET /api/lot-emails`
Returns inbox + sent folders with unread count.
```json
{
  "inbox": [...LotEmailRecord],
  "sent": [...LotEmailRecord],
  "unreadCount": 2
}
```

### `POST /api/lot-emails`
Compose and send an email.
```json
{ "recipientName": "Hitomi", "body": "hello there", "subject": null }
```
Response:
```json
{ "id": "uuid", "status": "sent|queued", "message": "MAIL SENT — Hitomi...", "delivered": true }
```
- If recipient not found → status `queued`, email stored for future resolution
- If found → email delivered, SSE event fired

### `PUT /api/lot-emails/:id/read`
Marks an email as read. Only callable by the receiver.

---

## LOG COMMANDS

### `/email to [name] [message]`
Compose a LOT® Mail message from the Log terminal.

**Examples:**
```
/email to Hitomi thinking about our last conversation
/email to Vadim the patterns are shifting, wanted to share
✉️ to Hitomi quick note: the system is alive
```

**Behavior:**
1. Trigger detected → `email-send` fires
2. Regex parses: `/email to ([name]) (body...)/i`
3. Shows `MAIL: Transmitting...` in Log
4. POST to `/api/lot-emails`
5. Shows result: `MAIL SENT — Hitomi will receive your message in Sync.`
6. Journal entry created: `lot_email_sent` event

**Error states:**
- Syntax wrong: `MAIL SYNTAX — /email to [name] [message]`
- Recipient unknown: `MAIL QUEUED — [name] not found in community`
- Network error: `MAIL ERROR — Transmission failed. Check network.`

---

## SYNC INTEGRATION

When a user receives a LOT® Mail:
1. SSE event `lot_email` fires on recipient's connection
2. Sync.tsx detects it via `sync.listen('lot_email')`
3. A **Mail block** appears above the chat messages:
   ```
   Mail:   Vadim → you
           thinking about our last conversation...
   ```
4. Clicking the Mail block navigates to `/mail`

If there are unread emails in the inbox (from prior sessions):
```
Mail:   2 unread messages — open Mail
```

---

## MAIL INBOX (`/mail`)

**Tab: Inbox**
- Lists received emails (newest first)
- Unread emails shown with `●` dot indicator
- Click to open thread view

**Tab: Sent**
- Lists sent emails

**Thread View:**
```
From:   Vadim
To:     Hitomi
Date:   14:32 16/06/26
Body:   hello there, I wanted to share something...

Reply:  Open DM thread → · or type /email to Vadim in Log
```

Reply options:
- Navigate to DM thread for real-time chat
- Compose back via `/email to [sender]` in Log

---

## COHORT DATING INTEGRATION

The `CohortConnectWidget` (Cohort Dating / LOT Community) now has an **Email** button alongside "View profile" and "Send message" when a cohort member is expanded.

**Flow:**
1. User expands cohort member (e.g., Hitomi)
2. Sees: `[View profile] [Send message] [Email]`
3. Clicks **Email** → navigates to Log tab
4. Types: `/email to Hitomi ...`

This creates the **Cohort Dating → LOT Mail** connection bridge: the community suggests matches, the user reaches out via LOT® Mail.

---

## DATABASE

### `lot_emails` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `senderId` | UUID | FK → users.id |
| `receiverId` | UUID | FK → users.id |
| `recipientName` | STRING | Display name at send time |
| `subject` | STRING(500) | Optional |
| `body` | TEXT | Max 2000 chars |
| `isRead` | BOOLEAN | Default false |
| `createdAt` | DATE | |
| `updatedAt` | DATE | |

**Indexes:**
- `(receiverId, createdAt)` — inbox queries
- `(senderId, createdAt)` — sent queries

**Auto-sync:** `LotEmail.sync()` creates table if missing (non-destructive).

---

## SSE IMPROVEMENTS

**Bug Fix (side effect):** Added `direct_message` to the SSE switch statement in `/api/sync`. Previously, DM events emitted via `sync.emit('direct_message')` were dropped at the SSE switch (no `case 'direct_message'`). Now filtered and delivered to sender + receiver only.

---

## DESIGN NOTES

### LOT® Style Adherence
- All UI uses `Block` component (label + content pattern)
- `UPPERCASE TRACKING-WIDEST` for status messages in Log
- Opacity progression: 100% active, 60% secondary, 30% tertiary, 20% hint
- No decorative elements — data only
- Terminal-style command: `/email to [name] [message]`

### Simplest Viable Architecture
- No new SSE endpoint (reuses `/api/sync`)
- No separate notification system (reuses Sync feed)
- Reply via DM (reuses existing DirectMessageThread)
- Recipient lookup by first name — community-native, no email addresses

### Queued Delivery
- If recipient not found → email stored with `receiverId = senderId`
- Shows as queued in sender's Log
- Future: resolve queue when user joins (P.O.C. for now)

---

## PATTERNS

**P-MAIL-1:** LOT® Mail as signal — not notification, not inbox overload. A field message.  
**P-MAIL-2:** Compose in Log (field entry context) → receive in Sync (community context).  
**P-MAIL-3:** Cohort Dating → LOT Mail → DM. Three layers of connection depth.  
**P-MAIL-4:** Email appears in Sync as a MAIL block — not mixed with chat. Signal separation.

---

## NEXT ITERATIONS

- [ ] Subject auto-generation from body (QIE-powered)
- [ ] Queued mail resolution when recipient joins
- [ ] Reply shortcut in Mail thread (`/email to [sender]` pre-fill)
- [ ] Email notification badge on Mail nav button (unread count)
- [ ] Admin: see all community emails (moderation)
- [ ] Email search by recipient/body
- [ ] Email threading (conversation groups by sender+receiver pair)

---

*LOT® MAIL v1.0 · 2026-06-16 · claude/determined-turing-2gh8em*  
*"Signal, not noise." — LOT Systems*
