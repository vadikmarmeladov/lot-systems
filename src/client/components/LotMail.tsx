/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import { useQueryClient } from 'react-query'
import * as stores from '#client/stores'
import { Block, Button, GhostButton, ResizibleGhostInput, Tag } from '#client/components/ui'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'
import {
  useLotEmails,
  useSendLotEmail,
  useMarkLotEmailRead,
  useEmailContacts,
  LotEmailRecord,
  LotEmailContact,
} from '#client/queries'
import { sync } from '../sync'

// ────────────────────────────────────────────────────────────
// Compose panel
// ────────────────────────────────────────────────────────────

interface ComposeProps {
  initialTo?: string
  initialToId?: string
  onClose: () => void
  onSent: (email: LotEmailRecord) => void
}

const Compose: React.FC<ComposeProps> = ({ initialTo, initialToId, onClose, onSent }) => {
  const me = useStore(stores.me)
  const [toQuery, setToQuery] = React.useState(initialTo || '')
  const [selectedContact, setSelectedContact] = React.useState<LotEmailContact | null>(
    initialToId ? { id: initialToId, firstName: initialTo || null, lastName: null } : null
  )
  const [body, setBody] = React.useState('')
  const [sent, setSent] = React.useState(false)

  const { data: contactData } = useEmailContacts(!selectedContact ? toQuery : '')
  const contacts = contactData?.contacts || []

  const { mutate: send, isLoading } = useSendLotEmail({
    onSuccess: (res) => {
      setSent(true)
      setTimeout(onClose, 900)
    },
  })

  const onSelectContact = (c: LotEmailContact) => {
    setSelectedContact(c)
    setToQuery(`${c.firstName || ''} ${c.lastName || ''}`.trim())
  }

  const onSubmit = (ev?: React.FormEvent) => {
    ev?.preventDefault()
    if (!selectedContact || !body.trim()) return
    send({ receiverId: selectedContact.id, body: body.trim() })
  }

  const onKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault()
      onSubmit()
    }
  }

  if (sent) {
    return (
      <div className="opacity-60 py-4">
        <Block label="MAIL:" blockView>
          <div className="uppercase tracking-widest">Sent.</div>
        </Block>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-y-16">
      <Block label="TO:" blockView>
        <div className="relative">
          <ResizibleGhostInput
            direction="h"
            value={toQuery}
            onChange={(v) => {
              setToQuery(v)
              setSelectedContact(null)
            }}
            placeholder="Name..."
            className="w-full"
          />
          {contacts.length > 0 && !selectedContact && (
            <div className="mt-4 flex flex-col gap-y-2">
              {contacts.map((c) => (
                <GhostButton
                  key={c.id}
                  onClick={() => onSelectContact(c)}
                  className="text-left"
                >
                  {`${c.firstName || ''} ${c.lastName || ''}`.trim()}
                </GhostButton>
              ))}
            </div>
          )}
          {selectedContact && (
            <Tag className="mt-4 border-acc/40">
              {`${selectedContact.firstName || ''} ${selectedContact.lastName || ''}`.trim()}
            </Tag>
          )}
        </div>
      </Block>

      <Block label="MSG:" blockView>
        <ResizibleGhostInput
          direction="v"
          value={body}
          onChange={setBody}
          onKeyDown={onKeyDown}
          placeholder="Write your message..."
          rows={4}
          className="w-full max-w-[700px]"
        />
      </Block>

      <div className="flex items-center gap-x-8">
        <Button
          type="submit"
          kind="secondary"
          size="small"
          disabled={!selectedContact || !body.trim() || isLoading}
        >
          Send
        </Button>
        <GhostButton onClick={onClose} className="opacity-40 hover:opacity-100">
          Cancel
        </GhostButton>
      </div>
    </form>
  )
}

// ────────────────────────────────────────────────────────────
// Email row
// ────────────────────────────────────────────────────────────

const EmailRow: React.FC<{
  email: LotEmailRecord
  isTimeFormat12h: boolean
  onOpen: (e: LotEmailRecord) => void
}> = ({ email, isTimeFormat12h, onOpen }) => {
  const timeFormat = isTimeFormat12h ? 'h:mm A' : 'HH:mm'
  const date = dayjs(email.createdAt)
  const now = dayjs()
  const isPast = now.diff(date, 'day') >= 1

  const contact = email.isMine ? email.receiver : email.sender
  const contactName = contact
    ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || '—'
    : '—'

  return (
    <div
      className={cn(
        'group flex items-start gap-x-8 cursor-pointer -mx-4 px-4 py-2 rounded grid-fill-hover',
        !email.isRead && !email.isMine && 'font-medium'
      )}
      onClick={() => onOpen(email)}
    >
      <span className="whitespace-nowrap opacity-60 w-[120px] flex-shrink-0">
        {email.isMine ? `→ ${contactName}` : contactName}
      </span>
      <span
        className="flex-1 truncate"
        style={{ wordBreak: 'break-word' }}
      >
        {email.body.slice(0, 80)}
        {email.body.length > 80 ? '…' : ''}
      </span>
      {!email.isRead && !email.isMine && (
        <span className="w-[6px] h-[6px] rounded-full bg-acc self-center flex-shrink-0" />
      )}
      <span className="text-acc/40 whitespace-nowrap select-none pointer-events-none opacity-0 group-hover:opacity-100">
        {date.format(timeFormat)}
        {isPast && `, ${date.fromNow()}`}
      </span>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Email detail
// ────────────────────────────────────────────────────────────

const EmailDetail: React.FC<{
  email: LotEmailRecord
  isTimeFormat12h: boolean
  onBack: () => void
}> = ({ email, isTimeFormat12h, onBack }) => {
  const { mutate: markRead } = useMarkLotEmailRead()
  const timeFormat = isTimeFormat12h ? 'h:mm A (M/D/YY)' : 'HH:mm DD/MM/YY'

  React.useEffect(() => {
    if (!email.isRead && !email.isMine) {
      markRead({ id: email.id })
    }
  }, [email.id])

  const from = email.sender
    ? `${email.sender.firstName || ''} ${email.sender.lastName || ''}`.trim() || '—'
    : '—'
  const to = email.receiver
    ? `${email.receiver.firstName || ''} ${email.receiver.lastName || ''}`.trim() || '—'
    : '—'

  return (
    <div className="flex flex-col gap-y-16 max-w-[700px]">
      <GhostButton onClick={onBack} className="opacity-40 hover:opacity-100 self-start">
        ← Back
      </GhostButton>
      <Block label="MAIL:" blockView>
        <div className="opacity-60 mb-4">
          FROM: {from}
        </div>
        <div className="opacity-60 mb-8">
          TO: {to}
        </div>
        <div className="opacity-30 mb-16">
          {dayjs(email.createdAt).format(timeFormat)}
        </div>
        <div className="whitespace-pre-wrap leading-relaxed">
          {email.body}
        </div>
      </Block>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Main LotMail component
// ────────────────────────────────────────────────────────────

export const LotMail: React.FC<{
  initialComposeTo?: string
  initialComposeToId?: string
  onComposeClose?: () => void
}> = ({ initialComposeTo, initialComposeToId, onComposeClose }) => {
  const me = useStore(stores.me)
  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const queryClient = useQueryClient()

  const [view, setView] = React.useState<'inbox' | 'sent' | 'compose' | 'detail'>('inbox')
  const [composeTo, setComposeTo] = React.useState(initialComposeTo)
  const [composeToId, setComposeToId] = React.useState(initialComposeToId)
  const [openEmail, setOpenEmail] = React.useState<LotEmailRecord | null>(null)

  const [localInbox, setLocalInbox] = React.useState<LotEmailRecord[]>([])
  const [localSent, setLocalSent] = React.useState<LotEmailRecord[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)

  const { data } = useLotEmails()

  React.useEffect(() => {
    if (data) {
      setLocalInbox(data.inbox)
      setLocalSent(data.sent)
      setUnreadCount(data.unreadCount)
    }
  }, [data])

  // Live email delivery via SSE
  React.useEffect(() => {
    const { dispose } = sync.listen('email_received', (incoming: any) => {
      if (incoming.receiverId === me?.id) {
        // Refresh to get full email data
        queryClient.invalidateQueries(['/api/lot-emails'])
      }
    })
    return dispose
  }, [me?.id])

  // Open compose if pre-filled from Log trigger or direct link
  React.useEffect(() => {
    if (initialComposeTo || initialComposeToId || onComposeClose) {
      setView('compose')
    }
  }, [])

  const onOpenEmail = (email: LotEmailRecord) => {
    setOpenEmail(email)
    setView('detail')
    if (!email.isRead && !email.isMine) {
      setLocalInbox((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
      )
      setUnreadCount((n) => Math.max(0, n - 1))
    }
  }

  const onCompose = () => {
    setComposeTo(undefined)
    setComposeToId(undefined)
    setView('compose')
  }

  const displayedEmails = view === 'sent' ? localSent : localInbox

  return (
    <div className="max-w-[700px]">
      {/* Header — hidden in inline/compose-only mode */}
      {!onComposeClose && (
        <div className="flex items-center gap-x-16 mb-32">
          <span className="opacity-60">LOT® Mail</span>
          {unreadCount > 0 && (
            <Tag className="border-acc/40">{unreadCount}</Tag>
          )}
          <div className="flex-1" />
          <Button kind="secondary" size="small" onClick={onCompose}>
            Compose
          </Button>
        </div>
      )}

      {/* Tab bar */}
      {!onComposeClose && view !== 'compose' && view !== 'detail' && (
        <div className="flex gap-x-8 mb-24">
          <GhostButton
            className={cn(view === 'inbox' ? 'opacity-100' : 'opacity-30')}
            onClick={() => setView('inbox')}
          >
            Inbox
          </GhostButton>
          <GhostButton
            className={cn(view === 'sent' ? 'opacity-100' : 'opacity-30')}
            onClick={() => setView('sent')}
          >
            Sent
          </GhostButton>
        </div>
      )}

      {/* Views */}
      {view === 'compose' && (
        <Compose
          initialTo={composeTo}
          initialToId={composeToId}
          onClose={() => {
            if (onComposeClose) {
              onComposeClose()
            } else {
              setView('inbox')
            }
          }}
          onSent={(e) => {
            if (onComposeClose) {
              onComposeClose()
            } else {
              setLocalSent((prev) => [e, ...prev])
              setView('sent')
              queryClient.invalidateQueries(['/api/lot-emails'])
            }
          }}
        />
      )}

      {view === 'detail' && openEmail && (
        <EmailDetail
          email={openEmail}
          isTimeFormat12h={isTimeFormat12h}
          onBack={() => setView('inbox')}
        />
      )}

      {(view === 'inbox' || view === 'sent') && (
        <div>
          {displayedEmails.length === 0 ? (
            <div className="opacity-30">
              {view === 'inbox' ? 'No messages.' : 'No sent mail.'}
            </div>
          ) : (
            displayedEmails.map((e) => (
              <EmailRow
                key={e.id}
                email={e}
                isTimeFormat12h={isTimeFormat12h}
                onOpen={onOpenEmail}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
