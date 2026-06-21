/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { Button, ResizibleGhostInput } from '#client/components/ui'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import {
  useLotMailInbox,
  useLotMailSent,
  useSendLotMail,
  useMarkLotMailRead,
  useSearchUsersForMail,
} from '#client/queries'
import type { PublicLotMail } from '#shared/types'

// ---------------------------------------------------------------------------
// Compose Modal
// ---------------------------------------------------------------------------

interface ComposeProps {
  /** Prefilled recipient name from /email to <name> */
  prefillName?: string
  onClose: () => void
  onSent: () => void
}

export const LotMailCompose: React.FC<ComposeProps> = ({ prefillName, onClose, onSent }) => {
  const [query, setQuery] = React.useState(prefillName ?? '')
  const [selectedUser, setSelectedUser] = React.useState<{
    id: string
    firstName: string | null
    lastName: string | null
  } | null>(null)
  const [subject, setSubject] = React.useState('')
  const [body, setBody] = React.useState('')
  const [searchDebounced, setSearchDebounced] = React.useState(prefillName ?? '')

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const onQueryChange = React.useCallback((val: string) => {
    setQuery(val)
    setSelectedUser(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearchDebounced(val), 250)
  }, [])

  const { data: searchResults } = useSearchUsersForMail(
    selectedUser ? '' : searchDebounced
  )

  const { mutate: sendMail, isLoading } = useSendLotMail({
    onSuccess: () => {
      onSent()
      onClose()
    },
  })

  const canSend = !!selectedUser && body.trim().length > 0

  const onSend = React.useCallback(() => {
    if (!canSend || !selectedUser) return
    sendMail({ receiverId: selectedUser.id, subject: subject.trim() || undefined, body: body.trim() })
  }, [canSend, selectedUser, subject, body, sendMail])

  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault()
        onSend()
      }
      if (ev.key === 'Escape') onClose()
    },
    [onSend, onClose]
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-bg border border-acc/20 rounded p-24 w-full max-w-[480px] mx-16 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-20">
          <span className="text-acc/60 text-sm tracking-widest uppercase">LOT Mail</span>
          <button className="text-acc/40 hover:text-acc/80 text-sm" onClick={onClose}>
            esc
          </button>
        </div>

        {/* To field */}
        <div className="mb-12">
          <div className="text-acc/40 text-xs mb-4 uppercase tracking-wider">To</div>
          {selectedUser ? (
            <div className="flex items-center gap-8">
              <span className="text-acc">
                {[selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(' ') || 'Unknown'}
              </span>
              <button
                className="text-acc/30 text-xs hover:text-acc/60"
                onClick={() => { setSelectedUser(null); setQuery('') }}
              >
                change
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                autoFocus
                className="w-full bg-transparent text-acc border-b border-acc/20 pb-4 outline-none text-sm placeholder:text-acc/30"
                placeholder="Name..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
              />
              {searchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-bg border border-acc/20 rounded z-10">
                  {searchResults.map((u) => (
                    <button
                      key={u.id}
                      className="w-full text-left px-12 py-8 text-sm text-acc/80 hover:bg-acc/10 transition-colors"
                      onClick={() => { setSelectedUser(u); setQuery('') }}
                    >
                      {[u.firstName, u.lastName].filter(Boolean).join(' ') || 'Unknown'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subject field */}
        <div className="mb-12">
          <div className="text-acc/40 text-xs mb-4 uppercase tracking-wider">Subject</div>
          <input
            className="w-full bg-transparent text-acc border-b border-acc/20 pb-4 outline-none text-sm placeholder:text-acc/30"
            placeholder="Optional"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={200}
          />
        </div>

        {/* Body */}
        <div className="mb-20">
          <div className="text-acc/40 text-xs mb-4 uppercase tracking-wider">Message</div>
          <textarea
            className="w-full bg-transparent text-acc border border-acc/20 rounded p-8 outline-none text-sm placeholder:text-acc/30 resize-none min-h-[120px]"
            placeholder="Write your message..."
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 4000))}
            onKeyDown={onKeyDown}
            maxLength={4000}
          />
          <div className="text-acc/20 text-xs text-right mt-2">{body.length}/4000</div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-acc/30 text-xs">⌘↵ to send</span>
          <div className="flex gap-8">
            <Button kind="secondary" size="small" onClick={onClose}>Cancel</Button>
            <Button
              kind="primary"
              size="small"
              disabled={!canSend || isLoading}
              onClick={onSend}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Message Thread View
// ---------------------------------------------------------------------------

interface ThreadProps {
  mail: PublicLotMail
  onClose: () => void
  isMine: boolean
}

const LotMailThread: React.FC<ThreadProps> = ({ mail, onClose, isMine }) => {
  const { mutate: markRead } = useMarkLotMailRead()

  React.useEffect(() => {
    if (!mail.readAt && !isMine) {
      markRead(mail.id)
    }
  }, [mail.id, mail.readAt, isMine, markRead])

  const senderName = mail.sender
    ? [mail.sender.firstName, mail.sender.lastName].filter(Boolean).join(' ') || 'Unknown'
    : 'Unknown'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-bg border border-acc/20 rounded p-24 w-full max-w-[520px] mx-16 shadow-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-16 gap-12">
          <div>
            <div className="text-acc/60 text-xs uppercase tracking-wider mb-4">From</div>
            <div className="text-acc">{senderName}</div>
          </div>
          <button className="text-acc/40 hover:text-acc/80 text-sm mt-4" onClick={onClose}>esc</button>
        </div>
        {mail.subject && (
          <div className="mb-12">
            <div className="text-acc/60 text-xs uppercase tracking-wider mb-4">Subject</div>
            <div className="text-acc">{mail.subject}</div>
          </div>
        )}
        <div className="text-acc/40 text-xs mb-12">
          {dayjs(mail.createdAt).format('MMM D, YYYY · h:mm A')}
        </div>
        <div className="text-acc/80 whitespace-pre-wrap leading-relaxed border-t border-acc/10 pt-16">
          {mail.body}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inbox Row
// ---------------------------------------------------------------------------

interface InboxRowProps {
  mail: PublicLotMail
  isMine: boolean
  onClick: () => void
}

const InboxRow: React.FC<InboxRowProps> = ({ mail, isMine, onClick }) => {
  const isUnread = !isMine && !mail.readAt

  const from = mail.sender
    ? [mail.sender.firstName, mail.sender.lastName].filter(Boolean).join(' ') || 'Unknown'
    : 'Unknown'
  const to = mail.receiver
    ? [mail.receiver.firstName, mail.receiver.lastName].filter(Boolean).join(' ') || 'Unknown'
    : 'Unknown'

  return (
    <div
      className={cn(
        'flex items-start gap-12 py-8 -mx-4 px-4 rounded cursor-pointer grid-fill-hover',
        isUnread && 'text-acc'
      )}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-8 mb-2">
          <span className={cn('text-sm', isUnread ? 'text-acc' : 'text-acc/60')}>
            {isMine ? `→ ${to}` : from}
          </span>
          {isUnread && (
            <span className="w-4 h-4 rounded-full bg-acc inline-block shrink-0" />
          )}
        </div>
        {mail.subject && (
          <div className={cn('text-xs mb-1', isUnread ? 'text-acc/80' : 'text-acc/40')}>
            {mail.subject}
          </div>
        )}
        <div className={cn('text-xs truncate', isUnread ? 'text-acc/70' : 'text-acc/30')}>
          {mail.body}
        </div>
      </div>
      <div className="text-acc/30 text-xs whitespace-nowrap shrink-0 mt-1">
        {dayjs(mail.createdAt).fromNow()}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main LotMail component (Inbox + Sent tabs, embedded in Sync)
// ---------------------------------------------------------------------------

interface LotMailProps {
  /** When true, show a compact summary row instead of the full panel */
  compact?: boolean
}

export const LotMail: React.FC<LotMailProps> = ({ compact }) => {
  const me = useStore(stores.me)
  const [tab, setTab] = React.useState<'inbox' | 'sent'>('inbox')
  const [openMail, setOpenMail] = React.useState<PublicLotMail | null>(null)

  const { data: inbox = [], refetch: refetchInbox } = useLotMailInbox()
  const { data: sent = [], refetch: refetchSent } = useLotMailSent()

  const unreadCount = inbox.filter((m) => !m.readAt).length

  const messages = tab === 'inbox' ? inbox : sent

  if (compact) {
    return (
      <div className="flex items-center gap-8 text-acc/40 text-sm">
        <span>Mail</span>
        {unreadCount > 0 && (
          <span className="text-acc">{unreadCount} new</span>
        )}
      </div>
    )
  }

  return (
    <div>
      {openMail && (
        <LotMailThread
          mail={openMail}
          isMine={openMail.senderId === me?.id}
          onClose={() => {
            setOpenMail(null)
            refetchInbox()
          }}
        />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-16 mb-20">
        <button
          className={cn(
            'text-sm',
            tab === 'inbox' ? 'text-acc' : 'text-acc/40 hover:text-acc/70'
          )}
          onClick={() => setTab('inbox')}
        >
          Inbox{unreadCount > 0 && ` (${unreadCount})`}
        </button>
        <button
          className={cn(
            'text-sm',
            tab === 'sent' ? 'text-acc' : 'text-acc/40 hover:text-acc/70'
          )}
          onClick={() => setTab('sent')}
        >
          Sent
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="text-acc/30 text-sm">
          {tab === 'inbox' ? 'No messages yet.' : 'Nothing sent yet.'}
        </div>
      ) : (
        <div>
          {messages.map((m) => (
            <InboxRow
              key={m.id}
              mail={m}
              isMine={m.senderId === me?.id}
              onClick={() => setOpenMail(m)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
