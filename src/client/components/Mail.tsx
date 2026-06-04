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
import {
  Button,
  GhostButton,
  ResizibleGhostInput,
} from '#client/components/ui'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'
import {
  useMailInbox,
  useMailSent,
  useSendMail,
  useMarkMailRead,
  useCohorts,
  CohortMatch,
} from '#client/queries'
import { sync } from '../sync'
import { PublicUserMail } from '#shared/types'

// ── Compose Overlay ──────────────────────────────────────────────────────────

export const MailCompose: React.FC<{ initialTo?: string; onClose: () => void }> = ({
  initialTo = '',
  onClose,
}) => {
  const me = useStore(stores.me)
  const queryClient = useQueryClient()
  const [to, setTo] = React.useState(initialTo)
  const [subject, setSubject] = React.useState('')
  const [body, setBody] = React.useState('')
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState('')

  const { data: cohortData } = useCohorts()
  const cohortMatches: CohortMatch[] = cohortData?.matches ?? []

  const { mutate: sendMail, isLoading } = useSendMail({
    onSuccess: (data) => {
      setSent(true)
      queryClient.invalidateQueries(['/api/mail/sent'])
      setTimeout(onClose, 1200)
    },
    onError: (err: any) => {
      setError(err?.response?.data?.error || 'Failed to send')
    },
  })

  const onSend = React.useCallback(() => {
    setError('')
    if (!to.trim()) { setError('Recipient required'); return }
    if (!body.trim()) { setError('Message required'); return }
    sendMail({ recipientName: to.trim(), subject: subject.trim() || undefined, body: body.trim() })
  }, [to, subject, body, sendMail])

  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent) => {
      if (ev.key === 'Escape') onClose()
    },
    [onClose]
  )

  const suggestedRecipients = React.useMemo(
    () =>
      cohortMatches
        .filter((m) => m.user.firstName?.toLowerCase().startsWith(to.toLowerCase()) && to.length > 0)
        .slice(0, 4),
    [cohortMatches, to]
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-24 px-16 phone:px-32 tablet:px-48 desktop:px-64"
      onKeyDown={onKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bac/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Compose panel */}
      <div className="relative w-full max-w-[700px] bg-bac border border-acc/20 rounded-lg p-24 space-y-16">
        {sent ? (
          <div className="text-acc/60 py-8">Sent.</div>
        ) : (
          <>
            {/* To */}
            <div className="flex items-baseline gap-16">
              <span className="text-acc/40 w-48 shrink-0 text-right">to</span>
              <div className="flex-1">
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Name"
                  className="w-full bg-transparent outline-none text-acc placeholder:text-acc/30"
                  autoComplete="off"
                />
                {suggestedRecipients.length > 0 && (
                  <div className="flex flex-wrap gap-8 mt-8">
                    {suggestedRecipients.map((m) => (
                      <GhostButton
                        key={m.user.id}
                        className="text-acc/50 text-[0.85em]"
                        onClick={() => setTo(m.user.firstName || '')}
                      >
                        {m.user.firstName}
                        {m.user.archetype && (
                          <span className="ml-4 text-acc/30">{m.user.archetype}</span>
                        )}
                      </GhostButton>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Subject (optional) */}
            <div className="flex items-baseline gap-16">
              <span className="text-acc/40 w-48 shrink-0 text-right">re</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="subject (optional)"
                className="flex-1 bg-transparent outline-none text-acc placeholder:text-acc/30"
              />
            </div>

            {/* Body */}
            <div className="flex items-start gap-16">
              <span className="text-acc/40 w-48 shrink-0 text-right pt-1">—</span>
              <ResizibleGhostInput
                direction="vh"
                value={body}
                onChange={setBody}
                placeholder="Your message…"
                containerClassName="flex-1"
                className="min-h-[80px]"
                autoFocus
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-[#EE5959] text-sm pl-64">{error}</div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pl-64">
              <GhostButton onClick={onClose} className="text-acc/40">
                Cancel
              </GhostButton>
              <Button
                kind="secondary"
                size="small"
                onClick={onSend}
                disabled={isLoading || !body.trim() || !to.trim()}
              >
                {isLoading ? '…' : 'Send'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Mail Inbox / Sent ─────────────────────────────────────────────────────────

export const Mail: React.FC = () => {
  const me = useStore(stores.me)
  const mailCompose = useStore(stores.mailCompose)
  const queryClient = useQueryClient()
  const [view, setView] = React.useState<'inbox' | 'sent'>('inbox')
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [inboxMails, setInboxMails] = React.useState<PublicUserMail[]>([])
  const hasInitiallyLoaded = React.useRef(false)

  const { data: fetchedInbox } = useMailInbox()
  const { data: fetchedSent } = useMailSent()
  const { mutate: markRead } = useMarkMailRead()

  React.useEffect(() => {
    if (fetchedInbox && !hasInitiallyLoaded.current) {
      setInboxMails(fetchedInbox as any)
      hasInitiallyLoaded.current = true
    }
  }, [fetchedInbox])

  // Listen for incoming mail via SSE
  React.useEffect(() => {
    const { dispose } = sync.listen('mail_message', (data: PublicUserMail) => {
      if (data.recipientId !== me?.id) return
      setInboxMails((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev
        return [data, ...prev]
      })
      queryClient.invalidateQueries(['/api/mail/inbox'])
    })
    return dispose
  }, [me?.id])

  // Invalidate on mount
  React.useEffect(() => {
    queryClient.invalidateQueries(['/api/mail/inbox'])
    return () => {
      hasInitiallyLoaded.current = false
    }
  }, [])

  const sentMails = (fetchedSent ?? []) as PublicUserMail[]
  const unreadCount = inboxMails.filter((m) => !m.readAt).length

  const onOpenMail = (mail: PublicUserMail) => {
    setOpenId(openId === mail.id ? null : mail.id)
    if (!mail.readAt && mail.recipientId === me?.id) {
      markRead({ id: mail.id })
      setInboxMails((prev) =>
        prev.map((m) => (m.id === mail.id ? { ...m, readAt: new Date() } : m))
      )
    }
  }

  const displayMails = view === 'inbox' ? inboxMails : sentMails

  return (
    <div className="max-w-[700px]">
      {/* Header */}
      <div className="flex items-center gap-16 mb-80">
        <div className="flex gap-8">
          <GhostButton
            onClick={() => setView('inbox')}
            className={cn(view === 'inbox' ? 'text-acc' : 'text-acc/40')}
          >
            Inbox
            {unreadCount > 0 && (
              <span className="ml-6 text-acc/60">{unreadCount}</span>
            )}
          </GhostButton>
          <GhostButton
            onClick={() => setView('sent')}
            className={cn(view === 'sent' ? 'text-acc' : 'text-acc/40')}
          >
            Sent
          </GhostButton>
        </div>

        <div className="flex-1" />

        <Button
          kind="secondary"
          size="small"
          onClick={() => stores.mailCompose.set({ to: '' })}
        >
          Compose
        </Button>
      </div>

      {/* Mail list */}
      <div className="space-y-0">
        {displayMails.length === 0 && (
          <div className="text-acc/30">
            {view === 'inbox' ? 'No messages.' : 'Nothing sent yet.'}
          </div>
        )}

        {displayMails.map((mail) => {
          const isOpen = openId === mail.id
          const isUnread = !mail.readAt && view === 'inbox'

          const counterpart =
            view === 'inbox'
              ? mail.sender
              : mail.recipient

          const counterpartName = counterpart
            ? `${counterpart.firstName || ''} ${counterpart.lastName || ''}`.trim() || 'Unknown'
            : 'Unknown'

          return (
            <div
              key={mail.id}
              className={cn(
                'group -mx-4 px-4 py-2 cursor-pointer rounded',
                'grid-fill-hover'
              )}
              onClick={() => onOpenMail(mail)}
            >
              <div className="flex items-baseline gap-8">
                {/* Unread dot */}
                <span
                  className={cn(
                    'w-6 h-6 rounded-full shrink-0 mt-[6px]',
                    isUnread ? 'bg-acc' : 'bg-transparent'
                  )}
                />

                {/* Name */}
                <span
                  className={cn(
                    'whitespace-nowrap',
                    isUnread ? 'text-acc' : 'text-acc/60'
                  )}
                >
                  {counterpartName}
                </span>

                {/* Subject or preview */}
                <span
                  className={cn(
                    'truncate flex-1',
                    isUnread ? 'text-acc' : 'text-acc/40'
                  )}
                >
                  {mail.subject || mail.body.slice(0, 60)}
                </span>

                {/* Cohort badge */}
                {mail.cohortTag && (
                  <span className="text-acc/30 text-[0.8em] shrink-0">{mail.cohortTag}</span>
                )}

                {/* Time */}
                <span className="text-acc/30 text-[0.85em] shrink-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  {dayjs(mail.createdAt).fromNow()}
                </span>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div className="mt-8 ml-14 text-acc/70 whitespace-pre-wrap">
                  {mail.subject && (
                    <div className="text-acc/40 mb-4 text-[0.9em]">{mail.subject}</div>
                  )}
                  {mail.body}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Global compose overlay */}
      {mailCompose !== null && (
        <MailCompose
          initialTo={mailCompose.to}
          onClose={() => stores.mailCompose.set(null)}
        />
      )}
    </div>
  )
}
