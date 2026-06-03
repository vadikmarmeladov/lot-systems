/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { GhostButton } from '#client/components/ui'
import { useLotEmailInbox, useMarkLotEmailRead } from '#client/queries'
import { PublicLotEmail } from '#shared/types'
import { sync } from '../sync'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'

export const LotEmailInbox: React.FC = () => {
  const queryClient = useQueryClient()
  const { data: fetchedEmails } = useLotEmailInbox()
  const [emails, setEmails] = React.useState<PublicLotEmail[]>([])
  const [selected, setSelected] = React.useState<PublicLotEmail | null>(null)
  const hasLoaded = React.useRef(false)

  const { mutate: markRead } = useMarkLotEmailRead({
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/lot-email/unread-count'])
    },
  })

  React.useEffect(() => {
    if (fetchedEmails && !hasLoaded.current) {
      setEmails(fetchedEmails)
      hasLoaded.current = true
    }
  }, [fetchedEmails])

  React.useEffect(() => {
    queryClient.invalidateQueries(['/api/lot-email/inbox'])
    return () => { hasLoaded.current = false }
  }, [])

  // Listen for new emails via SSE
  React.useEffect(() => {
    const { dispose } = sync.listen('lot_email', (data: any) => {
      const newEmail: PublicLotEmail = {
        id: data.id,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        toHandle: data.fromName,
        subject: data.subject,
        body: data.preview,
        isRead: false,
        readAt: null,
        createdAt: data.createdAt,
        updatedAt: data.createdAt,
        from: null,
      }
      setEmails((prev) => [newEmail, ...prev])
      queryClient.invalidateQueries(['/api/lot-email/inbox'])
      queryClient.invalidateQueries(['/api/lot-email/unread-count'])
    })
    return () => dispose()
  }, [])

  const onOpen = React.useCallback(
    (email: PublicLotEmail) => {
      setSelected(email)
      if (!email.isRead) {
        markRead({ id: email.id })
        setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, isRead: true } : e))
      }
    },
    [markRead]
  )

  if (selected) {
    return <EmailDetail email={selected} onBack={() => setSelected(null)} />
  }

  if (!emails.length) {
    return (
      <div className="text-acc/30 text-sm py-4">
        No messages yet. Compose with <span className="text-acc/50">/email to Name</span> in Log.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-0">
      {emails.map((email) => (
        <EmailRow key={email.id} email={email} onClick={() => onOpen(email)} />
      ))}
    </div>
  )
}

const EmailRow: React.FC<{ email: PublicLotEmail; onClick: () => void }> = ({ email, onClick }) => {
  const fromObj = typeof email.from === 'object' ? email.from : null
  const fromName = fromObj
    ? `${fromObj.firstName || ''} ${fromObj.lastName || ''}`.trim() || email.toHandle
    : email.toHandle

  return (
    <div
      className={cn(
        'grid-fill-hover -mx-4 px-4 py-2 cursor-pointer rounded',
        'flex items-baseline gap-x-3'
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full shrink-0 mt-1.5',
          email.isRead ? 'bg-transparent' : 'bg-acc/60'
        )}
      />
      <span className={cn('w-28 shrink-0 truncate text-sm', !email.isRead && 'font-medium')}>
        {fromName}
      </span>
      <span className="flex-1 truncate text-sm text-acc/60">
        {email.subject ? (
          <>{email.subject}<span className="text-acc/30 ml-2">— {email.body.slice(0, 50)}</span></>
        ) : (
          email.body.slice(0, 60)
        )}
      </span>
      <span className="text-acc/30 text-xs shrink-0 whitespace-nowrap">
        {dayjs(email.createdAt).fromNow(true)}
      </span>
    </div>
  )
}

const EmailDetail: React.FC<{ email: PublicLotEmail; onBack: () => void }> = ({ email, onBack }) => {
  const fromObj = typeof email.from === 'object' ? email.from : null
  const fromName = fromObj
    ? `${fromObj.firstName || ''} ${fromObj.lastName || ''}`.trim() || email.toHandle
    : email.toHandle

  return (
    <div className="flex flex-col gap-y-4">
      <GhostButton onClick={onBack} className="text-acc/40 self-start -ml-1">
        ← Back
      </GhostButton>

      <div className="flex flex-col gap-y-1">
        <div className="flex items-baseline gap-x-3">
          <span className="text-acc/40 text-xs w-14 shrink-0">From</span>
          <span className="text-sm">{fromName}</span>
        </div>
        {email.subject && (
          <div className="flex items-baseline gap-x-3">
            <span className="text-acc/40 text-xs w-14 shrink-0">Subject</span>
            <span className="text-sm">{email.subject}</span>
          </div>
        )}
        <div className="flex items-baseline gap-x-3">
          <span className="text-acc/40 text-xs w-14 shrink-0">Date</span>
          <span className="text-acc/50 text-xs">
            {dayjs(email.createdAt).format('MMM D, YYYY · HH:mm')}
          </span>
        </div>
      </div>

      <div className="border-t border-acc/10 pt-4 text-sm leading-relaxed whitespace-pre-wrap">
        {email.body}
      </div>
    </div>
  )
}
