/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useLotMailInbox, useMarkLotMailRead, LotMailRecord } from '#client/queries'
import { sync } from '../sync'
import { PublicLotMail } from '#shared/types'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'

export const LotMailInbox: React.FC = () => {
  const queryClient = useQueryClient()
  const [mails, setMails] = React.useState<LotMailRecord[]>([])
  const [expanded, setExpanded] = React.useState<string | null>(null)

  const { data } = useLotMailInbox()

  React.useEffect(() => {
    if (data?.mails) setMails(data.mails)
  }, [data])

  // Real-time incoming mail via SSE
  React.useEffect(() => {
    const { dispose } = sync.listen('lot_mail', (incoming: PublicLotMail) => {
      setMails((prev) => {
        if (prev.some((m) => m.id === incoming.id)) return prev
        return [
          {
            id: incoming.id,
            senderId: incoming.senderId,
            receiverId: incoming.receiverId,
            subject: incoming.subject,
            body: incoming.body,
            readAt: incoming.readAt ? String(incoming.readAt) : null,
            senderName: incoming.senderName,
            receiverName: incoming.receiverName,
            createdAt: String(incoming.createdAt),
            updatedAt: String(incoming.updatedAt),
          },
          ...prev,
        ]
      })
    })
    return dispose
  }, [])

  const unreadCount = mails.filter((m) => !m.readAt).length

  const onExpand = React.useCallback(
    (id: string) => {
      setExpanded((prev) => (prev === id ? null : id))
      const mail = mails.find((m) => m.id === id)
      if (mail && !mail.readAt) {
        setMails((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, readAt: new Date().toISOString() } : m
          )
        )
        fetch(`/api/lot-mail/${id}/read`, { method: 'POST', credentials: 'include' }).catch(() => {})
        queryClient.invalidateQueries(['/api/lot-mail/inbox'])
      }
    },
    [mails, queryClient]
  )

  if (!mails.length) return null

  return (
    <div className="mb-80">
      <div className="flex items-center gap-x-8 mb-16 opacity-40">
        <span className="font-mono text-xs uppercase tracking-widest">
          ✉ LOT® MAIL
        </span>
        {unreadCount > 0 && (
          <span className="font-mono text-xs">
            {unreadCount} UNREAD
          </span>
        )}
      </div>

      <div className="flex flex-col gap-y-2">
        {mails.map((mail) => (
          <MailRow
            key={mail.id}
            mail={mail}
            isExpanded={expanded === mail.id}
            onToggle={() => onExpand(mail.id)}
          />
        ))}
      </div>
    </div>
  )
}

const MailRow: React.FC<{
  mail: LotMailRecord
  isExpanded: boolean
  onToggle: () => void
}> = ({ mail, isExpanded, onToggle }) => {
  const isUnread = !mail.readAt
  const timeStr = dayjs(mail.createdAt).format('HH:mm')

  return (
    <div
      className={cn(
        'cursor-pointer transition-opacity',
        isUnread ? 'opacity-100' : 'opacity-40'
      )}
      onClick={onToggle}
    >
      <div className="flex items-baseline gap-x-8">
        <span className="font-mono text-xs opacity-60 shrink-0">{timeStr}</span>
        <span className="font-mono text-xs uppercase tracking-widest">
          {mail.senderName}
        </span>
        {mail.subject && (
          <>
            <span className="opacity-30">·</span>
            <span className="text-sm opacity-60 truncate">{mail.subject}</span>
          </>
        )}
        {!mail.subject && (
          <span className="text-sm opacity-40 truncate italic">
            {mail.body.slice(0, 60)}
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="mt-8 ml-[calc(3rem+8px)] font-mono text-sm opacity-60 whitespace-pre-wrap leading-relaxed">
          {mail.body}
          <div className="mt-8 opacity-40 text-xs">
            {dayjs(mail.createdAt).format('D MMM YYYY HH:mm')}
          </div>
        </div>
      )}
    </div>
  )
}
